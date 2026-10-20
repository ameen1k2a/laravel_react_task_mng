<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProjectsController;
use App\Http\Controllers\API\TasksController;
use App\Http\Controllers\API\Auth\AuthAPIController;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('auth/login', [AuthAPIController::class, 'login']);
Route::post('auth/register', [AuthAPIController::class, 'register']);

Route::middleware('auth:api')->group(function () {
    Route::apiResource('projects', ProjectsController::class);
    Route::apiResource('tasks', TasksController::class);
});
