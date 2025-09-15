<<<<<<< HEAD
import React, { useState } from 'react';
import'../assets/css/SmartphoneDeals.css'
import Banner from './Banner';
import smart1 from "../assets/images/smart1.jpg";
import smart2 from "../assets/images/smart2.jpg";
import smart3 from "../assets/images/smart3.jpg";
import smart4 from "../assets/images/smart4.jpg";
import smart5 from "../assets/images/smart5.jpg";
import ordi1 from "../assets/images/ordi1.jpg";
import ordi2 from "../assets/images/ordi2.jpg";
import ordi3 from "../assets/images/ordi3.jpg";
import ordi4 from "../assets/images/ordi4.jpg";
import ordi5 from "../assets/images/ordi5.jpg";
import ordi6 from "../assets/images/ordi6.jpg";
import access1 from "../assets/images/accessoire1.jpg";
import access2 from "../assets/images/accessoire2.jpg";
import access3 from "../assets/images/accessoire3.jpg";
import access4 from "../assets/images/accessoire4.jpg";
import access5 from "../assets/images/accessoire5.jpg";
import { Link } from 'react-router-dom';






const SmartphoneDeals = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Données des produits smartphones
  const products = [
    {
      id: 1,
      name: "Gallery 522 Ultra",
      originalPrice: "E25799",
      newPrice: "E46799",
      saving: "E25799",
      image: smart1,
      description: "Smartphone haut de gamme avec écran 6.7 pouces, appareil photo 108MP et batterie longue durée. Processeur dernière génération pour des performances optimales."
    },
    {
      id: 2,
      name: "Gallery M13 HGB | A4 GB",
      originalPrice: "E16499",
      newPrice: "E46799",
      saving: "H4800",
      image: smart2,
      description: "Performance équilibrée avec options de RAM multiples et stockage extensible. Parfait pour un usage quotidien et multitâche."
    },
    {
      id: 3,
      name: "Gallery M23 HGB | A4 GB",
      originalPrice: "E16999",
      newPrice: "E46799",
      saving: "H3800",
      image: smart3,
      description: "Idéal pour le gaming avec processeur rapide et refroidissement avancé. Autonomie exceptionnelle pour les longues sessions de jeu."
    },
    {
      id: 4,
      name: "Gallery M25 HGB | A4 GB",
      originalPrice: "E31999",
      newPrice: "E46799",
      saving: "F9000",
      image: smart4,
      description: "Design élégant avec écran AMOLED et fonctionnalités photo avancées. Capteurs haute résolution pour des photos professionnelles."
    },
    {
      id: 5,
      name: "Gallery S22 Ultra",
      originalPrice: "E67799",
      newPrice: "E46799",
      saving: "F18000",
      image: smart5,
      description: "Version premium avec davantage de stockage et fonctions exclusives. Compatible avec la 5G et technologies de pointe."
    }
  ];

  // Marques électroniques (ordinateurs avec prix)
  const brands = [
    { 
      name: "iPhone", 
      discount: "UP to 80% OFF", 
      image: ordi1, 
      description: "Ordinateur portable Apple performant avec design premium et autonomie optimisée.",
      originalPrice: "E25999",
      newPrice: "E19999",
      saving: "E6000"
    },
    { 
      name: "Samsung", 
      discount: "UP to 70% OFF", 
      image: ordi2, 
      description: "Laptop Samsung avec écran AMOLED, multitâche fluide et design léger.",
      originalPrice: "E20999",
      newPrice: "E14999",
      saving: "E5000"
    },
    { 
      name: "Google", 
      discount: "UP to 60% OFF", 
      image: ordi3, 
      description: "Chromebook rapide et optimisé pour les applications web et Google Workspace.",
      originalPrice: "E15999",
      newPrice: "E11999",
      saving: "E4000"
    },
    { 
      name: "Xiaomi", 
      discount: "UP to 75% OFF", 
      image: ordi4, 
      description: "Notebook Xiaomi avec autonomie longue durée et écran Full HD vibrant.",
      originalPrice: "E18999",
      newPrice: "E13999",
      saving: "E5000"
    },
    { 
      name: "Huawei", 
      discount: "UP to 65% OFF", 
      image: ordi5, 
      description: "Matebook Huawei léger et puissant, parfait pour la productivité et le divertissement.",
      originalPrice: "E22999",
      newPrice: "E17999",
      saving: "E5000"
    },


    { 
      name: "Huawei", 
      discount: "UP to 65% OFF", 
      image: ordi6, 
      description: "Matebook Huawei léger et puissant, parfait pour la productivité et le divertissement.",
      originalPrice: "E22999",
      newPrice: "E17999",
      saving: "E5000"
    }
  ];

  //Accessoires
  const accessories = [
    {
      id: 1,
      name: "Skywatcher Electronic Shutter",
      originalPrice: "E25799",
      newPrice: "E46799",
      saving: "E25799",
      image: access1,
      description: "Skywatcher Electronic Shutter Release Cable AP-R3C OPT2 for Canon."
    },
    {
      id: 2,
      name: "Logitech G Pro X Gaming Headset",
      originalPrice: "E16499",
      newPrice: "E46799",
      saving: "H4800",
      image: access2,
      description: "Casque gaming filaire - circum-aural fermé - DTS Headphone:X 2.0 - microphone unidirectionnel à technologie Blue Vo!ce - mousse à mémoire de forme."
    },
    {
      id: 3,
      name: "Routeur",
      originalPrice: "E16999",
      newPrice: "E46799",
      saving: "H3800",
      image: access3,
      description: "Noir routeur accès wi-fi gratuit."
    },
    {
      id: 4,
      name: "Chargeur et câble d'alimentation PC",
      originalPrice: "E31999",
      newPrice: "E46799",
      saving: "F9000",
      image: access4,
      description: "Chargeur Compatible pour pc portable HP Pavilion 15 Series."
    },
    {
      id: 5,
      name: "RJ45",
      originalPrice: "E67799",
      newPrice: "E46799",
      saving: "F18000",
      image: access5,
      description: "Un connecteur RJ45 est une interface physique souvent utilisée pour terminer les câbles de type paire torsadée."
    }
  ];

  // Ouvrir le modal smartphone
  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  // Fermer le modal smartphone
