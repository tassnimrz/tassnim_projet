import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(""); // Réinitialiser les erreurs

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("Content-Type");
console.log("Type de contenu de la réponse :", contentType);

let data;
if (contentType && contentType.includes("application/json")) {
  data = await response.json();
} else {
  data = await response.text();
  console.log("Réponse brute du serveur :", data);
}


      if (response.ok) {
        alert("Connexion réussie !");
        window.location.href = "/dashboard"; // Redirection après connexion
      } else {
        setErrors(data.message || "Identifiants incorrects.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setErrors("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="shadow-lg rounded p-4" style={{ width: "90%", maxWidth: "400px" }}>
        <h2 className="text-center text-primary mb-3">Connexion</h2>

        {errors && <div className="alert alert-danger">{errors}</div>}

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Adresse e-mail" value={formData.email} onChange={handleChange} required className="form-control mb-2" />
          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required className="form-control mb-3" />
          <button type="submit" className="btn btn-primary w-100">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("app"));
root.render(<Login />);
