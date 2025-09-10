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
                <i className="fas fa-plus me-2"></i>Ajouter un produit
              </Button>
            </Col>
          </Row>

          {/* TABLE PRODUITS */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm produits-table-card">
                <Card.Body className="p-0">
                  <ProductData products={products} onView={handleView} onEdit={handleEdit} onDelete={handleDelete}/>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

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
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Annuler</Button>
              <Button variant="primary" onClick={handleSave}>{modalType === "edit" ? "Modifier" : "Enregistrer"}</Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
}
