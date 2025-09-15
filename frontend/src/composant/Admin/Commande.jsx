import { useState } from 'react';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import Sidebar from './SideBarre';
import Topbar from './TopBarre';
import CommandeData from './CommandeData';
<<<<<<< HEAD
import '../../assets/css/Admin/Commandes.css';
=======
import '../../assets/css/Admin/Commandes.css'; 
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158

export default function Commandes() {
  const [products, setProducts] = useState([
    { id: 201, nom: 'Carlos', qte: 10, prix: '799€', is_active: true },
<<<<<<< HEAD
    { id: 202, nom: 'Jean', qte: 5, prix: '999€', is_active: true },
    { id: 203, nom: 'Marie', qte: 8, prix: '699€', is_active: false },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); 
=======
    { id: 202, nom: 'Jean', qte: 5, prix: '999€', is_active: false },
    { id: 203, nom: 'Marie', qte: 8, prix: '699€', is_active: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "view"
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedProduct(null);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalType("view");
    setShowModal(true);
  };

  const handleDelete = (id) => {
<<<<<<< HEAD
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      setProducts(products.filter(p => p.id !== id));
=======
    if (window.confirm("Voulez-vous vraiment supprimer cette commande ?")) {
      setProducts(products.filter((p) => p.id !== id));
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
    }
  };

  return (
<<<<<<< HEAD
    <div className="d-flex commandes-page">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '100vh' }}>
        <Topbar />
        <Container fluid className="mt-4">
          {/* Header */}
          <Row className="mb-4 align-items-center">
            <Col>
              <h4 className="page-title">Gestion des Commandes</h4>
              <p className="page-subtitle">Liste complète des commandes enregistrées</p>
            </Col>
          </Row>

          {/* Table Produits */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm commandes-card">
=======
    <div className="d-flex commandes-container">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto commandes-content">
        <Topbar />
        <Container fluid className="mt-4">
          <Row className="mb-4 header-section">
            <Col>
              <h4 className="page-title">📦 Gestion des Commandes</h4>
              <p className="text-muted">Liste complète des commandes enregistrées</p>
            </Col>
          </Row>

          {/* Table des Commandes */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm custom-card">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                <Card.Body className="p-0">
                  <CommandeData 
                    commandes={products}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

<<<<<<< HEAD
        {/* Modal détails */}
        {modalType === "view" && selectedProduct && (
          <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Détails de la commande</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="commande-details">
                <h4 className="mb-4">{selectedProduct.nom}</h4>

                <div className="detail-box">
                  <p className="label">💰 Prix :</p>
                  <p className="value">{selectedProduct.prix}</p>
                </div>

                <div className="detail-box">
                  <p className="label">📦 Quantité :</p>
                  <p className="value">{selectedProduct.qte}</p>
                </div>

                <div className="detail-box d-flex align-items-center">
                  <p className="label me-2">⚡ Statut :</p>
                  <span className={`badge ${selectedProduct.is_active ? "bg-success" : "bg-secondary"}`}>
=======
        {/* Modal Détails */}
        {modalType === "view" && selectedProduct && (
          <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="modal-header-custom">
              <Modal.Title>Détails de la commande</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="details-container">
                <h4 className="mb-4">{selectedProduct.nom}</h4>

                <div className="detail-box">
                  <p className="fw-bold">💰 Prix :</p>
                  <span>{selectedProduct.prix}</span>
                </div>

                <div className="detail-box">
                  <p className="fw-bold">📦 Quantité :</p>
                  <span>{selectedProduct.qte}</span>
                </div>

                <div className="detail-box d-flex align-items-center">
                  <p className="fw-bold me-2">⚡ Statut :</p>
                  <span
                    className={`badge status-badge ${
                      selectedProduct.is_active ? "active" : "inactive"
                    }`}
                  >
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                    {selectedProduct.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </div>
  );
}
