@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Modifier la Disponibilité</h1>

        <form action="{{ route('disponibilites.update', $disponibilite->id) }}" method="POST">
            @csrf
            @method('PUT')
            <div class="form-group">
                <label for="date_heure">Date et Heure</label>
                <input type="datetime-local" name="date_heure" id="date_heure" class="form-control" value="{{ $disponibilite->date_heure->format('Y-m-d\TH:i') }}" required>
            </div>

            <div class="form-group">
                <label for="statut">Statut</label>
                <select name="statut" id="statut" class="form-control" required>
                    <option value="disponible" {{ $disponibilite->statut == 'disponible' ? 'selected' : '' }}>Disponible</option>
                    <option value="occupé" {{ $disponibilite->statut == 'occupé' ? 'selected' : '' }}>Occupé</option>
                </select>
            </div>

            <button type="submit" class="btn btn-warning mt-3">Mettre à jour</button>
        </form>
    </div>
@endsection
