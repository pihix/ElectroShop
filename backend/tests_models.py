"""
Tests unitaires pour les modèles de données
"""
import unittest
from unittest.mock import MagicMock
from pydantic import ValidationError
from datetime import datetime

from app.models.models import User, Product, Category, Commande, LigneCommande
from app.schemas.products import ProductCreate, ProductUpdate, ProductBase
from app.schemas.auth import Signup
from app.schemas.categories import CategoryCreate
from app.schemas.commandes import CommandeCreate, LigneCommandeCreate


class TestUserModel(unittest.TestCase):
    def test_user_creation(self):
        """Test de création d'un utilisateur"""
        user = User(
            username="testuser",
            email="test@example.com",
            password="hashed_password",
            full_name="Test User",
            is_active=True,
            role="user"
        )
        
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.role, "user")
        self.assertTrue(user.is_active)

    def test_user_admin_role(self):
        """Test de création d'un utilisateur admin"""
        admin_user = User(
            username="admin",
            email="admin@example.com",
            password="hashed_password",
            full_name="Admin User",
            is_active=True,
            role="admin"
        )
        
        self.assertEqual(admin_user.role, "admin")

    def test_user_relationships(self):
        """Test des relations utilisateur-commandes"""
        user = User(
            username="testuser",
            email="test@example.com",
            password="hashed_password",
            full_name="Test User"
        )
        
        # Vérifier que la relation commandes existe
        self.assertTrue(hasattr(user, 'commandes'))
        self.assertTrue(hasattr(user, 'produits_geres'))


class TestProductModel(unittest.TestCase):
    def test_product_creation(self):
        """Test de création d'un produit"""
        product = Product(
            title="iPhone 15",
            description="Nouveau smartphone Apple",
            price=999.99,
            discount_percentage=10.0,
            rating=4.5,
            stock=50,
            brand="Apple",
            thumbnail="iphone15.jpg",
            images=["iphone15_1.jpg", "iphone15_2.jpg"],
            is_published=True,
            category_id=1
        )
        
        self.assertEqual(product.title, "iPhone 15")
        self.assertEqual(product.price, 999.99)
        self.assertEqual(product.stock, 50)
        self.assertEqual(product.brand, "Apple")
        self.assertTrue(product.is_published)

    def test_product_with_discount(self):
        """Test de produit avec remise"""
        product = Product(
            title="Produit en solde",
            description="Description",
            price=100.0,
            discount_percentage=25.0,
            rating=3.5,
            stock=10,
            brand="TestBrand",
            thumbnail="test.jpg",
            images=["test.jpg"],
            category_id=1
        )
        
        self.assertEqual(product.discount_percentage, 25.0)
        # Prix après remise devrait être 75.0
        discounted_price = product.price * (1 - product.discount_percentage / 100)
        self.assertEqual(discounted_price, 75.0)

    def test_product_relationships(self):
        """Test des relations du produit"""
        product = Product(
            title="Test Product",
            description="Description",
            price=50.0,
            stock=5,
            brand="TestBrand",
            thumbnail="test.jpg",
            images=["test.jpg"],
            category_id=1
        )
        
        # Vérifier que les relations existent
        self.assertTrue(hasattr(product, 'category'))
        self.assertTrue(hasattr(product, 'gestionnaire'))
        self.assertTrue(hasattr(product, 'lignes_commande'))


class TestCategoryModel(unittest.TestCase):
    def test_category_creation(self):
        """Test de création d'une catégorie"""
        category = Category(
            name="Smartphones",
            description="Téléphones mobiles et accessoires"
        )
        
        self.assertEqual(category.name, "Smartphones")
        self.assertEqual(category.description, "Téléphones mobiles et accessoires")

    def test_category_without_description(self):
        """Test de catégorie sans description"""
        category = Category(name="Electronics")
        
        self.assertEqual(category.name, "Electronics")
        self.assertIsNone(category.description)

    def test_category_relationships(self):
        """Test des relations de la catégorie"""
        category = Category(name="Test Category")
        
        # Vérifier que la relation products existe
        self.assertTrue(hasattr(category, 'products'))


class TestCommandeModel(unittest.TestCase):
    def test_commande_creation(self):
        """Test de création d'une commande"""
        commande = Commande(
            user_id=1,
            statut="en_attente",
            total_amount=150.50
        )
        
        self.assertEqual(commande.user_id, 1)
        self.assertEqual(commande.statut, "en_attente")
        self.assertEqual(commande.total_amount, 150.50)

    def test_commande_status_values(self):
        """Test des différents statuts de commande"""
        statuts_valides = ["en_attente", "confirmee", "expediee", "livree", "annulee"]
        
        for statut in statuts_valides:
            commande = Commande(
                user_id=1,
                statut=statut,
                total_amount=100.0
            )
            self.assertEqual(commande.statut, statut)

    def test_commande_relationships(self):
        """Test des relations de la commande"""
        commande = Commande(
            user_id=1,
            statut="en_attente",
            total_amount=100.0
        )
        
        # Vérifier que les relations existent
        self.assertTrue(hasattr(commande, 'user'))
        self.assertTrue(hasattr(commande, 'lignes_commande'))


