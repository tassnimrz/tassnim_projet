<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Planning des Médecins</title>
    @viteReactRefresh
    @vite('resources/js/PlanningList.jsx') <!-- Fichier JS de React -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Planning des Médecins</h1>
        <!-- C'est ici que le contenu React va être inséré -->
        <div id="planning-root"></div>
    </div>
</body>
</html>
