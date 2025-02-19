
    <div class="container">
        <h1>Mes Ordonnances</h1>

        @if ($ordonnances->isEmpty())
            <p>Aucune ordonnance trouvée.</p>
        @else
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($ordonnances as $ordonnance)
                        <tr>
                            <td>{{ $ordonnance->date_ordonnance }}</td>
                            <td>{{ $ordonnance->description }}</td>
                            <td>{{ $ordonnance->statut }}</td>
                            <td>
                                <a href="{{ route('ordonnances.show', $ordonnance->id) }}" class="btn btn-info">Voir</a>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        <a href="{{ route('ordonnances.create') }}" class="btn btn-primary">Créer une ordonnance</a>
    </div>

