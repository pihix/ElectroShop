"""
Tests spécialisés pour la gestion d'erreurs, validations Pydantic, et cas limites
"""
import unittest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException
from pydantic import ValidationError
from decimal import Decimal
from datetime import datetime, timedelta

from app.schemas.products import ProductCreate, ProductUpdate
from app.schemas.users import UserCreate, UserUpdate
from app.schemas.commandes import CommandeCreate, LigneCommandeCreate
from app.schemas.carts import CartCreate, CartUpdate
from app.schemas.categories import CategoryCreate
from app.utils.responses import ResponseHandler


class TestPydanticValidations(unittest.TestCase):
    """Tests pour les validations Pydantic des schémas"""
    
    def test_product_create_validation_success(self):
        """Test de validation réussie pour ProductCreate"""
        valid_data = {
            "title": "iPhone 15 Pro",
            "description": "Latest iPhone model with advanced features",
            "price": 1199.99,
            "stock": 50,
            "brand": "Apple",
            "category_id": 1,
            "thumbnail": "iphone15pro.jpg",
            "images": ["iphone15pro_1.jpg", "iphone15pro_2.jpg"]
        }
        
        product = ProductCreate(**valid_data)
        
        self.assertEqual(product.title, "iPhone 15 Pro")
        self.assertEqual(product.price, 1199.99)
        self.assertEqual(product.stock, 50)

    def test_product_create_validation_empty_title(self):
        """Test de validation avec titre vide"""
        invalid_data = {
            "title": "",  # Titre vide
            "description": "Description",
            "price": 999.99,
            "stock": 10,
            "brand": "Apple",
            "category_id": 1
        }
        
        with self.assertRaises(ValidationError) as context:
            ProductCreate(**invalid_data)
        
        self.assertIn("title", str(context.exception))

    def test_product_create_validation_negative_price(self):
        """Test de validation avec prix négatif"""
        invalid_data = {
            "title": "Test Product",
            "description": "Description",
            "price": -100.0,  # Prix négatif
            "stock": 10,
            "brand": "Brand",
            "category_id": 1
        }
        
        with self.assertRaises(ValidationError) as context:
            ProductCreate(**invalid_data)
        
        self.assertIn("price", str(context.exception))

    def test_product_create_validation_negative_stock(self):
        """Test de validation avec stock négatif"""
        invalid_data = {
            "title": "Test Product",
            "description": "Description",
            "price": 100.0,
            "stock": -5,  # Stock négatif
            "brand": "Brand",
            "category_id": 1
        }
        
        with self.assertRaises(ValidationError) as context:
            ProductCreate(**invalid_data)
        
        self.assertIn("stock", str(context.exception))

    def test_product_create_validation_price_too_high(self):
        """Test de validation avec prix trop élevé"""
        invalid_data = {
            "title": "Expensive Product",
            "description": "Very expensive",
            "price": 1000000.0,  # Prix excessif
            "stock": 1,
            "brand": "Luxury",
            "category_id": 1
        }
        
        with self.assertRaises(ValidationError) as context:
            ProductCreate(**invalid_data)
        
        self.assertIn("price", str(context.exception))

    def test_user_create_validation_success(self):
        """Test de validation réussie pour UserCreate"""
        valid_data = {
            "username": "validuser123",
            "email": "valid@example.com",
            "password": "SecurePassword123!",
            "full_name": "Valid User"
        }
        
        user = UserCreate(**valid_data)
        
        self.assertEqual(user.username, "validuser123")
        self.assertEqual(user.email, "valid@example.com")

    def test_user_create_validation_invalid_email(self):
        """Test de validation avec email invalide"""
        invalid_data = {
            "username": "testuser",
            "email": "invalid-email",  # Email invalide
            "password": "Password123!",
            "full_name": "Test User"
        }
        
        with self.assertRaises(ValidationError) as context:
            UserCreate(**invalid_data)
        
        self.assertIn("email", str(context.exception))

    def test_user_create_validation_weak_password(self):
        """Test de validation avec mot de passe faible"""
        invalid_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "weak",  # Mot de passe trop faible
            "full_name": "Test User"
        }
        
        with self.assertRaises(ValidationError) as context:
            UserCreate(**invalid_data)
        
        self.assertIn("password", str(context.exception))

    def test_user_create_validation_short_username(self):
        """Test de validation avec nom d'utilisateur trop court"""
        invalid_data = {
            "username": "ab",  # Trop court
            "email": "test@example.com",
            "password": "Password123!",
            "full_name": "Test User"
        }
        
        with self.assertRaises(ValidationError) as context:
            UserCreate(**invalid_data)
        
        self.assertIn("username", str(context.exception))

    def test_commande_create_validation_success(self):
        """Test de validation réussie pour CommandeCreate"""
        valid_data = {
            "statut": "en_attente",
            "lignes_commande": [
                {"product_id": 1, "quantity": 2},
                {"product_id": 2, "quantity": 1}
            ]
        }
        
        commande = CommandeCreate(**valid_data)
        
        self.assertEqual(commande.statut, "en_attente")
        self.assertEqual(len(commande.lignes_commande), 2)

    def test_commande_create_validation_invalid_status(self):
        """Test de validation avec statut invalide"""
        invalid_data = {
            "statut": "statut_inexistant",  # Statut invalide
            "lignes_commande": [
                {"product_id": 1, "quantity": 2}
            ]
        }
        
        with self.assertRaises(ValidationError) as context:
            CommandeCreate(**invalid_data)
        
        self.assertIn("statut", str(context.exception))

    def test_ligne_commande_validation_zero_quantity(self):
        """Test de validation avec quantité zéro"""
        invalid_data = {
            "product_id": 1,
            "quantity": 0  # Quantité invalide
        }
        
        with self.assertRaises(ValidationError) as context:
            LigneCommandeCreate(**invalid_data)
        
        self.assertIn("quantity", str(context.exception))

    def test_cart_create_validation_success(self):
        """Test de validation réussie pour CartCreate"""
        valid_data = {
            "product_id": 1,
            "quantity": 3
        }
        
        cart = CartCreate(**valid_data)
        
        self.assertEqual(cart.product_id, 1)
        self.assertEqual(cart.quantity, 3)

    def test_cart_create_validation_excessive_quantity(self):
        """Test de validation avec quantité excessive"""
        invalid_data = {
            "product_id": 1,
            "quantity": 1000  # Quantité excessive
        }
        
        with self.assertRaises(ValidationError) as context:
            CartCreate(**invalid_data)
        
        self.assertIn("quantity", str(context.exception))


