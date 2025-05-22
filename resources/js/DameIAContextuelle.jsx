import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function DameIAContextuelle({ visible, message, onClose, type = 'info' }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Couleurs selon le type d'alerte
  const typeColors = {
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    success: '#10b981'
  };

  useEffect(() => {
    if (visible && message && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'fr-FR';
      utterance.pitch = 1.1;
      utterance.rate = 0.9;
      
      setIsSpeaking(true);
      speechSynthesis.speak(utterance);
      
      utterance.onend = () => {
        setIsSpeaking(false);
        // Disparaît automatiquement après 8 secondes
        setTimeout(onClose, 8000);
      };
    }
    
    return () => {
      speechSynthesis.cancel();
    };
  }, [visible, message, onClose]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        style={{
          ...styles.overlay,
          borderLeft: `5px solid ${typeColors[type] || typeColors.info}`
        }}
      >
        <div style={styles.container}>
          <motion.img 
            src="https://i.pinimg.com/originals/9d/d5/4c/9dd54cab3b383726be62b529406f8328.gif" 
            alt="Dame IA" 
            style={styles.image}
            animate={{
              scale: isSpeaking ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: isSpeaking ? Infinity : 0
            }}
          />
          <div style={styles.textBox}>
            <p style={styles.text}>{message}</p>
            <div style={styles.actions}>
              <button 
                onClick={() => {
                  speechSynthesis.cancel();
                  onClose();
                }} 
                style={styles.button}
              >
                Fermer
              </button>
              <button 
                onClick={() => {
                  speechSynthesis.cancel();
                  const utterance = new SpeechSynthesisUtterance(message);
                  utterance.lang = 'fr-FR';
                  speechSynthesis.speak(utterance);
                }} 
                style={{...styles.button, backgroundColor: '#94a3b8'}}
              >
                Répéter
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 10000,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '15px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    maxWidth: '400px',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(148, 163, 184, 0.2)'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  image: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
    border: '3px solid #3b82f6',
    flexShrink: 0
  },
  textBox: {
    flex: 1,
  },
  text: {
    fontSize: '0.95rem',
    marginBottom: '12px',
    color: '#1e293b',
    fontWeight: '500',
    lineHeight: '1.4'
  },
  button: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: '500',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '0.85rem'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
};

export default DameIAContextuelle;