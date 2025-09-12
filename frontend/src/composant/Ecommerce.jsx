import React, { useState, useEffect, useContext } from "react";
import "../assets/css/Ecommerce.css";
import axios from "axios";
import { CartContext } from "./CartContext";

const API_BASE = "http://localhost:8000";

const Ecommerce = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
  
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    brand: "all",
  });

  const productsPerPage = 8;
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products?page=1&limit=100`);
      const raw = res.data?.data || [];

      const mapped = raw.map((p) => {
        const image =
          p.thumbnail ||
          (Array.isArray(p.images) && p.images.length ? p.images[0] : null) ||
          p.image ||
          "/placeholder.jpg";

        return {
          id: p.id,
          name: p.title,
          description: p.description,
          originalPrice: p.old_price ? `${p.old_price}€` : "",
          newPrice: `${p.price}€`,
          saving:
            p.old_price && p.old_price > p.price
              ? `${p.old_price - p.price}€`
              : "",
          image,
          images: Array.isArray(p.images) ? p.images : [image],
          brand: p.brand || "Autre",
          category:
            (p.category && p.category.name) || p.category_name || "autre",
        };
      });

      setProducts(mapped);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
    }
  };

  // const handleAddToCart = () => {
  //   if (selectedProduct) {
  //     addToCart(selectedProduct);
  //     alert("Produit ajouté au panier !");
  //     closeModal();
  //   }
  // };

// const handleAddToCart = (quantity = 1) => {
//   if (selectedProduct) {
//     const priceNumber = selectedProduct.newPrice
//       ? parseFloat(selectedProduct.newPrice.toString().replace("€", ""))
//       : 0; // fallback si newPrice est undefined

//     const productToAdd = {
//       id: selectedProduct.id,
//       name: selectedProduct.name,
//       price: priceNumber,
//       image: selectedProduct.image,
//       quantity: quantity,
//     };

//     addToCart(productToAdd, quantity);
//     alert("Produit ajouté au panier !");
//     closeModal();
//   }
// };


const handleAddToCart = (quantity = 1) => {
  if (selectedProduct) {
   
        const priceNumber = Number(selectedProduct.price) || 0;


    const productToAdd = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: priceNumber,
      image: selectedProduct.image,
      quantity: quantity,
    };

    addToCart(productToAdd, quantity);
    alert("Produit ajouté au panier !");
    closeModal();
  }
};




  const filteredProducts = products.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category)
      return false;

    if (filters.brand !== "all" && product.brand !== filters.brand) return false;

    const productPrice = parseInt(product.newPrice);
    if (filters.minPrice && productPrice < parseInt(filters.minPrice))
      return false;
    if (filters.maxPrice && productPrice > parseInt(filters.maxPrice))
      return false;

    return true;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedImage(0);
    setQuantity(1);
  };

  const closeModal = () => setSelectedProduct(null);

  const changeImage = (index) => setSelectedImage(index);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
      brand: "all",
    });
  };

  // Génération des catégories et marques uniques dynamiques
  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand))];

  return (
    <div className="ecommerce">
      <div className="container">
        <div className="section-header">
          <h1>Profitez des meilleures offres sur nos produits</h1>
        </div>

        <div className="content-wrapper">
          {/* Sidebar */}
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
                    checked={filters.category === "all"}
                    onChange={handleFilterChange}
                  />
                  Toutes les catégories
                </label>
                {categories.map((cat) => (
                  <label key={cat}>
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={filters.category === cat}
                      onChange={handleFilterChange}
                    />
                    {cat}
                  </label>
                ))}
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
                    checked={filters.brand === "all"}
                    onChange={handleFilterChange}
                  />
                  Toutes les marques
                </label>
                {brands.map((brand) => (
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

          {/* Produits */}
          <div className="products-container">
            <div className="products-grid">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => openModal(product)}
                >
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                    />
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="price-container">
                    <span className="original-price">{product.originalPrice}</span>
                    <span className="new-price">{product.newPrice}</span>
                  </div>
                  {product.saving && (
                    <div className="saving">Économisez {product.saving}</div>
                  )}
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`pagination-btn ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

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

      {/* Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <div className="modal-body">
              <div className="modal-image-gallery">
                <div className="main-image">
                  <img
                    src={selectedProduct.images[selectedImage]}
                    alt={selectedProduct.name}
                  />
                </div>
                <div className="thumbnail-container">
                  {selectedProduct.images.map((image, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${
                        selectedImage === index ? "active" : ""
                      }`}
                      onClick={() => changeImage(index)}
                    >
                      <img src={image} alt={`Vue ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-details">
                <h2>{selectedProduct.name}</h2>
                <p className="product-description">
                  {selectedProduct.description}
                </p>

                <div className="price-container-modal">
                  <span className="original-price">
                    {selectedProduct.originalPrice}
                  </span>
                  <span className="new-price">{selectedProduct.newPrice}</span>
                  {selectedProduct.saving && (
                    <div className="saving">
                      Économisez {selectedProduct.saving}
                    </div>
                  )}
                </div>

                <div className="product-specs">
                  <h4>Caractéristiques</h4>
                  <ul>
                    <li>
                      <strong>Marque:</strong> {selectedProduct.brand}
                    </li>
                    <li>
                      <strong>Catégorie:</strong> {selectedProduct.category}
                    </li>
                    <li>
                      <strong>Garantie:</strong> 2 ans
                    </li>
                    <li>
                      <strong>Livraison:</strong> Gratuite
                    </li>
                    <li>
                      <strong>Disponibilité:</strong> En stock
                    </li>
                  </ul>
                </div>

                <div className="quantity-selector">
                            <input type="number" id="quantity" min="1" defaultValue="1" />
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(parseInt(quantity))}
                >
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
