<head>
    <!-- Ajout de Google Fonts pour Poppins -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
</head>

<div class="container">
    <h1 class="mb-4">Liste des Fiches Patients 🏥</h1>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <div class="d-flex justify-content-between mb-4">
        <a href="{{ route('fiche-patient.create') }}" class="btn btn-success">
            <i class="fas fa-plus-circle"></i> Créer une nouvelle fiche 📝
        </a>
        <input type="text" class="form-control w-25" id="searchInput" placeholder="🔍 Rechercher une fiche..." onkeyup="searchFiches()">
    </div>

    @if(isset($fichePatients) && $fichePatients->isNotEmpty())
        <table class="table table-striped table-hover mt-3">
            <thead class="thead-custom">
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Date de Naissance</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="ficheTable">
                @foreach($fichePatients as $fiche)
                <tr>
                    <td>{{ $fiche->id }}</td>
                    <td>{{ $fiche->nom }}</td>
                    <td>{{ $fiche->prenom }}</td>
                    <td>{{ $fiche->date_naissance }}</td>
                    <td>{{ $fiche->telephone }}</td>
                    <td>{{ $fiche->email }}</td>
                    <td>
                        <a href="{{ route('fiche-patient.show', $fiche->id) }}" class="btn btn-primary mx-2">
                            <i class="fas fa-eye"></i> Voir 👀
                        </a>
                        <a href="{{ route('fiche-patient.edit', $fiche->id) }}" class="btn btn-info mx-2">
                            <i class="fas fa-edit"></i> Modifier ✏️
                        </a>
                        <a href="{{ route('dossier-medical.index') }}" class="btn btn-secondary mx-2">
                            <i class="fas fa-folder"></i> Dossiers Médicaux 📁
                        </a>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>Aucune fiche patient trouvée. 😔</p>
    @endif
</div>

<script>
    function searchFiches() {
        let input = document.getElementById('searchInput').value.toLowerCase();
        let table = document.getElementById('ficheTable');
        let tr = table.getElementsByTagName('tr');

        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(function() {
            for (let i = 0; i < tr.length; i++) {
                let td = tr[i].getElementsByTagName('td');
                let found = false;
                for (let j = 0; j < td.length; j++) {
                    if (td[j] && td[j].innerHTML.toLowerCase().includes(input)) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    tr[i].style.display = '';
                } else {
                    tr[i].style.display = 'none';
                }
            }
        }, 500);  
    }
</script>

<style>
    /* Base Styles */
    body {
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(to bottom, #4f87d4, #004085); /* Dégradé bleu clair vers bleu sombre */
        color: #333;
        margin: 0;
        padding: 0;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        animation: fadeIn 1s ease;
    }

    h1 {
        color: #007bff;
        font-size: 2rem;
        font-weight: 600;
    }

    /* Table Styles */
    .table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 20px;
        animation: fadeIn 1.5s ease;
    }

    .table th, .table td {
        padding: 12px;
        text-align: left;
        font-size: 1rem;
    }

    .table-striped tbody tr:nth-of-type(odd) {
        background-color: #f9f9f9;
    }

    .table-hover tbody tr:hover {
        background-color: #e0f7ff;
        transform: scale(1.03);
        transition: all 0.3s ease;
    }

    .thead-custom {
        background-color: #007bff;
        color: white;
    }

    /* Buttons Styles */
    .btn {
        font-size: 0.9rem;
        font-weight: 600;
        border-radius: 5px;
        padding: 10px 20px;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        display: inline-flex;
        align-items: center;
    }

    .btn-primary {
        background: linear-gradient(135deg, #007bff, #0056b3);
        color: white;
    }

    .btn-primary:hover {
        background: linear-gradient(135deg, #0056b3, #00408d);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-success {
        background-color: #28a745;
        color: white;
    }

    .btn-success:hover {
        background-color: #218838;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-info {
        background-color: #17a2b8;
        color: white;
    }

    .btn-info:hover {
        background-color: #138496;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
        background-color: #6c757d;
        color: white;
    }

    .btn-secondary:hover {
        background-color: #5a6268;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    /* Input Styles */
    #searchInput {
        font-size: 1rem;
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #ccc;
        transition: border-color 0.3s ease;
    }

    #searchInput:focus {
        border-color: #007bff;
        outline: none;
    }

    /* Alert Styles */
    .alert-success {
        background-color: #e1f5fe;
        color: #0288d1;
        border: 1px solid #0288d1;
        padding: 15px;
        font-size: 1rem;
    }

    /* Animation */
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>
