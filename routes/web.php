<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\UserController;
// routes/web.php

use App\Http\Controllers\Auth\RegisteredUserController;




Route::get('/', [AuthController::class, 'index']);
Route::post('/login', [AuthController::class, 'handleLogin'])->name('login');


Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');


Route::post('register', [RegisteredUserController::class, 'store']);
Route::get('/', function () {
    return view('auth.register');
});
