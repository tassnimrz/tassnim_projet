import React from "react";
import ReactDOM from "react-dom";

const PatientDetails = ({ patient }) => {
  return (
    <div className="container">
      <h2 className="mb-4">Détails du Patient</h2>

      <div className="card">
        <div className="card-body">
          <p><strong>Nom :</strong> {patient.nom}</p>
          <p><strong>Prénom :</strong> {patient.prenom}</p>
          <p><strong>Date de naissance :</strong> {patient.date_naissance}</p>
          <p><strong>Sexe :</strong> {patient.sexe}</p>
          <p><strong>État civil :</strong> {patient.etat_civil}</p>
          <p><strong>Téléphone :</strong> {patient.telephone}</p>
          <p><strong>Email :</strong> {patient.email}</p>
          <p><strong>Adresse :</strong> {patient.adresse}</p>
          <p><strong>Ville :</strong> {patient.ville}</p>
          <p><strong>Code postal :</strong> {patient.code_postal}</p>
          <p><strong>Groupe sanguin :</strong> {patient.groupe_sanguin}</p>
          <p><strong>Allergies :</strong> {patient.allergies}</p>
          <p><strong>Antécédents médicaux :</strong> {patient.antecedents_medicaux}</p>
          <p><strong>Traitement en cours :</strong> {patient.traitement_en_cours}</p>
          <p><strong>Assurance médicale :</strong> {patient.assurance_medicale}</p>
          <p><strong>Numéro d'assurance :</strong> {patient.numero_assurance}</p>
          <p><strong>Date de première visite :</strong> {patient.date_premiere_visite}</p>

          <a href={`/fiche-patient/${patient.id}/edit`} className="btn btn-primary">Modifier</a>
          <form action={`/fiche-patient/${patient.id}`} method="POST" className="d-inline">
            <input type="hidden" name="_method" value="DELETE" />
            <input type="hidden" name="_token" value={patient.csrf_token} />
            <button type="submit" className="btn btn-danger" onClick={() => confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')}>Supprimer</button>
          </form>
          <a href="/fiche-patient" className="btn btn-secondary">Retour</a>
        </div>
      </div>
    </div>
  );
};

// Monter le composant React sur l'élément Blade
const element = document.getElementById("patient-details");

if (element) {
  const patient = {
    nom: element.dataset.nom,
    prenom: element.dataset.prenom,
    date_naissance: element.dataset.date_naissance,
    sexe: element.dataset.sexe,
    etat_civil: element.dataset.etat_civil,
    telephone: element.dataset.telephone,
    email: element.dataset.email,
    adresse: element.dataset.adresse,
    ville: element.dataset.ville,
    code_postal: element.dataset.code_postal,
    groupe_sanguin: element.dataset.groupe_sanguin,
    allergies: element.dataset.allergies,
    antecedents_medicaux: element.dataset.antecedents_medicaux,
    traitement_en_cours: element.dataset.traitement_en_cours,
    assurance_medicale: element.dataset.assurance_medicale,
    numero_assurance: element.dataset.numero_assurance,
    date_premiere_visite: element.dataset.date_premiere_visite,
    id: element.dataset.id,
    csrf_token: element.dataset.csrf_token,
  };

  ReactDOM.render(<PatientDetails patient={patient} />, element);
}
