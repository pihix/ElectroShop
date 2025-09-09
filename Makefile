# Makefile pour ElectroShop

# Variables
COMPOSE_FILE = docker-compose.yml
COMPOSE_DEV_FILE = docker-compose.dev.yml
BACKEND_SERVICE = backend
BACKEND_DEV_SERVICE = backend-dev

# Commandes pour la production
.PHONY: build up down restart logs clean

# Build et démarre tous les services en production
build:
	docker-compose -f $(COMPOSE_FILE) build

up:
	docker-compose -f $(COMPOSE_FILE) up -d

# Arrête tous les services
down:
	docker-compose -f $(COMPOSE_FILE) down

# Redémarre tous les services
restart:
	docker-compose -f $(COMPOSE_FILE) restart

# Affiche les logs du backend
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f $(BACKEND_SERVICE)

# Nettoie les conteneurs, images et volumes
clean:
	docker-compose -f $(COMPOSE_FILE) down -v
	docker system prune -f

# Commandes pour le développement
.PHONY: dev-build dev-up dev-down dev-restart dev-logs

# Build et démarre tous les services en développement
dev-build:
	docker-compose -f $(COMPOSE_DEV_FILE) build

dev-up:
	docker-compose -f $(COMPOSE_DEV_FILE) up -d

dev-down:
	docker-compose -f $(COMPOSE_DEV_FILE) down

dev-restart:
	docker-compose -f $(COMPOSE_DEV_FILE) restart

dev-logs:
	docker-compose -f $(COMPOSE_DEV_FILE) logs -f $(BACKEND_DEV_SERVICE)

# Commandes utiles
.PHONY: shell mongo-shell install-deps

# Accès shell au conteneur backend
shell:
	docker-compose -f $(COMPOSE_FILE) exec $(BACKEND_SERVICE) sh

# Accès shell MongoDB
mongo-shell:
	docker-compose -f $(COMPOSE_FILE) exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Installe les dépendances (pour le développement local)
install-deps:
	cd backend && npm install

# Affiche l'état des services
status:
	docker-compose -f $(COMPOSE_FILE) ps

# Affiche l'aide
help:
	@echo "Commandes disponibles:"
	@echo "  build       - Build les images Docker"
	@echo "  up          - Démarre les services en production"
	@echo "  down        - Arrête les services"
	@echo "  restart     - Redémarre les services"
	@echo "  logs        - Affiche les logs du backend"
	@echo "  clean       - Nettoie les conteneurs et volumes"
	@echo ""
	@echo "  dev-build   - Build les images pour le développement"
	@echo "  dev-up      - Démarre les services en développement"
	@echo "  dev-down    - Arrête les services de développement"
	@echo "  dev-logs    - Affiche les logs du backend dev"
	@echo ""
	@echo "  shell       - Accès shell au conteneur backend"
	@echo "  mongo-shell - Accès shell MongoDB"
	@echo "  status      - Affiche l'état des services"