=======
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

>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
  const closeModal = () => {
    setSelectedProduct(null);
  };

<<<<<<< HEAD
  // Ouvrir le modal ordinateur
  const openBrandModal = (brand) => {
    setSelectedBrand(brand);
    setQuantity(1);
  };

  // Fermer le modal ordinateur
  const closeBrandModal = () => {
    setSelectedBrand(null);
  };

  // Ajouter au panier (smartphones + ordinateurs)
  const addToCart = () => {
    if (selectedProduct) {
      alert(`Ajouté au panier: ${quantity} x ${selectedProduct.name}`);
      closeModal();
    } else if (selectedBrand) {
      alert(`Ajouté au panier: ${quantity} x ${selectedBrand.name}`);
      closeBrandModal();
    }
  };

  return (
    <div className="smartphone-deals">
      {/* Section des offres smartphones */}
      <div id="smartphones" className="deals-container">
        <div className="section-header">
          <h1 className="section-title">
            Profitez des meilleures offres sur les smartphones
          </h1>

          <Link to="/all-products" className="view-all-link">
            Voir plus <span className="arrow">→</span>
          </Link>
        </div>

        
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card" onClick={() => openModal(product)}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <div className="price-container">
                <span className="original-price">{product.originalPrice}</span>
                <span className="new-price">{product.newPrice}</span>
              </div>
              <div className="saving">Save - {product.saving}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bannière */}
      

      {/* Section des marques électroniques (ordinateurs) */}
      <div className="brands-section">
        <div className="section-header">
          <h1>Profitez des meilleures offres sur les ordinateurs</h1>
          
         <Link to="/all-products" className="view-all-link">
            Voir plus <span className="arrow">→</span>
          </Link>
        </div>
        <div className="brands-grid">
          {brands.map((brand, index) => (
            <div key={index} className="brand-card" onClick={() => openBrandModal(brand)}>
              <div className="brand-image-circle">
                <img src={brand.image} alt={brand.name} />
              </div>
              <h3 className="brand-name">{brand.name}</h3>
              <div className="brand-discount">{brand.discount}</div>
              {/* Prix ajouté sur l’élément initial */}
              <div className="price-container">
                <span className="original-price">{brand.originalPrice}</span>
                <span className="new-price">{brand.newPrice}</span>
              </div>
              <div className="saving">Save - {brand.saving}</div>
            </div>
          ))}
        </div>

      </div>

      <Banner/>

      <div className="deals-container">
        <div className="section-header">
          <h1>Profitez des meilleures offres sur les accessoires</h1>
          
          <Link to="/all-products" className="view-all-link">
            Voir plus <span className="arrow">→</span>
          </Link>
        </div>
        
        <div className="products-grid">
          {accessories.map((access) => (
            <div key={access.id} className="product-card" onClick={() => openModal(access)}>
              <div className="product-image">
                <img src={access.image} alt={access.name} />
              </div>
              <h3 className="product-name">{access.name}</h3>
              <div className="price-container">
                <span className="original-price">{access.originalPrice}</span>
                <span className="new-price">{access.newPrice}</span>
              </div>
              <div className="saving">Save - {access.saving}</div>
            </div>
          ))}
        </div>
      </div>


      <div className="deals-container">
        <div className="section-header">
          <h1>Profitez des meilleures offres sur les tablettes</h1>
          
          <a href="/all-products" className="view-all-link">
            Voir plus <span className="arrow">→</span>
          </a>
        </div>
        
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card" onClick={() => openModal(product)}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <div className="price-container">
                <span className="original-price">{product.originalPrice}</span>
                <span className="new-price">{product.newPrice}</span>
              </div>
              <div className="saving">Save - {product.saving}</div>
            </div>
          ))}
        </div>
      </div>


       <div className="brands-section">
        <div className="section-header">
          <h1>Profitez des meilleures offres sur les electromenager</h1>

          <Link to="/all-products" className="view-all-link">
            Voir plus <span className="arrow">→</span>
          </Link>
        </div>
        <div className="brands-grid">
          {brands.map((brand, index) => (
            <div key={index} className="brand-card" onClick={() => openBrandModal(brand)}>
              <div className="brand-image-circle">
                <img src={brand.image} alt={brand.name} />
              </div>
              <h3 className="brand-name">{brand.name}</h3>
              <div className="brand-discount">{brand.discount}</div>
              {/* Prix ajouté sur l’élément initial */}
              <div className="price-container">
                <span className="original-price">{brand.originalPrice}</span>
                <span className="new-price">{brand.newPrice}</span>
              </div>
              <div className="saving">Save - {brand.saving}</div>
            </div>
          ))}
        </div>
        </div>


      {/* Modal smartphone */}
