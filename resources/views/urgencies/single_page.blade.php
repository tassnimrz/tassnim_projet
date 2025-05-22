<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion des urgences médicales Tunisie</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
       :root {
    --primary-color: #8b5cf6;
    --primary-dark: #7c3aed;
    --secondary-color: #ec4899;
    --accent-color: #a78bfa;
    --light-color: #e9d5ff;
    --dark-color: #1e1a2e;
    --bg-color: #f8fafc;
    --card-bg: #ffffff;
    --text-color: #1f2937;
    --text-muted: #6b7280;
}

[data-bs-theme="dark"] {
    --primary-color: #8b5cf6;
    --primary-dark: #7c3aed;
    --secondary-color: #ec4899;
    --dark-color: #1e1a2e;
    --bg-color: #0f172a;
    --card-bg: #1e1a2e;
    --text-color: #f8f9fa;
    --text-muted: #a78bfa;
}

        body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: all 0.3s ease;
        }

        .container-fluid {
            max-width: 1800px;
            padding: 0 2rem;
        }

        /* Navigation */
        .sidebar {
            width: 280px;
            height: 100vh;
            position: fixed;
            background: linear-gradient(135deg, #5b21b6, #7c3aed);
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
            color: white;
            padding: 1rem 0;
           
            z-index: 1000;
            transition: all 0.3s ease;
        }

        .sidebar-collapsed {
            width: 80px;
        }

        .sidebar-collapsed .nav-link span {
            display: none;
        }

        .sidebar-collapsed .logo-text {
            display: none;
        }
        /* Dans la section <style> de votre fichier */
#hospitalChart {
    max-height: 400px;
}

        .sidebar-collapsed .nav-link {
            justify-content: center;
        }

        .main-content {
            margin-left: 280px;
            transition: all 0.3s ease;
        }

        .main-content-collapsed {
            margin-left: 80px;
        }

        .logo-container {
            padding: 0 1.5rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo-icon {
            font-size: 2rem;
            color: white;
        }

        .logo-text {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            transition: all 0.3s ease;
        }

        .nav-link {
            color: rgba(255, 255, 255, 0.8);
            padding: 0.75rem 1.5rem;
            margin: 0.25rem 0;
            border-radius: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.2s ease;
        }

        .nav-link:hover, .nav-link.active {
            color: white;
            background-color: rgba(139, 92, 246, 0.2);
    border-left: 3px solid #8b5cf6;
        }

        .nav-link i {
            font-size: 1.25rem;
        }

        .toggle-btn {
            position: absolute;
            right: -15px;
            top: 20px;
            background: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            z-index: 1001;
            border: none;
            color: var(--primary-color);
        }

        /* Top bar */
        .top-bar {
            background-color: var(--card-bg);
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(167, 139, 250, 0.1);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .search-bar {
            width: 400px;
            position: relative;
        }

        .search-bar input {
            padding-left: 2.5rem;
            border-radius: 20px;
            background-color: var(--bg-color);
            border: 1px solid var(--bg-color);
        }

        .search-bar i {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
        }

        .user-menu {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        /* Cards */
        .card {
            border-radius: 12px;
            border: 1px solid #f3e8ff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            margin-bottom: 2rem;
            overflow: hidden;
            background-color: var(--card-bg);
            transition: all 0.3s ease;
        }

        .card-header {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white;
            font-weight: 500;
            padding: 1.25rem 1.5rem;
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-header h5 {
            margin-bottom: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Typography */
        h2, h3, h4, h5, h6 {
            color: var(--text-color);
        }

        h2 {
            font-weight: 700;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        h2 i {
            color: var(--primary-color);
        }

        .page-title {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Buttons */
        .btn-primary {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            border: none;
           
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
            border-color: var(--primary-dark);
        }

        .btn-warning {
            background-color: var(--secondary-color);
            border-color: var(--secondary-color);
            color: white;
        }

        .btn-warning:hover {
            background-color: #e67300;
            border-color: #e67300;
            color: white;
        }

        .btn-outline-primary {
            color: #8b5cf6;
            border-color: #8b5cf6;
        }

        .btn-outline-primary:hover {
            background: #8b5cf6;
    color: white;
        }

        /* Form elements */
        .form-control, .form-select {
            border-radius: 8px;
            padding: 0.5rem 0.75rem;
            border: 1px solid rgba(0, 0, 0, 0.1);
            background-color: var(--bg-color);
            color: var(--text-color);
        }

        .form-control:focus, .form-select:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 0.25rem rgba(252, 191, 73, 0.25);
            background-color: var(--bg-color);
            color: var(--text-color);
        }

        .input-group-text {
            background-color: var(--bg-color);
            border-color: rgba(0, 0, 0, 0.1);
        }

        /* Voice input */
        .mic-btn {
            background: none;
            border: none;
            color: var(--primary-color);
            font-size: 1.2rem;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .mic-btn:hover {
            transform: scale(1.1);
        }

        .is-recording {
            border-color: var(--primary-color) !important;
            box-shadow: 0 0 0 0.25rem rgba(214, 40, 57, 0.25) !important;
        }

        /* Status badges */
        .badge-en-attente { background-color: #6b7280; }
.badge-appel-en-cours { background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%); }
.badge-ambulance-en-route { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); }
.badge-termine { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.badge-echec { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }

        .status-badge {
            font-size: 0.8rem;
            padding: 0.35em 0.65em;
            border-radius: 0.25rem;
            font-weight: 500;
        }

        /* Maps */
        #map, #hospitalMap, #realtimeMap {
            height: 300px;
            width: 100%;
            margin-bottom: 1rem;
            border-radius: 12px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        /* Tables */
        .table {
            border-radius: 12px;
            overflow: hidden;
            background-color: var(--card-bg);
        }

        .table thead th {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white;
            font-weight: 500;
            border-bottom: none;
        }

        .table-hover tbody tr:hover {
            background-color: rgba(234, 226, 183, 0.1);
        }

        /* Stats cards */
        .stat-card {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-radius: 12px;
            padding: 1.5rem;
            color: white;
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-card i {
            font-size: 2rem;
            opacity: 0.8;
        }

        .stat-card .value {
            font-size: 2rem;
            font-weight: 700;
            margin: 0.5rem 0;
        }

        .stat-card .label {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        /* Tabs */
        .nav-tabs .nav-link {
            color: var(--text-muted);
            border: none;
            padding: 0.75rem 1.5rem;
            background: none;
        }

        .nav-tabs .nav-link.active {
            color: var(--primary-color);
            border-bottom: 3px solid var(--primary-color);
            background: none;
        }

        /* Responsive */
        @media (max-width: 992px) {
            .sidebar {
                transform: translateX(-100%);
            }
            .sidebar-collapsed {
                transform: translateX(-100%);
            }
            .main-content, .main-content-collapsed {
                margin-left: 0;
            }
            .top-bar {
                padding: 1rem;
            }
            .search-bar {
                width: 200px;
            }
        }

        @media (max-width: 768px) {
            .card-body {
                padding: 1rem;
            }
            #map, #hospitalMap, #realtimeMap {
    height: 300px;
    width: 100%;
    margin-bottom: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

[data-bs-theme="dark"] #map,
[data-bs-theme="dark"] #hospitalMap,
[data-bs-theme="dark"] #realtimeMap {
    border-color: #3a2d5a;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade {
            animation: fadeIn 0.5s ease forwards;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-color);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
        }
    </style>
</head>
<body>
<div class="d-flex">
    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <div class="toggle-btn" onclick="toggleSidebar()">
            <i class="bi bi-chevron-double-left" id="toggleIcon"></i>
        </div>
        <div class="logo-container">
            <i class="bi bi-activity logo-icon"></i>
            <span class="logo-text">Urgences TN</span>
        </div>
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link active" href="#dashboard" data-bs-toggle="tab">
                    <i class="bi bi-speedometer2"></i>
                    <span>Urgence</span>
                </a>
            </li>
            <li class="nav-item">
                <div class="d-flex align-items-center">
                    <a class="nav-link flex-grow-1" href="#urgences" data-bs-toggle="tab">
                        <i class="bi bi-activity"></i>
                        <span>Gestion des urgences</span>
                    </a>
                    <a href="http://127.0.0.1:8000/urgences" class="btn btn-sm btn-outline-light mx-2 return-btn">
                        <i class="bi bi-arrow-left-circle animate-arrow"></i>
                    </a>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#hopitaux" data-bs-toggle="tab">
                    <i class="bi bi-hospital"></i>
                    <span>Hôpitaux</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#suivi" data-bs-toggle="tab">
                    <i class="bi bi-geo-alt"></i>
                    <span>Suivi en temps réel</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#statistiques" data-bs-toggle="tab">
                    <i class="bi bi-bar-chart"></i>
                    <span>Statistiques</span>
                </a>
            </li>
            
            <li class="nav-item">
                <a class="nav-link" href="#parametres" data-bs-toggle="tab">
                    <i class="bi bi-gear"></i>
                    <span>Paramètres</span>
                </a>
            </li>
        </ul>
        <div class="mt-auto p-3">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="darkModeToggle">
                <label class="form-check-label text-white" for="darkModeToggle">Mode sombre</label>
            </div>
        </div>
    </div>
</div>

<style>
    /* Animation pour la flèche */
    .animate-arrow {
        transition: transform 0.3s ease;
    }
    .return-btn:hover .animate-arrow {
        transform: translateX(-3px);
    }
    /* Style pour le bouton de retour */
    .return-btn {
        padding: 0.25rem 0.5rem;
        border-radius: 50%;
    }
    /* Ajustement de l'alignement */
    .nav-item .d-flex {
        width: 100%;
    }
</style>
    <!-- Main content -->
    <div class="main-content" id="mainContent">
        <!-- Top bar -->
        <div class="top-bar">
            <div class="search-bar">
                <i class="bi bi-search"></i>
                <input type="text" class="form-control" placeholder="Rechercher...">
            </div>
            <div class="user-menu">
                <div class="dropdown">
                    <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown">
                        <div class="user-avatar">
                            {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
                        </div>
                        <span class="ms-2 d-none d-sm-inline">{{ Auth::user()->name }}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i> Profil</a></li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i> Paramètres</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                <i class="bi bi-box-arrow-right me-2"></i> Déconnexion
                            </a>
                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                @csrf
                            </form>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Page content -->
        <div class="container-fluid py-4">
            <div class="tab-content">
                <!-- Dashboard Tab -->
                <div class="tab-pane fade show active" id="dashboard">
                    <h2 class="page-title animate-fade">
                        <i class="bi bi-speedometer2"></i> Tableau de bord
                    </h2>
                    
                    <div class="row mb-4 animate-fade" style="animation-delay: 0.1s;">
                        <div class="col-md-3">
                            <div class="stat-card bg-primary">
                                <i class="bi bi-activity"></i>
                                <div class="value" id="totalUrgences">0</div>
                                <div class="label">Urgences totales</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stat-card bg-warning">
                                <i class="bi bi-clock-history"></i>
                                <div class="value" id="urgencesAttente">0</div>
                                <div class="label">En attente</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stat-card bg-success">
                                <i class="bi bi-check-circle"></i>
                                <div class="value" id="urgencesTerminees">0</div>
                                <div class="label">Terminées</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stat-card bg-danger">
                                <i class="bi bi-exclamation-triangle"></i>
                                <div class="value" id="urgencesEchec">0</div>
                                <div class="label">Échecs</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row animate-fade" style="animation-delay: 0.2s;">
                        <div class="col-md-8">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0"><i class="bi bi-bar-chart"></i> Activité récente</h5>
                                </div>
                                <div class="card-body">
                                    <canvas id="activityChart" height="300"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0"><i class="bi bi-list-check"></i> Dernières urgences</h5>
                                </div>
                                <div class="card-body p-0">
                                    <div class="list-group list-group-flush">
                                        @isset($recentUrgencies)
                                            @foreach($recentUrgencies as $urgency)
                                            <a href="#" class="list-group-item list-group-item-action">
                                                <div class="d-flex w-100 justify-content-between">
                                                    <h6 class="mb-1">{{ $urgency->nom_patient }}</h6>
                                                    <small>{{ $urgency->created_at->diffForHumans() }}</small>
                                                </div>
                                                <p class="mb-1">{{ Str::limit($urgency->symptomes, 50) }}</p>
                                                <small class="text-muted">{{ $urgency->hopital_cible ?? 'Aucun hôpital' }}</small>
                                            </a>
                                            @endforeach
                                        @else
                                            <div class="list-group-item text-muted">
                                                Aucune urgence récente à afficher
                                            </div>
                                        @endisset
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Urgences Tab -->
                <div class="tab-pane fade" id="urgences">
                    <h2 class="page-title animate-fade">
                        <i class="bi bi-activity"></i> Gestion des urgences
                    </h2>
                    
                    <ul class="nav nav-tabs mb-4" id="urgencyTabs">
                        <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="tab" href="#newUrgency">Nouvelle urgence</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="tab" href="#urgencyList">Liste des urgences</a>
                        </li>
                    </ul>
                    
                    <div class="tab-content">
                        <!-- New Urgency Tab -->
                        <div class="tab-pane fade show active" id="newUrgency">
                            <div class="card mb-4 animate-fade" style="animation-delay: 0.1s;">
                                <div class="card-header">
                                    <h5 class="mb-0"><i class="bi bi-plus-circle"></i> Nouvelle urgence</h5>
                                </div>
                                <div class="card-body">
                                    <form id="urgencyForm">
                                        @csrf
                                        <input type="hidden" id="urgency_id">
                                        <input type="hidden" id="latitude">
                                        <input type="hidden" id="longitude">
                                        
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <div class="input-group mb-3">
                                                    <input type="text" class="form-control" id="nom_patient" placeholder="Nom patient" required>
                                                    <button type="button" class="mic-btn" onclick="startVoice('nom_patient')" title="Reconnaissance vocale">
                                                        <i class="bi bi-mic"></i>
                                                    </button>
                                                </div>
                                                
                                                <div class="input-group mb-3">
                                                    <input type="text" class="form-control" id="telephone" placeholder="Téléphone" required>
                                                    <button type="button" class="mic-btn" onclick="startVoice('telephone')" title="Reconnaissance vocale">
                                                        <i class="bi bi-mic"></i>
                                                    </button>
                                                </div>
                                                
                                                <div class="input-group mb-3">
                                                    <input type="text" class="form-control" id="adresse" placeholder="Adresse complète" required>
                                                    <button type="button" class="mic-btn" onclick="startVoice('adresse')" title="Reconnaissance vocale">
                                                        <i class="bi bi-mic"></i>
                                                    </button>
                                                </div>
                                                
                                                <div class="row g-2 mb-3">
                                                    <div class="col-md-6">
                                                        <input type="text" class="form-control" id="ville" placeholder="Ville">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <select class="form-select" id="gouvernorat">
                                                            <option value="">Gouvernorat</option>
                                                            @foreach($gouvernorats as $gouvernorat)
                                                                <option value="{{ $gouvernorat }}">{{ $gouvernorat }}</option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <div id="map"></div>
                                                    <small class="text-muted">Cliquez sur un hôpital pour le sélectionner</small>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <input type="number" class="form-control" id="age" placeholder="Âge (optionnel)">
                                                </div>
                                                
                                                <div class="input-group mb-3">
                                                    <textarea class="form-control" id="symptomes" placeholder="Décrivez les symptômes" required rows="4"></textarea>
                                                    <button type="button" class="mic-btn align-self-start mt-1" onclick="startVoice('symptomes')" title="Reconnaissance vocale">
                                                        <i class="bi bi-mic"></i>
                                                    </button>
                                                </div>
                                                
                                                <div class="row g-2 mb-3">
                                                    <div class="col-md-6">
                                                        <select class="form-select" id="type_urgence" required>
                                                            <option value="">Type d'urgence</option>
                                                            <option value="ambulance">Ambulance</option>
                                                            <option value="samu">SAMU</option>
                                                            <option value="autre">Autre</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <select class="form-select" id="hopital_cible" required>
                                                            <option value="">-- Sélectionnez un hôpital --</option>
                                                            @foreach($hospitals as $name => $phone)
                                                                <option value="{{ $name }}" data-phone="{{ $phone }}">{{ $name }} ({{ $phone }})</option>
                                                            @endforeach
                                                        </select>
                                                        <small class="text-danger" id="hospital-error" style="display:none">Veuillez sélectionner un hôpital</small>
                                                    </div>
                                                </div>
                                                
                                                <div class="form-check mb-3">
                                                    <input class="form-check-input" type="checkbox" id="initier_appel">
                                                    <label class="form-check-label" for="initier_appel">
                                                        <i class="bi bi-telephone"></i> Initier l'appel immédiatement
                                                    </label>
                                                </div>
                                                
                                                <div class="d-grid">
                                                    <button type="submit" class="btn btn-primary btn-lg">
                                                        <i class="bi bi-save"></i> Enregistrer l'urgence
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Urgency List Tab -->
                        <div class="tab-pane fade" id="urgencyList">
                            <div class="card animate-fade" style="animation-delay: 0.1s;">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0"><i class="bi bi-list-ul"></i> Liste des urgences en cours</h5>
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown">
                                            <i class="bi bi-funnel"></i> Filtrer
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="#" data-filter="all">Toutes</a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item" href="#" data-filter="en_attente">En attente</a></li>
                                            <li><a class="dropdown-item" href="#" data-filter="appel_en_cours">Appel en cours</a></li>
                                            <li><a class="dropdown-item" href="#" data-filter="termine">Terminées</a></li>
                                            <li><a class="dropdown-item" href="#" data-filter="echec">Échecs</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-bordered table-hover" id="urgencyTable">
                                            <thead>
                                                <tr>
                                                    <th>Patient</th>
                                                    <th>Contact</th>
                                                    <th>Localisation</th>
                                                    <th>Symptômes</th>
                                                    <th>Type</th>
                                                    <th>Hôpital</th>
                                                    <th>État</th>
                                                 
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach($urgencies as $u)
                                                    <tr id="row-{{ $u->id }}" class="@if($u->etat == 'echec') table-danger @endif @if(!$u->hopital_cible) no-hospital @endif" data-status="{{ $u->etat }}">
                                                        <td>
                                                            <strong>{{ $u->nom_patient }}</strong>
                                                            @if($u->age)
                                                                <br><small class="text-muted">{{ $u->age }} ans</small>
                                                            @endif
                                                        </td>
                                                        <td>
                                                            <a href="tel:{{ $u->telephone }}" class="text-decoration-none">
                                                                <i class="bi bi-telephone"></i> {{ $u->telephone }}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            @if($u->ville)
                                                                {{ $u->ville }}
                                                                @if($u->gouvernorat)
                                                                    <br><small class="text-muted">{{ $u->gouvernorat }}</small>
                                                                @endif
                                                            @else
                                                                <span class="text-muted">Non spécifié</span>
                                                            @endif
                                                        </td>
                                                        <td>{{ Str::limit($u->symptomes, 30) }}</td>
                                                        <td>{{ ucfirst($u->type_urgence) }}</td>
                                                        <td data-hospital="{{ $u->hopital_cible }}">
                                                            @if($u->hopital_cible)
                                                                <i class="bi bi-check-circle-fill text-success"></i> {{ $u->hopital_cible }}
                                                            @else
                                                                <span class="badge bg-warning text-dark">
                                                                    <i class="bi bi-exclamation-triangle"></i> Non spécifié
                                                                </span>
                                                            @endif
                                                        </td>
                                                        <td>
                                                            <span class="status-badge badge-{{ str_replace('_', '-', $u->etat) }}">
                                                                {{ $u->etat_label }}
                                                            </span>
                                                        </td>
                                                        <td class="text-nowrap">
                                                            <div class="d-flex gap-1">
                                                                <button class="btn btn-sm btn-outline-primary editBtn" data-id="{{ $u->id }}" title="Modifier">
                                                                    <i class="bi bi-pencil"></i>
                                                                </button>
                                                                @if($u->etat == 'en_attente' || $u->etat == 'echec')
                                                                    <button class="btn btn-sm btn-outline-success callBtn @if(!$u->hopital_cible) disabled @endif" 
                                                                            data-id="{{ $u->id }}" id="callBtn-{{ $u->id }}"
                                                                            @if(!$u->hopital_cible) disabled title="Sélectionnez d'abord un hôpital" @else title="Appeler l'hôpital" @endif>
                                                                        <i class="bi bi-telephone"></i>
                                                                    </button>
                                                                @endif
                                                                <button class="btn btn-sm btn-outline-danger deleteBtn" data-id="{{ $u->id }}" title="Supprimer">
                                                                    <i class="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hospitals Tab -->
                <div class="tab-pane fade" id="hopitaux">
                    <h2 class="page-title animate-fade">
                        <i class="bi bi-hospital"></i> Gestion des hôpitaux
                    </h2>
                    
                    <div class="card mb-4 animate-fade" style="animation-delay: 0.1s;">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0"><i class="bi bi-hospital"></i> Liste des hôpitaux</h5>
                            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#hospitalModal">
                                <i class="bi bi-plus-circle"></i> Ajouter
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Téléphone</th>
                                            <th>Ville</th>
                                            <th>Gouvernorat</th>
                                           
                                           
                                        </tr>
                                    </thead>
                                    <tbody id="hospitalsTableBody">
                                        @foreach($hospitals as $name => $phone)
                                        <tr>
                                            <td>{{ $name }}</td>
                                            <td>{{ $phone }}</td>
                                            <td>{{ $hospitalsData[$name]['city'] ?? 'N/A' }}</td>
                                            <td>{{ $hospitalsData[$name]['region'] ?? 'N/A' }}</td>
                                           
                                                @if(isset($hospitalsData[$name]['lat']) && isset($hospitalsData[$name]['lng']))
                                                    {{ $hospitalsData[$name]['lat'] }}, {{ $hospitalsData[$name]['lng'] }}
                                                @else
                                                    N/A
                                                @endif
                                            </td>
                                          
                                           
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Hospital Modal -->
                    <div class="modal fade" id="hospitalModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalHospitalTitle">Ajouter un hôpital</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form id="hospitalForm">
                                    <div class="modal-body">
                                        <input type="hidden" id="hospital_id">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Nom de l'hôpital</label>
                                                    <input type="text" class="form-control" id="hospital_name" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Téléphone</label>
                                                    <input type="text" class="form-control" id="hospital_phone" required>
                                                </div>
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label class="form-label">Ville</label>
                                                        <input type="text" class="form-control" id="hospital_city">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label class="form-label">Gouvernorat</label>
                                                        <select class="form-select" id="hospital_region">
                                                            <option value="">Sélectionnez</option>
                                                            @foreach($gouvernorats as $gouvernorat)
                                                                <option value="{{ $gouvernorat }}">{{ $gouvernorat }}</option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Localisation</label>
                                                    <div id="hospitalMap" style="height: 200px;"></div>
                                                    <small class="text-muted">Cliquez sur la carte pour positionner l'hôpital</small>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <label class="form-label">Latitude</label>
                                                        <input type="text" class="form-control" id="hospital_lat" readonly>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label class="form-label">Longitude</label>
                                                        <input type="text" class="form-control" id="hospital_lng" readonly>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                        <button type="submit" class="btn btn-primary">Enregistrer</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Real-time Tracking Tab -->
                <div class="tab-pane fade" id="suivi">
                    <h2 class="page-title animate-fade">
                        <i class="bi bi-geo-alt"></i> Suivi en temps réel
                    </h2>
                    
                    <div class="card animate-fade" style="animation-delay: 0.1s;">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="bi bi-map"></i> Carte de suivi</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="list-group" id="activeUrgenciesList">
                                        @foreach($activeUrgencies as $urgency)
                                        <a href="#" class="list-group-item list-group-item-action urgency-item" 
                                           data-id="{{ $urgency->id }}"
                                           data-lat="{{ $urgency->latitude }}"
                                           data-lng="{{ $urgency->longitude }}">
                                            <div class="d-flex w-100 justify-content-between">
                                                <h6 class="mb-1">{{ $urgency->nom_patient }}</h6>
                                                <span class="badge bg-{{ $urgency->etat == 'en_attente' ? 'secondary' : 'primary' }}">
                                                    {{ $urgency->etat_label }}
                                                </span>
                                            </div>
                                            <p class="mb-1">{{ $urgency->hopital_cible }}</p>
                                            <small>{{ $urgency->created_at->diffForHumans() }}</small>
                                        </a>
                                        @endforeach
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div id="realtimeMap"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistics Tab -->
<div class="tab-pane fade" id="statistiques">
    <h2 class="page-title animate-fade">
        <i class="bi bi-bar-chart"></i> Statistiques
    </h2>
    
    <div class="row mb-4 animate-fade" style="animation-delay: 0.1s;">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0"><i class="bi bi-pie-chart"></i> Types d'urgence</h5>
                </div>
                <div class="card-body">
                    <canvas id="typeChart" height="300"></canvas>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0"><i class="bi bi-people"></i> Répartition par âge</h5>
                </div>
                <div class="card-body">
                    <canvas id="ageChart" height="300"></canvas>
                </div>
            </div>
        </div>
    </div>
    
    <div class="card animate-fade" style="animation-delay: 0.2s;">
        <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-hospital"></i> Nombre d'urgences par hôpital cible</h5>
        </div>
        <div class="card-body">
            <canvas id="hospitalChart" height="300"></canvas>
        </div>
    </div>
</div>

                <!-- Users Tab -->
                <div class="tab-pane fade" id="utilisateurs">
                    <h2 class="page-title animate-fade">
                        <i class="bi bi-people"></i> Gestion des utilisateurs
                    </h2>
                    
                    <div class="card mb-4 animate-fade" style="animation-delay: 0.1s;">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0"><i class="bi bi-people"></i> Liste des utilisateurs</h5>
                            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#userModal">
                                <i class="bi bi-plus-circle"></i> Ajouter
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Email</th>
                                            <th>Rôle</th>
                                            <th>Dernière connexion</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($users as $user)
                                        <tr>
                                            <td>{{ $user->name }}</td>
                                            <td>{{ $user->email }}</td>
                                            <td>
                                                <span class="badge bg-{{ $user->role == 'admin' ? 'danger' : 'primary' }}">
                                                    {{ ucfirst($user->role) }}
                                                </span>
                                            </td>
                                            <td>{{ $user->last_login_at ? $user->last_login_at->diffForHumans() : 'Jamais' }}</td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary edit-user" 
                                                        data-id="{{ $user->id }}"
                                                        data-name="{{ $user->name }}"
                                                        data-email="{{ $user->email }}"
                                                        data-role="{{ $user->role }}">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                @if($user->id != Auth::id())
                                                <button class="btn btn-sm btn-outline-danger delete-user" data-id="{{ $user->id }}">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                                @endif
                                            </td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- User Modal -->
                    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalUserTitle">Ajouter un utilisateur</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form id="userForm">
                                    <div class="modal-body">
                                        <input type="hidden" id="user_id">
                                        <div class="mb-3">
                                            <label class="form-label">Nom complet</label>
                                            <input type="text" class="form-control" id="user_name" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" id="user_email" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Rôle</label>
                                            <select class="form-select" id="user_role" required>
                                                <option value="user">Utilisateur</option>
                                                <option value="admin">Administrateur</option>
                                            </select>
                                        </div>
                                        <div class="mb-3" id="passwordField">
                                            <label class="form-label">Mot de passe</label>
                                            <input type="password" class="form-control" id="user_password" required>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                        <button type="submit" class="btn btn-primary">Enregistrer</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settings Tab -->
                <div class="tab-pane fade" id="parametres">
                    <h2 class="page-title animate-fade">
                        <i class="bi bi-gear"></i> Paramètres du système
                    </h2>
                    
                    <div class="card animate-fade" style="animation-delay: 0.1s;">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="bi bi-sliders"></i> Configuration</h5>
                        </div>
                        <div class="card-body">
                            <form id="settingsForm">
                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <h6><i class="bi bi-bell"></i> Notifications</h6>
                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="notif_urgences" checked>
                                            <label class="form-check-label" for="notif_urgences">Nouvelles urgences</label>
                                        </div>
                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="notif_appels" checked>
                                            <label class="form-check-label" for="notif_appels">Appels initiés</label>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="notif_statut" checked>
                                            <label class="form-check-label" for="notif_statut">Changements de statut</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6><i class="bi bi-map"></i> Carte</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Style de carte par défaut</label>
                                            <select class="form-select" id="map_style">
                                                <option value="standard">Standard</option>
                                                <option value="satellite">Satellite</option>
                                                <option value="terrain">Terrain</option>
                                            </select>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="map_cluster" checked>
                                            <label class="form-check-label" for="map_cluster">Regroupement des marqueurs</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <h6><i class="bi bi-chat-left-text"></i> Interface</h6>
                                        <div class="mb-3">
                                            <label class="form-label">Langue</label>
                                            <select class="form-select" id="app_lang">
                                                <option value="fr">Français</option>
                                                <option value="ar">العربية</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6><i class="bi bi-shield-lock"></i> Sécurité</h6>
                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="2fa_enabled">
                                            <label class="form-check-label" for="2fa_enabled">Authentification à deux facteurs</label>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="session_timeout" checked>
                                            <label class="form-check-label" for="session_timeout">Déconnexion automatique après 30 min</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-end">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="bi bi-save"></i> Enregistrer les paramètres
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Scripts -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCuxT50PlveNJzwg2ccRMgLEF7N3gMBAd0&libraries=places&language=fr"></script>

<script>
// Liste des hôpitaux tunisiens avec coordonnées
const tunisianHospitals = [
    { name: "Hôpital Charles Nicolle", lat: 36.8065, lng: 10.1815, phone: "+21671336000", city: "Tunis", type: "public" },
    { name: "Hôpital La Rabta", lat: 36.8136, lng: 10.1651, phone: "+21671566000", city: "Tunis", type: "public" },
    { name: "Clinique Les Oliviers", lat: 36.8382, lng: 10.1657, phone: "+21671783000", city: "Tunis", type: "private" },
    
    // Sousse
    { name: "Hôpital Sahloul", lat: 35.8297, lng: 10.5925, phone: "+21673205000", city: "Sousse", type: "public" },
    { name: "Clinique Essalem", lat: 35.8275, lng: 10.6253, phone: "+21673221000", city: "Sousse", type: "private" },
    
    // Sfax
    { name: "Hôpital Hédi Chaker", lat: 34.7406, lng: 10.7603, phone: "+21674244000", city: "Sfax", type: "public" },
    { name: "Clinique Ibn Nafis", lat: 34.7356, lng: 10.7617, phone: "+21674246000", city: "Sfax", type: "private" },
    
    // Autres régions
    { name: "Hôpital Fattouma Bourguiba", lat: 35.7785, lng: 10.8265, phone: "+21673460000", city: "Monastir", type: "public" },
    { name: "Hôpital Régional de Gabès", lat: 33.8815, lng: 10.0982, phone: "+21675220000", city: "Gabès", type: "public" },
    { name: "Clinique El Amen", lat: 36.4692, lng: 10.7353, phone: "+21678720000", city: "Nabeul", type: "private" },
];

let map, hospitalMap, realtimeMap;
let markers = [], hospitalMarkers = [], realtimeMarkers = [];

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleIcon = document.getElementById('toggleIcon');
    
    sidebar.classList.toggle('sidebar-collapsed');
    mainContent.classList.toggle('main-content-collapsed');
    
    if (sidebar.classList.contains('sidebar-collapsed')) {
        toggleIcon.classList.remove('bi-chevron-double-left');
        toggleIcon.classList.add('bi-chevron-double-right');
    } else {
        toggleIcon.classList.remove('bi-chevron-double-right');
        toggleIcon.classList.add('bi-chevron-double-left');
    }
}

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-bs-theme');
    }
});

// Initialize main map
function initMap() {
    // Centrer sur la Tunisie
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 34.0, lng: 9.0 },
        zoom: 7,
        styles: [
            {
                "featureType": "poi.medical",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    });
    
    const adresseInput = document.getElementById("adresse");
    const autocomplete = new google.maps.places.Autocomplete(adresseInput, {
        componentRestrictions: { country: "tn" }
    });
    
    // Ajouter les hôpitaux sur la carte avec marqueurs en forme de goutte de sang
    tunisianHospitals.forEach((hospital) => {
        const marker = new google.maps.Marker({
            position: { lat: hospital.lat, lng: hospital.lng },
            map: map,
            icon: {
                url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="red" d="M50,15c0,0-20,25-20,45c0,20,20,35,20,35s20-15,20-35C70,40,50,15,50,15z"/></svg>',
                scaledSize: new google.maps.Size(30, 30),
                anchor: new google.maps.Point(15, 30)
            },
            title: hospital.name
        });
        
        const infowindow = new google.maps.InfoWindow({
            content: `
                <div class="hospital-info-window">
                    <h5>${hospital.name}</h5>
                    <p><i class="bi bi-geo-alt"></i> ${hospital.city}</p>
                    <p><i class="bi bi-telephone"></i> ${hospital.phone}</p>
                    <button onclick="selectHospital('${hospital.name}', ${hospital.lat}, ${hospital.lng}, '${hospital.city}')">
                        <i class="bi bi-check-circle"></i> Sélectionner
                    </button>
                </div>
            `
        });
        
        marker.addListener("click", () => {
            // Fermer toutes les autres infobulles d'abord
            markers.forEach(m => {
                if (m.infowindow) m.infowindow.close();
            });
            infowindow.open(map, marker);
        });
        
        marker.infowindow = infowindow;
        markers.push(marker);
    });
    
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        
        // Centrer la carte sur l'adresse sélectionnée
        map.setCenter(place.geometry.location);
        map.setZoom(15);
        
        // Mettre à jour les coordonnées dans le formulaire
        $("#latitude").val(place.geometry.location.lat());
        $("#longitude").val(place.geometry.location.lng());
        
        // Extraire la ville et le gouvernorat si possible
        let ville = '';
        let gouvernorat = '';
        
        place.address_components.forEach(component => {
            if (component.types.includes('locality')) {
                ville = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
                gouvernorat = component.long_name;
            }
        });
        
        if (ville) $("#ville").val(ville);
        if (gouvernorat) $("#gouvernorat").val(gouvernorat);
    });
}

// Initialize hospital map
function initHospitalMap() {
    hospitalMap = new google.maps.Map(document.getElementById("hospitalMap"), {
        center: { lat: 34.0, lng: 9.0 },
        zoom: 7
    });
    
    // Add click listener to place marker
    hospitalMap.addListener("click", (e) => {
        placeHospitalMarker(e.latLng);
    });
    
    // Add existing hospitals
    tunisianHospitals.forEach(hospital => {
        const marker = new google.maps.Marker({
            position: { lat: hospital.lat, lng: hospital.lng },
            map: hospitalMap,
            icon: {
                url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="red" d="M50,15c0,0-20,25-20,45c0,20,20,35,20,35s20-15,20-35C70,40,50,15,50,15z"/></svg>',
                scaledSize: new google.maps.Size(30, 30)
            }
        });
        hospitalMarkers.push(marker);
    });
}

// Initialize realtime map
// Dans initRealtimeMap()
function initRealtimeMap() {
    const map = new google.maps.Map(document.getElementById("realtimeMap"), {
        center: { lat: 34.0, lng: 9.0 }, // Centré sur Tunis par défaut
        zoom: 7
    });

    let marker;

    // Fonction pour mettre à jour la position
    async function updatePosition() {
        const phone = "21693114631"; // Numéro à suivre
        const response = await fetch(`/api/position?phone=${phone}`);
        const data = await response.json();

        if (data.lat && data.lng) {
            const position = { lat: data.lat, lng: data.lng };
            if (!marker) {
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });
            } else {
                marker.setPosition(position);
            }
            map.setCenter(position);
            map.setZoom(15); // Zoom précis sur la position
        }
    }

    // Rafraîchir toutes les 5 secondes
    setInterval(updatePosition, 5000);
    updatePosition(); // Premier appel
}

