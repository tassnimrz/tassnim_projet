@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Notifications</h1>

        <ul class="list-group">
            @foreach (auth()->user()->notifications as $notification)
                <li class="list-group-item">
                    <strong>{{ $notification->data['title'] }}</strong><br>
                    <span>{{ $notification->data['message'] }}</span>
                </li>
            @endforeach
        </ul>
    </div>
@endsection
