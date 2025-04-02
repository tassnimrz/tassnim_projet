import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Navbar, Nav, Form, Button, Table, Dropdown, Card, Spinner, Alert 
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faUser, faCog, faBell, faSignOutAlt, faChartBar, 
  faUserMd, faClipboardList, faEdit, faTrashAlt 
} from "@fortawesome/free-solid-svg-icons";
import { Switch, FormControlLabel, Typography, Divider, Slider } from "@mui/material";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const primaryColor = "#1e90ff";
const secondaryColor = "#0056b3";
const backgroundColor = "#f4f7fa";
const gradientBackground = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;

const translations = {
  fr: {
    dashboard: "Tableau de bord",
    searchPlaceholder: "Rechercher...",
    profile: "Profil",
    settings: "Paramètres",
    logout: "Déconnexion",
    personnelManagement: "Gestion du Personnel",
    reportsStatistics: "Rapports & Statistiques",
  },
  en: {
    dashboard: "Dashboard",
    searchPlaceholder: "Search...",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    personnelManagement: "Personnel Management",
    reportsStatistics: "Reports & Statistics",
  },
};

const App = () => {
  const [language, setLanguage] = useState("fr");  // Langue par défaut en français
  const [texts, setTexts] = useState(translations[language]);

  // Mise à jour du texte lorsque la langue change
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setTexts(translations[selectedLanguage]);  // Met à jour les textes avec la langue sélectionnée
  };

  // Mise à jour du texte initial à la charge de la page
  useEffect(() => {
    setTexts(translations[language]);
  }, [language]);

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "#f4f7fa", display: "flex" }}
    >
      {/* Sidebar */}
      <Sidebar texts={texts} />  {/* Passer texts à Sidebar */}

      {/* Contenu principal */}
      <div style={{ flex: 1, marginLeft: "280px" }}>
        <Navbar style={{ background: "#1e90ff" }} variant="dark" expand="lg">
          <Container fluid>
            <Navbar.Brand href="#">{texts.dashboard}</Navbar.Brand>
            <Form className="d-flex ms-auto align-items-center">
              <Form.Control type="search" placeholder={texts.searchPlaceholder} className="me-2" />
              <Button variant="light" size="sm"><FontAwesomeIcon icon={faSearch} /></Button>
            </Form>
            <div className="d-flex align-items-center ms-3">
              <FontAwesomeIcon icon={faBell} className="text-white mx-2" />
              <FontAwesomeIcon icon={faCog} className="text-white mx-2" />
              <Dropdown>
                <Dropdown.Toggle variant="light" id="profileMenu" className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faUser} className="me-2" /> 👑 Admin
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item href="#profile">{texts.profile}</Dropdown.Item>
                  <Dropdown.Item href="#settings">{texts.settings}</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#logout">{texts.logout}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Container>
        </Navbar>

        <Container style={{ padding: "20px" }}>
          <h1>{texts.dashboard}</h1>
          <select onChange={handleLanguageChange} value={language} className="form-select w-auto">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </Container>
      </div>
    </div>
  );
};

