# ElectroShop - Commandes Docker Essentielles

## Démarrage rapide

### 1. Développement (recommandé pour commencer)
```powershell
# Windows PowerShell
.\scripts.ps1 dev-build
.\scripts.ps1 dev-up

# Vérifier que tout fonctionne
.\scripts.ps1 status
```

### 2. Production
```powershell
# Windows PowerShell
.\scripts.ps1 build
.\scripts.ps1 up
```

## URLs importantes
- Backend API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api
- MongoDB Interface: http://localhost:8081
- Health Check: http://localhost:3000/health

## Commandes de dépannage

### Voir les logs
```powershell
# Développement
.\scripts.ps1 dev-logs

# Production
.\scripts.ps1 logs
```

### Redémarrer les services
```powershell
.\scripts.ps1 dev-restart  # ou restart pour production
```

### Nettoyer et recommencer
```powershell
.\scripts.ps1 clean
.\scripts.ps1 dev-build
.\scripts.ps1 dev-up
```

### Accéder aux conteneurs
```powershell
# Shell backend
.\scripts.ps1 shell

# Shell MongoDB
.\scripts.ps1 mongo-shell
```

## Configuration des variables d'environnement

1. Copiez le fichier d'exemple:
```powershell
Copy-Item backend\.env.example backend\.env
```

2. Modifiez `backend\.env` avec vos valeurs

## Structure créée

```
ElectroShop/
├── docker-compose.yml          # Production
├── docker-compose.dev.yml      # Développement
├── scripts.ps1                 # Script de gestion (Windows)
├── Makefile                     # Script de gestion (Linux/Mac)
├── DOCKER_README.md             # Documentation complète
├── mongo-init/
│   └── init-db.js              # Initialisation MongoDB
└── backend/
    ├── Dockerfile              # Image production
    ├── Dockerfile.dev          # Image développement
    ├── .dockerignore           # Exclusions Docker
    └── .env.example            # Variables d'environnement
```
