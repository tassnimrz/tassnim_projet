import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { Card, Badge, Spinner, Alert, Container, Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUserCircle, FaEnvelope, FaPhone, FaHome, FaBirthdayCake } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

// Animation d'entrée
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ProfilCard = ({ profil, onUpdate }) => {
    const [formData, setFormData] = useState({ ...profil });
    const [isEditing, setIsEditing] = useState(false);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData);
      setIsEditing(false);
    };
  
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03 }}
        className="d-flex justify-content-center"
      >
        <Card
          className="shadow-lg border-0 rounded-4 overflow-hidden"
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "linear-gradient(135deg,rgb(109, 125, 165) 0%,rgb(19, 30, 183) 100%)",
            color: "#fff",
          }}
        >
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <FaUserCircle size={80} className="mb-3 text-light" />
              <h3 className="fw-bold">{formData.nom}</h3>
              <Badge bg="info" className="px-3 py-2 fs-6">Administrateur</Badge>
            </div>
  
            {!isEditing ? (
              <div className="mb-4">
                <p><FaEnvelope /> <strong>Email :</strong> {formData.email}</p>
                <p><FaPhone /> <strong>Téléphone :</strong> {formData.tel}</p>
                <p><FaHome /> <strong>Adresse :</strong> {formData.adresse}</p>
                <p><FaBirthdayCake /> <strong>Date de naissance :</strong> {formData.date_naissance}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="tel"
                    name="tel"
                    value={formData.tel}
                    onChange={handleChange}
                    placeholder="Téléphone"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Adresse"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="date"
                    name="date_naissance"
                    value={formData.date_naissance}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
  
                <Button variant="success" type="submit" className="w-100 mb-2">
                  Enregistrer
                </Button>
              </form>
            )}
  
            {!isEditing && (
              <Button
                variant="primary"
                className="w-100"
                onClick={() => setIsEditing(true)}
              >
                Modifier mes données
              </Button>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    );
  };

const EditProfilForm = ({ profil, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: profil.nom,
    email: profil.email,
    tel: profil.tel,
    adresse: profil.adresse,
    date_naissance: profil.date_naissance,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="d-flex justify-content-center"
    >
      <Card
        className="shadow-lg border-0 rounded-4 overflow-hidden"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="success" type="submit">
                Enregistrer
              </Button>
              <Button variant="secondary" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

const Profil = () => {
  const [profil, setProfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("http://127.0.0.1:8000/api/profil")
      .then((response) => {
        setProfil(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setAlertMessage({ type: "danger", message: "Erreur lors de la récupération du profil" });
      });
  }, []);

  const handleSave = (data) => {
    setLoading(true);
    axios.put(`http://127.0.0.1:8000/api/profil/update`, data)
      .then((response) => {
        setProfil(response.data); // Met à jour avec response.data
        setEditMode(false);
        setAlertMessage({ type: "success", message: "Profil mis à jour avec succès !" });
        setTimeout(() => setAlertMessage(null), 5000); // Hide after 5 seconds
        setLoading(false);
      })
      .catch(() => {
        setAlertMessage({ type: "danger", message: "Erreur lors de la mise à jour du profil" });
        setLoading(false);
      });
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh", // S'assure que la hauteur couvre toute la fenêtre
         minHeight: "100vh", // Ensure the container is at least as tall as the viewport
    backgroundImage: "url('https://images.unsplash.com/photo-1614850523011-8f49ffc73908?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJsZXV8ZW58MHx8MHx8fDA%3D')", // Background image
   // Cover the entire container
    backgroundPosition: "center", // Center the image
    backgroundAttachment: "fixed", // Fix the background in place while scrolling
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% auto"

      }}
    >
      {alertMessage && (
        <Alert variant={alertMessage.type} className="position-absolute top-0 start-50 translate-middle-x mt-3 w-50">
          {alertMessage.message}
        </Alert>
      )}

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : profil && !editMode ? (
        <ProfilCard profil={profil} onUpdate={() => setEditMode(true)} />
      ) : (
        profil && <EditProfilForm profil={profil} onSave={handleSave} onCancel={() => setEditMode(false)} />
      )}
    </Container>
  );
};

// Monter React dans Blade
const profilApp = document.getElementById("profil-app");
if (profilApp) {
  ReactDOM.createRoot(profilApp).render(<Profil />);
}
