"""
Tests d'intégration pour toutes les routes de l'API ElectroShop
"""
import unittest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import json
from datetime import datetime, timedelta

from app.main import app
from app.models.models import User, Product, Category, Commande, Cart
from app.core.security import create_access_token


class BaseAPITest(unittest.TestCase):
    """Classe de base pour les tests d'API"""
    
    def setUp(self):
        self.client = TestClient(app)
        self.test_user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPassword123!",
            "full_name": "Test User"
        }
        self.test_admin_data = {
            "username": "admin",
            "email": "admin@example.com",
            "password": "AdminPassword123!",
            "full_name": "Admin User",
            "role": "admin"
        }
        
        # Créer des tokens JWT pour les tests
        self.user_token = create_access_token(
            data={"sub": "testuser", "role": "user", "user_id": 1}
        )
        self.admin_token = create_access_token(
            data={"sub": "admin", "role": "admin", "user_id": 2}
        )
        
        self.user_headers = {"Authorization": f"Bearer {self.user_token}"}
        self.admin_headers = {"Authorization": f"Bearer {self.admin_token}"}


class TestAuthRoutes(BaseAPITest):
    """Tests pour les routes d'authentification"""
    
    @patch('app.services.auth.AuthService.signup')
    def test_signup_success(self, mock_signup):
        """Test d'inscription réussie"""
        mock_signup.return_value = {
            "message": "User created successfully",
            "data": {"id": 1, "username": "testuser", "email": "test@example.com"}
        }
        
        response = self.client.post("/auth/signup", json=self.test_user_data)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        mock_signup.assert_called_once()

    @patch('app.services.auth.AuthService.signup')
    def test_signup_duplicate_email(self, mock_signup):
        """Test d'inscription avec email déjà existant"""
        from fastapi import HTTPException
        mock_signup.side_effect = HTTPException(status_code=400, detail="Email already exists")
        
        response = self.client.post("/auth/signup", json=self.test_user_data)
        
        self.assertEqual(response.status_code, 400)

    @patch('app.services.auth.AuthService.login')
    def test_login_success(self, mock_login):
        """Test de connexion réussie"""
        mock_login.return_value = {
            "access_token": "fake_token",
            "token_type": "bearer",
            "user_info": {"id": 1, "username": "testuser", "role": "user"}
        }
        
        login_data = {
            "username": "testuser",
            "password": "TestPassword123!"
        }
        
        response = self.client.post("/auth/login", data=login_data)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json())
        mock_login.assert_called_once()

    @patch('app.services.auth.AuthService.login')
    def test_login_invalid_credentials(self, mock_login):
        """Test de connexion avec identifiants invalides"""
        from fastapi import HTTPException
        mock_login.side_effect = HTTPException(status_code=401, detail="Invalid credentials")
        
        login_data = {
            "username": "testuser",
            "password": "wrongpassword"
        }
        
        response = self.client.post("/auth/login", data=login_data)
        
        self.assertEqual(response.status_code, 401)

    def test_logout_success(self):
        """Test de déconnexion"""
        response = self.client.post("/auth/logout", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())

    def test_logout_without_token(self):
        """Test de déconnexion sans token"""
        response = self.client.post("/auth/logout")
        
        self.assertEqual(response.status_code, 401)


