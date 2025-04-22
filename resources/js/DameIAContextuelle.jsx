import React, { useEffect } from 'react';

function DameIAContextuelle({ visible, message, onClose }) {
  useEffect(() => {
    if (visible && message && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'fr-FR';
      utterance.pitch = 1.2;
      utterance.rate = 1;
      speechSynthesis.speak(utterance);
    }
  }, [visible, message]);

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <img 
          src="https://i.ibb.co/Z6V5Ycn/secretaire-ai.png" 
          alt="Dame IA" 
          style={styles.image}
        />
        <div style={styles.textBox}>
          <p style={styles.text}>{message}</p>
          <button onClick={onClose} style={styles.button}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 10000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    maxWidth: '420px',
    animation: 'fadeIn 0.5s ease-in-out',
    backdropFilter: 'blur(6px)',
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-wall-3.png")',
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
    border: '3px solid #3b82f6'
  },
  textBox: {
    flex: 1,
  },
  text: {
    fontSize: '1rem',
    marginBottom: '10px',
    color: '#1e293b',
    fontWeight: '500',
    lineHeight: '1.4'
  },
  button: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(59,130,246,0.4)'
  }
};

export default DameIAContextuelle;
