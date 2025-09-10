from sqlalchemy.orm import Session
from app.models.models import User
from app.schemas.users import UserCreate, UserUpdate
from app.utils.responses import ResponseHandler
from app.core.security import get_password_hash


class UserService:
    @staticmethod
    def get_all_users(db: Session, page: int, limit: int, search: str = "", role: str = "user"):
        users = db.query(User).order_by(User.id.asc()).filter(
            User.username.contains(search), User.role == role).limit(limit).offset((page - 1) * limit).all()
        users_data = [{"id": user.id, "username": user.username, "email": user.email, "role": user.role} for user in users]
        return {"message": f"Page {page} with {limit} users", "data": users_data}

    @staticmethod
    def get_user(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            ResponseHandler.not_found_error("User", user_id)
        user_data = {"id": user.id, "username": user.username, "email": user.email, "role": user.role}
        return ResponseHandler.get_single_success(user.username, user_id, user_data)

    @staticmethod
    def create_user(db: Session, user: UserCreate):
        hashed_password = get_password_hash(user.password)
        user.password = hashed_password
        db_user = User(id=None, **user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        user_data = {"id": db_user.id, "username": db_user.username, "email": db_user.email, "role": db_user.role}
        return ResponseHandler.create_success(db_user.username, db_user.id, user_data)

    @staticmethod
    def update_user(db: Session, user_id: int, updated_user: UserUpdate):
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            ResponseHandler.not_found_error("User", user_id)

        for key, value in updated_user.model_dump().items():
            setattr(db_user, key, value)

        db.commit()
        db.refresh(db_user)
        user_data = {"id": db_user.id, "username": db_user.username, "email": db_user.email, "role": db_user.role}
        return ResponseHandler.update_success(db_user.username, db_user.id, user_data)

    @staticmethod
    def delete_user(db: Session, user_id: int):
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            ResponseHandler.not_found_error("User", user_id)
        user_data = {"id": db_user.id, "username": db_user.username, "email": db_user.email, "role": db_user.role}
        db.delete(db_user)
        db.commit()
        return ResponseHandler.delete_success(db_user.username, db_user.id, user_data)
