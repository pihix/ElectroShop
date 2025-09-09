import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categorie, CategorieDocument } from '../models/categorie';
import { Product, ProductDocument } from '../models/products';

@Injectable()
export class CategorieService {
  constructor(
    @InjectModel(Categorie.name) private categorieModel: Model<CategorieDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createCategorieDto: any): Promise<Categorie> {
    const createdCategorie = new this.categorieModel(createCategorieDto);
    return createdCategorie.save();
  }

  async findAll(): Promise<Categorie[]> {
    return this.categorieModel.find().exec();
  }

  async findOne(id: string): Promise<Categorie> {
    return this.categorieModel.findById(id).exec();
  }

  async update(id: string, updateCategorieDto: any): Promise<Categorie> {
    return this.categorieModel
      .findByIdAndUpdate(id, updateCategorieDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Categorie> {
    return this.categorieModel.findByIdAndDelete(id).exec();
  }

  // Nouvelle méthode pour lister les produits d'une catégorie
  async getProduitsByCategorie(categorieId: string): Promise<Product[]> {
    return this.productModel
      .find({ categorie: categorieId })
      .populate('gestionnaire', 'nom email')
      .populate('categorie', 'nom description')
      .exec();
  }

  // Méthode pour associer un produit à une catégorie
  async associerProduit(categorieId: string, produitId: string): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(
        produitId,
        { categorie: categorieId },
        { new: true }
      )
      .exec();
  }

  // Méthode pour dissocier un produit d'une catégorie
  async dissocierProduit(produitId: string): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(
        produitId,
        { $unset: { categorie: 1 } },
        { new: true }
      )
      .exec();
  }

  // Statistiques d'une catégorie
  async getStatistiquesCategorie(categorieId: string): Promise<any> {
    const produits = await this.getProduitsByCategorie(categorieId);
    const totalProduits = produits.length;
    const stockTotal = produits.reduce((sum, product) => sum + product.stock, 0);
    const prixMoyen = produits.length > 0
      ? produits.reduce((sum, product) => sum + product.prix, 0) / produits.length
      : 0;

    return {
      totalProduits,
      stockTotal,
      prixMoyen,
      produits
    };
  }
}
