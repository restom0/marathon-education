<?php

use App\Http\Controllers\BillsController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\ProcessController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::prefix('schedule')->controller(ScheduleController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/id', 'search');
    Route::post('/', 'store');
    Route::delete('/', 'destroy');
    Route::put('/', 'update');
});
Route::prefix('bills')->controller(BillsController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/id', 'search');
    Route::post('/', 'store');
    Route::post('/class', 'createClass');
});
Route::prefix('courses')->controller(BillsController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/admin', 'getAdminCourses');
    Route::get('/active-course', 'getActiveCourses');
    Route::get('/course-price', 'getCoursePrice');
    Route::post('/price', 'addPrice');
    Route::delete('/duration', 'deleteDuration');
    Route::patch('/cate', 'switchCate');
    Route::put('/active-cate', 'activeCate');
    Route::put('/cate', 'editCourseCate');
    Route::delete('/cate', 'deleteCate');
    Route::post('/cate', 'createCourseCate');
});
Route::controller(UserController::class)->group(function () {
    Route::post('/checkLogin', 'checkLogin');
    Route::get('/checkLoginEmail', 'checkLoginEmail');
});
Route::prefix('process')->controller(ProcessController::class)->group(function () {
    Route::get('/teacher', 'teacherSchedule');
    Route::get('/student', 'studentSchedule');
    Route::post('/taught', 'taught');
    Route::get('/', 'index');
    Route::get('/class', 'searchClass');
    Route::get('/students', 'getStudents');
    Route::post('/student', 'addStudent');
    Route::delete('/student', 'removeStudent');
    Route::delete('/class', 'removeClass');
    Route::put('/pass', 'editPass');
});
Route::prefix('education')->middleware('checkLogin1')->controller(EducationController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'create');
    Route::put('/', 'edit');
    Route::delete('/', 'delete');
    Route::put('/status', 'switch');
});
Route::middleware('checkLogin1')->controller(CourseController::class)->group(function () {
    Route::get('/course', 'index');
    Route::get('/course/{id}', 'getCourse');
    Route::post('/course', 'create');
    Route::post('/editCourse', 'edit');
    Route::post('/deleteCourse', 'delete');
});
Route::controller(EducationController::class)->group(function () {
    Route::post('/education', 'store');
});
