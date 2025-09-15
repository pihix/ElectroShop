import { Container, Form, Nav, Navbar, Image, Dropdown } from 'react-bootstrap';
import { FaBell, FaSearch, FaUserCircle, FaCog, FaUser } from 'react-icons/fa';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import '../../assets/css/Admin/Topbar.css';

export default function Topbar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm topbar">
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand href="#" className="brand-text">
          <span className="fw-bold">ElectroShop</span>
        </Navbar.Brand>

        {/* Toggle Mobile */}
        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          {/* Search Bar */}
          <Form className="d-flex ms-auto me-3 my-2 my-lg-0 topbar-search">
            <div className="input-group search-group">
              <Form.Control
                type="search"
                placeholder="Rechercher..."
                className="border-0 shadow-none"
              />
              <button className="btn search-btn" type="submit">
                <FaSearch />
              </button>
            </div>
          </Form>

          {/* Right Menu */}
          <Nav className="ms-auto align-items-center">
            {/* Notifications */}
            <Nav.Link className="position-relative notification-icon">
              <FaBell size={20} />
              <span className="badge-notif">3</span>
            </Nav.Link>

            {/* User Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-user"
                className="d-flex align-items-center user-dropdown"
              >
                <Image
                  src="https://ui-avatars.com/api/?name=Admin&background=3498db&color=fff"
                  roundedCircle
                  width={38}
                  height={38}
                  className="me-2 user-avatar"
                />

                {username ? (
                  <span className="username">
                    <FaUser className="me-1" /> {username}
                  </span>
                ) : (
                  <Link to="/auth/admin" className="username">
                    <FaUser className="me-1" /> Administrateur
                  </Link>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm user-menu">
                <Dropdown.Item href="#">
                  <FaUserCircle className="me-2" /> Mon profil
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">
                  <FaCog className="me-2" /> Paramètres
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">Déconnexion</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
