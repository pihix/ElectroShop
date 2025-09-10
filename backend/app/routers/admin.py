from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.services.admin import AdminService
from app.db.database import get_db
from app.core.security import auth_scheme, get_current_user, check_admin_role
from fastapi.security.http import HTTPAuthorizationCredentials
from pydantic import BaseModel


router = APIRouter(tags=["Administration"], prefix="/admin")


class CreateFirstAdminRequest(BaseModel):
    username: str
    email: str
    full_name: str
    password: str


class PromoteUserRequest(BaseModel):
    user_id: int


@router.post("/create-first-admin", status_code=status.HTTP_201_CREATED)
async def create_first_admin(
    admin_data: CreateFirstAdminRequest,
    db: Session = Depends(get_db)
):
    """Créer le premier administrateur du système (à utiliser une seule fois)"""
    return await AdminService.create_first_admin(
        db, 
        admin_data.username, 
        admin_data.email, 
        admin_data.full_name, 
        admin_data.password
    )


@router.get("/users", status_code=status.HTTP_200_OK)
async def list_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(check_admin_role)
):
    """Lister tous les utilisateurs (admin seulement)"""
    return await AdminService.list_all_users(db, skip, limit)


@router.post("/promote-user", status_code=status.HTTP_200_OK)
async def promote_user_to_admin(
    request: PromoteUserRequest,
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(check_admin_role)
):
    """Promouvoir un utilisateur au rôle administrateur"""
    current_admin_id = get_current_user(token)
    return await AdminService.promote_user_to_admin(db, request.user_id, current_admin_id)


@router.post("/demote-user", status_code=status.HTTP_200_OK)
async def demote_admin_to_user(
    request: PromoteUserRequest,
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(check_admin_role)
):
    """Rétrograder un administrateur au rôle utilisateur"""
    current_admin_id = get_current_user(token)
    return await AdminService.demote_admin_to_user(db, request.user_id, current_admin_id)
