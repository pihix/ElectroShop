from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_products_list():
    response = client.get("/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # On aattend une liste de produits
