<div class="container">
    <h1>Liste des Fiches Patients</h1>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <a href="{{ route('fiche-patient.create') }}" class="btn btn-primary">Créer une nouvelle fiche</a>

    @if(isset($fichePatients) && $fichePatients->isNotEmpty())
        <table class="table table-bordered mt-3">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Date de Naissance</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($fichePatients as $fiche)
                <tr>
                    <td>{{ $fiche->id }}</td>
                    <td>{{ $fiche->nom }}</td>
                    <td>{{ $fiche->prenom }}</td>
                    <td>{{ $fiche->date_naissance }}</td>
                    <td>{{ $fiche->telephone }}</td>
                    <td>{{ $fiche->email }}</td>
                    <td>
                        <a href="{{ route('fiche-patient.show', $fiche->id) }}" class="btn btn-info">Voir</a>
                        <a href="{{ route('fiche-patient.edit', $fiche->id) }}" class="btn btn-warning">Modifier</a>
<a href="{{route('dossier-medical.index')}}">les dossiers</a>
                        <form action="{{ route('fiche-patient.destroy', $fiche->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger" onclick="return confirm('Voulez-vous vraiment supprimer cette fiche ?')">Supprimer</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>Aucune fiche patient trouvée.</p>
    @endif
</div>
