import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type UsersDocumenet = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  nom: string;
  
  @Prop({ required: true, unique: true })
  email: string;
  
  @Prop({ required: true })
  motDePasse: string;
  
  @Prop({ required: true })
  adresse: string;
  
  @Prop({ required: true })
  numeroTelephone: string;
  
  @Prop({ required: true, enum: ['client', 'administrateur', 'partenaire'] })
  role: string;
  
  // Méthodes
  authentifier(): boolean {
    // Logique d'authentification
    return true;
  }
  
  modifierProfil(): void {
    // Logique de modification du profil
  }
  
  contacterSupport(): void {
    // Logique de contact support
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
