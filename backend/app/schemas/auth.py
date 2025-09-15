from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


# Base
class BaseConfig:
    from_attributes = True


# Schéma simplifié pour l'utilisateur (sans relations complexes)
class UserSimple(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    class Config(BaseConfig):
        pass


# Schéma complet avec relations (pour usage avancé si nécessaire)
class UserBase(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str
    password: str
    role: str
    is_active: bool
    created_at: datetime
    # Remplacé carts par commandes selon le nouveau diagramme
    commandes: Optional[List[dict]] = []

    class Config(BaseConfig):
        pass


class Signup(BaseModel):
    full_name: str
    username: str
    email: str
    password: str

    class Config(BaseConfig):
        pass


class UserOut(BaseModel):
    message: str
    data: UserSimple  # Utilise le schéma simplifié

    class Config(BaseConfig):
        pass


# Token
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'Bearer'
    expires_in: int
