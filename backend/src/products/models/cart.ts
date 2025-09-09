import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type PanierDocument = Panier & Document;

@Schema({ timestamps: true })
export class Panier {
  @Prop({ required: true })
  quantiteArticles: number;
  
  @Prop({ required: true })
  sousTotal: number;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: mongoose.Types.ObjectId;
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LigneCommande' }] })
  articles: mongoose.Types.ObjectId[];
  
  // Méthodes
  ajouterArticle(produitId: string, quantite: number): void {
    // Logique pour ajouter un article
    this.quantiteArticles += quantite;
  }
  
  supprimerArticle(produitId: string): void {
    // Logique pour supprimer un article
  }
  
  calculerTotal(): number {
    // Logique pour calculer le total
    return this.sousTotal;
  }
  
  viderPanier(): void {
    // Logique pour vider le panier
    this.quantiteArticles = 0;
    this.sousTotal = 0;
    this.articles = [];
  }
}

export const PanierSchema = SchemaFactory.createForClass(Panier);
