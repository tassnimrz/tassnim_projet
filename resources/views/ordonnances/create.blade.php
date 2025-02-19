
<div class="container">
    <h2>Créer une nouvelle ordonnance</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('ordonnances.store') }}" method="POST">
        @csrf

        <div class="mb-3">
            <label for="consultation_id" class="form-label">Consultation</label>
            <select name="consultation_id" id="consultation_id" class="form-control" required>
                <option value="">Sélectionnez une consultation</option>
                @foreach($consultations as $consultation)
                    <option value="{{ $consultation->id }}">Consultation ID: {{ $consultation->id }}</option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="dossier_medical_id" class="form-label">Dossier Médical</label>
            <select name="dossier_medical_id" id="dossier_medical_id" class="form-control" required>
                <option value="">Sélectionnez un dossier médical</option>
                @foreach($dossiers_medicaux as $dossier)
                    <option value="{{ $dossier->id }}">Dossier ID: {{ $dossier->id }}</option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea name="description" id="description" class="form-control" required>{{ old('description') }}</textarea>
        </div>

        <div class="mb-3">
            <label for="date_ordonnance" class="form-label">Date de l'ordonnance</label>
            <input type="date" name="date_ordonnance" id="date_ordonnance" class="form-control" value="{{ old('date_ordonnance') }}" required>
        </div>

        <div class="mb-3">
            <label for="statut" class="form-label">Statut</label>
            <select name="statut" id="statut" class="form-control" required>
                <option value="">Sélectionnez un statut</option>
                <option value="valide">Valide</option>
                <option value="expirée">Expirée</option>
                <option value="annulée">Annulée</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="duree" class="form-label">Durée (en jours)</label>
            <input type="number" name="duree" id="duree" class="form-control" value="{{ old('duree') }}" min="1">
        </div>

        <button type="submit" class="btn btn-primary">Enregistrer</button>
    </form>
</div>

