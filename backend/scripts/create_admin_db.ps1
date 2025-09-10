# Script PowerShell pour créer un admin via la base de données
# Usage: .\create_admin_db.ps1

Write-Host "=== Création d'un administrateur ===" -ForegroundColor Green

# Demander les informations
$username = Read-Host "Nom d'utilisateur"
$email = Read-Host "Email"
$fullName = Read-Host "Nom complet"
$password = Read-Host "Mot de passe" -AsSecureString
$plaintextPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Échapper les caractères spéciaux pour SQL
$escapedUsername = $username -replace "'", "''"
$escapedEmail = $email -replace "'", "''"
$escapedFullName = $fullName -replace "'", "''"

Write-Host "Création de l'utilisateur admin..." -ForegroundColor Yellow

# Commande SQL pour insérer l'admin
$sql = @"
INSERT INTO users (username, email, full_name, password, role, is_active, created_at)
VALUES ('$escapedUsername', '$escapedEmail', '$escapedFullName', 
        crypt('$plaintextPassword', gen_salt('bf')), 'admin', true, NOW())
ON CONFLICT (username) DO NOTHING;
"@

# Exécuter via Docker
try {
    docker-compose exec db psql -U ecommerce_user -d ecommerce_db -c $sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Administrateur créé avec succès!" -ForegroundColor Green
        Write-Host "👤 Username: $username" -ForegroundColor Cyan
        Write-Host "📧 Email: $email" -ForegroundColor Cyan
        Write-Host "🎭 Rôle: admin" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Erreur lors de la création" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
}
