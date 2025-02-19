
    <div class="container">
        <h1>Modifier un Certificat Médical</h1>

        <form action="{{ route('certificats.update', $certificat->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label for="dossier_medical_id" class="form-label">Dossier Médical</label>
                <select name="dossier_medical_id" id="dossier_medical_id" class="form-control">
                    @foreach($dossiers as $dossier)
                        <option value="{{ $dossier->id }}" {{ $dossier->id == $certificat->dossier_medical_id ? 'selected' : '' }}>
                            {{ $dossier->patient->nom }} {{ $dossier->patient->prenom }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="mb-3">
                <label for="user_id" class="form-label">Patient (Utilisateur)</label>
                <select name="user_id" id="user_id" class="form-control">
                    <option value="">Sélectionner un patient</option>
                    @foreach($users as $user)
                        <option value="{{ $user->id }}" {{ $user->id == $certificat->user_id ? 'selected' : '' }}>
                            {{ $user->name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="mb-3">
                <label for="type_certificat" class="form-label">Type de Certificat</label>
                <select name="type_certificat" id="type_certificat" class="form-control">
                    <option value="aptitude" {{ $certificat->type_certificat == 'aptitude' ? 'selected' : '' }}>Aptitude</option>
                    <option value="repos" {{ $certificat->type_certificat == 'repos' ? 'selected' : '' }}>Repos</option>
                    <option value="dispense" {{ $certificat->type_certificat == 'dispense' ? 'selected' : '' }}>Dispense</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="date_certificat" class="form-label">Date du Certificat</label>
                <input type="date" name="date_certificat" id="date_certificat" class="form-control" value="{{ $certificat->date_certificat->format('Y-m-d') }}" required>
            </div>

            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea name="description" id="description" class="form-control">{{ $certificat->description }}</textarea>
            </div>

            <div class="mb-3">
                <label for="confirmation_medecin" class="form-label">Confirmation du Médecin</label>
                <input type="checkbox" name="confirmation_medecin" id="confirmation_medecin" {{ $certificat->confirmation_medecin ? 'checked' : '' }}>
            </div>

            <div class="mb-3">
                <label for="jours_repos" class="form-label">Jours de Repos</label>
                <input type="number" name="jours_repos" id="jours_repos" class="form-control" value="{{ $certificat->jours_repos }}">
            </div>

            <div class="mb-3">
                <label for="periode_dispense" class="form-label">Période de Dispense</label>
                <input type="text" name="periode_dispense" id="periode_dispense" class="form-control" value="{{ $certificat->periode_dispense }}">
            </div>

            <button type="submit" class="btn btn-primary">Mettre à jour</button>
        </form>
    </div>

