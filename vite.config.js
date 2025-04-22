import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';


export default defineConfig({
    plugins: [
      laravel({
        input: [
            'resources/js/app.js',
            'resources/js/medecin.jsx',
            'resources/js/secritaire.jsx'  ,
            'resources/js/admin.jsx'  ,
            'resources/js/services.jsx',
            'resources/js/reports.jsx',
            'resources/js/Profil.jsx',
            'resources/js/User.jsx',
            'resources/js/fiche-patient.jsx',
             'resources/js/fiche-index.jsx',
             'resources/js/PlanningList.jsx',
             'resources/js/PrendreRendezVous.jsx',
             'resources/js/voirrendezvous.jsx',
             'resources/js/patient_rendezvous.jsx'
        ],
        refresh: true,
    }),
    ],
    optimizeDeps: {
      include: ['leaflet']
    },
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:8000', // Proxy pour API Laravel
      },
      host: '127.0.0.1',
        
      port: 8000,
    }
    
});
