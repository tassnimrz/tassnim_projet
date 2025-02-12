<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function index(){
        $user=[];

        return view('auth.login',compact('user'));
    }
}
