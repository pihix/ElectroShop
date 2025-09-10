import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { 
  FaHome, FaUserFriends, FaHandshake, 
  FaHeartbeat, FaCog, FaStore
} from 'react-icons/fa';
import "../../assets/css/Admin/Sidebar.css";


export default function Sidebar() {
  return (
    <div className="sidebar">
      {/* Header */}
      {/* <div className="sidebar-header">
        Eshop App
      </div> */}

      <div className="logo">
        <FaStore className="icon" />
        <a href="/" className="topbar-brand">ElectroShop</a>
      </div>
    
      {/* Navigation */}
      <Nav className="flex-column sidebar-nav">
        
        <LinkContainer exact to="/dashbord">
          <Nav.Link> 
            <FaHome /> Tableau de bord
          </Nav.Link>
        </LinkContainer>

        <div className="section-title">Gestion des données</div>
        
        <LinkContainer to="/clients">
          <Nav.Link>
            <FaUserFriends /> Clients
          </Nav.Link>
        </LinkContainer>
        
        <LinkContainer to="/produits">
          <Nav.Link>
            <FaHandshake /> Produits
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/list_commandes">
          <Nav.Link>
            <FaHeartbeat /> Commandes
          </Nav.Link>
        </LinkContainer>

        <div className="section-title">Paramètres</div>
        
        <LinkContainer to="/settings">
          <Nav.Link>
            <FaCog /> Configuration
          </Nav.Link>
        </LinkContainer>
      </Nav>
    </div>
  );
}
