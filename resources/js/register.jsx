import React, { useState } from "react";
import { motion } from "framer-motion";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // On utilise axios ici

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    tel: "",
    adresse: "",
    date_naissance: "",
    status: "active",
    role: "patient",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Réponse du serveur:", response.data);
      alert("Formulaire soumis avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error.response?.data || error.message);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <motion.div className="d-flex align-items-center justify-content-center min-vh-100 position-relative">
      <video
        autoPlay
        loop
        muted
        className="position-absolute w-100 h-100 object-fit-cover"
      >
        <source
          src="https://media.istockphoto.com/id/1516635141/video/medical-tablet-and-a-woman-talking-to-a-patient-during-consulting-with-a-doctor-for-insurance.mp4?s=mp4-640x640-is&k=20&c=opDh_pqKL8TngJKWg4SHKEt4cJWnk6JXwt4UyebUOqw="
          type="video/mp4"
        />
      </video>
      <motion.div
        className="shadow-lg rounded p-4 position-relative"
        style={{
          width: "90%",
          maxWidth: "400px",
          backdropFilter: "blur(15px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <div className="text-center mb-3">
          {/* Vérifiez bien le chemin du logo */}
          <img src="/logo.png" alt="E-Santé 🩺🤍" style={{ width: "80px" }} />
        </div>
        <h2 className="text-center text-primary mb-3">Inscription</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nom complet" value={formData.name} onChange={handleChange} required className="form-control mb-2" />
          <input type="email" name="email" placeholder="Adresse e-mail" value={formData.email} onChange={handleChange} required className="form-control mb-2" />
          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required className="form-control mb-2" />
          <input type="password" name="password_confirmation" placeholder="Confirmer le mot de passe" value={formData.password_confirmation} onChange={handleChange} required className="form-control mb-2" />
          <input type="text" name="tel" placeholder="Numéro de téléphone" value={formData.tel} onChange={handleChange} required className="form-control mb-2" />
          <input type="text" name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} required className="form-control mb-2" />
          <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required className="form-control mb-2" />
          <select name="status" value={formData.status} onChange={handleChange} className="form-select mb-2">
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
          <select name="role" value={formData.role} onChange={handleChange} className="form-select mb-3">
            <option value="medecin">Médecin</option>
            <option value="secretaire">Secrétaire</option>
            <option value="patient">Patient</option>
          </select>
          <button type="submit" className="btn btn-primary w-100">S'inscrire</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const root = createRoot(document.getElementById("app"));
root.render(<Register />);
