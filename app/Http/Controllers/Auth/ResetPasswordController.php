<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ResetPasswordController extends Controller
{
    public function showResetForm(Request $request)
    {
        return view('auth.passwords.reset',['email' => $request->email]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'verification_code' => 'required|size:6', 
            'password' => 'required|confirmed',
        ]);


        $user = User::where('email', $request->email)->first();

        if ($user && $user->verification_code === $request->verification_code) {
            // Réinitialiser le mot de passe
            $user->update([
                'password' => bcrypt($request->password),
                'verification_code' => null,
            ]);

            return redirect()->route('login')->with('status', 'Votre mot de passe a été réinitialisé avec succès.');
        }

        return back()->withErrors(['verification_code' => 'Code invalide ou expiré.']);
    }

}