class TestProductRoutes(BaseAPITest):
    """Tests pour les routes des produits"""
    
    @patch('app.services.products.ProductService.get_all_products')
    def test_get_products_success(self, mock_get_products):
        """Test de récupération des produits"""
        mock_products = [
            {"id": 1, "title": "iPhone 15", "price": 999.99, "stock": 50},
            {"id": 2, "title": "Samsung Galaxy", "price": 799.99, "stock": 30}
        ]
        mock_get_products.return_value = {
            "message": "Products retrieved",
            "data": mock_products
        }
        
        response = self.client.get("/products/")
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", response.json())
        mock_get_products.assert_called_once()

    @patch('app.services.products.ProductService.get_product')
    def test_get_product_by_id_success(self, mock_get_product):
        """Test de récupération d'un produit par ID"""
        mock_product = {"id": 1, "title": "iPhone 15", "price": 999.99}
        mock_get_product.return_value = {
            "message": "Product found",
            "data": mock_product
        }
        
        response = self.client.get("/products/1")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"]["id"], 1)
        mock_get_product.assert_called_once_with(mock_get_product.call_args[0][0], 1)

    @patch('app.services.products.ProductService.get_product')
    def test_get_product_not_found(self, mock_get_product):
        """Test de récupération d'un produit inexistant"""
        from fastapi import HTTPException
        mock_get_product.side_effect = HTTPException(status_code=404, detail="Product not found")
        
        response = self.client.get("/products/999")
        
        self.assertEqual(response.status_code, 404)

    @patch('app.services.products.ProductService.create_product')
    def test_create_product_success(self, mock_create_product):
        """Test de création d'un produit (admin uniquement)"""
        product_data = {
            "title": "New iPhone",
            "description": "Latest iPhone model",
            "price": 1099.99,
            "stock": 100,
            "brand": "Apple",
            "category_id": 1,
            "thumbnail": "iphone.jpg",
            "images": ["iphone.jpg"]
        }
        
        mock_create_product.return_value = {
            "message": "Product created",
            "data": {"id": 1, **product_data}
        }
        
        response = self.client.post("/products/", json=product_data, headers=self.admin_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_create_product.assert_called_once()

    def test_create_product_unauthorized(self):
        """Test de création d'un produit sans droits admin"""
        product_data = {
            "title": "New iPhone",
            "price": 1099.99,
            "stock": 100
        }
        
        response = self.client.post("/products/", json=product_data, headers=self.user_headers)
        
        self.assertEqual(response.status_code, 403)

    @patch('app.services.products.ProductService.update_product')
    def test_update_product_success(self, mock_update_product):
        """Test de mise à jour d'un produit"""
        update_data = {
            "title": "Updated iPhone",
            "price": 899.99
        }
        
        mock_update_product.return_value = {
            "message": "Product updated",
            "data": {"id": 1, **update_data}
        }
        
        response = self.client.put("/products/1", json=update_data, headers=self.admin_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_update_product.assert_called_once()

    @patch('app.services.products.ProductService.delete_product')
    def test_delete_product_success(self, mock_delete_product):
        """Test de suppression d'un produit"""
        mock_delete_product.return_value = {
            "message": "Product deleted",
            "data": {"id": 1}
        }
        
        response = self.client.delete("/products/1", headers=self.admin_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_delete_product.assert_called_once()


class TestCategoryRoutes(BaseAPITest):
    """Tests pour les routes des catégories"""
    
    @patch('app.services.categories.CategoryService.get_all_categories')
    def test_get_categories_success(self, mock_get_categories):
        """Test de récupération des catégories"""
        mock_categories = [
            {"id": 1, "name": "Smartphones", "description": "Mobile phones"},
            {"id": 2, "name": "Laptops", "description": "Portable computers"}
        ]
        mock_get_categories.return_value = {
            "message": "Categories retrieved",
            "data": mock_categories
        }
        
        response = self.client.get("/categories/")
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", response.json())
        mock_get_categories.assert_called_once()

    @patch('app.services.categories.CategoryService.create_category')
    def test_create_category_success(self, mock_create_category):
        """Test de création d'une catégorie"""
        category_data = {
            "name": "Tablets",
            "description": "Tablet devices"
        }
        
        mock_create_category.return_value = {
            "message": "Category created",
            "data": {"id": 1, **category_data}
        }
        
        response = self.client.post("/categories/", json=category_data, headers=self.admin_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_create_category.assert_called_once()


class TestCartRoutes(BaseAPITest):
    """Tests pour les routes du panier"""
    
    @patch('app.services.carts.CartService.get_user_cart')
    def test_get_cart_success(self, mock_get_cart):
        """Test de récupération du panier"""
        mock_cart_items = [
            {"id": 1, "product_id": 1, "quantity": 2, "user_id": 1}
        ]
        mock_get_cart.return_value = {
            "message": "Cart retrieved",
            "data": mock_cart_items
        }
        
        response = self.client.get("/carts/", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_get_cart.assert_called_once()

    @patch('app.services.carts.CartService.add_to_cart')
    def test_add_to_cart_success(self, mock_add_to_cart):
        """Test d'ajout au panier"""
        cart_data = {
            "product_id": 1,
            "quantity": 2
        }
        
        mock_add_to_cart.return_value = {
            "message": "Added to cart",
            "data": {"id": 1, **cart_data, "user_id": 1}
        }
        
        response = self.client.post("/carts/", json=cart_data, headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_add_to_cart.assert_called_once()

    def test_add_to_cart_unauthorized(self):
        """Test d'ajout au panier sans authentification"""
        cart_data = {
            "product_id": 1,
            "quantity": 2
        }
        
        response = self.client.post("/carts/", json=cart_data)
        
        self.assertEqual(response.status_code, 401)

    @patch('app.services.carts.CartService.update_cart_item')
    def test_update_cart_item_success(self, mock_update_cart):
        """Test de mise à jour d'un item du panier"""
        update_data = {
            "quantity": 5
        }
        
        mock_update_cart.return_value = {
            "message": "Cart updated",
            "data": {"id": 1, "quantity": 5}
        }
        
        response = self.client.put("/carts/1", json=update_data, headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_update_cart.assert_called_once()

    @patch('app.services.carts.CartService.remove_from_cart')
    def test_remove_from_cart_success(self, mock_remove_from_cart):
        """Test de suppression d'un item du panier"""
        mock_remove_from_cart.return_value = {
            "message": "Item removed from cart",
            "data": {"id": 1}
        }
        
        response = self.client.delete("/carts/1", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_remove_from_cart.assert_called_once()

    @patch('app.services.carts.CartService.clear_user_cart')
    def test_clear_cart_success(self, mock_clear_cart):
        """Test de vidage du panier"""
        mock_clear_cart.return_value = {
            "message": "Cart cleared"
        }
        
        response = self.client.delete("/carts/clear", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_clear_cart.assert_called_once()


class TestCommandeRoutes(BaseAPITest):
    """Tests pour les routes des commandes"""
    
    @patch('app.services.commandes.CommandeService.get_commandes_by_user')
    def test_get_user_commandes_success(self, mock_get_commandes):
        """Test de récupération des commandes utilisateur"""
        mock_commandes = [
            {"id": 1, "user_id": 1, "statut": "en_attente", "total_amount": 999.99}
        ]
        mock_get_commandes.return_value = {
            "message": "User commandes",
            "data": mock_commandes
        }
        
        response = self.client.get("/commandes/", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_get_commandes.assert_called_once()

    @patch('app.services.commandes.CommandeService.create_commande')
    def test_create_commande_success(self, mock_create_commande):
        """Test de création d'une commande"""
        commande_data = {
            "statut": "en_attente",
            "lignes_commande": [
                {"product_id": 1, "quantity": 2}
            ]
        }
        
        mock_create_commande.return_value = {
            "message": "Commande created",
            "data": {"id": 1, **commande_data, "user_id": 1}
        }
        
        response = self.client.post("/commandes/", json=commande_data, headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_create_commande.assert_called_once()

    @patch('app.services.commandes.CommandeService.get_commande')
    def test_get_commande_by_id_success(self, mock_get_commande):
        """Test de récupération d'une commande par ID"""
        mock_commande = {"id": 1, "user_id": 1, "statut": "en_attente"}
        mock_get_commande.return_value = {
            "message": "Commande found",
            "data": mock_commande
        }
        
        response = self.client.get("/commandes/1", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_get_commande.assert_called_once()

    @patch('app.services.commandes.CommandeService.update_commande')
    def test_update_commande_status_success(self, mock_update_commande):
        """Test de mise à jour du statut d'une commande (admin)"""
        update_data = {
            "statut": "confirmee"
        }
        
        mock_update_commande.return_value = {
            "message": "Commande updated",
            "data": {"id": 1, "statut": "confirmee"}
        }
        
        response = self.client.put("/commandes/1", json=update_data, headers=self.admin_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_update_commande.assert_called_once()

    @patch('app.services.commandes.CommandeService.cancel_commande')
    def test_cancel_commande_success(self, mock_cancel_commande):
        """Test d'annulation d'une commande"""
        mock_cancel_commande.return_value = {
            "message": "Commande cancelled",
            "data": {"id": 1, "statut": "annulee"}
        }
        
        response = self.client.post("/commandes/1/cancel", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_cancel_commande.assert_called_once()


class TestUserRoutes(BaseAPITest):
    """Tests pour les routes des utilisateurs"""
    
    @patch('app.services.users.UserService.get_user_profile')
    def test_get_user_profile_success(self, mock_get_profile):
        """Test de récupération du profil utilisateur"""
        mock_profile = {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User"
        }
        mock_get_profile.return_value = {
            "message": "User profile",
            "data": mock_profile
        }
        
        response = self.client.get("/users/profile", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"]["username"], "testuser")
        mock_get_profile.assert_called_once()

    @patch('app.services.users.UserService.update_user_profile')
    def test_update_user_profile_success(self, mock_update_profile):
        """Test de mise à jour du profil utilisateur"""
        update_data = {
            "full_name": "Updated Name",
            "email": "newemail@example.com"
        }
        
        mock_update_profile.return_value = {
            "message": "Profile updated",
            "data": {"id": 1, **update_data}
        }
        
        response = self.client.put("/users/profile", json=update_data, headers=self.user_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_update_profile.assert_called_once()

    @patch('app.services.users.UserService.get_all_users')
    def test_get_all_users_admin_success(self, mock_get_users):
        """Test de récupération de tous les utilisateurs (admin)"""
        mock_users = [
            {"id": 1, "username": "user1", "role": "user"},
            {"id": 2, "username": "admin", "role": "admin"}
        ]
        mock_get_users.return_value = {
            "message": "All users",
            "data": mock_users
        }
        
        response = self.client.get("/users/", headers=self.admin_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_get_users.assert_called_once()

    def test_get_all_users_unauthorized(self):
        """Test de récupération des utilisateurs sans droits admin"""
        response = self.client.get("/users/", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 403)


class TestAdminRoutes(BaseAPITest):
    """Tests pour les routes d'administration"""
    
    @patch('app.services.admin.AdminService.get_dashboard_stats')
    def test_get_dashboard_stats_success(self, mock_get_stats):
        """Test de récupération des statistiques du dashboard"""
        mock_stats = {
            "total_users": 100,
            "total_products": 50,
            "total_commandes": 200,
            "revenue": 15000.0
        }
        mock_get_stats.return_value = {
            "message": "Dashboard stats",
            "data": mock_stats
        }
        
        response = self.client.get("/admin/dashboard", headers=self.admin_headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("total_users", response.json()["data"])
        mock_get_stats.assert_called_once()

    def test_get_dashboard_stats_unauthorized(self):
        """Test d'accès au dashboard sans droits admin"""
        response = self.client.get("/admin/dashboard", headers=self.user_headers)
        
        self.assertEqual(response.status_code, 403)

    @patch('app.services.commandes.CommandeService.get_all_commandes')
    def test_get_all_commandes_admin_success(self, mock_get_commandes):
        """Test de récupération de toutes les commandes (admin)"""
        mock_commandes = [
            {"id": 1, "user_id": 1, "statut": "en_attente"},
            {"id": 2, "user_id": 2, "statut": "confirmee"}
        ]
        mock_get_commandes.return_value = {
            "message": "All commandes",
            "data": mock_commandes
        }
        
        response = self.client.get("/admin/commandes", headers=self.admin_headers)
        
        self.assertEqual(response.status_code, 200)
        mock_get_commandes.assert_called_once()


class TestErrorHandling(BaseAPITest):
    """Tests pour la gestion d'erreurs et cas limites"""
    
    def test_invalid_json_format(self):
        """Test avec format JSON invalide"""
        response = self.client.post(
            "/products/",
            data="invalid json",
            headers={"Content-Type": "application/json", **self.admin_headers}
        )
        
        self.assertEqual(response.status_code, 422)

    def test_missing_required_fields(self):
        """Test avec champs requis manquants"""
        incomplete_data = {
            "title": "Product without price"
            # price manquant
        }
        
        response = self.client.post("/products/", json=incomplete_data, headers=self.admin_headers)
        
        self.assertEqual(response.status_code, 422)

    def test_invalid_token_format(self):
        """Test avec format de token invalide"""
        invalid_headers = {"Authorization": "Bearer invalid_token"}
        
        response = self.client.get("/users/profile", headers=invalid_headers)
        
        self.assertEqual(response.status_code, 401)

    def test_expired_token(self):
        """Test avec token expiré"""
        # Créer un token expiré
        expired_token = create_access_token(
            data={"sub": "testuser", "role": "user", "user_id": 1},
            expires_delta=timedelta(seconds=-1)  # Déjà expiré
        )
        expired_headers = {"Authorization": f"Bearer {expired_token}"}
        
        response = self.client.get("/users/profile", headers=expired_headers)
        
        self.assertEqual(response.status_code, 401)

    def test_route_not_found(self):
        """Test de route inexistante"""
        response = self.client.get("/nonexistent/route")
        
        self.assertEqual(response.status_code, 404)

    def test_method_not_allowed(self):
        """Test de méthode HTTP non autorisée"""
        response = self.client.patch("/products/1")  # PATCH non supporté
        
        self.assertEqual(response.status_code, 405)


class TestRateLimitingAndSecurity(BaseAPITest):
    """Tests pour la sécurité et limitation de débit"""
    
    def test_cors_headers(self):
        """Test des headers CORS"""
        response = self.client.options("/products/")
        
        # Vérifier que les headers CORS sont présents
        self.assertIn("access-control-allow-origin", response.headers)

    def test_sql_injection_protection(self):
        """Test de protection contre l'injection SQL"""
        malicious_input = {
            "title": "'; DROP TABLE products; --",
            "price": 100.0,
            "stock": 10,
            "brand": "Test",
            "category_id": 1
        }
        
        # L'API devrait traiter ceci comme du texte normal, pas du SQL
        response = self.client.post("/products/", json=malicious_input, headers=self.admin_headers)
        
        # Ne devrait pas causer d'erreur de base de données
        self.assertNotEqual(response.status_code, 500)


if __name__ == "__main__":
    unittest.main()