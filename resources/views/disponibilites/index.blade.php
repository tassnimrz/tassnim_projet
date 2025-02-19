@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Mes Disponibilités</h1>

        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <a href="{{ route('disponibilites.create') }}" class="btn btn-primary">Ajouter une disponibilité</a>

        <table class="table mt-3">
            <thead>
                <tr>
                    <th>Date et Heure</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($disponibilites as $disponibilite)
                    <tr>
                        <td>{{ $disponibilite->date_heure }}</td>
                        <td>{{ $disponibilite->statut }}</td>
                        <td>
                            <a href="{{ route('disponibilites.edit', $disponibilite->id) }}" class="btn btn-warning">Modifier</a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
