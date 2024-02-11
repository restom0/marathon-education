<?php

use App\Http\Controllers\GoogleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
use App\Http\Middleware\checkLogin;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('users.login');
});
Route::post('/user', [UserController::class, 'create']);
Route::middleware('checkLogin')->controller(UserController::class)->group(function () {

    Route::get('/users', 'index');
    Route::post('/deleteUser', 'delete');
    Route::post('/editUserRole', 'editUserRole');
    Route::post('/switchUser', 'switch');
});
Route::middleware('checkLogin')->controller(UserRoleController::class)->group(function () {
    Route::get('/roles', 'index');
    Route::post('/role', 'create');
    Route::post('/editRole', 'edit');
    Route::post('/deleteRole', 'delete');
    Route::post('/switchRole', 'switch');
});
// Route::get('/roles', [UserRoleController::class, 'index']);
// Route::get('/roles/{i}', [UserRoleController::class, 'detail']);
Route::post('/checkLogin', [UserController::class, 'checkLogin']);
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google_auth');
Route::any('/auth/google/callback', [GoogleController::class, 'callBack']);
