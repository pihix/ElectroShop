import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './users';
export type AdministrateurDocument = Administrateur & Document;

@Schema({ timestamps: true })
export class Administrateur extends User {
  @Prop({ required: true })
  niveauAcces: string;
  
  // Méthodes spécifiques à l'administrateur
  gererUtilisateurs(): void {
    // Logique pour gérer les utilisateurs
  }
  
  gererProduits(): void {
    // Logique pour gérer les produits
  }
  
  consulterRapports(): void {
    // Logique pour consulter les rapports
  }
  
  modifierParametres(): void {
    // Logique pour modifier les paramètres système
  }
}

export const AdministrateurSchema = SchemaFactory.createForClass(Administrateur);
