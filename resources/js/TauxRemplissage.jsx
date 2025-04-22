import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#28a745", "#ffc107", "#ff0000"]; 
const TauxRemplissage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    synth.speak(utter);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/stats/remplissage");
      const { confirmes, attentes, total } = response.data;

      const camembert = [
        { name: "Confirmés", value: confirmes },
        { name: "En attente", value: attentes },
        { name: "Vides", value: total < 1 ? 1 : 0 }, // Pour que le camembert reste visible
      ];

      setData(camembert);

      if (total > 0) {
        speak(`Il y a ${confirmes} patients confirmés et ${attentes} en attente aujourd’hui.`);
      } else {
        speak("Aucun patient enregistré aujourd’hui.");
      }

    } catch (error) {
      console.error("Erreur lors du chargement des données de remplissage :", error);
      speak("Erreur lors du chargement des statistiques de remplissage.");
    }
  };

  if (!data) return <p>Chargement...</p>;

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-primary">📊 Taux de remplissage aujourd’hui</h5>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TauxRemplissage;
