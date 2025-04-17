<?php 
namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetCodeMail extends Mailable
{
    use SerializesModels;

    public $resetCode;

    public function __construct($resetCode)
    {
        $this->resetCode = $resetCode;
    }

    public function build()
    {
        return $this->subject('Votre code de réinitialisation de mot de passe')
                    ->html(
                        '<h2>Réinitialisation de votre mot de passe</h2>' .
                        '<p>Bonjour,</p>' .
                        '<p>Voici votre code de réinitialisation :</p>' .
                        '<h3>' . $this->resetCode . '</h3>' .
                        '<p>Si vous n\'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>'
                    );
    }
}