// Place marker on hospital map
function placeHospitalMarker(latLng) {
    // Clear existing marker
    if (hospitalMarkers.length > 0) {
        hospitalMarkers.forEach(marker => marker.setMap(null));
        hospitalMarkers = [];
    }
    
    // Add new marker
    const marker = new google.maps.Marker({
        position: latLng,
        map: hospitalMap,
        icon: {
            url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="red" d="M50,15c0,0-20,25-20,45c0,20,20,35,20,35s20-15,20-35C70,40,50,15,50,15z"/></svg>',
            scaledSize: new google.maps.Size(30, 30)
        }
    });
    hospitalMarkers.push(marker);
    
    // Update form fields
    $("#hospital_lat").val(latLng.lat());
    $("#hospital_lng").val(latLng.lng());
    
    // Center map on marker
    hospitalMap.setCenter(latLng);
    hospitalMap.setZoom(15);
}

// Add urgency marker to realtime map
function addUrgencyMarker(id, lat, lng, name, status) {
    const marker = new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        map: realtimeMap,
        icon: {
            url: status === 'en_attente' ? 
                 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' :
                 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(32, 32)
        },
        title: name
    });
    
    const infowindow = new google.maps.InfoWindow({
        content: `<div><strong>${name}</strong><br>Statut: ${status}</div>`
    });
    
    marker.addListener("click", () => {
        infowindow.open(realtimeMap, marker);
    });
    
    realtimeMarkers.push({
        id: id,
        marker: marker,
        infowindow: infowindow
    });
}

