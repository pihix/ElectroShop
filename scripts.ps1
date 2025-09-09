# Script PowerShell pour ElectroShop
# Usage: .\scripts.ps1 [command]

param(
    [Parameter(Position=0)]
    [ValidateSet("build", "up", "down", "restart", "logs", "clean", "dev-build", "dev-up", "dev-down", "dev-restart", "dev-logs", "shell", "mongo-shell", "status", "help")]
    [string]$Command = "help"
)

$COMPOSE_FILE = "docker-compose.yml"
$COMPOSE_DEV_FILE = "docker-compose.dev.yml"
$BACKEND_SERVICE = "backend"
$BACKEND_DEV_SERVICE = "backend-dev"

switch ($Command) {
    "build" {
        Write-Host "Building production images..." -ForegroundColor Green
        docker-compose -f $COMPOSE_FILE build
    }
    "up" {
        Write-Host "Starting production services..." -ForegroundColor Green
        docker-compose -f $COMPOSE_FILE up -d
    }
    "down" {
        Write-Host "Stopping production services..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_FILE down
    }
    "restart" {
        Write-Host "Restarting production services..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_FILE restart
    }
    "logs" {
        Write-Host "Showing backend logs..." -ForegroundColor Cyan
        docker-compose -f $COMPOSE_FILE logs -f $BACKEND_SERVICE
    }
    "clean" {
        Write-Host "Cleaning up containers and volumes..." -ForegroundColor Red
        docker-compose -f $COMPOSE_FILE down -v
        docker system prune -f
    }
    "dev-build" {
        Write-Host "Building development images..." -ForegroundColor Green
        docker-compose -f $COMPOSE_DEV_FILE build
    }
    "dev-up" {
        Write-Host "Starting development services..." -ForegroundColor Green
        docker-compose -f $COMPOSE_DEV_FILE up -d
    }
    "dev-down" {
        Write-Host "Stopping development services..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_DEV_FILE down
    }
    "dev-restart" {
        Write-Host "Restarting development services..." -ForegroundColor Yellow
        docker-compose -f $COMPOSE_DEV_FILE restart
    }
    "dev-logs" {
        Write-Host "Showing development backend logs..." -ForegroundColor Cyan
        docker-compose -f $COMPOSE_DEV_FILE logs -f $BACKEND_DEV_SERVICE
    }
    "shell" {
        Write-Host "Accessing backend container shell..." -ForegroundColor Magenta
        docker-compose -f $COMPOSE_FILE exec $BACKEND_SERVICE sh
    }
    "mongo-shell" {
        Write-Host "Accessing MongoDB shell..." -ForegroundColor Magenta
        docker-compose -f $COMPOSE_FILE exec mongodb mongosh electroshop
    }
    "status" {
        Write-Host "Services status:" -ForegroundColor Cyan
        docker-compose -f $COMPOSE_FILE ps
    }
    "help" {
        Write-Host "ElectroShop Docker Management Script" -ForegroundColor Magenta
        Write-Host "====================================" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "Production Commands:" -ForegroundColor Green
        Write-Host "  build       - Build Docker images"
        Write-Host "  up          - Start services in production mode"
        Write-Host "  down        - Stop services"
        Write-Host "  restart     - Restart services"
        Write-Host "  logs        - Show backend logs"
        Write-Host "  clean       - Clean containers and volumes"
        Write-Host ""
        Write-Host "Development Commands:" -ForegroundColor Yellow
        Write-Host "  dev-build   - Build development images"
        Write-Host "  dev-up      - Start services in development mode"
        Write-Host "  dev-down    - Stop development services"
        Write-Host "  dev-restart - Restart development services"
        Write-Host "  dev-logs    - Show development backend logs"
        Write-Host ""
        Write-Host "Utility Commands:" -ForegroundColor Cyan
        Write-Host "  shell       - Access backend container shell"
        Write-Host "  mongo-shell - Access MongoDB shell"
        Write-Host "  status      - Show services status"
        Write-Host "  help        - Show this help"
        Write-Host ""
        Write-Host "Example: .\scripts.ps1 dev-up" -ForegroundColor Gray
    }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host "Use '.\scripts.ps1 help' to see available commands" -ForegroundColor Gray
    }
}
