@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Prendre un rendez-vous</h1>

        @if (session('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
            </div>
        @endif

        <form action="{{ route('rendezvous.store') }}" method="POST">
            @csrf

            <div class="form-group">
                <label for="user_id">Patient</label>
                <select name="user_id" id="user_id" class="form-control" required>
                    <option value="">Sélectionner un patient</option>
                    @foreach ($users as $user)
                        <option value="{{ $user->id }}">{{ $user->nom }} {{ $user->prenom }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="dossier_medical_id">Dossier Médical</label>
                <select name="dossier_medical_id" id="dossier_medical_id" class="form-control" required>
                    <option value="">Sélectionner un dossier</option>
                    @foreach ($dossiers as $dossier)
                        <option value="{{ $dossier->id }}">{{ $dossier->numero }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="date_rendez_vous">Date du rendez-vous</label>
                <input type="datetime-local" name="date_rendez_vous" id="date_rendez_vous" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="motif">Motif</label>
                <input type="text" name="motif" id="motif" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="type">Type</label>
                <input type="text" name="type" id="type" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="disponibilite_id">Disponibilité</label>
                <select name="disponibilite_id" id="disponibilite_id" class="form-control" required>
                    <option value="">Sélectionner une disponibilité</option>
                    @foreach ($disponibilites as $disponibilite)
                        <option value="{{ $disponibilite->id }}">{{ $disponibilite->date_heure }}</option>
                    @endforeach
                </select>
            </div>

            <button type="submit" class="btn btn-success">Prendre rendez-vous</button>
        </form>
    </div>
@endsection
