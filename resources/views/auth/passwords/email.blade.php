<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot De Passe Oublié</title>
    <style>
        /* Animation de la vidéo (zoom progressif) */
        @keyframes zoomVideo {
            from {
                transform: scale(1.5);
            }
            to {
                transform: scale(1.1);
            }
        }

        /* Conteneur de la vidéo */
        .background-video-container {
            position: absolute;
            top: 5%;
            left: 5%;
            width: 90%;
            height: 90%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: -1;
            overflow: hidden;
        }

        /* Vidéo */
        .background-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
            animation: zoomVideo 10s infinite alternate ease-in-out;
        }

        /* Animation pour le formulaire (apparition en fondu progressif avec une légère mise à l'échelle) */
        @keyframes fadeInScale {
            0% {
                opacity: 0.1;
                transform: scale(0.1);
            }

        }

        /* Formulaire */
        .form-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.6); /* Transparence */
            border-radius: 10px;
            padding: 20px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(5px); /* Flou d'arrière-plan */

            /* Appliquer l'animation */
            animation: fadeInScale 1s ease-out;
        }

        .form-container input,
        .form-container button {
            width: 100%;
            padding: 5px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.7);
        }

        .form-container button {
            background-color: #007BFF;
            color: white;
            cursor: pointer;
            transition: background 0.3s;
        }

        .form-container button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>

    <!-- Vidéo en arrière-plan -->
    <div class="background-video-container">
        <video autoplay muted loop class="background-video">
            <source src="https://media.istockphoto.com/id/2150178677/video/discussion-tablet-and-doctor-with-senior-patient-in-hospital-office-for-diagnosis-surgery-or.mp4?s=mp4-640x640-is&k=20&c=Bw6ePEBxDI0vPMrWB8pSpDZpTJxRHa74AB-P6HtmPsw=" type="video/mp4">
            Votre navigateur ne prend pas en charge la vidéo.
        </video>
    </div>

    <div class="form-container">
        <h1>Réinitialiser votre mot de passe</h1>

        <!-- Affichage des messages de session -->
        @if (session('status'))
            <p>{{ session('status') }}</p>
        @endif

        <!-- Affichage des erreurs de validation -->
        @if ($errors->any())
            <div class="error-message">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('password.email') }}" method="POST">
            @csrf
            <label for="email">Email :</label>
            <input type="email" name="email" value="{{ old('email') }}" required>
            <button type="submit">Envoyer</button>
        </form>

        <a href="{{ route('login') }}">Retour à la connexion</a>
    </div>
</body>
</html>