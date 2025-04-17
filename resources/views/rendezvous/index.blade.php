<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prendre un rendez-vous</title>

    <!-- Vite pour React -->
    @viteReactRefresh
    @vite('resources/js/PrendreRendezVous.jsx')
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    @php
        $patient = Auth::user(); // Le patient connecté via session Laravel
    @endphp

    <!-- Point de montage React avec les données du patient -->
    <div id="root" data-patient='@json($patient)'>
    </div>
</body>
</html>
