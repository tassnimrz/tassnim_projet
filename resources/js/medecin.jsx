import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Navbar, Form, Button, Table, Card, Dropdown, Nav, Spinner, Badge
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faBell, faUser, faAngleLeft, faAngleRight,
  faStethoscope, faFolderOpen, faCalendarAlt, faFilePrescription,
  faNotesMedical, faUserNurse, faCog, faSignOutAlt, faGlobe,
  faHome, faFileMedical, faFileInvoice, faPills, faCertificate,
  faUserClock, faChartLine, faRobot, faPlus,
  faEnvelope, faComment, faCalendarDay, faChevronDown, faCommentMedical,
  faCalendarCheck, faBars, faAngleDown, faMicrophone,faCircle
} from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";


const styles = `
  :root {
    --primary-color: #2a5c82;
    --primary-light: #3a7ca5;
    --secondary-color: #5aa897;
    --dashboard-bg: #f8faff;
    --sidebar-bg: linear-gradient(195deg, #2a5c82, #1a4465);
    --transition-speed: 0.3s;
    --sidebar-width: 280px;
    --sidebar-collapsed-width: 80px;
    --active-link-glow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  body {
    font-family: 'Segoe UI', Roboto, sans-serif;
  }

  .dashboard-container {
    min-height: 100vh;
    display: flex;
    background: var(--dashboard-bg);
  }

  /* Sidebar Styles */
  .sidebar {
    width: var(--sidebar-width);
    height: 100vh;
    position: fixed;
    background: var(--sidebar-bg);
    box-shadow: 4px 0 20px rgba(136, 160, 11, 0.1);
    transition: all var(--transition-speed) ease;
    z-index: 1000;
    overflow-y: auto;
  }

  .sidebar.collapsed {
    width: var(--sidebar-collapsed-width);
  }

  .sidebar-header {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .sidebar-brand {
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .sidebar-nav {
    padding: 1rem 0;
  }

  .nav-link {
    color: rgba(255,255,255,0.8);
    padding: 0.75rem 1.5rem;
    margin: 0.25rem 1rem;
    border-radius: 6px;
    transition: all var(--transition-speed) ease;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .nav-link:hover {
    background: rgba(255,255,255,0.1);
    color: white;
    transform: translateX(5px);
  }

  .nav-link.active-link {
    background: rgba(255,255,255,0.2);
    color: white;
    border-left: 3px solid white;
    box-shadow: var(--active-link-glow);
    transform: translateX(5px);
  }

  .nav-link.active-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: white;
    animation: linkGlow 2s infinite alternate;
  }

  @keyframes linkGlow {
    0% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  .nav-icon {
    width: 24px;
    text-align: center;
    margin-right: 1rem;
    font-size: 1.1rem;
    transition: transform var(--transition-speed) ease;
  }

  .nav-link:hover .nav-icon,
  .nav-link.active-link .nav-icon {
    transform: scale(1.2);
  }

  .nav-text {
    white-space: nowrap;
    transition: all var(--transition-speed) ease;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 1rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  /* Dropdown Styles */
  .sidebar-dropdown .dropdown-toggle {
    width: 100%;
    text-align: left;
    background: transparent !important;
    border: none;
    padding: 0;
  }

  .sidebar-dropdown .dropdown-toggle::after {
    display: none;
  }

  .dropdown-menu-sidebar {
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 8px;
    padding: 0;
    overflow: hidden;
    margin-top: 0 !important;
    width: calc(100% - 2rem);
    margin-left: 1rem;
  }

  .dropdown-item-sidebar {
    color: rgba(255,255,255,0.8);
    padding: 0.75rem 1.5rem;
    transition: all var(--transition-speed) ease;
  }

  .dropdown-item-sidebar:hover {
    background: rgba(255,255,255,0.1);
    color: white;
    padding-left: 1.75rem;
  }

  .dropdown-item-sidebar.active {
    background: rgba(255,255,255,0.2);
    color: white;
    font-weight: 500;
    box-shadow: var(--active-link-glow);
  }

  /* Main Content Styles */
  .main-content {
    margin-left: var(--sidebar-width);
    transition: all var(--transition-speed) ease;
    flex: 1;
  }

  .main-content.collapsed {
    margin-left: var(--sidebar-collapsed-width);
  }

  /* Iframe Styles */
  iframe {
    transition: opacity 0.5s ease;
  }

  /* Responsive */
  @media (max-width: 992px) {
    .sidebar {
      width: 0;
      overflow: hidden;
    }
    .sidebar.collapsed {
      width: var(--sidebar-collapsed-width);
    }
    .main-content {
      margin-left: 0;
    }
  }

`;

