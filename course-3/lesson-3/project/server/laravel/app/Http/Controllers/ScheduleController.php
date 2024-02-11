<?php

namespace App\Http\Controllers;

use App\Models\processM;
use App\Models\scheduleM;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getSchedule()
    {
        $schedule = DB::table('class_schedule')
            ->join('course', 'class_schedule.idCourse', '=', 'course.id')
            ->join('users', 'class_schedule.idTeacher', '=', 'users.id')
            ->join('role_tbl', 'users.idRole', '=', 'role_tbl.id')
            ->select('class_schedule.*', 'course.name', 'course.id', 'course.Grade', 'users.name', 'role_tbl.name')
            ->get();
        return $schedule;
    }
    public function index()
    {
        return response()->json($this->getSchedule());
    }
    public function search(Request $request)
    {
        $name = $request->name;
        $schedule = DB::table('class_schedule')
            ->join('course', 'class_schedule.idCourse', '=', 'course.id')
            ->join('users', 'class_schedule.idTeacher', '=', 'users.id')
            ->join('role_tbl', 'users.idRole', '=', 'role_tbl.id')
            ->where('course.name', 'LIKE', "%$name%")
            ->select('class_schedule.*', 'course.name', 'course.id', 'course.Grade', 'users.name', 'role_tbl.name')
            ->get();
        return response()->json($schedule);
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
            'idCourse' => 'required|exists:course,id',
            'idTeacher' => 'required|exists:users,id',
            'schedule' => 'required',
        ], [
            'idCourse.required' => 'Missing idCourse',
            'idCourse.exists' => "Course doesn't exist",
            'idTeacher.required' => 'Missing idTeacher',
            'idTeacher.exists' => "User doesn't exist",
            'schedule.required' => "Fill in schedule",
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        $check = ScheduleM::where('idCourse', $request->idCourse)->first();
        if ($check) {
            return response()->json(['check' => false, 'msg' => 'This schedule already exist, you can edit it']);
        } else {
            ScheduleM::create(['idCourse' => $request->idCourse, 'idTeacher' => $request->idTeacher, 'schedule' => $request->schedule, 'created_at' => now()]);
            $schedule = $this->getSchedule();
            return response()->json($schedule);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(scheduleM $scheduleM)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(scheduleM $scheduleM)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, scheduleM $scheduleM)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:class_schedule,id',
            'idCourse' => 'required|exists:course,id',
            'idTeacher' => 'required|exists:users,id',
            'schedule' => 'required',
        ], [
            'id.required' => 'Choose a schedules for usesr',
            'id.exists' => "Schedule doesn't exist",
            'idCourse.required' => 'Missing idCourse',
            'idCourse.exists' => "Course doesn't exist",
            'idTeacher.required' => 'Missing idTeacher',
            'idTeacher.exists' => "User doesn't exist",
            'schedule.required' => "Fill in schedule",
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        ScheduleM::where('id', $request->id)->update(['idCourse' => $request->idCourse, 'idTeacher' => $request->idTeacher, 'schedule' => $request->schedule, 'updated_at' => now()]);
        $schedule = $this->getSchedule();
        return response()->json($schedule);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, scheduleM $scheduleM)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:class_schedule,id',
        ], [
            'id.required' => 'Choose a schedules to delete',
            'id.exists' => "Schedule doesn't exist"
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $idCourse = ScheduleM::where('id', $request->id)->value('idCourse');
        $check = processM::where('idCourse', $idCourse)->get();
        if (count($check) != 0) {
            return response()->json(['check' => false, 'msg' => 'This schedule is in another process']);
        } else {
            ScheduleM::where('id', $request->id)->delete();
            $schedule = $this->getSchedule();
            return response()->json($schedule);
        }
    }
}
