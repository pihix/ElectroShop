"""
Test d'achat concurrent - Scénario e-commerce réaliste
"""
import threading
import time
from app.db.database import get_db
from app.models.models import Product
from app.services.concurrency import ConcurrencyManager

def test_ecommerce_scenario():
    print("🛒 TEST E-COMMERCE: Simulation d'achats concurrents")
    print("=" * 50)

    # Remettre le stock à 5 pour un nouveau test
    db = next(get_db())
    product = db.query(Product).filter(Product.id == 1).first()
    product.stock = 5
    product.version += 1
    db.commit()
    print(f"📦 Stock remis à: {product.stock}")
    db.close()

    results = []

    def customer_purchase(customer_id, quantity):
        """Simuler un achat client"""
        try:
            db = next(get_db())
            purchase_result = ConcurrencyManager.safe_product_purchase(db, 1, quantity)
            results.append((customer_id, True, purchase_result))
            print(f" Client {customer_id}: Acheté {quantity} unité(s) - Prix: {purchase_result['unit_price']}€")
            return True
        except Exception as e:
            results.append((customer_id, False, str(e)))
            error_msg = str(e)[:50] + "..." if len(str(e)) > 50 else str(e)
            print(f" Client {customer_id}: Échec - {error_msg}")
            return False
        finally:
            db.close()

    # Simuler 10 clients qui essaient d'acheter en même temps
    customers = [
        (1, 1), (2, 2), (3, 1), (4, 1), (5, 3),  # Total demandé: 8 unités
        (6, 1), (7, 2), (8, 1), (9, 1), (10, 1)  # Total demandé: 6 unités supplémentaires
    ]

    print(f" {len(customers)} clients tentent d'acheter simultanément...")
    print(" Demande totale: 14 unités, Stock disponible: 5 unités")

    start_time = time.time()

    threads = []
    for customer_id, quantity in customers:
        thread = threading.Thread(target=customer_purchase, args=(customer_id, quantity))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    end_time = time.time()

    # Résultats finaux
    db = next(get_db())
    final_product = db.query(Product).filter(Product.id == 1).first()
    db.close()

    successful_purchases = [r for r in results if r[1]]
    failed_purchases = [r for r in results if not r[1]]
    total_sold = sum(r[2]["reserved_quantity"] for r in successful_purchases)

    print(f"\n🎯 RÉSULTATS FINAUX:")
    print(f"  ⏱️  Temps d'exécution: {end_time - start_time:.3f}s")
    print(f"  ✅ Achats réussis: {len(successful_purchases)}/{len(customers)}")
    print(f"  ❌ Achats échoués: {len(failed_purchases)}")
    print(f"  📦 Unités vendues: {total_sold}")
    print(f"  📦 Stock restant: {final_product.stock}")
    print(f"  🔄 Version produit: {final_product.version}")

    if total_sold <= 5 and final_product.stock >= 0:
        print(f"\n🎉 SUCCÈS: Gestion parfaite de la concurrence!")
        print(f"   Aucune survente détectée. Stock cohérent.")
    else:
        print(f"\n⚠️  ATTENTION: Problème de concurrence possible!")

if __name__ == "__main__":
    test_ecommerce_scenario()
