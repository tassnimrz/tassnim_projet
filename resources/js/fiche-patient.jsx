import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReactDOM from "react-dom/client";
import { Container, Form, Button, Row, Col, Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  FaHeartbeat,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaCalendarAlt,
  FaEnvelope,
  FaTint,
  FaExclamationCircle,
  FaPills,
  FaBriefcase,
  FaIdCard 
} from "react-icons/fa";

const styles = `
  :root {
    --primary-blue:rgb(16, 57, 205);
    --secondary-blue:rgb(10, 40, 210);
    --light-blue:rgb(57, 143, 223);
  }

  body {
    background: linear-gradient(135deg, #f0f9ff 0%, #e6f4ff 100%);
    min-height: 100vh;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .ai-header {
    background: linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%);
    color: white;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 68, 136, 0.2);
    position: relative;
    overflow: hidden;
  }

  .ai-header::after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: -10%;
    width: 120%;
    height: 50px;
    background: rgba(255, 255, 255, 0.15);
    transform: rotate(3deg);
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
    transition: transform 0.3s ease;
  }

  .logo-wrapper:hover {
    transform: scale(1.02);
  }

  .main-container {
    max-width: 1000px;
    margin: 2rem auto;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 68, 136, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .main-container:hover {
    transform: translateY(-5px);
  }

  .form-section {
    padding: 2rem;
  }

  .form-label {
    color: var(--secondary-blue);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0.5rem;
  }

  .form-control {
    border: 2px solid var(--light-blue);
    border-radius: 8px;
    padding: 0.75rem;
    transition: all 0.3s ease;
  }

  .form-control:focus {
    border-color: var(--primary-blue);
    box-shadow: 0 0 8px rgba(0, 102, 204, 0.2);
  }

  .icon-wrapper {
    background: var(--light-blue);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-blue);
  }

  .submit-btn {
    background: linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%);
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 1.5rem auto;
  }

  .submit-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3);
  }

  .section-title {
    color: var(--secondary-blue);
    border-left: 4px solid var(--primary-blue);
    padding-left: 1rem;
    margin: 2rem 0 1.5rem;
  }

  .invalid-feedback {
    color: #dc3545;
    font-size: 0.875em;
  }

  .is-invalid {
    border-color: #dc3545 !important;
  }

  /* Animation de succès */
  .success-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .success-card {
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .success-card::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
    animation: shine 1.5s ease-out 1;
  }
  
  .emoji-bounce {
    font-size: 3rem;
    animation: bounce 1s ease infinite;
  }
  
  .success-check {
    font-size: 2rem;
    margin-top: 1rem;
    animation: scaleCheck 0.5s ease-out;
  }
  
  .success-title {
    margin: 1rem 0;
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .success-message {
    font-size: 1.1rem;
    opacity: 0.9;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes scaleCheck {
    0% { transform: scale(0); }
    80% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  @keyframes shine {
    from { transform: translateX(-100%) rotate(45deg); }
    to { transform: translateX(100%) rotate(45deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -60%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }

  /* Confetti */
  .confetti {
    position: fixed;
    animation: confetti-fall 3s linear forwards;
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(-20vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`;

