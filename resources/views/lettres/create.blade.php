
<div class="container">
    <h2>Créer une Lettre Médicale</h2>
    <form action="{{ route('lettres_medicales.store') }}" method="POST">
        @csrf

        <div class="form-group">
            <label for="dossier_medical_id">Dossier Médical</label>
            <select name="dossier_medical_id" id="dossier_medical_id" class="form-control @error('dossier_medical_id') is-invalid @enderror">
                <option value="">Sélectionner un dossier médical</option>
                @foreach ($dossiers as $dossier)
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
            <label for="type_lettre">Type de Lettre</label>
            <select name="type_lettre" id="type_lettre" class="form-control @error('type_lettre') is-invalid @enderror">
                <option value="">Sélectionner le type de lettre</option>
                <option value="consultation" {{ old('type_lettre') == 'consultation' ? 'selected' : '' }}>Consultation</option>
                <option value="hospitalisation" {{ old('type_lettre') == 'hospitalisation' ? 'selected' : '' }}>Hospitalisation</option>
                <option value="chirurgie" {{ old('type_lettre') == 'chirurgie' ? 'selected' : '' }}>Chirurgie</option>
            </select>
            @error('type_lettre')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group">
            <label for="date_lettre">Date de la Lettre</label>
            <input type="date" name="date_lettre" id="date_lettre" class="form-control @error('date_lettre') is-invalid @enderror" value="{{ old('date_lettre') }}">
            @error('date_lettre')
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

        <div class="form-group" id="confirmation_medecin_div" style="display:none;">
            <label for="confirmation_medecin">Confirmation du Médecin</label>
            <input type="checkbox" name="confirmation_medecin" id="confirmation_medecin" value="1" class="form-control @error('confirmation_medecin') is-invalid @enderror" {{ old('confirmation_medecin') ? 'checked' : '' }}>
            @error('confirmation_medecin')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group" id="jours_hospitalisation_div" style="display:none;">
            <label for="jours_hospitalisation">Nombre de jours d'Hospitalisation</label>
            <input type="number" name="jours_hospitalisation" id="jours_hospitalisation" class="form-control @error('jours_hospitalisation') is-invalid @enderror" value="{{ old('jours_hospitalisation') }}">
            @error('jours_hospitalisation')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group" id="periode_chirurgie_div" style="display:none;">
            <label for="periode_chirurgie">Période de Chirurgie</label>
            <input type="text" name="periode_chirurgie" id="periode_chirurgie" class="form-control @error('periode_chirurgie') is-invalid @enderror" value="{{ old('periode_chirurgie') }}">
            @error('periode_chirurgie')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <button type="submit" class="btn btn-primary">Créer la Lettre Médicale</button>
    </form>
</div>

<script>
    // Affichage des champs spécifiques en fonction du type de lettre sélectionné
    document.getElementById('type_lettre').addEventListener('change', function () {
        const typeLettre = this.value;
        if (typeLettre === 'consultation') {
            document.getElementById('confirmation_medecin_div').style.display = 'block';
            document.getElementById('jours_hospitalisation_div').style.display = 'none';
            document.getElementById('periode_chirurgie_div').style.display = 'none';
        } else if (typeLettre === 'hospitalisation') {
            document.getElementById('confirmation_medecin_div').style.display = 'none';
            document.getElementById('jours_hospitalisation_div').style.display = 'block';
            document.getElementById('periode_chirurgie_div').style.display = 'none';
        } else if (typeLettre === 'chirurgie') {
            document.getElementById('confirmation_medecin_div').style.display = 'none';
            document.getElementById('jours_hospitalisation_div').style.display = 'none';
            document.getElementById('periode_chirurgie_div').style.display = 'block';
        } else {
            document.getElementById('confirmation_medecin_div').style.display = 'none';
            document.getElementById('jours_hospitalisation_div').style.display = 'none';
            document.getElementById('periode_chirurgie_div').style.display = 'none';
        }
    });
</script>

