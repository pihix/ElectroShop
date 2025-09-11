import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Sidebar from './SideBarre';
import Topbar from './TopBarre';
import CustomerData from './CustomerData';
import { getAllUsers } from '../../api/ListeUser';

export default function Clients() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const users = await getAllUsers();
        setCustomers(users.filter(u => u.role === "user")); // uniquement les clients
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '100vh' }}>
        <Topbar />
        <Container fluid className="mt-4">
          <Row className="mb-4">
            <Col>
              <h4 className="mb-0">Gestion des Clients</h4>
              <p className="text-muted mb-0">Liste complète des clients enregistrés</p>
            </Col>
            <Col className="text-end">
              <Button variant="primary">
                <i className="fas fa-plus me-2"></i>Ajouter un client
              </Button>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <Row>
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
                      <Button variant="primary" className="w-100">
                        <i className="fas fa-search me-2"></i>Rechercher
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  {loading ? (
                    <div className="text-center p-4">Chargement...</div>
                  ) : (
                    <CustomerData customers={customers} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
