import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import Sidebar from './SideBarre';
import Topbar from './TopBarre';
import CommandeData from './CommandeData';


export default function Commandes() {
  const [products, setProducts] = useState([
    {
      id: 201,
      nom: 'Carlos',
      qte: 10,
      prix: '799€',
    },
    {
      id: 202,
      nom: 'Jean',
      qte: 5,
      prix: '999€',
    },
    {
      id: 203,
      nom: 'Marie',
    qte: 8,
      prix: '699€',
     
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "view" | "edit" | "add"
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

//   const handleEdit = (product) => {
//     setSelectedProduct(product);
//     setModalType("edit");
//     setShowModal(true);
//   };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '100vh' }}>
        <Topbar />
        <Container fluid className="mt-4">
          <Row className="mb-4">
            <Col>
              <h4 className="mb-0">Gestion des Commandes</h4>
              <p className="text-muted mb-0">Liste complète des commandes enregistrées</p>
            </Col>
            
          </Row>

          {/* Table Produits */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                 <CommandeData 
                    commandes={products}
                    onView={handleView}     // Ajouté
                    onDelete={handleDelete} // Ajouté
                    />

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

    
        {modalType === "view" && selectedProduct && (
            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                <Modal.Title>Détails de la commande</Modal.Title>
            </Modal.Header>
        <Modal.Body>
        <div className="p-3">

            <h4 className="mb-4">{selectedProduct.nom}</h4>

            <div className="mb-3 p-2 border rounded">
            <p className="mb-1 fw-bold">Prix :</p>
            <p className="mb-0">{selectedProduct.prix}</p>
            </div>

            <div className="mb-3 p-2 border rounded">
            <p className="mb-1 fw-bold">Quantité :</p>
            <p className="mb-0">{selectedProduct.qte}</p>
            </div>

           
            <div className="mb-3 p-2 border rounded d-flex align-items-center">
            <p className="mb-0 fw-bold me-2">Statut :</p>
            <span className={`badge ${selectedProduct.is_active ? "bg-success" : "bg-secondary"}`}>
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
