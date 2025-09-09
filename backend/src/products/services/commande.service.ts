import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Commande, CommandeDocument } from '../models/commande';
import { LigneCommande, LigneCommandeDocument } from '../models/ligne-commande';
import { Product, ProductDocument } from '../models/products';
import { User } from '../../auth/model/users';

@Injectable()
export class CommandeService {
  constructor(
    @InjectModel(Commande.name) private commandeModel: Model<CommandeDocument>,
    @InjectModel(LigneCommande.name) private ligneCommandeModel: Model<LigneCommandeDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createCommandeDto: any, utilisateurId: string): Promise<Commande> {
    const newCommande = {
      ...createCommandeDto,
      utilisateur: utilisateurId,
      dateCommande: new Date(),
      statut: 'en_attente'
    };

    const createdCommande = new this.commandeModel(newCommande);
    return createdCommande.save();
  }

  async findAll(): Promise<Commande[]> {
    return this.commandeModel
      .find()
      .populate('utilisateur', 'nom email')
      .populate('lignesCommande')
      .exec();
  }

  async findOne(id: string): Promise<Commande> {
    return this.commandeModel
      .findById(id)
      .populate('utilisateur', 'nom email adresse numeroTelephone')
      .populate({
        path: 'lignesCommande',
        populate: {
          path: 'produit',
          select: 'nom prix description'
        }
      })
      .exec();
  }

  async findByUtilisateur(utilisateurId: string): Promise<Commande[]> {
    return this.commandeModel
      .find({ utilisateur: utilisateurId })
      .populate('lignesCommande')
      .sort({ dateCommande: -1 })
      .exec();
  }

  async update(id: string, updateCommandeDto: any): Promise<Commande> {
    return this.commandeModel
      .findByIdAndUpdate(id, updateCommandeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Commande> {
    // Supprimer d'abord les lignes de commande associées
    const commande = await this.findOne(id);
    if (commande && commande.lignesCommande) {
      await this.ligneCommandeModel.deleteMany({
        _id: { $in: commande.lignesCommande }
      });
    }

    return this.commandeModel.findByIdAndDelete(id).exec();
  }

  async ajouterLigneCommande(commandeId: string, ligneCommandeDto: any): Promise<LigneCommande> {
    // Vérifier que le produit existe et a suffisamment de stock
    const produit = await this.productModel.findById(ligneCommandeDto.produitId);
    if (!produit) {
      throw new Error('Produit introuvable');
    }

    if (produit.stock < ligneCommandeDto.quantite) {
      throw new Error('Stock insuffisant');
    }

    // Créer la ligne de commande
    const ligneCommande = new this.ligneCommandeModel({
      quantite: ligneCommandeDto.quantite,
      prixUnitaire: produit.prix,
      produit: ligneCommandeDto.produitId,
      commande: commandeId
    });

    const savedLigneCommande = await ligneCommande.save();

    // Ajouter la ligne de commande à la commande
    await this.commandeModel.findByIdAndUpdate(
      commandeId,
      { $push: { lignesCommande: savedLigneCommande._id } }
    );

    // Mettre à jour le stock du produit
    await this.productModel.findByIdAndUpdate(
      ligneCommandeDto.produitId,
      { $inc: { stock: -ligneCommandeDto.quantite } }
    );

    // Recalculer le total de la commande
    await this.recalculerTotal(commandeId);

    return savedLigneCommande;
  }

  async supprimerLigneCommande(commandeId: string, ligneCommandeId: string): Promise<void> {
    const ligneCommande = await this.ligneCommandeModel.findById(ligneCommandeId);
    if (!ligneCommande) {
      throw new Error('Ligne de commande introuvable');
    }

    // Restaurer le stock du produit
    await this.productModel.findByIdAndUpdate(
      ligneCommande.produit,
      { $inc: { stock: ligneCommande.quantite } }
    );

    // Supprimer la ligne de commande
    await this.ligneCommandeModel.findByIdAndDelete(ligneCommandeId);

    // Retirer la ligne de commande de la commande
    await this.commandeModel.findByIdAndUpdate(
      commandeId,
      { $pull: { lignesCommande: ligneCommandeId } }
    );

    // Recalculer le total
    await this.recalculerTotal(commandeId);
  }

  private async recalculerTotal(commandeId: string): Promise<void> {
    const commande = await this.commandeModel
      .findById(commandeId)
      .populate('lignesCommande');

    if (!commande) return;

    const total = commande.lignesCommande.reduce((sum: number, ligne: any) => {
      return sum + (ligne.quantite * ligne.prixUnitaire);
    }, 0);

    await this.commandeModel.findByIdAndUpdate(commandeId, { total });
  }

  async changerStatut(commandeId: string, nouveauStatut: string): Promise<Commande> {
    return this.commandeModel
      .findByIdAndUpdate(
        commandeId,
        { statut: nouveauStatut },
        { new: true }
      )
      .exec();
  }

  async getStatistiquesUtilisateur(utilisateurId: string): Promise<any> {
    const commandes = await this.findByUtilisateur(utilisateurId);
    const totalCommandes = commandes.length;
    const totalDepense = commandes.reduce((sum, cmd) => sum + cmd.total, 0);
    const commandesParStatut = commandes.reduce((acc: any, cmd) => {
      acc[cmd.statut] = (acc[cmd.statut] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCommandes,
      totalDepense,
      commandesParStatut,
      dernièresCommandes: commandes.slice(0, 5)
    };
  }
}
