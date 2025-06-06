<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
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

    <!-- Formulaire avec animation -->
    <div class="form-container">
        <x-auth-session-status class="mb-4" :status="session('status')" />

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <!-- Email -->
            <div>
                <x-input-label for="email" :value="__('Email')" />
                <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
                <x-input-error :messages="$errors->get('email')" class="mt-2" />
            </div>

            <!-- Mot de passe -->
            <div class="mt-4">
                <x-input-label for="password" :value="__('Password')" />
                <x-text-input id="password" class="block mt-1 w-full" type="password" name="password" required autocomplete="current-password" />
                <x-input-error :messages="$errors->get('password')" class="mt-2" />
            </div>

            <!-- Se souvenir de moi -->
            <div class="block mt-4">
                <label for="remember_me" class="inline-flex items-center">
                    <input id="remember_me" type="checkbox" name="remember">
                    <span class="text-sm text-gray-600">{{ __('Remember me') }}</span>
                </label>
            </div>

            <div class="flex items-center justify-end mt-4">
                @if (Route::has('password.request'))
                    <a class="underline text-sm text-gray-600" href="{{ route('password.request') }}">
                        {{ __('Forgot your password?') }}
                    </a>
                @endif

                <x-primary-button class="ml-3">
                    {{ __('Log in') }}
                </x-primary-button>
            </div>
        </form>
    </div>

</body>
</html>