import React, { useState, useEffect } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link,
  useLocation,
  Navigate
} from "react-router-dom";
import { 
  Container, Row, Col, Navbar, Nav, Form, Button, Table, 
  Dropdown, Card, Spinner, Alert, Badge, Stack, Modal 
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faUser, faCog, faSignOutAlt, faChartBar, 
  faComment, faThumbsUp, faThumbsDown, faEdit, faTrashAlt, faPlus,
  faUserNurse, faUserInjured, faGlobe, faMoon, faSun,
  faEnvelope, faPhone, faHome, faBirthdayCake, faClipboardList,
  faUserMd, faUserShield, faUserSecret, faChartPie, faSyncAlt, faStar
} from "@fortawesome/free-solid-svg-icons";
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { motion } from "framer-motion";

Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const themeConfig = {
  light: {
    primary: "#1e90ff",
    secondary: "#0056b3",
    background: "#f8f9fa",
    text: "#2c3e50",
    cardBackground: "rgba(255, 255, 255, 0.9)",
    gradient: "linear-gradient(135deg, #1e90ff 0%, #0056b3 100%)"
  },
  dark: {
    primary: "#00c2cb",
    secondary: "#0a192f",
    background: "#0a192f",
    text: "#ccd6f6",
    cardBackground: "rgba(10, 25, 47, 0.8)",
    gradient: "linear-gradient(135deg, #0a192f 0%, #172a45 100%)",
    backgroundImage: "url('https://img.freepik.com/photos-premium/forets-sombres-photo-gratuite-fond-hd_915071-137396.jpg')"
  }
};

