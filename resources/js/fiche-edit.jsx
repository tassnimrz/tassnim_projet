import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

// ✅ Composant pour modifier une fiche patient
const EditFichePatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fichePatient, setFichePatient] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    sexe: '',
    etat_civil: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    code_postal: '',
    groupe_sanguin: '',
    date_premiere_visite: '',
  });

  useEffect(() => {
    axios.get(`/api/fiche-patient/${id}/edit`)
      .then(res => setFichePatient(res.data))
      .catch(err => console.error("Erreur chargement fiche patient", err));
  }, [id]);

  const handleChange = (e) => {
    setFichePatient({
      ...fichePatient,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/fiche-patient/${id}`, fichePatient)
      .then(() => {
        alert("Modifications enregistrées !");
        navigate(`/fiche-patient/${id}`);
      })
      .catch(err => console.error("Erreur lors de la mise à jour", err));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Modifier la Fiche Patient 📝</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="mb-3">
            <label className="form-label">Nom 🧑‍⚕️</label>
            <input type="text" name="nom" className="form-control" value={fichePatient.nom} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Prénom 👤</label>
            <input type="text" name="prenom" className="form-control" value={fichePatient.prenom} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Date de naissance 🎂</label>
            <input type="date" name="date_naissance" className="form-control" value={fichePatient.date_naissance} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Sexe ⚥</label>
            <select name="sexe" className="form-control" value={fichePatient.sexe} onChange={handleChange} required>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">État Civil 💍</label>
            <select name="etat_civil" className="form-control" value={fichePatient.etat_civil} onChange={handleChange} required>
              <option value="Célibataire">Célibataire</option>
              <option value="Marié">Marié</option>
              <option value="Divorcé">Divorcé</option>
              <option value="Veuf">Veuf</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="mb-3">
            <label className="form-label">Téléphone 📱</label>
            <input type="tel" name="telephone" className="form-control" value={fichePatient.telephone} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email 📧</label>
            <input type="email" name="email" className="form-control" value={fichePatient.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Adresse 🏡</label>
            <input type="text" name="adresse" className="form-control" value={fichePatient.adresse} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Ville 🏙️</label>
            <input type="text" name="ville" className="form-control" value={fichePatient.ville} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Code Postal 📍</label>
            <input type="text" name="code_postal" className="form-control" value={fichePatient.code_postal} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Groupe Sanguin 🩸</label>
            <input type="text" name="groupe_sanguin" className="form-control" value={fichePatient.groupe_sanguin} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section">
          <div className="mb-3">
            <label className="form-label">Date de première visite 🗓️</label>
            <input type="date" name="date_premiere_visite" className="form-control" value={fichePatient.date_premiere_visite} onChange={handleChange} required />
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-animate">Enregistrer les modifications 💾</button>
          <button type="button" className="btn btn-secondary btn-animate" onClick={() => navigate(`/fiche-patient/${id}`)}>Annuler ❌</button>
        </div>
      </form>

      {/* Styles CSS inline */}
      <style>
        {`
          .container {
            background: linear-gradient(to bottom, #80aaff, #4e73df);
            color: rgb(18, 18, 18);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          }
          .form-section {
            background: rgba(252, 249, 249, 0.9);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            opacity: 0;
            animation: fadeIn 1s forwards;
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          .form-control {
            border-radius: 5px;
            background-color: #f8f9fc;
            border: 1px solid #ccc;
            padding: 10px;
            transition: all 0.3s ease-in-out;
          }
          .form-control:focus {
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
          }
          .form-label {
            font-weight: 500;
          }
          .btn {
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 5px;
            margin: 5px;
            transition: transform 0.3s ease-in-out;
          }
          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
          }
          .btn-secondary {
            background-color: #6c757d;
            border-color: #6c757d;
          }
          .btn-animate:hover {
            transform: scale(1.1);
          }
          h2 {
            font-weight: 600;
          }
        `}
      </style>
    </div>
  );
};

// ✅ Déclaration correcte du composant racine
const App = () => (
  <Router>
    <Routes>
      <Route path="/fiche/edit/:id" element={<EditFichePatient />} />
    </Routes>
  </Router>
);

// ✅ Montage ReactDOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
