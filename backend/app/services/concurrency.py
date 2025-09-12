"""
Service de gestion des concurrences avec support d'optimistic et pessimistic locking
"""
import asyncio
import functools
import time
import logging
from typing import TypeVar, Generic, Optional, Callable, Any, Type
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy import text, and_
from contextlib import contextmanager
from app.models.models import Product, User, Commande
from app.utils.exceptions import (
    OptimisticLockException, 
    ResourceLockedException, 
    DeadlockException,
    TransactionRetryException,
    StockInsufficientException,
    RaceConditionException
)

logger = logging.getLogger(__name__)

T = TypeVar('T')


class ConcurrencyManager:
    """Gestionnaire principal pour les opérations concurrentes"""
    
    # Timeout par défaut pour les verrous (en secondes)
    DEFAULT_LOCK_TIMEOUT = 30
    
    # Nombre maximum de tentatives pour les transactions
    MAX_RETRY_ATTEMPTS = 3
    
    # Délai entre les tentatives (en secondes)
    RETRY_DELAY = 0.1

    @staticmethod
    def with_optimistic_lock(model_class: Type[T]):
        """
        Décorateur pour appliquer l'optimistic locking sur une opération
        """
        def decorator(func: Callable) -> Callable:
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                db: Session = None
                entity_id: int = None
                expected_version: int = None
                
                # Extraire la session et les paramètres depuis les arguments
                for arg in args:
                    if isinstance(arg, Session):
                        db = arg
                        break
                
                # Chercher l'ID dans les kwargs ou args
                if 'id' in kwargs:
                    entity_id = kwargs['id']
                elif len(args) >= 2:
                    entity_id = args[1]  # Assume que l'ID est le second paramètre
                
                # Chercher la version attendue
                if 'expected_version' in kwargs:
                    expected_version = kwargs.pop('expected_version')
                
                if not db or entity_id is None:
                    # Si on ne peut pas extraire les infos nécessaires, exécuter sans protection
                    return func(*args, **kwargs)
                
                return ConcurrencyManager._execute_with_optimistic_lock(
                    db, model_class, entity_id, expected_version, func, *args, **kwargs
                )
            return wrapper
        return decorator

    @staticmethod
    def _execute_with_optimistic_lock(
        db: Session, 
        model_class: Type[T], 
        entity_id: int, 
        expected_version: Optional[int],
        func: Callable, 
        *args, 
        **kwargs
    ):
        """Exécute une fonction avec optimistic locking"""
        
        # Récupérer l'entité actuelle avec sa version
        entity = db.query(model_class).filter(model_class.id == entity_id).first()
        if not entity:
            return func(*args, **kwargs)
        
        current_version = getattr(entity, 'version', None)
        
        # Vérifier la version si spécifiée
        if expected_version is not None and current_version != expected_version:
            raise OptimisticLockException(
                model_class.__name__.lower(), 
                entity_id,
                f"Version attendue: {expected_version}, version actuelle: {current_version}"
            )
        
        # Exécuter la fonction
        result = func(*args, **kwargs)
        
        # Incrémenter la version après la modification
        if hasattr(entity, 'version'):
            entity.version += 1
            db.commit()
        
        return result

    @staticmethod
    @contextmanager
    def pessimistic_lock(db: Session, model_class: Type[T], entity_id: int, timeout: int = DEFAULT_LOCK_TIMEOUT):
        """
        Context manager pour le pessimistic locking avec timeout
        """
        lock_acquired = False
        start_time = time.time()
        
        try:
            # Essayer d'acquérir le verrou avec FOR UPDATE
            while not lock_acquired and (time.time() - start_time) < timeout:
                try:
                    entity = db.query(model_class).filter(
                        model_class.id == entity_id
                    ).with_for_update(nowait=True).first()
                    
                    if entity:
                        lock_acquired = True
                        logger.info(f"Verrou acquis sur {model_class.__name__} ID: {entity_id}")
                        yield entity
                    else:
                        raise ValueError(f"{model_class.__name__} avec ID {entity_id} non trouvé")
                        
                except OperationalError as e:
                    if "could not obtain lock" in str(e).lower():
                        # Attendre un peu avant de réessayer
                        time.sleep(ConcurrencyManager.RETRY_DELAY)
                        continue
                    else:
                        raise DeadlockException(f"Erreur de base de données: {str(e)}")
            
            if not lock_acquired:
                raise ResourceLockedException(model_class.__name__.lower(), entity_id)
                
        except Exception as e:
            logger.error(f"Erreur lors de l'acquisition du verrou: {str(e)}")
            raise
        finally:
            if lock_acquired:
                logger.info(f"Verrou libéré sur {model_class.__name__} ID: {entity_id}")

    @staticmethod
    def with_retry(max_attempts: int = MAX_RETRY_ATTEMPTS, delay: float = RETRY_DELAY):
        """
        Décorateur pour retry automatique des transactions
        """
        def decorator(func: Callable) -> Callable:
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                last_exception = None
                
                for attempt in range(max_attempts):
                    try:
                        return func(*args, **kwargs)
                    except (IntegrityError, OperationalError, TransactionRetryException) as e:
                        last_exception = e
                        logger.warning(f"Tentative {attempt + 1}/{max_attempts} échouée: {str(e)}")
                        
                        if attempt < max_attempts - 1:
                            time.sleep(delay * (2 ** attempt))  # Backoff exponentiel
                            continue
                        else:
                            break
                    except Exception as e:
                        # Pour les autres exceptions, on ne retry pas
                        raise
                
                # Si toutes les tentatives ont échoué
                if isinstance(last_exception, IntegrityError):
                    raise RaceConditionException("Modification de données")
                elif isinstance(last_exception, OperationalError):
                    raise DeadlockException("Opération de base de données")
                else:
                    raise last_exception
                    
            return wrapper
        return decorator

    @staticmethod
    def atomic_stock_update(db: Session, product_id: int, quantity_change: int) -> bool:
        """
        Mise à jour atomique du stock d'un produit
        Retourne True si la mise à jour a réussi, False sinon
        """
        try:
            with ConcurrencyManager.pessimistic_lock(db, Product, product_id) as product:
                new_stock = product.stock + quantity_change
                
                if new_stock < 0:
                    raise StockInsufficientException(
                        product.title, 
                        abs(quantity_change), 
                        product.stock
                    )
                
                product.stock = new_stock
                product.version += 1
                db.commit()
                
                logger.info(f"Stock mis à jour pour produit {product_id}: {product.stock} -> {new_stock}")
                return True
                
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors de la mise à jour du stock: {str(e)}")
            raise

    @staticmethod
    @with_retry(max_attempts=3)
    def safe_product_purchase(db: Session, product_id: int, requested_quantity: int) -> dict:
        """
        Achat sécurisé d'un produit avec vérification de stock
        """
        try:
            with ConcurrencyManager.pessimistic_lock(db, Product, product_id) as product:
                if not product.is_published:
                    raise ValueError(f"Le produit '{product.title}' n'est pas disponible")
                
                if product.stock < requested_quantity:
                    raise StockInsufficientException(
                        product.title,
                        requested_quantity,
                        product.stock
                    )
                
                # Réserver le stock
                product.stock -= requested_quantity
                product.version += 1
                db.commit()
                
                return {
                    "product_id": product_id,
                    "product_title": product.title,
                    "reserved_quantity": requested_quantity,
                    "remaining_stock": product.stock,
                    "unit_price": float(product.price)
                }
                
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors de l'achat du produit {product_id}: {str(e)}")
            raise

    @staticmethod
    def batch_stock_update(db: Session, stock_updates: list[dict]) -> list[dict]:
        """
        Mise à jour de stock en lot avec gestion des conflits
        stock_updates: [{"product_id": int, "quantity_change": int}, ...]
        """
        results = []
        failed_updates = []
        
        # Trier les produits par ID pour éviter les deadlocks
        sorted_updates = sorted(stock_updates, key=lambda x: x["product_id"])
        
        try:
            for update in sorted_updates:
                product_id = update["product_id"]
                quantity_change = update["quantity_change"]
                
                try:
                    success = ConcurrencyManager.atomic_stock_update(
                        db, product_id, quantity_change
                    )
                    results.append({
                        "product_id": product_id,
                        "success": success,
                        "quantity_change": quantity_change
                    })
                except Exception as e:
                    failed_updates.append({
                        "product_id": product_id,
                        "error": str(e),
                        "quantity_change": quantity_change
                    })
                    logger.error(f"Échec mise à jour stock produit {product_id}: {str(e)}")
            
            if failed_updates:
                logger.warning(f"{len(failed_updates)} mises à jour de stock ont échoué")
            
            return {
                "successful_updates": results,
                "failed_updates": failed_updates,
                "total_processed": len(stock_updates)
            }
            
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors de la mise à jour en lot: {str(e)}")
            raise


# Décorateurs de convenance
def optimistic_lock_product(func):
    """Décorateur pour optimistic locking sur les produits"""
    return ConcurrencyManager.with_optimistic_lock(Product)(func)

def optimistic_lock_user(func):
    """Décorateur pour optimistic locking sur les utilisateurs"""
    return ConcurrencyManager.with_optimistic_lock(User)(func)

def optimistic_lock_commande(func):
    """Décorateur pour optimistic locking sur les commandes"""
    return ConcurrencyManager.with_optimistic_lock(Commande)(func)

def retry_on_conflict(func):
    """Décorateur pour retry automatique"""
    return ConcurrencyManager.with_retry()(func)
