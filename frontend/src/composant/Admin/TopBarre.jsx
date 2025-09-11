import { Container, Form, Nav, Navbar, Image, Dropdown } from 'react-bootstrap';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';
import { FaCog } from 'react-icons/fa';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {FaUser} from "react-icons/fa";



export default function Topbar() {

    const [username, setUsername] = useState("");

    useEffect(() => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }, []);
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#">
          <div className="d-none d-md-block">
            <span className="fw-bold text-primary">ElectroShop</span> 
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        
        <Navbar.Collapse id="navbarScroll">
          <Form className="d-flex ms-auto me-3 my-2 my-lg-0" style={{ maxWidth: '400px' }}>
            <div className="input-group">
              <Form.Control
                type="search"
                placeholder="Rechercher..."
                className="border-end-0"
              />
              <button className="btn btn-outline-secondary border-start-0" type="submit">
                <FaSearch />
              </button>
            </div>
          </Form>
          
          <Nav className="ms-auto">
            <Nav.Link className="position-relative">
              <FaBell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Nav.Link>
            
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center">
                <Image 
                  src="https://ui-avatars.com/api/?name=Admin&background=3498db&color=fff" 
                  roundedCircle 
                  width={36}
                  height={36}
                  className="me-2"
                />

                {username ? (
            <span>
              <FaUser /> <span>{username}</span>
            </span>
          ) : (
            <Link to="/auth/admin" className="action">
              <FaUser /> <span>Administrateur</span>
            </Link>
          )}



               
              </Dropdown.Toggle>
              
              <Dropdown.Menu className="shadow-sm">
                <Dropdown.Item href="#">
                  <FaUserCircle className="me-2" /> Mon profil
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">
                  <FaCog className="me-2" /> Paramètres
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">
                  Déconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}