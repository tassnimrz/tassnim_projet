<!-- resources/views/pdf/fiche-patient.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Fiche Patient {{ $fiche->id }}</title>
    <style>
        .section { margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
        .label { font-weight: bold; color: #333; margin-bottom: 5px; }
        .value { color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        td { padding: 8px; vertical-align: top; }
    </style>
</head>
<body>
    <h1 style="text-align: center; color: #2c3e50;">Fiche Patient #{{ $fiche->id }}</h1>

    <div class="section">
        <h2>Informations Personnelles</h2>
        <table>
            <tr><td class="label">Nom:</td><td class="value">{{ $fiche->nom }}</td></tr>
            <tr><td class="label">Prénom:</td><td class="value">{{ $fiche->prenom }}</td></tr>
            <tr><td class="label">Date de naissance:</td><td class="value">{{ $fiche->date_naissance->format('d/m/Y') }}</td></tr>
            <tr><td class="label">Sexe:</td><td class="value">{{ $fiche->sexe }}</td></tr>
            <tr><td class="label">État civil:</td><td class="value">{{ $fiche->etat_civil }}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Coordonnées</h2>
        <table>
            <tr><td class="label">Téléphone:</td><td class="value">{{ $fiche->telephone }}</td></tr>
            <tr><td class="label">Email:</td><td class="value">{{ $fiche->email ?? 'N/A' }}</td></tr>
            <tr><td class="label">Adresse:</td><td class="value">{{ $fiche->adresse }}</td></tr>
            <tr><td class="label">Ville:</td><td class="value">{{ $fiche->ville }} ({{ $fiche->code_postal }})</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Informations Médicales</h2>
        <table>
            <tr><td class="label">Groupe sanguin:</td><td class="value">{{ $fiche->groupe_sanguin ?? 'Non renseigné' }}</td></tr>
            <tr><td class="label">Allergies:</td><td class="value">{{ $fiche->allergies ?? 'Aucune connue' }}</td></tr>
            <tr><td class="label">Antécédents:</td><td class="value">{{ $fiche->antecedents_medicaux ?? 'Aucun' }}</td></tr>
            <tr><td class="label">Traitements en cours:</td><td class="value">{{ $fiche->traitement_en_cours ?? 'Aucun' }}</td></tr>
        </table>
    </div>

    @if($fiche->dossierMedical)
    <div class="section">
        <h2>Dossier Médical</h2>
        <table>
            <tr><td class="label">Vaccins:</td><td class="value">{{ $fiche->dossierMedical->vaccins ?? 'Non renseigné' }}</td></tr>
            <tr><td class="label">Notes du médecin:</td><td class="value">{{ $fiche->dossierMedical->notes_medecin ?? 'Aucune note' }}</td></tr>
        </table>
    </div>
    @endif
</body>
</html>