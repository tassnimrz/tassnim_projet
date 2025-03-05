<x-guest-layout>
    <!-- Vidéo en arrière-plan -->
    <div class="background-video-container">
        <video autoplay muted loop class="background-video">
            <source src="https://media.istockphoto.com/id/2150178677/video/discussion-tablet-and-doctor-with-senior-patient-in-hospital-office-for-diagnosis-surgery-or.mp4?s=mp4-640x640-is&k=20&c=Bw6ePEBxDI0vPMrWB8pSpDZpTJxRHa74AB-P6HtmPsw=" type="video/mp4">
            Votre navigateur ne prend pas en charge la vidéo.
        </video>
    </div>

    <div class="form-container">
        <x-auth-session-status class="mb-4" :status="session('status')" />

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <!-- Email Address -->
            <div>
                <x-input-label for="email" :value="__('Email')" />
                <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
                <x-input-error :messages="$errors->get('email')" class="mt-2" />
            </div>

            <!-- Password -->
            <div class="mt-4">
                <x-input-label for="password" :value="__('Password')" />
                <x-text-input id="password" class="block mt-1 w-full" type="password" name="password" required autocomplete="current-password" />
                <x-input-error :messages="$errors->get('password')" class="mt-2" />
            </div>

            <!-- Remember Me -->
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
</x-guest-layout>

<!-- Styles -->
<style>
    /* Vidéo en arrière-plan */
    .background-video-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .background-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Formulaire avec fond transparent */
    .form-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(255, 255, 255, 0.5); /* Opacité transparente */
        border-radius: 10px;
        padding: 20px;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .form-container input,
    .form-container button {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #ccc;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.7); /* Transparence pour les champs */
    }

    .form-container button {
        background-color: #007BFF;
        color: white;
        cursor: pointer;
    }

    .form-container button:hover {
        background-color: #0056b3;
    }
</style>
