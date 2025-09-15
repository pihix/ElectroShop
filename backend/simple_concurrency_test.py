"""
Test simple de concurrence - Simulation d'achats simultanés
"""
import requests
import threading
import time
import json
from concurrent.futures import ThreadPoolExecutor


class ConcurrencyTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = []
    
    def create_test_user(self, username, email, password="testpass123"):
        """Créer un utilisateur de test"""
        url = f"{self.base_url}/auth/signup"  # Correction de l'endpoint
        data = {
            "username": username,
            "email": email,
            "password": password,
            "full_name": f"Test User {username}"
        }
        
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:  # L'API retourne 200 selon le router
                print(f" Utilisateur créé: {username}")
                return response.json()
            else:
                print(f"  Utilisateur {username} existe déjà ou erreur: {response.status_code}")
                if response.status_code == 400:
                    try:
                        error_detail = response.json().get("detail", "Erreur inconnue")
                        print(f"   Détail: {error_detail}")
                    except:
                        pass
                return None
        except Exception as e:
            print(f"❌ Erreur création utilisateur {username}: {e}")
            return None
    
    def login_user(self, username, password="testpass123"):
        """Se connecter et obtenir le token"""
        url = f"{self.base_url}/auth/login"
        # Utiliser form-data au lieu de JSON pour OAuth2PasswordRequestForm
        data = {
            "username": username,
            "password": password
        }
        
        try:
            response = requests.post(url, data=data)  # data au lieu de json
            if response.status_code == 200:
                token = response.json()["access_token"]
                print(f"✅ Connexion réussie: {username}")
                return token
            else:
                print(f"❌ Échec connexion {username}: {response.status_code}")
                if response.content:
                    try:
                        error_detail = response.json().get("detail", "Erreur inconnue")
                        print(f"   Détail: {error_detail}")
                    except Exception:
                        print(f"   Réponse: {response.text[:100]}")
                return None
        except Exception as e:
            print(f"❌ Erreur connexion {username}: {e}")
            return None
    
    def get_admin_token(self):
        """Obtenir le token admin avec les credentials existants"""
        return self.login_user("admin", "admin123")
    
    def create_test_product(self, admin_token):
        """Créer un produit de test avec stock limité"""
        url = f"{self.base_url}/products/"
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        product_data = {
            "title": "iPhone Concurrency Test",
            "description": "Produit pour tester la concurrence",
            "price": 999.99,
            "stock": 5,  # Stock limité !
            "brand": "Apple",
            "thumbnail": "test.jpg",
            "images": ["test1.jpg", "test2.jpg"],
            "category_id": 1
        }
        
        try:
            response = requests.post(url, json=product_data, headers=headers)
            if response.status_code == 201:
                product = response.json()["data"]
                print(f"✅ Produit créé: {product['title']} (Stock: {product['stock']})")
                return product["id"]
            else:
                print(f"❌ Erreur création produit: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Erreur création produit: {e}")
            return None
    
    def get_product_price(self, product_id):
        """Récupérer le prix d'un produit"""
        try:
            response = requests.get(f"{self.base_url}/products/{product_id}")
            if response.status_code == 200:
                product_data = response.json()
                # Le prix est dans data.price
                return product_data.get("data", {}).get("price", 0.0)
            return 0.0
        except Exception:
            return 0.0

    def purchase_worker(self, worker_id, token, product_id, quantity):
        """Worker pour simuler un achat"""
        url = f"{self.base_url}/commandes/"
        headers = {"Authorization": f"Bearer {token}"}
        
        # D'abord récupérer le prix du produit
        prix_unitaire = self.get_product_price(product_id)
        if prix_unitaire <= 0:
            print(f"❌ Worker {worker_id}: Impossible de récupérer le prix du produit")
            result = {
                "worker_id": worker_id,
                "success": False,
                "status_code": 400,
                "response_time": 0,
                "message": "Prix produit indisponible",
                "timestamp": time.time()
            }
            self.results.append(result)
            return result
        
        commande_data = {
            "statut": "en_attente",
            "lignes_commande": [
                {
                    "product_id": product_id,
                    "quantity": quantity,
                    "prix_unitaire": prix_unitaire
                }
            ]
        }
        
        start_time = time.time()
        
        try:
            response = requests.post(url, json=commande_data, headers=headers)
            end_time = time.time()
            
            result = {
                "worker_id": worker_id,
                "success": response.status_code == 201,
                "status_code": response.status_code,
                "response_time": end_time - start_time,
                "message": response.json().get("message", ""),
                "timestamp": time.time()
            }
            
            if result["success"]:
                commande_id = response.json()["data"]["id"]
                print(f"✅ Worker {worker_id}: Commande créée #{commande_id} ({result['response_time']:.3f}s)")
            else:
                error_detail = response.json().get("detail", "Erreur inconnue")
                print(f"❌ Worker {worker_id}: Échec - {error_detail}")
            
            self.results.append(result)
            return result
            
        except Exception as e:
            end_time = time.time()
            result = {
                "worker_id": worker_id,
                "success": False,
                "status_code": 0,
                "response_time": end_time - start_time,
                "message": str(e),
                "timestamp": time.time()
            }
            print(f"❌ Worker {worker_id}: Erreur - {e}")
            self.results.append(result)
            return result
    
    def run_concurrent_purchase_test(self, product_id, num_workers=8, quantity_per_worker=1):
        """Test principal: achats concurrents"""
        print(f"\n🧪 TEST CONCURRENCE: {num_workers} achats simultanés de {quantity_per_worker} unité(s)")
        print("-" * 60)
        
        # Créer des utilisateurs et obtenir leurs tokens
        tokens = []
        for i in range(num_workers):
            username = f"testuser{i}"
            email = f"test{i}@concurrency.com"
            
            # Créer l'utilisateur
            self.create_test_user(username, email)
            
            # Se connecter
            token = self.login_user(username)
            if token:
                tokens.append(token)
        
        print(f" {len(tokens)} utilisateurs prêts pour le test")
        
        if len(tokens) < num_workers:
            print(f" Seulement {len(tokens)} tokens disponibles au lieu de {num_workers}")
        
        # Lancer les achats concurrents
        print(f"Lancement de {len(tokens)} achats simultanés...")
        self.results = []
        
        with ThreadPoolExecutor(max_workers=len(tokens)) as executor:
            futures = [
                executor.submit(self.purchase_worker, i, token, product_id, quantity_per_worker)
                for i, token in enumerate(tokens)
            ]
            
            # Attendre tous les résultats
            for future in futures:
                future.result()
        
        # Analyser les résultats
        self.analyze_results()
    
    def analyze_results(self):
        """Analyser les résultats du test"""
        print(f"\n📊 ANALYSE DES RÉSULTATS")
        print("=" * 40)
        
        successful = [r for r in self.results if r["success"]]
        failed = [r for r in self.results if not r["success"]]
        
        print(f"✅ Achats réussis: {len(successful)}")
        print(f"❌ Achats échoués: {len(failed)}")
        print(f"📈 Taux de réussite: {len(successful)/len(self.results)*100:.1f}%")
        
        if successful:
            avg_response_time = sum(r["response_time"] for r in successful) / len(successful)
            print(f"⏱️  Temps de réponse moyen: {avg_response_time:.3f}s")
        
        # Grouper les erreurs
        error_types = {}
        for r in failed:
            error_msg = r["message"]
            if "Stock insuffisant" in error_msg:
                error_types["Stock insuffisant"] = error_types.get("Stock insuffisant", 0) + 1
            elif "Conflit" in error_msg or "concurrence" in error_msg:
                error_types["Conflit de concurrence"] = error_types.get("Conflit de concurrence", 0) + 1
            else:
                error_types["Autre"] = error_types.get("Autre", 0) + 1
        
        if error_types:
            print("\n🔍 Types d'erreurs:")
            for error_type, count in error_types.items():
                print(f"   - {error_type}: {count}")
        
        print(f"\n🎯 CONCLUSION:")
        if len(successful) <= 5:  # Stock initial était de 5
            print("✅ Gestion de concurrence RÉUSSIE!")
            print("   Le système a correctement empêché la survente.")
        else:
            print("❌ Problème de concurrence détecté!")
            print("   Plus de produits vendus que de stock disponible.")


