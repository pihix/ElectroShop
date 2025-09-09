import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  nom: string;
  
  @Prop({ required: true })
  description: string;
  
  @Prop({ required: true })
  prix: number;
  
  @Prop({ required: true })
  stock: number;
  
  @Prop({ required: true })
  marque: string;
  
  @Prop({ required: true })
  modele: string;
  
  @Prop({ type: [String] })
  images: string[];
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true })
  categorie: mongoose.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Partenaire' })
  partenaire: mongoose.Types.ObjectId;
  
  // Méthodes
  consulterDetails(): any {
    return {
      nom: this.nom,
      description: this.description,
      prix: this.prix,
      stock: this.stock,
      marque: this.marque,
      modele: this.modele
    };
  }
  
  mettreAJourStock(nouvelleQuantite: number): void {
    this.stock = nouvelleQuantite;
  }
  
  verifierDisponibilite(): boolean {
    return this.stock > 0;
  }
  
  appliquerRemise(pourcentage: number): void {
    this.prix = this.prix * (1 - pourcentage / 100);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
