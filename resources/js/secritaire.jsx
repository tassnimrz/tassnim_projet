import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  HouseDoor, CalendarCheck, People, Bell, PersonCircle,
  FileEarmarkMedical, Search, List
} from 'react-bootstrap-icons';

// --- Sidebar ---
function Sidebar({ isCollapsed }) {
  return (
    <div className={`sidebar shadow-sm ${isCollapsed ? 'collapsed' : ''}`}>
      <h3 className="text-white fw-bold text-center mb-4">
        {isCollapsed ? '🩺' : 'AI-MedCare 🩺🤍'}
      </h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <NavLink to="/" className="nav-link-custom" end>
            <HouseDoor className="me-2" /> {!isCollapsed && 'Tableau de bord'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/rdvs" className="nav-link-custom">
            <CalendarCheck className="me-2" /> {!isCollapsed && 'Rendez-vous'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/patients" className="nav-link-custom">
            <People className="me-2" /> {!isCollapsed && 'Patients'}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/fiche-patient" className="nav-link-custom">
            <FileEarmarkMedical className="me-2" /> {!isCollapsed && 'Fiche patient'}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/notifications" className="nav-link-custom">
            <Bell className="me-2" /> {!isCollapsed && 'Notifications'}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

// --- Header ---
function Header({ onToggleSidebar }) {
  const [langue, setLangue] = useState('fr');
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    console.log("Recherche :", e.target.value);
  };

  return (
    <div className="header shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-primary btn-sm me-2" onClick={onToggleSidebar}>
          <List />
        </button>

        <select
          className="form-select form-select-sm"
          value={langue}
          onChange={(e) => setLangue(e.target.value)}
          style={{ width: '100px' }}
        >
          <option value="fr">🇫🇷 Français</option>
          <option value="en">🇬🇧 English</option>
        </select>

        <div className="input-group input-group-sm search-bar">
          <span className="input-group-text">
            <Search />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher..."
            value={searchText}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="d-flex align-items-center">
        <PersonCircle size={32} className="me-2 text-primary" />
        <span className="fw-bold">Mme Dupont</span>
      </div>
    </div>
  );
}

// --- Dashboard ---
function DashboardSecretary() {
  return (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card dashboard-card">
          <div className="card-body">
            <h6>Rendez-vous aujourd'hui</h6>
            <h3>8</h3>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card dashboard-card">
          <div className="card-body">
            <h6>Patients enregistrés</h6>
            <h3>152</h3>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card dashboard-card">
          <div className="card-body">
            <h6>Notifications envoyées</h6>
            <h3>45</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Fiche Patient ---
function FichePatient() {
  return (
    <div className="card p-3 shadow-sm">
      <h5 className="mb-3">Fiche Patient</h5>
      <iframe
        src="http://127.0.0.1:8000/fiche-patient"
        style={{
          width: '100%',
          height: '80vh',
          border: 'none',
          borderRadius: '1rem',
          backgroundColor: 'white'
        }}
        title="Fiche Patient"
      ></iframe>
    </div>
  );
}

// --- Patients List ---
function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/patients')
      .then(response => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des patients :", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="card p-3 shadow-sm">
      <h5>Liste des Patients</h5>
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover mt-3">
            <thead className="table-primary">
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Date de naissance</th>
                <th>Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.tel}</td>
                  <td>{patient.adresse}</td>
                  <td>{patient.date_naissance}</td>
                  <td>{new Date(patient.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- Placeholder ---
function Placeholder({ title }) {
  return (
    <div className="card p-3 shadow-sm">
      <h5>{title}</h5>
      <p>Contenu à venir pour {title}...</p>
    </div>
  );
}

// --- Layout Principal ---
function Layout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/fiche-patient" || path === "/patients") {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className="d-flex">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex-grow-1">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="p-4" style={{ backgroundColor: '#f4f9fc', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<DashboardSecretary />} />
            <Route path="/rdvs" element={<Placeholder title="Page des rendez-vous" />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/notifications" element={<Placeholder title="Notifications" />} />
            <Route path="/fiche-patient" element={<FichePatient />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// --- Render ---
const root = createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>
);

// --- Styles CSS ---
const style = document.createElement('style');
style.textContent = `
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #007bff, #0056b3);
  color: white;
  padding: 1.5rem;
  min-height: 100vh;
  transition: width 0.3s ease, padding 0.3s ease;
}

.sidebar.collapsed {
  width: 80px;
  padding: 1.5rem 0.5rem;
  text-align: center;
}

.sidebar.collapsed .nav-link-custom {
  justify-content: center;
  text-align: center;
}

.nav-link-custom {
  color: white;
  font-weight: 500;
  padding: 10px;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link-custom:hover,
.nav-link-custom.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateX(4px);
}

.header {
  background-color: white;
  border-bottom: 1px solid rgb(12, 70, 186);
}

.search-bar input:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  border-color: #007bff;
}

.dashboard-card {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.1);
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 14px rgba(0, 123, 255, 0.2);
}
`;
document.head.appendChild(style);
