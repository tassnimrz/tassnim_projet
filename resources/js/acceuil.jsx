import React, { useState } from "react";
import { Container, Row, Col, Navbar, Nav, Form, Button, Card, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faBell, faCog, faUser, faHome, faCalendarAlt, faFolderOpen, faFilePrescription, faHeartbeat, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";  // Importer Link de react-router-dom

// Sidebar Component
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar bg-primary text-white p-3 ${collapsed ? 'collapsed' : ''}`} style={{ height: "100vh", width: collapsed ? "60px" : "200px", transition: "0.3s" }}>
      <Button variant="light" size="sm" className="mb-3" onClick={() => setCollapsed(!collapsed)}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Nav className="flex-column">
        <Nav.Link className="text-white">
          <Link to="/" className="text-white">
            <FontAwesomeIcon icon={faHome} className="me-2" /> {collapsed ? "" : "Accueil"}
          </Link>
        </Nav.Link>
        <Nav.Link className="text-white">
          <Link to="/mes-rendez-vous" className="text-white">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> {collapsed ? "" : "Mes Rendez-vous"}
          </Link>
        </Nav.Link>
        <Nav.Link className="text-white">
          <Link to="/mon-dossier-medical" className="text-white">
            <FontAwesomeIcon icon={faFolderOpen} className="me-2" /> {collapsed ? "" : "Mon Dossier Médical"}
          </Link>
        </Nav.Link>
        <Nav.Link className="text-white">
          <Link to="/mes-ordonnances" className="text-white">
            <FontAwesomeIcon icon={faFilePrescription} className="me-2" /> {collapsed ? "" : "Mes Ordonnances"}
          </Link>
        </Nav.Link>
        <Nav.Link className="text-white">
          <Link to="/suivi-sante" className="text-white">
            <FontAwesomeIcon icon={faHeartbeat} className="me-2" /> {collapsed ? "" : "Suivi Santé"}
          </Link>
        </Nav.Link>
        <Nav.Link className="text-white">
          <Link to="/paiement-assurance" className="text-white">
            <FontAwesomeIcon icon={faCreditCard} className="me-2" /> {collapsed ? "" : "Paiement & Assurances"}
          </Link>
        </Nav.Link>
      </Nav>
    </div>
  );
};

// Header Component
const Header = () => (
  <Navbar expand="lg" className="navbar-dark bg-primary px-3 shadow">
    <Navbar.Brand href="#">E-Santé 🏥</Navbar.Brand>
    <Form className="d-flex ms-auto">
      <Form.Control type="search" placeholder="Rechercher..." className="me-2" size="sm" />
      <Button variant="light" size="sm"><FontAwesomeIcon icon={faSearch} /></Button>
    </Form>
    <FontAwesomeIcon icon={faBell} className="text-white mx-3 position-relative" />
    <FontAwesomeIcon icon={faCog} className="text-white mx-3" />
    <Dropdown>
      <Dropdown.Toggle variant="light" id="profileMenu">
        <FontAwesomeIcon icon={faUser} className="me-2" /> Mon Compte
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Item href="#">👤 Profil</Dropdown.Item>
        <Dropdown.Item href="#">⚙️ Paramètres</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#" className="text-danger">🚪 Déconnexion</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </Navbar>
);

// Main Patient Component
const PatientAccount = () => (
  <Container fluid>
    <Row>
      <Col md={2} className="d-none d-md-block p-0">
        <Sidebar />
      </Col>
      <Col md={10} className="p-4">
        <PatientDashboard />
        <h5 className="text-primary mt-3">Mes Rendez-vous</h5>
        <AppointmentsTable />
      </Col>
    </Row>
  </Container>
);

// App Component
const App = () => (
  <div>
    <Header />
    <PatientAccount />
  </div>
);

export default App;
