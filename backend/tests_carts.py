"""
Tests unitaires pour les services de panier
"""
import unittest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException
from datetime import datetime

from app.services.carts import CartService
from app.models.models import Cart, Product, User
from app.schemas.carts import CartCreate, CartUpdate


class TestCartService(unittest.TestCase):
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
        self.test_cart = Cart(
            id=1,
            user_id=1,
            product_id=1,
            quantity=2,
            added_at=datetime.now()
        )

    def test_get_user_cart_success(self):
        """Test de récupération du panier d'un utilisateur"""
        # Setup
        cart_items = [self.test_cart]
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = cart_items
        
        # Test
        result = CartService.get_user_cart(self.db, user_id=1)
        
        # Vérifications
        self.assertEqual(result["message"], "Cart for user 1")
        self.assertEqual(result["data"], cart_items)

    def test_get_user_cart_empty(self):
        """Test de récupération d'un panier vide"""
        # Setup
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = []
        
        # Test
        result = CartService.get_user_cart(self.db, user_id=1)
        
        # Vérifications
        self.assertEqual(result["message"], "Cart for user 1")
        self.assertEqual(result["data"], [])

    @patch('app.services.carts.ResponseHandler.create_success')
    def test_add_to_cart_new_item(self, mock_response):
        """Test d'ajout d'un nouvel item au panier"""
        # Setup
        # User exists, Product exists, No existing cart item
        self.db.query().filter().first.side_effect = [
            self.test_user,  # User exists
            self.test_product,  # Product exists  
            None  # No existing cart item
        ]
        self.db.add = MagicMock()
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_response.return_value = {"message": "Added", "data": self.test_cart}
        
        cart_data = CartCreate(
            product_id=1,
            quantity=2
        )
        
        # Test
        CartService.add_to_cart(self.db, cart_data, user_id=1)
        
        # Vérifications
        self.db.add.assert_called()
        self.db.commit.assert_called()
        mock_response.assert_called_once()

    @patch('app.services.carts.ResponseHandler.update_success')
    def test_add_to_cart_existing_item(self, mock_response):
        """Test d'ajout d'un item déjà existant dans le panier"""
        # Setup
        existing_cart = Cart(
            id=1,
            user_id=1,
            product_id=1,
            quantity=1,  # Quantité existante
            added_at=datetime.now()
        )
        
        self.db.query().filter().first.side_effect = [
            self.test_user,  # User exists
            self.test_product,  # Product exists
            existing_cart  # Existing cart item
        ]
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_response.return_value = {"message": "Updated", "data": existing_cart}
        
        cart_data = CartCreate(
            product_id=1,
            quantity=2
        )
        
        # Test
        CartService.add_to_cart(self.db, cart_data, user_id=1)
        
        # Vérifications
        self.assertEqual(existing_cart.quantity, 3)  # 1 + 2
        self.db.commit.assert_called()
        mock_response.assert_called_once()

    def test_add_to_cart_user_not_found(self):
        """Test d'ajout au panier avec utilisateur inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None  # User doesn't exist
        
        cart_data = CartCreate(
            product_id=1,
            quantity=2
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CartService.add_to_cart(self.db, cart_data, user_id=999)
        
        self.assertEqual(context.exception.status_code, 404)

    def test_add_to_cart_product_not_found(self):
        """Test d'ajout au panier avec produit inexistant"""
        # Setup
        self.db.query().filter().first.side_effect = [
            self.test_user,  # User exists
            None  # Product doesn't exist
        ]
        
        cart_data = CartCreate(
            product_id=999,
            quantity=2
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CartService.add_to_cart(self.db, cart_data, user_id=1)
        
        self.assertEqual(context.exception.status_code, 404)

    def test_add_to_cart_insufficient_stock(self):
        """Test d'ajout au panier avec stock insuffisant"""
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
            product_low_stock,  # Product with low stock
            None  # No existing cart item
        ]
        
        cart_data = CartCreate(
            product_id=1,
            quantity=5  # Quantité supérieure au stock
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CartService.add_to_cart(self.db, cart_data, user_id=1)
        
        self.assertEqual(context.exception.status_code, 400)

    @patch('app.services.carts.ResponseHandler.update_success')
    def test_update_cart_item_success(self, mock_response):
        """Test de mise à jour d'un item du panier"""
        # Setup
        self.db.query().filter().first.return_value = self.test_cart
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_response.return_value = {"message": "Updated", "data": self.test_cart}
        
        update_data = CartUpdate(
            quantity=5
        )
        
        # Test
        CartService.update_cart_item(self.db, cart_id=1, cart_data=update_data)
        
        # Vérifications
        self.assertEqual(self.test_cart.quantity, 5)
        self.db.commit.assert_called_once()
        mock_response.assert_called_once()

    @patch('app.services.carts.ResponseHandler.not_found_error')
    def test_update_cart_item_not_found(self, mock_error):
        """Test de mise à jour d'un item inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="Not found")
        
        update_data = CartUpdate(
            quantity=5
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            CartService.update_cart_item(self.db, cart_id=999, cart_data=update_data)
        
        mock_error.assert_called_once_with("Cart item", 999)

    def test_update_cart_item_zero_quantity(self):
        """Test de mise à jour avec quantité zéro (suppression)"""
        # Setup
        self.db.query().filter().first.return_value = self.test_cart
        self.db.delete = MagicMock()
        self.db.commit = MagicMock()
        
        update_data = CartUpdate(
            quantity=0
        )
        
        # Test
        result = CartService.update_cart_item(self.db, cart_id=1, cart_data=update_data)
        
        # Vérifications
        self.db.delete.assert_called_once_with(self.test_cart)
        self.db.commit.assert_called_once()
        self.assertEqual(result["message"], "Cart item removed")

    @patch('app.services.carts.ResponseHandler.delete_success')
    def test_remove_from_cart_success(self, mock_response):
        """Test de suppression d'un item du panier"""
        # Setup
        self.db.query().filter().first.return_value = self.test_cart
        self.db.delete = MagicMock()
        self.db.commit = MagicMock()
        mock_response.return_value = {"message": "Deleted", "data": self.test_cart}
        
        # Test
        CartService.remove_from_cart(self.db, cart_id=1)
        
        # Vérifications
        self.db.delete.assert_called_once_with(self.test_cart)
        self.db.commit.assert_called_once()
        mock_response.assert_called_once()

    @patch('app.services.carts.ResponseHandler.not_found_error')
    def test_remove_from_cart_not_found(self, mock_error):
        """Test de suppression d'un item inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="Not found")
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            CartService.remove_from_cart(self.db, cart_id=999)
        
        mock_error.assert_called_once_with("Cart item", 999)

    def test_clear_user_cart_success(self):
        """Test de vidage du panier d'un utilisateur"""
        # Setup
        cart_items = [self.test_cart]
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = cart_items
        
        self.db.delete = MagicMock()
        self.db.commit = MagicMock()
        
        # Test
        result = CartService.clear_user_cart(self.db, user_id=1)
        
        # Vérifications
        self.db.delete.assert_called_once_with(self.test_cart)
        self.db.commit.assert_called_once()
        self.assertEqual(result["message"], "Cart cleared for user 1")

    def test_clear_empty_cart(self):
        """Test de vidage d'un panier déjà vide"""
        # Setup
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = []
        
        self.db.delete = MagicMock()
        self.db.commit = MagicMock()
        
        # Test
        result = CartService.clear_user_cart(self.db, user_id=1)
        
        # Vérifications
        self.db.delete.assert_not_called()
        self.db.commit.assert_called_once()
        self.assertEqual(result["message"], "Cart cleared for user 1")

    def test_get_cart_total_success(self):
        """Test de calcul du total du panier"""
        # Setup
        cart_item1 = Cart(
            id=1,
            user_id=1,
            product_id=1,
            quantity=2,
            added_at=datetime.now()
        )
        cart_item2 = Cart(
            id=2,
            user_id=1,
            product_id=2,
            quantity=1,
            added_at=datetime.now()
        )
        
        product1 = Product(
            id=1,
            title="iPhone 15",
            price=999.99,
            stock=50,
            brand="Apple",
            thumbnail="iphone.jpg",
            category_id=1
        )
        product2 = Product(
            id=2,
            title="Samsung Galaxy",
            price=799.99,
            stock=30,
            brand="Samsung",
            thumbnail="samsung.jpg",
            category_id=1
        )
        
        # Mock relationships
        cart_item1.product = product1
        cart_item2.product = product2
        
        cart_items = [cart_item1, cart_item2]
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = cart_items
        
        # Test
        result = CartService.get_cart_total(self.db, user_id=1)
        
        # Vérifications
        expected_total = (2 * 999.99) + (1 * 799.99)  # 2799.97
        self.assertAlmostEqual(result["total"], expected_total, places=2)

    def test_get_cart_total_empty_cart(self):
        """Test de calcul du total d'un panier vide"""
        # Setup
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = []
        
        # Test
        result = CartService.get_cart_total(self.db, user_id=1)
        
        # Vérifications
        self.assertEqual(result["total"], 0.0)

    def test_get_cart_item_count(self):
        """Test de comptage des items dans le panier"""
        # Setup
        cart_items = [self.test_cart, self.test_cart]  # 2 items
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = cart_items
        
        # Test
        result = CartService.get_cart_item_count(self.db, user_id=1)
        
        # Vérifications
        self.assertEqual(result["count"], 2)

    def test_validate_cart_stock_availability(self):
        """Test de validation de la disponibilité du stock pour le panier"""
        # Setup
        cart_item = Cart(
            id=1,
            user_id=1,
            product_id=1,
            quantity=5,  # Quantité demandée
            added_at=datetime.now()
        )
        
        product = Product(
            id=1,
            title="iPhone 15",
            price=999.99,
            stock=3,  # Stock insuffisant
            brand="Apple",
            thumbnail="iphone.jpg",
            category_id=1
        )
        
        cart_item.product = product
        cart_items = [cart_item]
        
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = cart_items
        
        # Test
        result = CartService.validate_cart_stock(self.db, user_id=1)
        
        # Vérifications
        self.assertFalse(result["valid"])
        self.assertIn("iPhone 15", result["message"])

    def test_validate_cart_stock_sufficient(self):
        """Test de validation avec stock suffisant"""
        # Setup
        cart_item = Cart(
            id=1,
            user_id=1,
            product_id=1,
            quantity=2,  # Quantité demandée
            added_at=datetime.now()
        )
        
        product = Product(
            id=1,
            title="iPhone 15",
            price=999.99,
            stock=10,  # Stock suffisant
            brand="Apple",
            thumbnail="iphone.jpg",
            category_id=1
        )
        
        cart_item.product = product
        cart_items = [cart_item]
        
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = cart_items
        
        # Test
        result = CartService.validate_cart_stock(self.db, user_id=1)
        
        # Vérifications
        self.assertTrue(result["valid"])

    def test_transfer_cart_to_commande(self):
        """Test de transfert du panier vers une commande"""
        # Setup
        cart_items = [self.test_cart]
        mock_query = self.db.query.return_value
        mock_query.filter.return_value.all.return_value = cart_items
        
        self.db.delete = MagicMock()
        self.db.commit = MagicMock()
        
        # Test
        result = CartService.transfer_cart_to_commande(self.db, user_id=1)
        
        # Vérifications
        self.assertEqual(len(result["cart_items"]), 1)
        self.db.delete.assert_called_once()
        self.db.commit.assert_called_once()


class TestCartServiceEdgeCases(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()

    def test_add_to_cart_negative_quantity(self):
        """Test d'ajout au panier avec quantité négative"""
        # Setup
        user = User(id=1, username="test", email="test@test.com")
        product = Product(id=1, title="Test", price=10.0, stock=5)
        
        self.db.query().filter().first.side_effect = [user, product, None]
        
        cart_data = CartCreate(
            product_id=1,
            quantity=-1  # Quantité négative
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CartService.add_to_cart(self.db, cart_data, user_id=1)
        
        self.assertEqual(context.exception.status_code, 400)

    def test_update_cart_item_negative_quantity(self):
        """Test de mise à jour avec quantité négative"""
        # Setup
        cart_item = Cart(id=1, user_id=1, product_id=1, quantity=1)
        self.db.query().filter().first.return_value = cart_item
        
        update_data = CartUpdate(
            quantity=-1  # Quantité négative
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            CartService.update_cart_item(self.db, cart_id=1, cart_data=update_data)
        
        self.assertEqual(context.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()