const translations = {
  fr: {
    leaveBlank: "Laisser vide pour ne pas modifier",
    dashboard: "Tableau de bord",
    dashboardSettings: "Réglages Dashboard",
    searchPlaceholder: "Rechercher...",
    profile: "Profil",
    settings: "Paramètres",
    logout: "Déconnexion",
    personnelManagement: "Gestion du Personnel",
    avisManagement: "Gestion des Avis",
    reportsStatistics: "Analytique",
    welcomeTitle: "Bienvenue Administrateur 👨⚕️",
    welcomeText: "Plateforme de gestion médicale intelligente",
    newUser: "Nouvel utilisateur",
    newAvis: "Nouvel avis",
    active: "Actif",
    inactive: "Inactif",
    role: "Rôle",
    actions: "Actions",
    stats: {
      totalAvis: "Avis totaux",
      totalPatients: "Patients totaux",
      positifs: "Avis positifs",
      negatifs: "Avis négatifs",
      satisfaction: "Taux satisfaction",
      appointments: "Rendez-vous",
      staff: "Personnel"
    },
    roles: {
      medecin: "Medecin",
      secretaire: "Secretaire",
      patient: "Patient",
      admin: "Administrateur"
    },
    performanceAnalysis: "Analyse des Performances",
    performanceSubtitle: "Suivez et optimisez les performances des consultations",
    completedConsultations: "Consultations Terminées",
    pendingConsultations: "Consultations En Attente",
    consultationRate: "Taux de consultations",
    consultationsByReason: "Consultations par motif",
    refreshStats: "Rafraîchir les Statistiques",
    completed: "Terminées",
    pending: "En attente",
    confirmDelete: "Confirmer la suppression",
    deleteMessage: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
    cancel: "Annuler",
    confirm: "Confirmer",
    fullName: "Nom complet",
    phone: "Téléphone",
    birthDate: "Date de naissance",
    address: "Adresse",
    password: "Mot de passe",
    passwordConfirmation: "Confirmation du mot de passe",
    passwordsDontMatch: "Les mots de passe ne correspondent pas",
    successUpdate: "Utilisateur mis à jour avec succès",
    successCreate: "Utilisateur créé avec succès",
    successDelete: "Utilisateur supprimé avec succès",
    errorDelete: "Erreur lors de la suppression",
    editUser: "Modifier l'utilisateur",
    create: "Créer",
    update: "Mettre à jour",
    editProfile: "Modifier le profil",
    save: "Enregistrer",
    profileInfo: "Informations du profil",
    updateSuccess: "Profil mis à jour avec succès !",
    updateError: "Erreur lors de la mise à jour"
  },
  en: {
    leaveBlank: "Leave blank to keep unchanged",
    dashboard: "Dashboard",
    dashboardSettings: "Dashboard Settings",
    searchPlaceholder: "Search...",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    personnelManagement: "Staff Management",
    avisManagement: "Reviews Management",
    reportsStatistics: "Analytics",
    welcomeTitle: "Welcome Admin 👨⚕️",
    welcomeText: "Smart Medical Management Platform",
    newUser: "New user",
    newAvis: "New review",
    active: "Active",
    inactive: "Inactive",
    role: "Role",
    actions: "Actions",
    stats: {
      totalAvis: "Total Reviews",
      totalPatients: "Total Patients",
      positifs: "Positive Reviews",
      negatifs: "Negative Reviews",
      satisfaction: "Satisfaction Rate",
      appointments: "Appointments",
      staff: "Staff"
    },
    roles: {
      medecin: "medecin",
      secretaire: "secretaire",
      patient: "Patient",
      admin: "Admin"
    },
    performanceAnalysis: "Performance Analysis",
    performanceSubtitle: "Track and optimize consultation performance",
    completedConsultations: "Completed Consultations",
    pendingConsultations: "Pending Consultations",
    consultationRate: "Consultation Rate",
    consultationsByReason: "Consultations by Reason",
    refreshStats: "Refresh Statistics",
    completed: "Completed",
    pending: "Pending",
    confirmDelete: "Confirm deletion",
    deleteMessage: "Are you sure you want to delete this user?",
    cancel: "Cancel",
    confirm: "Confirm",
    fullName: "Full name",
    phone: "Phone",
    birthDate: "Birth date",
    address: "Address",
    password: "Password",
    passwordConfirmation: "Confirm Password",
    passwordsDontMatch: "Passwords do not match",
    successUpdate: "User updated successfully",
    successCreate: "User created successfully",
    successDelete: "User deleted successfully",
    errorDelete: "Error deleting user",
    editUser: "Edit user",
    create: "Create",
    update: "Update",
    editProfile: "Edit Profile",
    save: "Save",
    profileInfo: "Profile Information",
    updateSuccess: "Profile updated successfully!",
    updateError: "Error updating profile"
  }
};

