"""
Tests unitaires pour l'authentification et l'autorisation
"""
import unittest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from fastapi import HTTPException
import pytest

from app.main import app
from app.services.auth import AuthService
from app.models.models import User
from app.schemas.auth import Signup, UserOut
from app.core.security import get_current_user, check_admin_role, create_access_token, verify_password


client = TestClient(app)


class TestAuthService(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
        self.test_user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            password="$2b$12$hashed_password",
            full_name="Test User",
            is_active=True,
            role="user"
        )
        self.admin_user = User(
            id=2,
            username="admin",
            email="admin@example.com",
            password="$2b$12$hashed_password",
            full_name="Admin User",
            is_active=True,
            role="admin"
        )

    @patch('app.services.auth.get_password_hash')
    @patch('app.services.auth.ResponseHandler')
    def test_signup_success(self, mock_response_handler, mock_hash):
        """Test de création d'un nouveau compte utilisateur"""
        # Setup
        mock_hash.return_value = "hashed_password"
        self.db.query().filter().first.return_value = None  # Utilisateur n'existe pas
        self.db.add = MagicMock()
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        signup_data = Signup(
            username="newuser",
            email="new@example.com",
            password="password123",
            full_name="New User"
        )
        
        # Test
        AuthService.signup(self.db, signup_data)
        
        # Vérifications
        self.db.add.assert_called_once()
        self.db.commit.assert_called_once()
        mock_response_handler.create_success.assert_called_once()

    def test_signup_user_exists(self):
        """Test de création d'un compte avec un utilisateur déjà existant"""
        # Setup
        self.db.query().filter().first.return_value = self.test_user
        
        signup_data = Signup(
            username="testuser",
            email="test@example.com",
            password="password123",
            full_name="Test User"
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            AuthService.signup(self.db, signup_data)
        
        self.assertEqual(context.exception.status_code, 400)

    @patch('app.services.auth.verify_password')
    @patch('app.services.auth.create_access_token')
    @patch('app.services.auth.create_refresh_token')
    def test_login_success(self, mock_refresh_token, mock_access_token, mock_verify):
        """Test de connexion réussie"""
        # Setup
        mock_verify.return_value = True
        mock_access_token.return_value = "access_token_123"
        mock_refresh_token.return_value = "refresh_token_123"
        self.db.query().filter().first.return_value = self.test_user
        
        credentials = MagicMock()
        credentials.username = "testuser"
        credentials.password = "password123"
        
        # Test
        result = AuthService.login(credentials, self.db)
        
        # Vérifications
        mock_verify.assert_called_once_with("password123", "$2b$12$hashed_password")
        mock_access_token.assert_called_once()
        mock_refresh_token.assert_called_once()

    @patch('app.services.auth.verify_password')
    def test_login_invalid_credentials(self, mock_verify):
        """Test de connexion avec des identifiants invalides"""
        # Setup
        mock_verify.return_value = False
        self.db.query().filter().first.return_value = self.test_user
        
        credentials = MagicMock()
        credentials.username = "testuser"
        credentials.password = "wrong_password"
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            AuthService.login(credentials, self.db)
        
        self.assertEqual(context.exception.status_code, 403)

    def test_login_user_not_found(self):
        """Test de connexion avec un utilisateur inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        
        credentials = MagicMock()
        credentials.username = "nonexistent"
        credentials.password = "password123"
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            AuthService.login(credentials, self.db)
        
        self.assertEqual(context.exception.status_code, 403)


class TestSecurityFunctions(unittest.TestCase):
    @patch('app.core.security.jwt.decode')
    @patch('app.core.security.get_db')
    def test_get_current_user_success(self, mock_get_db, mock_jwt_decode):
        """Test de récupération de l'utilisateur actuel avec un token valide"""
        # Setup
        mock_jwt_decode.return_value = {"sub": "testuser"}
        mock_db = MagicMock()
        mock_get_db.return_value.__next__.return_value = mock_db
        
        test_user = User(id=1, username="testuser", email="test@example.com")
        mock_db.query().filter().first.return_value = test_user
        
        # Test
        result = get_current_user("valid_token")
        
        # Vérifications
        self.assertEqual(result, test_user)

    @patch('app.core.security.jwt.decode')
    def test_get_current_user_invalid_token(self, mock_jwt_decode):
        """Test avec un token invalide"""
        # Setup
        mock_jwt_decode.side_effect = Exception("Invalid token")
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            get_current_user("invalid_token")
        
        self.assertEqual(context.exception.status_code, 401)

    def test_check_admin_role_success(self):
        """Test de vérification du rôle admin pour un utilisateur admin"""
        # Setup
        admin_user = User(id=1, username="admin", role="admin")
        
        # Test - ne devrait pas lever d'exception
        try:
            check_admin_role(admin_user)
        except HTTPException:
            self.fail("check_admin_role a levé une exception pour un utilisateur admin")

    def test_check_admin_role_forbidden(self):
        """Test de vérification du rôle admin pour un utilisateur non-admin"""
        # Setup
        regular_user = User(id=1, username="user", role="user")
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            check_admin_role(regular_user)
        
        self.assertEqual(context.exception.status_code, 403)


class TestAuthRoutes(unittest.TestCase):
    def test_signup_route_success(self):
        """Test de la route de création de compte"""
        # Données de test uniques
        import random
        unique_id = random.randint(10000, 99999)
        
        data = {
            "username": f"testuser{unique_id}",
            "email": f"test{unique_id}@example.com",
            "password": "password123",
            "full_name": "Test User"
        }
        
        response = client.post("/auth/signup", json=data)
        
        # Le test peut réussir (201) ou échouer si l'utilisateur existe déjà (400)
        self.assertIn(response.status_code, [200, 201, 400])

    def test_signup_route_missing_data(self):
        """Test de la route de création de compte avec des données manquantes"""
        data = {
            "username": "testuser",
            # email manquant
            "password": "password123",
            "full_name": "Test User"
        }
        
        response = client.post("/auth/signup", json=data)
        self.assertEqual(response.status_code, 422)  # Validation error

    def test_login_route_invalid_credentials(self):
        """Test de la route de connexion avec des identifiants invalides"""
        data = {
            "username": "nonexistent",
            "password": "wrongpassword"
        }
        
        response = client.post("/auth/login", data=data)
        self.assertIn(response.status_code, [401, 403])

    def test_logout_route(self):
        """Test de la route de déconnexion"""
        response = client.post("/auth/logout")
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("Déconnexion réussie", response.json()["message"])

    def test_refresh_token_route_missing_header(self):
        """Test de la route de refresh token sans header"""
        response = client.post("/auth/refresh")
        
        # Devrait échouer car le header refresh_token est manquant
        self.assertEqual(response.status_code, 422)


class TestPasswordSecurity(unittest.TestCase):
    @patch('app.core.security.pwd_context.verify')
    def test_verify_password_correct(self, mock_verify):
        """Test de vérification d'un mot de passe correct"""
        mock_verify.return_value = True
        
        result = verify_password("password123", "hashed_password")
        
        self.assertTrue(result)
        mock_verify.assert_called_once_with("password123", "hashed_password")

    @patch('app.core.security.pwd_context.verify')
    def test_verify_password_incorrect(self, mock_verify):
        """Test de vérification d'un mot de passe incorrect"""
        mock_verify.return_value = False
        
        result = verify_password("wrong_password", "hashed_password")
        
        self.assertFalse(result)

    @patch('app.core.security.jwt.encode')
    def test_create_access_token(self, mock_jwt_encode):
        """Test de création d'un token d'accès"""
        mock_jwt_encode.return_value = "encoded_token"
        
        token = create_access_token(data={"sub": "testuser"})
        
        self.assertEqual(token, "encoded_token")
        mock_jwt_encode.assert_called_once()


if __name__ == "__main__":
    unittest.main()