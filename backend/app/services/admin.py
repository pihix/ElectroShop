from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.models import User
from app.utils.responses import ResponseHandler
from typing import Literal

from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from app.db.database import get_db
from app.models.models import User
from app.core.security import verify_password
from app.services.auth import get_user_token  # réutilise la fonction existante de génération de tokens
from fastapi.encoders import jsonable_encoder


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
    
    # @staticmethod
    # async def list_all_users(db: Session, skip: int = 0, limit: int = 100):
    #     """Lister tous les utilisateurs avec leurs rôles"""
        
    #     users = db.query(User).offset(skip).limit(limit).all()
        
    #     users_data = []
    #     for user in users:
    #         users_data.append({
    #             "id": user.id,
    #             "username": user.username,
    #             "email": user.email,
    #             "full_name": user.full_name,
    #             "role": user.role,
    #             "is_active": user.is_active,
    #             "created_at": user.created_at
    #         })
        
    #     return ResponseHandler.success_response(data=users_data)


    # @staticmethod
    # async def list_all_users(db: Session, skip: int = 0, limit: int = 100):
    #     try:
    #         users = db.query(User).offset(skip).limit(limit).all()
    #         users_data = [
    #             {
    #                 "id": user.id,
    #                 "username": user.username,
    #                 "email": user.email,
    #                 "full_name": user.full_name,
    #                 "role": user.role,
    #                 "is_active": user.is_active,
    #                 "created_at": user.created_at
    #             }
    #             for user in users
    #         ]
    #         return ResponseHandler.success_response(data=users_data)
    #     except Exception as e:
    #         print("Erreur list_all_users:", e)
    #         raise HTTPException(status_code=500, detail="Erreur serveur interne")

    @staticmethod
    async def list_all_users(db: Session, skip: int = 0, limit: int = 100):
        try:
            users = db.query(User).offset(skip).limit(limit).all()
            print("Users fetched from DB:", users)
            users_data = [
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role,
                    "is_active": user.is_active,
                    "created_at": str(user.created_at) if user.created_at else None,
                    "has_password": user.password if user.password else False
                }
                for user in users
            ]
            print("Users data prepared:", users_data)
            return ResponseHandler.success_response(data=users_data)
        except Exception as e:
            import traceback
            traceback.print_exc()  # <-- affiche la vraie erreur
            raise HTTPException(status_code=500, detail="Erreur serveur interne")

    
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
    

    # @staticmethod
    # async def login(
    #     user_credentials: OAuth2PasswordRequestForm = Depends(),
    #     db: Session = Depends(get_db)
    # ):
    #     # Vérifier que l'utilisateur existe
    #     user = db.query(User).filter(User.username == user_credentials.username).first()
    #     if not user:
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN,
    #             detail="Invalid Credentials"
    #         )

    #     # Vérifier le mot de passe
    #     if not verify_password(user_credentials.password, user.password):
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN,
    #             detail="Invalid Credentials"
    #         )

    #     # Vérifier que c'est un admin
    #     if user.role != "admin":
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN,
    #             detail="User is not an admin"
    #         )

    #     # Générer et retourner les tokens comme pour les utilisateurs
    #     return await get_user_token(id=user.id)



    @staticmethod
    async def login(
        user_credentials: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
    ):
        # Vérifier que l'utilisateur existe
        user = db.query(User).filter(User.username == user_credentials.username).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid Credentials"
            )

        # Vérifier le mot de passe
        if not verify_password(user_credentials.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid Credentials"
            )

        # Vérifier que c'est un admin
        if user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not an admin"
            )

        # ✅ Corrigé : on envoie aussi le rôle à get_user_token
        return await get_user_token(id=user.id, role=user.role)


    
    
    
    
