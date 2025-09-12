from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.models import Product, Category
from app.schemas.products import ProductCreate, ProductUpdate
from app.utils.responses import ResponseHandler
from app.services.concurrency import ConcurrencyManager, optimistic_lock_product, retry_on_conflict
from app.utils.exceptions import OptimisticLockException, StockInsufficientException
import logging

logger = logging.getLogger(__name__)


class ProductService:
    @staticmethod
    def get_all_products(db: Session, page: int, limit: int, search: str = ""):
        products = db.query(Product).order_by(Product.id.asc()).filter(
            Product.title.contains(search)).limit(limit).offset((page - 1) * limit).all()
        return {"message": f"Page {page} with {limit} products", "data": products}

    @staticmethod
    def get_product(db: Session, product_id: int):
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            ResponseHandler.not_found_error("Product", product_id)
        return ResponseHandler.get_single_success(product.title, product_id, product)

    @staticmethod
    def create_product(db: Session, product: ProductCreate):
        category_exists = db.query(Category).filter(Category.id == product.category_id).first()
        if not category_exists:
            ResponseHandler.not_found_error("Category", product.category_id)

        product_dict = product.model_dump()
        db_product = Product(**product_dict)
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return ResponseHandler.create_success(db_product.title, db_product.id, db_product)

    @staticmethod
    @retry_on_conflict
    def update_product(db: Session, product_id: int, updated_product: ProductUpdate, expected_version: int = None):
        """Mise à jour sécurisée d'un produit avec optimistic locking"""
        try:
            with ConcurrencyManager.pessimistic_lock(db, Product, product_id) as db_product:
                if not db_product:
                    ResponseHandler.not_found_error("Product", product_id)
                
                # Vérifier la version si fournie (optimistic locking)
                if expected_version is not None and db_product.version != expected_version:
                    raise OptimisticLockException("product", product_id)
                
                # Appliquer les modifications
                update_data = updated_product.model_dump(exclude_unset=True)
                for key, value in update_data.items():
                    setattr(db_product, key, value)
                
                # Incrémenter la version
                db_product.version += 1
                db.commit()
                db.refresh(db_product)
                
                logger.info(f"Produit {product_id} mis à jour avec succès")
                return ResponseHandler.update_success(db_product.title, db_product.id, db_product)
                
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors de la mise à jour du produit {product_id}: {str(e)}")
            raise

    @staticmethod
    @retry_on_conflict
    def delete_product(db: Session, product_id: int, expected_version: int = None):
        """Suppression sécurisée d'un produit avec vérification des contraintes"""
        try:
            with ConcurrencyManager.pessimistic_lock(db, Product, product_id) as db_product:
                if not db_product:
                    ResponseHandler.not_found_error("Product", product_id)
                
                # Vérifier la version si fournie
                if expected_version is not None and db_product.version != expected_version:
                    raise OptimisticLockException("product", product_id)
                
                # Vérifier s'il y a des commandes en cours pour ce produit
                from app.models.models import LigneCommande, Commande
                active_orders = db.query(LigneCommande).join(Commande).filter(
                    LigneCommande.product_id == product_id,
                    Commande.statut.in_(["en_attente", "confirmee"])
                ).first()
                
                if active_orders:
                    raise ValueError("Impossible de supprimer un produit avec des commandes en cours")
                
                product_title = db_product.title
                db.delete(db_product)
                db.commit()
                
                logger.info(f"Produit {product_id} supprimé avec succès")
                return ResponseHandler.delete_success(product_title, product_id, {"deleted": True})
                
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors de la suppression du produit {product_id}: {str(e)}")
            raise
    @staticmethod
    @retry_on_conflict
    def update_stock(db: Session, product_id: int, new_stock: int, expected_version: int = None):
        """Mise à jour sécurisée du stock d'un produit"""
        try:
            success = ConcurrencyManager.atomic_stock_update(
                db, product_id, new_stock - db.query(Product).filter(Product.id == product_id).first().stock
            )
            if success:
                product = db.query(Product).filter(Product.id == product_id).first()
                return ResponseHandler.update_success(f"Stock de {product.title}", product.id, {"stock": product.stock})
        except StockInsufficientException as e:
            logger.error(f"Stock insuffisant pour le produit {product_id}: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Erreur lors de la mise à jour du stock: {str(e)}")
            raise

    @staticmethod
    @retry_on_conflict
    def reserve_product_stock(db: Session, product_id: int, quantity: int):
        """Réserver une quantité de stock pour un produit"""
        try:
            reservation = ConcurrencyManager.safe_product_purchase(db, product_id, quantity)
            return ResponseHandler.success(
                f"Stock réservé pour {reservation['product_title']}", 
                reservation
            )
        except StockInsufficientException as e:
            logger.error(f"Impossible de réserver le stock: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Erreur lors de la réservation: {str(e)}")
            raise

    @staticmethod
    def batch_update_stock(db: Session, stock_updates: list[dict]):
        """Mise à jour de stock en lot"""
        try:
            result = ConcurrencyManager.batch_stock_update(db, stock_updates)
            return ResponseHandler.success("Mise à jour de stock en lot terminée", result)
        except Exception as e:
            logger.error(f"Erreur lors de la mise à jour en lot: {str(e)}")
            raise
