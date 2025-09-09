import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategorieService } from '../services/categorie.service';

@Controller('categories')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  create(@Body() createCategorieDto: any) {
    return this.categorieService.create(createCategorieDto);
  }

  @Get()
  findAll() {
    return this.categorieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categorieService.findOne(id);
  }

  @Get(':id/produits')
  getProduits(@Param('id') id: string) {
    return this.categorieService.getProduitsByCategorie(id);
  }

  @Get(':id/statistiques')
  getStatistiques(@Param('id') id: string) {
    return this.categorieService.getStatistiquesCategorie(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategorieDto: any) {
    return this.categorieService.update(id, updateCategorieDto);
  }

  @Post(':categorieId/produits/:produitId')
  associerProduit(
    @Param('categorieId') categorieId: string,
    @Param('produitId') produitId: string,
  ) {
    return this.categorieService.associerProduit(categorieId, produitId);
  }

  @Delete('produits/:produitId/categorie')
  dissocierProduit(@Param('produitId') produitId: string) {
    return this.categorieService.dissocierProduit(produitId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categorieService.remove(id);
  }
}
