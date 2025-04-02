import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaChartPie, FaChartBar, FaSyncAlt } from 'react-icons/fa';

Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Reports = () => {
  const [successCount, setSuccessCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [motifStats, setMotifStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then(response => response.json())
      .then(data => {
        setSuccessCount(data.totalReussies);
        setCancelledCount(data.totalAnnulees);
        setMotifStats(data.motifStats);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur de récupération des rapports:', error);
        setLoading(false);
      });
  }, []);

  const doughnutData = {
    labels: ['Terminées', 'En attente'],
    datasets: [
      {
        data: [successCount, cancelledCount],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF80A0', '#50B4F5'],
        borderWidth: 2,
      },
    ],
  };

  const motifData = {
    labels: motifStats.map(item => item.motif),
    datasets: [
      {
        label: 'Nombre de consultations par motif',
        data: motifStats.map(item => item.total),
        backgroundColor: motifStats.map(() => 
          `#${Math.floor(Math.random()*16777215).toString(16)}`
        ),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const successPercentage = successCount ? ((successCount / (successCount + cancelledCount)) * 100).toFixed(1) : 0;
  const cancelledPercentage = cancelledCount ? ((cancelledCount / (successCount + cancelledCount)) * 100).toFixed(1) : 0;

  return (
    <div className="container mt-5">
      {/* 🚀 Header avec gradient + icône */}
      <div className="text-center py-5 header-container">
        <h1 className="display-4 fw-bold text-light">
          📊 Analyse des Performances
        </h1>
        <p className="text-light fs-5">
          Suivez et optimisez les performances des consultations grâce à des graphiques clairs et précis.
        </p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center loading-container">
          <div className="spinner-border text-danger" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <>
          {/* 🔥 Cartes récapitulatives */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card stat-card">
                <div className="card-body">
                  <FaChartPie className="icon" />
                  <h5 className="card-title">Consultations Terminées</h5>
                  <p className="card-text">{successCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card stat-card">
                <div className="card-body">
                  <FaChartBar className="icon" />
                  <h5 className="card-title">Consultations En Attente</h5>
                  <p className="card-text">{cancelledCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 🥯 Diagramme en Doughnut */}
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h4 className="text-center mb-3 text-danger">Taux de consultations</h4>
                  <div style={{ width: '70%', margin: '0 auto' }}>
                    <Doughnut data={doughnutData} />
                  </div>
                  <div className="mt-3 text-center">
                    ✅ {successPercentage}% Terminées | ⏳ {cancelledPercentage}% En attente
                  </div>
                </div>
              </div>
            </div>

            {/* 📊 Diagramme en barres */}
            <div className="col-lg-7">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h4 className="text-center mb-3 text-primary">Nombre de consultations par motif</h4>
                  <Bar data={motifData} />
                </div>
              </div>
            </div>
          </div>

          {/* 🔄 Bouton de rafraîchissement */}
          <div className="text-center mt-5">
            <button className="btn refresh-btn" onClick={() => window.location.reload()}>
              <FaSyncAlt className="me-2" /> Rafraîchir les Statistiques
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('app'));
root.render(<Reports />);

// ✅ CSS supplémentaire
const style = document.createElement('style');
style.innerHTML = `
  .header-container {
    background: linear-gradient(135deg,rgb(32, 198, 204),rgb(72, 54, 235));
    border-radius: 16px;
    box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
    color: white;
  }
  
  .stat-card {
    background: linear-gradient(135deg,rgb(93, 64, 165), #FF80A0);
    color: white;
    text-align: center;
    padding: 20px;
    border-radius: 16px;
    transition: 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
  }
  
  .icon {
    font-size: 40px;
    margin-bottom: 10px;
  }

  .refresh-btn {
    background-color: #36A2EB;
    color: white;
    padding: 12px 30px;
    border-radius: 50px;
    transition: background 0.3s ease;
  }

  .refresh-btn:hover {
    background-color:rgb(220, 61, 95);
    transform: scale(1.05);
  }

  .card-title {
    font-weight: bold;
  }

  .loading-container {
    min-height: 300px;
  }
`;
document.head.appendChild(style);