const DashboardStats = ({ stats, currentTheme, language }) => {
  const [selectedStat, setSelectedStat] = useState(null);

  const getStatDetails = () => {
    if (!stats) return null;
    
    const total = stats.totalAvis || 1;
    switch(selectedStat) {
      case 'totalAvis':
        return `${translations[language].stats.totalAvis}: ${stats.totalAvis}`;
      case 'positifs': 
        return `${stats.totalPositifs} ${translations[language].stats.positifs} (${((stats.totalPositifs/total)*100).toFixed(1)}%)`;
      case 'negatifs':
        return `${stats.totalNegatifs} ${translations[language].stats.negatifs} (${((stats.totalNegatifs/total)*100).toFixed(1)}%)`;
      case 'satisfaction':
        return `${translations[language].stats.satisfaction} : ${stats.tauxSatisfaction}% (${stats.totalPositifs}/${stats.totalAvis})`;
      default: return null;
    }
  };

  return (
    <>
      <Row className="g-4 mb-4">
        {stats && [
          { 
            icon: faComment, 
            value: stats.totalAvis, 
            label: 'totalAvis',
            color: "#00c2cb" 
          },
          { 
            icon: faThumbsUp,
            value: stats.totalPositifs,
            label: 'positifs',
            color: "#00ff88"
          },
          { 
            icon: faThumbsDown, 
            value: stats.totalNegatifs, 
            label: 'negatifs',
            color: "#ff4444" 
          },
          { 
            icon: faChartBar, 
            value: `${stats.tauxSatisfaction}%`, 
            label: 'satisfaction',
            color: "#1e90ff" 
          },
        ].map((stat, index) => (
          <Col md={3} key={index}>
            <Card 
              className="border-0 shadow-lg glass-card hover-transform" 
              style={{ borderRadius: "15px", cursor: 'pointer' }}
              onClick={() => setSelectedStat(stat.label)}
            >
              <Card.Body className="d-flex align-items-center gap-3">
                <div className="icon-wrapper" style={{ backgroundColor: stat.color + '20' }}>
                  <FontAwesomeIcon icon={stat.icon} style={{ color: stat.color, fontSize: "1.5rem" }} />
                </div>
                <div>
                  <h2 className="mb-0">{stat.value}</h2>
                  <small className="text-muted">{translations[language].stats[stat.label]}</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={!!selectedStat} onHide={() => setSelectedStat(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{translations[language].stats[selectedStat]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="mb-3">{getStatDetails()}</h4>
          {selectedStat === 'satisfaction' && (
            <div className="text-center">
              <Doughnut 
                data={{
                  labels: [translations[language].stats.positifs, translations[language].stats.negatifs],
                  datasets: [{
                    data: [stats.totalPositifs, stats.totalNegatifs],
                    backgroundColor: ['#00ff88', '#ff4444'],
                    borderWidth: 2
                  }]
                }}
                options={{ maintainAspectRatio: false }}
                width={300}
                height={300}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

const UserManagement = ({ currentTheme, language }) => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    tel: "",
    adresse: "",
    dateNaissance: "",
    status: "active",
    role: "medecin"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users");
      const sortedUsers = response.data.sort((a, b) => {
        const rolePriority = { 
          admin: 1, 
          medecin: 2, 
          secretaire: 3, 
          patient: 4 
        };
        return rolePriority[a.roles[0]?.name] - rolePriority[b.roles[0]?.name];
      });
      setUsers(sortedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs", error);
      setMessage("Erreur lors du chargement des utilisateurs");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      tel: user.tel || "",
      adresse: user.adresse || "",
      dateNaissance: user.date_naissance || "",
      status: user.status || "active",
      role: user.roles[0]?.name || "medecin",
      password: "",
      password_confirmation: ""
    });
    setEditingId(user.id);
    setShowForm(true);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingId) {
      if (formData.password !== formData.password_confirmation) {
        setMessage(translations[language].passwordsDontMatch);
        return;
      }
    } else {
      if (formData.password && formData.password !== formData.password_confirmation) {
        setMessage(translations[language].passwordsDontMatch);
        return;
      }
    }
  
    try {
      const payload = {
        ...formData,
        date_naissance: formData.dateNaissance,
        ...(editingId && !formData.password ? {} : { password_confirmation: formData.password_confirmation })
      };
  
      if (editingId) {
        if (!payload.password) {
          delete payload.password;
          delete payload.password_confirmation;
        }
      }
  
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/users/update/${editingId}`, payload);
        setMessage(translations[language].successUpdate);
      } else {
        await axios.post("http://127.0.0.1:8000/users/create", payload);
        setMessage(translations[language].successCreate);
      }
  
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de l'opération", error);
      setMessage("Erreur : " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/users/destroy/${selectedUser}`);
      setMessage(translations[language].successDelete);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      setMessage(translations[language].errorDelete);
    }
    setShowDeleteModal(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      tel: "",
      adresse: "",
      dateNaissance: "",
      status: "active",
      role: "medecin"
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserBadge = ({ roles }) => (
    <>
      {roles.map((role, index) => {
        let Icon, Label;
        switch(role.name) {
          case 'medecin':
            Icon = faUserMd;
            Label = translations[language].roles.medecin;
            break;
          case 'administrateur':
            Icon = faUserShield;
            Label = translations[language].roles.admin;
            break;
          case 'secretaire':
            Icon = faUserSecret;
            Label = translations[language].roles.secretaire;
            break;
          case 'patient':
            Icon = faUserInjured;
            Label = translations[language].roles.patient;
            break;
          default:
            Icon = faUserSecret;
            Label = 'administrateur';
        }
        return (
          <Badge 
            key={index} 
            pill 
            className="me-1"
            style={{ 
              backgroundColor: currentTheme === 'dark' ? '#00c2cb20' : '#1e90ff20',
              color: currentTheme === 'dark' ? '#00c2cb' : '000000'
            }}
          >
            <FontAwesomeIcon icon={Icon} className="me-1" />
            {Label}
          </Badge>
        );
      })}
    </>
  );

  const StatusIndicator = ({ status }) => (
    <div className="d-flex align-items-center gap-2">
      <div 
        style={{ 
          width: 10, 
          height: 10, 
          borderRadius: '50%',
          backgroundColor: status === 'active' ? '#28a745' : '#dc3545'
        }} 
      />
      {translations[language][status]}
    </div>
  );

  return (
    <Card className="border-0 shadow-lg glass-card" style={{ borderRadius: "15px" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 style={{ color: currentTheme.text }}>
            <FontAwesomeIcon icon={faUserMd} className="me-2" />
            {translations[language].personnelManagement}
          </h3>
          
          <div className="d-flex gap-2">
            <Form.Control 
              type="search" 
              placeholder={translations[language].searchPlaceholder}
              className="rounded-pill"
              style={{ width: "300px", background: "rgba(255,255,255,0.1)", border: "none" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              variant="primary" 
              onClick={() => setShowForm(true)}
              className="rounded-pill"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              {translations[language].newUser}
            </Button>
          </div>
        </div>

        {message && (
          <Alert 
            variant={message.includes("Erreur") || message.includes("Error") ? "danger" : "success"} 
            onClose={() => setMessage("")}
            dismissible
            className="mt-3"
          >
            {message}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table hover responsive className="align-middle">
            <thead>
              <tr style={{ background: currentTheme.cardBackground }}>
                <th style={{ color: currentTheme.text }}>{translations[language].fullName}</th>
                <th style={{ color: currentTheme.text }}>Email</th>
                <th style={{ color: currentTheme.text }}>{translations[language].role}</th>
                <th style={{ color: currentTheme.text }}>Statut</th>
                <th style={{ color: currentTheme.text }}>{translations[language].actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr 
                  key={user.id} 
                  className="hover-transform"
                  style={{ background: currentTheme.cardBackground }}
                >
                  <td style={{ color: currentTheme.text }}>
                    <div className="d-flex align-items-center gap-2">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: currentTheme.primary + '20',
                          color: currentTheme.primary
                        }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div>{user.name}</div>
                        <small className="text-muted">
                          {new Date(user.date_naissance).toLocaleDateString(language)}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: currentTheme.text }}>
                    <div>{user.email}</div>
                    <small className="text-muted">{user.tel || user.phone}</small>
                  </td>
                  <td><UserBadge roles={user.roles} /></td>
                  <td><StatusIndicator status={user.status} /></td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      <Button 
                        variant="link" 
                        className="text-primary"
                        onClick={() => handleEdit(user)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-danger"
                        onClick={() => {
                          setSelectedUser(user.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal show={showForm} onHide={resetForm} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingId ? translations[language].editUser : translations[language].newUser}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>{translations[language].fullName}</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      {translations[language].password} 
                      {!editingId && <span className="text-danger">*</span>}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingId}
                    />
                    {editingId && (
                      <Form.Text className="text-muted">
                        {translations[language].leaveBlank}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      {translations[language].passwordConfirmation} 
                      {!editingId && <span className="text-danger">*</span>}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      required={!editingId}
                    />
                  </Form.Group>
                </Col>
                    
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>{translations[language].phone}</Form.Label>
                    <Form.Control
                      name="tel"
                      value={formData.tel}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>{translations[language].birthDate}</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>{translations[language].address}</Form.Label>
                    <Form.Control
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>{translations[language].status}</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">{translations[language].active}</option>
                      <option value="inactive">{translations[language].inactive}</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>{translations[language].role}</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="medecin">{translations[language].roles.medecin}</option>
                      <option value="administrateur">{translations[language].roles.admin}</option>
                      <option value="secretaire">{translations[language].roles.secretaire}</option>
                      <option value="patient">{translations[language].roles.patient}</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={resetForm}>
                  {translations[language].cancel}
                </Button>
                <Button variant="primary" type="submit">
                  {editingId ? translations[language].update : translations[language].create}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{translations[language].confirmDelete}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{translations[language].deleteMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              {translations[language].cancel}
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              {translations[language].confirm}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

const AvisManagement = ({ avis, currentTheme, language, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const StarRating = ({ note }) => {
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            size="sm"
            className="me-1"
            style={{ 
              color: index < note ? '#ffd700' : '#e4e5e9',
              filter: index < note ? 'drop-shadow(0 0 2px rgba(255,215,0,0.5))' : 'none'
            }}
          />
        ))}
        <span className="ms-2 text-muted">({note}/5)</span>
      </div>
    );
  };

  const filteredAvis = avis.filter(avisItem =>
    avisItem.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    avisItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    avisItem.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-lg glass-card" style={{ borderRadius: "15px" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 style={{ color: currentTheme.text }}>
            {translations[language].avisManagement}
          </h3>
          <Form.Control 
            type="search" 
            placeholder={translations[language].searchPlaceholder}
            className="rounded-pill"
            style={{ width: "300px", background: "rgba(255,255,255,0.1)", border: "none" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table hover responsive className="align-middle">
            <thead>
              <tr style={{ background: currentTheme.cardBackground }}>
                <th style={{ color: currentTheme.text }}>Nom</th>
                <th style={{ color: currentTheme.text }}>Email</th>
                <th style={{ color: currentTheme.text }}>Message</th>
                <th style={{ color: currentTheme.text }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredAvis.map(avisItem => (
                <tr 
                  key={avisItem.id} 
                  className="hover-transform"
                  style={{ background: currentTheme.cardBackground }}
                >
                  <td style={{ color: currentTheme.text }}>{avisItem.nom}</td>
                  <td style={{ color: currentTheme.text }}>{avisItem.email}</td>
                  <td style={{ color: currentTheme.text }}>{avisItem.message}</td>
                  <td>
                    <StarRating note={avisItem.note} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

const Reports = ({ currentTheme, language }) => {
  const [successCount, setSuccessCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [motifStats, setMotifStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/reports");
        setSuccessCount(response.data.totalReussies);
        setCancelledCount(response.data.totalAnnulees);
        setMotifStats(response.data.motifStats);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de récupération des rapports:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const doughnutData = {
    labels: [translations[language].completed, translations[language].pending],
    datasets: [
      {
        data: [successCount, cancelledCount],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF80A0', '#50B4F5'],
        borderWidth: 2,
      },
    ],
  };

  const motifData = {
    labels: motifStats.map(item => item.motif),
    datasets: [
      {
        label: translations[language].consultationsByReason,
        data: motifStats.map(item => item.total),
        backgroundColor: motifStats.map(() => 
          `#${Math.floor(Math.random()*16777215).toString(16)}`
        ),
        borderColor: currentTheme.cardBackground,
        borderWidth: 2,
      },
    ],
  };

  const successPercentage = successCount ? ((successCount / (successCount + cancelledCount)) * 100).toFixed(1) : 0;
  const cancelledPercentage = cancelledCount ? ((cancelledCount / (successCount + cancelledCount)) * 100).toFixed(1) : 0;

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-lg glass-card">
        <Card.Body>
          <div className="text-center py-4 header-container" style={{
            background: currentTheme.gradient,
            borderRadius: "16px",
            marginBottom: "2rem"
          }}>
            <h1 className="display-5 fw-bold" style={{ color: currentTheme.text }}>
              <FontAwesomeIcon icon={faChartPie} className="me-2" />
              {translations[language].performanceAnalysis}
            </h1>
            <p className="fs-5" style={{ color: currentTheme.text }}>
              {translations[language].performanceSubtitle}
            </p>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
              <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
            </div>
          ) : (
            <>
              <Row className="g-4 mb-4">
                {[
                  { 
                    icon: faChartPie, 
                    title: translations[language].completedConsultations, 
                    value: successCount 
                  },
                  { 
                    icon: faChartBar, 
                    title: translations[language].pendingConsultations, 
                    value: cancelledCount 
                  }
                ].map((stat, index) => (
                  <Col md={6} key={index}>
                    <Card className="border-0 shadow-lg glass-card" style={{ 
                      background: currentTheme.primary,
                      color: 'white',
                      borderRadius: "16px"
                    }}>
                      <Card.Body className="text-center">
                        <FontAwesomeIcon icon={stat.icon} size="2x" className="mb-3" />
                        <h5 className="card-title">{stat.title}</h5>
                        <p className="card-text fs-3 fw-bold">{stat.value}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row className="g-4">
                <Col lg={5}>
                  <Card className="border-0 shadow-lg glass-card h-100">
                    <Card.Body>
                      <h4 className="text-center mb-3" style={{ color: currentTheme.text }}>
                        {translations[language].consultationRate}
                      </h4>
                      <div style={{ width: '70%', margin: '0 auto' }}>
                        <Doughnut data={doughnutData} />
                      </div>
                      <div className="mt-3 text-center" style={{ color: currentTheme.text }}>
                        ✅ {successPercentage}% {translations[language].completed} | 
                        ⏳ {cancelledPercentage}% {translations[language].pending}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={7}>
                  <Card className="border-0 shadow-lg glass-card h-100">
                    <Card.Body>
                      <h4 className="text-center mb-3" style={{ color: currentTheme.text }}>
                        {translations[language].consultationsByReason}
                      </h4>
                      <Bar 
                        data={motifData} 
                        options={{ 
                          plugins: { 
                            legend: { 
                              labels: { color: currentTheme.text } 
                            } 
                          },
                          scales: {
                            y: {
                              ticks: { color: currentTheme.text },
                              grid: { color: currentTheme.text + '20' }
                            },
                            x: {
                              ticks: { color: currentTheme.text },
                              grid: { color: currentTheme.text + '20' }
                            }
                          }
                        }}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="text-center mt-5">
                <Button 
                  variant="primary" 
                  className="rounded-pill px-4 py-2"
                  onClick={() => window.location.reload()}
                  style={{ background: currentTheme.primary, border: 'none' }}
                >
                  <FontAwesomeIcon icon={faSyncAlt} className="me-2" />
                  {translations[language].refreshStats}
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

const ProfilCard = ({ profil, onUpdate, currentTheme, language, isEditing, setIsEditing }) => {
  const [formData, setFormData] = useState({ ...profil });

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-0 shadow-lg" style={{ borderRadius: "15px" }}>
        <Card.Body className="p-4">
          {!isEditing ? (
            <>
              <div className="text-center mb-4">
                <FontAwesomeIcon 
                  icon={faUser} 
                  size="2x" 
                  className="mb-3"
                  style={{ color: currentTheme.primary }}
                />
                <h3 style={{ color: currentTheme.text }}>{formData.nom}</h3>
                <Badge 
                  pill 
                  style={{ 
                    background: currentTheme.primary + '20',
                    color: currentTheme.primary
                  }}
                >
                  Administrateur
                </Badge>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <FontAwesomeIcon icon={faEnvelope} style={{ color: currentTheme.primary }} />
                  <span style={{ color: currentTheme.text }}>{formData.email}</span>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <FontAwesomeIcon icon={faPhone} style={{ color: currentTheme.primary }} />
                  <span style={{ color: currentTheme.text }}>{formData.tel}</span>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <FontAwesomeIcon icon={faHome} style={{ color: currentTheme.primary }} />
                  <span style={{ color: currentTheme.text }}>{formData.adresse}</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <FontAwesomeIcon icon={faBirthdayCake} style={{ color: currentTheme.primary }} />
                  <span style={{ color: currentTheme.text }}>{formData.date_naissance}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-100"
                onClick={() => setIsEditing(true)}
              >
                {translations[language].editProfile}
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: currentTheme.text }}>Nom</Form.Label>
                <Form.Control
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  style={{ 
                    background: currentTheme.cardBackground,
                    color: currentTheme.text
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: currentTheme.text }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ 
                    background: currentTheme.cardBackground,
                    color: currentTheme.text
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: currentTheme.text }}>Téléphone</Form.Label>
                <Form.Control
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  style={{ 
                    background: currentTheme.cardBackground,
                    color: currentTheme.text
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: currentTheme.text }}>Adresse</Form.Label>
                <Form.Control
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  style={{ 
                    background: currentTheme.cardBackground,
                    color: currentTheme.text
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: currentTheme.text }}>Date de naissance</Form.Label>
                <Form.Control
                  type="date"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                  style={{ 
                    background: currentTheme.cardBackground,
                    color: currentTheme.text
                  }}
                />
              </Form.Group>
              
              <div className="d-flex gap-2">
                <Button variant="success" type="submit" className="flex-grow-1">
                  {translations[language].save}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsEditing(false)}
                  className="flex-grow-1"
                >
                  {translations[language].cancel}
                </Button>
              </div>
            </form>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

const Profil = ({ currentTheme, language }) => {
  const [profil, setProfil] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profil");
        setProfil(response.data);
        setLoading(false);
      } catch (error) {
        setAlert({ type: "danger", message: translations[language].updateError });
        setLoading(false);
      }
    };

    fetchProfil();
  }, [language]);

  const handleUpdate = async (newData) => {
    try {
      const response = await axios.put("http://localhost:8000/api/profil/update", newData);
      setProfil(response.data);
      setAlert({ type: "success", message: translations[language].updateSuccess });
    } catch (error) {
      setAlert({ type: "danger", message: translations[language].updateError });
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {alert && (
            <Alert 
              variant={alert.type} 
              onClose={() => setAlert(null)} 
              dismissible
              className="mb-4"
            >
              {alert.message}
            </Alert>
          )}

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <ProfilCard
              profil={profil}
              onUpdate={handleUpdate}
              currentTheme={currentTheme}
              language={language}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

const AdminDashboard = () => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("fr");
  const [avis, setAvis] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const currentTheme = themeConfig[theme];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [avisResponse, statsResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/avis"),
          axios.get("http://localhost:8000/api/users")
        ]);

        setAvis(avisResponse.data);
        setStats(statsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");
  const switchLanguage = (lang) => setLanguage(lang);

  return (
    <div style={{ 
      minHeight: "100vh",
      background: currentTheme.gradient,
      color: currentTheme.text,
      backgroundImage: theme === "dark" ? currentTheme.backgroundImage : "none",
      backgroundSize: "cover",
      backgroundAttachment: "fixed"
    }}>
      <Navbar expand="lg" className="p-3" style={{ 
        background: currentTheme.gradient,
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)"
      }}>
        <Container fluid>
          <Navbar.Brand className="text-white d-flex align-items-center">
            <span className="me-2">🏥</span>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", margin: 0 }}>AI-MedCare 🩺🤍</h2>
          </Navbar.Brand>

          <div className="d-flex align-items-center gap-4 ms-auto">
            <Button 
              variant="light" 
              className="rounded-pill px-3 d-flex align-items-center"
              onClick={toggleTheme}
            >
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="me-2" />
              {theme === "dark" ? "Light" : "Dark"}
            </Button>
            
            <Dropdown>
              <Dropdown.Toggle variant="light" className="d-flex align-items-center rounded-pill">
                <FontAwesomeIcon icon={faGlobe} className="me-2" />
                {language.toUpperCase()}
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow-lg">
                <Dropdown.Item onClick={() => switchLanguage('fr')}>Français</Dropdown.Item>
                <Dropdown.Item onClick={() => switchLanguage('en')}>English</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown align="end">
              <Dropdown.Toggle variant="light" className="d-flex align-items-center rounded-pill">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                {translations[language].profile}
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow-lg">
                <Dropdown.Item 
                  as={Link} 
                  to="/profil"
                  className="d-flex align-items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCog} />
                  {translations[language].settings}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-danger">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  {translations[language].logout}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          <Col md={3} className="p-4" style={{ 
            backdropFilter: "blur(10px)",
            borderRight: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
          }}>
            <Nav className="flex-column gap-2">
              <Button 
                variant="primary" 
                className="rounded-pill py-2 shadow-sm mb-4 glass-card"
                style={{ border: "none" }}
                as={Link}
                to="/avis"
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                {translations[language].newAvis}
              </Button>
              
              {[
                { icon: faChartBar, text: translations[language].dashboard, path: "/dashboard" },
                { icon: faComment, text: translations[language].avisManagement, path: "/avis" },
                { icon: faUserMd, text: translations[language].personnelManagement, path: "/users" },
                { icon: faClipboardList, text: translations[language].reportsStatistics, path: "/reports" },
                { 
                  icon: faCog, 
                  text: translations[language].dashboardSettings, 
                  path: "/dashboard-settings",
                  external: "http://127.0.0.1:8000/a-propos-ns/create" 
                }
              ].map((item, index) => (
                <Nav.Link 
                  key={index}
                  as={item.external ? 'a' : Link}
                  href={item.external || undefined}
                  to={!item.external ? item.path : undefined}
                  target={item.external ? "_blank" : undefined}
                  className="d-flex align-items-center gap-2 p-3 rounded hover-effect"
                  style={{ 
                    color: currentTheme.text,
                    background: location.pathname === item.path ? currentTheme.primary + '20' : 'transparent'
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} className="fs-5" />
                  <span className="fs-5">{item.text}</span>
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          <Col md={9} className="p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <>
                    <DashboardStats stats={stats} currentTheme={currentTheme} language={language} />
                    <AvisManagement 
                      avis={avis}
                      currentTheme={currentTheme}
                      language={language}
                      loading={loading}
                    />
                  </>
                } 
              />
              
              <Route 
                path="/avis" 
                element={
                  <AvisManagement 
                    avis={avis}
                    currentTheme={currentTheme}
                    language={language}
                    loading={loading}
                  />
                } 
              />
              
              <Route 
                path="/users" 
                element={
                  <UserManagement 
                    currentTheme={currentTheme}
                    language={language}
                  />
                } 
              />

              <Route 
                path="/reports" 
                element={
                  <Reports 
                    currentTheme={currentTheme}
                    language={language}
                  />
                } 
              />

              <Route 
                path="/profil" 
                element={
                  <Profil 
                    currentTheme={currentTheme} 
                    language={language} 
                  />
                } 
              />
            </Routes>
          </Col>
        </Row>
      </Container>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

        body {
          font-family: 'Montserrat', sans-serif;
          transition: all 0.3s ease;
        }

        .glass-card {
          background: ${currentTheme.cardBackground};
          backdrop-filter: blur(12px);
          border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
          transition: all 0.3s ease;
        }

        .hover-effect {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .hover-effect:hover {
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
          transform: translateX(8px);
        }

        .hover-transform {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-transform:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }

        .icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .table {
          --bs-table-bg: transparent;
          --bs-table-color: ${currentTheme.text};
          border-color: ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
        }

        .header-container {
          border-radius: 16px;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

const App = () => (
  <Router>
    <AdminDashboard />
  </Router>
);

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);