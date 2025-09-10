from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.services.commandes import CommandeService
from app.db.database import get_db
from app.schemas.commandes import (
    CommandeCreate, 
    CommandeUpdate, 
    CommandeResponse, 
    CommandeListResponse,
    StatutCommande
)
from app.core.security import auth_scheme, get_current_user, check_admin_role
from fastapi.security.http import HTTPAuthorizationCredentials


router = APIRouter(tags=["Commandes"], prefix="/commandes")


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=dict)
async def create_commande(
    commande: CommandeCreate,
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(auth_scheme)
):
    """Créer une nouvelle commande"""
    user_id = get_current_user(token)
    return await CommandeService.create_commande(db, commande, user_id)


@router.get("/mes-commandes", status_code=status.HTTP_200_OK)
async def get_my_commandes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(auth_scheme)
):
    """Récupérer toutes mes commandes"""
    user_id = get_current_user(token)
    return await CommandeService.get_commandes_by_user(db, user_id, skip, limit)


@router.get("/admin/all", status_code=status.HTTP_200_OK)
async def get_all_commandes_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    statut: Optional[StatutCommande] = Query(None),
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(check_admin_role)
):
    """Récupérer toutes les commandes (admin seulement)"""
    return await CommandeService.get_all_commandes(db, skip, limit, statut)


@router.get("/{commande_id}", status_code=status.HTTP_200_OK)
async def get_commande_by_id(
    commande_id: int,
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(auth_scheme)
):
    """Récupérer une commande par son ID"""
    user_id = get_current_user(token)
    return await CommandeService.get_commande_by_id(db, commande_id, user_id)


@router.get("/admin/{commande_id}", status_code=status.HTTP_200_OK)
async def get_commande_by_id_admin(
    commande_id: int,
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(check_admin_role)
):
    """Récupérer une commande par son ID (admin)"""
    return await CommandeService.get_commande_by_id(db, commande_id, None, is_admin=True)


@router.patch("/{commande_id}/statut", status_code=status.HTTP_200_OK)
async def update_commande_status(
    commande_id: int,
    statut: StatutCommande,
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(auth_scheme)
):
    """Mettre à jour le statut d'une commande"""
    user_id = get_current_user(token)
    return await CommandeService.update_commande_status(db, commande_id, statut, user_id)


@router.patch("/admin/{commande_id}/statut", status_code=status.HTTP_200_OK)
async def update_commande_status_admin(
    commande_id: int,
    statut: StatutCommande,
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(check_admin_role)
):
    """Mettre à jour le statut d'une commande (admin)"""
    return await CommandeService.update_commande_status(db, commande_id, statut, is_admin=True)


@router.delete("/{commande_id}/cancel", status_code=status.HTTP_200_OK)
async def cancel_commande(
    commande_id: int,
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(auth_scheme)
):
    """Annuler une commande"""
    user_id = get_current_user(token)
    return await CommandeService.cancel_commande(db, commande_id, user_id)


@router.delete("/admin/{commande_id}/cancel", status_code=status.HTTP_200_OK)
async def cancel_commande_admin(
    commande_id: int,
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(check_admin_role)
):
    """Annuler une commande (admin)"""
    return await CommandeService.cancel_commande(db, commande_id, None, is_admin=True)
