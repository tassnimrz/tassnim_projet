
    <div class="container">
        <h1>Détails du Certificat Médical</h1>

        <div class="mb-3">
            <strong>Nom du Patient :</strong> {{ $certificat->dossierMedical->fichePatient->nom }} {{ $certificat->dossierMedical->fichePatient->prenom }}
        </div>

        <div class="mb-3">
            <strong>Type de Certificat :</strong> {{ ucfirst($certificat->type_certificat) }}
        </div>

        <div class="mb-3">
            <strong>Date :</strong> {{ $certificat->date_certificat->format('d/m/Y') }}
        </div>

        <div class="mb-3">
            <strong>Description :</strong> {{ $certificat->description }}
        </div>

        <div class="mb-3">
            <strong>Confirmation du Médecin :</strong> {{ $certificat->confirmation_medecin ? 'Oui' : 'Non' }}
        </div>

        <div class="mb-3">
            <strong>Jours de Repos :</strong> {{ $certificat->jours_repos }}
        </div>

        <div class="mb-3">
            <strong>Période de Dispense :</strong> {{ $certificat->periode_dispense }}
        </div>

        <a href="{{ route('certificats.index') }}" class="btn btn-secondary">Retour à la liste</a>
    </div>

