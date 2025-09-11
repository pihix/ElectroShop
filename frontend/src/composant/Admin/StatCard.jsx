import { Card } from 'react-bootstrap';
import { FaUsers, FaUserFriends, FaHandshake, FaChartLine } from 'react-icons/fa';

export default function StatsCard({ title, value, icon, color }) {
  const getIcon = () => {
    switch(icon) {
      case 'users': return <FaUsers size={24} />;
      case 'customers': return <FaUserFriends size={24} />;
      case 'associations': return <FaHandshake size={24} />;
      case 'financial': return <FaChartLine size={24} />;
      default: return <FaUsers size={24} />;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted text-uppercase small">{title}</div>
            <div className="h3 mt-2 mb-0 fw-bold">{value}</div>
          </div>
          <div 
            className={`p-3 rounded-circle bg-${color}-light`}
            style={{ backgroundColor: `var(--bs-${color}-bg-subtle)` }}
          >
            {getIcon()}
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="bg-transparent border-0 py-2">
        <div className="small text-success">
          <span className="fw-medium">↑ 12.5%</span> depuis le mois dernier
        </div>
      </Card.Footer>
    </Card>
  );
}