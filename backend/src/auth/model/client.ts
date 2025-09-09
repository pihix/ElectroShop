import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './users';
export type ClientDocument = Client & Document;

@Schema({ timestamps: true })
export class Client extends User {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commande' }] })
  commandes: mongoose.Types.ObjectId[];
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Panier' })
  panier: mongoose.Types.ObjectId;
  
  // Méthodes spécifiques au client
  passerCommande(): void {
    // Logique pour passer une commande
  }
  
  consulterHistorique(): void {
    // Logique pour consulter l'historique
  }
  
  gererPanier(): void {
    // Logique pour gérer le panier
  }
}

export const ClientSchema = SchemaFactory.createForClass(Client);
