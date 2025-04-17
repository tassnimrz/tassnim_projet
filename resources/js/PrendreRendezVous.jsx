import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 🎨 Palette de couleurs
const colors = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  primaryDark: '#1d4ed8',
  background: '#f8fafc',
  text: '#1e293b',
  lightText: '#64748b',
  white: '#ffffff',
  success: '#16a34a',
  warning: '#d97706',
  error: '#dc2626'
};

// ✨ Composant de notification
const ReservationStatus = ({ status, patientName, onClose, onDelete, errorType = 'alreadyBooked', message }) => {
  const statusConfig = {
    confirmed: {
      emoji: '🎉',
      title: 'Rendez-vous confirmé !',
      message: message || `Votre rendez-vous est confirmé ${patientName ? `Cher ${patientName}` : ''}`,
      color: colors.success,
      bgColor: '#f0fdf4'
    },
    waiting: {
      emoji: '⏳',
      title: 'Liste d\'attente',
      message: message || `${patientName ? `Cher ${patientName}, ` : ''}vous êtes sur liste d'attente. Nous vous contacterons si une place se libère !`,
      color: colors.warning,
      bgColor: '#fffbeb'
    },
    error: {
      alreadyBooked: {
        emoji: '❌',
        title: 'Désolé',
        message: message || `${patientName ? `Cher ${patientName}, ` : ''}vous avez déjà un rendez-vous pour ce jour`,
        color: colors.error,
        bgColor: '#fef2f2'
      },
      fullSlot: {
        emoji: '🚫',
        title: 'Complet',
        message: message || `${patientName ? `Cher ${patientName}, ` : ''}désolé, toutes les places sont occupées pour ce créneau`,
        color: colors.error,
        bgColor: '#fef2f2'
      }
    }
  };

  const config = status === 'error' 
    ? statusConfig.error[errorType] || statusConfig.error.alreadyBooked
    : statusConfig[status];

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '500px',
      padding: '2rem',
      borderRadius: '16px',
      backgroundColor: config.bgColor,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1rem',
        animation: status === 'waiting' ? 'pulse 2s infinite' : 'none'
      }}>
        {config.emoji}
      </div>
      <h2 style={{ 
        color: config.color,
        marginBottom: '1rem',
        fontSize: '1.8rem'
      }}>
        {config.title}
      </h2>
      <p style={{
        color: colors.text,
        fontSize: '1.2rem',
        lineHeight: 1.6,
        marginBottom: '2rem'
      }}>
        {config.message}
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: config.color,
            color: colors.white,
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s',
            ':hover': {
              opacity: 0.9
            }
          }}
        >
          Compris
        </button>
        
        {(status === 'confirmed' || status === 'waiting') && (
          <button 
            onClick={onDelete}
            style={{
              backgroundColor: colors.error,
              color: colors.white,
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s',
              ':hover': {
                opacity: 0.9
              }
            }}
          >
            Annuler le rendez-vous
          </button>
        )}
      </div>
    </div>
  );
};

// 🏠 Composant Carte de créneau
const TimeSlotCard = ({ slot, onReserve, isReserved }) => {
  return (
    <div style={{
      backgroundColor: colors.white,
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      padding: '1.5rem',
      transition: 'all 0.3s ease',
      border: '1px solid #e2e8f0',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 15px rgba(37, 99, 235, 0.1)'
      }
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.25rem', 
          color: colors.primaryDark,
          fontWeight: 600
        }}>
          Dr. {slot.medecin?.name}
        </h3>
        <span style={{
          backgroundColor: '#dbeafe',
          color: colors.primaryDark,
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {slot.date}
        </span>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.primary}>
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span style={{ color: colors.text }}>
            {slot.heure_debut} - {slot.heure_fin}
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: colors.success
            }}></div>
            <span style={{ fontSize: '0.875rem', color: colors.lightText }}>
              {slot.nombre_max_patients} places
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#f59e0b'
            }}></div>
            <span style={{ fontSize: '0.875rem', color: colors.lightText }}>
              {slot.nombre_max_attente} attente
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onReserve(slot.id, slot.medecin.id)}
        style={{
          backgroundColor: isReserved ? colors.error : colors.primary,
          color: colors.white,
          border: 'none',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          width: '100%',
          transition: 'background-color 0.3s',
          fontWeight: 500,
          ':hover': {
            backgroundColor: isReserved ? '#b91c1c' : colors.primaryDark
          }
        }}
      >
        {isReserved ? 'Annuler le rendez-vous' : 'Réserver ce créneau'}
      </button>
    </div>
  );
};