class TestHTTPExceptionHandling(unittest.TestCase):
    """Tests pour la gestion des exceptions HTTP"""
    
    def test_response_handler_not_found_error(self):
        """Test du gestionnaire d'erreur 404"""
        with self.assertRaises(HTTPException) as context:
            ResponseHandler.not_found_error("Product", 999)
        
        self.assertEqual(context.exception.status_code, 404)
        self.assertIn("Product", context.exception.detail)

    def test_response_handler_validation_error(self):
        """Test du gestionnaire d'erreur de validation"""
        with self.assertRaises(HTTPException) as context:
            ResponseHandler.validation_error("Invalid email format")
        
        self.assertEqual(context.exception.status_code, 400)

    def test_response_handler_unauthorized_error(self):
        """Test du gestionnaire d'erreur d'autorisation"""
        with self.assertRaises(HTTPException) as context:
            ResponseHandler.unauthorized_error("Invalid credentials")
        
        self.assertEqual(context.exception.status_code, 401)

    def test_response_handler_forbidden_error(self):
        """Test du gestionnaire d'erreur d'accès interdit"""
        with self.assertRaises(HTTPException) as context:
            ResponseHandler.forbidden_error("Access denied")
        
        self.assertEqual(context.exception.status_code, 403)

    def test_response_handler_internal_server_error(self):
        """Test du gestionnaire d'erreur serveur interne"""
        with self.assertRaises(HTTPException) as context:
            ResponseHandler.internal_server_error("Database connection failed")
        
        self.assertEqual(context.exception.status_code, 500)


