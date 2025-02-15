
    <div class="container">
        <h1>Créer une fiche patient</h1>

        <form action="{{ route('fiche-patient.store') }}" method="POST">
            @csrf

            <div class="form-group">
                <label for="nom">Nom</label>
                <input type="text" name="nom" id="nom" class="form-control" value="{{ old('nom') }}" required>
            </div>

            <div class="form-group">
                <label for="prenom">Prénom</label>
                <input type="text" name="prenom" id="prenom" class="form-control" value="{{ old('prenom') }}" required>
            </div>

            <div class="form-group">
                <label for="date_naissance">Date de naissance</label>
                <input type="date" name="date_naissance" id="date_naissance" class="form-control" value="{{ old('date_naissance') }}" required>
            </div>

            <div class="form-group">
                <label for="sexe">Sexe</label>
                <select name="sexe" id="sexe" class="form-control" required>
                    <option value="Masculin" {{ old('sexe') == 'Masculin' ? 'selected' : '' }}>Masculin</option>
                    <option value="Féminin" {{ old('sexe') == 'Féminin' ? 'selected' : '' }}>Féminin</option>
                    <option value="Autre" {{ old('sexe') == 'Autre' ? 'selected' : '' }}>Autre</option>
                </select>
            </div>

            <div class="form-group">
                <label for="etat_civil">État civil</label>
                <select name="etat_civil" id="etat_civil" class="form-control" required>
                    <option value="Célibataire" {{ old('etat_civil') == 'Célibataire' ? 'selected' : '' }}>Célibataire</option>
                    <option value="Marié" {{ old('etat_civil') == 'Marié' ? 'selected' : '' }}>Marié</option>
                    <option value="Divorcé" {{ old('etat_civil') == 'Divorcé' ? 'selected' : '' }}>Divorcé</option>
                    <option value="Veuf" {{ old('etat_civil') == 'Veuf' ? 'selected' : '' }}>Veuf</option>
                </select>
            </div>

            <div class="form-group">
                <label for="telephone">Téléphone</label>
                <input type="text" name="telephone" id="telephone" class="form-control" value="{{ old('telephone') }}" required maxlength="15">
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="form-control" value="{{ old('email') }}" required>
            </div>

            <div class="form-group">
                <label for="adresse">Adresse</label>
                <input type="text" name="adresse" id="adresse" class="form-control" value="{{ old('adresse') }}">
            </div>

            <div class="form-group">
                <label for="ville">Ville</label>
                <input type="text" name="ville" id="ville" class="form-control" value="{{ old('ville') }}">
            </div>

            <div class="form-group">
                <label for="code_postal">Code postal</label>
                <input type="text" name="code_postal" id="code_postal" class="form-control" value="{{ old('code_postal') }}">
            </div>

            <div class="form-group">
                <label for="groupe_sanguin">Groupe sanguin</label>
                <input type="text" name="groupe_sanguin" id="groupe_sanguin" class="form-control" value="{{ old('groupe_sanguin') }}">
            </div>

            <div class="form-group">
                <label for="allergies">Allergies</label>
                <textarea name="allergies" id="allergies" class="form-control">{{ old('allergies') }}</textarea>
            </div>

            <div class="form-group">
                <label for="antecedents_medicaux">Antécédents médicaux</label>
                <textarea name="antecedents_medicaux" id="antecedents_medicaux" class="form-control">{{ old('antecedents_medicaux') }}</textarea>
            </div>

            <div class="form-group">
                <label for="traitement_en_cours">Traitement en cours</label>
                <textarea name="traitement_en_cours" id="traitement_en_cours" class="form-control">{{ old('traitement_en_cours') }}</textarea>
            </div>

            <div class="form-group">
                <label for="assurance_medicale">Assurance médicale</label>
                <input type="text" name="assurance_medicale" id="assurance_medicale" class="form-control" value="{{ old('assurance_medicale') }}">
            </div>

            <div class="form-group">
                <label for="numero_assurance">Numéro d'assurance</label>
                <input type="text" name="numero_assurance" id="numero_assurance" class="form-control" value="{{ old('numero_assurance') }}" maxlength="50">
            </div>

            <div class="form-group">
                <label for="date_premiere_visite">Date de la première visite</label>
                <input type="date" name="date_premiere_visite" id="date_premiere_visite" class="form-control" value="{{ old('date_premiere_visite') }}" required>
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-success">Enregistrer</button>
            </div>
        </form>
    </div>

