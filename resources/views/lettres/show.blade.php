
    <h1>Détails de la Lettre Médicale</h1>

    <div class="card">
        <div class="card-header">
            Lettre Médicale #{{ $lettre->id }}
        </div>
        <div class="card-body">
            <p><strong>Dossier Médical :</strong> {{ $lettre->dossierMedical->id }} - {{ $lettre->dossierMedical->fichePatient->nom }} {{ $lettre->dossierMedical->fichePatient->prenom }}</p>
            <p><strong>Type de Lettre :</strong> {{ ucfirst($lettre->type_lettre) }}</p>
            <p><strong>Date de la Lettre :</strong> {{ $lettre->date_lettre->format('d-m-Y') }}</p>
            <p><strong>Description :</strong> {{ $lettre->description }}</p>

            @if($lettre->type_lettre == 'aptitude')
                <p><strong>Confirmation du Médecin :</strong> {{ $lettre->confirmation_medecin ? 'Oui' : 'Non' }}</p>
            @elseif($lettre->type_lettre == 'repos')
                <p><strong>Jours de Repos :</strong> {{ $lettre->jours_repos }} jours</p>
            @elseif($lettre->type_lettre == 'dispense')
                <p><strong>Période de Dispense :</strong> {{ $lettre->periode_dispense }}</p>
            @endif

            <a href="{{ route('lettres.edit', $lettre->id) }}" class="btn btn-warning">Modifier</a>
            <form action="{{ route('lettres.destroy', $lettre->id) }}" method="POST" class="d-inline-block">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-danger">Supprimer</button>
            </form>
        </div>
    </div>

