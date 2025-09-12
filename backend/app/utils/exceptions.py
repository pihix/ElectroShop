"""
Exceptions personnalisées pour la gestion des concurrences
"""
from fastapi import HTTPException, status


class ConcurrencyException(HTTPException):
    """Exception de base pour les problèmes de concurrence"""
    def __init__(self, detail: str = "Conflit de concurrence détecté"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class OptimisticLockException(ConcurrencyException):
    """Exception levée lors d'un conflit d'optimistic locking"""
    def __init__(self, resource_type: str, resource_id: int, detail: str = None):
        if detail is None:
            detail = f"Le {resource_type} avec l'ID {resource_id} a été modifié par un autre utilisateur. Veuillez recharger et réessayer."
        super().__init__(detail=detail)


class StockInsufficientException(ConcurrencyException):
    """Exception levée quand le stock est insuffisant"""
    def __init__(self, product_name: str, requested_quantity: int, available_stock: int):
        detail = f"Stock insuffisant pour '{product_name}'. Quantité demandée: {requested_quantity}, Stock disponible: {available_stock}"
        super().__init__(detail=detail)


class ResourceLockedException(ConcurrencyException):
    """Exception levée quand une ressource est verrouillée"""
    def __init__(self, resource_type: str, resource_id: int):
        detail = f"Le {resource_type} avec l'ID {resource_id} est actuellement verrouillé par une autre opération"
        super().__init__(detail=detail)


class DeadlockException(ConcurrencyException):
    """Exception levée en cas de deadlock détecté"""
    def __init__(self, detail: str = "Deadlock détecté, veuillez réessayer"):
        super().__init__(detail=detail)


class RaceConditionException(ConcurrencyException):
    """Exception levée en cas de race condition détectée"""
    def __init__(self, operation: str):
        detail = f"Race condition détectée lors de l'opération: {operation}. Veuillez réessayer."
        super().__init__(detail=detail)


class TransactionRetryException(Exception):
    """Exception interne pour indiquer qu'une transaction doit être relancée"""
    def __init__(self, retry_count: int = 0, max_retries: int = 3):
        self.retry_count = retry_count
        self.max_retries = max_retries
        super().__init__(f"Transaction retry {retry_count}/{max_retries}")
