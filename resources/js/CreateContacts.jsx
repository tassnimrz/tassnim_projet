import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShareAlt, FaArrowUp } from "react-icons/fa";

// Styles CSS intégrés
const styles = `
  body {
    background-color: #f8f9fa;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .app-container {
    min-height: 100vh;
    padding: 2rem 0;
  }

  .card {
    transition: all 0.3s ease;
    border: none;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    font-weight: 600;
    border-bottom: none;
    padding: 1rem 1.5rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .btn {
    font-weight: 500;
    transition: all 0.3s ease;
    border-radius: 8px;
    padding: 8px 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-primary {
    background-color: #4361ee;
    border-color: #4361ee;
  }

  .btn-primary:hover {
    background-color: #3a56d4;
    border-color: #3a56d4;
  }

  .btn-success {
    background-color: #4cc9f0;
    border-color: #4cc9f0;
  }

  .btn-success:hover {
    background-color: #38b6db;
    border-color: #38b6db;
  }

  .btn-outline-primary {
    color: #4361ee;
    border-color: #4361ee;
  }

  .btn-outline-primary:hover {
    background-color: #4361ee;
    color: white;
  }

  .btn-outline-danger {
    color: #e63946;
    border-color: #e63946;
  }

  .btn-outline-danger:hover {
    background-color: #e63946;
    color: white;
  }

  .form-control, .form-select {
    border-radius: 8px;
    padding: 10px 15px;
    border: 1px solid #dee2e6;
  }

  .form-control:focus, .form-select:focus {
    border-color: #4361ee;
    box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
  }

  .input-group-text {
    background-color: #f8f9fa;
    border-radius: 8px 0 0 8px !important;
  }

  .list-item {
    padding: 5px 0;
    display: flex;
    align-items: center;
  }

  .alert {
    border-radius: 8px;
    padding: 12px 16px;
    animation: fadeIn 0.3s ease forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .social-icon {
    font-size: 1.2rem;
    margin-right: 8px;
    color: #4361ee;
  }

  a {
    color: #4361ee;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #3a56d4;
    text-decoration: underline;
  }

  .section-title {
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #dee2e6;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
  }

  .back-to-admin {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background-color: #4361ee;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .back-to-admin:hover {
    background-color: #3a56d4;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  @media (max-width: 768px) {
    .card-body {
      padding: 1rem;
    }
    
    .btn {
      padding: 6px 12px;
      font-size: 0.9rem;
    }
  }
`;

const CreateContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [socials, setSocials] = useState([]);
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [adresse, setAdresse] = useState("");
    const [map, setMap] = useState("");
    const [plateforme, setPlateforme] = useState("");
    const [lien, setLien] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [editingId, setEditingId] = useState(null);
    const [editingSocialId, setEditingSocialId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showSocialForm, setShowSocialForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    

    const socialPlatforms = [
        "Facebook",
        "Twitter",
        "Instagram",
        "LinkedIn",
        "YouTube",
        "TikTok",
        "Snapchat",
        "Pinterest",
        "Reddit",
        "Whatsapp",
        "Other"
    ];

    useEffect(() => {
        fetchContacts();
        fetchSocials();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/contact");
            setContacts(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors du chargement des contacts", error);
            setMessage({ text: "Erreur lors du chargement des contacts", type: "danger" });
            setIsLoading(false);
        }
    };

    const fetchSocials = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/reseaux");
            setSocials(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors du chargement des réseaux sociaux", error);
            setMessage({ text: "Erreur lors du chargement des réseaux sociaux", type: "danger" });
            setIsLoading(false);
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const formData = { email, tel, adresse, map };

        try {
            setIsLoading(true);
            if (editingId) {
                await axios.put(`http://127.0.0.1:8000/contact/update/${editingId}`, formData);
                setMessage({ text: "Contact mis à jour avec succès !", type: "success" });
            } else {
                await axios.post("http://127.0.0.1:8000/contact/store", formData);
                setMessage({ text: "Contact ajouté avec succès !", type: "success" });
            }

            setEmail("");
            setTel("");
            setAdresse("");
            setMap("");
            setEditingId(null);
            setShowForm(false);
            fetchContacts();
        } catch (error) {
            console.error("Erreur lors de l'ajout/mise à jour du contact", error);
            setMessage({ text: "Erreur lors de l'opération.", type: "danger" });
            setIsLoading(false);
        }
    };

    const handleSocialSubmit = async (e) => {
        e.preventDefault();
        const formData = { plateforme, lien };

        try {
            setIsLoading(true);
            if (editingSocialId) {
                await axios.put(`http://127.0.0.1:8000/reseaux/update/${editingSocialId}`, formData);
                setMessage({ text: "Réseau social mis à jour avec succès !", type: "success" });
            } else {
                await axios.post("http://127.0.0.1:8000/reseaux/store", formData);
                setMessage({ text: "Réseau social ajouté avec succès !", type: "success" });
            }

            setPlateforme("");
            setLien("");
            setEditingSocialId(null);
            setShowSocialForm(false);
            fetchSocials();
        } catch (error) {
            console.error("Erreur lors de l'ajout/mise à jour du réseau social", error);
            setMessage({ text: "Erreur lors de l'opération.", type: "danger" });
            setIsLoading(false);
        }
    };

    const handleEditContact = (contact) => {
        setEmail(contact.email);
        setTel(contact.tel);
        setAdresse(contact.adresse);
        setMap(contact.map);
        setEditingId(contact.id);
        setShowForm(true);
        setMessage({ text: "", type: "" });
    };

    const handleEditSocial = (social) => {
        setPlateforme(social.plateforme);
        setLien(social.lien);
        setEditingSocialId(social.id);
        setShowSocialForm(true);
        setMessage({ text: "", type: "" });
    };

    const handleDeleteContact = async (id) => {
        try {
            setIsLoading(true);
            await axios.delete(`http://127.0.0.1:8000/contact/destroy/${id}`);
            setMessage({ text: "Contact supprimé avec succès !", type: "success" });
            fetchContacts();
        } catch (error) {
            console.error("Erreur lors de la suppression du contact", error);
            setMessage({ text: "Erreur lors de la suppression.", type: "danger" });
            setIsLoading(false);
        }
    };

    const handleDeleteSocial = async (id) => {
        try {
            setIsLoading(true);
            await axios.delete(`http://127.0.0.1:8000/reseaux/destroy/${id}`);
            setMessage({ text: "Réseau social supprimé avec succès !", type: "success" });
            fetchSocials();
        } catch (error) {
            console.error("Erreur lors de la suppression du réseau social", error);
            setMessage({ text: "Erreur lors de la suppression.", type: "danger" });
            setIsLoading(false);
        }
    };

    const getPlatformIcon = (platform) => {
        const platformLower = platform.toLowerCase();
        if (platformLower.includes("facebook")) return "fab fa-facebook-f";
        if (platformLower.includes("twitter")) return "fab fa-twitter";
        if (platformLower.includes("instagram")) return "fab fa-instagram";
        if (platformLower.includes("linkedin")) return "fab fa-linkedin-in";
        if (platformLower.includes("youtube")) return "fab fa-youtube";
        if (platformLower.includes("tiktok")) return "fab fa-tiktok";
        if (platformLower.includes("snapchat")) return "fab fa-snapchat-ghost";
        if (platformLower.includes("pinterest")) return "fab fa-pinterest-p";
        if (platformLower.includes("reddit")) return "fab fa-reddit-alien";
        if (platformLower.includes("whatsapp")) return "fab fa-whatsapp";
        return "fas fa-share-alt";
    };

    const handleBackToAdmin = () => {
        window.location.href = "http://127.0.0.1:8000/dashboard/admin";
    };

    return (
        <>
            <style>{styles}</style>
            <div className="app-container">
                {/* Bouton flèche pour retourner à l'admin */}
                <div className="back-to-admin" onClick={handleBackToAdmin}>
                    <FaArrowUp />
                </div>

                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="card shadow-lg">
                                <div className="card-header bg-primary text-white">
                                    <h1 className="h4 mb-0">Gestion des Contacts et Réseaux Sociaux</h1>
                                </div>
                                
                                <div className="card-body">
                                    {message.text && (
                                        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                                            {message.text}
                                            <button 
                                                type="button" 
                                                className="btn-close" 
                                                onClick={() => setMessage({ text: "", type: "" })}
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                    )}

                                    <div className="d-flex flex-wrap justify-content-between gap-2 mb-4">
                                        <button
                                            onClick={() => setShowForm(!showForm)}
                                            className={`btn ${showForm ? 'btn-outline-primary' : 'btn-primary'}`}
                                        >
                                            <FaPlus />
                                            {showForm ? "Masquer le formulaire" : "Ajouter un Contact"}
                                        </button>

                                        <button
                                            onClick={() => setShowSocialForm(!showSocialForm)}
                                            className={`btn ${showSocialForm ? 'btn-outline-success' : 'btn-success'}`}
                                        >
                                            <FaPlus />
                                            {showSocialForm ? "Masquer le formulaire" : "Ajouter un Réseau"}
                                        </button>
                                    </div>

                                    {/* Contact Form */}
                                    {showForm && (
                                        <div className="card mb-4">
                                            <div className="card-header bg-light">
                                                <h2 className="h5 mb-0">{editingId ? "Modifier le Contact" : "Ajouter un Contact"}</h2>
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={handleContactSubmit}>
                                                    <div className="row g-3">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Email</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text"><FaEnvelope /></span>
                                                                <input 
                                                                    type="email" 
                                                                    className="form-control" 
                                                                    value={email} 
                                                                    onChange={(e) => setEmail(e.target.value)} 
                                                                    required 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Téléphone</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text"><FaPhone /></span>
                                                                <input 
                                                                    type="tel" 
                                                                    className="form-control" 
                                                                    value={tel} 
                                                                    onChange={(e) => setTel(e.target.value)} 
                                                                    required 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="form-label">Adresse</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text"><FaMapMarkerAlt /></span>
                                                                <input 
                                                                    type="text" 
                                                                    className="form-control" 
                                                                    value={adresse} 
                                                                    onChange={(e) => setAdresse(e.target.value)} 
                                                                    required 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="form-label">Google Maps (URL)</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text"><FaMapMarkerAlt /></span>
                                                                <input 
                                                                    type="url" 
                                                                    className="form-control" 
                                                                    value={map} 
                                                                    onChange={(e) => setMap(e.target.value)} 
                                                                    required 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <button 
                                                                type="submit" 
                                                                className="btn btn-primary w-100"
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                        Chargement...
                                                                    </>
                                                                ) : editingId ? "Mettre à jour" : "Ajouter"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    {/* Social Form */}
                                    {showSocialForm && (
                                        <div className="card mb-4">
                                            <div className="card-header bg-light">
                                                <h2 className="h5 mb-0">{editingSocialId ? "Modifier le Réseau Social" : "Ajouter un Réseau Social"}</h2>
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={handleSocialSubmit}>
                                                    <div className="row g-3">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Plateforme</label>
                                                            <select
                                                                className="form-select"
                                                                value={plateforme}
                                                                onChange={(e) => setPlateforme(e.target.value)}
                                                                required
                                                            >
                                                                <option value="">Sélectionner une plateforme</option>
                                                                {socialPlatforms.map((platform, index) => (
                                                                    <option key={index} value={platform}>{platform}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Lien</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text"><FaShareAlt /></span>
                                                                <input 
                                                                    type="url" 
                                                                    className="form-control" 
                                                                    value={lien} 
                                                                    onChange={(e) => setLien(e.target.value)} 
                                                                    required 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <button 
                                                                type="submit" 
                                                                className="btn btn-success w-100"
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                        Chargement...
                                                                    </>
                                                                ) : editingSocialId ? "Mettre à jour" : "Ajouter"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    {/* Contacts List */}
                                    <div className="mb-5">
                                        <h2 className="section-title">
                                            <FaPhone />
                                            Liste des Contacts
                                        </h2>
                                        {isLoading ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Chargement...</span>
                                                </div>
                                            </div>
                                        ) : contacts.length === 0 ? (
                                            <div className="empty-state">
                                                <p>Aucun contact disponible</p>
                                                <button 
                                                    className="btn btn-primary mt-2"
                                                    onClick={() => setShowForm(true)}
                                                >
                                                    <FaPlus /> Ajouter un contact
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="row g-4">
                                                {contacts.map((contact) => (
                                                    <div key={contact.id} className="col-md-6">
                                                        <div className="card h-100">
                                                            <div className="card-body">
                                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                                    <h3 className="h6 mb-0">Contact #{contact.id}</h3>
                                                                    <div>
                                                                        <button 
                                                                            onClick={() => handleEditContact(contact)} 
                                                                            className="btn btn-sm btn-outline-primary me-1"
                                                                            title="Modifier"
                                                                        >
                                                                            <FaEdit />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDeleteContact(contact.id)} 
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            title="Supprimer"
                                                                        >
                                                                            <FaTrash />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <ul className="list-unstyled">
                                                                    <li className="list-item">
                                                                        <FaEnvelope className="text-primary me-2" />
                                                                        <strong>Email:</strong> {contact.email || "Non renseigné"}
                                                                    </li>
                                                                    <li className="list-item">
                                                                        <FaPhone className="text-primary me-2" />
                                                                        <strong>Téléphone:</strong> {contact.tel || "Non renseigné"}
                                                                    </li>
                                                                    <li className="list-item">
                                                                        <FaMapMarkerAlt className="text-primary me-2" />
                                                                        <strong>Adresse:</strong> {contact.adresse || "Non renseigné"}
                                                                    </li>
                                                                    {contact.map && (
                                                                        <li className="list-item">
                                                                            <a href={contact.map} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                                                <FaMapMarkerAlt className="text-danger me-2" />
                                                                                Voir sur Google Maps
                                                                            </a>
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Social Networks List */}
                                    <div>
                                        <h2 className="section-title">
                                            <FaShareAlt />
                                            Liste des Réseaux Sociaux
                                        </h2>
                                        {isLoading ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Chargement...</span>
                                                </div>
                                            </div>
                                        ) : socials.length === 0 ? (
                                            <div className="empty-state">
                                                <p>Aucun réseau social disponible</p>
                                                <button 
                                                    className="btn btn-success mt-2"
                                                    onClick={() => setShowSocialForm(true)}
                                                >
                                                    <FaPlus /> Ajouter un réseau
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="row g-4">
                                                {socials.map((social) => (
                                                    <div key={social.id} className="col-md-6 col-lg-4">
                                                        <div className="card h-100">
                                                            <div className="card-body">
                                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                                    <h3 className="h6 mb-0">
                                                                        <i className={`${getPlatformIcon(social.plateforme)} me-2`}></i>
                                                                        {social.plateforme}
                                                                    </h3>
                                                                    <div>
                                                                        <button 
                                                                            onClick={() => handleEditSocial(social)} 
                                                                            className="btn btn-sm btn-outline-primary me-1"
                                                                            title="Modifier"
                                                                        >
                                                                            <FaEdit />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDeleteSocial(social.id)} 
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            title="Supprimer"
                                                                        >
                                                                            <FaTrash />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <p className="mb-0">
                                                                    <a 
                                                                        href={social.lien} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer" 
                                                                        className="text-decoration-none text-truncate d-block"
                                                                        title={social.lien}
                                                                    >
                                                                        <FaShareAlt className="me-2" />
                                                                        {social.lien.length > 30 ? `${social.lien.substring(0, 30)}...` : social.lien}
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<CreateContacts />);