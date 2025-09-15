from sqlalchemy.orm import Session
from app.models.models import User
from app.utils.responses import ResponseHandler
from app.core.security import get_password_hash, get_token_payload


class AccountService:
    @staticmethod
    def get_my_info(db: Session, token):
        user_id = get_token_payload(token.credentials).get('id')
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            ResponseHandler.not_found_error("User", user_id)
        
        # Retourner les données utilisateur sans les relations complexes
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "commandes": []  # Liste vide pour l'instant, on peut l'enrichir plus tard si besoin
        }
        
        return ResponseHandler.get_single_success(user.username, user.id, user_data)

    @staticmethod
    def edit_my_info(db: Session, token, updated_user):
        user_id = get_token_payload(token.credentials).get('id')
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            ResponseHandler.not_found_error("User", user_id)

        for key, value in updated_user.model_dump().items():
            setattr(db_user, key, value)

        db.commit()
        db.refresh(db_user)
        
        # Retourner les données utilisateur mises à jour sans les relations complexes
        user_data = {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "full_name": db_user.full_name,
            "role": db_user.role,
            "is_active": db_user.is_active,
            "created_at": db_user.created_at,
            "commandes": []
        }
        
        return ResponseHandler.update_success(db_user.username, db_user.id, user_data)

    @staticmethod
    def remove_my_account(db: Session, token):
        user_id = get_token_payload(token.credentials).get('id')
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            ResponseHandler.not_found_error("User", user_id)
        
        # Sauvegarder les données avant suppression
        user_data = {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "full_name": db_user.full_name,
            "role": db_user.role,
            "is_active": db_user.is_active,
            "created_at": db_user.created_at,
            "commandes": []
        }
        
        db.delete(db_user)
        db.commit()
        return ResponseHandler.delete_success(db_user.username, db_user.id, user_data)