const Sidebar = ({ collapsed, toggleSidebar, setActiveContent, activeLink, setActiveLink }) => {
    const [fiches, setFiches] = useState([]); 
  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      localStorage.removeItem('userToken');
      window.location.href = '/login';
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/dossier-medical', {
          headers: { 'Accept': 'application/json' },
          credentials: 'include'
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        setFiches(data);
        setLoading(false);

        setTimeout(() => {
          if (data.length > 0) {
            setShowNotification(true);
          }
        }, 3000);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const createNavLink = (path, label, icon) => (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Nav.Link
        className={`nav-link ${activeLink === path ? 'active-link' : ''}`}
        onClick={() => {
          setActiveLink(path);
          setActiveContent(
            <AnimatePresence mode='wait'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-100"
              >
                <iframe
                  src={`http://127.0.0.1:8000${path}`}
                  title={label}
                  className="border-0 w-100 h-100"
                  style={{ minHeight: 'calc(100vh - 60px)' }}
                />
              </motion.div>
            </AnimatePresence>
          );
        }}
      >
        <span className="nav-icon">
          <FontAwesomeIcon icon={icon} />
        </span>
        {!collapsed && <span className="nav-text">{label}</span>}
      </Nav.Link>
    </motion.div>
  );

  const createDropdown = (mainPath, mainLabel, mainIcon, items) => (
    <Dropdown className="sidebar-dropdown">
      <Dropdown.Toggle as={Nav.Link} className={`nav-link ${activeLink.startsWith(mainPath) ? 'active-link' : ''}`}>
        <span className="nav-icon">
          <FontAwesomeIcon icon={mainIcon} />
        </span>
        {!collapsed && (
          <>
            <span className="nav-text flex-grow-1">{mainLabel}</span>
            <FontAwesomeIcon icon={faChevronDown} className="ms-2" />
          </>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-sidebar">
        {items.map((item, index) => (
          <Dropdown.Item
            key={index}
            className={`dropdown-item-sidebar ${activeLink === item.path ? 'active' : ''}`}
            onClick={() => {
              setActiveLink(item.path);
              setActiveContent(
                <AnimatePresence mode='wait'>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-100"
                  >
                    <iframe
                      src={`http://127.0.0.1:8000${item.path}`}
                      title={item.label}
                      className="border-0 w-100 h-100"
                      style={{ minHeight: 'calc(100vh - 60px)' }}
                    />
                  </motion.div>
                </AnimatePresence>
              );
            }}
          >
            <FontAwesomeIcon icon={faCircle} className="me-2" style={{ fontSize: '0.5rem' }} />
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <style>{styles}</style>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-brand">MedDashboard</span>}
        <Button variant="link" onClick={toggleSidebar} className="p-0 text-white">
          <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleLeft} />
        </Button>
      </div>

      <Nav className="flex-column sidebar-nav">
        {createNavLink("/", "Accueil", faHome)}

        {createDropdown(
          "/dossiers",
          "Dossiers Médicaux",
          faFolderOpen,
          [
            { path: "/dossier-medical", label: "Nouveaux Dossier" },
            { path: "/dossier-medical", label: "Historique" },
           { path: "/dossiers-medicaux/archives", label: "Archives" },
          ]
        )}

        {createDropdown(
          "/patients",
          "Patients",
          faUser,
          [

            { path: "/api/fiche-patient", label: "Liste Fiches Patients" },
            { path: "/fiche-patient/create", label: "Ajouter nouvelle fiche" }
          ]
        )}

        {createDropdown(
          "/consultations",
          "Consultations",
          faStethoscope,
          [
            { path: "/consultations/create", label: "Ajouter Consultation" },
            { path: "/consultations", label: "Historique" }
          ]
        )}

        {createDropdown(
          "/certificats",
          "Certificats",
          faCertificate,
          [
            { path: "/certificats/create", label: "Ajouter Certificat" },
            { path: "/certificats", label: "Historique" }
          ]
        )}

        {createDropdown(
          "/ordonnances",
          "Ordonnances",
          faFilePrescription,
          [
            { path: "/ordonnances/create", label: "Ajouter Ordonnance" },
            { path: "/ordonnances", label: "Historique" }
          ]
        )}

        {createDropdown(
          "/examens",
          "Examens",
          faNotesMedical,
          [
            { path: "/examens/create", label: "Ajouter Examen" },
            { path: "/examens", label: "Historique" }
          ]
        )}

        {createDropdown(
          "/lettres",
          "Lettres",
          faNotesMedical,
          [
            { path: "/lettres/create", label: "Ajouter lettre" },
            { path: "/lettres", label: "Historique" }
          ]
        )}

        {createDropdown(
          "/api/tous-rendezvous",
          "Rendez-vous",
          faNotesMedical,
          [
            { path: "ttp://127.0.0.1:8000/voir-rendezvous", label: "Tous rendez-vous" },
            { path: "/api/prochain-rdv", label: "Prochian rendez-vous" }
          ]
        )}

        <div className="sidebar-footer">
          <Nav.Link className="nav-link" onClick={handleLogout}>
            <span className="nav-icon">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
            {!collapsed && <span className="nav-text">Se déconnecter</span>}
          </Nav.Link>
        </div>
      </Nav>
    </div>
  );
};

const Header = () => {
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

  const [searchFocus, setSearchFocus] = useState(false);
  const [activeLang, setActiveLang] = useState('fr');

  return (
    <Navbar className="bg-white shadow-sm py-2 px-3">
      <div className="d-flex align-items-center w-100">
        {/* Barre de recherche */}
        <div className={`search-container ${searchFocus ? 'focused' : ''}`}>
          <Form.Control
            type="search"
            placeholder="Rechercher un patient..."
            className="search-input"
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>

        {/* Contrôles droite */}
        <div className="header-controls ms-auto">
          <Dropdown className="lang-selector me-3">
            <Dropdown.Toggle variant="light" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faGlobe} className="me-1" />
              <span>{activeLang.toUpperCase()}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setActiveLang('fr')}>Français</Dropdown.Item>
              <Dropdown.Item onClick={() => setActiveLang('en')}>English</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button variant="light" className="notification-btn me-3 position-relative">
            <FontAwesomeIcon icon={faBell} />
            <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
              2
            </Badge>
          </Button>

          <Dropdown>
            <Dropdown.Toggle variant="light" className="user-profile-toggle">
              <div className="d-flex align-items-center">
                <div className="profile-avatar me-2">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="profile-info">
                  <div className="profile-name">{userName || "Chargement..."}</div>
                </div>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.Header className="d-flex align-items-center">
                <div className="profile-avatar-lg me-2">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div>
                  <h6 className="mb-0">{userName || "Chargement..."}</h6>
                  <small className="text-muted">Médecin</small>
                </div>
              </Dropdown.Header>
              <Dropdown.Item href="/user-profile">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Mon Profil
              </Dropdown.Item>
              <Dropdown.Item>
                <FontAwesomeIcon icon={faCog} className="me-2" />
                Paramètres
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Déconnexion
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <style jsx>{`
        .search-container {
          position: relative;
          max-width: 500px;
          width: 100%;
          transition: all 0.3s ease;
        }

        .search-input {
          padding-left: 2.5rem;
          border-radius: 20px;
          border: 1px solid #dee2e6;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          box-shadow: 0 0 0 3px rgba(42, 92, 130, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }

        .header-controls {
          display: flex;
          align-items: center;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-avatar-lg {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-name {
          font-weight: 600;
          color: var(--primary-color);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .search-container {
            max-width: 200px;
          }
          .profile-name {
            display: none;
          }
        }
      `}</style>
    </Navbar>
  );
};

const DashboardContent = ({ activeContent }) => {
    const [stats, setStats] = useState(null);
    const [recentFiles, setRecentFiles] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:8000/stats');
          const data = await response.json();

          setStats({
            patients: data.patients,
            consultations: data.consultations,
            ordonnances: data.ordonnances,
            rendezvous: data.rendezvous
          });

          // Simulation de données récentes pour le style
          setRecentFiles([
            { id: 1, type: "Consultation", nom: "Jean Dupont", date: "15/06/2023" },
            { id: 2, type: "Ordonnance", nom: "Marie Lambert", date: "14/06/2023" },
            { id: 3, type: "Certificat", nom: "Paul Martin", date: "13/06/2023" },
            { id: 4, type: "Examen", nom: "Sophie Bernard", date: "12/06/2023" }
          ]);
        } catch (error) {
          console.error("Erreur lors du chargement des statistiques :", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    const StatCard = ({ icon, title, value, color }) => (
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="dashboard-card border-0 shadow-sm rounded-xl overflow-hidden">
          <Card.Body className="d-flex align-items-center p-3">
            <div className={`card-icon bg-gradient-${color} text-white me-3 d-flex align-items-center justify-content-center rounded-lg`}
                 style={{ width: '48px', height: '48px' }}>
              <FontAwesomeIcon icon={icon} size="lg" />
            </div>
            <div>
              <h3 className="mb-0 fw-bold text-dark">{value}</h3>
              <small className="text-muted text-uppercase fw-medium">{title}</small>
            </div>
          </Card.Body>
          <div className={`progress-bar-${color}`} style={{ height: '4px' }}></div>
        </Card>
      </motion.div>
    );

    return (
      <div className="h-100 p-4" style={{ backgroundColor: '#f8faff' }}>
        {!activeContent ? (
          <>
            <Row className="g-4 mb-4">
              <Col md={6} lg={3}>
                {loading ? (
                  <Card className="dashboard-card border-0 shadow-sm">
                    <Card.Body className="d-flex justify-content-center align-items-center py-4">
                      <Spinner animation="border" variant="primary" />
                    </Card.Body>
                  </Card>
                ) : (
                  <StatCard icon={faUser} title="Patients" value={stats.patients} color="primary" />
                )}
              </Col>

              <Col md={6} lg={3}>
                {loading ? (
                  <Card className="dashboard-card border-0 shadow-sm">
                    <Card.Body className="d-flex justify-content-center align-items-center py-4">
                      <Spinner animation="border" variant="success" />
                    </Card.Body>
                  </Card>
                ) : (
                  <StatCard icon={faStethoscope} title="Consultations" value={stats.consultations} color="success" />
                )}
              </Col>

              <Col md={6} lg={3}>
                {loading ? (
                  <Card className="dashboard-card border-0 shadow-sm">
                    <Card.Body className="d-flex justify-content-center align-items-center py-4">
                      <Spinner animation="border" variant="warning" />
                    </Card.Body>
                  </Card>
                ) : (
                  <StatCard icon={faFilePrescription} title="Ordonnances" value={stats.ordonnances} color="warning" />
                )}
              </Col>

              <Col md={6} lg={3}>
                {loading ? (
                  <Card className="dashboard-card border-0 shadow-sm">
                    <Card.Body className="d-flex justify-content-center align-items-center py-4">
                      <Spinner animation="border" variant="info" />
                    </Card.Body>
                  </Card>
                ) : (
                  <StatCard icon={faCalendarAlt} title="Rendez-vous" value={stats.rendezvous} color="info" />
                )}
              </Col>
            </Row>

            <Row className="g-4">
              <Col lg={8}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="dashboard-card border-0 shadow-sm rounded-xl overflow-hidden">
                    <Card.Body className="p-0">
                      <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                        <h5 className="mb-0 fw-bold text-dark">Dossiers Récents</h5>
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-pill px-3"
                          style={{
                            background: 'linear-gradient(135deg, #2a5c82 0%, #3a7ca5 100%)',
                            border: 'none',
                            boxShadow: '0 4px 6px rgba(42, 92, 130, 0.2)'
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} className="me-2" />
                          Nouveau
                        </Button>
                      </div>

                      {loading ? (
                        <div className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <Table hover className="recent-table mb-0">
                            <thead className="bg-light">
                              <tr>
                                <th className="ps-4 fw-medium text-muted text-uppercase small">Type</th>
                                <th className="fw-medium text-muted text-uppercase small">Nom</th>
                                <th className="fw-medium text-muted text-uppercase small">Date</th>
                                <th className="pe-4 text-end fw-medium text-muted text-uppercase small">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recentFiles.map((file, index) => (
                                <motion.tr
                                  key={file.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  whileHover={{ backgroundColor: '#f8f9fa' }}
                                  className="border-top"
                                >
                                  <td className="ps-4 fw-medium align-middle">
                                    <Badge
                                      pill
                                      className={`text-uppercase d-inline-flex align-items-center ${file.type === 'Consultation' ? 'bg-primary-light' : file.type === 'Ordonnance' ? 'bg-warning-light' : file.type === 'Certificat' ? 'bg-success-light' : 'bg-info-light'}`}
                                      style={{
                                        fontSize: '0.7rem',
                                        padding: '0.35rem 0.7rem',
                                        background: file.type === 'Consultation' ? 'rgba(42, 92, 130, 0.1)' :
                                                    file.type === 'Ordonnance' ? 'rgba(255, 193, 7, 0.1)' :
                                                    file.type === 'Certificat' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(23, 162, 184, 0.1)',
                                        color: file.type === 'Consultation' ? '#2a5c82' :
                                               file.type === 'Ordonnance' ? '#ffc107' :
                                               file.type === 'Certificat' ? '#28a745' : '#17a2b8'
                                      }}
                                    >
                                      {file.type}
                                    </Badge>
                                  </td>
                                  <td className="align-middle">{file.nom}</td>
                                  <td className="text-muted align-middle">{file.date}</td>
                                  <td className="pe-4 text-end align-middle">
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="text-primary p-0"
                                      style={{ minWidth: '70px' }}
                                    >
                                      <FontAwesomeIcon icon={faFolderOpen} className="me-1" />
                                      Ouvrir
                                    </Button>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>

              <Col lg={4}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="dashboard-card border-0 shadow-sm rounded-xl overflow-hidden h-100">
                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-primary-light text-primary rounded-lg p-3 me-3">
                          <FontAwesomeIcon icon={faRobot} size="2x" className="pulse" />
                        </div>
                        <div>
                          <h5 className="mb-0 fw-bold">Analyse IA</h5>
                          <small className="text-muted">Prédictions du mois</small>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="flex-grow-1 me-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted small">Consultations</span>
                              <span className="fw-bold small">+24%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: '75%' }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 me-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted small">Précision</span>
                              <span className="fw-bold small">92%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: '92%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="light"
                        className="w-100 mt-auto rounded-pill d-flex align-items-center justify-content-center py-2"
                        style={{
                          border: '1px solid rgba(42, 92, 130, 0.2)',
                          color: '#2a5c82'
                        }}
                      >
                        <FontAwesomeIcon icon={faChartLine} className="me-2" />
                        Voir les stats avancées
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </>
        ) : (
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeContent.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-100"
            >
              {activeContent}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Styles supplémentaires */}
        <style jsx>{`
          .dashboard-card {
            transition: all 0.3s ease;
            border-radius: 12px;
            overflow: hidden;
          }

          .bg-gradient-primary {
            background: linear-gradient(135deg, #2a5c82 0%, #3a7ca5 100%);
          }

          .bg-gradient-success {
            background: linear-gradient(135deg, #28a745 0%, #5aa897 100%);
          }

          .bg-gradient-warning {
            background: linear-gradient(135deg, #ffc107 0%, #f9a825 100%);
          }

          .bg-gradient-info {
            background: linear-gradient(135deg, #17a2b8 0%, #4dc6d1 100%);
          }

          .progress-bar-primary {
            background-color: #2a5c82;
          }

          .progress-bar-success {
            background-color: #28a745;
          }

          .progress-bar-warning {
            background-color: #ffc107;
          }

          .progress-bar-info {
            background-color: #17a2b8;
          }

          .bg-primary-light {
            background-color: rgba(42, 92, 130, 0.1);
          }

          .bg-success-light {
            background-color: rgba(40, 167, 69, 0.1);
          }

          .bg-warning-light {
            background-color: rgba(255, 193, 7, 0.1);
          }

          .bg-info-light {
            background-color: rgba(23, 162, 184, 0.1);
          }

          .rounded-xl {
            border-radius: 12px !important;
          }

          .pulse {
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }

          .recent-table {
            font-size: 0.9rem;
          }

          .recent-table th {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }

          .recent-table td {
            padding-top: 1rem;
            padding-bottom: 1rem;
            vertical-align: middle;
          }
        `}</style>
      </div>
    );
  };

const PatientDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeContent, setActiveContent] = useState(null);
  const [activeLink, setActiveLink] = useState('/');

  return (
    <div className="dashboard-container">
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed(!collapsed)}
        setActiveContent={setActiveContent}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />

      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <Header />
        <Container fluid className="h-100 p-0">
          <DashboardContent activeContent={activeContent} />
        </Container>
      </main>
    </div>
  );
};

const App = () => (
  <>
    <style>{styles}</style>
    <PatientDashboard />
  </>
);

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);