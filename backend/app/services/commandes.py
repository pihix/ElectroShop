from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from app.models.models import Commande, LigneCommande, Product, User
from app.schemas.commandes import CommandeCreate, CommandeUpdate, CommandeResponse, CommandeListResponse, StatutCommande
from app.utils.responses import ResponseHandler


class CommandeService:
    
    @staticmethod
    async def create_commande(db: Session, commande_data: CommandeCreate, user_id: int):
        """Créer une nouvelle commande avec ses lignes de commande"""
        
        # Calculer le total et vérifier la disponibilité des produits
        total_amount = 0.0
        lignes_to_create = []
        
        for ligne_data in commande_data.lignes_commande:
            # Vérifier que le produit existe et est disponible
            product = db.query(Product).filter(Product.id == ligne_data.product_id).first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Produit avec l'ID {ligne_data.product_id} non trouvé"
                )
            
            if not product.is_published:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Le produit '{product.title}' n'est pas disponible"
                )
            
            if product.stock < ligne_data.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Stock insuffisant pour '{product.title}'. Stock disponible: {product.stock}"
                )
            
            # Utiliser le prix actuel du produit
            prix_unitaire = float(product.price)
            subtotal = prix_unitaire * ligne_data.quantity
            total_amount += subtotal
            
            lignes_to_create.append({
                "product_id": ligne_data.product_id,
                "quantity": ligne_data.quantity,
                "prix_unitaire": prix_unitaire,
                "subtotal": subtotal
            })
        
        # Créer la commande
        commande = Commande(
            user_id=user_id,
            statut=commande_data.statut,
            total_amount=total_amount
        )
        
        db.add(commande)
        db.commit()
        db.refresh(commande)
        
        # Créer les lignes de commande
        for ligne_info in lignes_to_create:
            ligne = LigneCommande(
                commande_id=commande.id,
                **ligne_info
            )
            db.add(ligne)
            
            # Décrémenter le stock du produit
            product = db.query(Product).filter(Product.id == ligne_info["product_id"]).first()
            product.stock -= ligne_info["quantity"]
        
        db.commit()
        db.refresh(commande)
        
        # Créer une structure de données simple pour éviter les problèmes de sérialisation
        commande_data = {
            "id": commande.id,
            "statut": commande.statut,
            "total_amount": float(commande.total_amount),
            "user_id": commande.user_id,
            "date_commande": commande.date_commande.isoformat() if commande.date_commande else None
        }
        
        return ResponseHandler.create_success("Commande", commande.id, commande_data)
    
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
        
        return ResponseHandler.success("Statut de la commande mis à jour avec succès", commande_data)
    
    @staticmethod
    async def cancel_commande(db: Session, commande_id: int, user_id: int, is_admin: bool = False):
        """Annuler une commande et restaurer le stock"""
        query = db.query(Commande).filter(Commande.id == commande_id)
        
        if not is_admin:
            query = query.filter(Commande.user_id == user_id)
        
        commande = query.first()
        if not commande:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Commande non trouvée"
            )
        
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
        
        # Restaurer le stock des produits
        for ligne in commande.lignes_commande:
            product = db.query(Product).filter(Product.id == ligne.product_id).first()
            if product:
                product.stock += ligne.quantity
        
        # Mettre à jour le statut
        commande.statut = StatutCommande.annulee
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
        
        return ResponseHandler.success("Commande annulée avec succès", commande_data)
