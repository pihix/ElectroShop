#!/usr/bin/env python3
"""
Test simple de concurrence
"""
import threading
import time
from app.db.database import get_db
from app.services.concurrency import ConcurrencyManager
from app.models.models import Product

def test_concurrent_stock_reduction():
    print("TEST: Réduction concurrent du stock")
    print("=" * 40)
    
    # Obtenir le produit de test
    db = next(get_db())
    product = db.query(Product).filter(Product.id == 1).first()
    initial_stock = product.stock
    initial_version = product.version
    db.close()
    
    print(f"Stock initial: {initial_stock}")
    print(f"Version initiale: {initial_version}")
    
    results = []
    
    def worker(worker_id):
        try:
            db = next(get_db())
            # Chaque worker essaie de réduire le stock de 1
            success = ConcurrencyManager.atomic_stock_update(db, 1, -1)
            results.append((worker_id, True, "Success"))
            print(f" Worker {worker_id}: Stock réduit avec succès")
            return True
        except Exception as e:
            results.append((worker_id, False, str(e)))
            print(f" Worker {worker_id}: {str(e)}")
            return False
        finally:
            db.close()
    
    # Lancer 8 threads simultanément (plus que le stock disponible)
    threads = []
    for i in range(8):
        thread = threading.Thread(target=worker, args=(i,))
        threads.append(thread)
    
    # Démarrer tous les threads en même temps
    print("Lancement de 8 workers simultanés...")
    start_time = time.time()
    
    for thread in threads:
        thread.start()
    
    for thread in threads:
        thread.join()
    
    end_time = time.time()
    
    # Vérifier le résultat final
    db = next(get_db())
    final_product = db.query(Product).filter(Product.id == 1).first()
    final_stock = final_product.stock
    final_version = final_product.version
    db.close()
    
    # Analyser les résultats
    successful = len([r for r in results if r[1]])
    failed = len([r for r in results if not r[1]])
    
    print(f"\n RÉSULTATS:")
    print(f"  - Temps d'exécution: {end_time - start_time:.3f}s")
    print(f"  - Workers réussis: {successful}/8")
    print(f"  - Workers échoués: {failed}/8")
    print(f"  - Stock final: {final_stock}")
    print(f"  - Version finale: {final_version}")
    print(f"  - Stock réduit de: {initial_stock - final_stock}")
    
    # Validation
    expected_final_stock = max(0, initial_stock - successful)
    if final_stock == expected_final_stock:
        print(f"\n TEST RÉUSSI: La concurrence est correctement gérée!")
        print(f"   Stock cohérent: {final_stock} = {initial_stock} - {successful}")
    else:
        print(f"\n TEST ÉCHOUÉ: Problème de concurrence détecté!")
        print(f"   Stock attendu: {expected_final_stock}, Stock actuel: {final_stock}")

if __name__ == "__main__":
    test_concurrent_stock_reduction()
