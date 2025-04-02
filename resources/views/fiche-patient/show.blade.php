@extends('layouts.app') 

@section('content')
    <div id="patient-details"
         data-nom="{{ $fichePatient->nom }}"
         data-prenom="{{ $fichePatient->prenom }}"
         data-date_naissance="{{ $fichePatient->date_naissance }}"
         data-sexe="{{ $fichePatient->sexe }}"
         data-etat_civil="{{ $fichePatient->etat_civil }}"
         data-telephone="{{ $fichePatient->telephone }}"
         data-email="{{ $fichePatient->email }}"
         data-adresse="{{ $fichePatient->adresse }}"
         data-ville="{{ $fichePatient->ville }}"
         data-code_postal="{{ $fichePatient->code_postal }}"
         data-groupe_sanguin="{{ $fichePatient->groupe_sanguin }}"
         data-allergies="{{ $fichePatient->allergies }}"
         data-antecedents_medicaux="{{ $fichePatient->antecedents_medicaux }}"
         data-traitement_en_cours="{{ $fichePatient->traitement_en_cours }}"
         data-assurance_medicale="{{ $fichePatient->assurance_medicale }}"
         data-numero_assurance="{{ $fichePatient->numero_assurance }}"
         data-date_premiere_visite="{{ $fichePatient->date_premiere_visite }}"
         data-id="{{ $fichePatient->id }}"
         data-csrf_token="{{ csrf_token() }}">
    </div>

    <script src="{{ asset('js/show.jsx') }}"></script>
@endsection
