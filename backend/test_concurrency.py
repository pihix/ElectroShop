import unittest
from unittest.mock import MagicMock
from app.services.products import ProductService
from app.models.models import Product
from app.schemas.products import ProductUpdate
class TestProductOptimisticConcurrency(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
        self.product = Product(
            id=1, title="ProduitTest", description="desc", price=10.0, discount_percentage=0.0,
            rating=0.0, stock=5, brand="Brand", thumbnail="img.jpg", images=["img.jpg"],
            is_published=True, category_id=1, version=5
        )
        self.db.query().filter().first.return_value = self.product

    def test_update_product_success(self):
        update_data = ProductUpdate(
            title="ProduitTestModif",
            price=12.0,
            stock=10,
            brand="Brand",
            thumbnail="img2.jpg",
            images=["img2.jpg"],
            category_id=1,
            version=5
        )
        # Doit passer car version correcte
        try:
            ProductService.update_product(self.db, 1, update_data)
        except Exception:
            self.fail("update_product a levé une exception alors que la version était correcte")

    def test_update_product_conflict(self):
        update_data = ProductUpdate(
            title="ProduitTestModif",
            price=12.0,
            stock=10,
            brand="Brand",
            thumbnail="img2.jpg",
            images=["img2.jpg"],
            category_id=1,
            version=4  # Mauvaise version
        )
        with self.assertRaises(Exception) as context:
            ProductService.update_product(self.db, 1, update_data)
        self.assertIn("Conflit de version", str(context.exception))

"""
Script de test pour la gestion de concurrence
"""
import asyncio
import time
import threading
from concurrent.futures import ThreadPoolExecutor
from sqlalchemy.orm import sessionmaker, Session
from app.db.database import engine, get_db
from app.models.models import Product, User, Commande
from app.services.concurrency import ConcurrencyManager
from app.services.products import ProductService
from app.services.commandes import CommandeService
from app.schemas.commandes import CommandeCreate, LigneCommandeCreate
from app.utils.exceptions import StockInsufficientException, OptimisticLockException


def setup_test_data():
    """Créer des données de test"""
    db = next(get_db())
    
    # Créer un produit de test avec stock limité
    test_product = Product(
        title="iPhone Test",
        description="Produit de test pour concurrence",
        price=999.99,
        stock=5,  # Stock limité pour tester la concurrence
        brand="Apple",
        thumbnail="test.jpg",
        images=["test1.jpg", "test2.jpg"],
        category_id=1,
        version=1
    )
    
    # Créer des utilisateurs de test
    test_users = []
    for i in range(3):
        user = User(
            username=f"testuser{i}",
            email=f"test{i}@example.com",
            password="hashedpassword",
            full_name=f"Test User {i}",
            version=1
        )
        test_users.append(user)
    
    try:
        db.add(test_product)
        db.add_all(test_users)
        db.commit()
        
        print(f" Données de test créées:")
        print(f"   - Produit: {test_product.title} (Stock: {test_product.stock})")
        print(f"   - {len(test_users)} utilisateurs de test")
        
        return test_product.id, [user.id for user in test_users]
        
    except Exception as e:
        db.rollback()
        print(f" Erreur lors de la création des données: {e}")
        return None, None
    finally:
        db.close()


def test_concurrent_stock_update(product_id: int, num_threads: int = 5):
    """Test 1: Mise à jour concurrent du stock"""
    print(f"\n TEST 1: Mise à jour concurrent du stock avec {num_threads} threads")
    
    def update_stock_worker(thread_id):
        try:
            db = next(get_db())
            # Chaque thread essaie de réduire le stock de 1
            result = ConcurrencyManager.atomic_stock_update(db, product_id, -1)
            print(f"✅ Thread {thread_id}: Stock mis à jour avec succès")
            return True
        except StockInsufficientException as e:
            print(f"⚠️  Thread {thread_id}: Stock insuffisant - {e}")
            return False
        except Exception as e:
            print(f"❌ Thread {thread_id}: Erreur - {e}")
            return False
        finally:
            db.close()
    
    # Lancer les threads concurrents
    with ThreadPoolExecutor(max_workers=num_threads) as executor:
        futures = [executor.submit(update_stock_worker, i) for i in range(num_threads)]
        results = [future.result() for future in futures]
    
    # Vérifier le résultat final
    db = next(get_db())
    final_product = db.query(Product).filter(Product.id == product_id).first()
    db.close()
    
    successful_updates = sum(results)
    print(f" Résultats:")
    print(f"   - Mises à jour réussies: {successful_updates}/{num_threads}")
    print(f"   - Stock final: {final_product.stock}")
    print(f"   - Version finale: {final_product.version}")
    
    return successful_updates


def test_concurrent_purchase(product_id: int, user_ids: list, quantity_per_user: int = 2):
    """Test 2: Achats concurrents du même produit"""
    print(f"\n TEST 2: Achats concurrents - {len(user_ids)} utilisateurs, {quantity_per_user} unités chacun")
    
    async def purchase_worker(user_id, user_index):
        try:
            db = next(get_db())
            
            # Créer une commande de test
            ligne_commande = LigneCommandeCreate(
                product_id=product_id,
                quantity=quantity_per_user
            )
            
            commande_data = CommandeCreate(
                statut="en_attente",
                lignes_commande=[ligne_commande]
            )
            
            result = await CommandeService.create_commande(db, commande_data, user_id)
            print(f" Utilisateur {user_index}: Commande créée - ID: {result['data']['id']}")
            return True
            
        except StockInsufficientException as e:
            print(f"  Utilisateur {user_index}: Stock insuffisant - {e}")
            return False
        except Exception as e:
            print(f" Utilisateur {user_index}: Erreur - {e}")
            return False
        finally:
            db.close()
    
    # Exécuter les achats concurrents
    async def run_concurrent_purchases():
        tasks = [purchase_worker(user_id, i) for i, user_id in enumerate(user_ids)]
        return await asyncio.gather(*tasks, return_exceptions=True)
    
    results = asyncio.run(run_concurrent_purchases())
    
    # Analyser les résultats
    successful_purchases = sum(1 for r in results if r is True)
    failed_purchases = len(results) - successful_purchases
    
    # Vérifier l'état final
    db = next(get_db())
    final_product = db.query(Product).filter(Product.id == product_id).first()
    commandes = db.query(Commande).filter(Commande.user_id.in_(user_ids)).all()
    db.close()
    
    print(f" Résultats:")
    print(f"   - Achats réussis: {successful_purchases}/{len(user_ids)}")
    print(f"   - Achats échoués: {failed_purchases}")
    print(f"   - Stock restant: {final_product.stock}")
    print(f"   - Commandes créées: {len(commandes)}")
    
    return successful_purchases


def test_optimistic_locking(product_id: int):
    """Test 3: Optimistic locking"""
    print(f"\n TEST 3: Test d'optimistic locking")
    
    def modify_product_worker(thread_id, expected_version):
        try:
            db = next(get_db())
            
            # Simuler une modification avec une version spécifique
            result = ProductService.update_product(
                db, 
                product_id, 
                {"price": 1000.0 + thread_id}, 
                expected_version=expected_version
            )
            print(f" Thread {thread_id}: Produit mis à jour (version {expected_version})")
            return True
            
        except OptimisticLockException as e:
            print(f"  Thread {thread_id}: Conflit de version - {e}")
            return False
        except Exception as e:
            print(f" Thread {thread_id}: Erreur - {e}")
            return False
        finally:
            db.close()
    
    # Obtenir la version actuelle
    db = next(get_db())
    current_product = db.query(Product).filter(Product.id == product_id).first()
    current_version = current_product.version
    db.close()
    
    print(f"Version actuelle du produit: {current_version}")
    
    # Lancer 2 threads avec la même version attendue
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [
            executor.submit(modify_product_worker, 1, current_version),
            executor.submit(modify_product_worker, 2, current_version)
        ]
        results = [future.result() for future in futures]
    
    successful_updates = sum(results)
    print(f" Résultats:")
    print(f"   - Mises à jour réussies: {successful_updates}/2")
    print(f"   - Une seule devrait réussir (optimistic locking)")
    
    return successful_updates


def test_deadlock_prevention():
    """Test 4: Prévention des deadlocks"""
    print(f"\n TEST 4: Test de prévention des deadlocks")
    
    def batch_update_worker(worker_id, product_ids):
        try:
            db = next(get_db())
            
            # Mettre à jour plusieurs produits dans un ordre différent
            stock_updates = [
                {"product_id": pid, "quantity_change": worker_id}
                for pid in product_ids
            ]
            
            result = ConcurrencyManager.batch_stock_update(db, stock_updates)
            successful = len(result["successful_updates"])
            print(f" Worker {worker_id}: {successful} mises à jour réussies")
            return True
            
        except Exception as e:
            print(f" Worker {worker_id}: Erreur - {e}")
            return False
        finally:
            db.close()
    
    # Simuler des mises à jour croisées
    product_ids = [1, 2, 3]  # Supposons que ces produits existent
    
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = [
            executor.submit(batch_update_worker, 1, product_ids),
            executor.submit(batch_update_worker, 2, reversed(product_ids)),
            executor.submit(batch_update_worker, 3, product_ids[1:] + product_ids[:1])
        ]
        results = [future.result() for future in futures]
    
    successful_workers = sum(results)
    print(f"Résultats:")
    print(f"   - Workers réussis: {successful_workers}/3")


def run_all_tests():
    """Exécuter tous les tests de concurrence"""
    print(" TESTS DE CONCURRENCE ELECTROSHOP")
    print("=" * 50)
    
    # Setup
    product_id, user_ids = setup_test_data()
    if not product_id:
        print(" Impossible de créer les données de test")
        return
    
    try:
        # Test 1: Mise à jour concurrent du stock
        test_concurrent_stock_update(product_id, 8)
        
        time.sleep(1)  # Pause entre les tests
        
        # Test 2: Achats concurrents
        if user_ids:
            test_concurrent_purchase(product_id, user_ids, 1)
        
        time.sleep(1)
        
        # Test 3: Optimistic locking
        test_optimistic_locking(product_id)
        
        time.sleep(1)
        
        # Test 4: Prévention des deadlocks
        test_deadlock_prevention()
        
        print("\n TOUS LES TESTS TERMINÉS!")
        print("Vérifiez les résultats ci-dessus pour évaluer la gestion de concurrence.")
        
    except Exception as e:
        print(f" Erreur générale: {e}")


if __name__ == "__main__":
    # Pour lancer les tests unitaires :
    unittest.main(exit=False)
    # Pour lancer les tests d'intégration/scénarios :
    run_all_tests()
