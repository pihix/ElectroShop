import { useState } from 'react';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import Sidebar from './SideBarre';
import Topbar from './TopBarre';
import CommandeData from './CommandeData';
import '../../assets/css/Admin/Commandes.css'; 

export default function Commandes() {
  const [products, setProducts] = useState([
    { id: 201, nom: 'Carlos', qte: 10, prix: '799€', is_active: true },
    { id: 202, nom: 'Jean', qte: 5, prix: '999€', is_active: false },
    { id: 203, nom: 'Marie', qte: 8, prix: '699€', is_active: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "view"
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
    if (window.confirm("Voulez-vous vraiment supprimer cette commande ?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
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
