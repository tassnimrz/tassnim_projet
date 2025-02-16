<!-- resources/views/dossier-medical/edit.blade.php -->


    <div class="container">
        <h1>Modifier le Dossier Médical de {{ $dossierMedical->fichePatient->nom }} {{ $dossierMedical->fichePatient->prenom }}</h1>

        <!-- Formulaire d'édition du dossier médical -->
        <form action="{{ route('dossier-medical.update', $dossierMedical->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="form-group">
                <label for="vaccins">Vaccins</label>
                <input type="text" name="vaccins" id="vaccins" class="form-control" value="{{ old('vaccins', $dossierMedical->vaccins) }}" placeholder="Vaccins">
                @error('vaccins')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="notes_medecin">Notes du Médecin</label>
                <textarea name="notes_medecin" id="notes_medecin" class="form-control" rows="3" placeholder="Notes du médecin">{{ old('notes_medecin', $dossierMedical->notes_medecin) }}</textarea>
                @error('notes_medecin')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Bouton de soumission -->
            <button type="submit" class="btn btn-success">Mettre à jour le dossier médical</button>
        </form>
    </div>

