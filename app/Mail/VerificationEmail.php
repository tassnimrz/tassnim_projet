<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user; // On va passer l'utilisateur à cette classe

    /**
     * Créer une nouvelle instance de la classe.
     *
     * @param \App\Models\User $user
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user; // On reçoit l'utilisateur lors de l'instanciation du Mailable
    }

    /**
     * Construire l'email.
     *
     * @return \Illuminate\Mail\Mailable
     */
    public function build()
    {
        return $this->subject('Vérification de votre compte') // Sujet de l'email
                    ->html(
                        '<html>
                            <body>
                                <h1>Bienvenue sur notre plateforme</h1>
                                <p>Pour vérifier votre compte, utilisez le code suivant :</p>
                                <h2>' . $this->user->verification_code . '</h2>
                            </body>
                        </html>'
                    );
    }
}








   /**  {
       * return $this->view('verification')
                 *   ->subject('Vérification de votre compte') // Sujet de l'email
                 *   ->with([
                      *  'verification_code' => $this->user->verification_code, // Passer le code à la vue
                 *   ]);
   * }
*}*/