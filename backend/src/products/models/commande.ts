import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type CommandeDocument = Commande & Document;

@Schema({ timestamps: true })
export class Commande {
  @Prop({ required: true, unique: true })
  id: string;
  
  @Prop({ required: true })
  dateCommande: Date;
  
  @Prop({ required: true })
  statut: string;
  
  @Prop({ required: true })
  total: number;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: mongoose.Types.ObjectId;
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LigneCommande' }] })
  lignesCommande: mongoose.Types.ObjectId[];
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Paiement' })
  paiement: mongoose.Types.ObjectId;
  
  // Méthodes
  calculerTotal(): number {
    // Logique pour calculer le total
    return this.total;
  }
  
  valider(): boolean {
    // Logique de validation
    return true;
  }
  
  annuler(): void {
    // Logique d'annulation
  }
  
  mettreAJourStatut(): void {
    // Logique de mise à jour du statut
  }
}

export const CommandeSchema = SchemaFactory.createForClass(Commande);
