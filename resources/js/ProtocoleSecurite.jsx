import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProtocoleSecurite = () => {
    const [protocoles, setProtocoles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/protocoles')
            .then(response => {
                setProtocoles(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Erreur lors du chargement des protocoles.');
            });
    }, []);

    return (
        <div>
            <h1>Protocoles de sécurité</h1>
            {error && <p>{error}</p>}
            <ul>
                {protocoles.map(protocole => (
                    <li key={protocole.id}>
                        <strong>{protocole.type_protocole}</strong> - {protocole.statut} - {protocole.date_mise_en_place}
                        <p>{protocole.description}</p> {/* Affiche la description */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProtocoleSecurite;
