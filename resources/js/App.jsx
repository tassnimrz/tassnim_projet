import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Carousel, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Couleur principale
const primaryBlue = '#0096c7';
const hoverBlue = '#00b4d8';

// Navbar Component
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: primaryBlue }}>
      <Link className="navbar-brand" to="/">E-Santé 🩺🤍</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Accueil</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/services">Services</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="hero-section text-center" style={{ padding: '100px 0', backgroundColor: '#f3f4f6' }}>
      <h2>Bienvenue sur notre plateforme e-santé !</h2>
      <p className="lead">Gérez vos rendez-vous médicaux en toute simplicité, obtenez des prescriptions et consultez à distance.</p>
      
      {/* Bouton Se connecter */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => window.location.href = '/login'}
        style={{ backgroundColor: primaryBlue, borderColor: primaryBlue, transition: 'all 0.3s ease', marginRight: '10px' }}
        onMouseOver={(e) => e.target.style.backgroundColor = hoverBlue}
        onMouseOut={(e) => e.target.style.backgroundColor = primaryBlue}
      >
        Se connecter
      </Button>

      {/* Bouton S'inscrire */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => window.location.href = '/register'}
        style={{ backgroundColor: primaryBlue, borderColor: primaryBlue, transition: 'all 0.3s ease' }}
        onMouseOver={(e) => e.target.style.backgroundColor = hoverBlue}
        onMouseOut={(e) => e.target.style.backgroundColor = primaryBlue}
      >
        S'inscrire
      </Button>
    </section>
  );
};

// Carousel Section
const CustomCarousel = () => {
  return (
    <Carousel interval={3000} controls={false} indicators={false} pause={false}>
      <Carousel.Item>
        <img src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" alt="Slide 1" />
        <Carousel.Caption>
          <h3>Consultation à Distance</h3>
          <p>Consultez vos médecins à distance pour un service rapide et efficace.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://plus.unsplash.com/premium_photo-1674499074492-79b65f80f59d?q=80&w=2069&auto=format&fit=crop" className="d-block w-100" alt="Slide 2" />
        <Carousel.Caption>
          <h3>Rendez-vous Simplifiés</h3>
          <p>Prendre un rendez-vous n'a jamais été aussi simple avec notre plateforme intuitive.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://images.unsplash.com/photo-1576765608622-067973a79f53?q=80&w=2078&auto=format&fit=crop" className="d-block w-100" alt="Slide 3" />
        <Carousel.Caption>
          <h3>Une Solution Efficace</h3>
          <p>Accédez aux informations médicales en temps réel et optimisez votre gestion de la santé.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

// Services Section
const ServicesSection = () => {
  return (
    <section className="container my-5">
      <div className="row text-center">
        {[{
          title: "📅 Calendrier du médecin", text: "📆 Agenda des consultations d’un médecin, 🏥 planning de l’activité d’un cabinet médical."
        }, {
          title: "🏥 Cabinet médical de haute qualité", text: "📁 Une consultation immédiate des dossiers indépendamment du lieu où se situe le médecin."
        }, {
          title: "🚨 Cas d’urgence", text: "⚡ L’application MonDocteur permet de sauver des vies humaines grâce à sa simplicité, mobilité et sa rapidité."
        }].map((service, index) => (
          <div className="col-md-4" key={index}>
            <Card className="shadow-lg p-4 mb-4" style={{ transition: 'transform 0.3s', border: 'none' }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'} >
              <Card.Body>
                <h5 className="fw-bold">{service.title}</h5>
                <p className="text-muted">{service.text}</p>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

// Pages
const HomePage = () => (
  <div>
    <HeroSection />
    <CustomCarousel />
    <ServicesSection />
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

// App Component
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);