// 🏠 Page d'accueil
const App = () => {
  const [plannings, setPlannings] = useState([]);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [patientRendezVous, setPatientRendezVous] = useState([]);

  const fetchRendezVous = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/rendez-vous', {
        withCredentials: true
      });
      setPatientRendezVous(response.data);
    } catch (error) {
      console.error('Erreur chargement rendez-vous:', error);
    }
  };

  useEffect(() => {
    axios.get('/api/plannings')
      .then(response => setPlannings(response.data))
      .catch(error => console.error('Erreur chargement:', error));
    
    fetchRendezVous();
  }, []);

  const handleDeleteRendezVous = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/rendez-vous/${id}`, {
        withCredentials: true
      });
      setReservationStatus({
        status: 'confirmed',
        message: 'Rendez-vous annulé avec succès'
      });
      fetchRendezVous();
    } catch (error) {
      setReservationStatus({
        status: 'error',
        message: 'Échec de l\'annulation'
      });
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: colors.background,
      minHeight: '100vh'
    }}>
      {reservationStatus && (
        <ReservationStatus 
          status={reservationStatus.status}
          patientName={reservationStatus.patientName}
          message={reservationStatus.message}
          onClose={() => setReservationStatus(null)}
          onDelete={() => handleDeleteRendezVous(patientRendezVous[0]?.id)}
          errorType={reservationStatus.errorType}
        />
      )}

      <div style={{
        color: colors.primary,
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
          <span style={{ color: colors.primary }}>📅</span> Créneaux disponibles
        </h1>
        <Link to="/rendez-vous" style={{
          backgroundColor: colors.primary,
          color: colors.white,
          border: 'none',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 500,
          transition: 'background-color 0.3s',
          ':hover': {
            backgroundColor: colors.primaryDark
          }
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.white}>
            <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Nouveau rendez-vous
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {plannings.map(slot => (
          <TimeSlotCard 
            key={slot.id} 
            slot={slot}
            onReserve={(id, medecinId) => {
              if (patientRendezVous.some(r => r.planning_jour_id === id)) {
                handleDeleteRendezVous(patientRendezVous.find(r => r.planning_jour_id === id).id);
              } else {
                // Logique de réservation si nécessaire
              }
            }}
            isReserved={patientRendezVous.some(r => r.planning_jour_id === slot.id)}
          />
        ))}
      </div>
    </div>
  );
};

// 📝 Page de rendez-vous
const PrendreRendezVous = () => {
  const [plannings, setPlannings] = useState([]);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [currentRendezVous, setCurrentRendezVous] = useState(null);
  const [reservedSlots, setReservedSlots] = useState([]);
  const navigate = useNavigate();

  const patient = (() => {
    try {
      const root = document.getElementById('root');
      return root?.dataset?.patient ? JSON.parse(root.dataset.patient) : null;
    } catch (err) {
      console.error('Erreur de parsing du patient :', err);
      return null;
    }
  })();

  useEffect(() => {
    axios.get('/api/plannings')
      .then(res => setPlannings(res.data))
      .catch(err => {
        console.error('Erreur chargement:', err);
        if (err.response?.status === 401) {
          setReservationStatus({
            status: 'error',
            errorType: 'alreadyBooked',
            message: 'Veuillez vous connecter pour réserver un créneau'
          });
        }
      });

    if (patient?.id) {
      axios.get('http://127.0.0.1:8000/rendez-vous', { withCredentials: true })
        .then(response => {
          // Correction ici: vérifier si response.data est un tableau avant d'utiliser map
          const data = Array.isArray(response.data) ? response.data : [];
          setReservedSlots(data.map(r => r.planning_jour_id));
        })
        .catch(error => console.error('Erreur chargement rendez-vous:', error));
    }
  }, [patient]);

  const reserver = async (planningJourId, medecinId) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/rendez-vous/reserver', 
        { planning_jour_id: planningJourId, medecin_id: medecinId },
        { withCredentials: true }
      );
      
      const isWaitlisted = response.data?.rendezVous?.statut === 'attente';
      const rendezVous = response.data?.rendezVous;
      setCurrentRendezVous(rendezVous);
      setReservedSlots([...reservedSlots, planningJourId]);
      
      setReservationStatus({
        status: isWaitlisted ? 'waiting' : 'confirmed',
        patientName: patient?.name
      });

      if (!isWaitlisted) {
        setTimeout(() => navigate('/'), 3000);
      }

    } catch (error) {
      if (error.response?.status === 409) {
        const isFull = error.response.data.message?.includes('complet') || 
                      error.response.data.message?.includes('places disponibles');
        setReservationStatus({
          status: 'error',
          patientName: patient?.name,
          errorType: isFull ? 'fullSlot' : 'alreadyBooked'
        });
      } else {
        console.error('Erreur réservation:', error);
        setReservationStatus({
          status: 'error',
          errorType: 'alreadyBooked'
        });
      }
    }
  };

  const handleDeleteRendezVous = async () => {
    if (!currentRendezVous?.id) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/rendez-vous/${currentRendezVous.id}`, {
        withCredentials: true
      });
      setReservedSlots(reservedSlots.filter(id => id !== currentRendezVous.planning_jour_id));
      setReservationStatus({
        status: 'confirmed',
        message: 'Rendez-vous annulé avec succès'
      });
      const response = await axios.get('/api/plannings');
      setPlannings(response.data);
    } catch (error) {
      console.error('Erreur suppression:', error);
      setReservationStatus({
        status: 'error',
        errorType: 'alreadyBooked'
      });
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: colors.background,
      minHeight: '100vh',
      position: 'relative'
    }}>
      {reservationStatus && (
        <ReservationStatus 
          status={reservationStatus.status}
          patientName={reservationStatus.patientName}
          onClose={() => setReservationStatus(null)}
          onDelete={handleDeleteRendezVous}
          errorType={reservationStatus.errorType}
          message={reservationStatus.message}
        />
      )}

      <div style={{
        color: colors.primary,
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
          <span style={{ color: colors.primary }}>📝</span> Prendre un rendez-vous
        </h1>
        <button 
          onClick={() => navigate('/')} 
          style={{
            backgroundColor: colors.white,
            color: colors.primary,
            border: `1px solid ${colors.primary}`,
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500,
            transition: 'all 0.3s',
            ':hover': {
              backgroundColor: '#f0f5ff'
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
            <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {plannings.map(slot => (
          <TimeSlotCard 
            key={slot.id} 
            slot={slot} 
            onReserve={reserver}
            isReserved={reservedSlots.includes(slot.id)}
          />
        ))}
      </div>
    </div>
  );
};

// 🚀 Initialisation de l'application
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

const styleElement = document.createElement('style');
styleElement.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -40%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(styleElement);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/rendez-vous" element={<PrendreRendezVous />} />
    </Routes>
  </Router>
);