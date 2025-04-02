import React from 'react';
import { createRoot } from 'react-dom/client';  // Utilisation de createRoot pour React 18+
import Services from './services';  // Assurez-vous que le nom de fichier correspond à "services.jsx" (avec la bonne casse)
import Apropos from './Apropos';
import Contact from './contact';
import Socials from './socials';

// Création de la racine de l'application et rendu du composant App



import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Carousel, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaHeartbeat, FaRobot, FaShieldAlt } from 'react-icons/fa';  // Import des icônes FontAwesome
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'; // Importer les icônes
import { FaCalendarAlt, FaHospital, FaAmbulance } from 'react-icons/fa'; // Importation des icônes

// Couleur principale
const primaryBlue = '#0096c7';
const hoverBlue = '#00b4d8';

// Contact Section


const Navbar = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark ,container mt-4 pt-3 py-2" style={{ backgroundColor: primaryBlue }}>
        <Link className="navbar-brand" to="/" style={{ color: '#fff' }}>AI-MedCare 🩺🤍</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="#home" style={{ color: '#fff' }}>Accueil</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#services" style={{ color: '#fff' }}>Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact-us" style={{ color: '#fff' }}>About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about-us" style={{ color: '#fff' }}>Contact</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  const HeroSection = () => {
    return (
      <section
        id="home"
        className="hero-section text-center"
        style={{ padding: '50px 0', backgroundColor: '#f3f4f6', marginBottom: '0' }}  // Réduit le padding et la marge
      >
        <h2>Bienvenue sur notre plateforme AI-MedCare !</h2>
        <p className="lead">Votre santé, notre priorité. Connectez-vous et accédez à des soins de qualité.</p>

        <Button
          variant="primary"
          size="lg"
          onClick={() => window.location.href = '/login'}
          style={{
            backgroundColor: primaryBlue,
            borderColor: primaryBlue,
            transition: 'all 0.3s ease',
            marginRight: '10px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = hoverBlue}
          onMouseOut={(e) => e.target.style.backgroundColor = primaryBlue}
        >
          Se connecter
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={() => window.location.href = '/register'}
          style={{
            backgroundColor: primaryBlue,
            borderColor: primaryBlue,
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = hoverBlue}
          onMouseOut={(e) => e.target.style.backgroundColor = primaryBlue}
        >
          S'inscrire
        </Button>
      </section>
    );
  };

const CustomCarousel = () => {
  return (
    <Carousel interval={3000} controls={false} indicators={false} pause={false}>
      <Carousel.Item>
        <img src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
             className="d-block w-100"
             alt="Slide 1"
             style={{ maxHeight: '400px', objectFit: 'cover' }} />
        <Carousel.Caption style={{ color: 'black', padding: '10px' }}>
          <h3>La santé à portée de clic</h3>
          <p> Prenez votre rendez-vous médical en toute simplicité.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://plus.unsplash.com/premium_photo-1674499074492-79b65f80f59d?q=80&w=2069&auto=format&fit=crop"
             className="d-block w-100"
             alt="Slide 2"
             style={{ maxHeight: '400px', objectFit: 'cover' }} />
        <Carousel.Caption style={{ color: 'white', padding: '10px' }}>
          <h3>Gérez votre santé</h3>
          <p> En toute confiance, avec des médecins à votre écoute.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://sante-pratique-paris.fr/wp-content/uploads/2018/12/sante-jeannelight-adobestock-201932606.jpg"
             className="d-block w-100"
             alt="Slide 3"
             style={{ maxHeight: '400px', objectFit: 'cover' }} />
        <Carousel.Caption style={{ color: 'white', padding: '5px' }} >
          <h3>Prendre soin de vous</h3>
          <p> C’est notre engagement. Accédez à des consultations rapides et sécurisées</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};


const ServicesSection = () => {
  return (
    <section id="services" className="container my-5 py-5" style={{ backgroundColor: '#f9f9f9' }}>
      <div className="row text-center">
        {[{
          title: "Calendrier du médecin",
          text: "Agenda des consultations d’un médecin, planning de l’activité d’un cabinet médical.",
          icon: <FaCalendarAlt size={60} style={{ color: '#007bff' }} />
        }, {
          title: "Cabinet médical de haute qualité",
          text: "Une consultation immédiate des dossiers indépendamment du lieu où se situe le médecin.",
          icon: <FaHospital size={60} style={{ color: '#28a745' }} />
        }, {
          title: "Cas d’urgence",
          text: "L’application AI-MedCare permet de sauver des vies humaines grâce à sa simplicité, mobilité et rapidité.",
          icon: <FaAmbulance size={60} style={{ color: '#dc3545' }} />
        }].map((service, index) => (
          <div className="col-12 col-md-4 mb-4" key={index}>
            <div
              className="service-card shadow-lg rounded-3 p-4"
              style={{
                transition: 'transform 0.3s ease',
                border: 'none',
                backgroundColor: '#fff',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              <div className="service-icon mb-3">
                {service.icon}
              </div>
              <h5 className="fw-bold mb-3" style={{ color: '#333' }}>{service.title}</h5>
              <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
                {service.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};



const AboutUsSection = () => {
    return (
      <section
        id="about-us"
        className="py-5 text-center"
        style={{
          backgroundColor: '#f3f4f6',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          marginTop: '30px', // Ajusté pour plus de cohérence avec les autres sections
          paddingTop: '50px', // Ajusté pour être plus uniforme
          paddingBottom: '50px', // Ajusté pour être plus uniforme
        }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>À propos de nous</h2>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6',
            paddingBottom: '30px',
          }}
        >
          AI-MedCare est une plateforme dédiée à améliorer l'accès aux soins médicaux grâce à l'innovation et à l'intelligence artificielle.
          Nous nous engageons à offrir des services médicaux de qualité accessibles et sécurisés.
        </p>

        <div
          className="icons-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '30px',
          }}
        >
          <div
            className="icon-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '30px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <FaHeartbeat size={50} style={{ color: '#FF6347' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Soins Médicaux</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>Nous assurons des soins médicaux de qualité pour votre bien-être.</p>
          </div>

          <div
            className="icon-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '30px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <FaRobot size={50} style={{ color: '#4682B4' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Innovation AI</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>Nous utilisons l'intelligence artificielle pour améliorer l'accès aux soins.</p>
          </div>

          <div
            className="icon-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '30px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <FaShieldAlt size={50} style={{ color: '#32CD32' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Sécurité</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>Nous garantissons la sécurité et la confidentialité de vos données personnelles.</p>
          </div>
        </div>
      </section>
    );
  };

  const ContactUsSection = () => {
    return (
      <section
        id="contact-us"
        className="py-5 text-center"
        style={{
          backgroundColor: '#f3f4f6',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          marginTop: '30px', // Aligné avec la section "À propos de nous"
          paddingTop: '50px', // Uniforme avec "À propos de nous"
          paddingBottom: '50px', // Uniforme avec "À propos de nous"
        }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>Contactez-nous</h2>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6',
            paddingBottom: '30px',
          }}
        >
          Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter via les moyens suivants :
        </p>

        <div
          className="contact-icons"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '30px',
          }}
        >
          {/* Icône Email */}
          <a
            href="mailto:contact@ai-medcare.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#007bff'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <FaEnvelope size={50} style={{ color: '#007bff' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Email</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>contact@ai-medcare.com</p>
          </a>

          {/* Icône WhatsApp */}
          <a
            href="https://wa.me/1234567890" // Remplace le numéro par celui de ton WhatsApp
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#25D366'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <FaWhatsapp size={50} style={{ color: '#25D366' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>WhatsApp</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>Cliquez pour discuter</p>
          </a>

          {/* Icône Téléphone */}
          <a
            href="tel:+1234567890" // Remplace par ton numéro de téléphone
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#28a745'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <FaPhoneAlt size={50} style={{ color: '#28a745' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Téléphone</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>Appelez-nous directement</p>
          </a>
        </div>
        <div
          className="contact-icons"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '30px',
          }}
        >
          {/* Icône Email */}
          <a
            href="mailto:contact@ai-medcare.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#007bff'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <FaEnvelope size={50} style={{ color: '#007bff' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Email</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>contact@ai-medcare.com</p>
          </a>

          {/* Icône WhatsApp */}
          <a
            href="https://wa.me/1234567890" // Remplace le numéro par celui de ton WhatsApp
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#25D366'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <FaWhatsapp size={50} style={{ color: '#25D366' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>WhatsApp</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>Cliquez pour discuter</p>
          </a>

          {/* Icône Téléphone */}
          <a
            href="tel:+1234567890" // Remplace par ton numéro de téléphone
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#28a745'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <FaPhoneAlt size={50} style={{ color: '#28a745' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Téléphone</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>Appelez-nous directement</p>
          </a>
        </div>
        <div
          className="contact-icons"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '30px',
          }}
        >
          {/* Icône Email */}
          <a
            href="mailto:contact@ai-medcare.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#007bff'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <FaEnvelope size={50} style={{ color: '#007bff' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Email</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>contact@ai-medcare.com</p>
          </a>

          {/* Icône WhatsApp */}
          <a
            href="https://wa.me/1234567890" // Remplace le numéro par celui de ton WhatsApp
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#25D366'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <FaWhatsapp size={50} style={{ color: '#25D366' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>WhatsApp</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>Cliquez pour discuter</p>
          </a>

          {/* Icône Téléphone */}
          <a
            href="tel:+1234567890" // Remplace par ton numéro de téléphone
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#28a745'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <FaPhoneAlt size={50} style={{ color: '#28a745' }} />
            <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Téléphone</h4>
            <p style={{ fontSize: '1rem', color: '#555' }}>Appelez-nous directement</p>
          </a>
        </div>
      </section>
    );
  };


const HomePage = () => (
  <div>
    <HeroSection />
    <CustomCarousel />


  </div>
);

const LoginPage = () => (
  <div>
    <h1>Page de Connexion</h1>
    <p>Formulaire de connexion à ajouter ici.</p>
  </div>
);

const RegisterPage = () => (
  <div>
    <h1>Page d'Inscription</h1>
    <p>Formulaire d'inscription à ajouter ici.</p>
  </div>
);


const Verification = () => (
  <div>
    <h1>Page d'Inscription</h1>
    <p>Code de vérification ici.</p>
  </div>
);

const App = () => {
    return (
      <Router>


         <Navbar />




          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verification" element={<Verification />} />
          </Routes>
          <Services />
          <Apropos/>
          <Contact/>
          <Socials/>



      </Router>
    );
  };

const root = createRoot(document.getElementById('app'));
root.render(<App />);