const Sidebar = ({ theme, toggleTheme, color, texts }) => {
  // Valeur par défaut pour 'texts' si non définie
  const safeTexts = texts || translations.fr;

  return (
    <div
      className={`sidebar ${theme === "dark" ? "bg-dark" : ""} text-white shadow-lg`}
      style={{
        width: "280px",
        height: "100vh",
        position: "fixed",
        top: 60,
        left: 0,
        backgroundColor: theme === "dark" ? "transparent" : primaryColor,
        backgroundImage: theme === "dark" 
          ? "url('https://img.freepik.com/photos-premium/forets-sombres-photo-gratuite-fond-hd_915071-137396.jpg?ga=GA1.1.2098590446.1713605495&semt=ais_hybrid')" 
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: theme === "dark" ? "blur(5px)" : "none",
        transition: "all 0.3s ease",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Nav className="flex-column gap-2">
        <Nav.Link href="/admin-dashboard" className="text-white" style={{ backgroundColor: color }}>
          📊 {safeTexts.dashboard} {/* Utilisation de safeTexts */}
        </Nav.Link>
        <Nav.Link href="/register" className="text-white" style={{ backgroundColor: color }}>
          👥 {safeTexts.personnelManagement} {/* Utilisation de safeTexts */}
        </Nav.Link>
        <Nav.Link href="/reports" className="text-white" style={{ backgroundColor: color }}>
          📋 {safeTexts.reportsStatistics} {/* Utilisation de safeTexts */}
        </Nav.Link>
      </Nav>

      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
        Version 2.0.0 • E-Santé Dashboard
      </Typography>
    </div>
  );
};



const Header = ({ theme, toggleTheme, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [color, setColor] = useState("#1e90ff"); // Couleur par défaut
  const [language, setLanguage] = useState("fr"); // Valeur par défaut en français
  const [texts, setTexts] = useState(translations[language]); // Initialisation des textes

  useEffect(() => {
    setTexts(translations[language]); // Met à jour les textes selon la langue sélectionnée
  }, [language]); // Réexécute l'effet chaque fois que la langue change

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSettingChange = () => {
    setShowSettings(false); // Vous pouvez ajouter plus de logique ici si nécessaire
  };

  const buttonStyle = {
    backgroundColor: color,
    borderColor: color,
    color: "#fff",
  };

  return (
    <>
      <Navbar
        expand="lg"
        style={{
          zIndex: 1030,
          position: "fixed",
          top: 0,
          width: "100vw",
          background: theme === "dark" ? "#1c1c1c" : "#007bff",
          padding: "10px 20px",
        }}
      >
        <Navbar.Brand href="#" className="text-white fw-bold">
          E-Santé 🩺🤍
        </Navbar.Brand>
        <Form className="d-flex ms-auto align-items-center">
          <Form.Control
            type="search"
            placeholder={texts.searchPlaceholder}
            className="me-2"
            size="sm"
            style={{ borderRadius: "40px", border: "1px solid #ccc" }}
          />
          <Button variant="light" size="sm" style={{ borderRadius: "50%" }}>
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Form>
        <div className="d-flex align-items-center ms-3">
          <FontAwesomeIcon icon={faBell} className="text-white mx-2" />
          <FontAwesomeIcon
            icon={faCog}
            className="text-white mx-2"
            onClick={toggleSettings}
            style={{ cursor: "pointer" }}
          />
          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              id="profileMenu"
              className="d-flex align-items-center"
              style={buttonStyle} // Applique la couleur sélectionnée
            >
              <FontAwesomeIcon icon={faUser} className="me-2" /> 👑 Administrateur
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item href="/profil">{texts.profile}</Dropdown.Item>
              <Dropdown.Item onClick={toggleSettings}>{texts.settings}</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="logout" className="text-danger" onClick={onLogout}>
                🚪 {texts.logout}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button
            onClick={toggleTheme}
            className="ms-2"
            style={{
              ...buttonStyle,
              borderRadius: "20px",
            }}
          >
            {theme === "dark" ? "🌞 Mode Clair" : "🌙 Mode Sombre"}
          </Button>
        </div>
      </Navbar>

      {showSettings && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            right: "20px",
            width: "400px", // Taille du carré
            padding: "20px",
            backgroundColor: "rgba(169, 169, 169, 0.7)", // Gris transparent
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Ombre subtile
            borderRadius: "15px", // Bordures arrondies
            zIndex: 1040,
            overflowY: "auto",
            maxHeight: "80vh",
            backdropFilter: "blur(10px)", // Effet de flou
          }}
        >
          <h5>🛠️ Configuration du Dashboard</h5>
          <div>
            <label>Taille de police globale :</label>
            <input
              type="number"
              className="form-control"
              placeholder="16"
            />
          </div>
          <div className="mt-2">
            <label>Couleur :</label>
            <input
              type="color"
              className="form-control form-control-color"
              value={color}
              onChange={(e) => setColor(e.target.value)} // Met à jour la couleur
            />
          </div>
          <div className="mt-2">
            <label>Langue :</label>
            <select onChange={handleLanguageChange} value={language} className="form-select w-auto">
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <Divider sx={{ my: 2 }} />
          <Button variant="outline-primary" onClick={handleSettingChange}>Appliquer</Button>
        </div>
      )}
    </>
  );
};

// ✅ Paramètres Section
const Settings = () => (
  <div style={{ padding: "20px", backgroundColor: "#f0f0f0", borderRadius: "8px", position: "fixed" }}>
    <h3>Voir nos options de tableau de bord</h3>
    <p>Paramètres de tableau de bord et autres options seront affichés ici.</p>
    <div className="mt-2">
    <label>Taille de police globale :</label>
    <input
      type="number"
      className="form-control"
      value={sliderValue}
      onChange={handleSliderChange} // Met à jour la taille de police globale
    />
  </div>
    {/* Ajouter les options de configuration ici */}
  </div>
);

