from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class StatutCommande(str, Enum):
    en_attente = "en_attente"
    confirmee = "confirmee"
    expediee = "expediee"
    livree = "livree"
    annulee = "annulee"


# Schéma pour LigneCommande
class LigneCommandeBase(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, description="La quantité doit être positive")
    prix_unitaire: float = Field(gt=0, description="Le prix unitaire doit être positif")


class LigneCommandeCreate(LigneCommandeBase):
    pass


class LigneCommandeUpdate(BaseModel):
    quantity: Optional[int] = Field(None, gt=0)


class LigneCommandeResponse(LigneCommandeBase):
    id: int
    commande_id: int
    subtotal: float
    
    class Config:
        from_attributes = True


# Schéma pour Commande
class CommandeBase(BaseModel):
    statut: Optional[StatutCommande] = StatutCommande.en_attente


class CommandeCreate(CommandeBase):
    lignes_commande: List[LigneCommandeCreate] = Field(..., min_items=1, description="Une commande doit avoir au moins une ligne")


class CommandeUpdate(BaseModel):
    statut: Optional[StatutCommande] = None


class CommandeResponse(CommandeBase):
    id: int
    user_id: int
    date_commande: datetime
    total_amount: float
    lignes_commande: List[LigneCommandeResponse] = []
    
    class Config:
        from_attributes = True


class CommandeListResponse(BaseModel):
    id: int
    user_id: int
    date_commande: datetime
    statut: StatutCommande
    total_amount: float
    nombre_articles: int  # Nombre total d'articles dans la commande
    
    class Config:
        from_attributes = True
