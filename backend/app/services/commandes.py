from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
import logging
from app.models.models import Commande, LigneCommande, Product, User
from app.schemas.commandes import CommandeCreate, CommandeUpdate, CommandeResponse, CommandeListResponse, StatutCommande
from app.utils.responses import ResponseHandler
from app.services.concurrency import ConcurrencyManager, optimistic_lock_commande, retry_on_conflict
from app.utils.exceptions import OptimisticLockException, StockInsufficientException, RaceConditionException

logger = logging.getLogger(__name__)


class CommandeService:
    
    @staticmethod
    @retry_on_conflict
    async def create_commande(db: Session, commande_data: CommandeCreate, user_id: int):
        """Créer une nouvelle commande avec gestion de concurrence sur les stocks"""
        
        try:
            # Préparer les réservations de stock
            stock_reservations = []
            total_amount = 0.0
            
            # Phase 1: Valider et réserver tous les stocks de manière atomique
            for ligne_data in commande_data.lignes_commande:
                try:
                    # Utiliser la méthode de réservation sécurisée
                    reservation = ConcurrencyManager.safe_product_purchase(
                        db, ligne_data.product_id, ligne_data.quantity
                    )
                    stock_reservations.append({
                        "ligne_data": ligne_data,
                        "reservation": reservation
                    })
                    total_amount += reservation["unit_price"] * ligne_data.quantity
                    
                except StockInsufficientException as e:
                    # Annuler toutes les réservations précédentes
                    await CommandeService._rollback_stock_reservations(db, stock_reservations)
                    raise e
                except Exception as e:
                    await CommandeService._rollback_stock_reservations(db, stock_reservations)
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Erreur lors de la réservation du produit {ligne_data.product_id}: {str(e)}"
                    )
            
            # Phase 2: Créer la commande si toutes les réservations ont réussi
            try:
                commande = Commande(
                    user_id=user_id,
                    statut=commande_data.statut,
                    total_amount=total_amount,
                    version=1
                )
                
                db.add(commande)
                db.commit()
                db.refresh(commande)
                
                # Phase 3: Créer les lignes de commande
                for stock_info in stock_reservations:
                    ligne_data = stock_info["ligne_data"]
                    reservation = stock_info["reservation"]
                    
                    ligne = LigneCommande(
                        commande_id=commande.id,
                        product_id=ligne_data.product_id,
                        quantity=ligne_data.quantity,
                        prix_unitaire=reservation["unit_price"],
                        subtotal=reservation["unit_price"] * ligne_data.quantity
                    )
                    db.add(ligne)
                
                db.commit()
                db.refresh(commande)
                
                logger.info(f"Commande {commande.id} créée avec succès pour l'utilisateur {user_id}")
                
                # Structure de données simple pour éviter les problèmes de sérialisation
                commande_data_response = {
                    "id": commande.id,
                    "statut": commande.statut,
                    "total_amount": float(commande.total_amount),
                    "user_id": commande.user_id,
                    "date_commande": commande.date_commande.isoformat() if commande.date_commande else None,
                    "version": commande.version
                }
                
                return ResponseHandler.create_success("Commande", commande.id, commande_data_response)
                
            except Exception as e:
                # En cas d'erreur lors de la création de la commande, annuler les réservations
                await CommandeService._rollback_stock_reservations(db, stock_reservations)
                db.rollback()
                logger.error(f"Erreur lors de la création de la commande: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Erreur lors de la création de la commande"
                )
                
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur générale lors de la création de la commande: {str(e)}")
            raise
    
    @staticmethod
    async def get_commande_by_id(db: Session, commande_id: int, user_id: int, is_admin: bool = False):
        """Récupérer une commande par son ID"""
        query = db.query(Commande).filter(Commande.id == commande_id)
        
        # Si ce n'est pas un admin, limiter aux commandes de l'utilisateur
        if not is_admin:
            query = query.filter(Commande.user_id == user_id)
        
        commande = query.first()
        if not commande:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Commande non trouvée"
            )
        
        # Créer une structure de données simple
        commande_data = {
            "id": commande.id,
            "statut": commande.statut,
            "total_amount": float(commande.total_amount),
            "user_id": commande.user_id,
            "date_commande": commande.date_commande.isoformat() if commande.date_commande else None
        }
        
        return ResponseHandler.success("Commande récupérée avec succès", commande_data)
    
    @staticmethod
    async def get_commandes_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
        """Récupérer toutes les commandes d'un utilisateur"""
        commandes = db.query(Commande).filter(
            Commande.user_id == user_id
        ).offset(skip).limit(limit).all()
        
        # Convertir les commandes en structures de données simples
        commandes_data = []
        for commande in commandes:
            commandes_data.append({
                "id": commande.id,
                "statut": commande.statut,
                "total_amount": float(commande.total_amount),
                "user_id": commande.user_id,
                "date_commande": commande.date_commande.isoformat() if commande.date_commande else None
            })
        
        return ResponseHandler.success("Commandes de l'utilisateur récupérées", commandes_data)
    
    @staticmethod
    async def get_all_commandes(db: Session, skip: int = 0, limit: int = 100, statut: Optional[StatutCommande] = None):
        """Récupérer toutes les commandes (admin seulement)"""
        query = db.query(Commande)
        
        if statut:
            query = query.filter(Commande.statut == statut)
        
        commandes = query.offset(skip).limit(limit).all()
        
        # Convertir les commandes en structures de données simples
        commandes_data = []
        for commande in commandes:
            commandes_data.append({
                "id": commande.id,
                "statut": commande.statut,
                "total_amount": float(commande.total_amount),
                "user_id": commande.user_id,
                "date_commande": commande.date_commande.isoformat() if commande.date_commande else None
            })
            
        return ResponseHandler.success("Toutes les commandes récupérées", commandes_data)
    
    @staticmethod
    async def update_commande_status(db: Session, commande_id: int, statut: StatutCommande, user_id: int = None, is_admin: bool = False):
        """Mettre à jour le statut d'une commande"""
        query = db.query(Commande).filter(Commande.id == commande_id)
        
        # Si ce n'est pas un admin, limiter aux commandes de l'utilisateur
        if not is_admin and user_id:
            query = query.filter(Commande.user_id == user_id)
        
        commande = query.first()
        if not commande:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Commande non trouvée"
            )
        
        # Vérifier les transitions de statut autorisées
        if not is_admin and commande.statut in [StatutCommande.expediee, StatutCommande.livree]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous ne pouvez pas modifier une commande expédiée ou livrée"
            )
        
        commande.statut = statut
        db.commit()
        db.refresh(commande)
        
        # Créer une structure de données simple
        commande_data = {
            "id": commande.id,
            "statut": commande.statut,
            "total_amount": float(commande.total_amount),
            "user_id": commande.user_id,
            "date_commande": commande.date_commande.isoformat() if commande.date_commande else None
        }
        
    @staticmethod
    async def _rollback_stock_reservations(db: Session, stock_reservations: list):
        """Annuler les réservations de stock en cas d'erreur"""
        for stock_info in stock_reservations:
            try:
                reservation = stock_info["reservation"]
                product_id = reservation["product_id"]
                quantity = reservation["reserved_quantity"]
                
                # Restaurer le stock
                ConcurrencyManager.atomic_stock_update(db, product_id, quantity)
                logger.info(f"Stock restauré pour le produit {product_id}: +{quantity}")
                
            except Exception as e:
                logger.error(f"Erreur lors de la restauration du stock: {str(e)}")

    @staticmethod
    @retry_on_conflict
    async def update_commande_status(db: Session, commande_id: int, statut: StatutCommande, 
                                   user_id: int = None, is_admin: bool = False, expected_version: int = None):
        """Mettre à jour le statut d'une commande avec optimistic locking"""
        try:
            with ConcurrencyManager.pessimistic_lock(db, Commande, commande_id) as commande:
                if not commande:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Commande non trouvée"
                    )
                
                # Vérifier la propriété si ce n'est pas un admin
                if not is_admin and user_id and commande.user_id != user_id:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Accès non autorisé à cette commande"
                    )
                
                # Vérifier la version si fournie
                if expected_version is not None and commande.version != expected_version:
                    raise OptimisticLockException("commande", commande_id)
                
                # Vérifier les transitions de statut autorisées
                if not is_admin and commande.statut in [StatutCommande.expediee, StatutCommande.livree]:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Vous ne pouvez pas modifier une commande expédiée ou livrée"
                    )
                
                old_status = commande.statut
                commande.statut = statut
                commande.version += 1
                db.commit()
                db.refresh(commande)
                
                logger.info(f"Statut de la commande {commande_id} mis à jour: {old_status} -> {statut}")
                
                # Structure de données simple
                commande_data = {
                    "id": commande.id,
                    "statut": commande.statut,
                    "total_amount": float(commande.total_amount),
                    "user_id": commande.user_id,
                    "date_commande": commande.date_commande.isoformat() if commande.date_commande else None,
                    "version": commande.version
                }
                
                return ResponseHandler.success("Statut de la commande mis à jour avec succès", commande_data)
                
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors de la mise à jour du statut: {str(e)}")
            raise
    
    @staticmethod
    @retry_on_conflict
    async def cancel_commande(db: Session, commande_id: int, user_id: int, is_admin: bool = False, expected_version: int = None):
        """Annuler une commande et restaurer le stock avec gestion de concurrence"""
        try:
            with ConcurrencyManager.pessimistic_lock(db, Commande, commande_id) as commande:
                if not commande:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Commande non trouvée"
                    )
                
                # Vérifier la propriété si ce n'est pas un admin
                if not is_admin and commande.user_id != user_id:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Accès non autorisé à cette commande"
                    )
                
                # Vérifier la version si fournie
                if expected_version is not None and commande.version != expected_version:
                    raise OptimisticLockException("commande", commande_id)
                
                if commande.statut in [StatutCommande.expediee, StatutCommande.livree]:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Impossible d'annuler une commande expédiée ou livrée"
                    )
                
                if commande.statut == StatutCommande.annulee:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Cette commande est déjà annulée"
                    )
                
                # Restaurer le stock des produits de manière atomique
                stock_updates = []
                for ligne in commande.lignes_commande:
                    stock_updates.append({
                        "product_id": ligne.product_id,
                        "quantity_change": ligne.quantity  # Ajout de stock
                    })
                
                # Effectuer la restauration de stock en lot
                if stock_updates:
                    result = ConcurrencyManager.batch_stock_update(db, stock_updates)
                    if result["failed_updates"]:
                        logger.warning(f"Certaines restaurations de stock ont échoué: {result['failed_updates']}")
                
                # Mettre à jour le statut
                commande.statut = StatutCommande.annulee
                commande.version += 1
                db.commit()
                db.refresh(commande)
                
                logger.info(f"Commande {commande_id} annulée avec succès")
                
                # Structure de données simple
                commande_data_response = {
                    "id": commande.id,
                    "statut": commande.statut,
                    "total_amount": float(commande.total_amount),
                    "user_id": commande.user_id,
                    "date_commande": commande.date_commande.isoformat() if commande.date_commande else None,
                    "version": commande.version
                }
                
                return ResponseHandler.success("Commande annulée avec succès", commande_data_response)
                
        except Exception as e:
            db.rollback()
            logger.error(f"Erreur lors de l'annulation de la commande {commande_id}: {str(e)}")
            raise