const Decor = ({ theme, primaryColor }) => {
  console.log("Theme:", theme); // ✅ Vérification du thème dans la console

  // Définir les styles en fonction du thème
  const isDark = theme === "dark";
  const textColor = isDark ? "#fff" : "#000";
  const backgroundColor = isDark ? "#1c1c1c" : primaryColor;
  const secondaryTextColor = isDark ? "#ddd" : "#333";
  const imageFilter = isDark ? "brightness(0.8)" : "brightness(1)";

  return (
    <div 
      className="decor-container mb-2"
      style={{
        backgroundColor,
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
        color: textColor,
        animation: "fadeIn 1s ease",
        marginTop: "60px",
        marginLeft: "200px"
      }}
    >
      <h2 style={{
        fontWeight: "bold",
        fontSize: "26px",
        color: textColor
      }}>
        👋 Bienvenue dans votre Tableau de Bord, Administrateur ! 🎉
      </h2>
      <p style={{ color: secondaryTextColor }}>
        Nous sommes ravis de vous accueillir dans l’espace de gestion dédié à 
        <strong> l’amélioration des services </strong> et au <strong> suivi des Patients </strong>. 
        Vous avez maintenant toutes les clés pour superviser, gérer et optimiser les demandes avec efficacité. 🚀
      </p>

      <div className="d-flex justify-content-center mt-3">
        {[
          "https://images.unsplash.com/photo-1544717302-de2939b7ef71",
          "https://plus.unsplash.com/premium_photo-1661286622480-0ac245ec4e0d",
          "https://plus.unsplash.com/premium_photo-1661284892684-a100a0889fd9"
        ].map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Illustration ${index + 1}`}
            className="rounded shadow-lg mx-2"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              transition: "transform 0.3s",
              filter: imageFilter
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          />
        ))}
      </div>
    </div>
  );
};


const handleLanguageChange = (event) => {
  setLanguage(event.target.value);
  localStorage.setItem("language", event.target.value); // Sauvegarde la langue pour persistance
};

// ✅ Gestion du Personnel Component
const GestionPersonnel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche

  
  useEffect(() => {
    axios
      .get("/api/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Erreur lors de la récupération des utilisateurs.");
        setLoading(false);
      });
      
      
  }, []);
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setTexts(translations[savedLanguage]);
    }
  }, []);
  
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Filtrer par nom
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrer par email
    );
  });

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="my-5">{error}</Alert>;

  return (
    <Container fluid style={{ marginLeft: "250px", padding: "20px", backgroundColor }}>
  
      <Card>
        <Card.Body>
          <Form className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="sm"
            />
          </Form>
          <Table striped bordered hover responsive>
            <thead style={{ backgroundColor: primaryColor, color: "#fff" }}>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Date de Naissance</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.tel}</td>
                  <td>{user.adresse}</td>
                  <td>{user.date_naissance}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};


// ✅ Liste des avis des patients
const AvisList = () => {
  const [avis, setAvis] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
    .get("http://127.0.0.1:8000/api/avis/stats")
    .then((response) => {
      setStats(response.data);
      setLoading(false); // Fin du chargement
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des statistiques : ", error);
      setError("Erreur lors de la récupération des statistiques.");
      setLoading(false); // Fin du chargement malgré l'erreur
    });

    axios
      .get("http://127.0.0.1:8000/api/avis/stats")
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Erreur lors de la récupération des statistiques.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Chargement des avis...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="my-5">{error}</Alert>;
  }

  return (
    <div className="container mt-4">
      <h2>Liste des Avis des Patients</h2>
      {stats && (
     <Card
     className="mb-4"
     style={{
      backgroundColor: "#f0f0f0", // Couleur de fond pour la section des statistiques
      padding: "15px", // Réduction de l'espace intérieur
      borderRadius: "5px",
      marginTop: "10px", // Espacement entre le titre et la carte
      textAlign: "left", // Aligner le texte à gauche
      backgroundPosition: "right", // Aligner l'arrière-plan à droite (si vous avez une image d'arrière-plan)
      backgroundSize: "cover", // Couvrir toute la section
      width: "60%", // Réduire la largeur de la carte (peut être ajusté selon le besoin)
      marginLeft: "auto", // Centrer la carte horizontalement
      marginRight: "auto", // Centrer la carte horizontalement
    }}
   >
          <Card.Body>
            <h3>Statistiques des Avis</h3>
             <h3 style={{ fontSize: "10px" }}>Statistiques des Avis</h3>
             <ul style={{ fontSize: "14px", lineHeight: "1.3", marginBottom: "10px" }}>
 
              <li>Total des avis : {stats.totalAvis}</li>
              <li>Avis positifs : {stats.totalPositifs}</li>
              <li>Avis négatifs : {stats.totalNegatifs}</li>
              <li>Taux de satisfaction : {stats.tauxSatisfaction}%</li>
              <li>Taux de mécontentement : {stats.tauxMecontentement}%</li>
            </ul>
          </Card.Body>
        </Card>
      )}

      <Table striped bordered hover responsive>
        <thead style={{ backgroundColor: "#1e90ff", color: "#fff" }}>
          
        </thead>
        <tbody>
          {avis.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nom}</td>
              <td>{item.commentaire}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

// ✅ Main Component
const AdminDashboard = () => {
  const [theme, setTheme] = useState("light");
  const [showSettings, setShowSettings] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme === "dark" ? "theme-dark" : "theme-light";
  };
  

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    // Appliquer la taille de police à l'ensemble de la page
    document.documentElement.style.fontSize = `${newValue}%`;
  };
   

  // Fonction pour la déconnexion
  const handleLogout = () => {
    // Logique de déconnexion (par exemple, réinitialiser le token d'authentification)
    alert("Déconnexion réussie!");
  };

  return (
    <div className={`page-container ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
       <Decor theme={theme} primaryColor={primaryColor} /> {/* ✅ Passé correctement */}
      <Sidebar theme={theme} />
      <Header theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
      <main className={`content ${theme === "dark" ? "dark-content" : "light-content"}`}>
        <GestionPersonnel />
      
        <AvisList />
      </main>
    </div>
  );
  
  
};
  


ReactDOM.createRoot(document.getElementById("app")).render(<AdminDashboard />);
