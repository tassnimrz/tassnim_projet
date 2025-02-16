
<div class="container">
    <h2 class="mb-4">Détails du Patient</h2>

    <div class="card">
        <div class="card-body">
            <p><strong>Nom :</strong> {{ $fichePatient->nom }}</p>
            <p><strong>Prénom :</strong> {{ $fichePatient->prenom }}</p>
            <p><strong>Date de naissance :</strong> {{ $fichePatient->date_naissance }}</p>
            <p><strong>Sexe :</strong> {{ $fichePatient->sexe }}</p>
            <p><strong>État civil :</strong> {{ $fichePatient->etat_civil }}</p>
            <p><strong>Téléphone :</strong> {{ $fichePatient->telephone }}</p>
            <p><strong>Email :</strong> {{ $fichePatient->email }}</p>
            <p><strong>Adresse :</strong> {{ $fichePatient->adresse }}</p>
            <p><strong>Ville :</strong> {{ $fichePatient->ville }}</p>
            <p><strong>Code postal :</strong> {{ $fichePatient->code_postal }}</p>
            <p><strong>Groupe sanguin :</strong> {{ $fichePatient->groupe_sanguin }}</p>
            <p><strong>Allergies :</strong> {{ $fichePatient->allergies }}</p>
            <p><strong>Antécédents médicaux :</strong> {{ $fichePatient->antecedents_medicaux }}</p>
            <p><strong>Traitement en cours :</strong> {{ $fichePatient->traitement_en_cours }}</p>
            <p><strong>Assurance médicale :</strong> {{ $fichePatient->assurance_medicale }}</p>
            <p><strong>Numéro d'assurance :</strong> {{ $fichePatient->numero_assurance }}</p>
            <p><strong>Date de première visite :</strong> {{ $fichePatient->date_premiere_visite }}</p>

            <a href="{{ route('fiche-patient.edit', $fichePatient->id) }}" class="btn btn-primary">Modifier</a>
            <form action="{{ route('fiche-patient.destroy', $fichePatient->id) }}" method="POST" class="d-inline">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-danger" onclick="return confirm('Êtes-vous sûr de vouloir supprimer ce patient ?');">Supprimer</button>
            </form>
            <a href="{{ route('fiche-patient.index') }}" class="btn btn-secondary">Retour</a>
        </div>
    </div>
</div>

