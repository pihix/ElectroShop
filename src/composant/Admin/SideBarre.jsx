import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { 
  FaHome, FaUsers, FaUserFriends, FaHandshake, 
  FaHeartbeat, FaChartLine, FaIdCard, FaGraduationCap, FaCog 
} from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="bg-light border-end vh-100 sticky-top" style={{width: '250px'}}>
      <div className="p-3 border-bottom bg-primary text-white">
        <h5 className="mb-0">Eshop App</h5>
      </div>
      <Nav className="flex-column p-3">
        <LinkContainer exact to="/dashbord">
          <Nav.Link className="d-flex align-items-center py-3">
            <FaHome className="me-3" /> Tableau de bord
          </Nav.Link>
        </LinkContainer>
        
        <div className="small text-muted text-uppercase mt-3 mb-2 px-3">Gestion des données</div>
        
        
        <LinkContainer to="/clients">
          <Nav.Link className="d-flex align-items-center py-2">
            <FaUserFriends className="me-3" /> Clients
          </Nav.Link>
        </LinkContainer>
        
        <LinkContainer to="/produits">
          <Nav.Link className="d-flex align-items-center py-2">
            <FaHandshake className="me-3" /> Produits
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/list_commandes">
          <Nav.Link className="d-flex align-items-center py-2">
            <FaHeartbeat className="me-3" /> Commandes
          </Nav.Link>
        </LinkContainer>
        
        <div className="small text-muted text-uppercase mt-4 mb-2 px-3">Paramètres</div>
        
        <LinkContainer to="/settings">
          <Nav.Link className="d-flex align-items-center py-2">
            <FaCog className="me-3" /> Configuration
          </Nav.Link>
        </LinkContainer>
      </Nav>
    </div>
  );
}