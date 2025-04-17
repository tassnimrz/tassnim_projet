import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation  } from 'react-router-dom';
import { Carousel , Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import Apropos from './Apropos';
import Services from './services';
import Contact from './contact';


import Socials from './socials';
// Couleur principale
const primaryBlue = '#0096c7';




const Navbar = () => {
  const location = useLocation();
  const primaryBlue = "#007bff"; // Remplace par ta couleur si nécessaire

  return (
    <nav className="navbar navbar-expand-lg navbar-light m-1 sticky-top" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <a className="navbar-brand" href="/" style={{ color: primaryBlue, fontSize: '24px' }}>
          AI-MedCare 🩺🤍
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item mx-3">
              <a
                className="nav-link"
                href="#home"
                style={{
                  color: location.pathname === '/' ? '#ff6f61' : '#000',
                  fontWeight: location.pathname === '/' ? 'bold' : 'normal',
                  transition: 'color 0.3s ease',
                }}
              >
                Accueil
              </a>
            </li>
            <li className="nav-item mx-3">
              <a
                className="nav-link"
                href="#about-us"
                style={{
                  color: location.pathname === '/about' ? '#ff6f61' : '#000',
                  fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
                }}
              >
                À propos de nous
              </a>
            </li>
            <li className="nav-item mx-3">
              <a
                className="nav-link"
                href="#services"
                style={{
                  color: location.pathname === '/services' ? '#ff6f61' : '#000',
                  fontWeight: location.pathname === '/services' ? 'bold' : 'normal',
                }}
              >
                Services
              </a>
            </li>
            <li className="nav-item mx-3">
              <a
                className="nav-link"
                href="#services"
                style={{
                  color: location.pathname === '/contact' ? '#ff6f61' : '#000',
                  fontWeight: location.pathname === '/contact' ? 'bold' : 'normal',
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
// Carousel personnalisé avec texte animé et boutons
const CustomCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  return (
    <Carousel
      interval={3000}
      controls={false}
      indicators={false}
      pause={false}
      className="w-100"
      activeIndex={currentIndex}
      onSelect={handleSelect}
    >
      {[{
        img: "https://img.freepik.com/premium-photo/happy-smiling-doctor-nurse-with-stethoscope-handsome-young_950002-194047.jpg",
        text: "Prenez votre rendez-vous médical en toute simplicité.\nGérez votre santé en toute confiance.\nPrendre soin de vous, c’est notre engagement.",
        boxes: [
          { title: "Notre Plateforme", content: "Accédez à nos services en ligne, gérez vos rendez-vous et suivez vos consultations." },
          { title: "Notre Cabinet", content: "Nos cabinets sont équipés des technologies les plus récentes pour vous offrir le meilleur soin." },
          { title: "Nos Services", content: "Nous offrons des consultations médicales, des suivis à domicile, et bien plus." }
        ]
      },
      {
        img: "https://qualitymedicalgroup.com/wp-content/uploads/2019/07/bigstock-Portrait-of-cheerful-doctors-t-184651009-1024x680.jpg",
        text: "Prenez votre rendez-vous médical en toute simplicité.\nGérez votre santé en toute confiance.\nPrendre soin de vous, c’est notre engagement.",
        boxes: [
          { title: "Notre Plateforme", content: "Gérez vos données médicales en toute sécurité et avec confidentialité." },
          { title: "Notre Cabinet", content: "Des équipements de dernière génération pour vous offrir des soins optimaux." },
          { title: "Nos Services", content: "Consultations spécialisées, traitements avancés, et bien plus encore." }
        ]
      },
      {
        img: "https://drruscio.com/wp-content/uploads/2019/11/240F221229534paliXicIHQ3xjNxxjHKW44xvaYGXghPL.jpg",
        text: "Prenez votre rendez-vous médical en toute simplicité.\nGérez votre santé en toute confiance.\nPrendre soin de vous, c’est notre engagement.",
        boxes: [
          { title: "Notre Plateforme", content: "Facilitez vos démarches administratives et médicales en ligne." },
          { title: "Notre Cabinet", content: "Un environnement calme et professionnel pour votre confort." },
          { title: "Nos Services", content: "Services de santé spécialisés à la pointe de la technologie." }
        ]
      }
      ].map((slide, index) => (
        <Carousel.Item key={index}>
          <motion.img
            src={slide.img}
            className="d-block w-100"
            alt={`Slide ${index + 1}`}
            style={{
              width: '80%',
              height: 'auto',
              margin: '0 auto',
            }}
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <Carousel.Caption
            className="d-flex flex-column justify-content-start align-items-start"
            style={{ top: '25%', left: '5%' }}
          >
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1 }}
              style={{
                color: 'white',
                textAlign: 'left',
                fontSize: '20px',
                lineHeight: '1.5',
                maxWidth: '80%',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {slide.text.split('\n').map((line, i) => (
                <div key={i} style={{ marginBottom: '15px' }}>
                  {line}
                </div>
              ))}
            </motion.p>

            <div className="d-flex justify-content-start">
              <motion.button
               onClick={() => window.location.href = '/login'}
                className="btn btn-light mx-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{ fontSize: '18px' }}>


    Se connecter
  </motion.button>

  <motion.button
    onClick={() => window.location.href = '/register'}
    className="btn btn-primary mx-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ fontSize: '18px' }}>
    S'inscrire
  </motion.button>
</div>

          </Carousel.Caption>

          <div
            className="d-flex justify-content-center p-3"
            style={{
              position: 'absolute',
              bottom: '0',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              height: '35%',
              boxSizing: 'border-box',
              padding: '20px',
              borderRadius: '0 0 10px 10px',
            }}
          >
            {slide.boxes.map((box, boxIndex) => (
              <motion.div
                key={boxIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + boxIndex * 0.2, duration: 0.5 }}
                style={{
                  width: '30%',
                  margin: '0 10px',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h5>{box.title}</h5>
                <p>{box.content}</p>
              </motion.div>
            ))}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
const Footer = () => {
    return (
      <footer style={{ padding: '5px 0', backgroundColor: '#344', color: '#fff', display: 'flex', justifyContent: 'center', gap: '250px' }}>
        {/* Première liste */}
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><a href="#about" style={{ color: '#fff', textDecoration: 'none' }}>À propos</a></li>
          <li><a href="#services" style={{ color: '#fff', textDecoration: 'none' }}>Services</a></li>
          <li><a href="#home" style={{ color: '#fff', textDecoration: 'none' }}>Acceuil</a></li>
          <li><a href="#contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a></li>
          <li><a href="#privacy" style={{ color: '#fff', textDecoration: 'none' }}>Mentions Légales</a></li>
        </ul>

        {/* Deuxième liste avec titre */}
        <div>
          <h4>Disponibilités</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li>Lundi à Vendredi : 9h00 - 18h00</li>
            <li>Samedi : 10h00 - 14h00</li>
            <li>Dimanche : Fermé</li>
          </ul>
        </div>
      </footer>
    );
  };



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
// Composant App
const App = () => {
  return (
    <Router>
      <div>

        <Socials/>
        <Navbar />
        <div className="container mt-4">
          <Routes>
          <Route path="/" element={<CustomCarousel />} />
          <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verification" element={<Verification />} />
          </Routes>
        </div>
      </div>
     <Apropos/>
     <Services/>
     <Contact/>
     <Footer/>
    </Router>
  );
};



// Rendu de l'application
const root = createRoot(document.getElementById('app'));
root.render(<App />);