<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📁 Dossier Médical</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <style>
        body {
            background: linear-gradient(to right, #2C3E50, #4CA1AF);
            color: white;
            font-family: 'Poppins', sans-serif;
            text-align: center;
        }
        .container {
            max-width: 800px;
            margin-top: 50px;
            padding: 30px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            animation: fadeIn 1s ease-in-out;
        }
        .card {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            animation: slideIn 1s ease-in-out;
        }
        .btn-custom {
            transition: 0.3s;
        }
        .btn-custom:hover {
            transform: scale(1.1);
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="mb-4">📂 Dossier Médical de {{ $dossierMedical->fichePatient->nom }} {{ $dossierMedical->fichePatient->prenom }}</h1>
        
        @if (session('success'))
            <div class="alert alert-success">✅ {{ session('success') }}</div>
        @endif
        @if (session('error'))
            <div class="alert alert-danger">⚠️ {{ session('error') }}</div>
        @endif

        <div class="card">
            <div class="card-header bg-info text-white">ℹ️ Informations du Dossier Médical</div>
            <div class="card-body">
                <ul class="list-group list-group-flush text-start">
                    <li class="list-group-item bg-transparent text-white">🧑‍⚕️ <strong>Nom :</strong> {{ $dossierMedical->fichePatient->nom }}</li>
                    <li class="list-group-item bg-transparent text-white">📝 <strong>Prénom :</strong> {{ $dossierMedical->fichePatient->prenom }}</li>
                    <li class="list-group-item bg-transparent text-white">💉 <strong>Vaccins :</strong> {{ $dossierMedical->vaccins ?: 'Non renseigné' }}</li>
                    <li class="list-group-item bg-transparent text-white">🗒️ <strong>Notes :</strong> {{ $dossierMedical->notes_medecin ?: 'Aucune note disponible' }}</li>
                    <li class="list-group-item bg-transparent text-white">📅 <strong>Création :</strong> {{ $dossierMedical->created_at->format('d/m/Y') }}</li>
                    <li class="list-group-item bg-transparent text-white">⏳ <strong>Mise à Jour :</strong> {{ $dossierMedical->updated_at->format('d/m/Y') }}</li>
                </ul>
            </div>
        </div>

        <div class="mt-4 d-flex flex-wrap gap-3 justify-content-center">
            <a href="{{ route('dossier-medical.index') }}" class="btn btn-secondary btn-custom">🔙 Retour</a>
            <a href="{{ route('dossier-medical.edit', $dossierMedical->id) }}" class="btn btn-warning btn-custom">✏️ Modifier</a>
            <a href="{{ route('fiche-patient.show', $dossierMedical->fichePatient->id) }}" class="btn btn-primary btn-custom">📜 Voir la fiche</a>
            <form action="{{ route('dossier-medical.destroy', $dossierMedical->id) }}" method="POST" style="display:inline;">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-danger btn-custom" onclick="return confirm('Êtes-vous sûr de vouloir supprimer ce dossier médical ?')">🗑️ Supprimer</button>
            </form>
        </div>
    </div>
</body>
</html>
