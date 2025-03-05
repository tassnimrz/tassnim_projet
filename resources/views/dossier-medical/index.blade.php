<div class="container mt-5">
    <h1 class="text-center mb-4">Liste des Dossiers Médicaux</h1>

    <!-- Affichage des messages de succès ou d'erreur -->
    @if (session('success'))
        <div class="alert alert-success fade-in">
            <span role="img" aria-label="succès">🎉</span> {{ session('success') }}
        </div>
    @endif

    @if (session('error'))
        <div class="alert alert-danger fade-in">
            <span role="img" aria-label="erreur">⚠️</span> {{ session('error') }}
        </div>
    @endif

    <!-- Table des dossiers médicaux avec un fond transparent -->
    <table class="table table-bordered table-striped table-transparent">
        <thead class="bg-primary text-white">
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @if(isset($dossiersMedicaux) && $dossiersMedicaux->isNotEmpty())
                @foreach($dossiersMedicaux as $dossier)
                    <tr class="fade-in">
                        <td class="table-cell">{{ $dossier->fichePatient->nom }}</td>
                        <td class="table-cell">{{ $dossier->fichePatient->prenom }}</td>
                        <td class="table-cell">
                            <a href="{{ route('dossier-medical.show', $dossier->id) }}" class="btn btn-info btn-sm">
                                📄 Voir Dossier
                            </a>
                        </td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="3" class="text-center text-muted">❌ Aucun dossier médical disponible.</td>
                </tr>
            @endif
        </tbody>
    </table>
</div>

<!-- Styles CSS pour améliorer l'aspect visuel et l'animation -->
<style>
    /* Police moderne */
    body {
        background-image: url('https://plus.unsplash.com/premium_photo-1689247946399-c4f532fda0f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmxldSUyMGQlQzMlQTlnYWR8ZW58MHx8MHx8fDA%3D'); /* Ajoute ici ton chemin d'image */
        background-size: cover;
        font-family: 'Poppins', sans-serif;
        color: #333;
        margin: 0;
        padding: 0;
    }

    h1 {
        color: #007bff;
        font-weight: 600;
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    }

    /* Tableau avec fond transparent et bordure */
    .table-transparent {
        background-color: rgba(255, 255, 255, 0.9);  /* Transparent avec un léger blanc */
        border-radius: 8px;
        border: 1px solid rgba(0, 123, 255, 0.6);  /* Bordure bleu clair */
    }

    .table-bordered th, .table-bordered td {
        border: 1px solid rgba(0, 123, 255, 0.6);  /* Bordure légère */
    }

    /* Uniformiser les couleurs des colonnes */
    .table-transparent th {
        background-color: #007bff; /* Bleu pour les en-têtes */
        color: white;
    }

    .table-cell {
        background-color: rgba(248, 249, 250, 0.9); /* Gris clair pour les cellules */
    }

    .table-striped tbody tr:nth-child(odd) {
        background-color: rgba(248, 249, 250, 0.9); /* Légèrement grisé pour les lignes impaires */
    }

    /* Animation fade-in */
    .fade-in {
        animation: fadeIn 1s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Boutons modernes */
    .btn {
        transition: all 0.3s ease;
    }

    .btn:hover {
        transform: scale(1.05);
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Alerte */
    .alert {
        animation: fadeInAlert 1s ease-in-out;
    }

    @keyframes fadeInAlert {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

<!-- Inclut Bootstrap pour la mise en page et les composants -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
