import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  // Animation d'apparition pour l'en-tête et les images
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 2000 },
  });

  // Styles en ligne
  const styles = {
    homeContainer: {
      backgroundColor: '#f0f8ff', // Arrière-plan clair
      padding: '50px 0',
    },
    heroSection: {
      marginBottom: '40px',
    },
    heroText: {
      color: '#003366', // Bleu foncé
      fontWeight: 'bold',
    },
    heroParagraph: {
      color: '#666',
      fontSize: '1.2rem',
    },
    imagesSection: {
      marginTop: '30px',
    },
    image: {
      width: '100%',
      height: 'auto',
      transition: 'transform 0.3s ease-in-out',
      borderRadius: '10px',
    },
    imageHover: {
      transform: 'scale(1.05)',
    },
    btnPrimary: {
      backgroundColor: '#003366', // Bleu foncé
      borderColor: '#003366',
    },
    btnPrimaryHover: {
      backgroundColor: '#00509e',
      borderColor: '#00509e',
    },
  };

  return (
    <div style={styles.homeContainer} className="container-fluid">
      {/* Section d'en-tête avec animation */}
      <animated.div style={{ ...fadeIn, ...styles.heroSection }} className="text-center">
        <h1 style={styles.heroText} className="display-4">Bienvenue sur notre plateforme</h1>
        <p style={styles.heroParagraph} className="lead">
          Nous offrons une expérience unique pour gérer vos demandes avec efficacité et simplicité.
        </p>
      </animated.div>

      {/* Section des images avec animation */}
      <div className="row justify-content-center" style={styles.imagesSection}>
        <div className="col-md-5 mb-4">
          <animated.img
            src="https://plus.unsplash.com/premium_photo-1661713490884-73c83570adbf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI5fHx8ZW58MHx8fHx8"
            alt="Image 1"
            style={{ ...styles.image, ...fadeIn }}
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-md-5 mb-4">
          <animated.img
            src="https://plus.unsplash.com/premium_photo-1681966840324-cd04a64b7ac1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8"
            alt="Image 2"
            style={{ ...styles.image, ...fadeIn }}
            className="img-fluid rounded shadow-sm"
          />
        </div>
      </div>

      {/* Section supplémentaire avec un bouton d'appel à l'action */}
      <div className="text-center mt-5">
        <button
          className="btn btn-primary btn-lg"
          style={styles.btnPrimary}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.btnPrimaryHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.btnPrimary.backgroundColor}
        >
          Commencer maintenant
        </button>
      </div>
    </div>
  );
}

export default HomePage;