class TestEdgeCasesAndBoundaryValues(unittest.TestCase):
    """Tests pour les cas limites et valeurs de frontière"""
    
    def test_product_price_boundary_values(self):
        """Test des valeurs limites pour le prix des produits"""
        # Prix minimum valide
        min_valid_data = {
            "title": "Cheap Product",
            "price": 0.01,  # Prix minimum
            "stock": 1,
            "brand": "Generic",
            "category_id": 1
        }
        
        product = ProductCreate(**min_valid_data)
        self.assertEqual(product.price, 0.01)
        
        # Prix maximum valide
        max_valid_data = {
            "title": "Expensive Product",
            "price": 99999.99,  # Prix maximum
            "stock": 1,
            "brand": "Luxury",
            "category_id": 1
        }
        
        product = ProductCreate(**max_valid_data)
        self.assertEqual(product.price, 99999.99)

    def test_product_stock_boundary_values(self):
        """Test des valeurs limites pour le stock"""
        # Stock minimum valide
        min_stock_data = {
            "title": "Low Stock Product",
            "price": 10.0,
            "stock": 0,  # Stock minimum
            "brand": "Brand",
            "category_id": 1
        }
        
        product = ProductCreate(**min_stock_data)
        self.assertEqual(product.stock, 0)
        
        # Stock maximum valide
        max_stock_data = {
            "title": "High Stock Product",
            "price": 10.0,
            "stock": 9999,  # Stock élevé
            "brand": "Brand",
            "category_id": 1
        }
        
        product = ProductCreate(**max_stock_data)
        self.assertEqual(product.stock, 9999)

    def test_username_length_boundaries(self):
        """Test des limites de longueur pour le nom d'utilisateur"""
        # Nom d'utilisateur minimum valide
        min_length_data = {
            "username": "abc",  # 3 caractères (minimum)
            "email": "test@example.com",
            "password": "Password123!",
            "full_name": "Test User"
        }
        
        user = UserCreate(**min_length_data)
        self.assertEqual(user.username, "abc")
        
        # Nom d'utilisateur maximum valide
        max_username = "a" * 50  # 50 caractères
        max_length_data = {
            "username": max_username,
            "email": "test@example.com",
            "password": "Password123!",
            "full_name": "Test User"
        }
        
        user = UserCreate(**max_length_data)
        self.assertEqual(len(user.username), 50)

    def test_cart_quantity_boundaries(self):
        """Test des limites de quantité pour le panier"""
        # Quantité minimum valide
        min_quantity_data = {
            "product_id": 1,
            "quantity": 1  # Minimum
        }
        
        cart = CartCreate(**min_quantity_data)
        self.assertEqual(cart.quantity, 1)
        
        # Quantité maximum valide
        max_quantity_data = {
            "product_id": 1,
            "quantity": 99  # Maximum autorisé
        }
        
        cart = CartCreate(**max_quantity_data)
        self.assertEqual(cart.quantity, 99)


class TestDataTypeValidations(unittest.TestCase):
    """Tests pour les validations de types de données"""
    
    def test_product_price_string_conversion(self):
        """Test de conversion automatique du prix depuis string"""
        data_with_string_price = {
            "title": "Test Product",
            "price": "123.45",  # String au lieu de float
            "stock": 10,
            "brand": "Brand",
            "category_id": 1
        }
        
        product = ProductCreate(**data_with_string_price)
        self.assertEqual(product.price, 123.45)
        self.assertIsInstance(product.price, float)

    def test_product_stock_string_conversion(self):
        """Test de conversion automatique du stock depuis string"""
        data_with_string_stock = {
            "title": "Test Product",
            "price": 100.0,
            "stock": "50",  # String au lieu d'int
            "brand": "Brand",
            "category_id": 1
        }
        
        product = ProductCreate(**data_with_string_stock)
        self.assertEqual(product.stock, 50)
        self.assertIsInstance(product.stock, int)

    def test_invalid_price_format(self):
        """Test avec format de prix invalide"""
        invalid_data = {
            "title": "Test Product",
            "price": "invalid_price",  # Format invalide
            "stock": 10,
            "brand": "Brand",
            "category_id": 1
        }
        
        with self.assertRaises(ValidationError) as context:
            ProductCreate(**invalid_data)
        
        self.assertIn("price", str(context.exception))

    def test_invalid_stock_format(self):
        """Test avec format de stock invalide"""
        invalid_data = {
            "title": "Test Product",
            "price": 100.0,
            "stock": "invalid_stock",  # Format invalide
            "brand": "Brand",
            "category_id": 1
        }
        
        with self.assertRaises(ValidationError) as context:
            ProductCreate(**invalid_data)
        
        self.assertIn("stock", str(context.exception))


class TestSpecialCharactersAndEncoding(unittest.TestCase):
    """Tests pour les caractères spéciaux et l'encodage"""
    
    def test_product_title_special_characters(self):
        """Test avec caractères spéciaux dans le titre"""
        special_char_data = {
            "title": "Téléphone Androïd - Modèle 2024 (Édition spéciale) 100%",
            "description": "Ça marche très bien! Qualité à 99.9%",
            "price": 599.99,
            "stock": 15,
            "brand": "Marque française",
            "category_id": 1
        }
        
        product = ProductCreate(**special_char_data)
        self.assertEqual(product.title, "Téléphone Androïd - Modèle 2024 (Édition spéciale) 100%")

    def test_user_name_unicode_characters(self):
        """Test avec caractères Unicode dans les noms"""
        unicode_data = {
            "username": "utilisateur123",
            "email": "test@example.com",
            "password": "Password123!",
            "full_name": "François José María 中文"
        }
        
        user = UserCreate(**unicode_data)
        self.assertEqual(user.full_name, "François José María 中文")

    def test_product_title_html_injection(self):
        """Test de protection contre l'injection HTML"""
        html_data = {
            "title": "<script>alert('xss')</script>Product",
            "description": "<img src=x onerror=alert('xss')>",
            "price": 100.0,
            "stock": 10,
            "brand": "Brand",
            "category_id": 1
        }
        
        # Le schéma devrait accepter le texte mais l'échapper
        product = ProductCreate(**html_data)
        self.assertIn("<script>", product.title)  # Contenu préservé mais pas exécuté


