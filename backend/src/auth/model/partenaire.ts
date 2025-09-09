import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './users';
export type PartenaireDocument = Partenaire & Document;

@Schema({ timestamps: true })
export class Partenaire extends User {
  @Prop({ required: true })
  entreprise: string;
  
  @Prop({ required: true })
  dateCreation: Date;
  
  @Prop({ required: true })
  statutPartenaire: string;
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  produits: mongoose.Types.ObjectId[];
  
  // Méthodes spécifiques au partenaire
  ajouterProduit(): void {
    // Logique pour ajouter un produit
  }
  
  modifierProduit(): void {
    // Logique pour modifier un produit
  }
  
  supprimerProduit(): void {
    // Logique pour supprimer un produit
  }
  
  voirCommandes(): void {
    // Logique pour voir les commandes
  }
}

export const PartenaireSchema = SchemaFactory.createForClass(Partenaire);
