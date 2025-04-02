<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🩺 Consultation Médicale</title>
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
        <h1 class="mb-4">🩺 Détails de la Consultation</h1>

        <div class="card">
            <div class="card-header bg-info text-white">ℹ️ Informations de la Consultation</div>
            <div class="card-body">
                <ul class="list-group list-group-flush text-start">
                    <li class="list-group-item bg-transparent text-white">📅 <strong>Date :</strong> {{ $consultation->date_consultation }}</li>
                    <li class="list-group-item bg-transparent text-white">💬 <strong>Motif :</strong> {{ $consultation->motif }}</li>
                    <li class="list-group-item bg-transparent text-white">🩻 <strong>Diagnostic :</strong> {{ $consultation->diagnostic }}</li>
                    <li class="list-group-item bg-transparent text-white">💊 <strong>Traitement :</strong> {{ $consultation->traitement }}</li>
                    <li class="list-group-item bg-transparent text-white">📝 <strong>Observations :</strong> {{ $consultation->observations }}</li>
                    <li class="list-group-item bg-transparent text-white">⚙️ <strong>Statut :</strong> {{ $consultation->statut }}</li>
                </ul>
            </div>
        </div>

        <div class="mt-4 d-flex flex-wrap gap-3 justify-content-center">
            <a href="{{ route('consultations.index') }}" class="btn btn-secondary btn-custom">🔙 Retour</a>
        </div>
    </div>
</body>
</html>
