import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

import {  FaArrowLeft } from "react-icons/fa";
const CreateServices = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/services");
            setServices(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des services", error);
            showMessage("Erreur lors du chargement des services", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);

        try {
            if (editingId) {
                await axios.post(`http://127.0.0.1:8000/services/update/${editingId}`, data);
                showMessage("Service mis à jour avec succès !");
            } else {
                await axios.post("http://127.0.0.1:8000/services/store", data);
                showMessage("Service ajouté avec succès !");
            }

            resetForm();
            fetchServices();
        } catch (error) {
            console.error("Erreur lors de l'ajout/mise à jour du service", error);
            showMessage("Erreur lors de l'opération", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (service) => {
        setFormData({
            title: service.title,
            description: service.description
        });
        setEditingId(service.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;
        
        setIsLoading(true);
        try {
            await axios.delete(`http://127.0.0.1:8000/services/destroy/${id}`);
            showMessage("Service supprimé avec succès !");
            fetchServices();
        } catch (error) {
            console.error("Erreur lors de la suppression du service", error);
            showMessage("Erreur lors de la suppression", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", description: "" });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="services-app">
            <header className="app-header">
    <a 
        href="http://127.0.0.1:8000/dashboard/admin" 
        className="back-button"
        title="Retour au tableau de bord"
    >
        <FaArrowLeft />
    </a>
    <h1>Gestion des Services</h1>
    <p>Créez et gérez vos services professionnels</p>
</header>

            <main className="app-container">
                <div className="controls-section">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`action-button ${showForm ? 'cancel' : 'primary'}`}
                    >
                        {showForm ? (
                            <>
                                <FaTimes /> Annuler
                            </>
                        ) : (
                            <>
                                <FaPlus /> Ajouter un service
                            </>
                        )}
                    </button>
                </div>

                {message.text && (
                    <div className={`alert-message ${message.type}`}>
                        {message.text}
                        <button onClick={() => setMessage({ text: "", type: "" })}>×</button>
                    </div>
                )}

                {showForm && (
                    <div className="form-card">
                        <h2>{editingId ? "Modifier le service" : "Nouveau service"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Titre du service</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nom du service"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Description détaillée"
                                    rows="4"
                                ></textarea>
                            </div>
                            
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="secondary-button"
                                    disabled={isLoading}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="spinner"></span>
                                    ) : editingId ? (
                                        <>
                                            <FaCheck /> Mettre à jour
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus /> Ajouter
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <section className="services-section">
                    <h2>Liste des services</h2>
                    
                    {isLoading && !showForm ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucun service disponible</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="primary-button"
                            >
                                <FaPlus /> Ajouter votre premier service
                            </button>
                        </div>
                    ) : (
                        <div className="services-grid">
                            {services.map(service => (
                                <div key={service.id} className="service-card">
                                    <div className="service-content">
                                        <h3>{service.title}</h3>
                                        <p>{service.description}</p>
                                    </div>
                                    <div className="service-actions">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="icon-button edit"
                                            title="Modifier"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="icon-button delete"
                                            title="Supprimer"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <footer className="app-footer">
                <p>{services.length} service{services.length !== 1 ? 's' : ''} au total</p>
            </footer>

            <style jsx>{`
                :root {
                    --primary-color: #2563eb;
                    --primary-hover: #1d4ed8;
                    --secondary-color: #3b82f6;
                    --light-blue: #eff6ff;
                    --dark-blue: #1e3a8a;
                    --success-color: #10b981;
                    --error-color: #ef4444;
                    --text-color: #1f2937;
                    --light-gray: #f3f4f6;
                    --medium-gray: #e5e7eb;
                    --white: #ffffff;
                    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    --transition: all 0.3s ease;
                }

                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .services-app {
                    min-height: 100vh;
                    background-color: var(--light-blue);
                    color: var(--text-color);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    display: flex;
                    flex-direction: column;
                }

                .app-header {
                    background: linear-gradient(135deg, var(--primary-color), var(--dark-blue));
                    color: var(--white);
                    padding: 2rem 1rem;
                    text-align: center;
                    box-shadow: var(--shadow);
                }

                .app-header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                }

                .app-header p {
                    font-size: 1.1rem;
                    opacity: 0.9;
                }

                .app-container {
                    max-width: 1200px;
                    margin: 2rem auto;
                    padding: 0 1rem;
                    width: 100%;
                    flex: 1;
                }

                .controls-section {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 1.5rem;
                }

                .action-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                    border: none;
                    font-size: 1rem;
                }

                .action-button.primary {
                    background-color: var(--primary-color);
                    color: var(--white);
                    box-shadow: var(--shadow);
                }

                .action-button.primary:hover {
                    background-color: var(--primary-hover);
                    box-shadow: var(--shadow-hover);
                    transform: translateY(-2px);
                }

                .action-button.cancel {
                    background-color: var(--white);
                    color: var(--error-color);
                    border: 1px solid var(--error-color);
                }

                .action-button.cancel:hover {
                    background-color: #fee2e2;
                }

                .alert-message {
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 500;
                    animation: fadeIn 0.3s ease;
                }

                .alert-message.success {
                    background-color: #d1fae5;
                    color: #065f46;
                    border-left: 4px solid var(--success-color);
                }

                .alert-message.error {
                    background-color: #fee2e2;
                    color: #b91c1c;
                    border-left: 4px solid var(--error-color);
                }

                .alert-message button {
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: var(--transition);
                }

                .alert-message button:hover {
                    opacity: 1;
                }

                .form-card {
                    background-color: var(--white);
                    border-radius: 0.75rem;
                    padding: 2rem;
                    box-shadow: var(--shadow);
                    margin-bottom: 2rem;
                    animation: slideDown 0.3s ease;
                }

                .form-card h2 {
                    color: var(--primary-color);
                    margin-bottom: 1.5rem;
                    font-size: 1.5rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: var(--text-color);
                }

                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--medium-gray);
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    transition: var(--transition);
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .form-group textarea {
                    min-height: 120px;
                    resize: vertical;
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .secondary-button {
                    background-color: var(--white);
                    color: var(--text-color);
                    border: 1px solid var(--medium-gray);
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .secondary-button:hover {
                    background-color: var(--light-gray);
                }

                .submit-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background-color: var(--success-color);
                    color: var(--white);
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .submit-button:hover {
                    background-color: #059669;
                }

                .submit-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .services-section h2 {
                    font-size: 1.5rem;
                    color: var(--text-color);
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid var(--medium-gray);
                }

                .loading-spinner {
                    display: flex;
                    justify-content: center;
                    padding: 3rem 0;
                }

                .spinner {
                    width: 2rem;
                    height: 2rem;
                    border: 3px solid var(--primary-color);
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 0;
                    background-color: var(--white);
                    border-radius: 0.75rem;
                    box-shadow: var(--shadow);
                }

                .empty-state p {
                    margin-bottom: 1.5rem;
                    color: var(--text-color);
                    opacity: 0.8;
                }

                .primary-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background-color: var(--primary-color);
                    color: var(--white);
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .primary-button:hover {
                    background-color: var(--primary-hover);
                    transform: translateY(-2px);
                }

                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .service-card {
                    background-color: var(--white);
                    border-radius: 0.75rem;
                    overflow: hidden;
                    box-shadow: var(--shadow);
                    transition: var(--transition);
                    display: flex;
                    flex-direction: column;
                }

                .service-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-hover);
                }

                .service-content {
                    padding: 1.5rem;
                    flex: 1;
                }

                .service-content h3 {
                    color: var(--primary-color);
                    margin-bottom: 0.75rem;
                    font-size: 1.25rem;
                }

                .service-content p {
                    color: var(--text-color);
                    opacity: 0.9;
                }

                .service-actions {
                    display: flex;
                    border-top: 1px solid var(--medium-gray);
                    padding: 0.75rem 1.5rem;
                    justify-content: flex-end;
                    gap: 0.75rem;
                }

                .icon-button {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--transition);
                    border: none;
                    background-color: transparent;
                }

                .icon-button.edit {
                    color: #d97706;
                }

                .icon-button.edit:hover {
                    background-color: #fef3c7;
                }

                .icon-button.delete {
                    color: var(--error-color);
                }

                .icon-button.delete:hover {
                    background-color: #fee2e2;
                }

                .app-footer {
                    text-align: center;
                    padding: 1.5rem;
                    background-color: var(--white);
                    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
                    color: var(--text-color);
                    font-size: 0.9rem;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideDown {
                    from { 
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .app-header h1 {
                        font-size: 2rem;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .secondary-button,
                    .submit-button {
                        width: 100%;
                    }

                    .services-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <React.StrictMode>
        <CreateServices />
    </React.StrictMode>
);