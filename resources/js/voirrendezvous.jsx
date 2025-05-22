import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { Modal, Badge, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Styles CSS
const styles = `
.medical-dashboard {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px;
}

.dashboard-header {
  background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-time {
  font-size: 0.9rem;
  opacity: 0.9;
}

.btn-refresh {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 10px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0 0 5px 0;
}

.stat-card p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.stat-card i {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2.5rem;
  opacity: 0.2;
}

.blue { background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%); }
.green { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.orange { background: linear-gradient(135deg, #f46b45 0%, #eea849 100%); }
.red { background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); }

.main-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-filter-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  font-size: 0.9rem;
}

.sort-filter select {
  padding: 10px 15px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  font-size: 0.9rem;
  background-color: white;
}

.appointments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.appointment-card {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  background: white;
}

.appointment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.appointment-number {
  font-weight: bold;
  color: #495057;
}

.card-body {
  padding: 15px;
}

.patient-card {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.patient-avatar {
  width: 50px;
  height: 50px;
  background-color: #3a7bd5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
}

.patient-info h5 {
  margin: 0;
  font-size: 1rem;
}

.patient-info span {
  font-size: 0.8rem;
  color: #6c757d;
}

.appointment-details {
  display: grid;
  gap: 10px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.detail-row i {
  color: #3a7bd5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.appointment-date small {
  color: #6c757d;
  font-size: 0.8rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 15px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  color: #6c757d;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 15px;
}

.modal-header {
  background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-footer {
  background-color: #f8f9fa;
}

.btn-close-modal {
  background: #3a7bd5;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-close-modal:hover {
  background: #2c65c7;
}

.patient-details-container {
  display: grid;
  gap: 20px;
}

.patient-profile {
  text-align: center;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background-color: #3a7bd5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 15px;
}

.patient-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.info-card.span-2 {
  grid-column: span 2;
}

.info-icon {
  width: 40px;
  height: 40px;
  background-color: #e9f0ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3a7bd5;
  margin-bottom: 10px;
}

.info-content h6 {
  margin: 0 0 5px 0;
  font-size: 0.8rem;
  color: #6c757d;
}

.info-content p {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.heartbeat {
  animation: heartbeat 1.5s infinite;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr 1fr;
  }
  
  .search-filter-container {
    flex-direction: column;
  }
  
  .appointments-grid {
    grid-template-columns: 1fr;
  }
  
  .patient-info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-card.span-2 {
    grid-column: span 1;
  }
}
`;

// Composant StatCard
const StatCard = React.memo(({ value, label, icon, color }) => (
  <div className={`stat-card ${color}`}>
    <h3>{value}</h3>
    <p>{label}</p>
    <i className={`bi bi-${icon}`}></i>
  </div>
));

// Composant PatientCard avec affichage de l'âge
const PatientCard = React.memo(({ patient, onClick }) => {
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = patient?.date_naissance ? calculateAge(patient.date_naissance) : null;

  return (
    <div className="patient-card" onClick={onClick}>
      <div className="patient-avatar">
        {patient?.name?.charAt(0) || '?'}
      </div>
      <div className="patient-info">
        <h5>{patient?.name || 'N/A'}</h5>
        {age && <span>{age} ans</span>}
      </div>
    </div>
  );
});

// Composant InfoCard amélioré
const InfoCard = React.memo(({ icon, title, value, span = 1 }) => {
  // Formatage spécial pour le téléphone
  const formatValue = (title, val) => {
    if (!val) return 'N/A';
    if (title.toLowerCase().includes('téléphone')) {
      return val.toString().replace(/(\d{2})(?=\d)/g, '$1 ');
    }
    return val;
  };

  return (
    <div className={`info-card span-${span}`}>
      <div className="info-icon">
        <i className={`bi bi-${icon}`}></i>
      </div>
      <div className="info-content">
        <h6>{title}</h6>
        <p>{formatValue(title, value)}</p>
      </div>
    </div>
  );
});

// Composant AppointmentCard
const AppointmentCard = React.memo(({ rdv, index, getPriorityBadge, getStatusBadge, onClick }) => (
  <div className="appointment-card" onClick={onClick}>
    <div className="card-header">
      <span className="appointment-number">#{index + 1}</span>
      <div className="appointment-status">
        {getStatusBadge(rdv.statut)}
      </div>
    </div>
    <div className="card-body">
      <PatientCard patient={rdv.patient} onClick={e => e.stopPropagation()} />
      <div className="appointment-details">
        <div className="detail-row">
          <i className="bi bi-calendar"></i>
          <span>{rdv.planning_jour?.date ? new Date(rdv.planning_jour.date).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="detail-row">
          <i className="bi bi-clock"></i>
          <span>{rdv.planning_jour?.heure_debut} - {rdv.planning_jour?.heure_fin}</span>
        </div>
        <div className="detail-row">
          <i className="bi bi-person-badge"></i>
          <span>{rdv.medecin?.name || 'N/A'}</span>
        </div>
      </div>
    </div>
    <div className="card-footer">
      <div className="priority-badge">
        {getPriorityBadge(rdv.priorite)}
      </div>
      <div className="appointment-date">
        <small>Créé le {new Date(rdv.created_at).toLocaleDateString()}</small>
      </div>
    </div>
  </div>
));

// Composant PatientDetailsModal corrigé
const PatientDetailsModal = React.memo(({ show, onHide, patient }) => {
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatGender = (gender) => {
    if (!gender) return 'N/A';
    return gender === 'M' ? 'Masculin' : gender === 'F' ? 'Féminin' : gender;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>
          <i className="bi bi-person-lines-fill"></i>
          Détails du Patient
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {patient ? (
          <div className="patient-details-container">
            <div className="patient-profile">
              <div className="profile-avatar">
                {patient.name?.charAt(0) || '?'}
              </div>
              <h3>{patient.name || 'N/A'}</h3>
              <p className="text-muted">
                {patient.date_naissance 
                  ? `${calculateAge(patient.date_naissance)} ans` 
                  : 'Âge non disponible'}
              </p>
            </div>
            <div className="patient-info-grid">
              <InfoCard 
                icon="calendar-heart" 
                title="Date de naissance" 
                value={patient.date_naissance ? new Date(patient.date_naissance).toLocaleDateString() : 'N/A'} 
              />
              
              
              <InfoCard 
                icon="envelope" 
                title="Email" 
                value={patient.email} 
              />
              <InfoCard 
                icon="geo-alt" 
                title="Adresse" 
                value={patient.adresse} 
                span={2} 
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <button className="btn-close-modal" onClick={onHide}>
          <i className="bi bi-x-lg"></i> Fermer
        </button>
      </Modal.Footer>
    </Modal>
  );
});

// Composant principal
function VoirRendezVous() {
    const [rendezVous, setRendezVous] = useState([]);
    const [tri, setTri] = useState('date');
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Mise à jour de l'heure
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch des rendez-vous
    const fetchRendezVous = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/tous-rendezvous');
            
            if (Array.isArray(res.data)) {
                setRendezVous(res.data);
            } else if (Array.isArray(res.data.rendezvous)) {
                setRendezVous(res.data.rendezvous);
            }
        } catch (error) {
            console.error("Erreur API:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRendezVous(); }, [fetchRendezVous]);

    // Fonction de tri
    const trier = useCallback((valeur) => setTri(valeur), []);

    // Tri optimisé
    const rendezVousTries = useMemo(() => {
        if (!Array.isArray(rendezVous)) return [];
        
        const copie = [...rendezVous];
        switch (tri) {
            case 'date': return copie.sort((a, b) => new Date(a.planning_jour?.date) - new Date(b.planning_jour?.date));
            case 'creation': return copie.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            case 'priorite': return copie.sort((a, b) => (b.priorite || 0) - (a.priorite || 0));
            case 'statut': return copie.sort((a, b) => (a.statut || '').localeCompare(b.statut || ''));
            default: return copie;
        }
    }, [rendezVous, tri]);

    // Filtrage optimisé
    const filteredRendezVous = useMemo(() => {
        if (!searchTerm) return rendezVousTries;
        
        return rendezVousTries.filter(rdv => 
            (rdv.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (rdv.medecin?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (rdv.planning_jour?.date?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [rendezVousTries, searchTerm]);

    // Statistiques corrigées (insensibles à la casse)
    const stats = useMemo(() => {
        if (!Array.isArray(filteredRendezVous)) return { total: 0, confirmed: 0, pending: 0, urgent: 0 };

        const confirmedCount = filteredRendezVous.reduce((count, rdv) => {
            const statut = rdv.statut?.toString().toLowerCase() || '';
            return count + (statut.includes('confirm') ? 1 : 0);
        }, 0);

        const pendingCount = filteredRendezVous.reduce((count, rdv) => {
            const statut = rdv.statut?.toString().toLowerCase() || '';
            return count + (statut.includes('attente') || statut.includes('pending') ? 1 : 0);
        }, 0);

        const urgentCount = filteredRendezVous.filter(r => r.priorite === 1).length;

        return {
            total: filteredRendezVous.length,
            confirmed: confirmedCount,
            pending: pendingCount,
            urgent: urgentCount
        };
    }, [filteredRendezVous]);

    // Badges mémoïsés
    const getPriorityBadge = useCallback((priority) => {
        switch(priority) {
            case 1: return <Badge bg="danger">Urgent</Badge>;
            case 2: return <Badge bg="warning" text="dark">Important</Badge>;
            default: return <Badge bg="secondary">Normal</Badge>;
        }
    }, []);

    const getStatusBadge = useCallback((status) => {
        switch(status?.toLowerCase()) {
            case 'confirmé': return <Badge bg="success">Confirmé</Badge>;
            case 'annulé': return <Badge bg="danger">Annulé</Badge>;
            case 'en attente': return <Badge bg="info">En attente</Badge>;
            case 'pending': return <Badge bg="info">En attente</Badge>;
            case 'terminé': return <Badge bg="primary">Terminé</Badge>;
            default: return <Badge bg="secondary">{status || 'N/A'}</Badge>;
        }
    }, []);

    return (
        <>
            <style>{styles}</style>
            <div className="medical-dashboard">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>
                            <i className="bi bi-calendar-heart heartbeat"></i>
                            rendez vous Médical
                        </h1>
                        <div className="header-time">
                            {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
                        </div>
                    </div>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Actualiser</Tooltip>}>
                        <button className="btn-refresh" onClick={fetchRendezVous}>
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>
                    </OverlayTrigger>
                </header>

                {/* Statistiques */}
                <div className="stats-cards">
                    <StatCard value={stats.total} label="Rendez-vous" icon="calendar-week" color="blue" />
                    <StatCard value={stats.confirmed} label="Confirmés" icon="check-circle" color="green" />
                    <StatCard value={stats.pending} label="En attente" icon="hourglass" color="orange" />
                    <StatCard value={stats.urgent} label="Urgents" icon="exclamation-triangle" color="red" />
                </div>

                {/* Contenu principal */}
                <div className="main-content">
                    <div className="search-filter-container">
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder="Rechercher un patient, médecin..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="sort-filter">
                            <select value={tri} onChange={e => trier(e.target.value)}>
                                <option value="date">Date consultation</option>
                                <option value="creation">Date création</option>
                                <option value="priorite">Priorité</option>
                                <option value="statut">Statut</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <Spinner animation="border" variant="primary" />
                            <p>Chargement des rendez-vous...</p>
                        </div>
                    ) : (
                        <div className="appointments-grid">
                            {filteredRendezVous.length > 0 ? (
                                filteredRendezVous.map((rdv, index) => (
                                    <AppointmentCard 
                                        key={`${rdv.id}_${index}`}
                                        rdv={rdv}
                                        index={index}
                                        getPriorityBadge={getPriorityBadge}
                                        getStatusBadge={getStatusBadge}
                                        onClick={() => {
                                            setSelectedPatient(rdv.patient);
                                            setShowModal(true);
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="no-results">
                                    <i className="bi bi-calendar-x"></i>
                                    <p>Aucun rendez-vous trouvé</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal des détails */}
                <PatientDetailsModal 
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    patient={selectedPatient}
                />
            </div>
        </>
    );
}

// Injection des styles dans le DOM
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

// Initialisation React
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<VoirRendezVous />);