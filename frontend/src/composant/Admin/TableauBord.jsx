import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from './SideBarre';
import Topbar from './TopBarre';
import StatsCard from './StatCard';

const API_BASE = "http://localhost:8000";
const TOKEN = localStorage.getItem("token");

export default function TableauBord() {
  const [stats, setStats] = useState({
    clients: 0,
    commandes: 0,
    produits: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 🔹 Récupération des clients
        const clientsRes = await axios.get(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });

        // 🔹 Récupération des produits
        const produitsRes = await axios.get(`${API_BASE}/products?page=1&limit=1000`);

        // 🔹 Récupération des commandes
        const commandesRes = await axios.get(`${API_BASE}/orders`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });

        setStats({
          clients: clientsRes.data.data?.length || 0,
          commandes: commandesRes.data.data?.length || 0,
          produits: produitsRes.data.data?.length || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Clients', value: stats.clients, icon: 'customers', color: 'success' },
    { title: 'Commandes', value: stats.commandes, icon: 'financial', color: 'info' },
    { title: 'Produits', value: stats.produits, icon: 'products', color: 'warning' },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '100vh' }}>
        <Topbar />
        <Container fluid className="mt-4">
          <Row className="g-4 mb-4">
            <Col>
              <h4 className="mb-0">Tableau de Bord</h4>
              <p className="text-muted mb-0">Aperçu des activités et statistiques</p>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            {stats.loading ? (
              <Col className="text-center">
                <Spinner animation="border" variant="primary" />
              </Col>
            ) : (
              statCards.map((stat, index) => (
                <Col key={index} xl={3} lg={6} md={6}>
                  <StatsCard
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                  />
                </Col>
              ))
            )}
          </Row>

          <Row className="g-4">
            <Col xl={8}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Activité Récente</h5>
                </Card.Header>
                <Card.Body>
                  <div className="p-4 text-center">
                    <p className="text-muted">Graphique d'activité</p>
                    <div className="bg-light rounded p-5">
                      Espace réservé pour les graphiques ou données statistiques
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Les Récentes Commandes</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-group list-group-flush">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <li key={item} className="list-group-item border-0 px-0">
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle p-2 me-3">
                            <div className="text-primary fw-bold">CD202{item}</div>
                          </div>
                          <div>
                            <div className="fw-medium">Client {item}</div>
                            <div className="small text-muted">Commandé le 15/08/2025</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