// Select hospital from map
function selectHospital(name, lat, lng, city) {
    $("#hopital_cible").val(name);
    
    // Centrer la carte sur l'hôpital sélectionné
    map.setCenter({ lat: lat, lng: lng });
    map.setZoom(15);
    
    if (city) {
        $("#ville").val(city);
    }
    
    // Fermer toutes les infobulles
    markers.forEach(marker => {
        if (marker.infowindow) marker.infowindow.close();
    });
    
    // Afficher un feedback visuel
    Swal.fire({
        icon: 'success',
        title: 'Hôpital sélectionné',
        text: name,
        timer: 1500,
        showConfirmButton: false
    });
}

// Voice recognition
function startVoice(inputId) {
    const input = document.getElementById(inputId);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        Swal.fire({
            icon: 'error',
            title: 'Non supporté',
            text: 'Votre navigateur ne supporte pas la reconnaissance vocale.',
            timer: 2000
        });
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
        const placeholderText = input.getAttribute('placeholder');
        input.placeholder = "Parlez maintenant...";
        input.classList.add('is-recording');
        
        // Feedback visuel
        Swal.fire({
            title: 'Enregistrement en cours',
            text: 'Parlez maintenant pour ' + placeholderText.toLowerCase(),
            timer: 2000,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        input.value = text;
        speak(`Champ ${input.placeholder} rempli avec : ${text}`);
    };

    recognition.onerror = (event) => {
        console.error("Erreur vocale :", event.error);
        if (event.error !== "aborted") {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur de reconnaissance vocale : ' + event.error,
                timer: 2000
            });
        }
    };

    recognition.onend = () => {
        const placeholderText = inputId === 'symptomes' ? 'Décrivez les symptômes' : 
                              inputId === 'nom_patient' ? 'Nom patient' :
                              inputId === 'telephone' ? 'Téléphone' : 'Adresse complète';
        input.placeholder = placeholderText;
        input.classList.remove('is-recording');
    };

    recognition.start();
}

