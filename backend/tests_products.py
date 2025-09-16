"""
Tests unitaires pour les services produits
"""
import unittest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from app.services.products import ProductService
from app.models.models import Product, Category
from app.schemas.products import ProductCreate, ProductUpdate
from app.utils.responses import ResponseHandler


class TestProductService(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
        self.test_product = Product(
            id=1,
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
        self.test_category = Category(
            id=1,
            name="Smartphones",
            description="Téléphones mobiles"
        )

    def test_get_all_products_success(self):
        """Test de récupération de tous les produits avec pagination"""
        # Setup
        products_list = [self.test_product]
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.filter.return_value.limit.return_value.offset.return_value.all.return_value = products_list
        
        # Test
        result = ProductService.get_all_products(self.db, page=1, limit=10, search="")
        
        # Vérifications
        self.assertEqual(result["message"], "Page 1 with 10 products")
        self.assertEqual(result["data"], products_list)
        mock_query.order_by.assert_called_once()

    def test_get_all_products_with_search(self):
        """Test de récupération de produits avec recherche"""
        # Setup
        products_list = [self.test_product]
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.filter.return_value.limit.return_value.offset.return_value.all.return_value = products_list
        
        # Test
        result = ProductService.get_all_products(self.db, page=1, limit=5, search="iPhone")
        
        # Vérifications
        self.assertEqual(result["message"], "Page 1 with 5 products")
        self.assertEqual(result["data"], products_list)

    def test_get_all_products_pagination(self):
        """Test de pagination des produits"""
        # Setup
        products_list = [self.test_product]
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.filter.return_value.limit.return_value.offset.return_value.all.return_value = products_list
        
        # Test page 2 avec 10 éléments par page
        result = ProductService.get_all_products(self.db, page=2, limit=10, search="")
        
        # Vérifications
        self.assertEqual(result["message"], "Page 2 with 10 products")
        # Vérifier que offset est appelé avec (2-1)*10 = 10
        mock_query.order_by.return_value.filter.return_value.limit.return_value.offset.assert_called_with(10)

    @patch('app.services.products.ResponseHandler.get_single_success')
    def test_get_product_success(self, mock_response):
        """Test de récupération d'un produit par ID"""
        # Setup
        self.db.query().filter().first.return_value = self.test_product
        mock_response.return_value = {"message": "success", "data": self.test_product}
        
        # Test
        result = ProductService.get_product(self.db, 1)
        
        # Vérifications
        self.db.query.assert_called_once_with(Product)
        mock_response.assert_called_once_with("iPhone 15", 1, self.test_product)

    @patch('app.services.products.ResponseHandler.not_found_error')
    def test_get_product_not_found(self, mock_error):
        """Test de récupération d'un produit inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="Not found")
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            ProductService.get_product(self.db, 999)
        
        mock_error.assert_called_once_with("Product", 999)

    @patch('app.services.products.ResponseHandler.create_success')
    def test_create_product_success(self, mock_response):
        """Test de création d'un produit"""
        # Setup
        self.db.query().filter().first.return_value = self.test_category  # Catégorie existe
        self.db.add = MagicMock()
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_response.return_value = {"message": "Created", "data": self.test_product}
        
        product_data = ProductCreate(
            id=1,
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
        
        # Test
        result = ProductService.create_product(self.db, product_data)
        
        # Vérifications
        self.db.add.assert_called_once()
        self.db.commit.assert_called_once()
        self.db.refresh.assert_called_once()
        mock_response.assert_called_once()

    @patch('app.services.products.ResponseHandler.not_found_error')
    def test_create_product_category_not_found(self, mock_error):
        """Test de création d'un produit avec une catégorie inexistante"""
        # Setup
        self.db.query().filter().first.return_value = None  # Catégorie n'existe pas
        mock_error.side_effect = HTTPException(status_code=404, detail="Category not found")
        
        product_data = ProductCreate(
            id=1,
            title="Test Product",
            price=100.0,
            stock=10,
            brand="Test",
            thumbnail="test.jpg",
            images=["test.jpg"],
            category_id=999  # Catégorie inexistante
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            ProductService.create_product(self.db, product_data)
        
        mock_error.assert_called_once_with("Category", 999)

    @patch('app.services.products.ResponseHandler.update_success')
    def test_update_product_success(self, mock_response):
        """Test de mise à jour d'un produit"""
        # Setup
        self.db.query().filter().first.return_value = self.test_product
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        mock_response.return_value = {"message": "Updated", "data": self.test_product}
        
        update_data = ProductUpdate(
            title="iPhone 15 Pro",
            price=1199.99,
            stock=30,
            brand="Apple",
            thumbnail="iphone15pro.jpg",
            images=["iphone15pro.jpg"],
            category_id=1
        )
        
        # Test
        result = ProductService.update_product(self.db, 1, update_data)
        
        # Vérifications
        self.db.commit.assert_called_once()
        self.db.refresh.assert_called_once()
        mock_response.assert_called_once()

    @patch('app.services.products.ResponseHandler.not_found_error')
    def test_update_product_not_found(self, mock_error):
        """Test de mise à jour d'un produit inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="Product not found")
        
        update_data = ProductUpdate(
            title="Updated Product",
            price=100.0,
            stock=10,
            brand="Test",
            thumbnail="test.jpg",
            images=["test.jpg"],
            category_id=1
        )
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            ProductService.update_product(self.db, 999, update_data)
        
        mock_error.assert_called_once_with("Product", 999)

    def test_update_product_fields_modification(self):
        """Test que les champs sont bien modifiés lors de la mise à jour"""
        # Setup
        original_product = Product(
            id=1,
            title="Original Title",
            price=100.0,
            stock=10,
            brand="Original Brand",
            thumbnail="original.jpg",
            images=["original.jpg"],
            category_id=1
        )
        self.db.query().filter().first.return_value = original_product
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        update_data = ProductUpdate(
            title="New Title",
            price=200.0,
            stock=20,
            brand="New Brand",
            thumbnail="new.jpg",
            images=["new.jpg"],
            category_id=2
        )
        
        # Test
        ProductService.update_product(self.db, 1, update_data)
        
        # Vérifications - les champs doivent être modifiés
        self.assertEqual(original_product.title, "New Title")
        self.assertEqual(original_product.price, 200.0)
        self.assertEqual(original_product.stock, 20)
        self.assertEqual(original_product.brand, "New Brand")

    @patch('app.services.products.ResponseHandler.delete_success')
    def test_delete_product_success(self, mock_response):
        """Test de suppression d'un produit"""
        # Setup
        self.db.query().filter().first.return_value = self.test_product
        self.db.delete = MagicMock()
        self.db.commit = MagicMock()
        mock_response.return_value = {"message": "Deleted", "data": self.test_product}
        
        # Test
        result = ProductService.delete_product(self.db, 1)
        
        # Vérifications
        self.db.delete.assert_called_once_with(self.test_product)
        self.db.commit.assert_called_once()
        mock_response.assert_called_once()

    @patch('app.services.products.ResponseHandler.not_found_error')
    def test_delete_product_not_found(self, mock_error):
        """Test de suppression d'un produit inexistant"""
        # Setup
        self.db.query().filter().first.return_value = None
        mock_error.side_effect = HTTPException(status_code=404, detail="Product not found")
        
        # Test et vérification
        with self.assertRaises(HTTPException):
            ProductService.delete_product(self.db, 999)
        
        mock_error.assert_called_once_with("Product", 999)


class TestProductServiceEdgeCases(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()

    def test_get_all_products_empty_result(self):
        """Test de récupération avec aucun produit"""
        # Setup
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.filter.return_value.limit.return_value.offset.return_value.all.return_value = []
        
        # Test
        result = ProductService.get_all_products(self.db, page=1, limit=10, search="")
        
        # Vérifications
        self.assertEqual(result["data"], [])
        self.assertEqual(result["message"], "Page 1 with 10 products")

    def test_get_all_products_large_page_number(self):
        """Test avec un numéro de page élevé"""
        # Setup
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.filter.return_value.limit.return_value.offset.return_value.all.return_value = []
        
        # Test
        result = ProductService.get_all_products(self.db, page=1000, limit=10, search="")
        
        # Vérifications
        self.assertEqual(result["data"], [])
        # Offset devrait être (1000-1)*10 = 9990
        mock_query.order_by.return_value.filter.return_value.limit.return_value.offset.assert_called_with(9990)

    def test_get_all_products_zero_limit(self):
        """Test avec une limite de 0"""
        # Setup
        mock_query = self.db.query.return_value
        mock_query.order_by.return_value.filter.return_value.limit.return_value.offset.return_value.all.return_value = []
        
        # Test
        result = ProductService.get_all_products(self.db, page=1, limit=0, search="")
        
        # Vérifications
        mock_query.order_by.return_value.filter.return_value.limit.assert_called_with(0)

    def test_create_product_with_minimal_data(self):
        """Test de création de produit avec données minimales"""
        # Setup
        self.db.query().filter().first.return_value = Category(id=1, name="Test")
        self.db.add = MagicMock()
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        minimal_product = ProductCreate(
            id=1,
            title="Minimal Product",
            price=1.0,
            stock=1,
            brand="Test",
            thumbnail="test.jpg",
            images=["test.jpg"],
            category_id=1
        )
        
        # Test
        try:
            ProductService.create_product(self.db, minimal_product)
        except Exception as e:
            self.fail(f"La création avec des données minimales a échoué: {e}")

    def test_update_product_partial_update(self):
        """Test de mise à jour partielle d'un produit"""
        # Setup
        original_product = Product(
            id=1,
            title="Original Title",
            description="Original Description",
            price=100.0,
            stock=10,
            brand="Original Brand",
            thumbnail="original.jpg",
            images=["original.jpg"],
            category_id=1
        )
        self.db.query().filter().first.return_value = original_product
        self.db.commit = MagicMock()
        self.db.refresh = MagicMock()
        
        # Mise à jour seulement du titre et du prix
        partial_update = ProductUpdate(
            title="New Title",
            price=150.0,
            stock=10,  # Même valeur
            brand="Original Brand",  # Même valeur
            thumbnail="original.jpg",  # Même valeur
            images=["original.jpg"],  # Même valeur
            category_id=1  # Même valeur
        )
        
        # Test
        ProductService.update_product(self.db, 1, partial_update)
        
        # Vérifications
        self.assertEqual(original_product.title, "New Title")
        self.assertEqual(original_product.price, 150.0)
        # Les autres champs restent inchangés
        self.assertEqual(original_product.description, "Original Description")


if __name__ == "__main__":
    unittest.main()