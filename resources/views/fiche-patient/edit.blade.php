
<div class="container">
    <h2 class="mb-4">Modifier la Fiche Patient</h2>

    <form action="{{ route('fiche-patient.update', $fichePatient->id) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="nom" class="form-label">Nom</label>
            <input type="text" class="form-control" name="nom" value="{{ $fichePatient->nom }}" required>
        </div>

        <div class="mb-3">
            <label for="prenom" class="form-label">Prénom</label>
            <input type="text" class="form-control" name="prenom" value="{{ $fichePatient->prenom }}" required>
        </div>

        <div class="mb-3">
            <label for="date_naissance" class="form-label">Date de naissance</label>
            <input type="date" class="form-control" name="date_naissance" value="{{ $fichePatient->date_naissance }}" required>
        </div>

        <div class="mb-3">
            <label for="sexe" class="form-label">Sexe</label>
            <select name="sexe" class="form-control" required>
                <option value="Masculin" {{ $fichePatient->sexe == 'Masculin' ? 'selected' : '' }}>Masculin</option>
                <option value="Féminin" {{ $fichePatient->sexe == 'Féminin' ? 'selected' : '' }}>Féminin</option>
                <option value="Autre" {{ $fichePatient->sexe == 'Autre' ? 'selected' : '' }}>Autre</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="etat_civil" class="form-label">État Civil</label>
            <select name="etat_civil" class="form-control" required>
                <option value="Célibataire" {{ $fichePatient->etat_civil == 'Célibataire' ? 'selected' : '' }}>Célibataire</option>
                <option value="Marié" {{ $fichePatient->etat_civil == 'Marié' ? 'selected' : '' }}>Marié</option>
                <option value="Divorcé" {{ $fichePatient->etat_civil == 'Divorcé' ? 'selected' : '' }}>Divorcé</option>
                <option value="Veuf" {{ $fichePatient->etat_civil == 'Veuf' ? 'selected' : '' }}>Veuf</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="telephone" class="form-label">Téléphone</label>
            <input type="text" class="form-control" name="telephone" value="{{ $fichePatient->telephone }}" required>
        </div>

        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" name="email" value="{{ $fichePatient->email }}" required>
        </div>

        <div class="mb-3">
            <label for="adresse" class="form-label">Adresse</label>
            <input type="text" class="form-control" name="adresse" value="{{ $fichePatient->adresse }}">
        </div>

        <div class="mb-3">
            <label for="ville" class="form-label">Ville</label>
            <input type="text" class="form-control" name="ville" value="{{ $fichePatient->ville }}">
        </div>

        <div class="mb-3">
            <label for="code_postal" class="form-label">Code Postal</label>
            <input type="text" class="form-control" name="code_postal" value="{{ $fichePatient->code_postal }}">
        </div>

        <div class="mb-3">
            <label for="groupe_sanguin" class="form-label">Groupe Sanguin</label>
            <input type="text" class="form-control" name="groupe_sanguin" value="{{ $fichePatient->groupe_sanguin }}">
        </div>

        <div class="mb-3">
            <label for="date_premiere_visite" class="form-label">Date de première visite</label>
            <input type="date" class="form-control" name="date_premiere_visite" value="{{ $fichePatient->date_premiere_visite }}" required>
        </div>

        <button type="submit" class="btn btn-success">Enregistrer les modifications</button>
        <a href="{{ route('fiche-patient.show', $fichePatient->id) }}" class="btn btn-secondary">Annuler</a>
    </form>
</div>

