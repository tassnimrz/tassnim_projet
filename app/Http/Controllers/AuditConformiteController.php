<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuditConformiteController extends Controller
{
    public function index()
{
    $audits = AuditConformite::all();
    return response()->json($audits);
}

public function store(Request $request)
{
    $audit = AuditConformite::create($request->all());
    return response()->json($audit, 201);
}

}
