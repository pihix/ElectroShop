# ElectroShop - Configuration Docker

Ce guide explique comment utiliser Docker pour développer et déployer l'application ElectroShop.

## Prérequis

- Docker Desktop installé sur votre machine
- Docker Compose (inclus avec Docker Desktop)

## Structure des fichiers Docker

```
ElectroShop/
├── docker-compose.yml          # Configuration production
├── docker-compose.dev.yml      # Configuration développement
├── scripts.ps1                 # Script PowerShell pour Windows
├── Makefile                     # Commandes Make (Linux/Mac)
├── mongo-init/
│   └── init-db.js              # Script d'initialisation MongoDB
└── backend/
    ├── Dockerfile              # Image production
    ├── Dockerfile.dev          # Image développement
    ├── .dockerignore           # Fichiers ignorés par Docker
    └── .env.example            # Variables d'environnement exemple
```

## Services inclus

### Production (`docker-compose.yml`)
- **backend**: Application NestJS optimisée pour la production
- **mongodb**: Base de données MongoDB avec authentification
- **mongo-express**: Interface web pour MongoDB (optionnel)

### Développement (`docker-compose.dev.yml`)
- **backend-dev**: Application NestJS avec hot reload et debugging
- **mongodb**: Base de données MongoDB pour développement
- **mongo-express**: Interface web pour MongoDB

## Utilisation

### Avec PowerShell (Windows)

```powershell
# Afficher l'aide
.\scripts.ps1 help

# Démarrer en mode développement
.\scripts.ps1 dev-up

# Voir les logs du backend en développement
.\scripts.ps1 dev-logs

# Démarrer en mode production
.\scripts.ps1 build
.\scripts.ps1 up

# Arrêter les services
.\scripts.ps1 down

# Nettoyer les conteneurs et volumes
.\scripts.ps1 clean
```

### Avec Docker Compose directement

#### Développement
```bash
# Démarrer les services de développement
docker-compose -f docker-compose.dev.yml up -d

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f backend-dev

# Arrêter les services
docker-compose -f docker-compose.dev.yml down
```

#### Production
```bash
# Build et démarrer
docker-compose build
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Arrêter
docker-compose down
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` dans le dossier `backend` en vous basant sur `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Modifiez les valeurs selon vos besoins, en particulier:
- `JWT_SECRET`: Changez cette valeur pour la production
- `MONGODB_URI`: URL de connexion à MongoDB

### Ports utilisés

- **3000**: Application NestJS backend
- **27017**: MongoDB
- **8081**: Mongo Express (interface web MongoDB)
- **9229**: Port de debugging Node.js (développement uniquement)

## Accès aux services

### Application Backend
- URL: http://localhost:3000
- Documentation Swagger: http://localhost:3000/api

### MongoDB
- Connexion directe: mongodb://admin:password123@localhost:27017
- Interface web: http://localhost:8081
  - Utilisateur: admin
  - Mot de passe: admin123

## Debugging

### Accès shell au conteneur backend
```powershell
.\scripts.ps1 shell
```

### Accès shell MongoDB
```powershell
.\scripts.ps1 mongo-shell
```

### Logs en temps réel
```powershell
# Développement
.\scripts.ps1 dev-logs

# Production
.\scripts.ps1 logs
```

## Données persistantes

- Les données MongoDB sont stockées dans des volumes Docker nommés
- En développement: `mongodb_dev_data`
- En production: `mongodb_data`

## Conseils pour le développement

1. **Hot Reload**: En mode développement, les modifications du code sont automatiquement rechargées
2. **Debugging**: Connectez votre IDE au port 9229 pour debugger l'application
3. **Base de données**: Utilisez Mongo Express pour visualiser et modifier les données
4. **Logs**: Surveillez les logs pour diagnostiquer les problèmes

## Troubleshooting

### Port déjà utilisé
Si un port est déjà utilisé, modifiez le mapping dans le fichier docker-compose correspondant.

### Problème de permissions
Sur Linux/Mac, vous pourriez avoir besoin d'ajuster les permissions:
```bash
sudo chown -R $USER:$USER .
```

### Reset complet
Pour repartir de zéro:
```powershell
.\scripts.ps1 clean
.\scripts.ps1 dev-build
.\scripts.ps1 dev-up
```

## Production

Pour déployer en production:

1. Configurez les variables d'environnement appropriées
2. Changez les mots de passe par défaut
3. Utilisez HTTPS en production
4. Configurez un reverse proxy (nginx) si nécessaire
5. Mettez en place des sauvegardes pour MongoDB

```powershell
# Build et déploiement production
.\scripts.ps1 build
.\scripts.ps1 up
```
