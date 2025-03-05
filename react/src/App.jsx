import React, { useState } from 'react';
import { Button, Carousel, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Couleur bleue du header (ajustez cette couleur selon le bleu que vous utilisez dans le header)
const primaryBlue = '#0096c7'; // Remplacez cette valeur par la couleur exacte du header
const hoverBlue = '#00b4d8'; // Un bleu plus clair pour l'effet de survol

// Navbar Component
const Navbar = ({ onHomeClick }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: primaryBlue }}>
      <a className="navbar-brand" href="#">E-Santé 🩺🤍</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <button className="nav-link" onClick={onHomeClick}>Accueil</button>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Services</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Contact</a>
          </li>
          <li className="nav-item">
            <a href="/login" className="btn btn-outline-light nav-link">Se connecter</a>
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
      <Button variant="primary" size="lg" href="/register" style={{ backgroundColor: primaryBlue, borderColor: primaryBlue, transition: 'all 0.3s ease' }}
              onMouseOver={(e) => e.target.style.backgroundColor = hoverBlue}
              onMouseOut={(e) => e.target.style.backgroundColor = primaryBlue}>
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
        <img src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Slide 1" />
        <Carousel.Caption>
          <h3>Consultation à Distance</h3>
          <p>Consultez vos médecins à distance pour un service rapide et efficace.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://plus.unsplash.com/premium_photo-1674499074492-79b65f80f59d?q=80&w=2069&auto=format&fit=crop" alt="Slide 2" />
        <Carousel.Caption>
          <h3>Rendez-vous Simplifiés</h3>
          <p>Prendre un rendez-vous n'a jamais été aussi simple avec notre plateforme intuitive.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://images.unsplash.com/photo-1576765608622-067973a79f53?q=80&w=2078&auto=format&fit=crop" alt="Slide 3" />
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
        <div className="col-md-4">
          <Card className="shadow-lg p-4 mb-4" style={{ transition: 'transform 0.3s', border: 'none' }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'} >
            <Card.Body>
              <h5 className="fw-bold">📅 Calendrier du médecin</h5>
              <p className="text-muted">📆 Agenda des consultations d’un médecin, 🏥 planning de l’activité d’un cabinet médical.</p>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-lg p-4 mb-4" style={{ transition: 'transform 0.3s', border: 'none' }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'} >
            <Card.Body>
              <h5 className="fw-bold">🏥 Cabinet médical de haute qualité</h5>
              <p className="text-muted">📁 Une consultation immédiate des dossiers indépendamment du lieu où se situe le médecin.</p>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-lg p-4 mb-4" style={{ transition: 'transform 0.3s', border: 'none' }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'} >
            <Card.Body>
              <h5 className="fw-bold">🚨 Cas d’urgence</h5>
              <p className="text-muted">⚡ L’application MonDocteur permet de sauver des vies humaines grâce à sa simplicité, mobilité et sa rapidité.</p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Home Page
const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CustomCarousel />
      <ServicesSection />
    </div>
  );
};

// App Component
const App = () => {
  const [showHome, setShowHome] = useState(true);

  const handleHomeClick = () => {
    setShowHome(true);
  };

  return (
    <div>
      <Navbar onHomeClick={handleHomeClick} />
      {showHome && <HomePage />}
    </div>
  );
};

export default App;
