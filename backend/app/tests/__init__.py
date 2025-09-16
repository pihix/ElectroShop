"""
Package de tests unitaires pour l'application ElectroShop

Ce package contient tous les tests unitaires, d'intégration et de validation
pour l'application ElectroShop développée avec FastAPI.

Modules disponibles:
- tests_auth: Tests d'authentification et autorisation
- tests_models: Tests des modèles de données SQLAlchemy
- tests_products: Tests des services produits et catégories
- tests_users: Tests de gestion des utilisateurs
- tests_commandes: Tests des services de commandes
- tests_carts: Tests de gestion du panier
- tests_integration: Tests d'intégration pour toutes les routes API
- tests_validations_errors: Tests de validation et gestion d'erreurs
- test_runner: Runner principal pour exécuter tous les tests

Utilisation:
    # Exécuter tous les tests
    python -m app.tests.test_runner
    
    # Exécuter un module spécifique
    python -m unittest app.tests.tests_auth
"""

__version__ = "1.0.0"
__author__ = "ElectroShop Development Team"

# Import des modules principaux pour faciliter l'accès
from . import tests_auth
from . import tests_models
from . import tests_products
from . import tests_users
from . import tests_commandes
from . import tests_carts
from . import tests_integration
from . import tests_validations_errors
from . import test_runner

__all__ = [
    "tests_auth",
    "tests_models", 
    "tests_products",
    "tests_users",
    "tests_commandes",
    "tests_carts",
    "tests_integration",
    "tests_validations_errors",
    "test_runner"
]