import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, ProgressBar, Badge, Spinner } from 'react-bootstrap';

const AlerteSanitaire = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://disease.sh/v3/covid-19/countries/Tunisia')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur chargement données santé :", error);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
      <Spinner animation="border" size="sm" variant="primary" />
    </div>
  );

  if (!data) return <Alert variant="warning" className="p-2">Données non disponibles</Alert>;

  const dangerLevel = data.todayCases > 100 ? 'danger' : 'success';
  const activePercent = (data.active / data.cases) * 100;
  const recoveredPercent = (data.recovered / data.cases) * 100;

  return (
    <Card className="border-0 shadow-sm" style={{ 
      width: '280px',
      background: '#fafafa',
      borderRadius: '10px'
    }}>
      <Card.Header className="py-2 px-3" style={{
        background: '#e3f2fd',
        color: '#1976d2',
        fontWeight: '600',
        fontSize: '0.85rem',
        borderBottom: '1px solid #bbdefb'
      }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>🦠 Veille Sanitaire Tunisie</span>
          <Badge pill bg={dangerLevel} style={{ fontSize: '0.65rem' }}>
            {data.todayCases > 100 ? 'Alerte' : 'Stable'}
          </Badge>
        </div>
      </Card.Header>
      
      <Card.Body className="p-3">
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>Nouveaux cas</span>
            <span className="fw-bold" style={{ 
              fontSize: '0.75rem',
              color: dangerLevel === 'danger' ? '#d32f2f' : '#388e3c'
            }}>
              {data.todayCases}
            </span>
          </div>
          <ProgressBar 
            now={Math.min(data.todayCases, 100)} 
            variant={dangerLevel} 
            style={{ 
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#f5f5f5'
            }}
          />
        </div>

        <div className="row g-2 mb-2">
          <div className="col-6">
            <div className="p-2 bg-white rounded" style={{ border: '1px solid #e0e0e0' }}>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>Total cas</div>
              <div className="fw-bold" style={{ fontSize: '0.8rem', color: '#1976d2' }}>{data.cases.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-2 bg-white rounded" style={{ border: '1px solid #e0e0e0' }}>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>Décès</div>
              <div className="fw-bold" style={{ fontSize: '0.8rem', color: '#d32f2f' }}>{data.deaths.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>Guéris/Actifs</span>
          </div>
          <ProgressBar style={{ 
            height: '6px',
            borderRadius: '3px',
            backgroundColor: '#f5f5f5'
          }}>
            <ProgressBar 
              variant="success" 
              now={recoveredPercent} 
              key={1}
            />
            <ProgressBar 
              variant="warning" 
              now={activePercent} 
              key={2}
            />
          </ProgressBar>
          <div className="d-flex justify-content-between mt-1">
            <small className="text-muted" style={{ fontSize: '0.6rem' }}>✅ {data.recovered.toLocaleString()}</small>
            <small className="text-muted" style={{ fontSize: '0.6rem' }}>🔴 {data.active.toLocaleString()}</small>
          </div>
        </div>

        <Alert variant={dangerLevel} className="p-2 mb-0 mt-2" style={{
          fontSize: '0.7rem',
          backgroundColor: dangerLevel === 'danger' ? '#ffebee' : '#e8f5e9',
          borderColor: dangerLevel === 'danger' ? '#ef9a9a' : '#a5d6a7',
          borderRadius: '6px'
        }}>
          {dangerLevel === 'danger' 
            ? '⚠️ Forte circulation virale' 
            : '✅ Situation stable'}
        </Alert>
      </Card.Body>
      
      <Card.Footer className="text-muted p-2" style={{
        fontSize: '0.55rem',
        background: '#f5f5f5',
        borderTop: '1px solid #eeeeee'
      }}>
        Mise à jour: {new Date(data.updated).toLocaleTimeString()}
      </Card.Footer>
    </Card>
  );
};

export default AlerteSanitaire;