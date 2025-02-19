
    <h1>Liste des Lettres Médicales</h1>

    <a href="{{ route('lettres.create') }}" class="btn btn-primary">Créer une Lettre Médicale</a>

    <table class="table mt-3">
        <thead>
            <tr>
                <th>#</th>
                <th>Nom du Patient</th>
                <th>Type de Lettre</th>
                <th>Date de la Lettre</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($lettres as $lettre)
                <tr>
                    <td>{{ $lettre->id }}</td>
                    <td>{{ $lettre->getNomCompletPatient() }}</td>
                    <td>{{ $lettre->type_lettre }}</td>
                    <td>{{ $lettre->date_lettre }}</td>
                    <td>
                        <a href="{{ route('lettres.show', $lettre->id) }}" class="btn btn-info">Voir</a>
                        <a href="{{ route('lettres.edit', $lettre->id) }}" class="btn btn-warning">Modifier</a>
                        <form action="{{ route('lettres.destroy', $lettre->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Supprimer</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