def main():
    """Fonction principale"""
    print("🏪 ELECTROSHOP - TEST DE CONCURRENCE")
    print("=" * 50)
    
    # Vérifier que l'API est accessible
    tester = ConcurrencyTester()
    
    try:
        response = requests.get(f"{tester.base_url}/docs")
        if response.status_code != 200:
            print("❌ L'API n'est pas accessible. Vérifiez que les conteneurs Docker sont démarrés.")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter à l'API. Vérifiez que les conteneurs Docker sont démarrés.")
        print("💡 Commande: docker-compose up -d")
        return
    
    print("✅ API accessible")
    
    # Option 1: Utiliser un produit existant (ID 1)
    product_id = 1
    
    # Option 2: Créer un nouveau produit pour le test (commenté)
    # print("\n🛠️  Création d'un produit de test...")
    # admin_token = tester.get_admin_token()
    # if admin_token:
    #     product_id = tester.create_test_product(admin_token)
    #     if not product_id:
    #         print("❌ Impossible de créer le produit de test")
    #         return
    # else:
    #     print("❌ Impossible d'obtenir le token admin")
    #     return
    
    print(f"🎯 Test avec le produit ID: {product_id}")
    
    # Lancer le test
    tester.run_concurrent_purchase_test(
        product_id=product_id,
        num_workers=8,  # 8 achats simultanés
        quantity_per_worker=1  # 1 unité par achat
    )


if __name__ == "__main__":
    main()