// Text to speech
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
    }
}

// Initialize charts
function initCharts() {
    // Activity chart (dynamique)
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    const activityChart = new Chart(activityCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [{
                label: 'Urgences',
                data: @json($monthlyCounts),
                borderColor: 'rgba(214, 40, 57, 1)',
                backgroundColor: 'rgba(214, 40, 57, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Type chart
    const typeCtx = document.getElementById('typeChart').getContext('2d');
    const typeChart = new Chart(typeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Ambulance', 'SAMU', 'Autre'],
            datasets: [{
                data: [
                    {{ \App\Models\Urgency::where('type_urgence', 'ambulance')->count() }},
                    {{ \App\Models\Urgency::where('type_urgence', 'samu')->count() }},
                    {{ \App\Models\Urgency::where('type_urgence', 'autre')->count() }}
                ],
                backgroundColor: [
                    'rgba(214, 40, 57, 0.8)',
                    'rgba(247, 127, 0, 0.8)',
                    'rgba(252, 191, 73, 0.8)'
                ],
                borderColor: [
                    'rgba(214, 40, 57, 1)',
                    'rgba(247, 127, 0, 1)',
                    'rgba(252, 191, 73, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.raw || 0;
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // Age chart - Nouveau graphique pour la répartition par âge
    const ageCtx = document.getElementById('ageChart').getContext('2d');
    const ageChart = new Chart(ageCtx, {
        type: 'bar',
        data: {
            labels: ['0-18 ans', '19-30 ans', '31-45 ans', '46-60 ans', '61+ ans'],
            datasets: [{
                label: 'Nombre de patients',
                data: [
                    {{ \App\Models\Urgency::whereBetween('age', [0, 18])->count() }},
                    {{ \App\Models\Urgency::whereBetween('age', [19, 30])->count() }},
                    {{ \App\Models\Urgency::whereBetween('age', [31, 45])->count() }},
                    {{ \App\Models\Urgency::whereBetween('age', [46, 60])->count() }},
                    {{ \App\Models\Urgency::where('age', '>', 60)->count() }}
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nombre de patients'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tranches d\'âge'
                    }
                }
            }
        }
    });

    // Monthly chart
    const hospitalCtx = document.getElementById('hospitalChart').getContext('2d');
    const hospitalChart = new Chart(hospitalCtx, {
        type: 'bar',
        data: {
            labels: [
                'Hôpital Charles Nicolle Tunis',
                'Hôpital La Rabta Tunis',
                'Hôpital Habib Thameur Tunis',
                'Hôpital militaire Tunis',
                'Hôpital Farhat Hached Sousse',
                'Hôpital Sahloul Sousse',
                'Hôpital Fattouma Bourguiba Monastir',
                'Hôpital Hédi Chaker Sfax',
                'Hôpital Taher Sfar Mahdia',
                'Hôpital Ibn Jazzar Kairouan'
            ],
            datasets: [{
                label: 'Nombre d\'urgences',
                data: [
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital Charles Nicolle Tunis')->count() }},
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital La Rabta Tunis')->count() }},
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital Habib Thameur Tunis')->count() }},
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital militaire Tunis')->count() }},
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital Farhat Hached Sousse')->count() }},
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital Sahloul Sousse')->count() }},
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital Fattouma Bourguiba Monastir')->count() }},
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital Hédi Chaker Sfax')->count() }},
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital Taher Sfar Mahdia')->count() }},
                    {{ \App\Models\Urgency::where('hopital_cible', 'Hôpital Ibn Jazzar Kairouan')->count() }}
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nombre d\'urgences'
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

// Load statistics
function loadStatistics() {
    // Afficher un indicateur de chargement
    $('#totalUrgences').html('<i class="bi bi-hourglass"></i>');
    $('#urgencesAttente').html('<i class="bi bi-hourglass"></i>');
    $('#urgencesTerminees').html('<i class="bi bi-hourglass"></i>');
    $('#urgencesEchec').html('<i class="bi bi-hourglass"></i>');

    // Requête AJAX pour récupérer les données dynamiques
    $.ajax({
        url: '/api/urgences/stats', // Vous devez créer cette route API
        method: 'GET',
        success: function(response) {
            // Animer les valeurs
            animateValue('totalUrgences', 0, response.total, 1000);
            animateValue('urgencesAttente', 0, response.enAttente, 1000);
            animateValue('urgencesTerminees', 0, response.terminees, 1000);
            animateValue('urgencesEchec', 0, response.echecs, 1000);
        },
        error: function() {
            // En cas d'erreur, afficher les valeurs PHP directement
            $('#totalUrgences').text('{{ $total }}');
            $('#urgencesAttente').text('{{ $enAttente }}');
            $('#urgencesTerminees').text('{{ $terminees }}');
            $('#urgencesEchec').text('{{ $echecs }}');
        }
    });
}

// Fonction pour animer les valeurs
function animateValue(id, start, end, duration) {
    let obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Appeler au chargement de la page
$(document).ready(function() {
    loadStatistics();
    
    // Actualiser toutes les 30 secondes
    setInterval(loadStatistics, 30000);
});

// Document ready
$(function () {
    // Initialize maps
    initMap();
    initHospitalMap();
    initRealtimeMap();
    
    // Initialize charts
    initCharts();
    
    // Load statistics
    loadStatistics();
    
    // Filter urgency table
    $('[data-filter]').click(function(e) {
        e.preventDefault();
        const filter = $(this).data('filter');
        
        if (filter === 'all') {
            $('#urgencyTable tbody tr').show();
        } else {
            $('#urgencyTable tbody tr').hide();
            $(`#urgencyTable tbody tr[data-status="${filter}"]`).show();
        }
        
        $('#filterDropdown').text($(this).text());
    });
    
    // Hospital form handling
    $('#hospitalForm').submit(function(e) {
        e.preventDefault();
        
        const hospitalData = {
            name: $('#hospital_name').val(),
            phone: $('#hospital_phone').val(),
            city: $('#hospital_city').val(),
            region: $('#hospital_region').val(),
            lat: $('#hospital_lat').val(),
            lng: $('#hospital_lng').val()
        };
        
        // Here you would typically send data to server via AJAX
        console.log('Hospital data:', hospitalData);
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Hôpital enregistré',
            text: `${hospitalData.name} a été ajouté avec succès`,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            $('#hospitalModal').modal('hide');
            // Reload or update table
        });
    });
    
    // Edit hospital
    $('.edit-hospital').click(function() {
        const name = $(this).data('name');
        const phone = $(this).data('phone');
        const city = $(this).data('city');
        const region = $(this).data('region');
        const lat = $(this).data('lat');
        const lng = $(this).data('lng');
        
        $('#modalHospitalTitle').text(`Modifier ${name}`);
        $('#hospital_name').val(name);
        $('#hospital_phone').val(phone);
        $('#hospital_city').val(city);
        $('#hospital_region').val(region);
        $('#hospital_lat').val(lat);
        $('#hospital_lng').val(lng);
        
        if (lat && lng) {
            const latLng = new google.maps.LatLng(lat, lng);
            placeHospitalMarker(latLng);
            hospitalMap.setCenter(latLng);
            hospitalMap.setZoom(15);
        }
        
        $('#hospitalModal').modal('show');
    });
    
    // Delete hospital
    $('.delete-hospital').click(function() {
        const name = $(this).data('name');
        
        Swal.fire({
            title: 'Confirmer la suppression',
            text: `Voulez-vous vraiment supprimer ${name} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // Here you would typically send delete request to server
                Swal.fire(
                    'Supprimé!',
                    `${name} a été supprimé.`,
                    'success'
                ).then(() => {
                    // Reload or update table
                });
            }
        });
    });
    
    // User form handling
    $('#userForm').submit(function(e) {
        e.preventDefault();
        
        const userData = {
            name: $('#user_name').val(),
            email: $('#user_email').val(),
            role: $('#user_role').val(),
            password: $('#user_password').val()
        };
        
        // Here you would typically send data to server via AJAX
        console.log('User data:', userData);
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Utilisateur enregistré',
            text: `${userData.name} a été ajouté avec succès`,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            $('#userModal').modal('hide');
            // Reload or update table
        });
    });
    
    // Edit user
    $('.edit-user').click(function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const email = $(this).data('email');
        const role = $(this).data('role');
        
        $('#modalUserTitle').text(`Modifier ${name}`);
        $('#user_id').val(id);
        $('#user_name').val(name);
        $('#user_email').val(email);
        $('#user_role').val(role);
        $('#passwordField').hide();
        
        $('#userModal').modal('show');
    });
    
    // Delete user
    $('.delete-user').click(function() {
        const id = $(this).data('id');
        const name = $(this).closest('tr').find('td:first').text();
        
        Swal.fire({
            title: 'Confirmer la suppression',
            text: `Voulez-vous vraiment supprimer ${name} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // Here you would typically send delete request to server
                Swal.fire(
                    'Supprimé!',
                    `${name} a été supprimé.`,
                    'success'
                ).then(() => {
                    // Reload or update table
                });
            }
        });
    });
    
    // Settings form
    $('#settingsForm').submit(function(e) {
        e.preventDefault();
        
        const settings = {
            notifications: {
                urgences: $('#notif_urgences').is(':checked'),
                appels: $('#notif_appels').is(':checked'),
                statut: $('#notif_statut').is(':checked')
            },
            map: {
                style: $('#map_style').val(),
                cluster: $('#map_cluster').is(':checked')
            },
            interface: {
                lang: $('#app_lang').val()
            },
            security: {
                two_factor: $('#2fa_enabled').is(':checked'),
                session_timeout: $('#session_timeout').is(':checked')
            }
        };
        
        // Here you would typically save settings
        console.log('Settings:', settings);
        
        Swal.fire({
            icon: 'success',
            title: 'Paramètres enregistrés',
            timer: 1500,
            showConfirmButton: false
        });
    });
    
    // New user button
    $('[data-bs-target="#userModal"]').click(function() {
        $('#modalUserTitle').text('Ajouter un utilisateur');
        $('#userForm')[0].reset();
        $('#user_id').val('');
        $('#passwordField').show();
    });
    
    // New hospital button
    $('[data-bs-target="#hospitalModal"]').click(function() {
        $('#modalHospitalTitle').text('Ajouter un hôpital');
        $('#hospitalForm')[0].reset();
        // Clear map markers
        hospitalMarkers.forEach(marker => marker.setMap(null));
        hospitalMarkers = [];
        hospitalMap.setCenter({ lat: 34.0, lng: 9.0 });
        hospitalMap.setZoom(7);
    });
    
    // Center on urgency in realtime map
    $(".urgency-item").click(function(e) {
        e.preventDefault();
        const lat = $(this).data('lat');
        const lng = $(this).data('lng');
        
        if (lat && lng) {
            realtimeMap.setCenter({ lat: lat, lng: lng });
            realtimeMap.setZoom(15);
        }
    });
    
    // Gestion des urgences avec AJAX
    $('#urgencyForm').on('submit', function(e) {
        e.preventDefault();
        
        // Vérifier que l'hôpital est sélectionné
        if (!$('#hopital_cible').val()) {
            $('#hospital-error').show();
            $('#hopital_cible').focus();
            return;
        } else {
            $('#hospital-error').hide();
        }
        
        let id = $('#urgency_id').val();
        let url = id ? `/urgences/update/${id}` : `{{ route('urgencies.store') }}`;
        let method = 'POST';
        
        let data = {
            _token: '{{ csrf_token() }}',
            nom_patient: $('#nom_patient').val(),
            telephone: $('#telephone').val(),
            adresse: $('#adresse').val(),
            age: $('#age').val(),
            symptomes: $('#symptomes').val(),
            type_urgence: $('#type_urgence').val(),
            hopital_cible: $('#hopital_cible').val(),
            latitude: $('#latitude').val(),
            longitude: $('#longitude').val(),
            ville: $('#ville').val(),
            gouvernorat: $('#gouvernorat').val()
        };
        
        if ($('#initier_appel').is(':checked')) {
            data.initier_appel = true;
        }
        
        // Afficher un indicateur de chargement
        const submitBtn = $(this).find('button[type="submit"]');
        const originalBtnText = submitBtn.html();
        submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enregistrement...');
        
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: 'Urgence enregistrée avec succès',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            },
            error: function(xhr) {
                submitBtn.prop('disabled', false).html(originalBtnText);
                
                let errorMsg = 'Une erreur est survenue';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: errorMsg
                });
            }
        });
    });
    
    // Édition
    $('.editBtn').click(function() {
        let id = $(this).data('id');
        
        // Afficher un indicateur de chargement
        const editBtn = $(this);
        const originalBtnContent = editBtn.html();
        editBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
        
        $.get(`{{ url('/urgences/edit') }}/${id}`, function(data) {
            editBtn.html(originalBtnContent);
            
            let urgency = data.urgency;
            $('#urgency_id').val(urgency.id);
            $('#nom_patient').val(urgency.nom_patient);
            $('#telephone').val(urgency.telephone);
            $('#adresse').val(urgency.adresse);
            $('#age').val(urgency.age);
            $('#symptomes').val(urgency.symptomes);
            $('#type_urgence').val(urgency.type_urgence);
            $('#hopital_cible').val(urgency.hopital_cible);
            $('#latitude').val(urgency.latitude);
            $('#longitude').val(urgency.longitude);
            $('#ville').val(urgency.ville);
            $('#gouvernorat').val(urgency.gouvernorat);
            
            // Centrer la carte sur la position du patient
            if (urgency.latitude && urgency.longitude) {
                map.setCenter({ lat: parseFloat(urgency.latitude), lng: parseFloat(urgency.longitude) });
                map.setZoom(15);
            }
            
            // Scroll to form avec animation douce
            $('html, body').animate({
                scrollTop: $('#urgencyForm').offset().top - 20
            }, 500);
            
            // Feedback visuel
            Swal.fire({
                icon: 'success',
                title: 'Urgence chargée',
                text: 'Vous pouvez maintenant modifier les détails',
                timer: 1500,
                showConfirmButton: false
            });
        }).fail(function() {
            editBtn.html(originalBtnContent);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de charger les données de l\'urgence'
            });
        });
    });
    
    // Appel d'urgence
    $('.callBtn').click(function() {
        let id = $(this).data('id');
        let hospital = $(`#row-${id} td[data-hospital]`).data('hospital');
        
        if (!hospital) {
            Swal.fire({
                icon: 'error',
                title: 'Hôpital manquant',
                text: 'Veuillez sélectionner un hôpital cible avant d\'initier l\'appel',
                footer: '<a href="#" onclick="$(`#editBtn-${id}`).click(); return false;">Modifier cette urgence maintenant</a>'
            });
            return;
        }
        
        Swal.fire({
            title: 'Confirmer l\'appel',
            html: `Initier un appel vers <strong>${hospital}</strong> ?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '<i class="bi bi-telephone"></i> Oui, appeler',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // Afficher un indicateur de chargement
                const callBtn = $(`#callBtn-${id}`);
                const originalBtnContent = callBtn.html();
                callBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
                
                $.post(`/urgences/initier-appel/${id}`, {
                    _token: '{{ csrf_token() }}'
                }).done(function(response) {
                    callBtn.html(originalBtnContent);
                    
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Succès!',
                            html: `Appel initié vers <strong>${hospital}</strong>`,
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire(
                            'Erreur!',
                            response.error,
                            'error'
                        );
                    }
                }).fail(function(xhr) {
                    callBtn.html(originalBtnContent);
                    
                    let errorMsg = 'Erreur lors de l\'appel';
                    if (xhr.responseJSON && xhr.responseJSON.error) {
                        errorMsg = xhr.responseJSON.error;
                    }
                    Swal.fire(
                        'Erreur!',
                        errorMsg,
                        'error'
                    );
                });
            }
        });
    });
    
    // Suppression
    $('.deleteBtn').click(function() {
        let id = $(this).data('id');
        Swal.fire({
            title: 'Confirmer la suppression',
            text: "Cette action est irréversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // Afficher un indicateur de chargement
                const deleteBtn = $(this);
                const originalBtnContent = deleteBtn.html();
                deleteBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
                
                $.ajax({
                    url: `{{ url('/urgences/delete') }}/${id}`,
                    method: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        _method: 'DELETE'
                    },
                    success: function() {
                        $(`#row-${id}`).fadeOut(400, function() {
                            $(this).remove();
                        });
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Supprimé!',
                            text: 'L\'urgence a été supprimée.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    },
                    error: function() {
                        deleteBtn.html(originalBtnContent);
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur!',
                            text: 'La suppression a échoué.',
                            timer: 2000
                        });
                    }
                });
            }
        });
    });
});
</script>

<!-- Leaflet CSS & JS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>

<style>
  #map {
    width: 100%;
    height: 400px;
    margin-top: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
</style>

<div id="map"></div>

<script>
  let map = L.map('map').setView([36.8065, 10.1815], 13); // Position initiale : Tunis
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let marker;

  function getPatientPosition(phone) {
    fetch(`/api/position?phone=${phone}`)
      .then(res => res.json())
      .then(data => {
        if (data.lat && data.lng) {
          let pos = [data.lat, data.lng];
          if (!marker) {
            marker = L.marker(pos).addTo(map);
          } else {
            marker.setLatLng(pos);
          }
          map.setView(pos, 15);
        }
      });
  }

  // Change this to the real patient's phone number
  const patientPhone = "21693114631";

  // Rafraîchir la position toutes les 10 secondes
  setInterval(() => {
    getPatientPosition(patientPhone);
  }, 10000);
</script>

</body>
</html>