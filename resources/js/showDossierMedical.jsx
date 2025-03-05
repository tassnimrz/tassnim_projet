import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowDossierMedical = ({ dossierMedicalId }) => {
    const [dossierMedical, setDossierMedical] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        // Utiliser axios pour appeler la route API
        axios.get(`/api/dossier-medical/data/${dossierMedicalId}`)
            .then(response => {
                setDossierMedical(response.data);
            })
            .catch(error => {
                setErrorMessage('Erreur lors de la récupération des données.');
                console.error(error);
            });
    }, [dossierMedicalId]);

    if (!dossierMedical) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container">
            <h1>Dossier Médical de {dossierMedical.fichePatient.nom} {dossierMedical.fichePatient.prenom}</h1>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="card">
                <div className="card-header">Informations du Dossier Médical</div>
                <div className="card-body">
                    <ul>
                        <li><strong>Nom du Patient:</strong> {dossierMedical.fichePatient.nom}</li>
                        <li><strong>Prénom du Patient:</strong> {dossierMedical.fichePatient.prenom}</li>
                        <li><strong>Vaccins:</strong> {dossierMedical.vaccins || 'Non renseigné'}</li>
                        <li><strong>Notes du Médecin:</strong> {dossierMedical.notes_medecin || 'Aucune note disponible'}</li>
                        <li><strong>Date de Création:</strong> {new Date(dossierMedical.created_at).toLocaleDateString()}</li>
                        <li><strong>Dernière Mise à Jour:</strong> {new Date(dossierMedical.updated_at).toLocaleDateString()}</li>
                    </ul>
                </div>
            </div>

            {/* Boutons ou autres actions */}
        </div>
    );
};

export default ShowDossierMedical;
