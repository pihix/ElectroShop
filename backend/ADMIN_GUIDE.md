# 👑 Guide de Gestion des Administrateurs

## 🎯 Vue d'ensemble

Votre système dispose de 2 rôles utilisateur :
- **`user`** : Utilisateur normal (rôle par défaut)
- **`admin`** : Administrateur avec privilèges étendus

## 🚀 Créer votre premier administrateur

### Méthode 1 : Via l'API (Recommandée)

```bash
# 1. Créer le premier admin via l'endpoint spécial
POST http://34.236.156.56:8000/admin/create-first-admin
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com", 
  "full_name": "Administrateur Principal",
  "password": "motdepasse_securise"
}
```

**⚠️ Important :** Cet endpoint ne fonctionne que s'il n'y a aucun admin dans le système.

### Méthode 2 : Via la base de données directement

```bash
# Exécuter cette commande pour créer un admin directement en DB
docker-compose exec db psql -U ecommerce_user -d ecommerce_db -c "
INSERT INTO users (username, email, full_name, password, role, is_active, created_at)
VALUES ('admin', 'admin@example.com', 'Admin Principal', 
        crypt('votremotdepasse', gen_salt('bf')), 'admin', true, NOW());"
```

### Méthode 3 : Script PowerShell

```powershell
# Utiliser le script créé
.\scripts\create_admin_db.ps1
```

## 🔧 Gestion des admins via l'API

### 📋 Lister tous les utilisateurs (Admin requis)
```bash
GET http://34.236.156.56:8000/admin/users
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### ⬆️ Promouvoir un utilisateur en admin
```bash
POST http://localhost:8000/admin/promote-user
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "user_id": 123
}
```

### ⬇️ Rétrograder un admin en utilisateur normal
```bash
POST http://localhost:8000/admin/demote-user
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "user_id": 456
}
```

## 🛡️ Privilèges des administrateurs

### Endpoints réservés aux admins :

1. **Gestion des commandes :**
   - `GET /commandes/admin/all` - Voir toutes les commandes
   - `GET /commandes/admin/{id}` - Voir n'importe quelle commande
   - `PATCH /commandes/admin/{id}/statut` - Modifier le statut des commandes
   - `DELETE /commandes/admin/{id}/cancel` - Annuler n'importe quelle commande

2. **Gestion des utilisateurs :**
   - `GET /admin/users` - Lister tous les utilisateurs
   - `POST /admin/promote-user` - Promouvoir des utilisateurs
   - `POST /admin/demote-user` - Rétrograder des admins

3. **Gestion des produits :**
   - Les admins peuvent être assignés comme gestionnaires de produits via `gestionnaire_id`

## 🔐 Processus de connexion admin

```bash
# 1. Se connecter
POST http://localhost:8000/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin&password=votremotdepasse

# 2. Utiliser le token reçu
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## 📝 Exemple complet

### Scénario : Créer un admin et gérer des utilisateurs

```bash
# 1. Créer le premier admin
curl -X POST "http://localhost:8000/admin/create-first-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "email": "admin@monsite.com",
    "full_name": "Super Administrateur", 
    "password": "MotDePasseSecurise123!"
  }'

# 2. Se connecter
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=superadmin&password=MotDePasseSecurise123!"

# 3. Utiliser le token pour lister les utilisateurs
curl -X GET "http://localhost:8000/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Promouvoir l'utilisateur ID 5 en admin
curl -X POST "http://localhost:8000/admin/promote-user" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 5}'
```

## ⚡ Interface Swagger

Accédez à http://localhost:8000/docs pour tester les endpoints visuellement :

1. Créez votre premier admin via `/admin/create-first-admin`
2. Connectez-vous via `/auth/login` 
3. Copiez le token et cliquez sur "Authorize" 🔒
4. Testez tous les endpoints admin !

## 🔒 Sécurité

- ✅ Seuls les admins peuvent promouvoir/rétrograder
- ✅ Un admin ne peut pas se rétrograder lui-même
- ✅ Le système empêche de supprimer le dernier admin
- ✅ L'endpoint `create-first-admin` ne fonctionne qu'une fois
- ✅ Tous les mots de passe sont hachés avec bcrypt

Votre système d'administration est maintenant complet et sécurisé ! 🎉
