import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type LigneCommandeDocument = LigneCommande & Document;

@Schema({ timestamps: true })
export class LigneCommande {
  @Prop({ required: true })
  quantite: number;
  
  @Prop({ required: true })
  prixUnitaire: number;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  produit: mongoose.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Commande', required: true })
  commande: mongoose.Types.ObjectId;
  
  // Méthodes
  calculerSousTotal(): number {
    return this.quantite * this.prixUnitaire;
  }
  
  valider(): boolean {
    return this.quantite > 0 && this.prixUnitaire > 0;
  }
  
  modifierQuantite(nouvelleQuantite: number): void {
    this.quantite = nouvelleQuantite;
  }
}

export const LigneCommandeSchema = SchemaFactory.createForClass(LigneCommande);
