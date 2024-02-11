<?php

namespace App\Http\Controllers;

use App\Models\BillsM;
use App\Models\CourseM;
use App\Models\ProcessDetailM;
use App\Models\processM;
use App\Models\StudentM;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BillsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function createClass(Request $request)
    {
        $Validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:student_tbl,id',
            'courseName' => 'required|exists:course,name',
            'teacher_id' => 'required|exists:users_tbl,id',
            'schedule' => 'required',
            'idCourse' => 'required|exists:course,id',
            'duration' => 'required|numeric',
            'bill_id' => 'required',
            'email' => 'required|exists:student_tbl,email',
        ], [
            'student_id.required' => 'Missing student_id',
            'student_id.exists' => "Student doesn't have an account yet",
            'courseName.required' => "Missing course name",
            'courseName.exists' => "Course doesn't exist",
            'teacher_id.required' => "Missing teacher id",
            'teacher_id.exists' => "Teacher doesn't exists",
            'schedule.required' => 'Pick a schedule',
            'idCourse.required' => 'Missing idCourse',
            'idCourse.exists' => "Course doesn't exist",
            'duration.required' => "Missing duration",
            'duration.numeric' => "Duration has to be a number",
            'bill_id.required' => "Missing bill_id",
            'email.required' => 'Missing email',
            'email.exists' => "Student email doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $checkExist = processM::where('idCourse', $request->idCourse)
            ->where('schedule', $request->schedule)
            ->value('id');

        if (!$checkExist) {
            $class_id = processM::create([
                'name' => $request->courseName, 'teacher_id' => $request->teacher_id,
                'idCourse' => $request->idCourse, 'schedule' => $request->schedule,
                'duration' => $request->duration
            ])->id;
        } else {
            $class_id = $checkExist;
        }
        $checkStudentClass = ProcessDetailM::where('student_id', $request->student_id)->where('process_id', $class_id)->get();
        if (count($checkStudentClass) == 0) {
            // echo('create new');
            ProcessDetailM::create(['process_id' => $class_id, 'student_id' => $request->student_id]);
            BillsM::where('id', $request->bill_id)->update(['status' => 1, 'updated_at' => now()]);
            $process = processM::where('id', $class_id)->first();
            $course = CourseM::where('id', $request->idCourse)->first();
            $teacher = User::where('id', $request->teacher_id)->first();
            $student = StudentM::where('email', $request->email)->first();
        } else {
            // echo('already in class');
            return response()->json(['check' => false, 'msg' => 'This student is already in this class']);
        }
        return response()->json(['check' => true]);
    }
    public function getBills()
    {
        $bill = DB::Table('bill_tbl')
            ->join('class_schedule', 'bill_tbl.idSchedule', 'class_schedule.id')
            ->join('course', 'class_schedule.idCourse', 'course.id')
            ->join('student_tbl', 'bill_tbl.email', 'student_tbl.email')
            ->select(
                'bill_tbl.*',
                'bill_tbl.id AS bill_id',
                'bill_tbl.name AS student_name',
                'bill_tbl.status AS bill_status',
                'class_schedule.*',
                'class_schedule.id AS idSchedule',
                'course.*',
                'course.id AS idCourse',
                'course.name AS course_name',
                'student_tbl.id AS student_id'
            )->get();
        return $bill;
    }
    public function index()
    {
        //
        return response()->json($this->getBills());
    }
    public function search(Request $request, StudentM $student)
    {
        $name = $request->name;
        $bill = DB::Table('bill_tbl')
            ->join('class_schedule', 'bill_tbl.idSchedule', 'class_schedule.id')
            ->join('course', 'class_schedule.idCourse', 'course.id')
            ->join('student_tbl', 'bill_tbl.email', 'student_tbl.email')
            ->where('student_tbl.name', 'LIKE', "%$name%")
            ->select(
                'bill_tbl.*',
                'bill_tbl.id AS bill_id',
                'bill_tbl.name AS student_name',
                'bill_tbl.status AS bill_status',
                'class_schedule.*',
                'class_schedule.id AS idSchedule',
                'course.*',
                'course.id AS idCourse',
                'course.name AS course_name',
                'student_tbl.id AS student_id'
            )
            ->get();
        return response()->json($bill);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:student_tbl,email',
            'teacher' => 'required|exists:users_tbl,name',
            'schedule' => 'required',
            'idSchedule' => 'required',
        ], [
            'email.required' => 'Missing email',
            'email.email' => 'Needs to be an email',
            'email.exists' => "You don't have an account yet",
            'teacher.required' => "Missing teacher",
            'teacher.exists' => "Teacher doesn't exists",
            'schedule.required' => 'Pick a schedule',
            'idSchedule.required' => 'Missing idSchedule',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        $student = StudentM::where('email', $request->email)->first();
        if ($student) {
            if (BillsM::where('email', $request->email)
                ->where('idSchedule', $request->idSchedule)
                ->where('schedule', $request->schedule)
                ->first()
            ) {
                return response()->json(['check' => false, 'msg' => 'You already sign up for this class']);
            } else {
                $bill = BillsM::create([
                    'name' => $student->name, 'email' => $request->email,
                    'phone' => $student->phone, 'idSchedule' => $request->idSchedule,
                    'schedule' => $request->schedule, 'created_at' => now()
                ]);
                return response()->json(['check' => true, $bill]);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BillsM $billsM)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BillsM $billsM)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BillsM $billsM)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BillsM $billsM)
    {
        //
    }
}