<?php
namespace App\Http\Controllers\Auth;
use App\Models\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetCodeMail;


class ForgotPasswordController extends Controller
{
    public function showLinkRequestForm()
    {
        return view('auth.passwords.email');
    }

    public function sendResetLinkEmail(Request $request)
    {

        $request->validate(['email' => 'required|email']);


        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'Aucun utilisateur trouvé avec cet email.']);
        }


        $resetCode = Str::random(6);


        $user->update(['verification_code' => $resetCode]);

       
        Mail::to($user->email)->send(new PasswordResetCodeMail($resetCode));

        return redirect()->route('password.reset', ['email' => $user->email])
                     ->with('status', 'Un code a été envoyé à votre email.');
}}