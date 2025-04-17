<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modification Fiche Patient</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body class="bg-light">

<div class="container mt-5">
    <div class="card shadow-lg">
        <!-- Corps du formulaire -->
        <div class="card-body">
            <!-- Affichage des erreurs -->
            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('fiche-patient.update', $fichePatient->id) }}" method="POST">
                @csrf
                @method('PUT')

                <!-- Section Informations Personnelles -->
                <div class="section-medicale mb-5 p-4 rounded-3">
                    <h4 class="text-primary mb-4 border-bottom pb-2">
                        <i class="fas fa-user-injured me-2"></i>Informations Personnelles
                    </h4>

                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-bold">Nom <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-primary text-white"><i class="fas fa-user"></i></span>
                                <input type="text" class="form-control" name="nom" value="{{ $fichePatient->nom }}" required>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-bold">Prénom <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-primary text-white"><i class="fas fa-user-tag"></i></span>
                                <input type="text" class="form-control" name="prenom" value="{{ $fichePatient->prenom }}" required>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-secondary fw-bold">Naissance <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-primary text-white"><i class="fas fa-baby"></i></span>
                                <input type="date" class="form-control" name="date_naissance" value="{{ $fichePatient->date_naissance }}" required>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-secondary fw-bold">Sexe <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-primary text-white"><i class="fas fa-venus-mars"></i></span>
                                <select name="sexe" class="form-select" required>
                                    <option value="Masculin" {{ $fichePatient->sexe == 'Masculin' ? 'selected' : '' }}>Masculin</option>
                                    <option value="Féminin" {{ $fichePatient->sexe == 'Féminin' ? 'selected' : '' }}>Féminin</option>
                                    <option value="Autre" {{ $fichePatient->sexe == 'Autre' ? 'selected' : '' }}>Autre</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-secondary fw-bold">État Civil <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-primary text-white"><i class="fas fa-heart"></i></span>
                                <select name="etat_civil" class="form-select" required>
                                    <option value="Célibataire" {{ $fichePatient->etat_civil == 'Célibataire' ? 'selected' : '' }}>Célibataire</option>
                                    <option value="Marié" {{ $fichePatient->etat_civil == 'Marié' ? 'selected' : '' }}>Marié</option>
                                    <option value="Divorcé" {{ $fichePatient->etat_civil == 'Divorcé' ? 'selected' : '' }}>Divorcé</option>
                                    <option value="Veuf" {{ $fichePatient->etat_civil == 'Veuf' ? 'selected' : '' }}>Veuf</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Coordonnées -->
                <div class="section-medicale mb-5 p-4 rounded-3 bg-light">
                    <h4 class="text-info mb-4 border-bottom pb-2">
                        <i class="fas fa-address-book me-2"></i>Coordonnées
                    </h4>

                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-bold">Téléphone <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-info text-white"><i class="fas fa-phone"></i></span>
                                <input type="text" class="form-control" name="telephone" value="{{ $fichePatient->telephone }}" required>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-bold">Email <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text bg-info text-white"><i class="fas fa-envelope"></i></span>
                                <input type="email" class="form-control" name="email" value="{{ $fichePatient->email }}" required>
                            </div>
                        </div>

                        <div class="col-12">
                            <label class="form-label text-secondary fw-bold">Adresse</label>
                            <div class="input-group">
                                <span class="input-group-text bg-info text-white"><i class="fas fa-map-marker-alt"></i></span>
                                <input type="text" class="form-control" name="adresse" value="{{ $fichePatient->adresse }}">
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-secondary fw-bold">Code Postal</label>
                            <div class="input-group">
                                <span class="input-group-text bg-info text-white"><i class="fas fa-mail-bulk"></i></span>
                                <input type="text" class="form-control" name="code_postal" value="{{ $fichePatient->code_postal }}">
                            </div>
                        </div>

                        <div class="col-md-8">
                            <label class="form-label text-secondary fw-bold">Ville</label>
                            <div class="input-group">
                                <span class="input-group-text bg-info text-white"><i class="fas fa-city"></i></span>
                                <input type="text" class="form-control" name="ville" value="{{ $fichePatient->ville }}">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Médicale -->
                <div class="section-medicale mb-5 p-4 rounded-3 bg-white">
                    <h4 class="text-danger mb-4 border-bottom pb-2">
                        <i class="fas fa-file-medical me-2"></i>Informations Médicales
                    </h4>

                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-bold">Groupe Sanguin</label>
                            <div class="input-group">
                                <span class="input-group-text bg-danger text-white"><i class="fas fa-tint"></i></span>
                                <input type="text" class="form-control" name="groupe_sanguin" value="{{ $fichePatient->groupe_sanguin }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-bold">Première Visite</label>
                            <div class="input-group">
                                <span class="input-group-text bg-danger text-white"><i class="fas fa-calendar-check"></i></span>
                                <input type="date" class="form-control" name="date_premiere_visite" value="{{ $fichePatient->date_premiere_visite }}">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Boutons -->
                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                    <button type="submit" class="btn btn-lg btn-success">
                        <i class="fas fa-save me-2"></i>Enregistrer
                    </button>
                    <a href="{{ route('fiche-patients.show', $fichePatient->id) }}" class="btn btn-lg btn-outline-secondary">
                        <i class="fas fa-times me-2"></i>Annuler
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

<style>
    .section-medicale {
        border-left: 4px solid;
        transition: transform 0.2s;
    }
    
    .section-medicale:hover {
        transform: translateX(5px);
    }
    
    .input-group-text {
        min-width: 45px;
        justify-content: center;
    }
    
    .form-control:focus {
        border-color: #86b7fe;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }
</style>

</body>
</html>
