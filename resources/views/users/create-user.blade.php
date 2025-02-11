@extends('layouts.admin')

@section('content')
    <h2>Ajouter un utilisateur</h2>

    @if(session('success'))
        <p style="color: green;">{{ session('success') }}</p>
    @endif

    <form method="POST" action="{{ route('users.store') }}">
        @csrf
        <input type="text" name="name" placeholder="Nom" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Mot de passe" required>
        <input type="password" name="password_confirmation" placeholder="Confirmer le mot de passe" required>
        <input type="text" name="tel" placeholder="Téléphone" required>
        <input type="text" name="adresse" placeholder="Adresse" required>
        <input type="date" name="date_naissance" required>
        <input type="text" name="status" placeholder="Statut" required>

        <label>Rôle :</label>
        <select name="role_id" required>
            @foreach($roles as $role)
                <option value="{{ $role->id }}">{{ ucfirst($role->nom) }}</option>
            @endforeach
        </select>

        <button type="submit">Ajouter</button>
    </form>
@endsection
