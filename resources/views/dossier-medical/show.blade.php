
<div class="container">
    <h1>Dossier Médical de {{ $dossierMedical->fichePatient->nom }} {{ $dossierMedical->fichePatient->prenom }}</h1>

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

    <div class="card">
        <div class="card-header">
            Informations du Dossier Médical
        </div>
        <div class="card-body">
            <ul>
                <li><strong>Nom du Patient:</strong> {{ $dossierMedical->fichePatient->nom }}</li>
                <li><strong>Prénom du Patient:</strong> {{ $dossierMedical->fichePatient->prenom }}</li>
                <li><strong>Vaccins:</strong> {{ $dossierMedical->vaccins ? $dossierMedical->vaccins : 'Non renseigné' }}</li>
                <li><strong>Notes du Médecin:</strong> {{ $dossierMedical->notes_medecin ? $dossierMedical->notes_medecin : 'Aucune note disponible' }}</li>
                <li><strong>Date de Création:</strong> {{ $dossierMedical->created_at->format('d/m/Y') }}</li>
                <li><strong>Dernière Mise à Jour:</strong> {{ $dossierMedical->updated_at->format('d/m/Y') }}</li>
            </ul>
        </div>
    </div>

    <div class="mt-4">
        <a href="{{ route('dossier-medical.index') }}" class="btn btn-secondary">Retour à la Liste des Dossiers Médicaux</a>
        <p></p>
        <a href="{{ route('dossier-medical.edit', $dossierMedical->id) }}" class="btn btn-warning">Modifier</a>
<p></p>
        <!-- Formulaire pour supprimer le dossier médical -->
        <form action="{{ route('dossier-medical.destroy', $dossierMedical->id) }}" method="POST" style="display:inline;">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger" onclick="return confirm('Êtes-vous sûr de vouloir supprimer ce dossier médical ?')">Supprimer</button>
        </form>
        <p>
            <a href="{{ route('fiche-patient.show', $dossierMedical->fichePatient->id) }}" class="btn btn-primary">Voir la fiche du patient</a>
        </p>
    </div>
</div>

