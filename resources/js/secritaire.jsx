
import React, { useState, useEffect, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import PatientChart from './PatientChart';
import PatientMap from './PatientMap';
import AlerteSanitaire from './AlerteSanitaire';
import TauxRemplissage from './TauxRemplissage';
import DameIAContextuelle from './DameIAContextuelle';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  HouseDoor, CalendarCheck, People, FileEarmarkMedical,
  Search, List, Sun, Moon, PersonCircle, Globe,
  Plus, Bell, Clock, Clipboard, Capsule, Truck, Activity, GraphUp
} from 'react-bootstrap-icons';

const ThemeContext = createContext();

function ConseilsIA({ theme, onClose }) {
  const [conseils, setConseils] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [statsData, setStatsData] = useState({
    rdv: { count: 0, confirmes: 0, annules: 0 },
    patients: { total: 0, nouveaux: 0 },
    planning: { jours: 0, capacite: 0 },
    avis: { total: 0, satisfaction: 0 }
  });
  const [loading, setLoading] = useState(true);

  const [animationValues, setAnimationValues] = useState({
    rdv: 0,
    patients: 0,
    planning: 0,
    satisfaction: 0
  });
  useEffect(() => {
    const fetchAndSpeakRendezVous = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/rendezvous/aujourdhui');
        console.log('Données RDV du jour:', response.data);
  
        const details = Array.isArray(response.data.details) ? response.data.details : [];
  
        const message = `Bonjour, vous avez ${response.data.count} rendez-vous aujourd'hui, dont ${response.data.confirmes} confirmés et ${response.data.annules} annulés.`;
  
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.95;
  
        speechSynthesis.speak(utterance);
  
      } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
      }
    };
  
    fetchAndSpeakRendezVous();
  }, []);
  

  useEffect(() => {
    const animateValues = (targetValues) => {
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setAnimationValues({
          rdv: Math.round(progress * targetValues.rdv),
          patients: Math.round(progress * targetValues.patients),
          planning: Math.round(progress * targetValues.planning),
          satisfaction: Math.round(progress * targetValues.satisfaction)
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    };

    if (statistiques) {
      animateValues({
        rdv: statistiques.rdvAujourdhui,
        patients: statistiques.patientsIncomplets,
        planning: statistiques.tauxRemplissage,
        satisfaction: statistiques.tauxSatisfaction
      });
    }
  }, [statistiques]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [rdvRes, patientsRes, planningRes, avisRes] = await Promise.all([
          axios.get('/api/rendezvous/tous'),
          axios.get('/api/patients'),
          axios.get('/api/plannings'),
          axios.get('/api/avis')
        ]);

        const today = new Date().toISOString().split('T')[0];
        console.log("Contenu de rdvRes.data :", rdvRes.data);

        const rdvData = Array.isArray(rdvRes.data) ? rdvRes.data : 
               Array.isArray(rdvRes.data?.details) ? rdvRes.data.details : [];
const rdvsToday = rdvData.filter(rdv => {
          if (!rdv.heure && !rdv.created_at) return false;
        
          // Si tu as un champ 'heure' (planningJour.heure_debut) ou sinon 'created_at'
          const rdvDateStr = rdv.heure || rdv.created_at;
          const rdvDate = new Date(rdvDateStr).toDateString();
          const todayStr = new Date().toDateString();
        
          return rdvDate === todayStr;
        });
        
        
        
        const patientsData = Array.isArray(patientsRes.data) ? patientsRes.data : [];
        const patientsIncomplets = patientsData.filter(p => !p.informations_completes).length;
        
        const planningData = Array.isArray(planningRes.data) ? planningRes.data : [];
const planningsToday = planningData.filter(p => 
          p.date && p.date.startsWith(today)
        );
        const tauxRemplissage = planningsToday.length > 0 
          ? Math.round((rdvsToday.length / planningsToday[0].capacite_max) * 100)
          : 0;
        
        const avisPositifs = avisRes.data.filter(a => a.note >= 4).length;
        const tauxSatisfaction = avisRes.data.length > 0
          ? Math.round((avisPositifs / avisRes.data.length) * 100)
          : 0;

        setStatsData({
          rdv: {
            count: rdvsToday.length,
            confirmes: rdvsToday.filter(r => r.statut === 'confirmé').length,
            annules: rdvsToday.filter(r => r.statut === 'annulé').length
          },
          patients: {
            total: patientsRes.data.length,
            nouveaux: patientsRes.data.filter(p => 
              new Date(p.date_inscription) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length
          },
          planning: {
            jours: planningRes.data.length,
            capacite: planningsToday[0]?.capacite_max || 0
          },
          avis: {
            total: avisRes.data.length,
            satisfaction: tauxSatisfaction
          }
        });

        const stats = {
          rdvAujourdhui: rdvsToday.length,
          patientsIncomplets,
          tauxRemplissage,
          tauxSatisfaction
        };

        const nouveauxConseils = [];
        
        if (stats.rdvAujourdhui > 15) {
          nouveauxConseils.push({
            type: 'urgence',
            message: `⚠️ Forte charge aujourd'hui (${stats.rdvAujourdhui} RDV). Prévoir des créneaux supplémentaires.`,
            pourcentage: Math.min(100, (stats.rdvAujourdhui / 20) * 100)
          });
        }

        if (stats.tauxSatisfaction < 70) {
          nouveauxConseils.push({
            type: 'satisfaction',
            message: `😟 Taux de satisfaction bas (${Math.round(stats.tauxSatisfaction)}%). Vérifier les derniers avis.`,
            pourcentage: stats.tauxSatisfaction
          });
        }

        if (stats.patientsIncomplets > 0) {
          nouveauxConseils.push({
            type: 'patients',
            message: `📝 ${stats.patientsIncomplets} patients avec des informations incomplètes.`,
            pourcentage: Math.min(100, (stats.patientsIncomplets / statsData.patients.total) * 100)
          });
        }

        setStatistiques(stats);
        setConseils(nouveauxConseils);
        setLoading(false);

      } catch (error) {
        console.error("Erreur récupération données conseils:", error);
        setLoading(false);
      }
    };

    fetchAllData();
    
    const interval = setInterval(fetchAllData, 300000);
    return () => clearInterval(interval);
  }, []);

  const speakAdvice = () => {
    if (conseils.length > 0 && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance();
      
      let message = "Voici vos conseils du jour : ";
      conseils.forEach(conseil => {
        message += conseil.message + ". ";
      });
      
      utterance.text = message;
      utterance.lang = "fr-FR";
      utterance.rate = 0.9;
      synth.speak(utterance);
    }
  };

  return (
    <div className="modal-backdrop show">
      <div className="modal-container" style={{
        background: theme === 'dark' ? '#1e1a2e' : 'white',
        border: theme === 'dark' ? '1px solid #3a2d5a' : '1px solid #f3e8ff',
        borderRadius: '20px',
        maxWidth: '800px',
        width: '90%'
      }}>
        <div className="modal-header" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <h3 className="text-white mb-0">🤖 Assistant Médical - Lucie</h3>
          <div>
            <button 
              onClick={speakAdvice} 
              className="btn btn-sm btn-outline-light me-2"
              title="Lire les conseils"
            >
              🔊
            </button>
            <button onClick={onClose} className="btn btn-link text-white">&times;</button>
          </div>
        </div>
        
        <div className="modal-body p-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p>Analyse des données en cours...</p>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card h-100" style={{ 
                  background: theme === 'dark' ? '#2d2a42' : '#f5f3ff',
                  border: 'none'
                }}>
                  <div className="card-body text-center">
                    <div className="avatar-anime mb-3">
                      <img 
                        src="https://cdn.pixabay.com/animation/2022/08/06/11/57/11-57-43-584_512.gif" 
                        alt="IA Avatar"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #8b5cf6'
                        }}
                      />
                    </div>
                    <h5 className="mb-1">Lucie IA</h5>
                    <p className="text-muted small">Assistant Médical IA</p>
                    
                    <div className="mt-4">
                      <div className="mb-3">
                        <h6 style={{ color: theme === 'dark' ? '#a78bfa' : '#7e22ce' }}>
                          RDV aujourd'hui
                        </h6>
                        <div className="progress" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            role="progressbar" 
                            style={{ 
                              width: `${Math.min(100, (animationValues.rdv / 20) * 100)}%`,
                              transition: 'width 0.5s ease'
                            }}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                          <small>{animationValues.rdv} / {statsData.planning.capacite}</small>
                          <small>
                            {statsData.planning.capacite > 0 
                              ? `${Math.round((animationValues.rdv / statsData.planning.capacite) * 100)}%` 
                              : '0%'}
                          </small>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6 style={{ color: theme === 'dark' ? '#a78bfa' : '#7e22ce' }}>
                          Satisfaction patients
                        </h6>
                        <div className="progress" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ 
                              width: `${animationValues.satisfaction}%`,
                              transition: 'width 0.5s ease'
                            }}
                          ></div>
                        </div>
                        <small className="d-block text-center mt-1">
                          {animationValues.satisfaction}%
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <h4 className="mb-4" style={{ color: theme === 'dark' ? 'white' : '#4c1d95' }}>
                  Tableau de bord en temps réel
                </h4>
                
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <div className="card" style={{ 
                      background: theme === 'dark' ? '#2d2a42' : 'white',
                      border: 'none',
                      height: '100%'
                    }}>
                      <div className="card-body">
                        <h5 style={{ color: theme === 'dark' ? '#a78bfa' : '#7e22ce' }}>
                          <People className="me-2" /> Patients
                        </h5>
                        <div className="d-flex align-items-center justify-content-around">
                          <div className="text-center">
                            <div className="display-4" style={{ color: theme === 'dark' ? 'white' : '#4c1d95' }}>
                              {statsData.patients.total}
                            </div>
                            <small>Total</small>
                          </div>
                          <div className="text-center">
                            <div className="display-4" style={{ color: theme === 'dark' ? 'white' : '#4c1d95' }}>
                              {statsData.patients.nouveaux}
                            </div>
                            <small>Nouveaux (30j)</small>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-info" 
                              style={{ 
                                width: `${Math.min(100, (statsData.patients.nouveaux / statsData.patients.total) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="card" style={{ 
                      background: theme === 'dark' ? '#2d2a42' : 'white',
                      border: 'none',
                      height: '100%'
                    }}>
                      <div className="card-body">
                        <h5 style={{ color: theme === 'dark' ? '#a78bfa' : '#7e22ce' }}>
                          <CalendarCheck className="me-2" /> Rendez-vous
                        </h5>
                        <div className="d-flex align-items-center justify-content-around">
                          <div className="text-center">
                            <div className="display-4" style={{ color: theme === 'dark' ? 'white' : '#4c1d95' }}>
                              {statsData.rdv.count}
                            </div>
                            <small>Aujourd'hui</small>
                          </div>
                          <div className="text-center">
                            <div className="display-4" style={{ color: theme === 'dark' ? 'white' : '#4c1d95' }}>
                              {statsData.rdv.confirmes}
                            </div>
                            <small>Confirmés</small>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{ width: `${(statsData.rdv.confirmes / statsData.rdv.count) * 100}%` }}
                            ></div>
                            <div 
                              className="progress-bar bg-danger" 
                              style={{ width: `${(statsData.rdv.annules / statsData.rdv.count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h5 className="mb-3" style={{ color: theme === 'dark' ? 'white' : '#4c1d95' }}>
                  Conseils Opérationnels
                </h5>
                
                {conseils.length > 0 ? (
                  conseils.map((conseil, index) => (
                    <div key={index} className="alert mb-3" style={{
                      background: theme === 'dark' ? '#3a2d5a' : '#f3e8ff',
                      borderLeft: `4px solid ${conseil.type === 'urgence' ? '#ef4444' : '#8b5cf6'}`,
                      borderRadius: '8px'
                    }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {conseil.message}
                          <div className="progress mt-2" style={{ height: '6px', width: '200px' }}>
                            <div className="progress-bar" 
                                 role="progressbar" 
                                 style={{ 
                                   width: `${conseil.pourcentage}%`, 
                                   background: `linear-gradient(90deg, ${conseil.type === 'urgence' ? '#ef4444' : '#8b5cf6'}, #ec4899)`,
                                   transition: 'width 1s ease'
                                 }}>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">Aucun problème détecté. Tout semble en ordre ! 🎉</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MedicalChatbot({ theme }) {
  const [messages, setMessages] = useState([
    { text: "Bonjour, je suis l'assistant de la secrétaire. Posez-moi vos questions sur les RDV, patients, statistiques...", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions] = useState([
    "Combien de RDV aujourd'hui ?",
    "Quelles sont les annulations cette semaine ?",
    "Qui est le patient le plus fréquent ?",
    "Quel est le prochain RDV ?",
    "Quelles sont les statistiques des RDV ?"
  ]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;
    
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await axios.get('/api/rendezvous/stats-pour-chatbot');
      const { 
        rdv_aujourdhui, 
        annulations_semaine, 
        patient_frequent, 
        prochain_rdv,
        stats_journalieres
      } = response.data;

      let responseText = "Je ne comprends pas votre demande. Voici ce que je peux vous dire :";
      const query = inputValue.toLowerCase();
      
      if (query.includes("aujourd'hui") || query.includes("rdv du jour") || query.includes("combien de rdv")) {
        responseText = `Il y a ${rdv_aujourdhui.count} RDV prévus aujourd'hui.\n`;
        if (rdv_aujourdhui.count > 0) {
          responseText += "Détails :\n" + 
            rdv_aujourdhui.details.map(rdv => 
              `- ${rdv.patient} avec ${rdv.medecin} à ${rdv.heure} (${rdv.statut})`
            ).join('\n');
        }
      } 
      else if (query.includes("annul") || query.includes("annulation")) {
        responseText = annulations_semaine.length > 0 
          ? `Annulations cette semaine (${annulations_semaine.length}):\n` + 
            annulations_semaine.map(a => `- ${a.patient} le ${a.date} à ${a.heure}${a.motif ? ` (Motif: ${a.motif})` : ''}`).join('\n')
          : "Aucune annulation cette semaine.";
      }
      else if (query.includes("fréquent") || query.includes("frequent") || query.includes("plus de rdv")) {
        responseText = `Patient le plus fréquent: ${patient_frequent.patient} (${patient_frequent.count} visites)`;
      }
      else if (query.includes("prochain") || query.includes("suivant") || query.includes("prochain rdv")) {
        if (prochain_rdv.message) {
          responseText = prochain_rdv.message;
        } else {
          responseText = `Prochain RDV: ${prochain_rdv.date} à ${prochain_rdv.heure} avec ${prochain_rdv.medecin}\n${prochain_rdv.conseil}`;
        }
      }
      else if (query.includes("stat") || query.includes("évolution") || query.includes("comparaison")) {
        responseText = `Statistiques des RDV:\n` +
          `- Aujourd'hui: ${stats_journalieres.today} RDV\n` +
          `- Hier: ${stats_journalieres.yesterday} RDV\n` +
          `- Évolution: ${stats_journalieres.evolution > 0 ? '+' : ''}${stats_journalieres.evolution}%`;
        
        if (stats_journalieres.evolution > 0) {
          responseText += `\n📈 Augmentation par rapport à hier`;
        } else if (stats_journalieres.evolution < 0) {
          responseText += `\n📉 Diminution par rapport à hier`;
        }
      }
      else if (query.includes("aide") || query.includes("help") || query.includes("que peux-tu")) {
        responseText = "Je peux vous informer sur :\n" +
          "- Les RDV d'aujourd'hui\n" +
          "- Les annulations récentes\n" +
          "- Les patients fréquents\n" +
          "- Le prochain RDV\n" +
          "- Les statistiques des RDV\n\n" +
          "Essayez de poser une question plus précise !";
      }

      setMessages(prev => [...prev, { 
        text: responseText, 
        sender: 'bot',
        isStats: query.includes("stat") || query.includes("évolution")
      }]);
    } catch (error) {
      console.error("Erreur chatbot:", error);
      setMessages(prev => [...prev, { 
        text: "Désolé, une erreur est survenue. Veuillez réessayer plus tard.", 
        sender: 'bot' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow" style={{ 
      backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white',
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
      border: theme === 'dark' ? '1px solid #3a2d5a' : '1px solid #f3e8ff',
      borderRadius: '16px'
    }}>
      <div className="card-header py-3 d-flex justify-content-between align-items-center" style={{ 
        background: 'linear-gradient(135deg,rgb(129, 37, 220) 0%, #ec4899 100%)',
        borderBottom: 'none',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }}>
        <h6 className="m-0 font-weight-bold text-white">
          Assistant Secrétaire
        </h6>
        <span className="badge bg-pink-200 text-purple-800">Beta</span>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '15px',
        background: theme === 'dark' ? '#1e1a2e' : 'linear-gradient(to bottom right, #fdf4ff, #f5f3ff)'
      }}>
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
              background: msg.sender === 'user' 
                ? 'linear-gradient(135deg, #ec4899 0%,rgb(23, 38, 245) 100%)' 
                : theme === 'dark' 
                  ? '#3a2d5a' 
                  : '#f3e8ff',
              color: msg.sender === 'user' ? 'white' : theme === 'dark' ? 'white' : '#4c1d95',
              whiteSpace: 'pre-line',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {msg.text}
              {msg.isStats && (
                <div className="mt-2">
                  <div className="progress" style={{ 
                    height: '8px', 
                    background: theme === 'dark' ? '#3a2d5a' : '#e9d5ff',
                    borderRadius: '4px'
                  }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ 
                        width: '100%',
                        background: 'linear-gradient(90deg, #ec4899,rgb(78, 10, 239))'
                      }}
                    ></div>
                  </div>
                  <small className="d-block mt-1" style={{ 
                    color: theme === 'dark' ? '#a78bfa' : '#7e22ce',
                    fontSize: '0.75rem'
                  }}>
                    Dernière mise à jour: {new Date().toLocaleTimeString()}
                  </small>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="d-flex justify-content-start">
            <div style={{
              padding: '10px 15px',
              borderRadius: '18px 18px 18px 0',
              background: theme === 'dark' ? '#3a2d5a' : '#f3e8ff',
              color: theme === 'dark' ? 'white' : '#4c1d95'
            }}>
              <div className="spinner-border spinner-border-sm text-purple-500 me-2" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <span>Recherche en cours...</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3" style={{ 
        background: theme === 'dark' ? '#1e1a2e' : 'linear-gradient(to bottom right, #fdf4ff, #f5f3ff)',
        borderTop: theme === 'dark' ? '1px solid #3a2d5a' : '1px solid #f3e8ff',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px'
      }}>
        <div className="mb-2">
          <div className="d-flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="btn btn-sm"
                onClick={() => setInputValue(suggestion)}
                style={{ 
                  fontSize: '0.75rem',
                  borderRadius: '20px',
                  background: theme === 'dark' ? '#3a2d5a' : '#f3e8ff',
                  border: 'none',
                  color: theme === 'dark' ? '#e9d5ff' : '#7e22ce',
                  padding: '4px 12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        <div className="input-group">
          <input
            type="text"
            className={`form-control ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-300'}`}
            placeholder="Posez votre question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            style={{
              borderRadius: '20px 0 0 20px',
              borderRight: 'none'
            }}
          />
          <button 
            className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleSend}
            disabled={loading}
            style={{
              borderRadius: '0 20px 20px 0',
              borderLeft: 'none',
              background: 'linear-gradient(135deg,rgb(84, 16, 243) 0%, #ec4899 100%)',
              border: 'none'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Envoi...
              </>
            ) : (
              'Envoyer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ isCollapsed, theme }) {
  const sidebarStyle = {
    background: 'linear-gradient(180deg,rgb(58, 40, 217) 0%,rgb(72, 115, 223) 100%)',
    color: 'white',
    boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
    backdropFilter: 'blur(10px)'
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} style={sidebarStyle}>
      <h3 className="fw-bold text-center mb-4 pt-3" style={{ color: '#f0abfc' }}>
        {isCollapsed ? '🩺' : 'MedCarePro'}
      </h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <NavLink to="/" className="nav-link-custom" end>
            <HouseDoor className="me-2" style={{ color: '#e9d5ff' }} /> 
            {!isCollapsed && 'Dashboard'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/patients" className="nav-link-custom">
            <People className="me-2" style={{ color: '#e9d5ff' }} /> 
            {!isCollapsed && 'Patients'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/rdvs" className="nav-link-custom">
            <CalendarCheck className="me-2" style={{ color: '#e9d5ff' }} /> 
            {!isCollapsed && 'Rendez-vous'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/fiche-patient" className="nav-link-custom">
            <FileEarmarkMedical className="me-2" style={{ color: '#e9d5ff' }} /> 
            {!isCollapsed && 'Fiche patient'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/planning" className="nav-link-custom">
            <Clipboard className="me-2" style={{ color: '#e9d5ff' }} /> 
            {!isCollapsed && 'plan des rendez vous'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <a 
            href="/urgences" 
            className="nav-link-custom"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#e9d5ff' }}
            onClick={(e) => {
              e.preventDefault();
              document.body.classList.add('fade-out');
              setTimeout(() => {
                window.location.href = "/urgences";
              }, 500);
            }}
          >
            <Bell className="me-2" style={{ color: '#e9d5ff' }} />
            {!isCollapsed && 'Urgences'}
          </a>
        </li>
      </ul>
    </div>
  );
}


function Header({ onToggleSidebar, toggleTheme, theme }) {
  const [langue, setLangue] = useState('fr');
  const [searchText, setSearchText] = useState('');

  const headerStyle = {
    background: theme === 'dark' ? '#1e1a2e' : 'white',
    color: theme === 'dark' ? 'white' : '#4c1d95',
    borderBottom: '1px solid rgba(167, 139, 250, 0.1)',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)'
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    console.log("Recherche :", e.target.value);
  };

  return (
    <div className="header px-4 py-3 d-flex justify-content-between align-items-center" style={headerStyle}>
      <div className="d-flex align-items-center gap-3">
        <button 
          className={`btn btn-sm me-2 ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-primary'}`}
          onClick={onToggleSidebar}
          style={{ border: 'none', color: theme === 'dark' ? '#e9d5ff' : '#8b5cf6' }}
        >
          <List style={{ color: theme === 'dark' ? '#e9d5ff' : '#8b5cf6' }} />
        </button>

        <h5 className="mb-0 d-none d-md-block" style={{ color: '#8b5cf6' }}>
          Dashboard Médical
        </h5>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="input-group input-group-sm search-bar" style={{ width: '200px' }}>
          <input
            type="text"
            className={`form-control ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-50 border-gray-200'}`}
            placeholder={langue === 'fr' ? "Rechercher..." : "Search..."}
            value={searchText}
            onChange={handleSearch}
            style={{ borderRadius: '10rem' }}
          />
          <span 
            className={`input-group-text ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-50 border-gray-200'}`}
            style={{ borderRadius: '10rem', cursor: 'pointer' }}
          >
            <Search />
          </span>
        </div>

        <div className="dropdown">
          
           
          <ul className={`dropdown-menu ${theme === 'dark' ? 'bg-gray-800' : ''}`} aria-labelledby="languageDropdown">
            <li><button className={`dropdown-item ${theme === 'dark' ? 'text-white' : ''}`} onClick={() => setLangue('fr')}>🇫🇷 Français</button></li>
            <li><button className={`dropdown-item ${theme === 'dark' ? 'text-white' : ''}`} onClick={() => setLangue('en')}>🇬🇧 English</button></li>
          </ul>
        </div>

        <button 
          className={`btn btn-sm ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-primary'}`}
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          style={{ border: 'none', color: theme === 'dark' ? '#e9d5ff' : '#8b5cf6' }}
        >
          {theme === 'dark' ? 
            <Sun style={{ color: '#e9d5ff' }} /> : 
            <Moon style={{ color: '#8b5cf6' }} />}
        </button>

        <div className="dropdown">
          <button 
            className="btn btn-sm dropdown-toggle d-flex align-items-center"
            type="button"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ border: 'none', color: theme === 'dark' ? '#e9d5ff' : '#8b5cf6' }}
          >
            <div className="position-relative">
              <PersonCircle size={24} className="me-2" style={{ color: '#8b5cf6' }} />
              <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle"></span>
            </div>
            <span className="fw-bold d-none d-md-inline"></span>
          </button>
          <ul className={`dropdown-menu dropdown-menu-end ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <li><button className={`dropdown-item ${theme === 'dark' ? 'text-white' : ''}`}>Mon profil</button></li>
            <li><button className={`dropdown-item ${theme === 'dark' ? 'text-white' : ''}`}>Paramètres</button></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className={`dropdown-item ${theme === 'dark' ? 'text-white' : ''}`}>Déconnexion</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, title, value, trend, theme, onClick }) {
  const cardStyle = {
    background: theme === 'dark' ? '#1e1a2e' : 'white',
    color: theme === 'dark' ? 'white' : '#4c1d95',
    borderLeft: '0.25rem solidrgb(11, 47, 228)',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: '12px',
    border: theme === 'dark' ? '1px solid #3a2d5a' : '1px solid #f3e8ff'
  };

  const trendColors = {
    rose: { bg: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)', text: 'white' },
    blue: { bg: 'linear-gradient(135deg,rgb(26, 36, 226) 0%,rgb(39, 42, 232) 100%)', text: 'white' },
    success: { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: 'white' },
    info: { bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', text: 'white' }
  };

  return (
    <div className="card mb-4 h-100" style={cardStyle} onClick={onClick}>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <div className="text-xs font-weight-bold text-uppercase mb-1" style={{ color: '#a78bfa' }}>
              {title}
            </div>
            <div className="h5 mb-0 font-weight-bold">
              {value}
            </div>
            {trend && (
              <div className="mt-2">
                <span style={{
                  background: trendColors[trend.color]?.bg || trendColors.blue.bg,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: trendColors[trend.color]?.text || 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {trend.icon}
                  {trend.text}
                </span>
              </div>
            )}
          </div>
          <div className="col-auto">
            <div className="icon-circle" style={{ 
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#8b5cf6'
            }}>
              {React.cloneElement(icon, { style: { color: '#8b5cf6' } })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSecretary({ theme }) {
  const [showAIModal, setShowAIModal] = useState(false);
  const [showDameIA, setShowDameIA] = useState(false);
  const [messageDame, setMessageDame] = useState('');
  const [dailyPatientData, setDailyPatientData] = useState([]);
  const [showAvisStats, setShowAvisStats] = useState(false);
  const [showRdvStats, setShowRdvStats] = useState(false);
  const [rdvStatsData, setRdvStatsData] = useState(null);
  const [showPatientMap, setShowPatientMap] = useState(false);
  const [patients, setPatients] = useState([]);
  const [showTauxRemplissage, setShowTauxRemplissage] = useState(false);
  const [stats, setStats] = useState([
    { 
      icon: <People size={24} />, 
      title: "Patients enregistrés", 
      value: "Chargement...", 
      trend: { 
        text: "", 
        color: "success",
        icon: <GraphUp size={12} />
      } 
    },
    { 
      icon: <CalendarCheck size={24} />, 
      title: "Rendez-vous aujourd'hui", 
      value: "Chargement...", 
      trend: { 
        text: "", 
        color: "success",
        icon: <GraphUp size={12} />
      } 
    },
    {
      icon: <GraphUp size={24} />,
      title: "Taux de remplissage",
      value: "Chargement...",
      trend: {
        text: "",
        color: "info",
        icon: <Activity size={12} />
      }
    },
    { 
      icon: <Truck size={24} />, 
      title: "Ambulances disponibles", 
      value: "Chargement...", 
      trend: { 
        text: "", 
        color: "info",
        icon: <Activity size={12} />
      } 
    }
  ]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [avisStats, setAvisStats] = useState(null);
  const [showPatientStats, setShowPatientStats] = useState(false);
  const [monthlyPatientData, setMonthlyPatientData] = useState([]);
  const [datesPlanifiees, setDatesPlanifiees] = useState([]);

  useEffect(() => {
    axios.get('/api/planning-jours')
      .then(response => {
        const dates = response.data.map(planning => planning.date.split('T')[0]);
        setDatesPlanifiees(dates);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des dates', error);
      });
  }, []);

  const [loadingPatientStats, setLoadingPatientStats] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/patients')
      .then(response => {
        const patientCount = response.data.length;
        setStats(prev => prev.map(stat => 
          stat.title === "Patients enregistrés" 
            ? { 
                ...stat, 
                value: patientCount.toLocaleString(), 
                trend: { 
                  text: `+${Math.floor(patientCount * 0.1)} ce mois-ci`, 
                  color: "success",
                  icon: <GraphUp size={12} />
                } 
              } 
            : stat
        ));
      })
      .catch(error => {
        console.error("Erreur patients:", error);
        activerDameIA("Erreur lors du chargement des patients. Vérifiez votre connexion.");
      });

    axios.get('http://localhost:8000/api/rendezvous/tous')
      .then(response => {
        const todayAppointments = response.data.filter(rdv => {
          const rdvDate = new Date(rdv.planning_jour.date).toDateString();
          const today = new Date().toDateString();
          return rdvDate === today;
        });
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayAppointments = response.data.filter(rdv => {
          const rdvDate = new Date(rdv.planning_jour.date).toDateString();
          return rdvDate === yesterday.toDateString();
        });

        let totalMax = 0;
        let totalConfirmes = 0;

        response.data.forEach(rdv => {
          const dateRdv = new Date(rdv.planning_jour.date).toDateString();
          const today = new Date().toDateString();

          if (dateRdv === today) {
            totalMax += rdv.planning_jour?.nombre_max_patients || 0;
            if (rdv.statut === "confirmé") {
              totalConfirmes++;
            }
          }
        });

        const taux = totalMax > 0 ? Math.round((totalConfirmes / totalMax) * 100) : 0;

        setStats(prev => prev.map(stat =>
          stat.title === "Taux de remplissage"
            ? {
                ...stat,
                value: `${taux}%`,
                trend: {
                  text: taux === 0 ? "Aucun patient" : taux === 100 ? "Complet" : "Encore des places",
                  color: taux === 100 ? 'success' : 'info',
                  icon: taux === 100 ? <GraphUp size={12} /> : <Activity size={12} />
                }
              }
            : stat
        ));

        if ('speechSynthesis' in window) {
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance();

          if (taux === 0) {
            utterance.text = "Aucun patient enregistré aujourd'hui.";
          } else {
            utterance.text = `Le taux de remplissage aujourd'hui est de ${taux} pour cent.`;
          }

          utterance.lang = "fr-FR";
          synth.speak(utterance);
        }
        
        const pourcentageEvolution = yesterdayAppointments.length === 0
          ? 100
          : Math.round(((todayAppointments.length - yesterdayAppointments.length) / yesterdayAppointments.length) * 100);

        setStats(prev => prev.map(stat => 
          stat.title === "Rendez-vous aujourd'hui" 
            ? { 
                ...stat, 
                value: todayAppointments.length.toString(), 
                trend: { 
                  text: `${pourcentageEvolution >= 0 ? '+' : ''}${pourcentageEvolution}%`,
                  color: pourcentageEvolution >= 0 ? 'rose' : 'blue',
                  icon: (
                    pourcentageEvolution >= 0 
                      ? <GraphUp size={12} color="#ec4899" /> 
                      : <GraphUp size={12} style={{ transform: 'rotate(180deg)', color: '#8b5cf6' }} />
                  )
                } 
              } 
            : stat
        ));

        const upcoming = response.data
          .filter(rdv => new Date(rdv.planning_jour.date) >= new Date())
          .sort((a, b) => new Date(a.planning_jour.date) - new Date(b.planning_jour.date))[0];
        
        if (upcoming) {
          setNextAppointment({
            date: upcoming.planning_jour.date,
            heure: upcoming.planning_jour.heure_debut,
            medecin: upcoming.medecin?.name || 'Dr. Inconnu',
            conseil: "Préparez-vous bien pour votre rendez-vous. Buvez de l'eau et arrivez à l'heure."
          });
        }
      })
      .catch(error => console.error("Erreur rendez-vous:", error));

    axios.get('http://localhost:8000/api/avis/stats')
      .then(response => {
        const { tauxSatisfaction, tauxMecontentement, totalAvis } = response.data;

        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance();
          utterance.text = `Le taux de satisfaction est de ${Math.round(tauxSatisfaction)} pour cent`;
          utterance.lang = 'fr-FR';
          speechSynthesis.speak(utterance);
        }

        setStats(prev =>
          prev.map(stat =>
            stat.title === "Ambulances disponibles"
              ? {
                  title: "Taux de satisfaction",
                  icon: <GraphUp size={24} />,
                  value: `${Math.round(tauxSatisfaction)}%`,
                  trend: {
                    text: `Basé sur ${totalAvis} avis`,
                    color: tauxSatisfaction > 70 ? 'success' : 'rose',
                    icon: <GraphUp size={12} />
                  }
                }
              : stat
          )
        );
      })
      .catch(error => console.error("Erreur avis :", error));

    axios.get('http://localhost:8000/api/plannings')
      .then(response => {
        const uniqueDoctors = [];
        const doctorIds = new Set();
        
        response.data.forEach(planning => {
          if (planning.medecin && !doctorIds.has(planning.medecin.id)) {
            doctorIds.add(planning.medecin.id);
            uniqueDoctors.push({
              id: planning.medecin.id,
              name: planning.medecin.name,
              specialty: "Médecin généraliste",
             
              image: `https://cdn.pixabay.com/animation/2022/07/29/14/46/14-46-18-128_512.gif`
            });
          }
        });

        uniqueDoctors.push({
          
          
          
          image: "https://cdn.pixabay.com/animation/2022/08/06/11/57/11-57-43-584_512.gif",
          isAI: true
        });
        
        setDoctors(uniqueDoctors);
      })
      .catch(error => console.error("Erreur médecins:", error));

    axios.get('http://localhost:8000/api/avis/stats')
      .then(response => {
        setAvisStats(response.data);
      })
      .catch(error => console.error("Erreur avis:", error));

    axios.get('http://localhost:8000/api/rendezvous/tous')
      .then(response => {
        const upcomingAppointments = response.data
          .filter(rdv => new Date(rdv.planning_jour.date) >= new Date())
          .sort((a, b) => new Date(a.planning_jour.date) - new Date(b.planning_jour.date))
          .slice(0, 4)
          .map(rdv => ({
            id: rdv.id,
            time: rdv.planning_jour.heure_debut,
            name: rdv.patient?.name || 'Patient inconnu',
            type: rdv.statut === 'confirmé' ? 'Confirmé' : 'En attente'
          }));
        
        setAppointments(upcomingAppointments);
      })
      .catch(error => console.error("Erreur rendez-vous:", error));

    setTimeout(() => {
      const heure = new Date().getHours();
      if (heure >= 8 && heure <= 12) {
        genererConseilIA();
      }
    }, 2000);
  }, []);

  useEffect(() => {
    if (showPatientStats) {
      setLoadingPatientStats(true);
      axios.get('http://localhost:8000/api/patient-stats-daily')
        .then(response => {
          const transformed = response.data.map((item, index, array) => {
            const previousCount = index > 0 ? array[index - 1].count : 0;
            const change = previousCount === 0 ? 0 : Math.round(((item.count - previousCount) / previousCount) * 100);
            return {
              month: new Date(item.date).toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: '2-digit',
                month: 'short'
              }),
              count: item.count,
              change
            };
          });
  
          setMonthlyPatientData(transformed);
          setLoadingPatientStats(false);
        })
        .catch(error => {
          console.error("Erreur stats patients:", error);
          setLoadingPatientStats(false);
        });
    }
  }, [showPatientStats]);

  const handlePatientStatClick = () => {
    setShowPatientStats(true);
  };

  const activerDameIA = (message) => {
    const genererConseilIA = () => {
      if (!avisStats || !appointments || stats.length === 0) return;
    
      const messages = [];
    
      const tauxSatisfaction = avisStats.tauxSatisfaction || 0;
      const tauxRemplissage = parseInt(stats.find(s => s.title === "Taux de remplissage")?.value) || 0;
      const rdvsDemain = appointments.filter(rdv => {
        const dateRdv = new Date();
        dateRdv.setDate(dateRdv.getDate() + 1);
        const rdvDate = new Date(rdv.time);
        return rdvDate.toDateString() === dateRdv.toDateString();
      });
    
      if (tauxSatisfaction >= 80) {
        messages.push(`Taux de satisfaction : ${tauxSatisfaction}%. Très bon travail !`);
      } else if (tauxSatisfaction < 60) {
        messages.push(`Attention, le taux de satisfaction est bas (${tauxSatisfaction}%). Consultez les avis récents.`);
      }
    
      if (tauxRemplissage >= 90) {
        messages.push(`Planning très chargé aujourd’hui (${tauxRemplissage}%). Vous pourriez ajouter un médecin.`);
      } else if (tauxRemplissage <= 50) {
        messages.push(`Beaucoup de créneaux libres aujourd’hui (${tauxRemplissage}%). Relancez vos patients.`);
      }
    
      if (rdvsDemain.length === 0) {
        messages.push(`Aucun rendez-vous pour demain. C’est peut-être le moment de relancer les patients.`);
      }
    
      if (messages.length === 0) {
        messages.push("Tout semble stable aujourd’hui. Vous pouvez vous concentrer sur la gestion interne.");
      }
    
      const messageFinal = messages[Math.floor(Math.random() * messages.length)];
      activerDameIA("Bonjour ! " + messageFinal);
    };
   
    setMessageDame(message);
    setShowDameIA(true);
    setTimeout(() => {
      setShowDameIA(false);
    }, 10000);
  };
  
  const handleRdvTodayClick = () => {
    axios.get('http://localhost:8000/api/patients')
      .then(response => {
        setPatients(response.data);
        setShowPatientMap(true);
      })
      .catch(error => console.error("Erreur chargement patients:", error));
  };

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0" style={{ color: theme === 'dark' ? 'white' : '#4c1d95' }}>Tableau de bord</h1>
        
      </div>

      <div className="row">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6 mb-4">
            <StatsCard 
              icon={stat.icon} 
              title={stat.title} 
              value={stat.value} 
              trend={stat.trend}
              onClick={
                stat.title === "Patients enregistrés"
                  ? handlePatientStatClick
                  : stat.title === "Rendez-vous aujourd'hui"
                  ? handleRdvTodayClick
                  : stat.title === "Taux de remplissage"
                  ? () => setShowTauxRemplissage(true)
                  : stat.title === "Taux de satisfaction"
                  ? () => setShowAvisStats(true)
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4" style={{ 
            backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white',
            border: 'none',
            borderRadius: '16px'
          }}>
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between" style={{ 
              background: 'linear-gradient(135deg,rgb(80, 12, 241) 0%, #ec4899 100%)',
              borderBottom: 'none',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <h6 className="m-0 font-weight-bold text-white">Dates planifiées (Calendrier)</h6>
            </div>
            <div className="card-body">
              <div className="chart-area">
                <div style={{ 
                  height: 'auto', 
                  backgroundColor: theme === 'dark' ? '#1e1a2e' : '#f5f3ff',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <Calendar
                    tileClassName={({ date, view }) => {
                      if (view === 'month') {
                        const dateStr = date.toISOString().split('T')[0];
                        return datesPlanifiees.includes(dateStr) ? 'bg-purple-500 text-white rounded' : '';
                      }
                      return '';
                    }}
                    className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4" style={{ 
            backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white',
            border: 'none',
            borderRadius: '16px'
          }}>
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between" style={{ 
              background: 'linear-gradient(135deg,rgb(80, 10, 244) 0%, #ec4899 100%)',
              borderBottom: 'none',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <h6 className="m-0 font-weight-bold text-white">Rendez-vous à venir</h6>
              <span className="badge bg-pink-200 text-purple-800">{appointments.length}</span>
            </div>
            <div className="card-body">
              {appointments.length > 0 ? (
                appointments.map(appointment => (
                  <div key={appointment.id} className="mb-3">
                    <div className="d-flex align-items-center">
                      <div className={`me-3 p-2 rounded text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`} style={{ minWidth: '60px' }}>
                        <div className="font-weight-bold">{appointment.time}</div>
                        <div className="small text-xs" style={{ color: theme === 'dark' ? '#a78bfa' : '#7e22ce' }}>
                          {appointment.type}
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="font-weight-bold" style={{ color: theme === 'dark' ? 'white' : '#4c1d95' }}>
                          {appointment.name}
                        </div>
                        <div className={`badge ${appointment.type === 'Confirmé' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                          {appointment.type}
                        </div>
                      </div>
                    </div>
                    {appointment.id !== appointments[appointments.length - 1].id && <hr className="my-2" />}
                  </div>
                ))
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted">Aucun rendez-vous à venir</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-lg-12">
          <AlerteSanitaire />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4" style={{ 
            backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white',
            border: 'none',
            borderRadius: '16px'
          }}>
            <div className="card-header py-3" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderBottom: 'none',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <h6 className="m-0 font-weight-bold text-white">Liste des médecins</h6>
            </div>
            <div className="card-body">
              {doctors.length > 0 ? (
                doctors.map(doctor => (
                  <div key={doctor.id} className="mb-4">
                    <div className="d-flex align-items-start" 
                         style={doctor.isAI ? { 
                           cursor: 'pointer',
                           background: theme === 'dark' ? 'linear-gradient(45deg, #1a1a2e, #16213e)' : 'linear-gradient(45deg, #f8f5ff, #f3e8ff)',
                           borderRadius: '1px',
                           padding: '1px',
                           
                           transition: 'transform 0.3s ease',
                           border: theme === 'dark' ? '1px solid #3a2d5a' : '1px solid #e9d8ff'
                         } : {}}
                         onClick={doctor.isAI ? () => setShowAIModal(true) : undefined}>
                     <div style={{ marginRight: '8px' }}>
                        <img 
                          src={doctor.image} 
                          alt={doctor.name} 
                          className={doctor.isAI ? "rounded-circle border-purple" : "rounded-circle"} 
                          style={{ 
                            width: '100px', 
                            height: '160px', 
                            objectFit: 'cover',
                            border: doctor.isAI ? '2px solid #8b5cf6' : 'none'
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="font-weight-bold mb-1" style={{ 
                            color: doctor.isAI ? '#8b5cf6' : (theme === 'dark' ? 'white' : '#4c1d95')
                          }}>
                            {doctor.name}
                            {doctor.isAI && <span className="badge bg-pink-500 text-white ms-2">Nouveau</span>}
                          </h6>
                          <div className={`badge ${doctor.isAI ? 'bg-purple-500' : 'bg-yellow-500'} text-white`}>
                            {doctor.rating}
                          </div>
                        </div>
                        <div className="small mb-2" style={{ 
                          color: doctor.isAI ? '#c4b5fd' : (theme === 'dark' ? '#a78bfa' : '#7e22ce')
                        }}>
                          {doctor.specialty}
                        </div>
                        <p className="small mb-0" style={{ 
                          color: doctor.isAI ? '#a78bfa' : (theme === 'dark' ? '#c4b5fd' : '#6b21a8')
                        }}>
                          {doctor.description}
                          {doctor.isAI && (
                            <button className="btn btn-link p-0 ms-2" 
                                    style={{ color: '#8b5cf6' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowAIModal(true);
                                    }}>
                              Voir conseils
                            </button>
                          )}
                        </p>
                      </div>
                    </div>
                    {doctor.id !== doctors[doctors.length - 1].id && <hr className="my-3" />}
                  </div>
                ))
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted">Aucun médecin disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <MedicalChatbot theme={theme} />
        </div>
      </div>

      {showAIModal && <ConseilsIA theme={theme} onClose={() => setShowAIModal(false)} />}

      {showPatientStats && (
        <div className="modal-backdrop show">
          <div className="modal-container" style={{
            background: theme === 'dark' ? '#1e1a2e' : 'white',
            border: theme === 'dark' ? '1px solid #3a2d5a' : '1px solid #f3e8ff',
            boxShadow: theme === 'dark' ? '0 0 30px rgba(139, 92, 246, 0.3)' : '0 0 30px rgba(139, 92, 246, 0.2)',
            borderRadius: '16px'
          }}>
            <div className="modal-header" style={{ 
              background: 'linear-gradient(135deg,rgb(77, 11, 231) 0%, #ec4899 100%)',
              borderBottom: 'none',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <h3 className="text-white">Statistiques Mensuelles des Patients</h3>
              <button onClick={() => setShowPatientStats(false)} className="close-btn text-white">
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              {loadingPatientStats ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                <>
                  <div className="chart-container">
                    <PatientChart data={monthlyPatientData} theme={theme} />
                  </div>
                  
                  <div className="stats-summary">
                    <div className="summary-card" style={{ borderColor: '#8b5cf6' }}>
                      <h4>Total Annuel</h4>
                      <p>{monthlyPatientData.reduce((sum, data) => sum + data.count, 0)}</p>
                    </div>
                    <div className="summary-card" style={{ borderColor: '#ec4899' }}>
                      <h4>Mois Actif</h4>
                      <p>{monthlyPatientData.reduce((max, data) => data.count > max.count ? data : max, {count: 0}).month}</p>
                    </div>
                    <div className="summary-card" style={{ borderColor: '#10b981' }}>
                      <h4>Taux Moyen</h4>
                      <p>+{Math.floor(monthlyPatientData.reduce((sum, data, idx) => idx > 0 ? sum + data.change : sum, 0) / 11)}%</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowPatientStats(false)} 
                className="close-button"
                style={{
                  background: 'linear-gradient(135deg,rgb(74, 8, 229) 0%, #ec4899 100%)',
                  color: 'white'
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showPatientMap && (
        <div className="modal-backdrop show">
          <div className="modal-container" style={{
            backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white',
            border: theme === 'dark' ? '1px solid #3a2d5a' : '1px solid #f3e8ff',
            boxShadow: theme === 'dark' ? '0 0 30px rgba(139, 92, 246, 0.3)' : '0 0 30px rgba(139, 92, 246, 0.2)',
            maxWidth: '90%',
            width: '1000px',
            borderRadius: '16px'
          }}>
            <div className="modal-header" style={{ 
              background: 'linear-gradient(135deg,rgb(80, 12, 238) 0%, #ec4899 100%)',
              borderBottom: 'none',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <h3 className="text-white">
                🌍 Carte Interactive des Patients
              </h3>
              <button 
                onClick={() => setShowPatientMap(false)} 
                className="close-btn text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <PatientMap patients={patients} theme={theme} />
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowPatientMap(false)} 
                className="close-button"
                style={{
                  background: 'linear-gradient(135deg,rgb(78, 15, 226) 0%, #ec4899 100%)',
                  color: 'white'
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showTauxRemplissage && (
        <div className="modal-backdrop show">
          <div className="modal-container" style={{
            backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white',
            border: theme === 'dark' ? '1px solid #3a2d5a' : '1px solid #f3e8ff',
            boxShadow: theme === 'dark' ? '0 0 30px rgba(139, 92, 246, 0.3)' : '0 0 30px rgba(139, 92, 246, 0.2)',
            maxWidth: '90%',
            width: '700px',
            borderRadius: '16px'
          }}>
            <div className="modal-header" style={{ 
              background: 'linear-gradient(135deg,rgb(75, 3, 243)20, 239) 0%, #ec4899 100%)',
              borderBottom: 'none',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <h3 className="text-white">
                📊 Taux de remplissage aujourd’hui
              </h3>
              <button 
                onClick={() => setShowTauxRemplissage(false)} 
                className="close-btn text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <TauxRemplissage />
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowTauxRemplissage(false)} 
                className="close-button"
                style={{
                  background: 'linear-gradient(135deg,rgb(81, 12, 242) 0%, #ec4899 100%)',
                  color: 'white'
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showAvisStats && (
        <div className="modal-backdrop show" style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1050
        }}>
          <div className="modal-container animate__animated animate__fadeInUp" style={{
            background: "linear-gradient(145deg, #fdf4ff, #f5f3ff)",
            borderRadius: "20px",
            padding: "25px",
            width: "95%",
            maxWidth: "600px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            color: "#1f2937",
            fontFamily: "Segoe UI, sans-serif"
          }}>
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', color: "#6b21a8" }}>
                💬 Analyse des Avis Patients
              </h3>
              <button 
                onClick={() => setShowAvisStats(false)} 
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  color: "#6b7280",
                  cursor: "pointer"
                }}
              >
                &times;
              </button>
            </div>

            <div className="modal-body mt-4">
              {avisStats ? (
                <div className="text-center">
                  <p style={{ fontSize: '1.1rem' }}><strong>Total d'avis :</strong> {avisStats.totalAvis}</p>
                  <p style={{ fontSize: '1.1rem' }}><strong>Taux de satisfaction :</strong> <span style={{ color: "#10b981" }}>{Math.round(avisStats.tauxSatisfaction)}%</span></p>
                  <p style={{ fontSize: '1.1rem' }}><strong>Taux de mécontentement :</strong> <span style={{ color: "#ef4444" }}>{Math.round(avisStats.tauxMecontentement)}%</span></p>

                  <div className="progress mt-4" style={{ height: "25px", borderRadius: "12px", overflow: "hidden" }}>
                    <div className="progress-bar" role="progressbar"
                      style={{
                        width: `${avisStats.tauxSatisfaction}%`,
                        background: "linear-gradient(90deg, #10b981, #34d399)",
                        fontWeight: "bold",
                        color: "white"
                      }}>
                      {Math.round(avisStats.tauxSatisfaction)}%
                    </div>
                    <div className="progress-bar" role="progressbar"
                      style={{
                        width: `${avisStats.tauxMecontentement}%`,
                        background: "linear-gradient(90deg, #f43f5e, #ec4899)",
                        fontWeight: "bold",
                        color: "white"
                      }}>
                      {Math.round(avisStats.tauxMecontentement)}%
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center">Chargement des données...</p>
              )}
            </div>

            <div className="modal-footer text-center mt-4">
              <button 
                onClick={() => setShowAvisStats(false)} 
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(to right,rgb(51, 51, 234), #3b82f6)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}

function FichePatient({ theme }) {
  const iframeStyle = {
    backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white'
  };

  return (
    <div className="card shadow" style={{ 
      backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white', 
      color: theme === 'dark' ? 'white' : 'inherit',
      border: 'none',
      borderRadius: '16px'
    }}>
      <div className="card-header py-3" style={{ 
        background: 'linear-gradient(135deg,rgb(24, 21, 247) 0%, #ec4899 100%)',
        borderBottom: 'none',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }}>
        <h5 className="m-0 font-weight-bold text-white">Fiche Patient</h5>
      </div>
      <div className="card-body">
        <iframe
          src="http://127.0.0.1:8000/fiche-patient"
          style={{
            width: '100%',
            height: '80vh',
            border: 'none',
            borderRadius: '0.35rem',
            ...iframeStyle
          }}
          title="Fiche Patient"
        ></iframe>
      </div>
    </div>
  );
}

function Rdvs({ theme }) {
  const iframeStyle = {
    backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white'
  };

  return (
    <div className="card shadow" style={{ 
      backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white', 
      color: theme === 'dark' ? 'white' : 'inherit',
      border: 'none',
      borderRadius: '16px'
    }}>
      <div className="card-header py-3" style={{ 
        background: 'linear-gradient(135deg,rgb(84, 17, 239) 0%, #ec4899 100%)',
        borderBottom: 'none',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }}>
        <h5 className="m-0 font-weight-bold text-white">Rendez-vous</h5>
      </div>
      <div className="card-body">
        <iframe
          src="http://127.0.0.1:8000/voir-rendezvous"
          style={{
            width: '100%',
            height: '80vh',
            border: 'none',
            borderRadius: '0.35rem',
            ...iframeStyle
          }}
          title="Rendez-vous"
        ></iframe>
      </div>
    </div>
  );
}

function PatientsList({ theme }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/patients');
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des patients :", err);
        setError("Erreur lors du chargement des patients");
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="card shadow" style={{ 
      backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white', 
      color: theme === 'dark' ? 'white' : 'inherit',
      border: 'none',
      borderRadius: '16px'
    }}>
      <div className="card-header py-3 d-flex justify-content-between align-items-center" style={{ 
        background: 'linear-gradient(135deg,rgb(80, 16, 231) 0%, #ec4899 100%)',
        borderBottom: 'none',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }}>
        <h5 className="m-0 font-weight-bold text-white">Liste des Patients</h5>
        
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement en cours...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className={`table ${theme === 'dark' ? 'table-dark' : ''}`}>
            <thead>
  <tr>
    <th colSpan="6" style={{ 
      padding: 0,
      height: '75px', // Changé de 50px à 75px pour 2cm
      position: 'relative',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%'
      }}>
        {/* GIF 1 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <img 
            src="https://cdn.dribbble.com/userupload/23002793/file/original-3f028f30f7f023f692a0d341f2ca3741.gif" 
            alt="GIF 1"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        {/* GIF 2 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <img 
            src="https://cdn.pixabay.com/animation/2022/08/06/11/56/11-56-57-681_512.gif" 
            alt="GIF 2"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        {/* GIF 3 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <img 
            src="https://i.pinimg.com/originals/4b/22/93/4b229396885b90ea126258e5d19370ec.gif" 
            alt="GIF 3"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        {/* GIF 4 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <img 
            src="https://imgvisuals.com/cdn/shop/products/animated-patient-flow-illustration-943688.gif?v=1697071141" 
            alt="GIF 4"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    </th>
  </tr>
  <tr>
    <th>Patient</th>
    <th>Contact</th>
    <th>Adresse</th>
    <th>Date de naissance</th>
    <th>Inscrit le</th>
    <th>Actions</th>
  </tr>
</thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle me-3" style={{ 
                          width: '40px', 
                          height: '40px', 
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img 
              src="https://cdn.pixabay.com/animation/2022/07/29/14/46/14-46-18-128_512.gif" 
              alt="Patient" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
                          
                          <PersonCircle size={20} style={{ color: '#8b5cf6' }} />
                        </div>
                        <div>
                          <div className="fw-bold">{patient.name}</div>
                          <small className="text-muted">ID: {patient.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{patient.email}</div>
                      <small className="text-muted">{patient.tel}</small>
                    </td>
                    <td>{patient.adresse}</td>
                    <td>{patient.date_naissance}</td>
                    <td>{formatDate(patient.created_at)}</td>
                    <td>
                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Planning({ theme }) {
  const iframeStyle = {
    backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white'
  };

  return (
    <div className="card shadow" style={{ 
      backgroundColor: theme === 'dark' ? '#1e1a2e' : 'white', 
      color: theme === 'dark' ? 'white' : 'inherit',
      border: 'none',
      borderRadius: '16px'
    }}>
      <div className="card-header py-3" style={{ 
        background: 'linear-gradient(135deg,rgb(84, 17, 239) 0%, #ec4899 100%)',
        borderBottom: 'none',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }}>
        <h5 className="m-0 font-weight-bold text-white">Planning des rendez-vous</h5>
      </div>
      <div className="card-body">
        <iframe
          src="http://127.0.0.1:8000/planning"
          style={{
            width: '100%',
            height: '80vh',
            border: 'none',
            borderRadius: '0.35rem',
            ...iframeStyle
          }}
          title="Planning des rendez-vous"
        ></iframe>
      </div>
    </div>
  );
}


function Layout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const path = location.pathname;
    if (path === "/fiche-patient" || path === "/patients" || path === "/rdvs") {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
    
    document.body.style.backgroundColor = theme === 'dark' ? '#0f172a' : '#f8fafc';
  }, [location, theme]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const mainStyle = {
    backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
    minHeight: '100vh',
    transition: 'background-color 0.3s ease'
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className="d-flex">
        <Sidebar isCollapsed={isCollapsed} theme={theme} />
        <div className="flex-grow-1">
          <Header onToggleSidebar={toggleSidebar} toggleTheme={toggleTheme} theme={theme} />
          
          <div className="p-4" style={mainStyle}>
            <Routes>
              <Route path="/dashboard/secretaire" element={<DashboardSecretary theme={theme} />} />
              <Route path="/" element={<DashboardSecretary theme={theme} />} />
              <Route path="/rdvs" element={<Rdvs theme={theme} />} />
              <Route path="/patients" element={<PatientsList theme={theme} />} />
              <Route path="/fiche-patient" element={<FichePatient theme={theme} />} />
              <Route path="/planning" element={<Planning theme={theme} />} />
              <Route path="/urgences" element={<Planning theme={theme} />} />
              
            </Routes>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

const root = createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>
);

const style = document.createElement('style');
style.textContent = `
:root {
  --primary:rgb(16, 13, 229);
  --primary-light: rgba(139, 92, 246, 0.1);
  --pink:rgb(28, 74, 238);
  --success: #10b981;
  --info: #06b6d4;
  --warning: #f59e0b;
  --danger: #ef4444;
  --dark: #1e1a2e;
  --purple-500:rgb(28, 13, 234);
  --purple-600:rgb(58, 73, 237);
  --purple-700:rgb(81, 40, 217);
  --pink-200: #fbcfe8;
  --pink-500: #ec4899;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
.sidebar {
  width: 250px;
  padding: 0 0 1rem;
  min-height: 100vh;
  transition: all 0.3s ease;
  position: fixed;
  z-index: 1000;
  background: linear-gradient(180deg,rgb(11, 87, 211) 0%,rgb(10, 56, 239) 100%);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
}

.sidebar.collapsed {
  width: 80px;
  padding: 0 0 1rem;
  text-align: center;
}

.sidebar.collapsed .nav-link-custom {
  justify-content: center;
  text-align: center;
}

.nav-link-custom {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  padding: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border-left: 3px solid transparent;
}

.nav-link-custom:hover {
  color: white;
  background-color: rgba(99, 102, 241, 0.2);
  border-left: 3px solidrgb(16, 20, 229);
}

.nav-link-custom.active {
  color: white;
  font-weight: 600;
  background-color: rgba(99, 102, 241, 0.2);
  border-left: 3px solidrgb(22, 11, 228);
}

.sidebar h3 {
  color: #e0e7ff !important;
}

.header {
  position: sticky;
  top: 0;
  z-index: 999;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.25);
  border-color: var(--primary);
}

.card {
  border-radius: 0.5rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1.5rem 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  border-bottom: 1px solid rgba(167, 139, 250, 0.1);
  border-radius: 0;
}

.icon-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  border-radius: 100%;
}

.trend-success {
  color: #ec4899;
  background-color: rgba(236, 72, 153, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
}

.trend-info {
  color:rgb(85, 18, 240);
  background-color: rgba(139, 92, 246, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
}

.flex-grow-1 {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.sidebar.collapsed ~ .flex-grow-1 {
  margin-left: 80px;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #64748b;
  background-color: rgba(241, 245, 249, 0.5);
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
}

.table.dark th {
  color:rgb(81, 34, 221);
  background-color: rgba(30, 26, 46, 0.5);
  border-bottom: 1px solid #3a2d5a;
}

.table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.table.dark td {
  border-bottom: 1px solid #3a2d5a;
}

.table tr:last-child td {
  border-bottom: none;
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  letter-spacing: 0.05em;
}

.bg-purple-500 {
  background-color:rgb(29, 18, 241);
}

.bg-purple-600 {
  background-color:rgb(87, 6, 227);
}

.bg-purple-700 {
  background-color:rgb(13, 57, 233);
}

.bg-pink-200 {
  background-color: #fbcfe8;
}

.bg-pink-500 {
  background-color: #ec4899;
}

.text-purple-800 {
  color:rgb(33, 14, 236);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-backdrop.show {
  opacity: 1;
  pointer-events: all;
}

.modal-container {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 12px;
  overflow: hidden;
  transform: translateY(20px);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.modal-backdrop.show .modal-container {
  transform: translateY(0);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header.dark {
  border-bottom: 1px solid #3a2d5a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

.chart-container {
  margin-bottom: 30px;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  height: 300px;
  align-items: flex-end;
  gap: 10px;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  max-width: 40px;
}

.bar-label {
  margin-bottom: 10px;
  font-size: 12px;
  color: #64748b;
}

.bar-label.dark {
  color:rgb(59, 11, 203);
}

.bar-wrapper {
  flex-grow: 1;
  width: 100%;
  display: flex;
  justify-content: center;
}

.bar {
  width: 20px;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}

.bar-value {
  margin-top: 8px;
  font-size: 12px;
  font-weight: bold;
  color: #1e293b;
}

.bar-value.dark {
  color: white;
}

.bar-change {
  margin-top: 4px;
  font-size: 11px;
  font-weight: bold;
}

.bar-change.positive {
  color: #ec4899;
}

.bar-change.negative {
  color:rgb(94, 43, 211);
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 30px;
}

.summary-card {
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid;
  background-color: #f8fafc;
}

.summary-card.dark {
  background-color: #0f172a;
}

.summary-card h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #64748b;
}

.summary-card.dark h4 {
  color:rgb(58, 6, 214);
}

.summary-card p {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #1e293b;
}

.summary-card.dark p {
  color: white;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
}

.modal-footer.dark {
  border-top: 1px solid #3a2d5a;
}

.close-button {
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.close-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(139, 92, 246, 0.2);
  border-top-color:rgb(80, 10, 243);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.react-calendar {
  width: 100%;
  max-width: 100%;
  background: transparent;
  border: none;
  font-family: inherit;
}

.react-calendar__tile--active {
  background:rgb(75, 12, 223);
  color: white;
}

.react-calendar__tile--now {
  background: #f3e8ff;
  color:rgb(41, 10, 244);
}

.react-calendar__tile--hasActive {
  background:rgb(86, 30, 252);
}

.react-calendar__tile--hasActive:enabled:hover,
.react-calendar__tile--hasActive:enabled:focus {
  background:rgb(81, 18, 227);
}

.react-calendar__navigation button:enabled:hover,
.react-calendar__navigation button:enabled:focus {
  background-color: #f3e8ff;
}

.react-calendar__navigation button[disabled] {
  background-color: #f3e8ff;
}

.bg-purple-500 {
  background-color:rgb(96, 36, 237) !important;
  color: white !important;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
    padding: 0 0 1rem;
    text-align: center;
  }
  
  .sidebar .nav-link-custom {
    justify-content: center;
    text-align: center;
  }
  
  .flex-grow-1 {
    margin-left: 80px;
  }
}
`;
document.head.appendChild(style);
