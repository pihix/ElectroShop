

Voici toutes les informations sur l'API backend pour le projet ElectroShop. Le backend est développé avec NestJS et MongoDB.

##  Configuration de l'environnement

### URL de base de l'API
- **Développement**: `http://localhost:3000`
- **Documentation Swagger**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`

### Démarrage du backend
```bash
# Dans le dossier racine du projet
.\scripts.ps1 dev-up

# Ou directement avec Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

##  Authentification

### Endpoints d'authentification
```typescript
POST /auth/register
Content-Type: application/json
{
  "nom": "John Doe",
  "email": "john@example.com", 
  "motDePasse": "password123",
  "adresse": "123 Rue Example",
  "numeroTelephone": "+33123456789",
  "role": "client" // ou "administrateur" ou "partenaire"
}

POST /auth/login
Content-Type: application/json
{
  "email": "john@example.com",
  "motDePasse": "password123"
}
```

### Réponse de connexion
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "email": "john@example.com",
    "nom": "John Doe",
    "role": "client"
  }
}
```

### Headers pour les requêtes authentifiées
```typescript
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

##  API Produits

### Endpoints disponibles
```typescript
// Récupérer tous les produits (public)
GET /products

// Récupérer un produit par ID (public)
GET /products/:id

// Récupérer les produits d'un utilisateur (public)
GET /products/user/:userId

// Créer un produit (Admin uniquement)
POST /products
Authorization: Bearer TOKEN

// Modifier un produit (Admin uniquement)
PUT /products/:id
Authorization: Bearer TOKEN

// Supprimer un produit (Admin uniquement)
DELETE /products/:id
Authorization: Bearer TOKEN
```

### Structure d'un produit
```typescript
{
  "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
  "nom": "iPhone 15 Pro",
  "description": "Smartphone Apple dernière génération",
  "prix": 1199.99,
  "stock": 50,
  "marque": "Apple",
  "modele": "iPhone 15 Pro",
  "images": ["url1.jpg", "url2.jpg"],
  "categorie": "64f8a1b2c3d4e5f6g7h8i9j1", // ID de la catégorie
  "gestionnaire": "64f8a1b2c3d4e5f6g7h8i9j2", // ID de l'utilisateur gestionnaire
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## API Catégories

### Endpoints disponibles
```typescript
// Récupérer toutes les catégories
GET /categories

// Récupérer une catégorie par ID
GET /categories/:id

// Récupérer les produits d'une catégorie
GET /categories/:id/produits

// Récupérer les statistiques d'une catégorie
GET /categories/:id/statistiques

// Créer une catégorie
POST /categories

// Associer un produit à une catégorie
POST /categories/:categorieId/produits/:produitId

// Dissocier un produit d'une catégorie
DELETE /categories/produits/:produitId/categorie
```

### Structure d'une catégorie
```typescript
{
  "_id": "64f8a1b2c3d4e5f6g7h8i9j1",
  "id": "cat-001",
  "nom": "Smartphones",
  "description": "Téléphones intelligents et accessoires",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

##  API Panier (En cours de développement)

### Endpoints disponibles
```typescript
// Ajouter un produit au panier (Authentifié)
POST /products/cart/:productId
Authorization: Bearer TOKEN
{
  "amount": 2
}

// Récupérer le panier de l'utilisateur (Authentifié)
GET /products/cart/products
Authorization: Bearer TOKEN

// Supprimer un produit du panier (Authentifié)
DELETE /products/cart/remove/:productId
Authorization: Bearer TOKEN
```

## Ce que vous devez préparer côté Frontend

### 1. **Gestion de l'authentification**
- [ ] Formulaires de connexion/inscription
- [ ] Stockage sécurisé du JWT (localStorage/sessionStorage)
- [ ] Intercepteur HTTP pour ajouter automatiquement le token
- [ ] Gestion de l'expiration du token
- [ ] Redirection selon le rôle utilisateur

### 2. **Interface produits**
- [ ] Liste des produits avec pagination
- [ ] Détail d'un produit
- [ ] Filtrage par catégorie
- [ ] Recherche de produits
- [ ] Gestion des images produits

### 3. **Interface catégories**
- [ ] Navigation par catégories
- [ ] Affichage des produits par catégorie
- [ ] Statistiques des catégories (pour admin)

### 4. **Interface panier**
- [ ] Ajout/suppression de produits
- [ ] Mise à jour des quantités
- [ ] Calcul du total
- [ ] Validation avant commande

### 5. **Interface d'administration**
- [ ] CRUD produits (Create, Read, Update, Delete)
- [ ] CRUD catégories
- [ ] Gestion des utilisateurs
- [ ] Tableaux de bord et statistiques

## Outils recommandés

### Pour tester l'API
- **Postman** ou **Insomnia** : Collection de requêtes
- **Swagger UI** : `http://localhost:3000/api` (documentation interactive)

### Pour le développement Frontend
```typescript
// Exemple avec Axios
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Instance Axios avec intercepteur
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exemple d'utilisation
const getProducts = () => api.get('/products');
const getProductById = (id) => api.get(`/products/${id}`);
const login = (credentials) => api.post('/auth/login', credentials);
```

##  Types TypeScript (à créer côté Frontend)

```typescript
// types/auth.ts
export interface User {
  id: string;
  nom: string;
  email: string;
  role: 'client' | 'administrateur' | 'partenaire';
  adresse: string;
  numeroTelephone: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// types/product.ts
export interface Product {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  marque: string;
  modele: string;
  images: string[];
  categorie: string;
  gestionnaire: string;
  createdAt: string;
  updatedAt: string;
}

// types/category.ts
export interface Category {
  _id: string;
  id: string;
  nom: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
```

##  Points importants

1. **CORS** : Le backend accepte les requêtes depuis `http://localhost:3001` (configurez votre dev server)
2. **Rôles** : Respectez les permissions (client/admin/partenaire)
3. **Gestion d'erreurs** : L'API renvoie des codes HTTP standards (200, 401, 403, 404, 500)
4. **Validation** : Validez les données côté client avant envoi
5. **Loading states** : Gérez les états de chargement pour l'UX

##  Support

- **Documentation Swagger** : `http://localhost:3000/api`
- **Health Check** : `http://localhost:3000/health`
- **MongoDB Interface** : `http://localhost:8081` (admin/admin123)

