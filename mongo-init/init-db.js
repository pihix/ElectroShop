// Script d'initialisation pour MongoDB
// Ce script sera exécuté lors de la première création du conteneur MongoDB

// Création de la base de données electroshop
db = db.getSiblingDB('electroshop');

// Création d'un utilisateur pour l'application
db.createUser({
  user: 'electroshop_user',
  pwd: 'electroshop_password',
  roles: [
    {
      role: 'readWrite',
      db: 'electroshop'
    }
  ]
});

// Création des collections initiales
db.createCollection('users');
db.createCollection('products');
db.createCollection('categories');
db.createCollection('commandes');
db.createCollection('carts');

// Insertion de données de test pour les catégories
db.categories.insertMany([
  {
    id: 'cat-001',
    nom: 'Électronique',
    description: 'Appareils électroniques et gadgets',
    produits: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cat-002',
    nom: 'Informatique',
    description: 'Ordinateurs, composants et accessoires informatiques',
    produits: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cat-003',
    nom: 'Smartphones',
    description: 'Téléphones intelligents et accessoires',
    produits: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Base de données electroshop initialisée avec succès!');
