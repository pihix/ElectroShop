# Adaptations du Backend selon le Diagramme UML

## Nouvelles Relations Implémentées

### 1. Utilisateur ⟷ Commande (1:*)
- **Modifié**: `Commande.client` → `Commande.utilisateur`
- **Référence**: `@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })`
- **Service**: `CommandeService` avec méthodes pour gérer les commandes par utilisateur

### 2. Produit ⟷ LigneCommande (1:*)
- **Existant**: Relation déjà correcte dans `LigneCommande.produit`
- **Service**: Gestion automatique du stock dans `CommandeService.ajouterLigneCommande()`

### 3. Produit ⟷ Catégorie (1:1)
- **Modifié**: Suppression de `Categorie.produits[]` (relation inverse)
- **Conservé**: `Product.categorie` (référence vers une seule catégorie)
- **Service**: `CategorieService.getProduitsByCategorie()` pour récupérer les produits

### 4. Utilisateur ⟷ Produit (1:*) - "Gérer"
- **Ajouté**: `Product.gestionnaire` référençant l'utilisateur qui gère le produit
- **Service**: Contrôle d'accès basé sur le gestionnaire

## Services Créés/Modifiés

### CategorieService
```typescript
- getProduitsByCategorie(categorieId): Produits d'une catégorie
- associerProduit(categorieId, produitId): Associer un produit
- dissocierProduit(produitId): Dissocier un produit
- getStatistiquesCategorie(categorieId): Statistiques d'une catégorie
```

### CommandeService
```typescript
- create(dto, utilisateurId): Créer une commande pour un utilisateur
- findByUtilisateur(utilisateurId): Commandes d'un utilisateur
- ajouterLigneCommande(): Ajouter une ligne avec gestion du stock
- supprimerLigneCommande(): Supprimer avec restauration du stock
- getStatistiquesUtilisateur(): Statistiques d'achat d'un utilisateur
```

### CategorieController
```typescript
- GET /categories/:id/produits: Produits d'une catégorie
- POST /categories/:categorieId/produits/:produitId: Associer produit
- GET /categories/:id/statistiques: Stats d'une catégorie
```

## Modèles Adaptés

### Product
```typescript
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true })
categorie: mongoose.Types.ObjectId;

@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
gestionnaire: mongoose.Types.ObjectId; // Utilisateur qui gère ce produit
```

### Categorie
```typescript
// Supprimé: produits: mongoose.Types.ObjectId[]
// La relation est maintenant gérée côté Product
```

### Commande
```typescript
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
utilisateur: mongoose.Types.ObjectId; // Remplace 'client'
```

## Module ProductsModule Mis à Jour
- Inclusion de tous les nouveaux modèles
- Export des services pour utilisation dans d'autres modules
- Contrôleurs pour les catégories et commandes

## Avantages de cette Architecture

1. **Cohérence**: Respect exact du diagramme UML
2. **Performance**: Relations optimisées (1:1 au lieu de 1:* bidirectionnel)
3. **Scalabilité**: Services séparés pour chaque entité
4. **Maintenabilité**: Code organisé par responsabilité
5. **Sécurité**: Contrôle d'accès basé sur les gestionnaires

## Points d'Attention

- Les méthodes dans les modèles sont maintenant des placeholders
- La logique métier est dans les services (bonne pratique)
- Les relations sont unidirectionnelles pour éviter les cycles
- Gestion automatique du stock lors des commandes

Cette architecture respecte les principes SOLID et les bonnes pratiques NestJS.
