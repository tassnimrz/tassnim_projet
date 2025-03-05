<div class="container mt-5">
    <h2 class="mb-4 text-center">Modifier la Fiche Patient 📝</h2>

    <form action="{{ route('fiche-patient.update', $fichePatient->id) }}" method="POST">
        @csrf
        @method('PUT')

        <!-- Information générale du patient -->
        <div class="form-section">
            <div class="mb-3">
                <label for="nom" class="form-label">Nom 🧑‍⚕️</label>
                <input type="text" class="form-control" name="nom" value="{{ $fichePatient->nom }}" required>
            </div>

            <div class="mb-3">
                <label for="prenom" class="form-label">Prénom 👤</label>
                <input type="text" class="form-control" name="prenom" value="{{ $fichePatient->prenom }}" required>
            </div>

            <div class="mb-3">
                <label for="date_naissance" class="form-label">Date de naissance 🎂</label>
                <input type="date" class="form-control" name="date_naissance" value="{{ $fichePatient->date_naissance }}" required>
            </div>

            <div class="mb-3">
                <label for="sexe" class="form-label">Sexe ⚥</label>
                <select name="sexe" class="form-control" required>
                    <option value="Masculin" {{ $fichePatient->sexe == 'Masculin' ? 'selected' : '' }}>Masculin</option>
                    <option value="Féminin" {{ $fichePatient->sexe == 'Féminin' ? 'selected' : '' }}>Féminin</option>
                    <option value="Autre" {{ $fichePatient->sexe == 'Autre' ? 'selected' : '' }}>Autre</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="etat_civil" class="form-label">État Civil 💍</label>
                <select name="etat_civil" class="form-control" required>
                    <option value="Célibataire" {{ $fichePatient->etat_civil == 'Célibataire' ? 'selected' : '' }}>Célibataire</option>
                    <option value="Marié" {{ $fichePatient->etat_civil == 'Marié' ? 'selected' : '' }}>Marié</option>
                    <option value="Divorcé" {{ $fichePatient->etat_civil == 'Divorcé' ? 'selected' : '' }}>Divorcé</option>
                    <option value="Veuf" {{ $fichePatient->etat_civil == 'Veuf' ? 'selected' : '' }}>Veuf</option>
                </select>
            </div>
        </div>

        <!-- Contact et informations supplémentaires -->
        <div class="form-section">
            <div class="mb-3">
                <label for="telephone" class="form-label">Téléphone 📱</label>
                <input type="tel" class="form-control" name="telephone" value="{{ $fichePatient->telephone }}" required>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email 📧</label>
                <input type="email" class="form-control" name="email" value="{{ $fichePatient->email }}" required>
            </div>

            <div class="mb-3">
                <label for="adresse" class="form-label">Adresse 🏡</label>
                <input type="text" class="form-control" name="adresse" value="{{ $fichePatient->adresse }}">
            </div>

            <div class="mb-3">
                <label for="ville" class="form-label">Ville 🏙️</label>
                <input type="text" class="form-control" name="ville" value="{{ $fichePatient->ville }}">
            </div>

            <div class="mb-3">
                <label for="code_postal" class="form-label">Code Postal 📍</label>
                <input type="text" class="form-control" name="code_postal" value="{{ $fichePatient->code_postal }}">
            </div>

            <div class="mb-3">
                <label for="groupe_sanguin" class="form-label">Groupe Sanguin 🩸</label>
                <input type="text" class="form-control" name="groupe_sanguin" value="{{ $fichePatient->groupe_sanguin }}">
            </div>
        </div>

        <!-- Informations supplémentaires -->
        <div class="form-section">
            <div class="mb-3">
                <label for="date_premiere_visite" class="form-label">Date de première visite 🗓️</label>
                <input type="date" class="form-control" name="date_premiere_visite" value="{{ $fichePatient->date_premiere_visite }}" required>
            </div>
        </div>

        <!-- Boutons -->
        <div class="text-center">
            <button type="submit" class="btn btn-primary btn-animate">Enregistrer les modifications 💾</button>
            <a href="{{ route('fiche-patient.show', $fichePatient->id) }}" class="btn btn-secondary btn-animate">Annuler ❌</a>
        </div>
    </form>
</div>

<!-- Styles supplémentaires -->
<style>
    .container {
        background: linear-gradient(to bottom, #80aaff, #4e73df);
        color: rgb(18, 18, 18);
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    }

    .form-section {
        background: rgba(252, 249, 249, 0.9);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .form-control {
        border-radius: 5px;
        background-color: #f8f9fc;
        border: 1px solid #ccc;
        padding: 10px;
        transition: all 0.3s ease-in-out;
    }

    .form-control:focus {
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    .form-label {
        font-weight: 500;
    }

    .btn {
        font-weight: 600;
        padding: 12px 24px;
        border-radius: 5px;
        margin: 5px;
        transition: transform 0.3s ease-in-out;
    }

    .btn-primary {
        background-color: #007bff;
        border-color: #007bff;
    }

    .btn-secondary {
        background-color: #6c757d;
        border-color: #6c757d;
    }

    .btn-animate:hover {
        transform: scale(1.1);
    }

    h2 {
        font-weight: 600;
    }

    /* Animation d'apparition des champs de formulaire */
    .form-section {
        opacity: 0;
        animation: fadeIn 1s forwards;
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }

</style>
