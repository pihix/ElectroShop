"""
Tests unitaires pour les services utilisateurs
"""
import unittest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from app.services.users import UserService
from app.models.models import User
from app.schemas.users import UserCreate, UserUpdate


class TestUserService(unittest.TestCase):
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
        self.admin_user = User(
            id=2,
            username="admin",
            email="admin@example.com",
            password="hashed_password",
            full_name="Admin User",
            is_active=True,
            role="admin"
        )

    def test_get_all_users_success(self):
        """Test de récupération de tous les utilisateurs"""
        # Setup
        users_list = [self.test_user, self.admin_user]
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.limit.return_value.offset.return_value.all.return_value = users_list
        
        # Test
        result = UserService.get_all_users(self.db, page=1, limit=10)
        
        # Vérifications
        self.assertEqual(result["message"], "Page 1 with 10 users")
        self.assertEqual(result["data"], users_list)

    def test_get_all_users_pagination(self):
        """Test de pagination des utilisateurs"""
        # Setup
        users_list = [self.test_user]
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.limit.return_value.offset.return_value.all.return_value = users_list
        
        # Test page 2 avec 5 éléments par page
        result = UserService.get_all_users(self.db, page=2, limit=5)
        
        # Vérifications
        self.assertEqual(result["message"], "Page 2 with 5 users")
        # Vérifier que offset est appelé avec (2-1)*5 = 5
        mock_query.order_by.return_value.limit.return_value.offset.assert_called_with(5)

    @patch('app.services.users.ResponseHandler.get_single_success')
    def test_get_user_success(self, mock_response):
        """Test de récupération d'un utilisateur par ID"""
        # Setup
        self.db.query().filter().first.return_value = self.test_user
        mock_response.return_value = {"message": "success", "data": self.test_user}
        
        # Test
        UserService.get_user(self.db, 1)
        
        # Vérifications
        self.db.query.assert_called_once_with(User)
        mock_response.assert_called_once_with("testuser", 1, self.test_user)

    @patch('app.services.users.ResponseHandler.not_found_error')
    def test_get_user_not_found(self, mock_error):
        """Test de récupération d'un utilisateur inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="Not found")
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            UserService.get_user(self.db, 999)
        
        mock_error.assert_called_once_with("User", 999)

    @patch('app.services.users.get_password_hash')
    @patch('app.services.users.ResponseHandler.create_success')
    def test_create_user_success(self, mock_response, mock_hash):
        """Test de création d'un utilisateur"""
        # Setup
        self.db.query().filter().first.return_value = None  # Utilisateur n'existe pas
        mock_hash.return_value = "hashed_password"
        self.db.add = MagicMock()
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_response.return_value = {"message": "Created", "data": self.test_user}
        
        user_data = UserCreate(
            username="newuser",
            email="new@example.com",
            password="password123",
            full_name="New User"
        )
        
        # Test
        UserService.create_user(self.db, user_data)
        
        # Vérifications
        mock_hash.assert_called_once_with("password123")
        self.db.add.assert_called_once()
        self.db.commit.assert_called_once()
        self.db.refresh.assert_called_once()

    def test_create_user_username_exists(self):
        """Test de création d'un utilisateur avec un nom d'utilisateur existant"""
        # Setup
        self.db.query().filter().first.return_value = self.test_user
        
        user_data = UserCreate(
            username="testuser",  # Nom d'utilisateur déjà existant
            email="new@example.com",
            password="password123",
            full_name="New User"
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            UserService.create_user(self.db, user_data)
        
        self.assertEqual(context.exception.status_code, 400)

    def test_create_user_email_exists(self):
        """Test de création d'un utilisateur avec un email existant"""
        # Setup
        # Premier appel pour vérifier le nom d'utilisateur (n'existe pas)
        # Deuxième appel pour vérifier l'email (existe déjà)
        self.db.query().filter().first.side_effect = [None, self.test_user]
        
        user_data = UserCreate(
            username="newuser",
            email="test@example.com",  # Email déjà existant
            password="password123",
            full_name="New User"
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException) as context:
            UserService.create_user(self.db, user_data)
        
        self.assertEqual(context.exception.status_code, 400)

    @patch('app.services.users.ResponseHandler.update_success')
    def test_update_user_success(self, mock_response):
        """Test de mise à jour d'un utilisateur"""
        # Setup
        self.db.query().filter().first.return_value = self.test_user
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_response.return_value = {"message": "Updated", "data": self.test_user}
        
        update_data = UserUpdate(
            username="updateduser",
            email="updated@example.com",
            full_name="Updated User"
        )
        
        # Test
        UserService.update_user(self.db, 1, update_data)
        
        # Vérifications
        self.db.commit.assert_called_once()
        self.db.refresh.assert_called_once()
        mock_response.assert_called_once()

    @patch('app.services.users.ResponseHandler.not_found_error')
    def test_update_user_not_found(self, mock_error):
        """Test de mise à jour d'un utilisateur inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="User not found")
        
        update_data = UserUpdate(
            username="updateduser",
            email="updated@example.com",
            full_name="Updated User"
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            UserService.update_user(self.db, 999, update_data)
        
        mock_error.assert_called_once_with("User", 999)

    def test_update_user_fields_modification(self):
        """Test que les champs sont bien modifiés lors de la mise à jour"""
        # Setup
        original_user = User(
            id=1,
            username="original",
            email="original@example.com",
            full_name="Original User",
            password="hashed_password",
            is_active=True,
            role="user"
        )
        self.db.query().filter().first.return_value = original_user
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        update_data = UserUpdate(
            username="updated",
            email="updated@example.com",
            full_name="Updated User"
        )
        
        # Test
        UserService.update_user(self.db, 1, update_data)
        
        # Vérifications - les champs doivent être modifiés
        self.assertEqual(original_user.username, "updated")
        self.assertEqual(original_user.email, "updated@example.com")
        self.assertEqual(original_user.full_name, "Updated User")

    @patch('app.services.users.ResponseHandler.delete_success')
    def test_delete_user_success(self, mock_response):
        """Test de suppression d'un utilisateur"""
        # Setup
        self.db.query().filter().first.return_value = self.test_user
        self.db.delete = MagicMock()
        self.db.commit = MagicMock()
        mock_response.return_value = {"message": "Deleted", "data": self.test_user}
        
        # Test
        UserService.delete_user(self.db, 1)
        
        # Vérifications
        self.db.delete.assert_called_once_with(self.test_user)
        self.db.commit.assert_called_once()
        mock_response.assert_called_once()

    @patch('app.services.users.ResponseHandler.not_found_error')
    def test_delete_user_not_found(self, mock_error):
        """Test de suppression d'un utilisateur inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="User not found")
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            UserService.delete_user(self.db, 999)
        
        mock_error.assert_called_once_with("User", 999)

    def test_activate_user_success(self):
        """Test d'activation d'un utilisateur"""
        # Setup
        inactive_user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            password="hashed_password",
            full_name="Test User",
            is_active=False,  # Utilisateur inactif
            role="user"
        )
        self.db.query().filter().first.return_value = inactive_user
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        # Test
        UserService.activate_user(self.db, 1)
        
        # Vérifications
        self.assertTrue(inactive_user.is_active)
        self.db.commit.assert_called_once()

    def test_deactivate_user_success(self):
        """Test de désactivation d'un utilisateur"""
        # Setup
        self.db.query().filter().first.return_value = self.test_user
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        # Test
        UserService.deactivate_user(self.db, 1)
        
        # Vérifications
        self.assertFalse(self.test_user.is_active)
        self.db.commit.assert_called_once()

    def test_get_user_by_username_success(self):
        """Test de récupération d'un utilisateur par nom d'utilisateur"""
        # Setup
        self.db.query().filter().first.return_value = self.test_user
        
        # Test
        result = UserService.get_user_by_username(self.db, "testuser")
        
        # Vérifications
        self.assertEqual(result, self.test_user)

    def test_get_user_by_username_not_found(self):
        """Test de récupération d'un utilisateur par nom d'utilisateur inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        
        # Test
        result = UserService.get_user_by_username(self.db, "nonexistent")
        
        # Vérifications
        self.assertIsNone(result)

    def test_get_user_by_email_success(self):
        """Test de récupération d'un utilisateur par email"""
        # Setup
        self.db.query().filter().first.return_value = self.test_user
        
        # Test
        result = UserService.get_user_by_email(self.db, "test@example.com")
        
        # Vérifications
        self.assertEqual(result, self.test_user)

    def test_get_user_by_email_not_found(self):
        """Test de récupération d'un utilisateur par email inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        
        # Test
        result = UserService.get_user_by_email(self.db, "nonexistent@example.com")
        
        # Vérifications
        self.assertIsNone(result)

    def test_promote_to_admin_success(self):
        """Test de promotion d'un utilisateur en admin"""
        # Setup
        self.db.query().filter().first.return_value = self.test_user
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        # Test
        UserService.promote_to_admin(self.db, 1)
        
        # Vérifications
        self.assertEqual(self.test_user.role, "admin")
        self.db.commit.assert_called_once()

    def test_demote_from_admin_success(self):
        """Test de rétrogradation d'un admin en utilisateur"""
        # Setup
        self.db.query().filter().first.return_value = self.admin_user
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        # Test
        UserService.demote_from_admin(self.db, 2)
        
        # Vérifications
        self.assertEqual(self.admin_user.role, "user")
        self.db.commit.assert_called_once()


class TestUserServiceEdgeCases(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()

    def test_get_all_users_empty_result(self):
        """Test de récupération avec aucun utilisateur"""
        # Setup
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.limit.return_value.offset.return_value.all.return_value = []
        
        # Test
        result = UserService.get_all_users(self.db, page=1, limit=10)
        
        # Vérifications
        self.assertEqual(result["data"], [])
        self.assertEqual(result["message"], "Page 1 with 10 users")

    def test_create_user_with_minimal_data(self):
        """Test de création d'utilisateur avec données minimales"""
        # Setup
        self.db.query().filter().first.return_value = None
        self.db.add = MagicMock()
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        minimal_user = UserCreate(
            username="minimal",
            email="minimal@example.com",
            password="password123",
            full_name="Minimal User"
        )
        
        # Test
        try:
            UserService.create_user(self.db, minimal_user)
        except Exception as e:
            self.fail(f"La création avec des données minimales a échoué: {e}")

    @patch('app.services.users.get_password_hash')
    def test_update_user_password(self, mock_hash):
        """Test de mise à jour du mot de passe d'un utilisateur"""
        # Setup
        user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            password="old_hashed_password",
            full_name="Test User"
        )
        self.db.query().filter().first.return_value = user
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_hash.return_value = "new_hashed_password"
        
        # Test
        UserService.update_user_password(self.db, 1, "new_password")
        
        # Vérifications
        mock_hash.assert_called_once_with("new_password")
        self.assertEqual(user.password, "new_hashed_password")
        self.db.commit.assert_called_once()


if __name__ == "__main__":
    unittest.main()