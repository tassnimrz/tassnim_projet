
    <div class="container">
        <h1>Liste des Certificats Médicaux</h1>

        @if(session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <a href="{{ route('certificats.create') }}" class="btn btn-primary mb-3">Créer un certificat</a>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Nom du Patient</th>
                    <th>Type de Certificat</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($certificats as $certificat)
                    <tr>
                        <td>{{ $certificat->dossierMedical->fichePatient->nom }} {{ $certificat->dossierMedical->fichePatient->prenom }}</td>
                        <td>{{ ucfirst($certificat->type_certificat) }}</td>
                        <td>{{ $certificat->date_certificat->format('d/m/Y') }}</td>
                        <td>
                            <a href="{{ route('certificats.show', $certificat->id) }}" class="btn btn-info">Voir</a>
                            <a href="{{ route('certificats.edit', $certificat->id) }}" class="btn btn-warning">Modifier</a>
                            <form action="{{ route('certificats.destroy', $certificat->id) }}" method="POST" style="display:inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger">Supprimer</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

