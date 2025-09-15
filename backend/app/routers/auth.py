from fastapi import APIRouter, Depends, status, Header, HTTPException, Request
from sqlalchemy.orm import Session
from app.services.auth import AuthService
from app.db.database import get_db
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from app.schemas.auth import UserOut, Signup
from fastapi import APIRouter, Depends, status, Header
from sqlalchemy.orm import Session
from app.services.auth import AuthService
from app.db.database import get_db
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from app.schemas.auth import UserOut, Signup



router = APIRouter(tags=["Auth"], prefix="/auth")

# Déconnexion (logout)
@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(request: Request):
    # Pour JWT, la déconnexion consiste à demander au client de supprimer le token côté frontend.
    # Si vous souhaitez blacklister le token côté serveur, ajoutez ici la logique.
    # Exemple simple :
    # auth_header = request.headers.get("Authorization")
    # if auth_header:
    #     token = auth_header.split(" ")[-1]
    #     # Ajouter le token à une blacklist si besoin
    return {"message": "Déconnexion réussie. Veuillez supprimer le token côté client."}


@router.post("/signup", status_code=status.HTTP_200_OK, response_model=UserOut)
async def user_login(
        user: Signup,
        db: Session = Depends(get_db)):
    return await AuthService.signup(db, user)


@router.post("/login", status_code=status.HTTP_200_OK)
async def user_login(
        user_credentials: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)):
    return await AuthService.login(user_credentials, db)


@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh_access_token(
        refresh_token: str = Header(),
        db: Session = Depends(get_db)):
    return await AuthService.get_refresh_token(token=refresh_token, db=db)
