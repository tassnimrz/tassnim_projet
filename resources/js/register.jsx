import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

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

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [activeForm, setActiveForm] = useState("create"); // "create", "update"
  const [usersList, setUsersList] = useState([]); // State to store the users list
  const [selectedUser, setSelectedUser] = useState(null); // For selecting user in "update"
  const [selectedRole, setSelectedRole] = useState("all"); // For filtering users by role

  // Fonction pour gérer les changements dans les champs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Efface l'erreur lors de la modification
  };

  // Validation des champs du formulaire
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est obligatoire.";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide.";
    }
    if (!formData.password) newErrors.password = "Le mot de passe est obligatoire.";
    if (formData.password.length < 6)
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "Les mots de passe ne correspondent pas.";
    if (!formData.tel.trim()) newErrors.tel = "Le téléphone est obligatoire.";
    if (!/^\d+$/.test(formData.tel)) newErrors.tel = "Le téléphone doit contenir uniquement des chiffres.";
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est obligatoire.";
    if (!formData.date_naissance) newErrors.date_naissance = "La date de naissance est obligatoire.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire pour créer ou modifier un utilisateur
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      let response;
      if (activeForm === "create") {
        // Création d'un nouvel utilisateur
        response = await axios.post("http://127.0.0.1:8000/api/register", formData, {
          headers: { "Content-Type": "application/json" },
        });
      } else if (activeForm === "update" && selectedUser) {
        // Mise à jour de l'utilisateur
        response = await axios.put(
          `http://127.0.0.1:8000/api/users/${selectedUser.id}`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
      }
      console.log("Réponse du serveur:", response.data);
      setSuccessMessage("Opération réussie !");
      setFormData({
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
      setSelectedUser(null); // Reset selected user after success
    } catch (error) {
      console.error("Erreur lors de la soumission :", error.response?.data || error.message);
      setErrors({ general: "Une erreur est survenue lors de l'inscription." });
    }
  };

  // Fonction pour récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/users");
        console.log("Données des utilisateurs reçues :", response.data);
        
        // Vérification de la structure des données
        response.data.forEach(user => {
            console.log(`Utilisateur: ${user.name}, Données complètes:`, user);
        });

        setUsersList(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error.response?.data || error.message);
    }
};


  // Utiliser useEffect pour charger la liste des utilisateurs lors de la sélection de "Modifier"
  useEffect(() => {
    if (activeForm === "update") {
      fetchUsers();
    }
  }, [activeForm]);

  // Utiliser useEffect pour remettre à zéro l'utilisateur sélectionné
  useEffect(() => {
    if (!selectedUser) {
      setFormData({
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
    } else {
      setFormData({
        ...selectedUser,
        password: "",
        password_confirmation: "", // Clear password fields on update
      });
    }
  }, [selectedUser]);
  

  const filteredUsers = selectedRole === "all" 
  ? usersList 
  : usersList.filter(user => user.roles && user.roles.includes(selectedRole));

usersList.forEach(user => {
  console.log(`Utilisateur: ${user.name}, Rôles:`, user.roles ? user.roles : "Aucun rôle défini");
});


  return (
    <motion.div className="d-flex align-items-center justify-content-center min-vh-100 position-relative">
      {/* Image de fond */}
      <img
        src="https://media.istockphoto.com/id/1441665382/fr/photo/des-scientifiques-marchant-dans-le-couloir.webp?a=1&b=1&s=612x612&w=0&k=20&c=OxkJL5QL3bfTwRshcYXLuOsfQ0BT6XT6G4RPmWCjy80="
        alt="Background"
        className="position-absolute w-100 h-100 object-fit-cover"
        style={{ zIndex: -1 }}
      />

      {/* Formulaire dynamique */}
      <motion.div
        className="shadow-lg rounded p-4 position-relative"
        style={{
          width: "90%",
          maxWidth: "400px",
          backdropFilter: "blur(15px)",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
        }}
      >
        <div className="text-center mb-3">
          <img src="/logo.png" alt="E-Santé 🩺🤍" style={{ width: "80px" }} />
        </div>

        <h2 className="text-center text-primary mb-3">Gestion des comptes</h2>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        <div className="d-flex justify-content-around mb-3">
          <button className="btn btn-outline-primary" onClick={() => setActiveForm("create")}>
            Créer
          </button>
          <button className="btn btn-outline-warning" onClick={() => setActiveForm("update")}>
            Modifier
          </button>
        </div>

        {/* Formulaire dynamique (Transition animée) */}
        {activeForm === "create" && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Champs du formulaire */}
            {["name", "email", "password", "password_confirmation", "tel", "adresse", "date_naissance"].map((input) => (
              <div key={input} className="mb-2">
                <input
                  type={input === "password" || input === "password_confirmation" ? "password" : "text"}
                  name={input}
                  placeholder={`Entrez votre ${input}`}
                  value={formData[input]}
                  onChange={handleChange}
                  className={`form-control ${errors[input] ? "is-invalid" : ""}`}
                  style={{
                    backgroundColor: "transparent", // Transparent background
                    border: "1px solid #ccc",
                  }}
                />
                {errors[input] && <div className="invalid-feedback">{errors[input]}</div>}
              </div>
            ))}
            {/* Statut et Rôle */}
            <div className="mb-2">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
                style={{ backgroundColor: "transparent", border: "1px solid #ccc" }}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
            <div className="mb-2">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-control"
                style={{ backgroundColor: "transparent", border: "1px solid #ccc" }}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Docteur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              S'inscrire
            </button>
          </motion.form>
        )}

        {/* Affichage de la liste des utilisateurs filtrée par rôle */}
        {activeForm === "update" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3>Liste des utilisateurs</h3>

            {/* Filtrage par rôle */}
            <div className="mb-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="form-control"
              >
                <option value="all">Tous</option>
                <option value="patient">Patient</option>
                <option value="doctor">Docteur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <ul className="list-group">
              {filteredUsers.map((user) => (
                <li key={user.id} className="list-group-item" style={{ backgroundColor: "transparent", border: "1px solid #ccc" }}>
                  {user.name} - {user.email}
                  <button
                    className="btn btn-warning btn-sm float-end"
                    onClick={() => {
                      setSelectedUser(user); // Set the selected user
                      setActiveForm("create"); // Switch to create to load the form
                    }}
                  >
                    Modifier
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const root = createRoot(document.getElementById("app"));
root.render(<Register />);