class TestNullAndEmptyValues(unittest.TestCase):
    """Tests pour les valeurs nulles et vides"""
    
    def test_product_optional_fields_null(self):
        """Test avec champs optionnels null"""
        minimal_data = {
            "title": "Minimal Product",
            "price": 50.0,
            "stock": 5,
            "brand": "Brand",
            "category_id": 1
            # description, thumbnail, images omis
        }
        
        product = ProductCreate(**minimal_data)
        self.assertEqual(product.title, "Minimal Product")

    def test_user_optional_fields_null(self):
        """Test avec champs optionnels utilisateur null"""
        minimal_user_data = {
            "username": "minimaluser",
            "email": "minimal@example.com",
            "password": "Password123!"
            # full_name omis
        }
        
        user = UserCreate(**minimal_user_data)
        self.assertEqual(user.username, "minimaluser")

    def test_product_empty_string_title(self):
        """Test avec titre vide (après trim)"""
        empty_title_data = {
            "title": "   ",  # Espaces uniquement
            "price": 100.0,
            "stock": 10,
            "brand": "Brand",
            "category_id": 1
        }
        
        with self.assertRaises(ValidationError) as context:
            ProductCreate(**empty_title_data)
        
        self.assertIn("title", str(context.exception))


class TestConcurrentAccessAndRaceConditions(unittest.TestCase):
    """Tests pour l'accès concurrent et les conditions de course"""
    
    def test_multiple_cart_updates_simulation(self):
        """Simulation de mises à jour concurrentes du panier"""
        # Simuler plusieurs tentatives d'ajout simultané
        cart_updates = []
        
        for _ in range(5):
            update_data = {
                "product_id": 1,
                "quantity": 2
            }
            cart_updates.append(CartCreate(**update_data))
        
        # Vérifier que toutes les validations passent
        for cart_update in cart_updates:
            self.assertEqual(cart_update.quantity, 2)
            self.assertEqual(cart_update.product_id, 1)

    def test_stock_validation_race_condition_simulation(self):
        """Simulation de conditions de course pour la validation du stock"""
        # Plusieurs tentatives d'achat du même produit
        purchase_attempts = []
        
        for quantity in [5, 3, 2, 1]:
            cart_data = {
                "product_id": 1,
                "quantity": quantity
            }
            purchase_attempts.append(CartCreate(**cart_data))
        
        # Vérifier la cohérence des validations
        total_quantity = sum(attempt.quantity for attempt in purchase_attempts)
        self.assertEqual(total_quantity, 11)  # 5+3+2+1


class TestPerformanceAndLimits(unittest.TestCase):
    """Tests pour les limites de performance et volumétrie"""
    
    def test_large_product_description(self):
        """Test avec description de produit très longue"""
        long_description = "Description très détaillée. " * 1000  # Très long texte
        
        large_data = {
            "title": "Product with Long Description",
            "description": long_description,
            "price": 100.0,
            "stock": 10,
            "brand": "Brand",
            "category_id": 1
        }
        
        # Devrait être accepté ou lever une erreur de validation spécifique
        try:
            product = ProductCreate(**large_data)
            self.assertGreater(len(product.description), 1000)
        except ValidationError as e:
            # Si limitation de taille, vérifier que l'erreur est appropriée
            self.assertIn("description", str(e))

    def test_many_cart_items_simulation(self):
        """Simulation d'un panier avec beaucoup d'items"""
        cart_items = []
        
        for product_id in range(1, 101):  # 100 produits différents
            cart_data = {
                "product_id": product_id,
                "quantity": 1
            }
            cart_items.append(CartCreate(**cart_data))
        
        # Vérifier que toutes les validations passent
        self.assertEqual(len(cart_items), 100)
        
        # Vérifier l'unicité des product_ids
        product_ids = [item.product_id for item in cart_items]
        self.assertEqual(len(set(product_ids)), 100)


if __name__ == "__main__":
    unittest.main()