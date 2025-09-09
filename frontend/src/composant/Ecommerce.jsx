import React, { useState } from 'react';
import '../assets/css/Ecommerce.css';

import img1 from '../assets/images/SmartPhone/img11.jpeg';
import img2 from '../assets/images/SmartPhone/img12.jpg';
import img3 from '../assets/images/SmartPhone/img13.jpg';
import img21 from '../assets/images/SmartPhone/img21.jpg';
import img22 from '../assets/images/SmartPhone/img22.jpg';
import img23 from '../assets/images/SmartPhone/img23.jpeg';
import img31 from '../assets/images/SmartPhone/img31.jpg';
import img32 from '../assets/images/SmartPhone/img32.jpg';
import img33 from '../assets/images/SmartPhone/img33.jpg';
import img41 from '../assets/images/SmartPhone/img41.png';
import img42 from '../assets/images/SmartPhone/img42.jpg';
import img43 from '../assets/images/SmartPhone/img43.jpg';
import img51 from '../assets/images/Ordinateur/img11.jpg';
import img52 from '../assets/images/Ordinateur/img12.jpg';
import img53 from '../assets/images/Ordinateur/img13.jpg';
import img61 from '../assets/images/Tab/img11.jpg';
import img62 from '../assets/images/Tab/img12.jpg';
import img63 from '../assets/images/Tab/img13.jpg';
import img71 from '../assets/images/Accessories/img11.jpg';
import img72 from '../assets/images/Accessories/img12.jpg';
import img73 from '../assets/images/Accessories/img13.jpg';
import img81 from '../assets/images/Ordinateur/img21.jpg';
import img82 from '../assets/images/Ordinateur/img22.jpg';
import img83 from '../assets/images/Ordinateur/img23.jpg';
import img91 from '../assets/images/Tab/img21.jpg';
import img92 from '../assets/images/Tab/img22.png';
import img93 from '../assets/images/Tab/img23.jpg';
import img101 from '../assets/images/Accessories/img21.jpg';
import img102 from '../assets/images/Accessories/img22.jpg';
import img103 from '../assets/images/Accessories/img23.jpg';
import img111 from '../assets/images/Tab/img31.png';
import img112 from '../assets/images/Tab/img32.jpg';
import img113 from '../assets/images/Tab/img33.jpg';
import img121 from '../assets/images/Accessories/img31.jpg';
import img122 from '../assets/images/Accessories/img32.jpg';
import img123 from '../assets/images/Accessories/img33.jpg';


