<h1>la page principal pour le creation de compte ou se authentifier</h1>
<pre>





    pour se connecter
</pre>
<a href="{{ route('login') }}" class="list-group-item list-group-item-action">Se connecter</a>
<pre>





    pour la creation de compte
</pre>
<a href="{{ route('register') }}" class="list-group-item list-group-item-action">S'inscrire</a>

<h1>Gestion des Consultations et Ordonnances</h1>

        <h2>Consultations</h2>
        <ul>
            <li><a href="{{ route('consultations.index') }}">Afficher toutes les consultations</a></li>
            <li><a href="{{ route('consultations.create') }}">Créer une consultation</a></li>
            <li><a href="{{ route('consultations.show', ['consultation' => 1]) }}">Afficher une consultation (ID=1)</a></li>
            <li><a href="{{ route('consultations.edit', ['consultation' => 1]) }}">Modifier une consultation (ID=1)</a></li>
            <li><a href="{{ route('consultations.destroy', ['consultation' => 1]) }}" onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')">Supprimer une consultation (ID=1)</a></li>
        </ul>

        <h2>Ordonnances</h2>
        <ul>
            <li><a href="{{ route('ordonnances.index') }}">Afficher toutes les ordonnances</a></li>
            <li><a href="{{ route('ordonnances.create') }}">Créer une ordonnance</a></li>
            <li><a href="{{ route('ordonnances.show', ['ordonnance' => 1]) }}">Afficher une ordonnance (ID=1)</a></li>
            <li><a href="{{ route('ordonnances.edit', ['ordonnance' => 1]) }}">Modifier une ordonnance (ID=1)</a></li>
            <li><a href="{{ route('ordonnances.destroy', ['ordonnance' => 1]) }}" onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette ordonnance ?')">Supprimer une ordonnance (ID=1)</a></li>
        </ul>
    </div>
    <div class="container">
        <h1>Gestion des Certificats et Lettres Médicales</h1>

        <div class="row">
            <!-- Liens vers la gestion des certificats -->
            <div class="col-md-6">
                <h3>Certificats</h3>
                <ul>
                    <li><a href="{{ url('/certificats') }}">Liste des Certificats</a></li>
                    <li><a href="{{ url('/certificats/create') }}">Créer un Certificat</a></li>
                </ul>
            </div>

            <!-- Liens vers la gestion des lettres médicales -->
            <div class="col-md-6">
                <h3>Lettres Médicales</h3>
                <ul>
                    <li><a href="{{ url('/lettres') }}">Liste des Lettres Médicales</a></li>
                    <li><a href="{{ url('/lettres/create') }}">Créer une Lettre Médicale</a></li>
                </ul>
            </div>
        </div>
    </div>
