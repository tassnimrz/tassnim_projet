@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Mes Rendez-vous</h1>

        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        @if (session('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
            </div>
        @endif

        <table class="table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Motif</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rendezvous as $rendezVous)
                    <tr>
                        <td>{{ $rendezVous->date_rendez_vous }}</td>
                        <td>{{ $rendezVous->motif }}</td>
                        <td>{{ $rendezVous->statut }}</td>
                        <td>
                            <a href="{{ route('rendezvous.show', $rendezVous->id) }}" class="btn btn-info">Détails</a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <a href="{{ route('rendezvous.create') }}" class="btn btn-primary">Prendre un nouveau rendez-vous</a>
    </div>
@endsection
