import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';

function CapsuleSante() {
  // États
  const [rdv, setRdv] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capsuleState, setCapsuleState] = useState('normal');
  const [isListening, setIsListening] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');

  // Références
  const audioRef = useRef(null);
  const { speak, cancel } = useSpeechSynthesis();
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setUserQuestion(result);
      handleUserQuestion(result);
    },
  });

  // Base de connaissances médicale améliorée
  const medicalKnowledge = {
    "prise de sang": {
      keywords: ["prise sang", "analyse sang", "prélèvement sanguin", "test sanguin"],
      réponse: "Pour une prise de sang, il est généralement recommandé d'être à jeun depuis 8 à 12 heures. Évitez aussi de fumer ou de faire du sport avant l'examen.",
      conseil: "N'oubliez pas d'apporter votre ordonnance et votre carte vitale !"
    },
    "radiographie": {
      keywords: ["radio", "rayons x", "radiologie", "scanner"],
      réponse: "Pour une radiographie standard, aucune préparation particulière n'est nécessaire. Retirez simplement les objets métalliques de la zone à examiner.",
      conseil: "Signalez si vous êtes enceinte ou pensez l'être."
    },
    "irm": {
      keywords: ["imagerie résonance magnétique", "scanner irm"],
      réponse: "Pour une IRM, retirez tous les objets métalliques. Signalez au personnel si vous avez des implants métalliques ou un pacemaker.",
      conseil: "L'examen peut être bruyant, on vous proposera peut-être des bouchons d'oreilles."
    },
    "coloscopie": {
      keywords: ["colonoscopie", "examen colon"],
      réponse: "La coloscopie nécessite une préparation intestinale 24h avant. Suivez strictement les instructions données par votre médecin.",
      conseil: "Prévoyez de rester à domicile le jour de la préparation."
    },
    "vaccin": {
      keywords: ["vaccination", "injection vaccin"],
      réponse: "Avant une vaccination, signalez toute allergie ou problème de santé. Il n'y a généralement pas besoin d'être à jeun.",
      conseil: "Restez 15 minutes sur place après l'injection pour surveillance."
    },
    "consultation": {
      keywords: ["rdv", "rendez-vous", "visite médicale"],
      réponse: "Pour votre consultation, arrivez 10 minutes à l'avance avec vos documents médicaux.",
      conseil: "Préparez la liste de vos médicaments et questions pour le médecin."
    },
    "default": {
      réponse: "Je n'ai pas bien compris votre demande. Pouvez-vous reformuler ou poser une question plus précise ?",
      conseil: "Je peux vous renseigner sur votre rendez-vous ou des examens médicaux courants."
    }
  };

  // Chargement des données
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/prochain-rdv', { 
          withCredentials: true 
        });
        
        if (response.data) {
          setRdv(response.data);
          setShowAssistant(true);
          setTimeout(() => setIsOpen(true), 1000);
          generatePersonalizedMessage(response.data);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setErreur("Impossible de charger les données.");
      }
    };

    fetchAppointment();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      cancel();
    };
  }, []);

  // Génération de message personnalisé
  const generatePersonalizedMessage = (data) => {
    setIsAnalyzing(true);
    
    const now = new Date();
    const rdvDate = new Date(`${data.date}T${data.heure}`);
    const timeDiff = rdvDate - now;
    const daysUntil = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    let state = 'normal';
    let messages = {
      normal: [
        `Bonjour, votre rendez-vous est prévu le ${data.date} à ${data.heure} avec ${data.medecin}.`,
        `Bonjour, je vois votre consultation avec ${data.medecin} le ${data.date}.`
      ],
      happy: [
        `Super nouvelle! Votre rdv avec ${data.medecin} est bientôt! Préparez vos questions.`,
        `😊 Tout est en ordre pour votre consultation du ${data.date}!`
      ],
      urgent: [
        `⚠️ Attention! Votre rdv urgent est demain! Pensez à vos symptômes.`,
        `🔔 Urgent! Consultation avec ${data.medecin} très bientôt!`
      ]
    };
  
    // Déterminer l'état en fonction du nombre de jours restants
    if (daysUntil <= 1) {
      state = 'urgent';
    } else if (daysUntil <= 7) {
      state = 'happy';
    } else {
      state = 'normal';
    }
  
    // Cas spécial pour les rendez-vous très éloignés (plus de 30 jours)
    if (daysUntil > 30) {
      messages.normal = [
        `Votre rendez-vous avec ${data.medecin} est programmé pour le ${data.date}.`,
        `Votre consultation du ${data.date} est bien enregistrée.`
      ];
      state = 'normal';
    }
  
    setCapsuleState(state);
  
    const randomMsg = messages[state][Math.floor(Math.random() * messages[state].length)];
    const fullMessage = `${randomMsg} ${data.conseil || ''}`;
    
    setAiResponse(fullMessage);
    setIsAnalyzing(false);
    return fullMessage;
  };

  // Lecture vocale
  const speakMessage = (message) => {
    if (!message) return;
    
    setIsSpeaking(true);
    setUserQuestion('');
    
    speak({
      text: message,
      voice: window.speechSynthesis.getVoices().find(v => v.lang === 'fr-FR') || null,
      rate: 0.9,
      pitch: 1,
      onEnd: () => setIsSpeaking(false)
    });
  };

  // Gestion améliorée des questions utilisateur
  const handleUserQuestion = (question) => {
    if (!question) return;
  
    setIsAnalyzing(true);
    const q = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliser le texte
  
    // 1. Vérifier les questions sur le rendez-vous
    if (/heure|quand|date|jour/.test(q)) {
      const response = `Votre rendez-vous est prévu le ${rdv?.date} à ${rdv?.heure}.`;
      setAiResponse(response);
      setIsAnalyzing(false);
      speakMessage(response);
      return;
    }
  
    if (/médecin|docteur|dr|medecin/.test(q)) {
      const response = `Votre médecin est le docteur ${rdv?.medecin}.`;
      setAiResponse(response);
      setIsAnalyzing(false);
      speakMessage(response);
      return;
    }
  
    if (/lieu|adresse|où|endroit/.test(q)) {
      const response = "Votre rendez-vous a lieu à la clinique principale, bâtiment A, au 15 rue de la Santé.";
      setAiResponse(response);
      setIsAnalyzing(false);
      speakMessage(response);
      return;
    }
  
    if (/annuler|changer|reporter|déplacer/.test(q)) {
      const response = "Pour modifier votre rendez-vous, contactez le secrétariat au 01 23 45 67 89.";
      setAiResponse(response);
      setIsAnalyzing(false);
      speakMessage(response);
      return;
    }
  
    // 2. Recherche dans la base de connaissances
    let foundTerm = null;
    Object.entries(medicalKnowledge).forEach(([term, data]) => {
      const keywords = [term, ...(data.keywords || [])];
      if (keywords.some(keyword => q.includes(keyword))) {
        foundTerm = term;
      }
    });
  
    if (foundTerm) {
      const response = medicalKnowledge[foundTerm];
      const fullResponse = `${response.réponse} ${response.conseil ? 'Conseil : ' + response.conseil : ''}`;
      setAiResponse(fullResponse);
      setIsAnalyzing(false);
      speakMessage(fullResponse);
      return;
    }
  
    // 3. Réponse intelligente par défaut
    const defaultResponses = [
      "Je n'ai pas bien compris votre question. Pouvez-vous la reformuler ?",
      "Je peux vous renseigner sur votre rendez-vous ou sur des examens médicaux courants.",
      `Pour des questions spécifiques, contactez le ${rdv?.medecin || 'votre médecin'}.`,
      "Posez-moi une question sur votre rendez-vous ou sur des examens comme une prise de sang, une radiographie, etc."
    ];
    
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    setAiResponse(randomResponse);
    setIsAnalyzing(false);
    speakMessage(randomResponse);
  };

  // Démarrer/arrêter l'écoute
  const toggleListening = () => {
    if (isListening) {
      stop();
      setIsListening(false);
    } else {
      setUserQuestion('Je vous écoute...');
      listen({ 
        lang: 'fr-FR',
        interimResults: false,
        continuous: false,
        maxAlternatives: 1
      });
      setIsListening(true);
    }
  };

  // Styles dynamiques
  const assistantStyles = {
    normal: {
      background: "linear-gradient(135deg, #3b82f6, #6366f1)",
      emoji: "😊"
    },
    happy: {
      background: "linear-gradient(135deg, #10b981, #34d399)",
      emoji: "😄"
    },
    urgent: {
      background: "linear-gradient(135deg, #f59e0b, #ef4444)",
      emoji: "😟"
    },
    listening: {
      background: "linear-gradient(135deg, #ec4899, #d946ef)",
      emoji: "👂"
    }
  };

  // Styles complets
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    assistantContainer: {
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      zIndex: 1001,
    },
    assistant: {
      width: '120px',
      height: '120px',
      background: isListening 
        ? assistantStyles.listening.background 
        : assistantStyles[capsuleState].background,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    speechBubble: {
      position: 'absolute',
      bottom: '100%',
      right: '50%',
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '12px 16px',
      width: '250px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      marginBottom: '15px',
      transform: 'translateX(50%)',
      fontSize: '14px',
      textAlign: 'center',
    },
    triangle: {
      position: 'absolute',
      bottom: '-10px',
      right: '50%',
      transform: 'translateX(50%)',
      width: 0,
      height: 0,
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderTop: '10px solid white',
    },
    controls: {
      position: 'absolute',
      bottom: '-45px',
      right: '50%',
      transform: 'translateX(50%)',
      display: 'flex',
      gap: '10px',
    },
    controlBtn: {
      background: isListening ? '#ec4899' : '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      fontSize: '16px'
    },
    aiStatus: {
      position: 'absolute',
      top: '-30px',
      right: '0',
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500'
    },
    questionText: {
      marginTop: '10px',
      fontStyle: 'italic',
      color: '#666',
      fontSize: '13px'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: '#6b7280'
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    fullDetails: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    fullCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      position: 'relative'
    },
    fullCloseBtn: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280'
    },
    detailItem: {
      display: 'flex',
      marginBottom: '12px'
    },
    detailLabel: {
      fontWeight: '600',
      width: '100px',
      color: '#374151'
    },
    detailValue: {
      color: '#1f2937',
      flex: 1
    },
    conseil: {
      backgroundColor: '#f0fdf4',
      padding: '12px',
      borderRadius: '8px',
      marginTop: '20px',
      color: '#166534'
    }
  };

  return (
    <div style={styles.container}>
      {/* Assistante IA améliorée */}
      <AnimatePresence>
        {showAssistant && (
          <motion.div
            style={styles.assistantContainer}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotate: isSpeaking ? [0, -3, 3, 0] : 0
            }}
            transition={{ 
              duration: 0.4,
              rotate: isSpeaking ? {
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut"
              } : {}
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            {isAnalyzing && (
              <div style={styles.aiStatus}>
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {listening ? "Je vous écoute..." : "Analyse en cours..."}
                </motion.span>
              </div>
            )}

            <div style={styles.speechBubble}>
              {isSpeaking ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      style={{
                        display: 'inline-block',
                        width: '5px',
                        height: '5px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        margin: '0 3px'
                      }}
                      animate={{
                        y: [0, -5, 0],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                  <span style={{ marginLeft: '8px' }}>Je parle...</span>
                </div>
              ) : (
                <>
                  {aiResponse || "Bonjour, comment puis-je vous aider ?"}
                  {userQuestion && (
                    <div style={styles.questionText}>
                      <strong>Vous:</strong> {userQuestion}
                    </div>
                  )}
                </>
              )}
              <div style={styles.triangle}></div>
            </div>

            <div style={styles.assistant}>
              <motion.span
                animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                {isListening 
                  ? assistantStyles.listening.emoji
                  : assistantStyles[capsuleState].emoji}
              </motion.span>
              
              {(isSpeaking || isListening) && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '-15px',
                    right: '-15px',
                    bottom: '-15px',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>

            <div style={styles.controls}>
              <motion.button
                style={styles.controlBtn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleListening}
              >
                {isListening ? '🎙️' : '🎤'}
              </motion.button>
              <motion.button
                style={{ 
                  ...styles.controlBtn,
                  background: isSpeaking ? '#10b981' : '#3b82f6'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => speakMessage(aiResponse)}
                disabled={isSpeaking || !aiResponse}
              >
                {isSpeaking ? '🗣️' : '▶️'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vue détaillée du rendez-vous */}
      {rdv && !isOpen && (
        <motion.div
          style={styles.fullDetails}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            style={styles.fullCard}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <button 
              style={styles.fullCloseBtn}
              onClick={() => setIsOpen(true)}
            >
              ×
            </button>
            <h2 style={{ 
              color: '#1e40af', 
              marginBottom: '24px',
              fontSize: '22px',
              fontWeight: '700'
            }}>
              Votre prochain rendez-vous
            </h2>
            
            {erreur && (
              <div style={styles.error}>
                <p>{erreur}</p>
              </div>
            )}
            
            <div style={styles.detailItem}>
              <span style={{ ...styles.detailLabel, color: '#6b7280' }}>Date :</span>
              <span style={styles.detailValue}>{rdv.date}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={{ ...styles.detailLabel, color: '#6b7280' }}>Heure :</span>
              <span style={styles.detailValue}>{rdv.heure}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={{ ...styles.detailLabel, color: '#6b7280' }}>Médecin :</span>
              <span style={styles.detailValue}>{rdv.medecin}</span>
            </div>
            <div style={styles.conseil}>
              <p>{rdv.conseil}</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* État de chargement */}
      {!rdv && !erreur && (
        <div style={styles.loading}>
          <motion.div
            style={{
              width: '24px',
              height: '24px',
              border: '3px solid rgba(59, 130, 246, 0.2)',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              marginRight: '12px'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span>Chargement de vos informations...</span>
        </div>
      )}
    </div>
  );
}

export default CapsuleSante;