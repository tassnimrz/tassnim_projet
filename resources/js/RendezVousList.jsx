import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [rendezVous, setRendezVous] = useState([]);

  // Fonction pour récupérer les données des rendez-vous
  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        // Appel API pour récupérer les rendez-vous
        const response = await axios.get("/api/rendez-vous");
        setRendezVous(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous", error);
      }
    };
    fetchRendezVous();
  }, []);  // Le tableau vide [] signifie que cette fonction se déclenche une seule fois à la première monté du composant

  return (
    <div className="container">
      <h2>Liste des Rendez-vous</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Médecin</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {rendezVous.length === 0 ? (
            <tr>
              <td colSpan="5">Aucun rendez-vous trouvé</td>
            </tr>
          ) : (
            rendezVous.map((rendezVous) => (
              <tr key={rendezVous.id}>
                <td>{rendezVous.patient.name}</td>
                <td>{rendezVous.medecin.name}</td>
                <td>{rendezVous.planningJour.date}</td>
                <td>{rendezVous.statut}</td>
                <td>{rendezVous.position}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
