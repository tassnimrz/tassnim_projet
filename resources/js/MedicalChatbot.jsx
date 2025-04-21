import React, { useState } from 'react';
import axios from 'axios';
import {
  GraphUp, ArrowUp, ArrowDown, Search,
  List, Sun, Moon, PersonCircle, Globe
} from 'react-bootstrap-icons';

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
    
    // Ajouter la question de l'utilisateur
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // D'abord récupérer toutes les données
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
      
      // RDV aujourd'hui
      if (query.includes("aujourd'hui") || query.includes("rdv du jour") || query.includes("combien de rdv")) {
        responseText = `Il y a ${rdv_aujourdhui.count} RDV prévus aujourd'hui.\n`;
        if (rdv_aujourdhui.count > 0) {
          responseText += "Détails :\n" + 
            rdv_aujourdhui.details.map(rdv => 
              `- ${rdv.patient} avec ${rdv.medecin} à ${rdv.heure} (${rdv.statut})`
            ).join('\n');
        }
      } 
      // Annulations
      else if (query.includes("annul") || query.includes("annulation")) {
        responseText = annulations_semaine.length > 0 
          ? `Annulations cette semaine (${annulations_semaine.length}):\n` + 
            annulations_semaine.map(a => `- ${a.patient} le ${a.date} à ${a.heure} (${a.motif})`).join('\n')
          : "Aucune annulation cette semaine.";
      }
      // Patient fréquent
      else if (query.includes("fréquent") || query.includes("frequent") || query.includes("plus de rdv")) {
        responseText = `Patient le plus fréquent: ${patient_frequent.patient} (${patient_frequent.count} visites)`;
      }
      // Prochain RDV
      else if (query.includes("prochain") || query.includes("suivant") || query.includes("prochain rdv")) {
        if (prochain_rdv.message) {
          responseText = prochain_rdv.message;
        } else {
          responseText = `Prochain RDV: ${prochain_rdv.date} à ${prochain_rdv.heure} avec ${prochain_rdv.medecin}\n${prochain_rdv.conseil}`;
        }
      }
      // Statistiques
      else if (query.includes("stat") || query.includes("évolution") || query.includes("comparaison")) {
        responseText = `Statistiques des RDV:\n` +
          `- Aujourd'hui: ${stats_journalieres.today} RDV\n` +
          `- Hier: ${stats_journalieres.yesterday} RDV\n` +
          `- Évolution: ${stats_journalieres.evolution > 0 ? '+' : ''}${stats_journalieres.evolution}%`;
        
        if (stats_journalieres.evolution > 0) {
          responseText += `\n📈 Augmentation par rapport à hier`;
        } else if (stats_journalieres.evolution < 0) {
          responseText += `\n📉 Diminution par rapport à hier`;
        } else {
          responseText += `\n➖ Stable par rapport à hier`;
        }
      }
      // Help
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

export default MedicalChatbot;