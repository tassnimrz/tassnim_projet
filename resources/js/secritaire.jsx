import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Container, Row, Col, Navbar, Nav, Form, Button, Dropdown, Toast } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell, faCog, faUser, faHome, faClipboardList, faCalendarAlt, faFolderOpen, faStethoscope, faFilePrescription } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"; // Inclure les styles ici

// Import pour les graphiques
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Sidebar
const Sidebar = () => {
  return (
    <Nav className="flex-column sidebar shadow-sm p-3">
      <Nav.Link className="nav-item" onClick={() => window.location.href = "/"} >
        <FontAwesomeIcon icon={faHome} className="me-2" />Accueil
      </Nav.Link>
      <Nav.Link className="nav-item" onClick={() => window.location.href = "/tableau-de-bord"} >
        <FontAwesomeIcon icon={faClipboardList} className="me-2" />Tableau de bord
      </Nav.Link>
      <Nav.Link className="nav-item" onClick={() => window.location.href = "/rendez-vous"} >
        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Rendez-vous
      </Nav.Link>
      <Nav.Link className="nav-item" onClick={() => window.location.href = "/fiche-patient"} >
        <FontAwesomeIcon icon={faFolderOpen} className="me-2" />Liste des Fiches Patients
      </Nav.Link>
      <Nav.Link className="nav-item" onClick={() => window.location.href = "/fiche-patient/create"} >
        <FontAwesomeIcon icon={faFolderOpen} className="me-2" />Créer une Fiche Patient
      </Nav.Link>
      <Nav.Link className="nav-item" onClick={() => window.location.href = "/dossier-medical"} >
        <FontAwesomeIcon icon={faFolderOpen} className="me-2" />Liste des Dossiers Médicaux
      </Nav.Link>
      <Nav.Link className="nav-item" onClick={() => window.location.href = "/consultations"} >
        <FontAwesomeIcon icon={faStethoscope} className="me-2" />Consultations
      </Nav.Link>
      <Nav.Link className="nav-item" onClick={() => window.location.href = "/prescriptions"} >
        <FontAwesomeIcon icon={faFilePrescription} className="me-2" />Prescriptions
      </Nav.Link>
    </Nav>
  );
};

// Header
const Header = () => (
  <Navbar expand="lg" className="navbar-custom">
    <Navbar.Brand href="#" className="fs-4 text-light">E-Santé 🩺🤍</Navbar.Brand>
    <Form className="search-bar">
      <Form.Control type="search" placeholder="Rechercher..." />
      <Button variant="light">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </Form>
    <div className="header-icons">
      <FontAwesomeIcon icon={faBell} className="icon" />
      <FontAwesomeIcon icon={faCog} className="icon" />
      <Dropdown>
        <Dropdown.Toggle variant="light">
          <FontAwesomeIcon icon={faUser} className="me-2" /> Secrétaire
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Item href="#">👤 Profil</Dropdown.Item>
          <Dropdown.Item href="#">⚙️ Paramètres</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#" className="text-danger">🚪 Déconnexion</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </Navbar>
);

// Graphique d'activité
const DashboardGraph = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Rendez-vous',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
};

// Calendrier des rendez-vous
const Calendar = () => (
  <FullCalendar
    plugins={[dayGridPlugin]}
    initialView="dayGridMonth"
    events={[
      { title: 'Rendez-vous avec Mr. X', date: '2025-03-05' },
      { title: 'Consultation Mme. Y', date: '2025-03-07' },
    ]}
  />
);

// Notifications et rappels
const Notifications = () => (
  <div className="notifications">
    <h6>Rappels</h6>
    <ul>
      <li>Rendez-vous avec le Dr. X à 14h00</li>
      <li>Confirmer le rendez-vous de Mme. Y</li>
      <li>Envoyer les prescriptions du jour</li>
    </ul>
  </div>
);

// Dashboard Secrétaire
const SecretaireDashboard = () => {
  const [userName, setUserName] = useState("Sarra");
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    // Fermer le Toast après 3 secondes
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar-container">
          <Sidebar />
        </Col>
        <Col md={10} className="content-container">
          <h5 className="welcome-message">
            {userName ? `Bienvenue sur votre espace secrétaire, ${userName}` : "Bienvenue sur votre espace secrétaire"}
          </h5>

          {/* Affichage du Toast */}
          {showToast && (
            <Toast className="notification-toast">
              <Toast.Body>
                <img src="https://plus.unsplash.com/premium_photo-1681494639261-7908ef9d2257?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8" alt="Secrétaire" className="toast-img" />
                <div>
                  <strong>Bonjour Secrétaire Sarra</strong>
                  <p>Bienvenue dans votre compte.</p>
                </div>
              </Toast.Body>
            </Toast>
          )}

          <Row>
            <Col md={6}>
              <DashboardGraph />
            </Col>
            <Col md={6}>
              <Calendar />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Notifications />
            </Col>
            <Col md={6}>
              <h6>Statistiques du Cabinet</h6>
              <div className="statistiques">
                {/* Graphiques ou autres informations statistiques */}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

// App principal
const App = () => (
  <Router>
    <Header />
    <SecretaireDashboard />
    <Routes>
      <Route path="/" element={<h2>Accueil</h2>} />
      <Route path="/tableau-de-bord" element={<h2>Tableau de bord</h2>} />
      <Route path="/rendez-vous" element={<h2>Rendez-vous</h2>} />
      <Route path="/fiche-patient" element={<h2>Liste des Fiches Patients</h2>} />
      <Route path="/fiche-patient/create" element={<h2>Créer une Fiche Patient</h2>} />
      <Route path="/dossier-medical" element={<h2>Liste des Dossiers Médicaux</h2>} />
      <Route path="/consultations" element={<h2>Consultations</h2>} />
      <Route path="/prescriptions" element={<h2>Prescriptions</h2>} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
