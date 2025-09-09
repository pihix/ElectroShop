# Utilise l'image officielle Node.js comme base
FROM node:16-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installe les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copie le code source de l'application
COPY . .

# Build l'application
RUN npm run build

# Expose le port sur lequel l'application va tourner
EXPOSE 3000

# Crée un utilisateur non-root pour la sécurité et change la propriété des fichiers
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

# Commande pour démarrer l'application
CMD ["npm", "run", "start:prod"]
