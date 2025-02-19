
    <div class="container">
        <h1>Ordonnance #{{ $ordonnance->id }}</h1>

        <p><strong>Date :</strong> {{ $ordonnance->date_ordonnance }}</p>
        <p><strong>Description :</strong> {{ $ordonnance->description }}</p>
        <p><strong>Statut :</strong> {{ $ordonnance->statut }}</p>
        <p><strong>Durée :</strong> {{ $ordonnance->duree }} jours</p>

        <a href="{{ route('ordonnances.index') }}" class="btn btn-secondary">Retour</a>
    </div>

