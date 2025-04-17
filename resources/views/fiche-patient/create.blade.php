<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test React</title>
   

    @viteReactRefresh
    @vite('resources/js/fiche-patient.jsx')
</head>
<body>
    <div id="app"></div>
    <meta name="csrf-token" content="{{ csrf_token() }}">

</body>
</html>
