import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, BrowserRouter, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  PlusCircle, DownloadCloud, Droplet, HeartPulse,
  Search, Bell, User, Calendar, Stethoscope,
  Activity, Shield, ClipboardList, Thermometer,
  Trash2, Syringe, Pill, Edit
} from 'lucide-react';
import {
  Container, Row, Col, Card, Spinner, Button,
  Badge, OverlayTrigger, Tooltip, Form, Modal,
  Navbar, Nav, Dropdown, Alert
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js/auto';

function App() {
    const [fiches, setFiches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showQuickStats, setShowQuickStats] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const navigate = useNavigate();

    const bloodTypeChartRef = useRef(null);
    const ageDistributionChartRef = useRef(null);

    const stats = useMemo(() => ({
        totalPatients: fiches.length,
        recentPatients: fiches.filter(p => {
            const date = new Date(p.created_at);
            return date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        }).length,
        bloodTypes: fiches.reduce((acc, curr) => {
            const type = curr.groupe_sanguin || 'Inconnu';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {}),
        ageGroups: fiches.reduce((acc, curr) => {
            if (!curr.date_naissance) {
                acc['Inconnu'] = (acc['Inconnu'] || 0) + 1;
                return acc;
            }
            const age = new Date().getFullYear() - new Date(curr.date_naissance).getFullYear();
            let group;
            if (age < 18) group = '0-17';
            else if (age < 30) group = '18-29';
            else if (age < 50) group = '30-49';
            else if (age < 65) group = '50-64';
            else group = '65+';
            acc[group] = (acc[group] || 0) + 1;
            return acc;
        }, {})
    }), [fiches]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('/api/fiche-patient', {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include'
                });
                if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
                const data = await response.json();
                setFiches(data);
                setLoading(false);
                
                setTimeout(() => {
                    if (data.length > 0) {
                        setShowNotification(true);
                    }
                }, 3000);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleDeletePatient = async (id) => {
        try {
            const response = await fetch(`/api/fiche-patient/${id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            if (!response.ok) throw new Error(`Erreur ${response.status}`);
            setFiches(fiches.filter(fiche => fiche.id !== id));
            setShowDeleteModal(false);
        } catch (error) {
            alert(`Erreur : ${error.message}`);
        }
    };

    const renderBloodTypeChart = () => {
        const ctx = document.getElementById('bloodTypeChart');
        if (!ctx) return;

        if (bloodTypeChartRef.current) {
            bloodTypeChartRef.current.destroy();
        }

        bloodTypeChartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(stats.bloodTypes),
                datasets: [{
                    data: Object.values(stats.bloodTypes),
                    backgroundColor: [
                        '#dc3545',
                        '#0d6efd',
                        '#198754',
                        '#ffc107',
                        '#6c757d'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Répartition des groupes sanguins',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        });
    };

    const renderAgeDistributionChart = () => {
        const ctx = document.getElementById('ageDistributionChart');
        if (!ctx) return;

        if (ageDistributionChartRef.current) {
            ageDistributionChartRef.current.destroy();
        }

        ageDistributionChartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.ageGroups).sort(),
                datasets: [{
                    label: 'Patients',
                    data: Object.values(stats.ageGroups),
                    backgroundColor: '#0d6efd',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Répartition par tranche d\'âge',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        });
    };

    useEffect(() => {
        if (!loading && fiches.length > 0) {
            renderBloodTypeChart();
            renderAgeDistributionChart();
        }

        return () => {
            if (bloodTypeChartRef.current) {
                bloodTypeChartRef.current.destroy();
            }
            if (ageDistributionChartRef.current) {
                ageDistributionChartRef.current.destroy();
            }
        };
    }, [loading, fiches]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Non renseigné';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR');
        } catch {
            return 'Date invalide';
        }
    };

    const filteredPatients = useMemo(() => {
        return fiches.filter(fiche => {
            const matchesSearch = 
                `${fiche.nom} ${fiche.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fiche.telephone?.includes(searchTerm) ||
                fiche.email?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesTab = 
                activeTab === 'all' || 
                (activeTab === 'recent' && new Date(fiche.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                (activeTab === 'blood' && fiche.groupe_sanguin);
            
            return matchesSearch && matchesTab;
        });
    }, [fiches, searchTerm, activeTab]);

    const generatePDF = (patientData) => {
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        doc.setFillColor(13, 110, 253);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setFontSize(16);
        doc.setTextColor(255);
        doc.text('Cabinet Médical ', 15, 20);
        
        doc.setFillColor(255);
        doc.circle(190, 15, 8, 'F');
        doc.setFontSize(12);
        doc.setTextColor(13, 110, 253);
        doc.text('CMS', 186, 18);

        doc.setFontSize(20);
        doc.setTextColor(13, 110, 253);
        doc.text(`Fiche Patient - ${patientData.nom} ${patientData.prenom}`, 15, 45);

        doc.setDrawColor(13, 110, 253);
        doc.rect(160, 35, 35, 35, 'S');
        doc.setFontSize(8);
        doc.text('ID: ' + patientData.id, 162, 73);

        const addSection = (title, y, content, icon) => {
            doc.setFontSize(14);
            doc.setTextColor(13, 110, 253);
            if (icon) {
                doc.setTextColor(255, 255, 255);
                doc.setFillColor(13, 110, 253);
                doc.roundedRect(10, y - 8, 15, 8, 2, 2, 'F');
                doc.text(icon, 13, y - 3);
                doc.setTextColor(13, 110, 253);
                doc.text(title, 30, y);
            } else {
                doc.text(title, 15, y);
            }
            
            autoTable(doc, {
                startY: y + 5,
                margin: { left: 15 },
                body: content,
                theme: 'grid',
                styles: {
                    cellPadding: 3,
                    fontSize: 10,
                    textColor: [33, 37, 41],
                    lineColor: [233, 236, 239]
                },
                headStyles: {
                    fillColor: [248, 249, 250],
                    textColor: [13, 110, 253],
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [248, 249, 250]
                }
            });
            return doc.lastAutoTable.finalY + 10;
        };

        let y = addSection('Identité', 55, [
            ['ID Patient', patientData.id],
            ['Date de Naissance', formatDate(patientData.date_naissance) + ` (Âge: ${patientData.date_naissance ? new Date().getFullYear() - new Date(patientData.date_naissance).getFullYear() : '?'} ans)`],
            ['Sexe', patientData.sexe],
            ['État Civil', patientData.etat_civil]
        ], '👤');

        y = addSection('Coordonnées', y, [
            ['Téléphone', patientData.telephone || 'Non renseigné'],
            ['Email', patientData.email || 'Non renseigné'],
            ['Adresse', [
                patientData.adresse,
                patientData.code_postal,
                patientData.ville
            ].filter(Boolean).join(' ') || 'Non renseigné']
        ], '📱');

        y = addSection('Informations Médicales', y, [
            ['Groupe Sanguin', patientData.groupe_sanguin || 'Non spécifié'],
            ['Allergies', patientData.allergies || 'Aucune connue'],
            ['Antécédents', patientData.antecedents_medicaux || 'Aucun'],
            ['Traitement en cours', patientData.traitement_en_cours || 'Aucun']
        ], '🏥');

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Document généré le ' + new Date().toLocaleDateString('fr-FR'), 15, 285);
        doc.text('Cabinet Médical Dr. Smith - Tous droits réservés', 130, 285);

        doc.save(`Dossier_${patientData.nom}_${patientData.prenom}_${patientData.id}.pdf`);
    };

    const handleDownloadPDF = async (id) => {
        setPdfLoading(id);
        try {
            // Essayer d'abord avec l'API
            try {
                const response = await fetch(`/api/fiche-patient/${id}`, {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}`);
                }
                
                const data = await response.json();
                generatePDF(data);
            } catch (apiError) {
                console.warn('Erreur API, tentative avec données locales:', apiError);
                
                // Fallback: utiliser les données locales
                const localData = fiches.find(fiche => fiche.id === id);
                if (localData) {
                    generatePDF(localData);
                } else {
                    throw new Error('Données non disponibles localement');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            alert(`Erreur lors de la génération du PDF: ${error.message}`);
        } finally {
            setPdfLoading(false);
        }
    };

    const PatientQuickView = ({ patient }) => {
        const [showModal, setShowModal] = useState(false);
        
        return (
            <>
                <Card className="patient-card h-100">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                            <Badge pill bg="light" text="primary">#{patient.id}</Badge>
                            <h2 className="h5 mt-2 mb-0">{patient.nom}</h2>
                            <p className="mb-0">{patient.prenom}</p>
                        </div>
                        {patient.groupe_sanguin ? (
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Groupe sanguin: {patient.groupe_sanguin}</Tooltip>}
                            >
                                <div className="blood-badge">
                                    <Droplet size={24} color="#dc3545" fill="#dc3545" />
                                </div>
                            </OverlayTrigger>
                        ) : (
                            <Droplet size={24} color="#6c757d" />
                        )}
                    </Card.Header>

                    <Card.Body className="d-flex flex-column">
                        <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                                <Calendar size={16} className="me-2 text-muted" />
                                <small className="text-muted">
                                    {formatDate(patient.date_naissance)} • 
                                    {patient.date_naissance ? ` ${new Date().getFullYear() - new Date(patient.date_naissance).getFullYear()} ans` : ' Âge inconnu'}
                                </small>
                            </div>
                            
                            {patient.traitement_en_cours && (
                                <div className="d-flex align-items-center mb-2">
                                    <Pill size={16} className="me-2 text-muted" />
                                    <small className="text-muted text-truncate">
                                        {patient.traitement_en_cours}
                                    </small>
                                </div>
                            )}
                            
                            <div className="d-flex align-items-center mb-2">
                                <ClipboardList size={16} className="me-2 text-muted" />
                                <small className="text-muted">
                                    {patient.antecedents_medicaux ? 'Antécédents' : 'Aucun antécédent'}
                                </small>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="d-flex flex-wrap gap-2">
                                <Button 
                                    variant="outline-success" 
                                    size="sm"
                                    className="flex-grow-1"
                                    onClick={() => setShowModal(true)}
                                >
                                    <Activity size={16} className="me-1" />
                                    Stats
                                </Button>
                                
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    className="flex-grow-1"
                                    onClick={() => {
                                        setPatientToDelete(patient.id);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    <Trash2 size={16} className="me-1" />
                                    Supprimer
                                </Button>
                                
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    className="flex-grow-1"
                                    onClick={() => handleDownloadPDF(patient.id)}
                                    disabled={pdfLoading === patient.id}
                                >
                                    {pdfLoading === patient.id ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <>
                                            <DownloadCloud size={16} className="me-1" />
                                            PDF
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <User size={20} className="me-2" />
                            {patient.nom} {patient.prenom} - Détails médicaux
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <h5 className="d-flex align-items-center">
                                    <Stethoscope size={18} className="me-2 text-primary" />
                                    Informations de base
                                </h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <strong>Âge:</strong> {patient.date_naissance ? 
                                            `${new Date().getFullYear() - new Date(patient.date_naissance).getFullYear()} ans` : 'Inconnu'}
                                    </li>
                                    <li className="mb-2">
                                        <strong>Sexe:</strong> {patient.sexe || 'Non spécifié'}
                                    </li>
                                    <li className="mb-2">
                                        <strong>Groupe sanguin:</strong> {patient.groupe_sanguin || 'Non spécifié'}
                                    </li>
                                </ul>
                                
                                <h5 className="d-flex align-items-center mt-4">
                                    <Shield size={18} className="me-2 text-primary" />
                                    Antécédents
                                </h5>
                                <p>{patient.antecedents_medicaux || 'Aucun antécédent médical renseigné'}</p>
                            </Col>
                            <Col md={6}>
                                <h5 className="d-flex align-items-center">
                                    <Thermometer size={18} className="me-2 text-primary" />
                                    Allergies & Traitements
                                </h5>
                                <div className="mb-3">
                                    <strong>Allergies:</strong>
                                    <p>{patient.allergies || 'Aucune allergie connue'}</p>
                                </div>
                                
                                <div>
                                    <strong>Traitement en cours:</strong>
                                    <p>{patient.traitement_en_cours || 'Aucun traitement en cours'}</p>
                                </div>
                                
                                <div className="mt-4 d-flex gap-2">
                                    <Button 
                                        variant="light"
                                        className="w-100"
                                        onClick={() => navigate(`/fiche-patient/${patient.id}/edit`)}
                                    >
                                        <Edit className="me-2" size={20} />
                                        Modifier
                                    </Button>
                                    
                                    <Button 
                                        variant="danger"
                                        className="flex-grow-1"
                                        onClick={() => {
                                            setShowModal(false);
                                            setPatientToDelete(patient.id);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        <Trash2 size={16} className="me-1" />
                                        Supprimer
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </>
        );
    };

    return (
        <>
            <style>{`
                :root {
                    --primary: #0d6efd;
                    --primary-light: #e7f1ff;
                    --secondary: #6c757d;
                    --success: #198754;
                    --danger: #dc3545;
                    --warning: #ffc107;
                    --info: #0dcaf0;
                    --light: #f8f9fa;
                    --dark: #212529;
                    --background: #f8fafc;
                    --text-primary: #2D3748;
                    --text-secondary: #4A5568;
                    --border-soft: #E2E8F0;
                }

                body {
                    background-color: var(--background);
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                }

                .main-app {
                    min-height: 100vh;
                }

                .navbar-medical {
                    background: white;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    padding: 0.75rem 1rem;
                }

                .navbar-brand {
                    font-weight: 600;
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                }

                .navbar-brand svg {
                    margin-right: 0.5rem;
                }

                .search-box {
                    position: relative;
                    width: 300px;
                }

                .search-box .form-control {
                    padding-left: 2.5rem;
                    border-radius: 50px;
                    border: 1px solid var(--border-soft);
                    background-color: var(--light);
                }

                .search-box .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--secondary);
                }

                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    font-size: 0.6rem;
                    padding: 0.2em 0.4em;
                }

                .header-section {
                    background: linear-gradient(135deg, var(--primary) 0%, #0b5ed7 100%);
                    border-radius: 1rem;
                    padding: 3rem 2rem;
                    margin-bottom: 2rem;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .header-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 200px;
                    height: 100%;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="rgba(255,255,255,0.1)"><path d="M30,10 Q50,5 70,20 T90,50 Q95,70 80,90 T50,95 Q30,90 20,70 T10,50 Q5,30 20,20 T30,10"/></svg>');
                    background-repeat: no-repeat;
                    background-position: center right;
                    background-size: contain;
                }

                .main-title {
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .subtitle {
                    opacity: 0.9;
                    margin-bottom: 2rem;
                }

                .patient-card {
                    background: white;
                    border: 1px solid var(--border-soft);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
                }

                .patient-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(13, 110, 253, 0.1);
                }

                .card-header {
                    background: var(--primary) !important;
                    color: white !important;
                    border-radius: 12px 12px 0 0 !important;
                    border-bottom: none !important;
                }

                .stats-card {
                    border: none;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .stats-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }

                .stats-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                }

                .stats-icon.primary {
                    background-color: rgba(13, 110, 253, 0.1);
                    color: var(--primary);
                }

                .stats-icon.success {
                    background-color: rgba(25, 135, 84, 0.1);
                    color: var(--success);
                }

                .stats-icon.warning {
                    background-color: rgba(255, 193, 7, 0.1);
                    color: var(--warning);
                }

                .stats-icon.danger {
                    background-color: rgba(220, 53, 69, 0.1);
                    color: var(--danger);
                }

                .nav-tabs .nav-link {
                    border: none;
                    color: var(--secondary);
                    font-weight: 500;
                    padding: 0.75rem 1.25rem;
                    position: relative;
                }

                .nav-tabs .nav-link.active {
                    color: var(--primary);
                    background: transparent;
                }

                .nav-tabs .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 50%;
                    height: 3px;
                    background: var(--primary);
                    border-radius: 3px 3px 0 0;
                }

                .nav-tabs .nav-link:hover:not(.active) {
                    color: var(--primary);
                }

                .chart-container {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .quick-stats-toggle {
                    cursor: pointer;
                    color: var(--primary);
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                }

                .quick-stats-toggle svg {
                    transition: transform 0.2s ease;
                }

                .quick-stats-toggle.collapsed svg {
                    transform: rotate(-90deg);
                }

                .pdf-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(3px);
                }

                .blood-badge {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 768px) {
                    .search-box {
                        width: 100%;
                        margin-top: 1rem;
                    }
                    
                    .header-section {
                        padding: 2rem 1rem;
                    }
                    
                    .header-section::before {
                        display: none;
                    }
                }
            `}</style>

            <div className="main-app">
                <Navbar expand="lg" className="navbar-medical sticky-top mb-4">
                    <Container fluid>
                        <Navbar.Brand href="#">
                            <HeartPulse size={24} />
                            <span>Cabinet Médical</span>
                        </Navbar.Brand>
                        
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto align-items-center">
                                <div className="search-box me-3">
                                    <Search size={18} className="search-icon" />
                                    <Form.Control 
                                        type="search" 
                                        placeholder="Rechercher un patient..." 
                                        aria-label="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="light" className="position-relative">
                                        <Bell size={20} />
                                        {showNotification && (
                                            <Badge pill bg="danger" className="notification-badge">
                                                {stats.recentPatients}
                                            </Badge>
                                        )}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Header>Notifications</Dropdown.Header>
                                        <Dropdown.Item>
                                            {stats.recentPatients} nouveau(x) patient(s) ce mois-ci
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                
                                <Dropdown align="end" className="ms-2">
                                    <Dropdown.Toggle variant="light">
                                        <User size={20} className="me-1" />
                                        Mon compte
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Profil</Dropdown.Item>
                                        <Dropdown.Item>Paramètres</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item>Déconnexion</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Container fluid="lg">
                    <div className="header-section">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <h1 className="main-title display-5">
                                    <HeartPulse size={36} className="me-3" />
                                    Gestion des Dossiers Patients
                                </h1>
                                <p className="subtitle">
                                    Accédez et gérez les dossiers médicaux de vos patients en toute sécurité
                                </p>
                                <Button 
                                    variant="light" 
                                    size="lg"
                                    onClick={() => navigate('/fiche-patient/create')}
                                >
                                    <PlusCircle className="me-2" size={20} />
                                    Nouveau Patient
                                </Button>
                            </Col>
                            <Col lg={6}>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Card className="stats-card h-100">
                                            <Card.Body>
                                                <div className="stats-icon primary">
                                                    <User size={24} />
                                                </div>
                                                <h5 className="card-title">Patients</h5>
                                                <h2 className="mb-0">{stats.totalPatients}</h2>
                                                <p className="text-muted mb-0">
                                                    <small>Total enregistrés</small>
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="stats-card h-100">
                                            <Card.Body>
                                                <div className="stats-icon success">
                                                    <Activity size={24} />
                                                </div>
                                                <h5 className="card-title">Nouveaux</h5>
                                                <h2 className="mb-0">{stats.recentPatients}</h2>
                                                <p className="text-muted mb-0">
                                                    <small>Derniers 30 jours</small>
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>

                    <div className="mb-4">
                        <div 
                            className="quick-stats-toggle mb-3" 
                            onClick={() => setShowQuickStats(!showQuickStats)}
                            aria-expanded={showQuickStats}
                        >
                            <span className="me-2">Statistiques rapides</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>

                        {showQuickStats && (
                            <Row className="g-3 mb-4">
                                <Col md={6}>
                                    <div className="chart-container">
                                        <canvas id="bloodTypeChart" height="250"></canvas>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="chart-container">
                                        <canvas id="ageDistributionChart" height="250"></canvas>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </div>

                    <Nav variant="tabs" defaultActiveKey="all" className="mb-4" onSelect={setActiveTab}>
                        <Nav.Item>
                            <Nav.Link eventKey="all">Tous les patients</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="recent">Récemment ajoutés</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="blood">Avec groupe sanguin</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Chargement des dossiers patients...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center">
                            <Alert.Heading>Erreur de chargement</Alert.Heading>
                            <p>{error}</p>
                            <Button variant="outline-danger" onClick={() => window.location.reload()}>
                                Réessayer
                            </Button>
                        </Alert>
                    ) : filteredPatients.length === 0 ? (
                        <Card className="text-center py-5">
                            <Card.Body>
                                <User size={48} className="mb-3 text-muted" />
                                <h5>Aucun patient trouvé</h5>
                                <p className="text-muted">
                                    {searchTerm ? 
                                        'Aucun résultat pour votre recherche.' : 
                                        'Aucun patient n\'est actuellement enregistré.'}
                                </p>
                                <Button 
                                    variant="primary"
                                    onClick={() => navigate('/fiche-patient/create')}
                                >
                                    <PlusCircle className="me-2" size={20} />
                                    Ajouter un patient
                                </Button>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Row className="g-4">
                            {filteredPatients.map(fiche => (
                                <Col key={fiche.id} xl={3} lg={4} md={6}>
                                    <PatientQuickView patient={fiche} />
                                </Col>
                            ))}
                        </Row>
                    )}

                    {pdfLoading && (
                        <div className="pdf-loader">
                            <div className="bg-white p-4 rounded shadow-sm d-flex align-items-center">
                                <Spinner animation="border" variant="primary" className="me-3" />
                                <span className="h5 mb-0 text-primary">Génération du PDF en cours...</span>
                            </div>
                        </div>
                    )}

                    {/* Modal de confirmation de suppression */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmer la suppression</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Annuler
                            </Button>
                            <Button variant="danger" onClick={() => handleDeletePatient(patientToDelete)}>
                                <Trash2 size={16} className="me-1" />
                                Supprimer définitivement
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);