<div class="container">
    <h1>Modifier l'Ordonnance</h1>

    <form action="{{ route('ordonnances.update', $ordonnance->id) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label for="consultation_id">Consultation</label>
            <select name="consultation_id" id="consultation_id" class="form-control">
                @foreach ($consultations as $consultation)
                    <option value="{{ $consultation->id }}"
                        @if ($ordonnance->consultation_id == $consultation->id) selected @endif>
                        {{ $consultation->motif }} - {{ $consultation->date_consultation }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="dossier_medical_id">Dossier Médical</label>
            <select name="dossier_medical_id" id="dossier_medical_id" class="form-control">
                @foreach ($dossiersMedicaux as $dossier)
                    <option value="{{ $dossier->id }}"
                        @if ($ordonnance->dossier_medical_id == $dossier->id) selected @endif>
                        {{ $dossier->patient_name }} - {{ $dossier->date_creation }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="date_ordonnance">Date de l'Ordonnance</label>
            <input type="date" name="date_ordonnance" id="date_ordonnance" class="form-control" value="{{ $ordonnance->date_ordonnance }}">
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" id="description" class="form-control" rows="4">{{ $ordonnance->description }}</textarea>
        </div>

        <div class="form-group">
            <label for="statut">Statut</label>
            <select name="statut" id="statut" class="form-control">
                <option value="valide" @if($ordonnance->statut == 'valide') selected @endif>Valide</option>
                <option value="expirée" @if($ordonnance->statut == 'expirée') selected @endif>Expirée</option>
                <option value="annulée" @if($ordonnance->statut == 'annulée') selected @endif>Annulée</option>
            </select>
        </div>

        <div class="form-group">
            <label for="duree">Durée de l'Ordonnance (en jours)</label>
            <input type="number" name="duree" id="duree" class="form-control" value="{{ $ordonnance->duree }}">
        </div>

        <button type="submit" class="btn btn-primary">Mettre à jour l'Ordonnance</button>
    </form>
</div>
