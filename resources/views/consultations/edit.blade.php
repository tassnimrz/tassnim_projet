
    <div class="container">
        <h1>Modifier la Consultation</h1>

        <form action="{{ route('consultations.update', $consultation->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label for="dossier_medical_id" class="form-label">Dossier Médical</label>
                <select name="dossier_medical_id" id="dossier_medical_id" class="form-control" required>
                    <option value="">Sélectionner un dossier médical</option>
                    @foreach($dossiers as $dossier)
                        <option value="{{ $dossier->id }}" {{ $dossier->id == $consultation->dossier_medical_id ? 'selected' : '' }}>
                            {{ $dossier->patient->nom }} ({{ $dossier->patient->cin }})
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="mb-3">
                <label for="date_consultation" class="form-label">Date de Consultation</label>
                <input type="datetime-local" name="date_consultation" id="date_consultation" class="form-control" value="{{ $consultation->date_consultation->format('Y-m-d\TH:i') }}" required>
            </div>

            <div class="mb-3">
                <label for="motif" class="form-label">Motif</label>
                <input type="text" name="motif" id="motif" class="form-control" value="{{ $consultation->motif }}" required>
            </div>

            <div class="mb-3">
                <label for="diagnostic" class="form-label">Diagnostic</label>
                <textarea name="diagnostic" id="diagnostic" class="form-control" rows="4" required>{{ $consultation->diagnostic }}</textarea>
            </div>

            <div class="mb-3">
                <label for="traitement" class="form-label">Traitement</label>
                <textarea name="traitement" id="traitement" class="form-control" rows="4" required>{{ $consultation->traitement }}</textarea>
            </div>

            <div class="mb-3">
                <label for="observations" class="form-label">Observations</label>
                <textarea name="observations" id="observations" class="form-control" rows="4">{{ $consultation->observations }}</textarea>
            </div>

            <div class="mb-3">
                <label for="statut" class="form-label">Statut</label>
                <select name="statut" id="statut" class="form-control" required>
                    <option value="en attente" {{ $consultation->statut == 'en attente' ? 'selected' : '' }}>En attente</option>
                    <option value="terminée" {{ $consultation->statut == 'terminée' ? 'selected' : '' }}>Terminée</option>
                    <option value="annulée" {{ $consultation->statut == 'annulée' ? 'selected' : '' }}>Annulée</option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary">Mettre à jour Consultation</button>
        </form>
    </div>

