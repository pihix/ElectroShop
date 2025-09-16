"""
Configuration et runner pour tous les tests unitaires de l'application ElectroShop
"""
import unittest
import sys
import os

# Ajouter le répertoire parent au path pour les imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

"""
Configuration et runner pour tous les tests unitaires de l'application ElectroShop
"""
import unittest
import sys
import os

# Ajouter le répertoire parent au path pour les imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def create_test_suite():
    """Créer une suite complète de tests"""
    
    # Créer la suite de tests
    test_suite = unittest.TestSuite()
    
    # Charger tous les tests automatiquement
    loader = unittest.TestLoader()
    
    # Modules de tests à charger
    test_modules = [
        'tests_auth',
        'tests_models', 
        'tests_products',
        'tests_users',
        'tests_commandes',
        'tests_carts',
        'tests_integration',
        'tests_validations_errors'
    ]
    
    for module_name in test_modules:
        try:
            suite = loader.loadTestsFromName(module_name)
            test_suite.addTest(suite)
        except ImportError as e:
            print(f"Avertissement: Impossible de charger {module_name}: {e}")
    
    return test_suite


def run_all_tests():
    """Exécuter tous les tests avec rapport détaillé"""
    
    print("=" * 80)
    print("LANCEMENT DE LA SUITE COMPLÈTE DE TESTS - ELECTROSHOP")
    print("=" * 80)
    
    # Créer la suite de tests
    test_suite = create_test_suite()
    
    # Configuration du runner avec plus de détails
    runner = unittest.TextTestRunner(
        verbosity=2,
        stream=sys.stdout,
        buffer=True,
        failfast=False
    )
    
    # Exécuter les tests
    result = runner.run(test_suite)
    
    # Afficher le résumé
    print_test_summary(result)
    
    return result.wasSuccessful()


def print_test_summary(result):
    """Afficher le résumé des résultats de tests"""
    print("\n" + "=" * 80)
    print("RÉSUMÉ DES TESTS")
    print("=" * 80)
    print(f"Tests exécutés: {result.testsRun}")
    print(f"Échecs: {len(result.failures)}")
    print(f"Erreurs: {len(result.errors)}")
    print(f"Tests ignorés: {len(result.skipped) if hasattr(result, 'skipped') else 0}")
    
    print_failures_and_errors(result)
    print_success_rate(result)
    print("=" * 80)


def print_failures_and_errors(result):
    """Afficher les détails des échecs et erreurs"""
    if result.failures:
        print(f"\nDétail des échecs ({len(result.failures)}):")
        for test, traceback in result.failures:
            error_msg = traceback.split('AssertionError:')[-1].strip() if 'AssertionError:' in traceback else 'Échec'
            print(f"- {test}: {error_msg}")
    
    if result.errors:
        print(f"\nDétail des erreurs ({len(result.errors)}):")
        for test, traceback in result.errors:
            error_msg = traceback.split('Exception:')[-1].strip() if 'Exception:' in traceback else 'Erreur'
            print(f"- {test}: {error_msg}")


def print_success_rate(result):
    """Calculer et afficher le taux de réussite"""
    if result.testsRun == 0:
        success_rate = 0
    else:
        success_rate = ((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100)
    
    print(f"\nTaux de réussite: {success_rate:.1f}%")
    
    if success_rate == 100:
        print("🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS!")
    elif success_rate >= 90:
        print("✅ Excellente couverture de tests!")
    elif success_rate >= 80:
        print("⚠️ Bonne couverture, quelques ajustements nécessaires")
    else:
        print("❌ Des améliorations significatives sont nécessaires")


def run_specific_test_module(module_name):
    """Exécuter les tests d'un module spécifique"""
    
    module_mapping = {
        'auth': 'tests_auth',
        'models': 'tests_models', 
        'products': 'tests_products',
        'users': 'tests_users',
        'commandes': 'tests_commandes',
        'carts': 'tests_carts',
        'integration': 'tests_integration',
        'validations': 'tests_validations_errors'
    }
    
    if module_name in module_mapping:
        print(f"Exécution des tests pour le module: {module_name}")
        suite = unittest.TestLoader().loadTestsFromName(module_mapping[module_name])
        runner = unittest.TextTestRunner(verbosity=2)
        result = runner.run(suite)
        return result.wasSuccessful()
    else:
        print(f"Module '{module_name}' non trouvé. Modules disponibles: {', '.join(module_mapping.keys())}")
        return False


if __name__ == "__main__":
    """Point d'entrée principal pour l'exécution des tests"""
    
    if len(sys.argv) > 1:
        # Exécuter un module spécifique
        module_name = sys.argv[1]
        success = run_specific_test_module(module_name)
    else:
        # Exécuter tous les tests
        success = run_all_tests()
    
    # Code de sortie basé sur le succès des tests
    sys.exit(0 if success else 1)