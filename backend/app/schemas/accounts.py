from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


class AccountBase(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    # Remplacé carts par commandes selon le nouveau diagramme
    commandes: Optional[List[dict]] = []

    class Config:
        from_attributes = True


class AccountUpdate(BaseModel):
    username: str
    email: EmailStr
    full_name: str


class AccountOut(BaseModel):
    message: str
    data: AccountBase

    class Config:
        from_attributes = True
