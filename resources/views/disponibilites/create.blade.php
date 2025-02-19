@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Ajouter une Disponibilité</h1>

        <form action="{{ route('disponibilites.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label for="date_heure">Date et Heure</label>
                <input type="datetime-local" name="date_heure" id="date_heure" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="statut">Statut</label>
                <select name="statut" id="statut" class="form-control" required>
                    <option value="disponible">Disponible</option>
                    <option value="occupé">Occupé</option>
                </select>
            </div>

            <button type="submit" class="btn btn-success mt-3">Ajouter</button>
        </form>
    </div>
@endsection
