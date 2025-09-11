import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import Sidebar from "./SideBarre";
import Topbar from "./TopBarre";
import ProductData from "./ProductData";

const API_BASE = "http://localhost:8000";
const TOKEN = localStorage.getItem("token");

export default function Produits() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "view" | "edit" | "add"
  const [selectedProduct, setSelectedProduct] = useState(null);

  const emptyProduct = {
    nom: "",
    prix: "",
    qte: "",
    categorie: "",
    is_active: true,
    marque: "",
    description: "",
    image_url: "",
    images: [],
  };

  // Charger la liste depuis API
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products?page=1&limit=50`);
      const apiProducts = res.data.data.map((p) => ({
        id: p.id,
        nom: p.title,
        prix: p.price,
        qte: p.stock,
        categorie: p.category?.name || "",
        categorie_id: p.category_id,
        marque: p.brand,
        description: p.description,
        is_active: p.is_published,
        image_url: p.thumbnail,
        images: p.images,
      }));
      setProducts(apiProducts);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setCategories(res.data.data);
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedProduct(null);
  };

  const handleAdd = () => {
    setSelectedProduct(emptyProduct);
    setModalType("add");
    setShowModal(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalType("view");
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalType("edit");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Erreur suppression produit:", err);
    }
  };

  console.log("Produits chargés :", products);

const handleSave = async () => {
  // Vérification des champs obligatoires
  if (!selectedProduct.nom || !selectedProduct.categorie) {
    alert("Veuillez remplir le nom et la catégorie.");
    return;
  }

  // Récupération de l'objet catégorie depuis la liste
  const category = categories.find(cat => cat.name === selectedProduct.categorie);
  if (!category) {
    alert("Veuillez sélectionner une catégorie valide !");
    return;
  }

  // S'assurer qu'il y a au moins une image
 let imagesArray = [];

if (selectedProduct.images && selectedProduct.images.length > 0) {
  imagesArray = selectedProduct.images.map(f => {
    // si c'est un string (URL), garder tel quel
    if (typeof f === "string") return f;
    // si c'est un File, remplacer par URL ou nom temporaire
    return f.url || f.name || "default.jpg";
  });
} else if (selectedProduct.image_url) {
  imagesArray = [selectedProduct.image_url];
} else {
  imagesArray = ["default.jpg"];
}

const payload = {
  title: selectedProduct.nom,
  description: selectedProduct.description || "Aucune description",
  price: parseFloat(selectedProduct.prix) || 0,
  stock: parseInt(selectedProduct.qte) || 0,
  brand: selectedProduct.marque || "Inconnu",
  thumbnail: imagesArray[0],
  images: imagesArray,
  category_id: category.id,
  discount_percentage: parseFloat(selectedProduct.discount_percentage) || 0,
  rating: parseFloat(selectedProduct.rating) || 0,
  is_published: Boolean(selectedProduct.is_active),
};

console.log("Payload envoyé:", payload); // utile pour debug



  try {
    if (modalType === "edit") {
      console.log("TOKEN:", TOKEN);

      

      await axios.put(`${API_BASE}/products/${selectedProduct.id}`, payload, {
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      });
    } else if (modalType === "add") {

      await axios.post(`${API_BASE}/products`, payload, {
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      });
    }

    fetchProducts();  // Recharge la liste
    handleClose();    // Ferme le modal
  } catch (err) {
    console.error("Backend response:", err.response.data);
    console.error("Erreur création/modification produit :", err);
    alert("Erreur lors de l'opération. Vérifiez la console.");
  }
};


const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedProduct({
      ...selectedProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: "100vh" }}>
        <Topbar />
        <Container fluid className="mt-4">
          <Row className="mb-4">
            <Col>
              <h4 className="mb-0">Gestion des Produits</h4>
              <p className="text-muted mb-0">Liste complète des produits enregistrés</p>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleAdd}>
                <i className="fas fa-plus me-2"></i>Ajouter un produit
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  <ProductData
                    products={products}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

       
        {modalType === "view" && selectedProduct && (
  <Modal show={showModal} onHide={handleClose} size="lg" centered>
    <Modal.Header closeButton>
      <Modal.Title>Détails du produit</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="d-flex flex-wrap gap-3">
        <div style={{ flex: "0 0 250px" }}>
          <img
            src={selectedProduct.image_url || "default.jpg"}
            alt={selectedProduct.nom}
            style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
          />
        </div>
        <div className="flex-grow-1">
          <h4>{selectedProduct.nom}</h4>
          <p><b>Prix :</b> {selectedProduct.prix} €</p>
          <p><b>Quantité :</b> {selectedProduct.qte}</p>
          <p><b>Catégorie :</b> {selectedProduct.categorie}</p>
          <p><b>Marque :</b> {selectedProduct.marque}</p>
          <p><b>Description :</b> {selectedProduct.description || "Aucune description"}</p>
          <p>
            <b>Statut :</b>{" "}
            <Badge bg={selectedProduct.is_active ? "success" : "secondary"} className="rounded-pill">
              {selectedProduct.is_active ? "Actif" : "Inactif"}
            </Badge>
          </p>
          <p><b>Remise :</b> {selectedProduct.discount_percentage}%</p>
          <p><b>Note :</b> {selectedProduct.rating}/5</p>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>Fermer</Button>
    </Modal.Footer>
  </Modal>
)}


        {/* Modal Add/Edit */}
        {(modalType === "add" || modalType === "edit") && selectedProduct && (
          <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{modalType === "edit" ? "Modifier le produit" : "Ajouter un produit"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nom du produit</Form.Label>
                      <Form.Control
                        type="text"
                        name="nom"
                        value={selectedProduct.nom}
                        onChange={handleChange}
                        placeholder="Ex: iPhone 14"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Prix</Form.Label>
                      <Form.Control
                        type="number"
                        name="prix"
                        value={selectedProduct.prix}
                        onChange={handleChange}
                        placeholder="Ex: 1200"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Quantité</Form.Label>
                      <Form.Control
                        type="number"
                        name="qte"
                        value={selectedProduct.qte}
                        onChange={handleChange}
                        placeholder="Ex: 50"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Catégorie</Form.Label>
                      <Form.Select
                        name="categorie"
                        value={selectedProduct.categorie}
                        onChange={handleChange}
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Marque</Form.Label>
                      <Form.Control
                        type="text"
                        name="marque"
                        value={selectedProduct.marque}
                        onChange={handleChange}
                        placeholder="Ex: Apple"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleChange}
                    placeholder="Description du produit"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image (URL)</Form.Label>
                  <Form.Control
                    type="text"
                    name="image_url"
                    value={selectedProduct.image_url}
                    onChange={handleChange}
                    placeholder="Ex: /images/iphone14.jpg"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Produit actif"
                    name="is_active"
                    checked={selectedProduct.is_active}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSave}>
                {modalType === "edit" ? "Modifier" : "Enregistrer"}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
}
