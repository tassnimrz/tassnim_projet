import React from "react";
import { Container, Row, Col, Navbar, Nav, Form, Button, Table, Dropdown, Card, Badge, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell, faCog, faUser, faSignOutAlt, faHome, faClipboardList, faCalendarAlt, faFolderOpen, faStethoscope, faFilePrescription, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom/client";

// Sidebar Component
const Sidebar = () => (
  <Nav className="flex-column bg-primary text-white p-3 sidebar" style={{ height: "100vh" }}>
    <Nav.Link className="text-white" onClick={() => window.location.href = "/"}>
      <FontAwesomeIcon icon={faHome} className="me-2" />Accueil
    </Nav.Link>
    <Nav.Link className="text-white" onClick={() => window.location.href = "/tableau-de-bord"}>
      <FontAwesomeIcon icon={faClipboardList} className="me-2" />Tableau de bord
    </Nav.Link>
    <Nav.Link className="text-white" onClick={() => window.location.href = "/rendez-vous"}>
      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Rendez-vous
    </Nav.Link>
  <Nav.Link className="text-white" onClick={() => window.location.href = "/dossier-medical"} >
        <FontAwesomeIcon icon={faFolderOpen} className="me-2" />Liste des Dossiers Médicaux
      </Nav.Link>
    <Nav.Link className="text-white" onClick={() => window.location.href = "/consultations"}>
      <FontAwesomeIcon icon={faStethoscope} className="me-2" />Consultations
    </Nav.Link>
    <Nav.Link className="text-white" onClick={() => window.location.href = "/prescriptions"}>
      <FontAwesomeIcon icon={faFilePrescription} className="me-2" />Prescriptions
    </Nav.Link>
  </Nav>
);

// Header Component
const Header = () => (
  <Navbar expand="lg" className="navbar-dark bg-primary px-3">
    <Navbar.Brand href="#">E-Santé 🩺🤍</Navbar.Brand>
    <Form className="d-flex ms-auto">
      <Form.Control type="search" placeholder="Rechercher..." className="me-2" size="sm" />
      <Button variant="light" size="sm"><FontAwesomeIcon icon={faSearch} /></Button>
    </Form>
    <FontAwesomeIcon icon={faBell} className="text-white mx-3 position-relative" />
    <FontAwesomeIcon icon={faCog} className="text-white mx-3" />
    <Dropdown>
      <Dropdown.Toggle variant="light" id="profileMenu">
        <FontAwesomeIcon icon={faUser} className="me-2" /> Dr. Khadija
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

// Dashboard Component
const Dashboard = () => (
  <Card className="p-3 text-center bg-light shadow-sm" style={{ backgroundColor: "#e3f2fd", borderRadius: "10px" }}>
    <Row className="align-items-center">
      <Col xs={3}>
        {/* Image rectangulaire */}
        <Image 
          src="https://plus.unsplash.com/premium_photo-1664475543697-229156438e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRvY3RvcmJsZXV8ZW58MHx8MHx8fDA%3D" 
          fluid 
          style={{ 
            width: "100%", 
            height: "auto", 
            borderRadius: "8px", 
            objectFit: "cover" 
          }} 
        />
      </Col>
      <Col>
        <h4 className="text-primary fw-bold">Bonjour, Dr. Khadija</h4>
        <p className="text-muted">Votre emploi du temps aujourd'hui.</p>
      </Col>
    </Row>
    <div className="d-flex gap-3 justify-content-center mt-3">
      <Button variant="info" className="text-white fw-bold">📅 9 Rendez-vous</Button>
      <Button variant="warning" className="text-white fw-bold">🔬 3 Chirurgies</Button>
    </div>
  </Card>
);

// Appointments Table Component
const AppointmentsTable = () => (
  <Table striped bordered hover className="bg-white text-dark mt-3">
    <thead className="bg-primary text-white">
      <tr>
        <th>#</th>
        <th>Nom du patient</th>
        <th>Âge</th>
        <th>Médecin</th>
        <th>Département</th>
        <th>Date</th>
        <th>Heure</th>
        <th>Maladie</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>001</td>
        <td>Ahmed</td>
        <td>65</td>
        <td>Dr. Firas</td>
        <td>Chirurgie</td>
        <td>05/23/2024</td>
        <td>9:30 AM</td>
        <td>Diabète</td>
        <td>
          <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
          <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
        </td>
      </tr>
    </tbody>
  </Table>
);

// Main Dashboard Component
const PatientDashboard = () => (
  <Container fluid>
    <Row>
      <Col md={2} className="d-none d-md-block">
        <Sidebar />
      </Col>
      <Col md={10} className="p-4">
        <Dashboard />
        <h5 className="text-primary mt-3">Rendez-vous</h5>
        <AppointmentsTable />
      </Col>
    </Row>
  </Container>
);

// App Component
const App = () => (
  <div>
    <Header />
    <PatientDashboard />
  </div>
);

// Mounting the App Component
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
