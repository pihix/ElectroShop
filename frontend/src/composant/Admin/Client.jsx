import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Sidebar from "./SideBarre";
import Topbar from "./TopBarre";
import CustomerData from "./CustomerData";
import { getAllUsers } from "../../api/ListeUser";
import "../../assets/css/Admin/Clients.css";

export default function Clients() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const users = await getAllUsers();
        setCustomers(users.filter((u) => u.role === "user")); // uniquement les clients
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="clients-page">
      <Sidebar />
      <div className="clients-content">
        <Topbar />
        <Container fluid>
          {/* Header */}
          <div className="clients-header">
            <div>
              <h4>Gestion des Clients</h4>
              <p>Liste complète des clients enregistrés</p>
            </div>
            <Button className="btn-add">
              <i className="fas fa-plus me-2"></i>Ajouter un client
            </Button>
          </div>

          {/* Filtres */}
          <Card className="clients-card mb-4">
            <Card.Body>
              <Row className="filters">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rechercher un client</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nom, email, téléphone..."
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Statut</Form.Label>
                    <Form.Select>
                      <option>Tous</option>
                      <option>Actif</option>
                      <option>Inactif</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button className="btn-search w-100">
                    <i className="fas fa-search me-2"></i>Rechercher
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tableau clients */}
          <Card className="clients-card">
            <Card.Body className="p-0">
              {loading ? (
                <div className="loading">Chargement...</div>
              ) : (
                <CustomerData customers={customers} />
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}
