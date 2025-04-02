<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Protocoles de Sécurité</title>
    
    <!-- Style CSS intégré -->
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 1200px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            font-size: 36px;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
        }

        ul {
            list-style: none;
            padding: 0;
        }

        li {
            background-color: #ecf0f1;
            margin: 10px 0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        strong {
            font-size: 20px;
            color: #34495e;
            margin-bottom: 5px;
        }

        #error-message {
            font-size: 18px;
            margin-top: 20px;
            color: red;
            display: none;
        }
    </style>

    <!-- Inclure les scripts nécessaires -->
    <script src="{{ asset('js/app.js') }}" defer></script>
</head>
<body>
    <div class="container">
        <h1>Protocoles de sécurité</h1>

        <div id="error-message" style="color: red; display: none;">
            Erreur lors du chargement des protocoles. Veuillez réessayer plus tard.
        </div>

        <ul id="protocoles-list">
            @foreach ($protocoles as $protocole)
                <li>
                    <strong>{{ $protocole->type_protocole }}</strong> - {{ $protocole->statut }} - {{ $protocole->date_mise_en_place }}
                    <p>{{ $protocole->description }}</p>
                </li>
            @endforeach
        </ul>
    </div>

    <script>
        // Appel Ajax pour récupérer les protocoles (si tu veux charger dynamiquement)
        document.addEventListener('DOMContentLoaded', function () {
            fetchProtocoles();

            function fetchProtocoles() {
                fetch("{{ url('/api/protocoles') }}")
                    .then(response => response.json())
                    .then(data => {
                        let protocolesList = document.getElementById('protocoles-list');
                        protocolesList.innerHTML = ''; // Clear the list
                        
                        data.forEach(protocole => {
                            let li = document.createElement('li');
                            li.innerHTML = `<strong>${protocole.type_protocole}</strong> - ${protocole.statut} - ${protocole.date_mise_en_place}<p>${protocole.description}</p>`;
                            protocolesList.appendChild(li);
                        });
                    })
                    .catch(error => {
                        document.getElementById('error-message').style.display = 'block';
                    });
            }
        });
    </script>
</body>
</html>
