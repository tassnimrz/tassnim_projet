// webpack.mix.js
const mix = require('laravel-mix');

mix.react('resources/js/app.js', 'public/js') // Compile ton fichier React
   .sass('resources/sass/app.scss', 'public/css'); // Si tu utilises du CSS avec SASS