=======
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
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
<<<<<<< HEAD
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              
              <div className="modal-details">
                <h2>{selectedProduct.name}</h2>
                <p className="product-description">{selectedProduct.description}</p>
                
                <div className="price-container-modal">
                  <span className="original-price">{selectedProduct.originalPrice}</span>
                  <span className="new-price">{selectedProduct.newPrice}</span>
                  <div className="saving">Save - {selectedProduct.saving}</div>
                </div>
                
=======
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

>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantité:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
<<<<<<< HEAD
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                </div>
                
                <button className="add-to-cart-btn" onClick={addToCart}>
                  Ajouter au panier
                </button>
=======
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
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
              </div>
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD

      {/* Modal ordinateurs */}
      {selectedBrand && (
        <div className="modal-overlay" onClick={closeBrandModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeBrandModal}>×</button>
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedBrand.image} alt={selectedBrand.name} />
              </div>
              
              <div className="modal-details">
                <h2>{selectedBrand.name}</h2>
                <p className="product-description">{selectedBrand.description}</p>
                
                <div className="price-container-modal">
                  <span className="original-price">{selectedBrand.originalPrice}</span>
                  <span className="new-price">{selectedBrand.newPrice}</span>
                  <div className="saving">Save - {selectedBrand.saving}</div>
                </div>
                
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantité:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                </div>
                
                <button className="add-to-cart-btn" onClick={addToCart}>
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

export default SmartphoneDeals;
=======
    </div>
  );
}
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
