<!-- resources/views/certificats/create.blade.php -->


<div class="container">
    <h2>Créer un Certificat Médical</h2>

    <form action="{{ route('certificats.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label for="dossier_medical_id">Dossier Médical</label>
            <select name="dossier_medical_id" id="dossier_medical_id" class="form-control @error('dossier_medical_id') is-invalid @enderror">
                <option value="">Sélectionner un dossier médical</option>
                @foreach($dossiers as $dossier)
                    <option value="{{ $dossier->id }}" {{ old('dossier_medical_id') == $dossier->id ? 'selected' : '' }}>
                        {{ $dossier->fichePatient->nom }} {{ $dossier->fichePatient->prenom }}
                    </option>
                @endforeach
            </select>
            @error('dossier_medical_id')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

       

        <div class="form-group">
            <label for="type_certificat">Type de Certificat</label>
            <select name="type_certificat" id="type_certificat" class="form-control @error('type_certificat') is-invalid @enderror">
                <option value="">Sélectionner un type</option>
                <option value="aptitude" {{ old('type_certificat') == 'aptitude' ? 'selected' : '' }}>Aptitude</option>
                <option value="repos" {{ old('type_certificat') == 'repos' ? 'selected' : '' }}>Repos</option>
                <option value="dispense" {{ old('type_certificat') == 'dispense' ? 'selected' : '' }}>Dispense</option>
            </select>
            @error('type_certificat')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group">
            <label for="date_certificat">Date du Certificat</label>
            <input type="date" name="date_certificat" id="date_certificat" class="form-control @error('date_certificat') is-invalid @enderror" value="{{ old('date_certificat') }}">
            @error('date_certificat')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" id="description" class="form-control @error('description') is-invalid @enderror">{{ old('description') }}</textarea>
            @error('description')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <button type="submit" class="btn btn-primary">Créer le Certificat</button>
    </form>
</div>

<script>
    // Mettre à jour le nom du patient quand le dossier médical est sélectionné
    document.getElementById('dossier_medical_id').addEventListener('change', function () {
        const dossierId = this.value;
        const patientNameInput = document.getElementById('patient_name');

        if (dossierId) {
            // Trouver le dossier médical et mettre à jour le nom du patient
            const dossier = @json($dossiers).find(dossier => dossier.id == dossierId);
            if (dossier && dossier.fichePatient) {
                patientNameInput.value = `${dossier.fichePatient.nom} ${dossier.fichePatient.prenom}`;
            }
        } else {
            patientNameInput.value = '';
        }
    });
</script>


