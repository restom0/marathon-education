<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
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
    return view('welcome');
});
// Route::get('/roles', [UserRoleController::class, 'index']);
// Route::get('/roles/{i}', [UserRoleController::class, 'detail']);
Route::controller(UserRoleController::class)->group(function () {
    Route::get('/roles', 'index');
    Route::post('/role', 'create');
    Route::post('/editRole', 'edit');
    Route::post('/deleteRole', 'delete');
    Route::post('/switchRole', 'switch');
});
Route::controller(UserController::class)->group(function () {
    Route::get('/users', 'index');
    Route::post('/user', 'create');
    Route::post('/deleteUser', 'delete');
    Route::post('/editUserRole', 'editUserRole');
    Route::post('/switchUser', 'switch');
});
