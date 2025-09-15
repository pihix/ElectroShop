import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.services.products import ProductService
from app.models.models import Product
from unittest.mock import MagicMock

client = TestClient(app)


class TestAuthRoutes(unittest.TestCase):
    def test_logout_route(self):
        response = client.post("/auth/logout")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Déconnexion réussie", response.json()["message"])

    def test_login_bad_credentials(self):
        response = client.post("/auth/login", data={"username": "wrong", "password": "bad"})
        self.assertIn(response.status_code, [400, 401])

    def test_signup(self):
        # On suppose que l'email est unique à chaque test
        import random
        email = f"test{random.randint(1000,9999)}@test.com"
        data = {
            "username": f"user{random.randint(1000,9999)}",
            "email": email,
            "password": "testpass",
            "full_name": "Test User"
        }
        response = client.post("/auth/signup", json=data)
        self.assertIn(response.status_code, [200, 201, 400])  # 400 si déjà existant


class TestProductRoutes(unittest.TestCase):
    def test_get_products(self):
        response = client.get("/products/?page=1&limit=2")
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", response.json())

    def test_get_product_not_found(self):
        response = client.get("/products/999999")
        self.assertIn(response.status_code, [404, 400])

    def test_create_product_unauthorized(self):
        # Doit échouer sans token admin
        data = {
            "id": 0,
            "title": "ProduitTest",
            "description": "desc",
            "price": 10.0,
            "discount_percentage": 0.0,
            "rating": 0.0,
            "stock": 5,
            "brand": "Brand",
            "thumbnail": "img.jpg",
            "images": ["img.jpg"],
            "is_published": True,
            "category_id": 1,
            "version": 1
        }
        response = client.post("/products/", json=data)
        self.assertIn(response.status_code, [401, 403])

    def test_update_product_unauthorized(self):
        data = {
            "title": "ProduitTest",
            "price": 10.0,
            "stock": 5,
            "brand": "Brand",
            "thumbnail": "img.jpg",
            "images": ["img.jpg"],
            "category_id": 1,
            "version": 1
        }
        response = client.put("/products/1", json=data)
        self.assertIn(response.status_code, [401, 403, 404])

    def test_delete_product_unauthorized(self):
        response = client.delete("/products/1")
        self.assertIn(response.status_code, [401, 403, 404])


class TestProtectedAccess(unittest.TestCase):
    def test_protected_route_without_token(self):
        # Exemple : accès à /products/ (POST) sans token admin
        data = {
            "id": 0,
            "title": "ProduitTest",
            "description": "desc",
            "price": 10.0,
            "discount_percentage": 0.0,
            "rating": 0.0,
            "stock": 5,
            "brand": "Brand",
            "thumbnail": "img.jpg",
            "images": ["img.jpg"],
            "is_published": True,
            "category_id": 1,
            "version": 1
        }
        response = client.post("/products/", json=data)
        self.assertIn(response.status_code, [401, 403])


class TestProductService(unittest.TestCase):
    def setUp(self):
        # Mock de la session DB
        self.db = MagicMock()
        self.product = Product(
            id=1, title="Test", description="desc", price=10.0, discount_percentage=0.0,
            rating=0.0, stock=5, brand="Brand", thumbnail="img.jpg", images=["img.jpg"],
            is_published=True, category_id=1, version=1
        )

    def test_add_product(self):
        # Test de la création d'un produit (structure)
        self.db.query().filter().first.return_value = True  # Simule catégorie existante
        product_data = MagicMock()
        product_data.model_dump.return_value = {
            "id": 1, "title": "Test", "description": "desc", "price": 10.0, "discount_percentage": 0.0,
            "rating": 0.0, "stock": 5, "brand": "Brand", "thumbnail": "img.jpg", "images": ["img.jpg"],
            "is_published": True, "category_id": 1, "version": 1
        }
        self.db.add = MagicMock()
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        ProductService.create_product(self.db, product_data)
        self.db.add.assert_called()
        self.db.commit.assert_called()

    def test_optimistic_concurrency(self):
        # Test du contrôle de version (conflit)
        self.db.query().filter().first.return_value = self.product
        from app.schemas.products import ProductUpdate
        update_data = ProductUpdate(
            title="Test", price=10.0, stock=5, brand="Brand", thumbnail="img.jpg", images=["img.jpg"],
            category_id=1, version=2  # Mauvaise version
        )
        with self.assertRaises(Exception) as context:
            ProductService.update_product(self.db, 1, update_data)
        self.assertIn("Conflit de version", str(context.exception))


if __name__ == "__main__":
    unittest.main()