class TestLigneCommandeModel(unittest.TestCase):
    def test_ligne_commande_creation(self):
        """Test de création d'une ligne de commande"""
        ligne = LigneCommande(
            commande_id=1,
            product_id=1,
            quantity=2,
            prix_unitaire=50.0,
            subtotal=100.0
        )
        
        self.assertEqual(ligne.commande_id, 1)
        self.assertEqual(ligne.product_id, 1)
        self.assertEqual(ligne.quantity, 2)
        self.assertEqual(ligne.prix_unitaire, 50.0)
        self.assertEqual(ligne.subtotal, 100.0)

    def test_ligne_commande_calculation(self):
        """Test du calcul du sous-total"""
        quantity = 3
        prix_unitaire = 25.99
        subtotal = quantity * prix_unitaire
        
        ligne = LigneCommande(
            commande_id=1,
            product_id=1,
            quantity=quantity,
            prix_unitaire=prix_unitaire,
            subtotal=subtotal
        )
        
        self.assertEqual(ligne.subtotal, 77.97)

    def test_ligne_commande_relationships(self):
        """Test des relations de la ligne de commande"""
        ligne = LigneCommande(
            commande_id=1,
            product_id=1,
            quantity=1,
            prix_unitaire=10.0,
            subtotal=10.0
        )
        
        # Vérifier que les relations existent
        self.assertTrue(hasattr(ligne, 'commande'))
        self.assertTrue(hasattr(ligne, 'product'))


class TestProductSchema(unittest.TestCase):
    def test_product_create_schema(self):
        """Test du schéma de création de produit"""
        product_data = {
            "id": 1,
            "title": "Test Product",
            "description": "Test Description",
            "price": 99.99,
            "discount_percentage": 15.0,
            "rating": 4.0,
            "stock": 25,
            "brand": "TestBrand",
            "thumbnail": "test.jpg",
            "images": ["test1.jpg", "test2.jpg"],
            "is_published": True,
            "category_id": 1
        }
        
        product = ProductCreate(**product_data)
        
        self.assertEqual(product.title, "Test Product")
        self.assertEqual(product.price, 99.99)
        self.assertEqual(product.stock, 25)

    def test_product_update_schema(self):
        """Test du schéma de mise à jour de produit"""
        update_data = {
            "title": "Updated Product",
            "price": 89.99,
            "stock": 30,
            "brand": "UpdatedBrand",
            "thumbnail": "updated.jpg",
            "images": ["updated1.jpg"],
            "category_id": 2
        }
        
        product_update = ProductUpdate(**update_data)
        
        self.assertEqual(product_update.title, "Updated Product")
        self.assertEqual(product_update.price, 89.99)
        self.assertEqual(product_update.stock, 30)

    def test_product_discount_validation(self):
        """Test de validation du pourcentage de remise"""
        # Test avec une remise valide
        valid_data = {
            "id": 1,
            "title": "Test",
            "price": 100.0,
            "stock": 10,
            "brand": "Test",
            "thumbnail": "test.jpg",
            "images": ["test.jpg"],
            "category_id": 1,
            "discount_percentage": 50.0  # Valide (0-100)
        }
        
        product = ProductCreate(**valid_data)
        self.assertEqual(product.discount_percentage, 50.0)


class TestAuthSchema(unittest.TestCase):
    def test_signup_schema(self):
        """Test du schéma d'inscription"""
        signup_data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword123",
            "full_name": "New User"
        }
        
        signup = Signup(**signup_data)
        
        self.assertEqual(signup.username, "newuser")
        self.assertEqual(signup.email, "newuser@example.com")
        self.assertEqual(signup.full_name, "New User")

    def test_signup_schema_validation(self):
        """Test de validation du schéma d'inscription"""
        # Test avec email invalide
        invalid_data = {
            "username": "user",
            "email": "invalid_email",  # Email invalide
            "password": "password",
            "full_name": "User"
        }
        
        with self.assertRaises(ValidationError):
            Signup(**invalid_data)


class TestCategorySchema(unittest.TestCase):
    def test_category_create_schema(self):
        """Test du schéma de création de catégorie"""
        category_data = {
            "name": "New Category",
            "description": "Category description"
        }
        
        category = CategoryCreate(**category_data)
        
        self.assertEqual(category.name, "New Category")
        self.assertEqual(category.description, "Category description")

    def test_category_create_without_description(self):
        """Test de création de catégorie sans description"""
        category_data = {
            "name": "Simple Category"
        }
        
        category = CategoryCreate(**category_data)
        
        self.assertEqual(category.name, "Simple Category")


class TestCommandeSchema(unittest.TestCase):
    def test_commande_create_schema(self):
        """Test du schéma de création de commande"""
        ligne_commande_data = {
            "product_id": 1,
            "quantity": 2
        }
        
        commande_data = {
            "statut": "en_attente",
            "lignes_commande": [ligne_commande_data]
        }
        
        commande = CommandeCreate(**commande_data)
        
        self.assertEqual(commande.statut, "en_attente")
        self.assertEqual(len(commande.lignes_commande), 1)
        self.assertEqual(commande.lignes_commande[0].product_id, 1)
        self.assertEqual(commande.lignes_commande[0].quantity, 2)

    def test_ligne_commande_create_schema(self):
        """Test du schéma de création de ligne de commande"""
        ligne_data = {
            "product_id": 5,
            "quantity": 3
        }
        
        ligne = LigneCommandeCreate(**ligne_data)
        
        self.assertEqual(ligne.product_id, 5)
        self.assertEqual(ligne.quantity, 3)


if __name__ == "__main__":
    unittest.main()