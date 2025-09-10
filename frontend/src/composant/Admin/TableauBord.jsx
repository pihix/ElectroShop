import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Sidebar from './SideBarre';
import Topbar from './TopBarre';
import StatsCard from './StatCard';
import '../../assets/css/Admin/TableauBord.css';

export default function TableauBord() {
  const stats = [
    { title: 'Clients', value: '28', icon: 'customers', color: 'success' },
    { title: 'Commandes', value: '24', icon: 'financial', color: 'info' },
    { title: 'Produits', value: '86', icon: 'products', color: 'warning' }
  ];

  return (
    <div className="d-flex">
      <Sidebar />
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
                      Espace réservé pour les graphiques ou données statistiques
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

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
