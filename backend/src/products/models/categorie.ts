import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CategorieDocument = Categorie & Document;

@Schema({ timestamps: true })
export class Categorie {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  description: string;

  // Note: Relation 1:1 - Les produits référencent la catégorie, pas l'inverse
  // La relation est maintenant gérée côté Product avec un champ 'categorie'

  // Méthodes pour la gestion des produits (utilisées dans les services)
  ajouterProduit(produitId: string): void {
    // Cette méthode sera implémentée dans le service ProductService
    // pour associer un produit à cette catégorie en modifiant le champ categorie du produit
    console.log(`Association du produit ${produitId} à la catégorie ${this.id}`);
  }

  supprimerProduit(produitId: string): void {
    // Cette méthode sera implémentée dans le service ProductService
    // pour dissocier un produit de cette catégorie
    console.log(`Dissociation du produit ${produitId} de la catégorie ${this.id}`);
  }

  async listerProduits(): Promise<any[]> {
    // Cette méthode sera implémentée dans le service pour récupérer
    // tous les produits qui appartiennent à cette catégorie via une requête
    // Product.find({ categorie: this.id })
    return [];
  }
}

export const CategorieSchema = SchemaFactory.createForClass(Categorie);
