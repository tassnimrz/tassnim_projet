
    <div class="container">
        <h1>Détails de la Consultation</h1>

        <div class="mb-3">
            <strong>Date de Consultation:</strong> {{ $consultation->date_consultation }}
        </div>

        <div class="mb-3">
            <strong>Motif:</strong> {{ $consultation->motif }}
        </div>

        <div class="mb-3">
            <strong>Diagnostic:</strong> {{ $consultation->diagnostic }}
        </div>

        <div class="mb-3">
            <strong>Traitement:</strong> {{ $consultation->traitement }}
        </div>

        <div class="mb-3">
            <strong>Observations:</strong> {{ $consultation->observations }}
        </div>

        <div class="mb-3">
            <strong>Statut:</strong> {{ $consultation->statut }}
        </div>

        <a href="{{ route('consultations.index') }}" class="btn btn-secondary">Retour à la liste</a>
    </div>

