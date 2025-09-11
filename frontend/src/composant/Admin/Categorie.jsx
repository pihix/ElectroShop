import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import Sidebar from "./SideBarre";
import Topbar from "./TopBarre";
import CategorieData from "./CategorieData";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../api/CategorieService";

export default function Categorie() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "view" | "edit" | "add"
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Erreur récupération catégories:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedCategory(null);
  };

  const handleAdd = () => {
    setSelectedCategory({ name: "", description: "" });
    setModalType("add");
    setShowModal(true);
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setModalType("view");
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalType("edit");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error("Erreur suppression catégorie:", err);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (modalType === "add") {
        await createCategory(selectedCategory);
      } else if (modalType === "edit") {
        await updateCategory(selectedCategory.id, selectedCategory);
      }
      fetchCategories();
      handleClose();
    } catch (err) {
      console.error("Erreur création/modification catégorie:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCategory({ ...selectedCategory, [name]: value });
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: "100vh" }}>
        <Topbar />
        <Container fluid className="mt-4">
          <Row className="mb-4">
            <Col>
              <h4 className="mb-0">Gestion des Catégories</h4>
              <p className="text-muted mb-0">Liste complète des catégories</p>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleAdd}>
                Ajouter une catégorie
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  <CategorieData
                    categories={categories}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {(modalType === "add" || modalType === "edit") && selectedCategory && (
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {modalType === "add" ? "Ajouter une catégorie" : "Modifier la catégorie"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={selectedCategory.name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={selectedCategory.description}
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
                {modalType === "add" ? "Créer" : "Enregistrer"}
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {modalType === "view" && selectedCategory && (
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Détails de la catégorie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><b>Nom :</b> {selectedCategory.name}</p>
              {/* <p><b>Description :</b> {selectedCategory.description}</p> */}
            </Modal.Body>
          </Modal>
        )}
      </div>
    </div>
  );
}
