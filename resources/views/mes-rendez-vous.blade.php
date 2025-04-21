<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mes Rendez-vous</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Animate.css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <style>
        :root {
            --primary-color: #4361ee;
            --secondary-color: #1509f9;
            --accent-color: #4cc9f0;
            --success-color: #38b000;
            --warning-color: #ffaa00;
            --light-bg: #f8f9fa;
            --card-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.1);
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f5f7ff;
            color: #2b2d42;
        }
        
        .container {
            max-width: 1200px;
        }
        
        .header-section {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: var(--card-shadow);
            position: relative;
            overflow: hidden;
        }
        
        .header-section::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            transform: rotate(30deg);
        }
        
        h1 {
            font-weight: 600;
            margin: 0;
        }
        
        .btn-home {
            background-color: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50px;
            padding: 0.5rem 1.5rem;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .btn-home:hover {
            background-color: white;
            color: var(--primary-color);
            transform: translateY(-2px);
        }
        
        .badge-confirme {
            background-color: var(--success-color);
            padding: 0.5rem 1rem;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        
        .badge-attente {
            background-color: var(--warning-color);
            color: #212529;
            padding: 0.5rem 1rem;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        
        .table-container {
            background-color: white;
            border-radius: 15px;
            box-shadow: var(--card-shadow);
            overflow: hidden;
            margin-bottom: 2rem;
        }
        
        .table {
            margin-bottom: 0;
        }
        
        .table thead {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
        }
        
        .table thead th {
            padding: 1rem;
            font-weight: 500;
            border: none;
        }
        
        .table tbody tr {
            transition: all 0.3s ease;
        }
        
        .table tbody tr:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .table tbody td {
            padding: 1.2rem 1rem;
            vertical-align: middle;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .btn-action {
            border-radius: 50px;
            padding: 0.4rem 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            border-width: 2px;
        }
        
        .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        }
        
        .empty-state {
            background-color: white;
            border-radius: 15px;
            padding: 3rem;
            text-align: center;
            box-shadow: var(--card-shadow);
        }
        
        .empty-state i {
            font-size: 3rem;
            color: var(--accent-color);
            margin-bottom: 1rem;
        }
        
        .alert {
            border-radius: 10px;
            border: none;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .animate-float {
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        
        .doctor-icon {
            color: var(--primary-color);
            background-color: rgba(67, 97, 238, 0.1);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
        }
        
        .date-cell {
            font-weight: 500;
            color: var(--secondary-color);
        }
        
        .time-cell {
            font-weight: 500;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .header-section {
                padding: 1.5rem;
            }
            
            .table thead {
                display: none;
            }
            
            .table tbody tr {
                display: block;
                margin-bottom: 1rem;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            
            .table tbody td {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 1rem;
                border-bottom: none;
            }
            
            .table tbody td::before {
                content: attr(data-label);
                font-weight: 600;
                color: var(--primary-color);
                margin-right: 1rem;
            }
            
            .table tbody td:last-child {
                border-bottom: 1px solid #f0f0f0;
            }
        }
    </style>
</head>
<body>
    <div class="container py-4 animate__animated animate__fadeIn">
        <div class="header-section animate__animated animate__fadeInDown">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h1 class="mb-2"><i class="fas fa-calendar-alt me-2"></i> Mes Rendez-vous</h1>
                    <p class="mb-0 opacity-75">Gérez vos rendez-vous médicaux en toute simplicité</p>
                </div>
                <a href="/" class="btn btn-home">
                    <i class="fas fa-home me-1"></i> Retour à l'accueil
                </a>
            </div>
        </div>

        <div id="alert-messages">
            @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show animate__animated animate__fadeIn">
                <i class="fas fa-check-circle me-2"></i>
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
            @endif

            @if($rendezVous->isEmpty()))
            <div class="empty-state animate__animated animate__fadeIn">
                <i class="fas fa-calendar-plus animate-float"></i>
                <h3 class="mb-3">Aucun rendez-vous programmé</h3>
                <p class="text-muted">Vous n'avez actuellement aucun rendez-vous. Cliquez sur le bouton ci-dessous pour prendre rendez-vous.</p>
                <a href="#" class="btn btn-primary px-4">
                    <i class="fas fa-plus me-1"></i> Prendre rendez-vous
                </a>
            </div>
            @else
        </div>

        <!-- Tableau des rendez-vous -->
        <div class="table-container animate__animated animate__fadeInUp">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Médecin</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($rendezVous as $rdv)
                    @if($rdv->planningJour))
                    <tr class="animate__animated animate__fadeIn">
                        <td class="date-cell" data-label="Date">
                            @isset($rdv->planningJour->date))
                            {{ \Carbon\Carbon::parse($rdv->planningJour->date)->translatedFormat('d F Y') }}
                            @endisset
                        </td>
                        <td class="time-cell" data-label="Heure">
                            @isset($rdv->planningJour->heure_debut))
                            {{ \Carbon\Carbon::parse($rdv->planningJour->heure_debut)->format('H\hi') }}
                            @endisset
                        </td>
                        <td data-label="Médecin">
                            <span class="doctor-icon">
                                <i class="fas fa-user-md"></i>
                            </span>
                            {{ $rdv->medecin->name ?? 'Médecin non spécifié' }}
                        </td>
                        <td data-label="Statut">
                            <span class="badge rounded-pill {{ $rdv->statut === 'confirmé' ? 'badge-confirme' : 'badge-attente' }}">
                                {{ ucfirst($rdv->statut) }}
                            </span>
                        </td>
                        <td data-label="Actions">
                            <form action="{{ route('rendez-vous.destroy', $rdv->id) }}" method="POST" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-action btn-outline-danger"
                                    onclick="return confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous?')">
                                    <i class="fas fa-calendar-times me-1"></i> Annuler
                                </button>
                            </form>
                        </td>
                    </tr>
                    @endif
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif
    </div>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Auto-dismiss alerts after 5 seconds
        setTimeout(() => {
            const alerts = document.querySelectorAll('.alert');
            alerts.forEach(alert => {
                new bootstrap.Alert(alert).close();
            });
        }, 5000);
        
        // Add animation to table rows on hover
        document.querySelectorAll('.table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.classList.add('animate__animated', 'animate__pulse');
            });
            
            row.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    row.classList.remove('animate__animated', 'animate__pulse');
                }, 1000);
            });
        });
    </script>
</body>
</html>