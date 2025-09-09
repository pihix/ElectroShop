import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategorieController } from './controllers/categorie.controller';
import { CategorieService } from './services/categorie.service';
import { CommandeService } from './services/commande.service';

// Import des modèles mis à jour
import { Product, ProductSchema } from './models/products';
import { Categorie, CategorieSchema } from './models/categorie';
import { Commande, CommandeSchema } from './models/commande';
import { LigneCommande, LigneCommandeSchema } from './models/ligne-commande';
import { Panier, PanierSchema } from './models/cart';
import { User, UserSchema } from '../auth/model/users';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Categorie.name, schema: CategorieSchema },
      { name: Commande.name, schema: CommandeSchema },
      { name: LigneCommande.name, schema: LigneCommandeSchema },
      { name: Panier.name, schema: PanierSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProductsController, CategorieController],
  providers: [ProductsService, CategorieService, CommandeService],
  exports: [ProductsService, CategorieService, CommandeService],
})
export class ProductsModule {}
