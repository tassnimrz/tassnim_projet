import React, { useState, useEffect } from "react";
import { Container, Row, Col, Navbar, Nav, Form, Button, Table, Dropdown, Card, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faBell, faCog, faUser, faSignOutAlt, faHome, faCalendarAlt, faFolderOpen, faFilePrescription, faHeartbeat, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom/client";
import axios from "axios";

// Sidebar Component
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar bg-primary text-white p-3 ${collapsed ? 'collapsed' : ''}`} style={{ height: "100vh", width: collapsed ? "60px" : "200px", transition: "0.3s" }}>
      <Button variant="light" size="sm" className="mb-3" onClick={() => setCollapsed(!collapsed)}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Nav className="flex-column">
        <Nav.Link className="text-white" onClick={() => window.location.href = "/Acceuill"}>
          <FontAwesomeIcon icon={faHome} className="me-2" /> {collapsed ? "" : "Accueil"}
        </Nav.Link>
        <Nav.Link className="text-white" onClick={() => window.location.href = "/rendez-vous"}>
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> {collapsed ? "" : "Créer un Rendez-vous"}
        </Nav.Link>
        <Nav.Link className="text-white" onClick={() => window.location.href = "/dossier-medical/{id}"}>
          <FontAwesomeIcon icon={faFolderOpen} className="me-2" /> {collapsed ? "" : "Mon Dossier Médical"}
        </Nav.Link>
        <Nav.Link className="text-white" onClick={(ordonnanceId) => window.location.href = `/ordonnances/${ordonnanceId}`}>
          <FontAwesomeIcon icon={faFilePrescription} className="me-2" /> {collapsed ? "" : "Mon Ordonnance"}
        </Nav.Link>
        <Nav.Link className="text-white" onClick={() => window.location.href = "/suivi-sante"}>
          <FontAwesomeIcon icon={faHeartbeat} className="me-2" /> {collapsed ? "" : "Suivi Santé"}
        </Nav.Link>
        <Nav.Link className="text-white" onClick={() => window.location.href = "/paiement-assurance"}>
          <FontAwesomeIcon icon={faCreditCard} className="me-2" /> {collapsed ? "" : "Paiement & Assurances"}
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

// Patient Dashboard Component
const PatientDashboard = () => (
  <Card className="p-4 text-center shadow-lg border-0 rounded" style={{ background: "linear-gradient(to left, #6a11cb, #2575fc)", color: "white" }}>
    <Row className="align-items-center justify-content-center">
      <Col xs={4} className="d-flex justify-content-center">
        <div style={{ fontSize: "4rem" }}>🩺</div> {/* Emoji */}
      </Col>
      <Col xs={8} className="text-start">
        <h3 className="fw-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Bienvenue, Cher Patient</h3>
        <p style={{ fontSize: "1.1rem", fontFamily: "'Roboto', sans-serif" }}>
          Accédez à vos informations et suivez vos rendez-vous, ordonnances et dossiers médicaux avec facilité.
        </p>
      </Col>
    </Row>
  </Card>
);

// Appointments Table Component
const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/patients")
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
      });
  }, []);

  return (
    <Card className="mt-4 shadow-sm border-0 rounded" style={{ backgroundColor: "#f8f9fa" }}>
      <Card.Body>
        <h5 className="text-primary mb-3">Mes Rendez-vous</h5>
        <Table responsive striped bordered hover className="table-hover text-dark">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Nom du Médecin</th>
              <th>Spécialité</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <tr key={appointment.id}>
                  <td>{index + 1}</td>
                  <td>{appointment.nom_medecin}</td>
                  <td>{appointment.specialite}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.heure}</td>
                  <td>
                    <Badge bg={appointment.statut === "Confirmé" ? "success" : appointment.statut === "En attente" ? "warning" : "danger"}>
                      {appointment.statut}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Aucun rendez-vous disponible</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

// Main Patient Component
const PatientAccount = () => (
  <Container fluid>
    <Row>
      <Col md={2} className="d-none d-md-block p-0">
        <Sidebar />
      </Col>
      <Col md={10} className="p-4">
        <PatientDashboard />
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

// Mounting the App Component
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
