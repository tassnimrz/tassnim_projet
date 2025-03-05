<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Créer une fiche patient</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEJRoL1j6R1f3vF7MXqcc7AO7wFZ8l/t1d7fex9/d7gxhQ39yG6/t3D7TA7Qf" crossorigin="anonymous">
    <style>
        body {
            background-color: #f4f7fc;
            font-family: Arial, sans-serif;
        }

        header {
            background-color: #003366;
            color: white;
            padding: 15px 0;
            text-align: center;
            font-size: 1.5rem;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            animation: typing 3s steps(30) 1s 1 normal both;
            white-space: nowrap;
            overflow: hidden;
        }

        header .logo {
            font-size: 2rem;
        }

        .container {
            max-width: 800px;
            margin: 30px auto;
            background-color: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .form-group label {
            font-weight: bold;
            color: #003366;
        }

        .form-control {
            border-radius: 8px;
            border: 1px solid #003366;
        }

        .form-control:focus {
            border-color: #0066cc;
            box-shadow: 0 0 5px rgba(0, 102, 204, 0.5);
        }

        button {
            background-color: #003366;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #005bb5;
        }

        /* Animation de typewriting */
        @keyframes typing {
            from {
                width: 0;
            }

            to {
                width: 100%;
            }
        }

        .btn-submit {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .emoji {
            font-size: 1.5rem;
            margin-left: 10px;
        }

    </style>
</head>

<body>

    <header>
        <span class="logo">E-Santé 🩺🤍</span>
        <span>Créer une fiche patient</span>
    </header>

    <div class="container">
        <form action="{{ route('fiche-patient.store') }}" method="POST">
            @csrf

            <div class="form-group">
                <label for="nom">Nom</label>
                <input type="text" name="nom" id="nom" class="form-control" value="{{ old('nom') }}" required>
                <span class="emoji">👤</span>
            </div>

            <div class="form-group">
                <label for="prenom">Prénom</label>
                <input type="text" name="prenom" id="prenom" class="form-control" value="{{ old('prenom') }}" required>
                <span class="emoji">👨‍👩‍👧</span>
            </div>

            <div class="form-group">
                <label for="date_naissance">Date de naissance</label>
                <input type="date" name="date_naissance" id="date_naissance" class="form-control" value="{{ old('date_naissance') }}" required>
                <span class="emoji">🎂</span>
            </div>

            <div class="form-group">
                <label for="sexe">Sexe</label>
                <select name="sexe" id="sexe" class="form-control" required>
                    <option value="Masculin" {{ old('sexe') == 'Masculin' ? 'selected' : '' }}>Masculin</option>
                    <option value="Féminin" {{ old('sexe') == 'Féminin' ? 'selected' : '' }}>Féminin</option>
                    <option value="Autre" {{ old('sexe') == 'Autre' ? 'selected' : '' }}>Autre</option>
                </select>
                <span class="emoji">👫</span>
            </div>

            <div class="form-group">
                <label for="etat_civil">État civil</label>
                <select name="etat_civil" id="etat_civil" class="form-control" required>
                    <option value="Célibataire" {{ old('etat_civil') == 'Célibataire' ? 'selected' : '' }}>Célibataire</option>
                    <option value="Marié" {{ old('etat_civil') == 'Marié' ? 'selected' : '' }}>Marié</option>
                    <option value="Divorcé" {{ old('etat_civil') == 'Divorcé' ? 'selected' : '' }}>Divorcé</option>
                    <option value="Veuf" {{ old('etat_civil') == 'Veuf' ? 'selected' : '' }}>Veuf</option>
                </select>
                <span class="emoji">💍</span>
            </div>

            <div class="form-group">
                <label for="telephone">Téléphone</label>
                <input type="text" name="telephone" id="telephone" class="form-control" value="{{ old('telephone') }}" required maxlength="15">
                <span class="emoji">📞</span>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="form-control" value="{{ old('email') }}" required>
                <span class="emoji">📧</span>
            </div>

            <div class="form-group">
                <label for="adresse">Adresse</label>
                <input type="text" name="adresse" id="adresse" class="form-control" value="{{ old('adresse') }}">
                <span class="emoji">🏠</span>
            </div>

            <div class="form-group">
                <label for="ville">Ville</label>
                <input type="text" name="ville" id="ville" class="form-control" value="{{ old('ville') }}">
                <span class="emoji">🏙️</span>
            </div>

            <div class="form-group">
                <label for="code_postal">Code postal</label>
                <input type="text" name="code_postal" id="code_postal" class="form-control" value="{{ old('code_postal') }}">
                <span class="emoji">📍</span>
            </div>

            <div class="form-group">
                <label for="groupe_sanguin">Groupe sanguin</label>
                <input type="text" name="groupe_sanguin" id="groupe_sanguin" class="form-control" value="{{ old('groupe_sanguin') }}">
                <span class="emoji">🩸</span>
            </div>

            <div class="form-group">
                <label for="allergies">Allergies</label>
                <textarea name="allergies" id="allergies" class="form-control">{{ old('allergies') }}</textarea>
                <span class="emoji">⚠️</span>
            </div>

            <div class="form-group">
                <label for="antecedents_medicaux">Antécédents médicaux</label>
                <textarea name="antecedents_medicaux" id="antecedents_medicaux" class="form-control">{{ old('antecedents_medicaux') }}</textarea>
                <span class="emoji">💉</span>
            </div>

            <div class="form-group">
                <label for="traitement_en_cours">Traitement en cours</label>
                <textarea name="traitement_en_cours" id="traitement_en_cours" class="form-control">{{ old('traitement_en_cours') }}</textarea>
                <span class="emoji">💊</span>
            </div>

            <div class="form-group">
                <label for="assurance_medicale">Assurance médicale</label>
                <input type="text" name="assurance_medicale" id="assurance_medicale" class="form-control" value="{{ old('assurance_medicale') }}">
                <span class="emoji">💼</span>
            </div>

            <div class="form-group">
                <label for="numero_assurance">Numéro d'assurance</label>
                <input type="text" name="numero_assurance" id="numero_assurance" class="form-control" value="{{ old('numero_assurance') }}" maxlength="50">
                <span class="emoji">🆔</span>
            </div>

            <div class="form-group">
                <label for="date_premiere_visite">Date de la première visite</label>
                <input type="date" name="date_premiere_visite" id="date_premiere_visite" class="form-control" value="{{ old('date_premiere_visite') }}" required>
                <span class="emoji">📅</span>
            </div>

            <div class="btn-submit">
                <button type="submit" class="btn">Enregistrer</button>
            </div>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
