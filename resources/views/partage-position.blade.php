<!-- resources/views/partage-position.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Partage de position</title>
</head>
<body>
    <h1>Partagez votre position</h1>
    <input type="text" id="phone" placeholder="Votre numéro (ex: 21612345678)">
    <button onclick="startSharing()">Partager</button>

    <script>
        function startSharing() {
            const phone = document.getElementById('phone').value;
            if (!phone) return alert("Entrez votre numéro !");

            // Envoi périodique de la position
            setInterval(() => {
                navigator.geolocation.getCurrentPosition(pos => {
                    fetch('/api/position', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            phone: phone,
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        })
                    });
                });
            }, 10000); // Toutes les 10 secondes
        }
    </script>
</body>
</html>