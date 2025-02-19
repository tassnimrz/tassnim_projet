
    <div class="container">
        <h1>Liste des Consultations</h1>
        <a href="{{ route('consultations.create') }}" class="btn btn-primary">Ajouter une Consultation</a>

        @if(session('success'))
            <div class="alert alert-success mt-3">
                {{ session('success') }}
            </div>
        @endif

        <table class="table mt-3">
            <thead>
                <tr>
                    <th>Date de Consultation</th>
                    <th>Motif</th>
                    <th>Diagnostic</th>
                    <th>Traitement</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($consultations as $consultation)
                    <tr>
                        <td>{{ $consultation->date_consultation }}</td>
                        <td>{{ $consultation->motif }}</td>
                        <td>{{ $consultation->diagnostic }}</td>
                        <td>{{ $consultation->traitement }}</td>
                        <td>{{ $consultation->statut }}</td>
                        <td>
                            <a href="{{ route('consultations.show', $consultation->id) }}" class="btn btn-info">Voir</a>
                            <a href="{{ route('consultations.edit', $consultation->id) }}" class="btn btn-warning">Modifier</a>
                            <form action="{{ route('consultations.destroy', $consultation->id) }}" method="POST" style="display: inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger" onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')">Supprimer</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

