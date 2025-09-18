from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional
from app.models.models import Commande, LigneCommande, Product
from app.schemas.commandes import CommandeCreate, StatutCommande
from app.utils.responses import ResponseHandler


class CommandeService:

    @staticmethod
    async def create_commande(db: Session, commande_data: CommandeCreate, user_id: int):
        """
        Créer une nouvelle commande avec pessimistic locking sur les produits.
        Décrémenter le stock de façon transactionnelle.
        """

        try:
            total_amount = 0.0
            lignes_to_create = []

            # Commencer une transaction
            for ligne_data in commande_data.lignes_commande:
                # ⚠️ LOCK pessimiste pour éviter que deux utilisateurs prennent le même stock
                product = db.execute(
                    select(Product).where(Product.id == ligne_data.product_id).with_for_update()
                ).scalar_one_or_none()

                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Produit avec ID {ligne_data.product_id} non trouvé"
                    )

                if not product.is_published:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Le produit '{product.title}' n'est pas disponible"
                    )

                if product.stock < ligne_data.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Stock insuffisant pour '{product.title}'. Disponible: {product.stock}"
                    )

                prix_unitaire = float(product.price)
                subtotal = prix_unitaire * ligne_data.quantity
                total_amount += subtotal

                lignes_to_create.append({
                    "product_id": ligne_data.product_id,
                    "quantity": ligne_data.quantity,
                    "prix_unitaire": prix_unitaire,
                    "subtotal": subtotal
                })

                # Décrémentation immédiate (réservé)
                product.stock -= ligne_data.quantity

            # Création de la commande
            commande = Commande(
                user_id=user_id,
                statut=StatutCommande.en_attente,
                total_amount=total_amount
            )
            db.add(commande)
            db.flush()  # on flush pour avoir commande.id sans commit

            # Création des lignes
            for ligne_info in lignes_to_create:
                ligne = LigneCommande(commande_id=commande.id, **ligne_info)
                db.add(ligne)

            db.commit()
            db.refresh(commande)

            return ResponseHandler.create_success("Commande", commande.id, {
                "id": commande.id,
                "statut": commande.statut,
                "total_amount": float(commande.total_amount),
                "user_id": commande.user_id,
                "date_commande": commande.date_commande.isoformat() if commande.date_commande else None
            })

        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail="Erreur lors de la création de commande")

    @staticmethod
    async def confirmer_paiement(db: Session, commande_id: int, is_admin: bool = False):
        """
        Confirme le paiement d'une commande et change le statut en 'confirmée'.
        """
        commande = db.query(Commande).filter(Commande.id == commande_id).first()
        if not commande:
            raise HTTPException(status_code=404, detail="Commande introuvable")

        if commande.statut != StatutCommande.en_attente:
            raise HTTPException(status_code=400, detail="Commande déjà traitée")

        commande.statut = StatutCommande.confirmee
        db.commit()
        db.refresh(commande)

        return ResponseHandler.success("Commande confirmée avec succès", {
            "id": commande.id,
            "statut": commande.statut,
            "total_amount": float(commande.total_amount)
        })

    @staticmethod
    async def cancel_commande(db: Session, commande_id: int, user_id: Optional[int], is_admin: bool = False):
        """
        Annuler une commande, restaurer le stock réservé.
        """
        commande = db.query(Commande).filter(Commande.id == commande_id)
        if not is_admin:
            commande = commande.filter(Commande.user_id == user_id)

        commande = commande.first()
        if not commande:
            raise HTTPException(status_code=404, detail="Commande non trouvée")

        if commande.statut in [StatutCommande.expediee, StatutCommande.livree]:
            raise HTTPException(status_code=400, detail="Impossible d'annuler une commande déjà expédiée/livrée")

        for ligne in commande.lignes_commande:
            product = db.query(Product).filter(Product.id == ligne.product_id).first()
            if product:
                product.stock += ligne.quantity  # ✅ on restaure le stock

        commande.statut = StatutCommande.annulee
        db.commit()
        db.refresh(commande)

        return ResponseHandler.success("Commande annulée et stock restauré", {
            "id": commande.id,
            "statut": commande.statut
        })
    



