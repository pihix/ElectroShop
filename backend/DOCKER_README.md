# Instructions pour lancer le projet avec Docker

## Prérequis
- Docker
- Docker Compose

## Configuration

1. **Copier le fichier d'environnement :**
   ```bash
   cp .env.example .env
   ```

2. **Modifier le fichier .env si nécessaire :** (optionnel)
   - Changez `SECRET_KEY` pour la production
   - Modifiez les paramètres de base de données si besoin

## Lancement rapide

### Option 1 : Script PowerShell (Windows)
```powershell
.\start.ps1
```

### Option 2 : Commandes manuelles

1. **Construire et lancer les conteneurs :**
   ```bash
   docker-compose up --build -d
   ```

2. **Exécuter les migrations (première fois) :**
   ```bash
   docker-compose exec web alembic upgrade head
   ```

## Accès à l'application

- **API :** http://localhost:8000
- **Documentation Swagger :** http://localhost:8000/docs
- **Documentation ReDoc :** http://localhost:8000/redoc

## Commandes utiles

### Voir les logs
```bash
docker-compose logs -f web    # Logs de l'application
docker-compose logs -f db     # Logs de la base de données
```

### Arrêter les conteneurs
```bash
docker-compose down
```

### Arrêter et supprimer les volumes (attention : perte de données)
```bash
docker-compose down -v
```

### Accéder au conteneur de l'application
```bash
docker-compose exec web bash
```

### Accéder à la base de données PostgreSQL
```bash
docker-compose exec db psql -U ecommerce_user -d ecommerce_db
```

### Créer une nouvelle migration
```bash
docker-compose exec web alembic revision --autogenerate -m "description of changes"
```

### Appliquer les migrations
```bash
docker-compose exec web alembic upgrade head
```

## Structure des services

- **web :** Application FastAPI (port 8000)
- **db :** Base de données PostgreSQL (port 5432)

## Développement

Le volume est monté pour permettre le hot-reload. Tout changement dans le code sera automatiquement pris en compte sans redémarrer le conteneur.
