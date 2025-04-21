import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from 'react-router-dom';
import { StrictMode } from "react";
import {
  Container, Row, Col, Navbar, Nav, Form, Button, Table,
  Dropdown, Card, Badge, Image, Modal
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CapsuleSante from "./CapsuleSante";

import {
  faSearch, faBell, faCog, faUser, faSignOutAlt, faHome,
  faClipboardList, faCalendarAlt, faFolderOpen, faStethoscope,
  faFilePrescription, faCheckCircle, faTimesCircle, faBars,
  faHeartbeat, faCreditCard, faCalendar, faNotesMedical,
  faPrescriptionBottle, faFileMedical, faEnvelopeOpenText,
  faVial, faFileAlt, faChevronDown, faAngleLeft, faAngleRight
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

// Styles CSS
const styles = `
  .dashboard-container {
    min-height: 100vh;
    display: flex;
    background: #f8f9fa;
  }

  .sidebar {
    width: 250px;
    height: 100vh;
    position: fixed;
    transition: all 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  }

  .sidebar.collapsed {
    width: 70px;
  }

  .main-content {
    margin-left: 250px;
    transition: all 0.3s ease;
    height: 100vh;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .main-content.collapsed {
    margin-left: 70px;
  }

  .content-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  iframe {
    height: 100%;
    width: 100%;
    min-height: 600px;
    background: white;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
    border-radius: 8px;
    border: none;
  }

  .active-link {
    background: rgba(255, 255, 255, 0.1) !important;
    border-left: 4px solid white !important;
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
    }

    .sidebar.collapsed {
      width: 0;
      overflow: hidden;
    }
  }
`;

const Sidebar = ({ language, collapsed, toggleSidebar, setActiveContent, activeLink, setActiveLink }) => {
  const [user, setUser] = useState(null);
  const [ficheId, setFicheId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMedicalSubmenu, setShowMedicalSubmenu] = useState(false);
  const [showRendezvousSubmenu, setShowRendezvousSubmenu] = useState(false);
  const [showHealthSubmenu, setShowHealthSubmenu] = useState(false);

  useEffect(() => {
      axios.get('/user-profile')
          .then(res => {
              const currentUser = res.data;
              setUser(currentUser);
              return axios.get(`/api/fiche-patient-id-by-email/${currentUser.email}`);
          })
          .then(res => {
              setFicheId(res.data.id);
          })
          .catch(() => {
              setFicheId(null);
          })
          .finally(() => {
              setLoading(false);
          });
  }, []);

  const translations = {
      fr: {
          home: " Accueil",
          createAppointment: " Prendre un Rendez-vous",
          medicalFile: "Mon Dossier Médical",
          fichePatient: "👤 Fiche Patient",
          ordonnances: "💊 Ordonnances",
          certificats: "📄 Certificats",
          examens: "🧪 Examens",
          lettres: "📬 Lettres Médicales",
          rendezvous: " Mes Rendez-vous",
          historique: "📅 Historique",
          consultations: "📋 Consultations",
          healthFollowUp: " Suivi Personnel",
          healthFollowUpText: "❤️ Suivi Santé",
          insurancePayment: "💳 Paiement & Assurance",
          logout: "Se Déconnecter",
          myAppointments: "Mes Rendez-vous"
      },
      en: {
          home: " Home",
          createAppointment: " Create Appointment",
          medicalFile: " My Medical File",
          fichePatient: "👤 Patient Sheet",
          ordonnances: "💊 Prescriptions",
          certificats: "📄 Certificates",
          examens: "🧪 Exams",
          lettres: "📬 Medical Letters",
          rendezvous: " My Appointments",
          historique: "📅 History",
          consultations: "📋 Consultations",
          healthFollowUp: " Personal Follow-Up",
          healthFollowUpText: "❤️ Health Follow-Up",
          insurancePayment: "💳 Insurance & Payments",
          logout: "🔑 Logout",
          myAppointments: "My Appointments"
      },
  };

  const t = translations[language] || translations.en;

  const handleLogout = async () => {
      try {
          await axios.post('/logout');
          localStorage.removeItem('userToken');
          window.location.href = '/login';
      } catch (error) {
          console.error("Erreur lors de la déconnexion:", error);
      }
  };

  const createNavLink = (path, label, icon) => (
      <Nav.Link
          className={`text-white d-flex align-items-center py-2 ${activeLink === path ? 'active-link' : ''}`}
          onClick={() => {
              setActiveLink(path);
              setActiveContent(
                  <div className="content-container">
                      <iframe
                          src={`http://127.0.0.1:8000${path}`}
                          title={label}
                          style={{
                              border: "none",
                              width: "100%",
                              height: "100%",
                              borderRadius: "8px"
                          }}
                      />
                  </div>
              );
          }}
      >
          <FontAwesomeIcon icon={icon} className="me-2" />
          {!collapsed && label}
      </Nav.Link>
  );

  return (
      <motion.div
          initial={{ width: 250 }}
          animate={{ width: collapsed ? 70 : 250 }}
          transition={{ duration: 0.3 }}
          className={`sidebar bg-primary text-white p-3 ${collapsed ? "collapsed" : ""}`}
          style={{
              minHeight: "100vh",
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
              fontFamily: "'Roboto', sans-serif",
              overflow: "hidden",
          }}
      >
          <div className="sidebar-header d-flex align-items-center justify-content-between p-3">
              {!collapsed && <h4 className="mb-0">AI-MedCare</h4>}
              <Button variant="link" onClick={toggleSidebar} className="p-0 text-white">
                  <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleLeft} />
              </Button>
          </div>

          <Nav className="flex-column mt-3">
              <Nav.Link
                  className={`text-white d-flex align-items-center py-2 ${activeLink === '/' ? 'active-link' : ''}`}
                  onClick={() => {
                      setActiveLink('/');
                      setActiveContent(null);
                  }}
              >
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  {!collapsed && t.home}
              </Nav.Link>

              {/* Nouveau bouton Mes Rendez-vous */}
              <Nav.Link
                  className={`text-white d-flex align-items-center py-2 ${activeLink === '/mes-rendez-vous' ? 'active-link' : ''}`}
                  onClick={() => {
                      setActiveLink('/mes-rendez-vous');
                      setActiveContent(
                          <div className="content-container">
                              <iframe
                                  src="http://127.0.0.1:8000/mes-rendez-vous"
                                  title="Mes Rendez-vous"
                                  style={{ border: "none", width: "100%", height: "100%" }}
                              />
                          </div>
                      );
                  }}
              >
                  <FontAwesomeIcon icon={faCalendar} className="me-2" />
                  {!collapsed && t.myAppointments}
              </Nav.Link>

              <Nav.Link
                  className={`text-white d-flex align-items-center py-2 ${activeLink === '/rendez-vous' ? 'active-link' : ''}`}
                  onClick={() => {
                      setActiveLink('/rendez-vous');
                      setActiveContent(
                          <div className="content-container">
                              <iframe
                                  src="http://127.0.0.1:8000/rendez-vous"
                                  title="Prendre Rendez-vous"
                                  style={{ border: "none", width: "100%", height: "100%" }}
                              />
                          </div>
                      );
                  }}
              >
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  {!collapsed && t.createAppointment}
              </Nav.Link>

              {/* Menu Dossier Médical */}
              <Nav.Link
                  className="text-white d-flex align-items-center py-2"
                  onClick={() => setShowMedicalSubmenu(!showMedicalSubmenu)}
              >
                  <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                  {!collapsed && t.medicalFile}
                  <FontAwesomeIcon
                      icon={faChevronDown}
                      className="ms-auto"
                      style={{
                          transition: "transform 0.3s",
                          transform: showMedicalSubmenu ? "rotate(180deg)" : "rotate(0)"
                      }}
                  />
              </Nav.Link>

              {showMedicalSubmenu && !collapsed && (
                  <div className="ms-3 mt-2">
                      {ficheId ? (
                          <>
                              <Nav.Link
                                  className={`text-white d-flex align-items-center py-2 ${activeLink === `/dossier-medical/fiche/${ficheId}` ? 'active-link' : ''}`}
                                  onClick={() => {
                                      setActiveLink(`/dossier-medical/fiche/${ficheId}`);
                                      setActiveContent(
                                          <div className="content-container">
                                              <iframe
                                                  src={`http://127.0.0.1:8000/dossier-medical/fiche/${ficheId}`}
                                                  title="Dossier Médical"
                                                  style={{ border: "none", width: "100%", height: "100%" }}
                                              />
                                          </div>
                                      );
                                  }}
                              >
                                  📂 Dossier Médical Complet
                              </Nav.Link>
                              <Nav.Link
                                  className={`text-white d-flex align-items-center py-2 ${activeLink === `/dossier-medical/${ficheId}/consultations` ? 'active-link' : ''}`}
                                  onClick={() => {
                                      setActiveLink(`/dossier-medical/${ficheId}/consultations`);
                                      setActiveContent(
                                          <div className="content-container">
                                              <iframe
                                                  src={`http://127.0.0.1:8000/dossier-medical/${ficheId}/consultations`}
                                                  title="Consultations"
                                                  style={{ border: "none", width: "100%", height: "100%" }}
                                              />
                                          </div>
                                      );
                                  }}
                              >
                                  {t.consultations}
                              </Nav.Link>
                              <Nav.Link
                                  className={`text-white d-flex align-items-center py-2 ${activeLink === `/dossier-medical/${ficheId}/certificats` ? 'active-link' : ''}`}
                                  onClick={() => {
                                      setActiveLink(`/dossier-medical/${ficheId}/certificats`);
                                      setActiveContent(
                                          <div className="content-container">
                                              <iframe
                                                  src={`http://127.0.0.1:8000/dossier-medical/${ficheId}/certificats`}
                                                  title="Certificats"
                                                  style={{ border: "none", width: "100%", height: "100%" }}
                                              />
                                          </div>
                                      );
                                  }}
                              >
                                  {t.certificats}
                              </Nav.Link>
                              <Nav.Link
                                  className={`text-white d-flex align-items-center py-2 ${activeLink === `/dossier-medical/${ficheId}/ordonnances` ? 'active-link' : ''}`}
                                  onClick={() => {
                                      setActiveLink(`/dossier-medical/${ficheId}/ordonnances`);
                                      setActiveContent(
                                          <div className="content-container">
                                              <iframe
                                                  src={`http://127.0.0.1:8000/dossier-medical/${ficheId}/ordonnances`}
                                                  title="Ordonnances"
                                                  style={{ border: "none", width: "100%", height: "100%" }}
                                              />
                                          </div>
                                      );
                                  }}
                              >
                                  {t.ordonnances}
                              </Nav.Link>
                              <Nav.Link
                                  className={`text-white d-flex align-items-center py-2 ${activeLink === `/dossier-medical/${ficheId}/lettre` ? 'active-link' : ''}`}
                                  onClick={() => {
                                      setActiveLink(`/dossier-medical/${ficheId}/lettre`);
                                      setActiveContent(
                                          <div className="content-container">
                                              <iframe
                                                  src={`http://127.0.0.1:8000/dossier-medical/${ficheId}/lettre`}
                                                  title="Lettres"
                                                  style={{ border: "none", width: "100%", height: "100%" }}
                                              />
                                          </div>
                                      );
                                  }}
                              >
                                  {t.lettres}
                              </Nav.Link>
                              <Nav.Link
                                  className={`text-white d-flex align-items-center py-2 ${activeLink === `/dossier-medical/${ficheId}/examen` ? 'active-link' : ''}`}
                                  onClick={() => {
                                      setActiveLink(`/dossier-medical/${ficheId}/examen`);
                                      setActiveContent(
                                          <div className="content-container">
                                              <iframe
                                                  src={`http://127.0.0.1:8000/dossier-medical/${ficheId}/examen`}
                                                  title="Examens"
                                                  style={{ border: "none", width: "100%", height: "100%" }}
                                              />
                                          </div>
                                      );
                                  }}
                              >
                                  {t.examens}
                              </Nav.Link>
                          </>
                      ) : (
                          <div className="text-white ps-3 py-2">Aucun dossier patient trouvé</div>
                      )}
                  </div>
              )}

              {/* Menu Suivi Santé */}
              <Nav.Link
                  className="text-white d-flex align-items-center py-2"
                  onClick={() => setShowHealthSubmenu(!showHealthSubmenu)}
              >
                  <FontAwesomeIcon icon={faHeartbeat} className="me-2" />
                  {!collapsed && t.healthFollowUp}
                  <FontAwesomeIcon
                      icon={faChevronDown}
                      className="ms-auto"
                      style={{
                          transition: "transform 0.3s",
                          transform: showHealthSubmenu ? "rotate(180deg)" : "rotate(0)"
                      }}
                  />
              </Nav.Link>

              {showHealthSubmenu && !collapsed && (
                  <div className="ms-3 mt-2">
                      {ficheId ? (
                          <Nav.Link
                              className={`text-white d-flex align-items-center py-2 ${activeLink === `/fiche-patient/${ficheId}` ? 'active-link' : ''}`}
                              onClick={() => {
                                  setActiveLink(`/fiche-patient/${ficheId}`);
                                  setActiveContent(
                                      <div className="content-container">
                                          <iframe
                                              src={`http://127.0.0.1:8000/fiche-patient/${ficheId}`}
                                              title="Fiche Patient"
                                              style={{ border: "none", width: "100%", height: "100%" }}
                                          />
                                      </div>
                                  );
                              }}
                          >
                              {t.fichePatient}
                          </Nav.Link>
                      ) : (
                          <div className="text-white ps-3 py-2">Aucune fiche patient trouvée</div>
                      )}
                  </div>
              )}

              {/* Bouton Déconnexion */}
              <Nav.Link className="text-white d-flex align-items-center py-2" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  {!collapsed && t.logout}
              </Nav.Link>
          </Nav>
      </motion.div>
  );
};
const Header = ({ language, handleLanguageChange }) => {
    const translations = {
        fr: {
            searchPlaceholder: "Rechercher...",
            profile: "👤 Profil",
            settings: "⚙️ Paramètres",
            logout: "🚪 Déconnexion",
            language: "Langue",
        },
        en: {
            searchPlaceholder: "Search...",
            profile: "👤 Profile",
            settings: "⚙️ Settings",
            logout: "🚪 Logout",
            language: "Language",
        },
    };

    const t = translations[language];

    const [userName, setUserName] = useState("");
    useEffect(() => {
        axios.get('/user-profile')
            .then(response => {
                setUserName(response.data.name);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    return (
        <Navbar expand="lg" className="navbar-dark bg-primary px-3" style={{ marginLeft: "10px", marginTop: "10px" }}>
            <Navbar.Brand href="#">AI-MedCare 🩺🤍</Navbar.Brand>
            <Form className="d-flex justify-content-center mx-auto" style={{ width: "50%" }}>
                <div style={{ position: "relative", width: "70%" }}>
                    <FontAwesomeIcon icon={faSearch} className="text-muted" style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }} />
                    <Form.Control
                        type="search"
                        placeholder={t.searchPlaceholder}
                        className="ps-5 py-2"
                        style={{
                            width: "100%",
                            borderRadius: "20px",
                            border: "1px solid #ccc",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
                        }}
                    />
                </div>
            </Form>

            <FontAwesomeIcon icon={faBell} className="text-white mx-2 position-relative" />

            <Dropdown className="ms-3">
                <Dropdown.Toggle variant="light" id="languageMenu">
                    <FontAwesomeIcon icon={faCog} className="mx-3" /> {t.language}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={() => handleLanguageChange('fr')}>Français</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleLanguageChange('en')}>English</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <span className="mx-1"></span>
            <Dropdown className="ms-3">
                <Dropdown.Toggle variant="light" id="profileMenu">
                    <FontAwesomeIcon icon={faUser} className="mx-3" />
                    {userName ? userName : "Loading..."}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                    <Dropdown.Item href="/user-profile">{t.profile}</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                        href="#"
                        className="text-danger"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}
                    >
                        {t.logout}
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Navbar>
    );
};

const Dashboard = ({ language, setActiveContent, setActiveLink }) => {
    const translations = {
        fr: {
            greeting: "Bienvenue, Cher Patient",
            appointmentBtn: "Prendre un rendez-vous",
            appointments: "9 Rendez-vous",
            profile: "Profil",
            logout: "Déconnexion",
            myAppointments: "Mes Rendez-vous"
        },
        en: {
            greeting: "Welcome, Dear Patient",
            appointmentBtn: "Make an Appointment",
            appointments: "9 Appointments",
            profile: "Profile",
            logout: "Logout",
            myAppointments: "My Appointments"
        },
    };

    const t = translations[language];
    const [userName, setUserName] = useState("");

    useEffect(() => {
        axios.get('/user-profile')
            .then(response => {
                setUserName(response.data.name);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du profil utilisateur : ", error);
            });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="p-3 text-center bg-light shadow-sm" style={{ backgroundColor: "#e3f2fd", borderRadius: "10px", marginLeft: "10px" }}>
                <Row className="align-items-center">
                    <Col xs={3}>
                        <motion.img
                            src="https://www.medihospes.it/wp-content/uploads/2022/08/Foto.jpeg"
                            alt="Patient Profile"
                            style={{ width: "100%", height: "auto", borderRadius: "8px", objectFit: "cover" }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    </Col>
                    <Col>
                        <h4 className="text-primary fw-bold">Bienvenue, Cher Patient {userName ? userName : ""}</h4>
                        <p className="text-muted">
                            Accédez à vos informations et suivez vos rendez-vous, ordonnances et dossiers médicaux avec facilité.
                        </p>
                    </Col>
                </Row>
                <div className="d-flex gap-4 justify-content-center mt-4">
                    <motion.button
                        variant="info"
                        onClick={() => {
                            setActiveLink('/mes-rendez-vous');
                            setActiveContent(
                                <div className="content-container">
                                    <iframe
                                        src="http://127.0.0.1:8000/mes-rendez-vous"
                                        title="Mes Rendez-vous"
                                        style={{ border: "none", width: "100%", height: "100%" }}
                                    />
                                </div>
                            );
                        }}
                        className="text-primary mt-3"
                        style={{
                            fontSize: "1rem",
                            padding: "12px 30px",
                            borderRadius: "25px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        📅 <span style={{ fontWeight: "bold" }}>{t.myAppointments}</span>
                    </motion.button>

                    <motion.button
                        variant="success"
                        onClick={() => {
                            setActiveLink('/rendez-vous');
                            setActiveContent(
                                <div className="content-container">
                                    <iframe
                                        src="http://127.0.0.1:8000/rendez-vous"
                                        title="Prendre Rendez-vous"
                                        style={{ border: "none", width: "100%", height: "100%" }}
                                    />
                                </div>
                            );
                        }}
                        className="text-primary mt-3"
                        style={{
                            fontSize: "1rem",
                            padding: "12px 30px",
                            borderRadius: "25px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        🔔 <span style={{ fontWeight: "bold" }}>{t.appointmentBtn}</span>
                    </motion.button>
                </div>
            </Card>
            <CapsuleSante />
        </motion.div>
    );
};

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
                <h5 className="text-primary mb-3">prendre Rendez-vous</h5>
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

const PatientDashboard = ({ language, handleLanguageChange }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeContent, setActiveContent] = useState(null);
    const [activeLink, setActiveLink] = useState('/');

    return (
        <div className="dashboard-container">
            <Sidebar
                language={language}
                collapsed={collapsed}
                toggleSidebar={() => setCollapsed(!collapsed)}
                setActiveContent={setActiveContent}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
            />

            <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                <Header language={language} handleLanguageChange={handleLanguageChange} />
                <Container fluid className="px-4 py-3 h-100">
                    {activeContent ? (
                        activeContent
                    ) : (
                        <>
                            <Dashboard 
                                language={language} 
                                setActiveContent={setActiveContent}
                                setActiveLink={setActiveLink}
                            />
                            <h5 className="text-primary mt-3">Rendez-vous</h5>
                            <AppointmentsTable />
                        </>
                    )}
                </Container>
            </main>
        </div>
    );
};

const App = () => {
    const [language, setLanguage] = useState("fr");

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
    };

    return (
        <Router>
            <style>{styles}</style>
            <Routes>
                <Route path="/" element={<PatientDashboard language={language} handleLanguageChange={handleLanguageChange} />} />
                <Route path="/dashboard/patient" element={<PatientDashboard language={language} handleLanguageChange={handleLanguageChange} />} />
                <Route path="/rendez-vous" element={<PatientDashboard language={language} handleLanguageChange={handleLanguageChange} />} />
                <Route path="/mes-rendez-vous" element={<PatientDashboard language={language} handleLanguageChange={handleLanguageChange} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);