import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type CategorieDocument = Categorie & Document;

@Schema({ timestamps: true })
export class Categorie {
  @Prop({ required: true, unique: true })
  id: string;
  
  @Prop({ required: true })
  nom: string;
  
  @Prop({ required: true })
  description: string;
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  produits: mongoose.Types.ObjectId[];
  
  // Méthodes
  ajouterProduit(produitId: string): void {
    // Logique pour ajouter un produit à la catégorie
  }
  
  supprimerProduit(produitId: string): void {
    // Logique pour supprimer un produit de la catégorie
  }
  
  listerProduits(): any[] {
    // Logique pour lister les produits de la catégorie
    return [];
  }
}

export const CategorieSchema = SchemaFactory.createForClass(Categorie);
