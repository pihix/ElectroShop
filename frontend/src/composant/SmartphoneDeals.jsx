import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../assets/css/SmartphoneDeals.css";
import Banner from "./Banner";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContext";

const API_BASE = "http://localhost:8000";
const TOKEN = localStorage.getItem("token");

export default function SmartphoneDeals({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [sectionsOrder, setSectionsOrder] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    let categoriesMap = {};

    // Récupération des catégories
    try {
      const catRes = await axios.get(`${API_BASE}/categories`, {
        headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
      });
      const cats = catRes.data?.data || [];
      cats.forEach((c) => {
        if (c && c.id != null) categoriesMap[c.id] = c.name;
      });
    } catch (err) {
      console.warn("Impossible de charger /categories:", err?.message || err);
    }

    // Récupération des produits
    try {
      const res = await axios.get(`${API_BASE}/products?page=1&limit=100`);
      const raw = res.data?.data || [];

      const mapped = raw.map((p) => {
        const image =
          p.thumbnail ||
          (Array.isArray(p.images) && p.images.length ? p.images[0] : null) ||
          p.image ||
          "/placeholder.jpg";

        const categoryName =
          (p.category && (p.category.name || p.category.title)) ||
          categoriesMap[p.category_id] ||
          p.category_name ||
          p.category ||
          "Autres";

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          old_price: p.old_price ?? null,
          discount_percentage: p.discount_percentage ?? 0,
          rating: p.rating ?? 0,
          stock: p.stock ?? 0,
          brand: p.brand ?? "",
          images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
          thumbnail: p.thumbnail ?? image,
          image,
          category_id: p.category_id,
          category_name: categoryName,
          raw: p,
        };
      });

      setProducts(mapped);

      // Grouper par catégorie
      const groupedMap = mapped.reduce((acc, prod) => {
        const cat = prod.category_name || "Autres";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(prod);
        return acc;
      }, {});

      const preferred = [
        "Smartphone","Smartphones","Téléphone","Téléphones","Mobile",
        "Ordinateur Portable","Ordinateur","Laptop","PC",
        "Accessoire","Accessoires","Tablette","Electroménager","Électroménager","Autres"
      ];

      const uniqueCats = Object.keys(groupedMap);
      const ordered = [];

      preferred.forEach((pName) => {
        const found = uniqueCats.find((c) => c.toLowerCase() === pName.toLowerCase());
        if (found && !ordered.includes(found)) ordered.push(found);
      });

      uniqueCats
        .filter((c) => !ordered.includes(c))
        .sort((a, b) => a.localeCompare(b, "fr"))
        .forEach((c) => ordered.push(c));

      setGrouped(groupedMap);
      setSectionsOrder(ordered);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
    }
  }

  const openModal = (product) => {
    setSelectedProduct({
      ...product,
      image_url: product.image || product.thumbnail || (product.images && product.images[0]) || "/placeholder.jpg",
      images: product.images || [],
    });
    setQuantity(1);
  };

  const closeModal = () => setSelectedProduct(null);

  const handleAddToCart = (quantity = 1) => {
    if (!selectedProduct) return;
    if (quantity > selectedProduct.stock) {
      alert(`Il ne reste que ${selectedProduct.stock} exemplaire(s) en stock.`);
      return;
    }
    const priceNumber = Number(selectedProduct.price) || 0;
    const productToAdd = {
      id: selectedProduct.id,
      name: selectedProduct.title,
      price: priceNumber,
      image: selectedProduct.image,
      quantity,
    };
    addToCart(productToAdd, quantity);
    alert("Produit ajouté au panier !");
    closeModal();
  };

  const onImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/placeholder.jpg";
  };

  const renderProductCard = (product) => (
    <div key={product.id} className="product-card" onClick={() => openModal(product)}>
      <div className="product-image">
        <img
          src={product.image || product.thumbnail || "/placeholder.jpg"}
          alt={product.title}
          onError={onImgError}
        />
      </div>
      <h3 className="product-name">{product.title}</h3>
      <p className="product-description">
        {product.description ? product.description.slice(0, 100) + "..." : ""}
      </p>
      <div className="price-container">
        <span className="original-price">{product.old_price ? `${product.old_price} €` : ""}</span>
        <span className="new-price">{product.price} €</span>
      </div>
      {product.discount_percentage > 0 && <div className="saving">-{product.discount_percentage}%</div>}
    </div>
  );

  // 🔹 Filtrage par searchTerm passé depuis TopHeader
  const filteredGrouped = Object.fromEntries(
    Object.entries(grouped).map(([cat, prods]) => [
      cat,
      prods.filter((p) =>
        p.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      ),
    ])
  );

  return (
    <div className="smartphone-deals">
      {sectionsOrder.map((sectionName) => {
        const filteredProds = filteredGrouped[sectionName] || [];
        if (filteredProds.length === 0) return null;
        return (
          // <div key={sectionName} className="deals-container">
          <div key={sectionName} id={sectionName.toLowerCase().replace(/\s+/g, '-')} className="deals-container">

            <div className="section-header">
              <h1 className="section-title">
                Profitez des meilleures offres sur {sectionName}
              </h1>
              <Link to="/all-products" className="view-all-link">
                Voir plus <span className="arrow">→</span>
              </Link>
            </div>
            <div
              className={["Smartphone","Smartphones","Téléphone","Téléphones","Mobile"].includes(sectionName)
                ? "products-grid"
                : "brands-grid"}
            >
              {filteredProds.map((prod) => renderProductCard(prod))}
            </div>
          </div>
        );
      })}
      <Banner />

      {/* Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <div className="modal-body">
              <div className="modal-image">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.title}
                  onError={onImgError}
                />
              </div>
              <div className="modal-details">
                <h2>{selectedProduct.title}</h2>
                <p className="product-description">{selectedProduct.description || "Aucune description"}</p>
                <div className="price-container-modal">
                  <span className="original-price">{selectedProduct.old_price ? `${selectedProduct.old_price} €` : ""}</span>
                  <span className="new-price">{selectedProduct.price} €</span>
                </div>
                <p><strong>Catégorie :</strong> {selectedProduct.category_name}</p>
                <p><strong>Marque :</strong> {selectedProduct.brand || "—"}</p>
                <p><strong>Stock :</strong> {selectedProduct.stock}</p>
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantité:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || 1)))}
                  />
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
}