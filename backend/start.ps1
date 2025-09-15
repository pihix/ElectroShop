# Script pour initialiser et lancer l'application avec Docker

# Construire et lancer les conteneurs
docker-compose up --build -d

# Attendre que la base de données soit prête
echo "Attente de la base de données..."
Start-Sleep -Seconds 10

# Exécuter les migrations Alembic
docker-compose exec web alembic upgrade head

echo "Application démarrée avec succès!"
echo "API disponible sur: http://localhost:8000"
echo "Documentation Swagger: http://localhost:8000/docs"
echo "Documentation ReDoc: http://localhost:8000/redoc"
