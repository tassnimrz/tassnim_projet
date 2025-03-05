<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>🩺 Modifier le Dossier Médical</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <style>
        body {
            background: url('data:image/jpeg;base64,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') no-repeat center center fixed;
            background-size: cover;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .card {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            animation: fadeIn 0.5s ease-in-out;
            padding: 2rem;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .btn-custom {
            background: linear-gradient(135deg, #007bff, #00c6ff);
            color: white;
            border: none;
            padding: 0.75rem;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            border-radius: 10px;
        }
        .btn-custom:hover {
            transform: scale(1.05);
            background: linear-gradient(135deg, #0056b3, #0084ff);
        }
        .form-control {
            border-radius: 10px;
            padding: 0.75rem;
        }
        .input-group-text {
            background: #007bff;
            color: white;
            border-radius: 10px 0 0 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <h2 class="text-center text-primary fw-bold">📝 Modifier le Dossier Médical</h2>
                    <h4 class="text-center text-secondary">👤 {{ $dossierMedical->fichePatient->nom }} {{ $dossierMedical->fichePatient->prenom }}</h4>
                    <form action="{{ route('dossier-medical.update', $dossierMedical->id) }}" method="POST" class="mt-4">
                        @csrf
                        @method('PUT')
                        
                        <div class="mb-3 input-group">
                            <span class="input-group-text">💉</span>
                            <input type="text" name="vaccins" id="vaccins" class="form-control" value="{{ old('vaccins', $dossierMedical->vaccins) }}" placeholder="Vaccins">
                        </div>
                        @error('vaccins')
                            <div class="alert alert-danger">⚠️ {{ $message }}</div>
                        @enderror
                        
                        <div class="mb-3">
                            <label for="notes_medecin" class="form-label fw-bold">🩺 Notes du Médecin</label>
                            <textarea name="notes_medecin" id="notes_medecin" class="form-control" rows="4" placeholder="Notes du médecin">{{ old('notes_medecin', $dossierMedical->notes_medecin) }}</textarea>
                        </div>
                        @error('notes_medecin')
                            <div class="alert alert-danger">⚠️ {{ $message }}</div>
                        @enderror
                        
                        <button type="submit" class="btn btn-custom w-100">💾 Mettre à jour</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
