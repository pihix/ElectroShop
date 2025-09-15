<<<<<<< HEAD
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import Sidebar from './SideBarre';
import Topbar from './TopBarre';
import ProductData from './ProductData';
import '../../assets/css/Admin/Produits.css'; 

export default function Produits() {
  const [products, setProducts] = useState([
    { id: 1, nom: 'Iphone 11', prix: '799€', qte: 10, categorie: 'Smartphones', is_active: true, marque: 'Apple', description: 'Un smartphone performant avec double caméra.', images: [] },
    { id: 2, nom: 'Samsung Galaxy S21', prix: '999€', qte: 5, categorie: 'Smartphones', is_active: true, marque: 'Samsung', description: 'Dernière génération avec écran AMOLED.', images: [] },
    { id: 3, nom: 'Google Pixel 5', prix: '699€', qte: 8, categorie: 'Smartphones', is_active: true, marque: 'Google', description: 'Un smartphone optimisé pour Android pur.', images: [] },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const emptyProduct = { nom: '', prix: '', qte: '', categorie: '', is_active: true, marque: '', description: '', images: [] };

  const handleClose = () => { setShowModal(false); setModalType(null); setSelectedProduct(null); };
  const handleAdd = () => { setSelectedProduct(emptyProduct); setModalType("add"); setShowModal(true); };
  const handleView = (product) => { setSelectedProduct(product); setModalType("view"); setShowModal(true); };
  const handleEdit = (product) => { setSelectedProduct(product); setModalType("edit"); setShowModal(true); };
  const handleDelete = (id) => { if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) setProducts(products.filter(p => p.id !== id)); };
  const handleSave = () => {
    if (modalType === "edit") setProducts(products.map(p => (p.id === selectedProduct.id ? selectedProduct : p)));
    else if (modalType === "add") setProducts([...products, { id: products.length + 1, ...selectedProduct }]);
    handleClose();
  };
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') setSelectedProduct({ ...selectedProduct, [name]: checked });
    else if (type === 'file') setSelectedProduct({ ...selectedProduct, images: Array.from(files) });
    else setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  return (
    <div className="d-flex produits-page">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '100vh' }}>
        <Topbar />
        <Container fluid className="mt-4 produits-container">
          
          {/* HEADER */}
          <Row className="mb-4 produits-header">
            <Col>
              <h4 className="produits-title">Gestion des Produits</h4>
              <p className="produits-subtitle">Liste complète des produits enregistrés</p>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleAdd} className="btn-add">
