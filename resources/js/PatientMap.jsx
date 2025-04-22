import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const PatientMap = ({ patients, theme }) => {
  useEffect(() => {
    const map = L.map('map').setView([34.0, 9.0], 6); // Centre sur la Tunisie

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const geocode = async (adresse) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=tn&q=${encodeURIComponent(adresse)}`);
        const data = await response.json();
        if (data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
        }
      } catch (err) {
        console.error('Erreur géocodage :', err);
      }
      return null;
    };

    // Géocoder chaque adresse tunisienne
    patients.forEach(async (patient) => {
        if (patient.adresse) {
          console.log("⏳ Géocodage de :", patient.name, " - ", patient.adresse); // 🔍 LOG
      
          const coords = await geocode(patient.adresse);
          console.log("📍 Coordonnées obtenues :", coords); // 🔍 LOG
      
          if (coords) {
            const marker = L.marker([coords.lat, coords.lng]).addTo(map);
            marker.bindPopup(`
              <strong>${patient.name}</strong><br/>
              ${patient.adresse}<br/>
              Tel : ${patient.tel}
            `);
          } else {
            console.warn("❌ Échec géocodage pour :", patient.adresse);
          }
        }
      });

    return () => map.remove();
  }, [patients]);

  return (
    <div id="map" style={{ height: '500px', width: '100%', borderRadius: '10px' }}></div>
  );
};

export default PatientMap;
