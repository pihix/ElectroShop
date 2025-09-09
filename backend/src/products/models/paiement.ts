import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type PaiementDocument = Paiement & Document;

@Schema({ timestamps: true })
export class Paiement {
  @Prop({ required: true })
  montant: number;
  
  @Prop({ required: true })
  modePaiement: string;
  
  @Prop({ required: true })
  datePaiement: Date;
  
  @Prop({ required: true })
  statut: string;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Commande', required: true })
  commande: mongoose.Types.ObjectId;
  
  // Méthodes
  valider(): boolean {
    // Logique de validation du paiement
    return this.montant > 0 && this.statut === 'validé';
  }
  
  annuler(): void {
    // Logique d'annulation du paiement
    this.statut = 'annulé';
  }
  
  effectuerPaiement(): boolean {
    // Logique pour effectuer le paiement
    this.statut = 'en cours';
    return true;
  }
}

export const PaiementSchema = SchemaFactory.createForClass(Paiement);
