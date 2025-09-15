#!/usr/bin/env python3
"""
Script pour créer un utilisateur administrateur
Usage: python create_admin.py
"""

import asyncio
import sys
import os

# Ajouter le répertoire parent au path pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash


async def create_admin_user():
    """Créer un utilisateur administrateur"""
    
    db = SessionLocal()
    
    try:
        # Vérifier si un admin existe déjà
        existing_admin = db.query(User).filter(User.role == "admin").first()
        
        if existing_admin:
            print(f"Un administrateur existe déjà : {existing_admin.username}")
            response = input("Voulez-vous créer un autre admin ? (y/N): ")
            if response.lower() != 'y':
                print("Opération annulée.")
                return
        
        # Demander les informations
        print("\n=== Création d'un utilisateur administrateur ===")
        
        username = input("Nom d'utilisateur: ").strip()
        if not username:
            print("Erreur: Le nom d'utilisateur ne peut pas être vide")
            return
            
        email = input("Email: ").strip()
        if not email:
            print("Erreur: L'email ne peut pas être vide")
            return
            
        full_name = input("Nom complet: ").strip()
        if not full_name:
            print("Erreur: Le nom complet ne peut pas être vide")
            return
            
        password = input("Mot de passe: ").strip()
        if not password:
            print("Erreur: Le mot de passe ne peut pas être vide")
            return
        
        # Vérifier si l'utilisateur existe déjà
        existing_user = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            print(f"Erreur: Un utilisateur avec ce nom d'utilisateur ou email existe déjà")
            return
        
        # Créer l'utilisateur admin
        hashed_password = get_password_hash(password)
        
        admin_user = User(
            username=username,
            email=email,
            full_name=full_name,
            password=hashed_password,
            role="admin",  # Définir explicitement le rôle admin
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"\n✅ Utilisateur administrateur créé avec succès !")
        print(f"👤 Username: {admin_user.username}")
        print(f"📧 Email: {admin_user.email}")
        print(f"🎭 Rôle: {admin_user.role}")
        print(f"🆔 ID: {admin_user.id}")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création de l'admin: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(create_admin_user())
