import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
      laravel({
        input: [
            'resources/js/app.js',
            'resources/js/medecin.jsx',
            'resources/js/secritaire.jsx'  ,
            'resources/js/showDossierMedical.jsx'  ,
        ],
        refresh: true,
    }),
    ],
    server: {
        host: '127.0.0.1',
        port: 5173,
    }
});