const Ecommerce = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    brand: 'all'
  });
  const productsPerPage = 8;

  // Données des produits
  const products = [
    {
      id: 1,
      name: "iPhone 13 Pro",
      originalPrice: "1099€",
      newPrice: "999€",
      saving: "100€",
      image: img3,
      images: [
        img3,
        img2,
        img1
      ],
      description: "L'iPhone 13 Pro dispose d'un écran Super Retina XDR de 6,1 pouces avec ProMotion, d'un triple appareil photo avec téléobjectif, ultra grand-angle et grand-angle, et d'une puce A15 Bionic pour des performances exceptionnelles.",
      brand: "Apple",
      category: "smartphone"
    },
    {
      id: 2,
      name: "Samsung Galaxy S21",
      originalPrice: "899€",
      newPrice: "799€",
      saving: "100€",
      image: img23,
      images: [
        img23,
        img22,
        img21
      ],
      description: "Le Samsung Galaxy S21 est équipé d'un écran Dynamic AMOLED 2X de 6,2 pouces, d'un triple appareil photo avec objectif principal 64MP, ultra grand-angle et téléobjectif, et du processeur Exynos 2100.",
      brand: "Samsung",
      category: "smartphone"
    },
    {
      id: 3,
      name: "Google Pixel 6",
      originalPrice: "649€",
      newPrice: "599€",
      saving: "50€",
      image: img31,
      images: [
        img31,
        img32,
        img33
      ],
      description: "Le Google Pixel 6 dispose du premier processeur Google Tensor, d'un appareil photo principal 50MP et d'un ultra grand-angle 12MP, le tout tournant sous Android 12 pur.",
      brand: "Google",
      category: "smartphone"
    },
    {
      id: 4,
      name: "Xiaomi Mi 11",
      originalPrice: "749€",
      newPrice: "699€",
      saving: "50€",
      image: img41,
      images: [
        img41,
        img42,
        img43
      ],
      description: "Le Xiaomi Mi 11 possède un écran AMOLED Quad HD+ de 6,81 pouces à 120 Hz, un appareil photo principal 108MP et est alimenté par le processeur Snapdragon 888.",
      brand: "Xiaomi",
      category: "smartphone"
    },
    {
      id: 5,
      name: "MacBook Pro 14",
      originalPrice: "2199€",
      newPrice: "1999€",
      saving: "200€",
      image: img51,
      images: [
        img51,
        img52,
        img53
      ],
      description: "Le MacBook Pro 14 dispose de la puce M1 Pro, d'un écran Liquid Retina XDR et d'une autonomie allant jusqu'à 17 heures. Parfait pour les professionnels créatifs.",
      brand: "Apple",
      category: "laptop"
    },
    {
      id: 6,
      name: "Samsung Galaxy Tab S7",
      originalPrice: "749€",
      newPrice: "649€",
      saving: "100€",
      image: img61,
      images: [
        img61,
        img62,
        img63
      ],
      description: "La tablette Galaxy Tab S7 offre un écran LCD 120 Hz de 11 pouces, le S Pen inclus et une autonomie de jusqu'à 15 heures. Idéale pour le travail et le divertissement.",
      brand: "Samsung",
      category: "tablet"
    },
    {
      id: 7,
      name: "AirPods Pro",
      originalPrice: "279€",
      newPrice: "249€",
      saving: "30€",
      image: img71,
      images: [
        img71,
        img72,
        img73
      ],
      description: "Les AirPods Pro offrent une annulation active du bruit, une qualité audio exceptionnelle et une autonomie allant jusqu'à 4,5 heures d'écoute (24h avec le boîtier).",
      brand: "Apple",
      category: "accessory"
    },
    {
      id: 8,
      name: "Dell XPS 13",
      originalPrice: "1499€",
      newPrice: "1299€",
      saving: "200€",
      image: img81,
      images: [
        img81,
        img82,
        img83
      ],
      description: "Le Dell XPS 13 est un ultraportable avec écran InfinityEdge, processeur Intel Core i7 de 11e génération et autonomie allant jusqu'à 14 heures.",
      brand: "Dell",
      category: "laptop"
    },
    {
      id: 9,
      name: "iPad Air",
      originalPrice: "649€",
      newPrice: "599€",
      saving: "50€",
      image: img91,
      images: [
        img91,
        img92,
        img93
      ],
      description: "L'iPad Air dispose de la puce A14 Bionic, d'un écran Liquid Retina de 10,9 pouces et est compatible avec l'Apple Pencil (2e génération) et le Magic Keyboard.",
      brand: "Apple",
      category: "tablet"
    },
    {
      id: 10,
      name: "Sony WH-1000XM4",
      originalPrice: "349€",
      newPrice: "299€",
      saving: "50€",
      image: img101,
      images: [
        img101,
        img102,
        img103
      ],
      description: "Les écouteurs Sony WH-1000XM4 offrent une annulation de bruit exceptionnelle, une autonomie de 30 heures et une qualité audio HD avec le DSEE Extreme.",
      brand: "Sony",
      category: "accessory"
    },
    {
      id: 11,
      name: "Huawei MatePad Pro",
      originalPrice: "749€",
      newPrice: "649€",
      saving: "100€",
      image: img111,
      images: [
        img111,
        img112,
        img113
      ],
      description: "Le MatePad Pro de Huawei offre un écran 90 Hz de 12,6 pouces, une autonomie de jusqu'à 12 heures et est compatible avec le M-Pencil (2e génération).",
      brand: "Huawei",
      category: "tablet"
    },
    {
      id: 12,
      name: "Logitech MX Keys",
      originalPrice: "109€",
      newPrice: "89€",
      saving: "20€",
      image: img121,
      images: [
        img121,
        img122,
        img123
      ],
      description: "Le clavier Logitech MX Keys offre une frappe comfortable, un rétroéclairage intelligent et une connexion multi-appareils. Autonomie de jusqu'à 10 jours.",
      brand: "Logitech",
      category: "accessory"
    }
  ];

  // Filtrer les produits en fonction des critères sélectionnés
  const filteredProducts = products.filter(product => {
    // Filtre par catégorie
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    
    // Filtre par marque
    if (filters.brand !== 'all' && product.brand !== filters.brand) {
      return false;
    }
    
    // Filtre par prix
    const productPrice = parseInt(product.newPrice);
    if (filters.minPrice && productPrice < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && productPrice > parseInt(filters.maxPrice)) {
      return false;
    }
    
    return true;
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ouvrir le modal produit
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedImage(0);
  };

  // Fermer le modal produit
  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Changer l'image dans le modal
  const changeImage = (index) => {
    setSelectedImage(index);
  };

  // Gérer les changements de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setCurrentPage(1); // Réinitialiser à la première page après changement de filtre
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: '',
      maxPrice: '',
      brand: 'all'
    });
  };

  // Obtenir les marques uniques pour le filtre
  const brands = [...new Set(products.map(product => product.brand))];

  return (
    <div className="ecommerce">
      <div className="container">
        {/* En-tête avec titre et lien */}
        <div className="section-header">
          <h1>Profitez des meilleures offres sur nos produits</h1>
          
        </div>

        <div className="content-wrapper">
          {/* Sidebar avec filtres */}
          <div className="sidebar">
            <div className="filter-group">
              <h3>Filtres</h3>
              <button className="reset-filters" onClick={resetFilters}>
                Réinitialiser
              </button>
            </div>

            <div className="filter-group">
              <h4>Catégories</h4>
              <div className="filter-options">
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={filters.category === 'all'}
                    onChange={handleFilterChange}
                  />
                  Toutes les catégories
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="smartphone"
                    checked={filters.category === 'smartphone'}
                    onChange={handleFilterChange}
                  />
                  Smartphones
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="laptop"
                    checked={filters.category === 'laptop'}
                    onChange={handleFilterChange}
                  />
                  Ordinateurs
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="tablet"
                    checked={filters.category === 'tablet'}
                    onChange={handleFilterChange}
                  />
                  Tablettes
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="accessory"
                    checked={filters.category === 'accessory'}
                    onChange={handleFilterChange}
                  />
                  Accessoires
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Prix</h4>
              <div className="price-filter">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min (€)"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max (€)"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-group">
              <h4>Marques</h4>
              <div className="filter-options">
                <label>
                  <input
                    type="radio"
                    name="brand"
                    value="all"
                    checked={filters.brand === 'all'}
                    onChange={handleFilterChange}
                  />
                  Toutes les marques
                </label>
                {brands.map(brand => (
                  <label key={brand}>
                    <input
                      type="radio"
                      name="brand"
                      value={brand}
                      checked={filters.brand === brand}
                      onChange={handleFilterChange}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Grille de produits */}
          <div className="products-container">
            <div className="products-grid">
              {currentProducts.map((product) => (
                <div key={product.id} className="product-card" onClick={() => openModal(product)}>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="price-container">
                    <span className="original-price">{product.originalPrice}</span>
                    <span className="new-price">{product.newPrice}</span>
                  </div>
                  <div className="saving">Économisez {product.saving}</div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Précédent
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal produit */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            
            <div className="modal-body">
              <div className="modal-image-gallery">
                <div className="main-image">
                  <img src={selectedProduct.images[selectedImage]} alt={selectedProduct.name} />
                </div>
                <div className="thumbnail-container">
                  {selectedProduct.images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => changeImage(index)}
                    >
                      <img src={image} alt={`Vue ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="modal-details">
                <h2>{selectedProduct.name}</h2>
                <p className="product-description">{selectedProduct.description}</p>
                
                <div className="price-container-modal">
                  <span className="original-price">{selectedProduct.originalPrice}</span>
                  <span className="new-price">{selectedProduct.newPrice}</span>
                  <div className="saving">Économisez {selectedProduct.saving}</div>
                </div>
                
                <div className="product-specs">
                  <h4>Caractéristiques</h4>
                  <ul>
                    <li><strong>Marque:</strong> {selectedProduct.brand}</li>
                    <li><strong>Catégorie:</strong> {selectedProduct.category}</li>
                    <li><strong>Garantie:</strong> 2 ans</li>
                    <li><strong>Livraison:</strong> Gratuite</li>
                    <li><strong>Disponibilité:</strong> En stock</li>
                  </ul>
                </div>
                
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantité:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    defaultValue="1"
                  />
                </div>
                
                <button className="add-to-cart-btn">
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ecommerce;