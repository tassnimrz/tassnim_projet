
    <h1>Modifier la Lettre Médicale</h1>

    <form action="{{ route('lettres.update', $lettre->id) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label for="dossier_medical_id">Dossier Médical</label>
            <select name="dossier_medical_id" id="dossier_medical_id" class="form-control">
                @foreach($dossiers as $dossier)
                    <option value="{{ $dossier->id }}" {{ $dossier->id == $lettre->dossier_medical_id ? 'selected' : '' }}>
                        {{ $dossier->id }} - {{ $dossier->fichePatient->nom }} {{ $dossier->fichePatient->prenom }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="type_lettre">Type de Lettre</label>
            <select name="type_lettre" id="type_lettre" class="form-control">
                <option value="consultation" {{ $lettre->type_lettre == 'consultation' ? 'selected' : '' }}>Consultation</option>
                <option value="hospitalisation" {{ $lettre->type_lettre == 'hospitalisation' ? 'selected' : '' }}>Hospitalisation</option>
                <option value="chirurgie" {{ $lettre->type_lettre == 'chirurgie' ? 'selected' : '' }}>Chirurgie</option>
            </select>
        </div>

        <div class="form-group">
            <label for="date_lettre">Date de la Lettre</label>
            <input type="date" name="date_lettre" id="date_lettre" class="form-control" value="{{ $lettre->date_lettre->format('Y-m-d') }}">
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" id="description" class="form-control" rows="4">{{ $lettre->description }}</textarea>
        </div>

        @if($lettre->type_lettre == 'aptitude')
            <div class="form-group">
                <label for="confirmation_medecin">Confirmation Médecin</label>
                <input type="checkbox" name="confirmation_medecin" id="confirmation_medecin" class="form-control" {{ $lettre->confirmation_medecin ? 'checked' : '' }}>
            </div>
        @elseif($lettre->type_lettre == 'repos')
            <div class="form-group">
                <label for="jours_repos">Jours de Repos</label>
                <input type="number" name="jours_repos" id="jours_repos" class="form-control" value="{{ $lettre->jours_repos }}" min="0">
            </div>
        @elseif($lettre->type_lettre == 'dispense')
            <div class="form-group">
                <label for="periode_dispense">Période de Dispense</label>
                <input type="text" name="periode_dispense" id="periode_dispense" class="form-control" value="{{ $lettre->periode_dispense }}">
            </div>
        @endif

        <button type="submit" class="btn btn-primary">Mettre à jour la Lettre Médicale</button>
    </form>