const formConfig = [
  {
    title: "Informations Personnelles",
    icon: <FaUser />,
    fields: [
      { id: "nom", label: "Nom", icon: <FaUser />, required: true },
      { id: "prenom", label: "Prénom", icon: <FaUser />, required: true },
      { id: "date_naissance", label: "Date de naissance", type: "date", icon: <FaBirthdayCake />, required: true },
      { id: "sexe", label: "Sexe", type: "select", icon: <FaVenusMars />, options: ["Masculin", "Féminin", "Autre"], required: true },
      { id: "etat_civil", label: "État civil", type: "select", icon: <FaHeartbeat />, options: ["Célibataire", "Marié", "Divorcé", "Veuf"], required: true }
    ]
  },
  {
    title: "Coordonnées",
    icon: <FaMapMarkerAlt />,
    fields: [
      { id: "telephone", label: "Téléphone", type: "tel", icon: <FaPhone />, maxLength: 15, required: true },
      { id: "email", label: "Email", type: "email", icon: <FaEnvelope />, required: true },
      { id: "adresse", label: "Adresse", icon: <FaMapMarkerAlt /> },
      { id: "ville", label: "Ville", icon: <FaMapMarkerAlt /> },
      { id: "code_postal", label: "Code postal", icon: <FaMapMarkerAlt /> }
    ]
  },
  {
    title: "Informations Médicales",
    icon: <FaHeartbeat />,
    fields: [
      { id: "groupe_sanguin", label: "Groupe sanguin", icon: <FaTint /> },
      { id: "allergies", label: "Allergies", type: "textarea", icon: <FaExclamationCircle /> },
      { id: "antecedents_medicaux", label: "Antécédents médicaux", type: "textarea", icon: <FaHeartbeat /> },
      { id: "traitement_en_cours", label: "Traitement en cours", type: "textarea", icon: <FaPills /> }
    ]
  },
  {
    title: "Assurance Médicale",
    icon: <FaBriefcase />,
    fields: [
      { id: "assurance_medicale", label: "Assurance médicale", icon: <FaBriefcase /> },
      { id: "numero_assurance", label: "Numéro d'assurance", icon: <FaIdCard />, maxLength: 50 },
      { id: "date_premiere_visite", label: "Date première visite", type: "date", icon: <FaCalendarAlt />, required: true }
    ]
  }
];

const FormField = ({ field, value, onChange, error }) => (
  <Form.Group className="mb-4" key={field.id}>
    <Form.Label className="form-label">
      <div className="icon-wrapper">{field.icon}</div>
      {field.label}
      {field.required && <span className="text-danger">*</span>}
    </Form.Label>
    
    {field.type === "textarea" ? (
      <Form.Control
        as="textarea"
        rows={3}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        name={field.id}
        value={value || ''}
        onChange={onChange}
      />
    ) : field.type === "select" ? (
      <Form.Select
        className={`form-control ${error ? 'is-invalid' : ''}`}
        name={field.id}
        value={value || ''}
        onChange={onChange}
      >
        <option value="">Sélectionner</option>
        {field.options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </Form.Select>
    ) : (
      <Form.Control
        type={field.type || "text"}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        name={field.id}
        value={value || ''}
        onChange={onChange}
        maxLength={field.maxLength}
      />
    )}
    
    {error && <div className="invalid-feedback">{error}</div>}
  </Form.Group>
);

function CreateFichePatient() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    try {
      const response = await axios.post('/api/fiche-patient', formData);
      
      if (response.status === 201) {
        setSuccess(true);
        setFormData({});
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Erreur:', error);
        alert("Une erreur est survenue lors de l'enregistrement");
      }
    }
  };

  const SuccessAnimation = () => (
    <div className="success-wrapper">
      <div className="success-card">
        <div className="emoji-bounce">🎉</div>
        <h3 className="success-title">Fiche créée avec succès !</h3>
        <p className="success-message">
          Le dossier patient est maintenant disponible dans le système
        </p>
        <div className="success-check">✅</div>
      </div>
      
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            fontSize: `${Math.random() * 20 + 15}px`
          }}
        >
          {['🎉', '🎊', '✅', '💫', '✨'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      
      {success && <SuccessAnimation />}

      <header className="ai-header">
        <Container>
          <div className="logo-wrapper">
            <FaHeartbeat size={32} />
            <h1>AI-MedCare 🩺🤍</h1>
          </div>
        </Container>
      </header>

      <Container className="main-container">
        <div className="form-section">
          <h2 className="section-title">Nouvelle Fiche Patient</h2>

          <Form onSubmit={handleSubmit}>
            {formConfig.map((section, index) => (
              <Accordion defaultActiveKey={index.toString()} key={section.title}>
                <Accordion.Item eventKey={index.toString()}>
                  <Accordion.Header>
                    <div className="d-flex align-items-center gap-2">
                      {section.icon}
                      {section.title}
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      {section.fields.map((field, idx) => (
                        <Col md={6} key={idx}>
                          <FormField
                            field={field}
                            value={formData[field.id] || ''}
                            onChange={handleChange}
                            error={errors[field.id]?.[0]}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ))}

            <Button type="submit" className="submit-btn">
              <FaHeartbeat />
              Enregistrer le Patient
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <CreateFichePatient />
  </React.StrictMode>
);