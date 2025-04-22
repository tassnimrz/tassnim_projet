import React, { useState, useEffect, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import PatientChart from './PatientChart';
import PatientMap from './PatientMap';
import AlerteSanitaire from './AlerteSanitaire';
import TauxRemplissage from './TauxRemplissage';
import DameIAContextuelle from './DameIAContextuelle';
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
      backgroundColor: theme === 'dark' ? '#1e293b' : 'white',
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
      border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
    }}>
      <div className="card-header py-3 d-flex justify-content-between align-items-center" style={{ 
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
        borderBottom: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
      }}>
        <h6 className="m-0 font-weight-bold" style={{ color: '#3b82f6' }}>
          Assistant Secrétaire
        </h6>
        <span className="badge bg-primary">Beta</span>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '15px',
        backgroundColor: theme === 'dark' ? '#1e293b' : 'white'
      }}>
    
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
              backgroundColor: msg.sender === 'user' 
                ? '#3b82f6' 
                : theme === 'dark' 
                  ? '#334155' 
                  : '#f1f5f9',
              color: msg.sender === 'user' ? 'white' : theme === 'dark' ? 'white' : '#1e293b',
              whiteSpace: 'pre-line',
              boxShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              {msg.text}
              {msg.isStats && (
                <div className="mt-2">
                  <div className="progress" style={{ 
                    height: '8px', 
                    backgroundColor: theme === 'dark' ? '#475569' : '#e2e8f0',
                    borderRadius: '4px'
                  }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <small className="d-block mt-1" style={{ 
                    color: theme === 'dark' ? '#94a3b8' : '#64748b',
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
              backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
              color: theme === 'dark' ? 'white' : '#1e293b'
            }}>
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <span>Recherche en cours...</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-top" style={{ 
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
        borderTop: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
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
                  backgroundColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                  border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                  color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                  padding: '4px 12px'
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
              borderLeft: 'none'
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
    background: 'rgba(15, 23, 42, 0.9)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    boxShadow: '0 0 30px rgba(0,0,0,0.2)'
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} style={sidebarStyle}>
      <h3 className="fw-bold text-center mb-4 pt-3" style={{ color: '#60a5fa' }}>
        {isCollapsed ? '🩺' : 'MedCarePro'}
      </h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <NavLink to="/" className="nav-link-custom" end>
            <HouseDoor className="me-2" style={{ color: '#93c5fd' }} /> 
            {!isCollapsed && 'Dashboard'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/patients" className="nav-link-custom">
            <People className="me-2" style={{ color: '#93c5fd' }} /> 
            {!isCollapsed && 'Patients'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/rdvs" className="nav-link-custom">
            <CalendarCheck className="me-2" style={{ color: '#93c5fd' }} /> 
            {!isCollapsed && 'Rendez-vous'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/fiche-patient" className="nav-link-custom">
            <FileEarmarkMedical className="me-2" style={{ color: '#93c5fd' }} /> 
            {!isCollapsed && 'Fiche patient'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/billing" className="nav-link-custom">
            <Clipboard className="me-2" style={{ color: '#93c5fd' }} /> 
            {!isCollapsed && 'Facturation'}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

function Header({ onToggleSidebar, toggleTheme, theme }) {
  const [langue, setLangue] = useState('fr');
  const [searchText, setSearchText] = useState('');

  const headerStyle = {
    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
    color: theme === 'dark' ? 'white' : '#1e293b',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    boxShadow: '0 0 20px rgba(0,0,0,0.05)'
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
          style={{ border: 'none' }}
        >
          <List style={{ color: theme === 'dark' ? 'white' : '#3b82f6' }} />
        </button>

        <h5 className="mb-0 d-none d-md-block" style={{ color: '#3b82f6' }}>
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
          <button 
            className={`btn btn-sm dropdown-toggle ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-primary'}`}
            type="button"
            id="languageDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ border: 'none' }}
          >
            <Globe className="me-1" style={{ color: theme === 'dark' ? 'white' : '#3b82f6' }} /> 
            {langue === 'fr' ? 'FR' : 'EN'}
          </button>
          <ul className={`dropdown-menu ${theme === 'dark' ? 'bg-gray-800' : ''}`} aria-labelledby="languageDropdown">
            <li><button className={`dropdown-item ${theme === 'dark' ? 'text-white' : ''}`} onClick={() => setLangue('fr')}>🇫🇷 Français</button></li>
            <li><button className={`dropdown-item ${theme === 'dark' ? 'text-white' : ''}`} onClick={() => setLangue('en')}>🇬🇧 English</button></li>
          </ul>
        </div>

        <button 
          className={`btn btn-sm ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-primary'}`}
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          style={{ border: 'none' }}
        >
          {theme === 'dark' ? 
            <Sun style={{ color: 'white' }} /> : 
            <Moon style={{ color: '#3b82f6' }} />}
        </button>

        <div className="dropdown">
          <button 
            className="btn btn-sm dropdown-toggle d-flex align-items-center"
            type="button"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ border: 'none' }}
          >
            <div className="position-relative">
              <PersonCircle size={24} className="me-2" style={{ color: '#3b82f6' }} />
              <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle"></span>
            </div>
            <span className="fw-bold d-none d-md-inline">Mme Dupont</span>
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
    backgroundColor: theme === 'dark' ? '#1e293b' : 'white',
    color: theme === 'dark' ? 'white' : '#1e293b',
    borderLeft: '0.25rem solid #3b82f6',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default'
  };

  return (
    <div className="card mb-4 h-100" style={cardStyle} onClick={onClick}>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <div className="text-xs font-weight-bold text-uppercase mb-1" style={{ color: '#60a5fa' }}>
              {title}
            </div>
            <div className="h5 mb-0 font-weight-bold">
              {value}
            </div>
            {trend && (
              <div className="mt-2">
                <span style={{
                  background: trend.color === 'rose'
                    ? 'linear-gradient(90deg, #f472b6, #ec4899)'
                    : 'linear-gradient(90deg, #60a5fa, #3b82f6)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'white',
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
            <div className="icon-circle" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              {React.cloneElement(icon, { style: { color: '#3b82f6' } })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSecretary({ theme }) {
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
  const [loadingPatientStats, setLoadingPatientStats] = useState(false);

  useEffect(() => {
    // Charger le nombre de patients
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
      

    // Charger les rendez-vous du jour
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
        // 🧮 Calcul du taux de remplissage
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

// 📊 Mettre à jour la carte
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

// 🔊 Lecture vocale
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
                      : <GraphUp size={12} style={{ transform: 'rotate(180deg)', color: '#3b82f6' }} />
                  )
                } 
              } 
            : stat
        ));

        // Prochain rendez-vous
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

// Charger les stats des avis
axios.get('http://localhost:8000/api/avis/stats')
  .then(response => {
    const { tauxSatisfaction, tauxMecontentement, totalAvis } = response.data;

    // 🔊 Parle si supporté
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = `Le taux de satisfaction est de ${Math.round(tauxSatisfaction)} pour cent`;
      utterance.lang = 'fr-FR';
      speechSynthesis.speak(utterance);
    }

    // 🧠 Met à jour la carte
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



    // Charger les médecins
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
              rating: (4.5 + Math.random() * 0.5).toFixed(1),
              description: `Médecin avec ${Math.floor(5 + Math.random() * 15)} ans d'expérience`,
              image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
            });
          }
        });
        
        setDoctors(uniqueDoctors);
      })
      .catch(error => console.error("Erreur médecins:", error));

    // Charger les statistiques des avis
    axios.get('http://localhost:8000/api/avis/stats')
      .then(response => {
        setAvisStats(response.data);
      })
      .catch(error => console.error("Erreur avis:", error));

    // Rendez-vous à venir pour l'affichage
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
      // Conseil IA du jour entre 8h et 12h
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
    
      // Satisfaction
      if (tauxSatisfaction >= 80) {
        messages.push(`Taux de satisfaction : ${tauxSatisfaction}%. Très bon travail !`);
      } else if (tauxSatisfaction < 60) {
        messages.push(`Attention, le taux de satisfaction est bas (${tauxSatisfaction}%). Consultez les avis récents.`);
      }
    
      // Remplissage
      if (tauxRemplissage >= 90) {
        messages.push(`Planning très chargé aujourd’hui (${tauxRemplissage}%). Vous pourriez ajouter un médecin.`);
      } else if (tauxRemplissage <= 50) {
        messages.push(`Beaucoup de créneaux libres aujourd’hui (${tauxRemplissage}%). Relancez vos patients.`);
      }
    
      // RDV demain
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
    }, 10000); // disparaît après 10s
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
        <h1 className="h3 mb-0" style={{ color: theme === 'dark' ? 'white' : '#1e293b' }}>Tableau de bord</h1>
        <button className={`d-none d-sm-inline-block btn btn-sm shadow-sm ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
          <Plus size={16} className="me-1" />
          Générer un rapport
        </button>
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
            backgroundColor: theme === 'dark' ? '#1e293b' : 'white',
            border: 'none'
          }}>
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between" style={{ 
              backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
              <h6 className="m-0 font-weight-bold" style={{ color: '#3b82f6' }}>Visites mensuelles</h6>
              {avisStats && (
                <div className="d-flex gap-3">
                  <small className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>
                    {avisStats.tauxSatisfaction.toFixed(1)}% Satisfaction
                  </small>
                  <small className="text-danger">
                    <i className="fas fa-arrow-down me-1"></i>
                    {avisStats.tauxMecontentement.toFixed(1)}% Mécontentement
                  </small>
                </div>
              )}
            </div>
            <div className="card-body">
              <div className="chart-area">
                <div style={{ 
                  height: '320px', 
                  backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                  borderRadius: '0.5rem',
                  backgroundImage: 'url(https://via.placeholder.com/800x400?text=Hospital+Visits+Chart)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-center p-4" style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '0.5rem'
                    }}>
                      <h5 style={{ color: theme === 'dark' ? 'white' : '#1e293b' }}>Statistiques des visites</h5>
                      <p className="mb-0" style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                        Visualisation des données mensuelles des patients
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4" style={{ 
            backgroundColor: theme === 'dark' ? '#1e293b' : 'white',
            border: 'none'
          }}>
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between" style={{ 
              backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
              <h6 className="m-0 font-weight-bold" style={{ color: '#3b82f6' }}>Rendez-vous à venir</h6>
              
              <span className="badge bg-blue-500">{appointments.length}</span>
            </div>
            <div className="card-body">
              {appointments.length > 0 ? (
                appointments.map(appointment => (
                  <div key={appointment.id} className="mb-3">
                    <div className="d-flex align-items-center">
                      <div className={`me-3 p-2 rounded text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`} style={{ minWidth: '60px' }}>
                        <div className="font-weight-bold">{appointment.time}</div>
                        <div className="small text-xs" style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                          {appointment.type}
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="font-weight-bold" style={{ color: theme === 'dark' ? 'white' : '#1e293b' }}>
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
            backgroundColor: theme === 'dark' ? '#1e293b' : 'white',
            border: 'none'
          }}>
            <div className="card-header py-3" style={{ 
              backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
              <h6 className="m-0 font-weight-bold" style={{ color: '#3b82f6' }}>Liste des médecins</h6>
            </div>
            <div className="card-body">
              {doctors.length > 0 ? (
                doctors.map(doctor => (
                  <div key={doctor.id} className="mb-4">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name} 
                          className="rounded-circle" 
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="font-weight-bold mb-1" style={{ color: theme === 'dark' ? 'white' : '#1e293b' }}>
                            {doctor.name}
                          </h6>
                          <div className="badge bg-yellow-500 text-white">
                            {doctor.rating} ★
                          </div>
                        </div>
                        <div className="small mb-2" style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                          {doctor.specialty}
                        </div>
                        <p className="small mb-0" style={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>
                          {doctor.description}
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

      {showPatientStats && (
        <div className="modal-backdrop show">
          <div className="modal-container" style={{
            backgroundColor: theme === 'dark' ? '#1e293b' : 'white',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: theme === 'dark' ? '0 0 30px rgba(0,0,0,0.5)' : '0 0 30px rgba(0,0,0,0.2)'
          }}>
            <div className="modal-header">
              <h3 style={{ color: theme === 'dark' ? 'white' : '#1e293b' }}>Statistiques Mensuelles des Patients</h3>
              <button onClick={() => setShowPatientStats(false)} className="close-btn" style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
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
                    <div className="summary-card" style={{ borderColor: '#3b82f6' }}>
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
                  backgroundColor: theme === 'dark' ? '#3b82f6' : '#3b82f6',
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
      backgroundColor: theme === 'dark' ? '#1e293b' : 'white',
      border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: theme === 'dark' ? '0 0 30px rgba(0,0,0,0.5)' : '0 0 30px rgba(0,0,0,0.2)',
      maxWidth: '90%',
      width: '1000px'
    }}>
   <div className="modal-header">
        <h3 style={{ color: theme === 'dark' ? 'white' : '#1e293b' }}>
          🌍 Carte Interactive des Patients
        </h3>
        <button 
          onClick={() => setShowPatientMap(false)} 
          className="close-btn" 
          style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}
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
            backgroundColor: theme === 'dark' ? '#3b82f6' : '#3b82f6',
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
      backgroundColor: theme === 'dark' ? '#1e293b' : 'white',
      border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: theme === 'dark' ? '0 0 30px rgba(0,0,0,0.5)' : '0 0 30px rgba(0,0,0,0.2)',
      maxWidth: '90%',
      width: '700px'
    }}>
      <div className="modal-header">
        <h3 style={{ color: theme === 'dark' ? 'white' : '#1e293b' }}>
          📊 Taux de remplissage aujourd’hui
        </h3>
        <button 
          onClick={() => setShowTauxRemplissage(false)} 
          className="close-btn" 
          style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}
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
            backgroundColor: theme === 'dark' ? '#3b82f6' : '#3b82f6',
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
      background: "linear-gradient(145deg, #fce3ec, #deeafc)",
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
            background: "linear-gradient(to right, #9333ea, #3b82f6)",
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

<DameIAContextuelle 
  visible={showDameIA}
  message={messageDame}
  onClose={() => setShowDameIA(false)}
/>
<button
  onClick={() => activerDameIA("Bonjour, je suis votre assistante IA. Besoin d’aide ?")}
  style={{ position: 'fixed', bottom: 100, right: 20, zIndex: 10001 }}
>
  Test IA
</button>


    </div>

  );
  
}

function FichePatient({ theme }) {
  const iframeStyle = {
    backgroundColor: theme === 'dark' ? '#1e293b' : 'white'
  };

  return (
    <div className="card shadow" style={{ 
      backgroundColor: theme === 'dark' ? '#1e293b' : 'white', 
      color: theme === 'dark' ? 'white' : 'inherit',
      border: 'none'
    }}>
      <div className="card-header py-3" style={{ 
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <h5 className="m-0 font-weight-bold" style={{ color: '#3b82f6' }}>Fiche Patient</h5>
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
    backgroundColor: theme === 'dark' ? '#1e293b' : 'white'
  };

  return (
    <div className="card shadow" style={{ 
      backgroundColor: theme === 'dark' ? '#1e293b' : 'white', 
      color: theme === 'dark' ? 'white' : 'inherit',
      border: 'none'
    }}>
      <div className="card-header py-3" style={{ 
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <h5 className="m-0 font-weight-bold" style={{ color: '#3b82f6' }}>Rendez-vous</h5>
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
      backgroundColor: theme === 'dark' ? '#1e293b' : 'white', 
      color: theme === 'dark' ? 'white' : 'inherit',
      border: 'none'
    }}>
      <div className="card-header py-3 d-flex justify-content-between align-items-center" style={{ 
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <h5 className="m-0 font-weight-bold" style={{ color: '#3b82f6' }}>Liste des Patients</h5>
        <button className={`btn btn-sm ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
          <Plus size={16} className="me-1" />
          Ajouter un patient
        </button>
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
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <PersonCircle size={20} style={{ color: '#3b82f6' }} />
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
                      <button className="btn btn-sm btn-outline-primary me-2">
                        Voir
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        Éditer
                      </button>
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
              <Route path="/" element={<DashboardSecretary theme={theme} />} />
              <Route path="/rdvs" element={<Rdvs theme={theme} />} />
              <Route path="/patients" element={<PatientsList theme={theme} />} />
              <Route path="/fiche-patient" element={<FichePatient theme={theme} />} />
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
  --primary: #3b82f6;
  --primary-light: rgba(59, 130, 246, 0.1);
  --success: #10b981;
  --info: #06b6d4;
  --warning: #f59e0b;
  --danger: #ef4444;
  --dark: #1e293b;
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
  background-color: rgba(96, 165, 250, 0.2);
  border-left: 3px solid #60a5fa;
}

.nav-link-custom.active {
  color: white;
  font-weight: 600;
  background-color: rgba(96, 165, 250, 0.2);
  border-left: 3px solid #60a5fa;
}

.header {
  position: sticky;
  top: 0;
  z-index: 999;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
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
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
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
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
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
  color: #94a3b8;
  background-color: rgba(30, 41, 59, 0.5);
  border-bottom: 1px solid #334155;
}

.table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.table.dark td {
  border-bottom: 1px solid #334155;
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
  border-bottom: 1px solid #334155;
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
  color: #94a3b8;
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
  color: #3b82f6;
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
  color: #94a3b8;
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
  border-top: 1px solid #334155;
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
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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