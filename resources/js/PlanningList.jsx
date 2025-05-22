import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const PlanningList = () => {
  const [plannings, setPlannings] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [newPlanning, setNewPlanning] = useState({
    medecin_id: "",
    date: "",
    nombre_max_attente: "",
    nombre_max_patients: "",
    heure_debut: "",
    heure_fin: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchPlannings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/plannings");
      setPlannings(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des plannings :", error);
      toast.error("Erreur lors du chargement des plannings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMedecins = useCallback(async () => {
    try {
      const response = await axios.get("/api/medecins");
      setMedecins(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des médecins :", error);
      toast.error("Erreur lors du chargement des médecins");
    }
  }, []);

  useEffect(() => {
    fetchPlannings();
    fetchMedecins();
  }, [fetchPlannings, fetchMedecins]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlanning(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setNewPlanning({
      medecin_id: "",
      date: "",
      nombre_max_attente: "",
      nombre_max_patients: "",
      heure_debut: "",
      heure_fin: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    
    try {
      await axios.post("/api/plannings", newPlanning);
      await fetchPlannings();
      resetForm();
      setIsFormVisible(false);
      toast.success("Créneau ajouté avec succès !");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("Veuillez corriger les erreurs dans le formulaire");
      } else {
        console.error("Erreur lors de l'ajout du planning :", error);
        toast.error("Erreur lors de l'ajout du créneau");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  const filteredPlannings = plannings.filter(planning => {
    const matchesSearch = planning.medecin?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? planning.date === selectedDate : true;
    return matchesSearch && matchesDate;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
      try {
        await axios.delete(`/api/plannings/${id}`);
        await fetchPlannings();
        toast.success("Créneau supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        toast.error("Erreur lors de la suppression du créneau");
      }
    }
  };

  return (
    <div className="container-fluid px-0 planning-app">
      {/* Fond animé avec particules */}
      <div className="particles-background"></div>
      
      <div className="content-wrapper">
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          toastClassName="custom-toast"
          progressClassName="custom-toast-progress"
        />
        
        {/* En-tête avec effet de verre */}
        <motion.header 
          className="glass-card header-section"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="header-content text-center py-4">
            <motion.div 
              className="app-icon"
              whileHover={{ rotate: 15 }}
            >
              <i className="fas fa-calendar-check"></i>
            </motion.div>
            <h1 className="text-gradient mb-2">
              Gestion des Créneaux Médicaux
            </h1>
            <p className="tagline">
              Optimisez l'organisation des consultations de votre cabinet
            </p>
          </div>
        </motion.header>

        {/* Barre de contrôle moderne */}
        <motion.div 
          className="glass-card control-panel mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="search-box">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Rechercher un médecin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <motion.button
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <i className="fas fa-times"></i>
                  </motion.button>
                )}
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="date-picker-wrapper">
                <i className="fas fa-calendar-alt date-icon"></i>
                <input
                  type="date"
                  className="form-control date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-4 text-md-end">
              <motion.button
                className="primary-button"
                onClick={() => setIsFormVisible(!isFormVisible)}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(13, 110, 253, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <i className={`fas ${isFormVisible ? 'fa-minus' : 'fa-plus'} me-2`}></i>
                {isFormVisible ? 'Masquer le formulaire' : 'Nouveau créneau'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Formulaire avec animation élégante */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              className="glass-card form-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="form-header">
                <h3>
                  <i className="fas fa-calendar-plus me-2"></i>
                  Ajouter un nouveau créneau
                </h3>
                <div className="form-decoration"></div>
              </div>
              
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Médecin</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user-md"></i>
                      <select
                        className={`form-select ${errors.medecin_id ? 'is-invalid' : ''}`}
                        name="medecin_id"
                        value={newPlanning.medecin_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Choisir un médecin</option>
                        {medecins.map((medecin) => (
                          <option key={medecin.id} value={medecin.id}>
                            Dr. {medecin.name} - {medecin.specialite}
                          </option>
                        ))}
                      </select>
                      {errors.medecin_id && <div className="invalid-feedback">{errors.medecin_id[0]}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Date</label>
                    <div className="input-with-icon">
                      <i className="fas fa-calendar-day"></i>
                      <input
                        type="date"
                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                        name="date"
                        value={newPlanning.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.date && <div className="invalid-feedback">{errors.date[0]}</div>}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Places en salle d'attente</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user-friends"></i>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className={`form-control ${errors.nombre_max_attente ? 'is-invalid' : ''}`}
                        name="nombre_max_attente"
                        value={newPlanning.nombre_max_attente}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.nombre_max_attente && <div className="invalid-feedback">{errors.nombre_max_attente[0]}</div>}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Nombre de patients</label>
                    <div className="input-with-icon">
                      <i className="fas fa-procedures"></i>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        className={`form-control ${errors.nombre_max_patients ? 'is-invalid' : ''}`}
                        name="nombre_max_patients"
                        value={newPlanning.nombre_max_patients}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.nombre_max_patients && <div className="invalid-feedback">{errors.nombre_max_patients[0]}</div>}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Heure de début</label>
                    <div className="input-with-icon">
                      <i className="fas fa-clock"></i>
                      <input
                        type="time"
                        className={`form-control ${errors.heure_debut ? 'is-invalid' : ''}`}
                        name="heure_debut"
                        value={newPlanning.heure_debut}
                        onChange={handleInputChange}
                        required
                        step="900"
                      />
                      {errors.heure_debut && <div className="invalid-feedback">{errors.heure_debut[0]}</div>}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Heure de fin</label>
                    <div className="input-with-icon">
                      <i className="fas fa-clock"></i>
                      <input
                        type="time"
                        className={`form-control ${errors.heure_fin ? 'is-invalid' : ''}`}
                        name="heure_fin"
                        value={newPlanning.heure_fin}
                        onChange={handleInputChange}
                        required
                        step="900"
                      />
                      {errors.heure_fin && <div className="invalid-feedback">{errors.heure_fin[0]}</div>}
                    </div>
                  </div>

                  <div className="col-12 mt-4">
                    <div className="d-flex justify-content-end gap-3">
                      <motion.button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          resetForm();
                          setIsFormVisible(false);
                        }}
                        whileHover={{ 
                          scale: 1.03,
                          backgroundColor: '#f8f9fa'
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Annuler
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="primary-button"
                        disabled={isLoading}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: "0 5px 15px rgba(13, 110, 253, 0.4)"
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Enregistrer
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section principale avec les plannings */}
        <motion.div 
          className="glass-card main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="content-header">
            <div className="d-flex justify-content-between align-items-center">
              <h3>
                <i className="fas fa-list me-2"></i>
                Planning des consultations
              </h3>
              <div className="results-count">
                {filteredPlannings.length} créneau{filteredPlannings.length !== 1 ? 'x' : ''} trouvé{filteredPlannings.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {isLoading && plannings.length === 0 ? (
            <div className="loading-state">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="loading-spinner"
              >
                <i className="fas fa-circle-notch"></i>
              </motion.div>
              <p>Chargement des créneaux...</p>
            </div>
          ) : filteredPlannings.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon">
                <i className="fas fa-calendar-times"></i>
              </div>
              <h4>Aucun créneau correspondant</h4>
              <p>Essayez de modifier vos critères de recherche</p>
              <motion.button 
                className="primary-button outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDate('');
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Réinitialiser les filtres
              </motion.button>
            </motion.div>
          ) : (
            <div className="planning-grid">
              {filteredPlannings.map((planning) => (
                <motion.div 
                  key={planning.id}
                  className="planning-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                  }}
                >
                  <div className="planning-date">
                    <div className="date-badge">
                      <span className="day">{new Date(planning.date).getDate()}</span>
                      <span className="month">{new Date(planning.date).toLocaleString('fr-FR', { month: 'short' })}</span>
                    </div>
                    <div className="date-info">
                      <h5>{formatDate(planning.date)}</h5>
                      <span>{new Date(planning.date).toLocaleDateString('fr-FR', { weekday: 'long' })}</span>
                    </div>
                  </div>
                  
                  <div className="planning-doctor">
                    <div className="doctor-avatar">
                      <i className="fas fa-user-md"></i>
                    </div>
                    <div className="doctor-info">
                      <h6>Dr. {planning.medecin?.name || "Non spécifié"}</h6>
                      <span className="specialty">{planning.medecin?.specialite || "Généraliste"}</span>
                    </div>
                  </div>
                  
                  <div className="planning-time">
                    <i className="fas fa-clock"></i>
                    <span>{formatTime(planning.heure_debut)} - {formatTime(planning.heure_fin)}</span>
                  </div>
                  
                  <div className="planning-stats">
                    <div className="stat-item">
                      <i className="fas fa-user-friends"></i>
                      <span>{planning.nombre_max_attente} places</span>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-procedures"></i>
                      <span>{planning.nombre_max_patients} patients</span>
                    </div>
                  </div>
                  
                  <div className="planning-actions">
                    <motion.button
                      className="delete-button"
                      onClick={() => handleDelete(planning.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Cartes de statistiques */}
        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className="stat-card"
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon blue">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="stat-info">
              <h3>{medecins.length}</h3>
              <p>Médecins actifs</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon green">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="stat-info">
              <h3>{plannings.length}</h3>
              <p>Créneaux programmés</p>
            </div>
          </motion.div>
          
          
        </motion.div>

        {/* Pied de page moderne */}
        <motion.footer 
          className="app-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="footer-links">
            <a href="#">
              <i className="fas fa-question-circle"></i>
              <span>Aide</span>
            </a>
            <a href="#">
              <i className="fas fa-cog"></i>
              <span>Paramètres</span>
            </a>
            <a href="#">
              <i className="fas fa-envelope"></i>
              <span>Contact</span>
            </a>
          </div>
          <div className="footer-copyright">
            <p>
              <i className="fas fa-heart"></i>
              Cabinet Médical © {new Date().getFullYear()} - Tous droits réservés
            </p>
          </div>
        </motion.footer>
      </div>

      {/* Styles CSS intégrés */}
      <style>{`
        .planning-app {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
        }
        
        .particles-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #0d6efd20, #20c99720);
          z-index: 0;
          overflow: hidden;
        }
        
        .particles-background::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: particle-move 20s linear infinite;
        }
        
        @keyframes particle-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50%, 50%); }
        }
        
        .content-wrapper {
          position: relative;
          z-index: 1;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .header-section {
          padding: 2rem;
          margin-bottom: 2rem;
          text-align: center;
          background: linear-gradient(45deg, rgba(13, 110, 253, 0.1), rgba(32, 201, 151, 0.1));
        }
        
        .app-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(45deg, #0d6efd, #20c997);
          color: white;
          border-radius: 50%;
          font-size: 2rem;
          box-shadow: 0 5px 20px rgba(13, 110, 253, 0.3);
        }
        
        .text-gradient {
          background: linear-gradient(45deg, #0d6efd, #20c997);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 2.2rem;
        }
        
        .tagline {
          color: #6c757d;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .control-panel {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.9);
        }
        
        .search-box {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 2;
        }
        
        .search-input {
          padding-left: 40px;
          border-radius: 50px;
          border: 1px solid #e9ecef;
          height: 45px;
          transition: all 0.3s;
        }
        
        .search-input:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .clear-search {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          z-index: 2;
          cursor: pointer;
          padding: 5px;
        }
        
        .date-picker-wrapper {
          position: relative;
        }
        
        .date-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 2;
        }
        
        .date-input {
          padding-left: 40px;
          border-radius: 50px;
          border: 1px solid #e9ecef;
          height: 45px;
        }
        
        .primary-button {
          background: linear-gradient(45deg, #0d6efd, #20c997);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 10px 20px;
          font-weight: 500;
          transition: all 0.3s;
          height: 45px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .primary-button:hover {
          color: white;
          transform: translateY(-2px);
        }
        
        .primary-button.outline {
          background: transparent;
          border: 2px solid #0d6efd;
          color: #0d6efd;
        }
        
        .secondary-button {
          background: #f8f9fa;
          color: #495057;
          border: none;
          border-radius: 50px;
          padding: 10px 20px;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .form-section {
          padding: 2rem;
        }
        
        .form-header {
          margin-bottom: 2rem;
          position: relative;
        }
        
        .form-header h3 {
          color: #0d6efd;
          font-weight: 600;
        }
        
        .form-decoration {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(45deg, #0d6efd, #20c997);
          border-radius: 3px;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-with-icon i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 2;
        }
        
        .input-with-icon .form-control,
        .input-with-icon .form-select {
          padding-left: 40px;
          border-radius: 8px;
          height: 45px;
        }
        
        .main-content {
          padding: 2rem;
        }
        
        .content-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        
        .content-header h3 {
          color: #0d6efd;
          font-weight: 600;
        }
        
        .results-count {
          background: #f8f9fa;
          padding: 5px 15px;
          border-radius: 50px;
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .loading-state {
          text-align: center;
          padding: 3rem 0;
        }
        
        .loading-spinner {
          font-size: 2rem;
          color: #0d6efd;
          margin-bottom: 1rem;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 0;
        }
        
        .empty-icon {
          font-size: 3rem;
          color: #6c757d;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .empty-state h4 {
          color: #495057;
          margin-bottom: 0.5rem;
        }
        
        .empty-state p {
          color: #6c757d;
          margin-bottom: 1.5rem;
        }
        
        .planning-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .planning-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .planning-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #0d6efd, #20c997);
        }
        
        .planning-date {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .date-badge {
          width: 60px;
          height: 60px;
          background: #f8f9fa;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }
        
        .date-badge .day {
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 1;
          color: #0d6efd;
        }
        
        .date-badge .month {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #6c757d;
          margin-top: 3px;
        }
        
        .date-info h5 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
          color: #495057;
        }
        
        .date-info span {
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        .planning-doctor {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .doctor-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f0f7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          color: #0d6efd;
          font-size: 1.2rem;
        }
        
        .doctor-info h6 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
          color: #212529;
        }
        
        .doctor-info .specialty {
          font-size: 0.8rem;
          color: #20c997;
          background: rgba(32, 201, 151, 0.1);
          padding: 2px 8px;
          border-radius: 50px;
          display: inline-block;
        }
        
        .planning-time {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background: rgba(13, 110, 253, 0.05);
          border-radius: 8px;
        }
        
        .planning-time i {
          color: #0d6efd;
          margin-right: 0.75rem;
          font-size: 1.1rem;
        }
        
        .planning-time span {
          font-weight: 500;
          color: #495057;
        }
        
        .planning-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .stat-item {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .stat-item i {
          margin-right: 0.5rem;
          color: #6c757d;
        }
        
        .stat-item span {
          font-size: 0.9rem;
          color: #495057;
        }
        
        .planning-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .delete-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          border: none;
          transition: all 0.3s;
        }
        
        .delete-button:hover {
          background: rgba(220, 53, 69, 0.2);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
          font-size: 1.5rem;
          color: white;
        }
        
                .stat-icon.blue {
          background: linear-gradient(45deg, #0d6efd, #3d8bfd);
        }
        
        .stat-icon.green {
          background: linear-gradient(45deg, #20c997, #3dd9a0);
        }
        
        .stat-icon.purple {
          background: linear-gradient(45deg, #6f42c1, #8c65d3);
        }
        
        .stat-info h3 {
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
          color: #212529;
        }
        
        .stat-info p {
          color: #6c757d;
          margin-bottom: 0;
          font-size: 0.9rem;
        }
        
        .app-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          text-align: center;
          border-top: 1px solid rgba(0,0,0,0.05);
        }
        
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .footer-links a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
          text-decoration: none;
          transition: all 0.3s;
        }
        
        .footer-links a:hover {
          color: #0d6efd;
        }
        
        .footer-copyright {
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .footer-copyright i {
          color: #dc3545;
          margin: 0 5px;
        }
        
        .custom-toast {
          border-radius: 12px !important;
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: #212529 !important;
        }
        
        .custom-toast-progress {
          background: linear-gradient(45deg, #0d6efd, #20c997) !important;
        }
        
        @media (max-width: 768px) {
          .planning-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .footer-links {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

const planningRoot = document.getElementById("planning-root");
if (planningRoot) {
  ReactDOM.createRoot(planningRoot).render(
    <React.StrictMode>
      <PlanningList />
    </React.StrictMode>
  );
}