=======
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import Sidebar from "./SideBarre";
import Topbar from "./TopBarre";
import ProductData from "./ProductData";
import "../../assets/css/Admin/Produits.css"; 

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

  const handleSave = async () => {
    if (!selectedProduct.nom || !selectedProduct.categorie) {
      alert("Veuillez remplir le nom et la catégorie.");
      return;
    }

    const category = categories.find((cat) => cat.name === selectedProduct.categorie);
    if (!category) {
      alert("Veuillez sélectionner une catégorie valide !");
      return;
    }

    let imagesArray = [];
    if (selectedProduct.images && selectedProduct.images.length > 0) {
      imagesArray = selectedProduct.images.map((f) =>
        typeof f === "string" ? f : f.url || f.name || "default.jpg"
      );
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

    try {
      if (modalType === "edit") {
        await axios.put(`${API_BASE}/products/${selectedProduct.id}`, payload, {
          headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        });
      } else if (modalType === "add") {
        await axios.post(`${API_BASE}/products`, payload, {
          headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        });
      }

      fetchProducts();
      handleClose();
    } catch (err) {
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
    <div className="d-flex produits-container">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto produits-content">
        <Topbar />
        <Container fluid className="mt-4">
          <Row className="mb-4 produits-header">
            <Col>
              <h4 className="page-title">🛍️ Gestion des Produits</h4>
              <p className="text-muted">Liste complète des produits enregistrés</p>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleAdd} className="add-btn">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                <i className="fas fa-plus me-2"></i>Ajouter un produit
              </Button>
            </Col>
          </Row>

<<<<<<< HEAD
          {/* TABLE PRODUITS */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm produits-table-card">
                <Card.Body className="p-0">
                  <ProductData products={products} onView={handleView} onEdit={handleEdit} onDelete={handleDelete}/>
=======
          <Row>
            <Col>
              <Card className="border-0 shadow-sm produits-card">
                <Card.Body className="p-0">
                  <ProductData
                    products={products}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

<<<<<<< HEAD
        {/* MODAL VIEW */}
        {modalType === "view" && selectedProduct && (
          <Modal show={showModal} onHide={handleClose} size="lg" className="produit-modal">
            <Modal.Header closeButton>
              <Modal.Title>Détails du produit</Modal.Title>
            </Modal.Header>
            <Modal.Body className="produit-detail">
              <h4 className="mb-4">{selectedProduct.nom}</h4>
              <div className="detail-box"><p>Prix :</p><span>{selectedProduct.prix}</span></div>
              <div className="detail-box"><p>Quantité :</p><span>{selectedProduct.qte}</span></div>
              <div className="detail-box"><p>Catégorie :</p><span>{selectedProduct.categorie}</span></div>
              <div className="detail-box"><p>Marque :</p><span>{selectedProduct.marque}</span></div>
              <div className="detail-box"><p>Description :</p><span>{selectedProduct.description}</span></div>
              <div className="detail-box">
                <p>Statut :</p>
                <span className={`badge ${selectedProduct.is_active ? "bg-success" : "bg-secondary"}`}>
                  {selectedProduct.is_active ? "Actif" : "Inactif"}
                </span>
              </div>
            </Modal.Body>
          </Modal>
        )}

        {/* MODAL ADD/EDIT */}
        {(modalType === "add" || modalType === "edit") && selectedProduct && (
          <Modal show={showModal} onHide={handleClose} size="lg" className="produit-modal">
            <Modal.Header closeButton>
              <Modal.Title>{modalType === "edit" ? "Modifier le produit" : "Ajouter un produit"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className="produit-form">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom du produit</Form.Label>
                      <Form.Control type="text" name="nom" value={selectedProduct.nom} onChange={handleChange}/>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prix</Form.Label>
                      <Form.Control type="text" name="prix" value={selectedProduct.prix} onChange={handleChange}/>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantité</Form.Label>
                      <Form.Control type="number" name="qte" value={selectedProduct.qte} onChange={handleChange}/>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Catégorie</Form.Label>
                      <Form.Control type="text" name="categorie" value={selectedProduct.categorie} onChange={handleChange}/>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Marque</Form.Label>
                      <Form.Control type="text" name="marque" value={selectedProduct.marque} onChange={handleChange}/>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={selectedProduct.description} onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Images</Form.Label>
                  <Form.Control type="file" name="images" multiple onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check type="checkbox" label="Produit actif" name="is_active" checked={selectedProduct.is_active} onChange={handleChange}/>
=======
        {/* Modal View */}
        {modalType === "view" && selectedProduct && (
          <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="modal-header-custom">
              <Modal.Title>Détails du produit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex flex-wrap gap-3">
                <div className="image-box">
                  <img
                    src={selectedProduct.image_url || "default.jpg"}
                    alt={selectedProduct.nom}
                    className="product-img"
                  />
                </div>
                <div className="flex-grow-1">
                  <h4 className="mb-3">{selectedProduct.nom}</h4>
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
                  <p><b>Remise :</b> {selectedProduct.discount_percentage || 0}%</p>
                  <p><b>Note :</b> {selectedProduct.rating || 0}/5</p>
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
          <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="modal-header-custom">
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
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Annuler</Button>
<<<<<<< HEAD
              <Button variant="primary" onClick={handleSave}>{modalType === "edit" ? "Modifier" : "Enregistrer"}</Button>
=======
              <Button variant="primary" onClick={handleSave}>
                {modalType === "edit" ? "Modifier" : "Enregistrer"}
              </Button>
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
}
