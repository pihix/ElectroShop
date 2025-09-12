// src/composant/SmartphoneDeals.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../assets/css/SmartphoneDeals.css";
import Banner from "./Banner";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContext";

const API_BASE = "http://localhost:8000";
const TOKEN = localStorage.getItem("token");

export default function SmartphoneDeals() {
  const [products, setProducts] = useState([]);
  const [grouped, setGrouped] = useState({}); // { categoryName: [products...] }
  const [sectionsOrder, setSectionsOrder] = useState([]); // order of sections to render
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    let categoriesMap = {};

    // 1) Try fetch categories to build id->name map (optional; may require admin)
    try {
      const catRes = await axios.get(`${API_BASE}/categories`, {
        headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
      });
      const cats = catRes.data?.data || [];
      cats.forEach((c) => {
        if (c && c.id != null) categoriesMap[c.id] = c.name;
      });
    } catch (err) {
      // pas grave si on ne peut pas récupérer les catégories (401/403)
      console.warn("Impossible de charger /categories (fallback to product data):", err?.message || err);
    }

    // 2) Fetch products
    try {
      const res = await axios.get(`${API_BASE}/products?page=1&limit=100`);
      const raw = res.data?.data || [];

      // map products into shape used by UI
      const mapped = raw.map((p) => {
        // try to find an image:
        const image =
          p.thumbnail ||
          (Array.isArray(p.images) && p.images.length ? p.images[0] : null) ||
          p.image || // fallback check if your api uses 'image'
          "/placeholder.jpg";

        // category name resolution:
        const categoryName =
          (p.category && (p.category.name || p.category.title)) || // if product includes nested category
          categoriesMap[p.category_id] || // if we fetched categories map
          p.category_name || // sometimes backend returns category_name directly
          p.category || // guard
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
          image, // primary image url
          category_id: p.category_id,
          category_name: categoryName,
          raw: p, // keep original if needed
        };
      });

      setProducts(mapped);

      // 3) group by category name
      const groupedMap = mapped.reduce((acc, prod) => {
        const cat = prod.category_name || "Autres";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(prod);
        return acc;
      }, {});

      // 4) order sections: prefer some friendly order, then remaining sorted alphabetically
      const preferred = [
        "Smartphone",
        "Smartphones",
        "Téléphone",
        "Téléphones",
        "Mobile",
        "Ordinateur Portable",
        "Ordinateur",
        "Laptop",
        "PC",
        "Accessoire",
        "Accessoires",
        "Tablette",
        "Electroménager",
        "Électroménager",
        "Autres",
      ];

      const uniqueCats = Object.keys(groupedMap);
      const ordered = [];

      // push preferred ones that exist
      preferred.forEach((pName) => {
        const found = uniqueCats.find((c) => c.toLowerCase() === pName.toLowerCase());
        if (found && !ordered.includes(found)) ordered.push(found);
      });

      // push remaining categories (not yet added) in alphabetical order
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

  const closeModal = () => {
    setSelectedProduct(null);
  };

  // const handleAddToCart = () => {
  //   if (!selectedProduct) return;
  //   addToCart(selectedProduct, Math.max(1, quantity));
  //   alert("Produit ajouté au panier !");
  //   closeModal();
  // };

//  const handleAddToCart = (quantity = 1) => {
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


      console.log("Parsed priceNumber:", selectedProduct.price);

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




  const onImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/placeholder.jpg";
  };

  // UI render helpers
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
      <div className="price-container">
        <span className="original-price">{product.old_price ? `${product.old_price} €` : ""}</span>
        <span className="new-price">{product.price} €</span>
      </div>
      {product.discount_percentage > 0 && (
        <div className="saving">-{product.discount_percentage}%</div>
      )}
    </div>
  );

  return (
    <div className="smartphone-deals">
      {sectionsOrder.length === 0 && products.length === 0 ? (
        <div className="text-center p-4">Aucun produit trouvé.</div>
      ) : (
        sectionsOrder.map((sectionName) => (
          <div key={sectionName} className="deals-container">
            <div className="section-header">
              <h1 className="section-title">Profitez des meilleures offres sur {sectionName}</h1>
              <Link to="/all-products" className="view-all-link">
                Voir plus <span className="arrow">→</span>
              </Link>
            </div>

            <div className={["Smartphone", "Smartphones", "Téléphone", "Téléphones", "Mobile"].includes(sectionName) ? "products-grid" : "brands-grid"}>
              {(grouped[sectionName] || []).map((prod) => renderProductCard(prod))}
            </div>
          </div>
        ))
      )}

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

                {/* <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Ajouter au panier
                </button> */}

                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(parseInt(quantity))}
                >
                  Ajouter au panier
                </button>


                {/* Thumbnails (si plusieurs images) */}
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {selectedProduct.images.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`${selectedProduct.title} ${idx}`}
                        style={{ width: 64, height: 64, objectFit: "cover", cursor: "pointer", borderRadius: 6 }}
                        onClick={() => setSelectedProduct((s) => ({ ...s, image_url: imgUrl }))}
                        onError={onImgError}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
