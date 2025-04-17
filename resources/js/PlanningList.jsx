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
    <div className="container-fluid px-4 py-4 background-container">
      <div className="content-overlay">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* En-tête moderne */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-5"
        >
          <h1 className="text-gradient mb-3">
            <i className="fas fa-calendar-alt me-2"></i>
            Gestion des Créneaux Médicaux
          </h1>
          <p className="lead text-muted">
            Optimisez l'organisation des consultations de votre cabinet
          </p>
        </motion.div>

        {/* Barre de contrôle */}
        <motion.div 
          className="card mb-4 border-0 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-body p-3">
            <div className="row align-items-center">
              <div className="col-md-4 mb-2 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher un médecin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4 mb-2 mb-md-0">
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="col-md-4 text-md-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary"
                  onClick={() => setIsFormVisible(!isFormVisible)}
                >
                  <i className={`fas ${isFormVisible ? 'fa-minus' : 'fa-plus'} me-2`}></i>
                  {isFormVisible ? 'Masquer le formulaire' : 'Nouveau créneau'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulaire avec animation */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="card mb-4 border-0 shadow-sm"
            >
              <div className="card-header bg-white border-0">
                <h4 className="mb-0 text-primary">
                  <i className="fas fa-calendar-plus me-2"></i>
                  Ajouter un nouveau créneau
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Médecin</label>
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

                    <div className="col-md-6">
                      <label className="form-label">Date</label>
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

                    <div className="col-md-3">
                      <label className="form-label">Places en salle d'attente</label>
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

                    <div className="col-md-3">
                      <label className="form-label">Nombre de patients</label>
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

                    <div className="col-md-3">
                      <label className="form-label">Heure de début</label>
                      <input
                        type="time"
                        className={`form-control ${errors.heure_debut ? 'is-invalid' : ''}`}
                        name="heure_debut"
                        value={newPlanning.heure_debut}
                        onChange={handleInputChange}
                        required
                        step="900" // 15 minutes
                      />
                      {errors.heure_debut && <div className="invalid-feedback">{errors.heure_debut[0]}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Heure de fin</label>
                      <input
                        type="time"
                        className={`form-control ${errors.heure_fin ? 'is-invalid' : ''}`}
                        name="heure_fin"
                        value={newPlanning.heure_fin}
                        onChange={handleInputChange}
                        required
                        step="900" // 15 minutes
                      />
                      {errors.heure_fin && <div className="invalid-feedback">{errors.heure_fin[0]}</div>}
                    </div>

                    <div className="col-12 mt-3 d-flex justify-content-end gap-2">
                      <motion.button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          resetForm();
                          setIsFormVisible(false);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Annuler
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
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
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des plannings */}
        <motion.div 
          className="card border-0 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header bg-white border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0 text-primary">
                <i className="fas fa-list me-2"></i>
                Planning des consultations
              </h4>
              <div className="text-muted small">
                {filteredPlannings.length} créneau{filteredPlannings.length !== 1 ? 'x' : ''} trouvé{filteredPlannings.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            {isLoading && plannings.length === 0 ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Chargement des créneaux...</p>
              </div>
            ) : filteredPlannings.length === 0 ? (
              <motion.div 
                className="text-center py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <i className="fas fa-calendar-times fa-3x mb-3 text-muted"></i>
                <h5 className="text-muted">Aucun créneau correspondant</h5>
                <p className="text-muted">Essayez de modifier vos critères de recherche</p>
                <button 
                  className="btn btn-outline-primary mt-2"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDate('');
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Médecin</th>
                      <th className="text-center">Spécialité</th>
                      <th className="text-center">Attente</th>
                      <th className="text-center">Patients</th>
                      <th className="text-center">Horaires</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlannings.map((planning) => (
                      <motion.tr 
                        key={planning.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ backgroundColor: 'rgba(13, 110, 253, 0.05)' }}
                      >
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="date-badge me-3">
                              <div className="day">{new Date(planning.date).getDate()}</div>
                              <div className="month">{new Date(planning.date).toLocaleString('fr-FR', { month: 'short' })}</div>
                            </div>
                            <div>
                              <strong>{formatDate(planning.date)}</strong>
                              <div className="text-muted small">
                                {new Date(planning.date).toLocaleDateString('fr-FR', { weekday: 'long' })}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar me-3">
                              <i className="fas fa-user-md text-primary"></i>
                            </div>
                            <div>
                              <strong>Dr. {planning.medecin?.name || "Non spécifié"}</strong>
                              <div className="text-muted small">{planning.medecin?.email || ""}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info bg-opacity-10 text-info">
                            {planning.medecin?.specialite || "Généraliste"}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info bg-opacity-20 text-dark rounded-pill px-3 py-2">
                            {planning.nombre_max_attente} places
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-primary bg-opacity-20 text-dark rounded-pill px-3 py-2">
                            {planning.nombre_max_patients} patients
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="time-badge">
                            {formatTime(planning.heure_debut)} - {formatTime(planning.heure_fin)}
                          </span>
                        </td>
                        <td className="text-center">
                          <motion.button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(planning.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div 
          className="row mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="text-muted mb-3">
                  <i className="fas fa-user-md me-2"></i>
                  Médecins actifs
                </h5>
                <h2 className="text-primary">{medecins.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="text-muted mb-3">
                  <i className="fas fa-calendar-day me-2"></i>
                  Créneaux programmés
                </h5>
                <h2 className="text-primary">{plannings.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="text-muted mb-3">
                  <i className="fas fa-users me-2"></i>
                  Capacité totale
                </h5>
                <h2 className="text-primary">
                  {plannings.reduce((sum, p) => sum + parseInt(p.nombre_max_patients), 0)}
                </h2>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pied de page moderne */}
        <motion.footer 
          className="mt-5 pt-4 pb-3 text-center text-muted small border-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="d-flex justify-content-center gap-4 mb-3">
            <a href="#" className="text-decoration-none text-muted">
              <i className="fas fa-question-circle me-2"></i>Aide
            </a>
            <a href="#" className="text-decoration-none text-muted">
              <i className="fas fa-cog me-2"></i>Paramètres
            </a>
            <a href="#" className="text-decoration-none text-muted">
              <i className="fas fa-envelope me-2"></i>Contact
            </a>
          </div>
          <p className="mb-0">
            <i className="fas fa-heart text-danger mx-1"></i>
            Cabinet Médical © {new Date().getFullYear()} - Tous droits réservés
          </p>
        </motion.footer>

        {/* Styles CSS intégrés */}
        <style>{`
          .background-container {
            background-image: url('https://media.istockphoto.com/id/186723896/fr/photo/abstrait-fond-bleu-carte-d.webp?a=1&b=1&s=612x612&w=0&k=20&c=CUEQ-VoBaaZTVvEHUdBhDG1a1KtEW8VydwIRSntmRkQ=');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            min-height: 100vh;
          }
          
          .content-overlay {
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 2rem;
          }

          .text-gradient {
            background: linear-gradient(45deg, #0d6efd, #20c997);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
          }
          
          .date-badge {
            width: 50px;
            height: 50px;
            background: #f8f9fa;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid #dee2e6;
          }
          
          .date-badge .day {
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 1;
          }
          
          .date-badge .month {
            font-size: 0.7rem;
            text-transform: uppercase;
            color: #6c757d;
          }
          
          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #f0f7ff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
          }
          
          .time-badge {
            background: #e9ecef;
            padding: 5px 10px;
            border-radius: 20px;
            font-weight: 500;
            font-size: 0.9rem;
          }
          
          .table-hover tbody tr {
            transition: all 0.2s ease;
          }
          
          .card {
            border-radius: 12px;
            overflow: hidden;
          }
          
          .card-header {
            padding: 1rem 1.5rem;
          }
          
          .lead {
            font-size: 1.25rem;
            font-weight: 300;
          }
        `}</style>
      </div>
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