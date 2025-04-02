<div class="container mt-5">
    <!-- Titre de la page -->
    <h1 class="text-center text-primary mb-4">Liste des Consultations 🩺</h1>

    <!-- Message de succès -->
    @if(session('success'))
        <div class="alert alert-success mt-3 rounded-pill shadow-sm">
            <i class="fas fa-check-circle"></i> {{ session('success') }}
        </div>
    @endif

    <!-- Bouton Ajouter Consultation -->
    <div class="mb-4 text-right">
        <a href="{{ route('consultations.create') }}" class="btn btn-lg btn-outline-primary">
            <i class="fas fa-plus-circle"></i> Ajouter une Consultation
        </a>
    </div>

    <!-- Table des Consultations -->
    <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover shadow-lg rounded">
            <thead class="thead-dark bg-primary text-white">
                <tr>
                    <th>Date 🗓️</th>
                    <th>Motif 🩺</th>
                    <th>Diagnostic 🔍</th>
                    <th>Traitement 💊</th>
                    <th>Statut 🏷️</th>
                    <th>Actions ⚙️</th>
                </tr>
            </thead>
            <tbody>
                @foreach($consultations as $consultation)
                    <tr>
                        <td>{{ $consultation->date_consultation }}</td>
                        <td>{{ $consultation->motif }}</td>
                        <td>{{ $consultation->diagnostic }}</td>
                        <td>{{ $consultation->traitement }}</td>
                        <td>
                            <span class="badge {{ $consultation->statut == 'Terminé' ? 'badge-success' : 'badge-warning' }}">
                                {{ $consultation->statut }} 
                                @if($consultation->statut == 'Terminé')
                                    <i class="fas fa-check-circle"></i>
                                @else
                                    <i class="fas fa-clock"></i>
                                @endif
                            </span>
                        </td>
                        <td>
                            <a href="{{ route('consultations.show', $consultation->id) }}" class="btn btn-info btn-sm">
                                <i class="fas fa-eye"></i> Voir
                            </a>
                            <a href="{{ route('consultations.edit', $consultation->id) }}" class="btn btn-warning btn-sm">
                                <i class="fas fa-edit"></i> Modifier
                            </a>

                            <form action="{{ route('consultations.destroy', $consultation->id) }}" method="POST" style="display: inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')">
                                    <i class="fas fa-trash-alt"></i> Supprimer
                                </button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

<!-- CSS personnalisé pour un style dynamique -->
<style>
    body {
        background-color: #f0f7fa;
        font-family: 'Arial', sans-serif;
    }
    .container {
        background-color: #ffffff;
        border-radius: 15px;
        padding: 40px;
    }
    h1 {
        font-weight: bold;
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    }
    .btn {
        font-size: 16px;
        font-weight: bold;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    .btn:hover {
        transform: translateY(-5px);
    }
    .alert {
        border-radius: 15px;
        font-size: 16px;
    }
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
    .table-hover tbody tr:hover {
        background-color: #f1f8ff;
        cursor: pointer;
    }
    .badge {
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: center;
    }
    .thead-dark {
        background-color: #007bff !important;
    }
    .btn-primary {
        background-color: #007bff;
        border-color: #007bff;
    }
    .btn-info {
        background-color: #17a2b8;
        border-color: #17a2b8;
    }
    .btn-warning {
        background-color: #ffc107;
        border-color: #ffc107;
    }
    .btn-danger {
        background-color: #dc3545;
        border-color: #dc3545;
    }
    .btn-sm {
        font-size: 14px;
        padding: 5px 10px;
    }
</style>

<!-- Ajout de Font Awesome pour les icônes -->
<script src="https://kit.fontawesome.com/a076d05399.js"></script>
