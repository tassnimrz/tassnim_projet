// resources/js/VoirRendezVous.jsx

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

function VoirRendezVous() {
    const [rendezVous, setRendezVous] = useState([]);
    const [tri, setTri] = useState('date');

    useEffect(() => {
        fetchRendezVous();
    }, []);

    const fetchRendezVous = async () => {
        try {
            const res = await axios.get('/api/tous-rendezvous');
            console.log("Données reçues :", res.data);

            if (Array.isArray(res.data)) {
                setRendezVous(res.data);
            } else if (Array.isArray(res.data.rendezvous)) {
                setRendezVous(res.data.rendezvous);
            } else {
                console.error("Les données reçues ne sont pas un tableau :", res.data);
            }
        } catch (error) {
            console.error("Erreur API :", error);
        }
    };

    const trier = (valeur) => {
        setTri(valeur);

        if (!Array.isArray(rendezVous)) return;

        const copie = [...rendezVous];
        switch (valeur) {
            case 'date':
                copie.sort((a, b) => new Date(a.planning_jour.date) - new Date(b.planning_jour.date));
                break;
            case 'priorite':
                copie.sort((a, b) => b.priorite - a.priorite);
                break;
            case 'statut':
                copie.sort((a, b) => a.statut.localeCompare(b.statut));
                break;
            default:
                break;
        }
        setRendezVous(copie);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Liste des Rendez-vous</h2>

            <label htmlFor="tri">Trier par : </label>
            <select id="tri" value={tri} onChange={e => trier(e.target.value)}>
                <option value="date">Date</option>
                <option value="priorite">Priorité</option>
                <option value="statut">Statut</option>
            </select>

            <table className="table table-bordered mt-4">
                <thead className="table-light">
                    <tr>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Médecin</th>
                        <th>Statut</th>
                        <th>Priorité</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(rendezVous) && rendezVous.map((rdv, index) => (
                        <tr key={index}>
                            <td>{rdv.planning_jour?.date || 'N/A'}</td>
                            <td>{rdv.planning_jour?.heure_debut} - {rdv.planning_jour?.heure_fin}</td>
                            <td>{rdv.medecin?.name || 'N/A'}</td>
                            <td>{rdv.statut || 'N/A'}</td>
                            <td>{rdv.priorite ?? 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<VoirRendezVous />);
