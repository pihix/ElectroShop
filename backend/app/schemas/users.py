# from pydantic import BaseModel , EmailStr
# from typing import List, Optional
# from datetime import datetime


# class BaseConfig:
#     from_attributes = True


# class UserBase(BaseModel):
#     id: int
#     username: str
#     email: EmailStr
#     full_name: str
#     password: str
#     role: str
#     is_active: bool
#     created_at: datetime
#     # Remplacé carts par commandes selon le nouveau diagramme
#     commandes: Optional[List[dict]] = []

#     class Config(BaseConfig):
#         pass


# class UserCreate(BaseModel):
#     full_name: str
#     username: str
#     email: str
#     password: str

#     class Config(BaseConfig):
#         pass


# class UserUpdate(UserCreate):
#     pass


# class UserOut(BaseModel):
#     message: str
#     data: UserBase

#     class Config(BaseConfig):
#         pass


# class UsersOut(BaseModel):
#     message: str
#     data: List[UserBase]

#     class Config(BaseConfig):
#         pass


# class UserOutDelete(BaseModel):
#     message: str
#     data: UserBase

#     class Config(BaseConfig):
#         pass


from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class BaseConfig:
    from_attributes = True

# Base commun pour les utilisateurs
class UserBase(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    created_at: Optional[datetime] = None
    commandes: Optional[List[dict]] = []

    class Config(BaseConfig):
        pass

# Création d'un utilisateur (on n'envoie pas l'id, role, is_active, created_at)
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    password: str

    class Config(BaseConfig):
        pass

# Update utilisateur (similaire à UserCreate)
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

    class Config(BaseConfig):
        pass

# Réponse d'un utilisateur unique
class UserOut(BaseModel):
    message: str
    data: UserBase

    class Config(BaseConfig):
        pass

# Réponse pour plusieurs utilisateurs
class UsersOut(BaseModel):
    message: str
    data: List[UserBase]

    class Config(BaseConfig):
        pass

# Réponse après suppression
class UserOutDelete(BaseModel):
    message: str
    data: UserBase

    class Config(BaseConfig):
        pass
