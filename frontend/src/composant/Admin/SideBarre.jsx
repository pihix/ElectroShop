<<<<<<< HEAD
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
=======
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaHome,
  FaUserFriends,
  FaHandshake,
  FaHeartbeat,
  FaCog,
  FaBoxOpen,
} from "react-icons/fa";
import "../../assets/css/Admin/Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar bg-light border-end vh-100 sticky-top">
      <div className="sidebar-header">
        <h5 className="mb-0">Eshop App</h5>
      </div>

      <Nav className="flex-column sidebar-nav">
        {/* Tableau de bord */}
        <LinkContainer exact to="/dashbord">
          <Nav.Link className="sidebar-link">
            <FaHome className="me-3" /> Tableau de bord
          </Nav.Link>
        </LinkContainer>

        <div className="sidebar-section">Gestion des données</div>

        <LinkContainer to="/clients">
          <Nav.Link className="sidebar-link">
            <FaUserFriends className="me-3" /> Clients
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/categories">
          <Nav.Link className="sidebar-link">
            <FaHandshake className="me-3" /> Catégories
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/produits">
          <Nav.Link className="sidebar-link">
            <FaBoxOpen className="me-3" /> Produits
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/list_commandes">
<<<<<<< HEAD
          <Nav.Link>
            <FaHeartbeat /> Commandes
          </Nav.Link>
        </LinkContainer>

        <div className="section-title">Paramètres</div>
        
        <LinkContainer to="/settings">
          <Nav.Link>
            <FaCog /> Configuration
=======
          <Nav.Link className="sidebar-link">
            <FaHeartbeat className="me-3" /> Commandes
          </Nav.Link>
        </LinkContainer>

        <div className="sidebar-section">Paramètres</div>

        <LinkContainer to="/settings">
          <Nav.Link className="sidebar-link">
            <FaCog className="me-3" /> Configuration
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
          </Nav.Link>
        </LinkContainer>
      </Nav>
    </div>
  );
}
