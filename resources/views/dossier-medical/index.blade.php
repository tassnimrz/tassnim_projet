<div class="container">
    <h1>Liste des Dossiers Médicaux</h1>

    <!-- Affichage des messages de succès ou d'erreur -->
    @if (session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    @if (session('error'))
        <div class="alert alert-danger">
            {{ session('error') }}
        </div>
    @endif

    <!-- Table des dossiers médicaux -->
    <table class="table">
        <thead>
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @if(isset($dossiersMedicaux) && $dossiersMedicaux->isNotEmpty())
                @foreach($dossiersMedicaux as $dossier)
                    <tr>
                        <td>{{ $dossier->fichePatient->nom }}</td>
                        <td>{{ $dossier->fichePatient->prenom }}</td>
                        <td>
                            <a href="{{ route('dossier-medical.show', $dossier->id) }}" class="btn btn-primary">Voir Dossier</a>
                        </td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="3">Aucun dossier médical disponible.</td>
                </tr>
            @endif
        </tbody>
    </table>
</div>
