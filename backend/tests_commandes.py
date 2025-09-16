"""
Tests unitaires pour les services de commandes et panier
"""
import unittest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from app.services.commandes import CommandeService
from app.models.models import Commande, LigneCommande, Product, User
from app.schemas.commandes import CommandeCreate, LigneCommandeCreate, CommandeUpdate


class TestCommandeService(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
        self.test_user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            password="hashed_password",
            full_name="Test User",
            is_active=True,
            role="user"
        )
        self.test_product = Product(
            id=1,
            title="iPhone 15",
            description="Smartphone Apple",
            price=999.99,
            stock=50,
            brand="Apple",
            thumbnail="iphone.jpg",
            images=["iphone.jpg"],
            category_id=1
        )
        self.test_ligne_commande = LigneCommande(
            id=1,
            commande_id=1,
            product_id=1,
            quantity=2,
            prix_unitaire=999.99,
            subtotal=1999.98
        )
        self.test_commande = Commande(
            id=1,
            user_id=1,
            statut="en_attente",
            total_amount=1999.98
        )

    def test_get_all_commandes_success(self):
        """Test de récupération de toutes les commandes"""
        # Setup
        commandes_list = [self.test_commande]
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.limit.return_value.offset.return_value.all.return_value = commandes_list
        
        # Test
        result = CommandeService.get_all_commandes(self.db, page=1, limit=10)
        
        # Vérifications
        self.assertEqual(result["message"], "Page 1 with 10 commandes")
        self.assertEqual(result["data"], commandes_list)

    def test_get_commandes_by_user_success(self):
        """Test de récupération des commandes d'un utilisateur"""
        # Setup
        user_commandes = [self.test_commande]
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.order_by.return_value.limit.return_value.offset.return_value.all.return_value = user_commandes
        
        # Test
        result = CommandeService.get_commandes_by_user(self.db, user_id=1, page=1, limit=10)
        
        # Vérifications
        self.assertEqual(result["message"], "Page 1 with 10 commandes for user 1")
        self.assertEqual(result["data"], user_commandes)

    @patch('app.services.commandes.ResponseHandler.get_single_success')
    def test_get_commande_success(self, mock_response):
        """Test de récupération d'une commande par ID"""
        # Setup
        self.db.query().filter().first.return_value = self.test_commande
        mock_response.return_value = {"message": "success", "data": self.test_commande}
        
        # Test
        CommandeService.get_commande(self.db, 1)
        
        # Vérifications
        self.db.query.assert_called_once_with(Commande)
        mock_response.assert_called_once_with("Commande", 1, self.test_commande)

    @patch('app.services.commandes.ResponseHandler.not_found_error')
    def test_get_commande_not_found(self, mock_error):
        """Test de récupération d'une commande inexistante"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="Not found")
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            CommandeService.get_commande(self.db, 999)
        
        mock_error.assert_called_once_with("Commande", 999)

    @patch('app.services.commandes.ResponseHandler.create_success')
    def test_create_commande_success(self, mock_response):
        """Test de création d'une commande"""
        # Setup
        # Mock pour vérifier que l'utilisateur existe
        self.db.query().filter().first.side_effect = [
            self.test_user,  # User exists
            self.test_product  # Product exists for ligne_commande
        ]
        self.db.add = MagicMock()
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_response.return_value = {"message": "Created", "data": self.test_commande}
        
        ligne_commande_data = LigneCommandeCreate(
            product_id=1,
            quantity=2
        )
        
        commande_data = CommandeCreate(
            statut="en_attente",
            lignes_commande=[ligne_commande_data]
        )
        
        # Test
        CommandeService.create_commande(self.db, commande_data, user_id=1)
        
        # Vérifications
        self.db.add.assert_called()
        self.db.commit.assert_called()

    def test_create_commande_user_not_found(self):
        """Test de création d'une commande avec un utilisateur inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None  # User doesn't exist
        
        ligne_commande_data = LigneCommandeCreate(
            product_id=1,
            quantity=2
        )
        
        commande_data = CommandeCreate(
            statut="en_attente",
            lignes_commande=[ligne_commande_data]
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CommandeService.create_commande(self.db, commande_data, user_id=999)
        
        self.assertEqual(context.exception.status_code, 404)

    def test_create_commande_product_not_found(self):
        """Test de création d'une commande avec un produit inexistant"""
        # Setup
        self.db.query().filter().first.side_effect = [
            self.test_user,  # User exists
            None  # Product doesn't exist
        ]
        
        ligne_commande_data = LigneCommandeCreate(
            product_id=999,  # Produit inexistant
            quantity=2
        )
        
        commande_data = CommandeCreate(
            statut="en_attente",
            lignes_commande=[ligne_commande_data]
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CommandeService.create_commande(self.db, commande_data, user_id=1)
        
        self.assertEqual(context.exception.status_code, 404)

    def test_create_commande_insufficient_stock(self):
        """Test de création d'une commande avec stock insuffisant"""
        # Setup
        product_low_stock = Product(
            id=1,
            title="iPhone 15",
            price=999.99,
            stock=1,  # Stock insuffisant
            brand="Apple",
            thumbnail="iphone.jpg",
            images=["iphone.jpg"],
            category_id=1
        )
        
        self.db.query().filter().first.side_effect = [
            self.test_user,  # User exists
            product_low_stock  # Product with low stock
        ]
        
        ligne_commande_data = LigneCommandeCreate(
            product_id=1,
            quantity=5  # Quantité supérieure au stock
        )
        
        commande_data = CommandeCreate(
            statut="en_attente",
            lignes_commande=[ligne_commande_data]
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CommandeService.create_commande(self.db, commande_data, user_id=1)
        
        self.assertEqual(context.exception.status_code, 400)

    def test_create_commande_calculates_total(self):
        """Test que le total de la commande est calculé correctement"""
        # Setup
        self.db.query().filter().first.side_effect = [
            self.test_user,  # User exists
            self.test_product  # Product exists
        ]
        
        created_commande = None
        
        def capture_commande(commande):
            nonlocal created_commande
            created_commande = commande
        
        self.db.add.side_effect = capture_commande
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        ligne_commande_data = LigneCommandeCreate(
            product_id=1,
            quantity=2
        )
        
        commande_data = CommandeCreate(
            statut="en_attente",
            lignes_commande=[ligne_commande_data]
        )
        
        # Test
        CommandeService.create_commande(self.db, commande_data, user_id=1)
        
        # Vérifications
        # Le total devrait être 2 * 999.99 = 1999.98
        expected_total = 2 * 999.99
        self.assertAlmostEqual(created_commande.total_amount, expected_total, places=2)

    @patch('app.services.commandes.ResponseHandler.update_success')
    def test_update_commande_status_success(self, mock_response):
        """Test de mise à jour du statut d'une commande"""
        # Setup
        self.db.query().filter().first.return_value = self.test_commande
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_response.return_value = {"message": "Updated", "data": self.test_commande}
        
        update_data = CommandeUpdate(
            statut="confirmee"
        )
        
        # Test
        CommandeService.update_commande(self.db, 1, update_data)
        
        # Vérifications
        self.assertEqual(self.test_commande.statut, "confirmee")
        self.db.commit.assert_called_once()
        mock_response.assert_called_once()

    @patch('app.services.commandes.ResponseHandler.not_found_error')
    def test_update_commande_not_found(self, mock_error):
        """Test de mise à jour d'une commande inexistante"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="Commande not found")
        
        update_data = CommandeUpdate(
            statut="confirmee"
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            CommandeService.update_commande(self.db, 999, update_data)
        
        mock_error.assert_called_once_with("Commande", 999)

    def test_cancel_commande_success(self):
        """Test d'annulation d'une commande"""
        # Setup
        self.db.query().filter().first.return_value = self.test_commande
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        # Test
        CommandeService.cancel_commande(self.db, 1)
        
        # Vérifications
        self.assertEqual(self.test_commande.statut, "annulee")
        self.db.commit.assert_called_once()

    def test_cancel_commande_already_shipped(self):
        """Test d'annulation d'une commande déjà expédiée"""
        # Setup
        shipped_commande = Commande(
            id=1,
            user_id=1,
            statut="expediee",
            total_amount=1999.98
        )
        self.db.query().filter().first.return_value = shipped_commande
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CommandeService.cancel_commande(self.db, 1)
        
        self.assertEqual(context.exception.status_code, 400)

    @patch('app.services.commandes.ResponseHandler.delete_success')
    def test_delete_commande_success(self, mock_response):
        """Test de suppression d'une commande"""
        # Setup
        self.db.query().filter().first.return_value = self.test_commande
        self.db.delete = MagicMock()
        self.db.commit = MagicMock()
        mock_response.return_value = {"message": "Deleted", "data": self.test_commande}
        
        # Test
        CommandeService.delete_commande(self.db, 1)
        
        # Vérifications
        self.db.delete.assert_called_once_with(self.test_commande)
        self.db.commit.assert_called_once()
        mock_response.assert_called_once()

    def test_get_commande_total_calculation(self):
        """Test du calcul du total d'une commande avec plusieurs lignes"""
        # Setup
        ligne1 = LigneCommande(
            id=1,
            commande_id=1,
            product_id=1,
            quantity=2,
            prix_unitaire=100.0,
            subtotal=200.0
        )
        ligne2 = LigneCommande(
            id=2,
            commande_id=1,
            product_id=2,
            quantity=1,
            prix_unitaire=50.0,
            subtotal=50.0
        )
        
        commande_with_lines = Commande(
            id=1,
            user_id=1,
            statut="en_attente",
            total_amount=0.0
        )
        commande_with_lines.lignes_commande = [ligne1, ligne2]
        
        # Test
        total = CommandeService.calculate_commande_total(commande_with_lines)
        
        # Vérifications
        self.assertEqual(total, 250.0)  # 200.0 + 50.0

    def test_get_commandes_by_status(self):
        """Test de récupération des commandes par statut"""
        # Setup
        commandes_en_attente = [self.test_commande]
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.order_by.return_value.all.return_value = commandes_en_attente
        
        # Test
        result = CommandeService.get_commandes_by_status(self.db, "en_attente")
        
        # Vérifications
        self.assertEqual(result, commandes_en_attente)

    def test_get_user_order_history(self):
        """Test de récupération de l'historique des commandes d'un utilisateur"""
        # Setup
        user_commandes = [self.test_commande]
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.order_by.return_value.all.return_value = user_commandes
        
        # Test
        result = CommandeService.get_user_order_history(self.db, user_id=1)
        
        # Vérifications
        self.assertEqual(result, user_commandes)

    def test_add_product_to_commande(self):
        """Test d'ajout d'un produit à une commande existante"""
        # Setup
        self.db.query().filter().first.side_effect = [
            self.test_commande,  # Commande exists
            self.test_product    # Product exists
        ]
        self.db.add = MagicMock()
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        # Test
        CommandeService.add_product_to_commande(self.db, commande_id=1, product_id=1, quantity=1)
        
        # Vérifications
        self.db.add.assert_called()
        self.db.commit.assert_called()

    def test_remove_product_from_commande(self):
        """Test de suppression d'un produit d'une commande"""
        # Setup
        self.db.query().filter().first.return_value = self.test_ligne_commande
        self.db.delete = MagicMock()
        self.db.commit = MagicMock()
        
        # Test
        CommandeService.remove_product_from_commande(self.db, commande_id=1, product_id=1)
        
        # Vérifications
        self.db.delete.assert_called_once_with(self.test_ligne_commande)
        self.db.commit.assert_called_once()


class TestCommandeServiceEdgeCases(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()

    def test_create_commande_empty_lines(self):
        """Test de création d'une commande sans lignes de commande"""
        # Setup
        user = User(id=1, username="test", email="test@test.com")
        self.db.query().filter().first.return_value = user
        
        commande_data = CommandeCreate(
            statut="en_attente",
            lignes_commande=[]  # Aucune ligne de commande
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CommandeService.create_commande(self.db, commande_data, user_id=1)
        
        self.assertEqual(context.exception.status_code, 400)

    def test_update_commande_invalid_status_transition(self):
        """Test de mise à jour avec une transition de statut invalide"""
        # Setup
        delivered_commande = Commande(
            id=1,
            user_id=1,
            statut="livree",
            total_amount=100.0
        )
        self.db.query().filter().first.return_value = delivered_commande
        
        update_data = CommandeUpdate(
            statut="en_attente"  # Transition invalide
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CommandeService.update_commande(self.db, 1, update_data)
        
        self.assertEqual(context.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()