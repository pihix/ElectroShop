<<<<<<< HEAD
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
=======
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
import Sidebar from './SideBarre';
import Topbar from './TopBarre';
import StatsCard from './StatCard';
import '../../assets/css/Admin/TableauBord.css';

<<<<<<< HEAD
export default function TableauBord() {
  const stats = [
    { title: 'Clients', value: '28', icon: 'customers', color: 'success' },
    { title: 'Commandes', value: '24', icon: 'financial', color: 'info' },
    { title: 'Produits', value: '86', icon: 'products', color: 'warning' }
=======
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
        const clientsRes = await axios.get(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const produitsRes = await axios.get(`${API_BASE}/products?page=1&limit=1000`);
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
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
  ];

  return (
    <div className="d-flex">
      <Sidebar />
<<<<<<< HEAD
      <div className="flex-grow-1 overflow-auto dashboard-main">
        <Topbar />
        <Container fluid className="mt-4">
          
          {/* Header */}
          <Row className="g-4 mb-4">
            <Col>
              <h3 className="dashboard-title">Tableau de Bord</h3>
              <p className="text-muted dashboard-subtitle">
                Aperçu des activités et statistiques
              </p>
            </Col>
          </Row>

          {/* Stats Cards */}
          <Row className="g-4 mb-4">
            {stats.map((stat, index) => (
              <Col key={index} xl={3} lg={6} md={6}>
                <StatsCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                />
              </Col>
            ))}
          </Row>

          <Row className="g-4">
            {/* Graph */}
            <Col xl={8}>
              <Card className="border-0 shadow-sm dashboard-card">
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Activité Récente</h5>
                  <Badge bg="primary" pill>Mensuel</Badge>
                </Card.Header>
                <Card.Body>
                  <div className="p-4 text-center">
                    <p className="text-muted">Graphique d'activité</p>
                    <div className="graph-placeholder">
=======
      <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '100vh' }}>
        <Topbar />
        <Container fluid className="mt-4 tableau-bord">
          <Row className="g-4 mb-4 fade-in">
            <Col>
              <h4 className="dashboard-title">📊 Tableau de Bord</h4>
              <p className="text-muted subtitle">Aperçu des activités et statistiques</p>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            {stats.loading ? (
              <Col className="text-center">
                <Spinner animation="border" variant="primary" />
              </Col>
            ) : (
              statCards.map((stat, index) => (
                <Col key={index} xl={3} lg={6} md={6} className="fade-in">
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
              <Card className="border-0 shadow-sm card-hover">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0 section-title">📈 Activité Récente</h5>
                </Card.Header>
                <Card.Body>
                  <div className="chart-placeholder">
                    <p className="text-muted">Graphique d'activité</p>
                    <div className="graph-area">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                      Espace réservé pour les graphiques ou données statistiques
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

<<<<<<< HEAD
            {/* Recent Orders */}
            <Col xl={4}>
              <Card className="border-0 shadow-sm dashboard-card">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Les Récentes Commandes</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-group list-group-flush recent-orders">
                    {[1, 2, 3, 4, 5].map(item => (
                      <li key={item} className="list-group-item border-0 px-0 py-3 order-item">
                        <div className="d-flex align-items-center">
                          <div className="order-avatar bg-light rounded-circle p-3 me-3">
                            <span className="text-primary fw-bold">CD202</span>
                          </div>
                          <div>
                            <div className="fw-semibold">Jocelyn Carlos</div>
=======
            <Col xl={4}>
              <Card className="border-0 shadow-sm card-hover">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0 section-title">🛒 Récentes Commandes</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-group list-group-flush">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <li key={item} className="list-group-item border-0 px-0 order-item">
                        <div className="d-flex align-items-center">
                          <div className="order-badge">
                            <div className="order-code">CD202{item}</div>
                          </div>
                          <div>
                            <div className="fw-medium">Client {item}</div>
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
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
