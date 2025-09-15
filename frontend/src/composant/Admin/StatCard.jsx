import { Card } from "react-bootstrap";
import {
  FaUsers,
  FaUserFriends,
  FaHandshake,
  FaChartLine,
} from "react-icons/fa";
import "../../assets/css/Admin/StatsCard.css";

export default function StatsCard({ title, value, icon, color, trend = 12.5 }) {
  const getIcon = () => {
    switch (icon) {
      case "users":
        return <FaUsers size={28} />;
      case "customers":
        return <FaUserFriends size={28} />;
      case "associations":
        return <FaHandshake size={28} />;
      case "financial":
        return <FaChartLine size={28} />;
      default:
        return <FaUsers size={28} />;
    }
  };

  return (
    <Card className="stats-card border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="stats-title">{title}</div>
            <div className="stats-value">{value}</div>
          </div>
          <div className={`stats-icon stats-icon-${color}`}>{getIcon()}</div>
        </div>
      </Card.Body>
      <Card.Footer className="bg-transparent border-0 py-2">
        <div className={`stats-trend ${trend >= 0 ? "positive" : "negative"}`}>
          <span className="fw-medium">
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>{" "}
          depuis le mois dernier
        </div>
      </Card.Footer>
    </Card>
  );
}
