import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import Sidebar from './SideBarre';
import Topbar from './TopBarre';
import ProductData from './ProductData';


export default function Produits() {
  const [products, setProducts] = useState([
    {
      id: 1,
      nom: 'Iphone 11',
      prix: '799€',
      qte: 10,
      categorie: 'Smartphones',
      is_active: true,
      marque: 'Apple',
      description: 'Un smartphone performant avec double caméra.',
      images: []
    },
    {
      id: 2,
      nom: 'Samsung Galaxy S21',
      prix: '999€',
      qte: 5,
      categorie: 'Smartphones',
      is_active: true,
      marque: 'Samsung',
      description: 'Dernière génération avec écran AMOLED.',
      images: []
    },
    {
      id: 3,
      nom: 'Google Pixel 5',
      prix: '699€',
      qte: 8,
      categorie: 'Smartphones',
      is_active: true,
      marque: 'Google',
      description: 'Un smartphone optimisé pour Android pur.',
      images: []
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "view" | "edit" | "add"
  const [selectedProduct, setSelectedProduct] = useState(null);

  const emptyProduct = {
    nom: '',
    prix: '',
    qte: '',
    categorie: '',
    is_active: true,
    marque: '',
    description: '',
    images: []
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

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (modalType === "edit") {
      setProducts(products.map(p => (p.id === selectedProduct.id ? selectedProduct : p)));
    } else if (modalType === "add") {
      const id = products.length + 1;
      setProducts([...products, { id, ...selectedProduct }]);
    }
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setSelectedProduct({ ...selectedProduct, [name]: checked });
    } else if (type === 'file') {
      setSelectedProduct({ ...selectedProduct, images: Array.from(files) });
    } else {
      setSelectedProduct({ ...selectedProduct, [name]: value });
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
              <h4 className="mb-0">Gestion des Produits</h4>
              <p className="text-muted mb-0">Liste complète des produits enregistrés</p>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleAdd}>
                <i className="fas fa-plus me-2"></i>Ajouter un produit
              </Button>
            </Col>
          </Row>

          {/* Table Produits */}
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

        {/* MODALS */}
        {/* {modalType === "view" && selectedProduct && (
          <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Détails du produit</Modal.Title>
            </Modal.Header>
            <Modal.Body className='detailProduit'>
              <h5>{selectedProduct.nom}</h5>
              <p><b>Prix :</b> {selectedProduct.prix}</p><br/>
              <p><b>Quantité :</b> {selectedProduct.qte}</p><br/>
              <p><b>Catégorie :</b> {selectedProduct.categorie}</p><br/>
              <p><b>Marque :</b> {selectedProduct.marque}</p>
              <p><b>Description :</b> {selectedProduct.description}</p>
              <p><b>Statut :</b> {selectedProduct.is_active ? "Actif" : "Inactif"}</p>
            </Modal.Body>
          </Modal>
        )} */}


        {modalType === "view" && selectedProduct && (
  <Modal show={showModal} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Détails du produit</Modal.Title>
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

        <div className="mb-3 p-2 border rounded">
          <p className="mb-1 fw-bold">Catégorie :</p>
          <p className="mb-0">{selectedProduct.categorie}</p>
        </div>

        <div className="mb-3 p-2 border rounded">
          <p className="mb-1 fw-bold">Marque :</p>
          <p className="mb-0">{selectedProduct.marque}</p>
        </div>

        <div className="mb-3 p-2 border rounded">
          <p className="mb-1 fw-bold">Description :</p>
          <p className="mb-0">{selectedProduct.description}</p>
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



        {(modalType === "add" || modalType === "edit") && selectedProduct && (
          <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                {modalType === "edit" ? "Modifier le produit" : "Ajouter un produit"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom du produit</Form.Label>
                      <Form.Control
                        type="text"
                        name="nom"
                        value={selectedProduct.nom}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prix</Form.Label>
                      <Form.Control
                        type="text"
                        name="prix"
                        value={selectedProduct.prix}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantité</Form.Label>
                      <Form.Control
                        type="number"
                        name="qte"
                        value={selectedProduct.qte}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Catégorie</Form.Label>
                      <Form.Control
                        type="text"
                        name="categorie"
                        value={selectedProduct.categorie}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Marque</Form.Label>
                      <Form.Control
                        type="text"
                        name="marque"
                        value={selectedProduct.marque}
                        onChange={handleChange}
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
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Images</Form.Label>
                  <Form.Control
                    type="file"
                    name="images"
                    multiple
                    onChange={handleChange}
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
