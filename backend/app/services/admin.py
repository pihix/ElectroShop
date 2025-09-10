from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.models import User
from app.utils.responses import ResponseHandler
from typing import Literal


class AdminService:
    
    @staticmethod
    async def promote_user_to_admin(db: Session, user_id: int, current_admin_id: int):
        """Promouvoir un utilisateur au rôle admin (seul un admin peut le faire)"""
        
        # Vérifier que l'utilisateur actuel est admin
        current_admin = db.query(User).filter(User.id == current_admin_id).first()
        if not current_admin or current_admin.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Seul un administrateur peut promouvoir des utilisateurs"
            )
        
        # Vérifier que l'utilisateur à promouvoir existe
        user_to_promote = db.query(User).filter(User.id == user_id).first()
        if not user_to_promote:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Utilisateur avec l'ID {user_id} non trouvé"
            )
        
        if user_to_promote.role == "admin":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet utilisateur est déjà administrateur"
            )
        
        # Promouvoir l'utilisateur
        user_to_promote.role = "admin"
        db.commit()
        db.refresh(user_to_promote)
        
        return ResponseHandler.success_response(
            message=f"Utilisateur {user_to_promote.username} promu administrateur avec succès",
            data={
                "id": user_to_promote.id,
                "username": user_to_promote.username,
                "role": user_to_promote.role
            }
        )
    
    @staticmethod
    async def demote_admin_to_user(db: Session, user_id: int, current_admin_id: int):
        """Rétrograder un admin au rôle user"""
        
        # Vérifier que l'utilisateur actuel est admin
        current_admin = db.query(User).filter(User.id == current_admin_id).first()
        if not current_admin or current_admin.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Seul un administrateur peut rétrograder des utilisateurs"
            )
        
        # Empêcher l'auto-rétrogradation
        if user_id == current_admin_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vous ne pouvez pas vous rétrograder vous-même"
            )
        
        # Vérifier que l'utilisateur à rétrograder existe
        user_to_demote = db.query(User).filter(User.id == user_id).first()
        if not user_to_demote:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Utilisateur avec l'ID {user_id} non trouvé"
            )
        
        if user_to_demote.role == "user":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet utilisateur est déjà un utilisateur normal"
            )
        
        # Vérifier qu'il reste au moins un admin
        admin_count = db.query(User).filter(User.role == "admin").count()
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Impossible de rétrograder le dernier administrateur"
            )
        
        # Rétrograder l'utilisateur
        user_to_demote.role = "user"
        db.commit()
        db.refresh(user_to_demote)
        
        return ResponseHandler.success_response(
            message=f"Utilisateur {user_to_demote.username} rétrogradé en utilisateur normal",
            data={
                "id": user_to_demote.id,
                "username": user_to_demote.username,
                "role": user_to_demote.role
            }
        )
    
    @staticmethod
    async def list_all_users(db: Session, skip: int = 0, limit: int = 100):
        """Lister tous les utilisateurs avec leurs rôles"""
        
        users = db.query(User).offset(skip).limit(limit).all()
        
        users_data = []
        for user in users:
            users_data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_active": user.is_active,
                "created_at": user.created_at
            })
        
        return ResponseHandler.success_response(data=users_data)
    
    @staticmethod
    async def create_first_admin(db: Session, username: str, email: str, full_name: str, password: str):
        """Créer le premier admin si aucun n'existe (à utiliser une seule fois)"""
        
        # Vérifier qu'aucun admin n'existe
        existing_admin = db.query(User).filter(User.role == "admin").first()
        if existing_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un administrateur existe déjà dans le système"
            )
        
        # Vérifier que l'utilisateur n'existe pas déjà
        existing_user = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un utilisateur avec ce nom d'utilisateur ou email existe déjà"
            )
        
        from app.core.security import get_password_hash
        hashed_password = get_password_hash(password)
        
        admin_user = User(
            username=username,
            email=email,
            full_name=full_name,
            password=hashed_password,
            role="admin",
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        return ResponseHandler.create_success(
            message="Premier administrateur créé avec succès",
            id=admin_user.id,
            data={
                "id": admin_user.id,
                "username": admin_user.username,
                "email": admin_user.email,
                "role": admin_user.role
            }
        )
