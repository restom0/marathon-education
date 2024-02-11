<?php

namespace App\Http\Controllers;

use App\Models\ProcessDetailM;
use App\Models\processM;
use App\Models\scheduleM;
use App\Models\StudentM;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProcessController extends Controller
{
    public function getProcess()
    {
        $process = DB::Table('proccess_tbl')
            ->join('users', 'proccess_tbl.idTeacher', 'users.id')
            ->join('proccess_detail', 'proccess_tbl.id', 'proccess_detail.idProcess')
            ->groupBy('proccess_tbl.id')
            ->select('proccess_tbl.*', 'proccess_tbl.name AS className', 'users.name AS teacher', DB::raw('count(proccess_detail.idStudent) as student_count'))->get();
        return $process;
    }
    public function teacherSchedule(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Missing email',
            'email.email' => 'Needs to be an email',
            'email.exists' => "You don't have an account yet"
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $idTeacher = User::where('email', $request->email)->select('id')->first();
        $process = $this->getProcess();

        return response()->json($process);
    }

    public function studentSchedule(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:student_tbl,email',
        ], [
            'email.required' => 'Missing email',
            'email.email' => 'Needs to be an email',
            'email.exists' => "You don't have an account yet"
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $idStudent = StudentM::where('email', $request->email)->value('id');

        $process = DB::Table('proccess_detail')
            ->join('proccess_tbl', 'proccess_detail.idProcess', 'proccess_tbl.id')
            ->join('student_tbl', 'proccess_detail.idStudent', 'student_tbl.id')
            ->join('users', 'proccess_tbl.idTeacher', 'users.id')
            ->where('student_tbl.id', $idStudent)
            ->select(
                'proccess_tbl.name AS className',
                'users.name AS teacherName',
                'proccess_tbl.schedule AS schedule',
                'proccess_tbl.duration AS duration',
                'proccess_tbl.pass AS pass'
            )
            ->get();
        return response()->json($process);
    }

    public function taught(Request $request, User $user, scheduleM $schedule)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'course_id' => 'required|exists:proccess_tbl,course_id',
            'schedule' => 'required|exists:proccess_tbl,schedule',
        ], [
            'email.required' => 'Missing email',
            'email.email' => 'Needs to be an email',
            'email.exists' => "You don't have an account yet",
            'course_id.required' => 'Missing course_id',
            'course_id.exists' => "Course don't exist",
            'schedule.required' => 'Missing schedule',
            'schedule.exists' => "Schedule don't exist or has been changed",
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $idTeacher = User::where('email', $request->email)->value('id');
        $plus = processM::where('idTeacher', $idTeacher)
            ->where('course_id', $request->course_id)
            ->where('schedule', $request->schedule)
            ->value('pass');
        processM::where('idTeacher', $idTeacher)
            ->where('course_id', $request->course_id)
            ->where('schedule', $request->schedule)
            ->update(['pass' => $plus + 1]);
        return response()->json(['check' => true]);
    }



    public function searchClass(Request $request)
    {
        $searchTerm = $request->input('search');
        $process = DB::Table('proccess_tbl')
            ->join('users', 'proccess_tbl.idTeacher', 'users.id')
            ->join('proccess_detail', 'proccess_tbl.id', 'proccess_detail.idProcess')
            ->groupBy('proccess_tbl.id')
            ->where('proccess_tbl.name', 'LIKE', "%$searchTerm%")
            ->select('proccess_tbl.*', 'proccess_tbl.name AS className', 'users.name AS teacher', DB::raw('count(proccess_detail.idStudent) as student_count'))
            ->orderBy('className')
            ->paginate(5);
        return response()->json($process);
    }

    public function getStudents(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:proccess_tbl,id',
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "Process don't exist",
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        $student = DB::Table('student_tbl')
            ->join('proccess_detail', 'student_tbl.id', 'proccess_detail.idStudent')
            ->where('proccess_detail.idProcess', $request->id)
            ->select('student_tbl.*')
            ->get();
        return response()->json($student);
    }

    public function addStudent(Request $request, StudentM $student)
    {
        $validator = Validator::make($request->all(), [
            'idProcess' => 'required|exists:proccess_tbl,id',
            'idStudent' => 'required|exists:student_tbl,id',
        ], [
            'idProcess.required' => 'Missing idProcess',
            'idProcess.exists' => "Process don't exist",
            'idStudent.required' => 'Missing idStudent',
            'idStudent.exists' => "Student don't exist",
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $check = ProcessDetailM::where('idProcess', $request->idProcess)->where('idStudent', $request->idStudent)->first();
        if ($check) {
            return response()->json(['check' => false, 'msg' => 'Student is already in this class']);
        } else {
            ProcessDetailM::create(['idProcess' => $request->idProcess, 'idStudent' => $request->idStudent]);
            $student = DB::Table('student_tbl')
                ->join('proccess_detail', 'student_tbl.id', 'proccess_detail.idStudent')
                ->where('proccess_detail.idProcess', $request->idProcess)
                ->select('student_tbl.*')
                ->get();
            return response()->json($student);
        }
    }

    public function removeStudent(Request $request, StudentM $student)
    {
        $validator = Validator::make($request->all(), [
            'idProcess' => 'required|exists:proccess_tbl,id',
            'idStudent' => 'required|exists:student_tbl,id',
        ], [
            'idProcess.required' => 'Missing idProcess',
            'idProcess.exists' => "Process don't exist",
            'idStudent.required' => 'Missing idStudent',
            'idStudent.exists' => "Student don't exist",
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        ProcessDetailM::where('idProcess', $request->idProcess)
            ->where('idStudent', $request->idStudent)
            ->delete();
        $student = DB::Table('student_tbl')
            ->join('proccess_detail', 'student_tbl.id', 'proccess_detail.idStudent')
            ->where('proccess_detail.idProcess', $request->idProcess)
            ->select('student_tbl.*')
            ->get();
        return response()->json($student);
    }

    public function removeClass(Request $request, StudentM $student)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:proccess_tbl,id',
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "Class don't exist",
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        ProcessDetailM::where('idProcess', $request->id)->delete();
        processM::where('id', $request->id)->delete();
        $process = $this->getProcess();
        return response()->json($process);
    }

    public function editPass(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:proccess_tbl,id',
            'pass' => 'required|min:0|numeric',
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "Process don't exist",
            'pass.required' => 'Missing pass',
            'pass.min' => 'Min pass = 0',
            'pass.numeric' => 'Pass has to be a number',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        processM::where('id', $request->id)->update(['pass' => $request->pass]);
        $process = $this->getProcess();
        return response()->json($process);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json($this->getProcess());
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(processM $processM)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(processM $processM)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, processM $processM)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(processM $processM)
    {
        //
    }
}