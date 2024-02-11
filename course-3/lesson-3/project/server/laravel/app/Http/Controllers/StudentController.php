<?php

namespace App\Http\Controllers;

use App\Models\processM;
use App\Models\StudentM;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:student_tbl,email',
        ], [
            'email.required' => 'Thiếu email',
            'email.email' => 'Email không hợp lệ',
            'email.exists' => "Email không tồn tại"
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $findStudent = StudentM::where('email', $request->email)->where('status', 1)->first();

        if ($findStudent) {
            return response()->json($findStudent);
        } else {
            return response()->json(['check' => false, 'msg' => 'Tài khoản bị khóa']);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function getStudent()
    {
        $result = StudentM::all();
        return $result;
    }
    public function index()
    {
        return response()->json($this->getStudent());
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
            'name' => 'required',
            'email' => 'required|email|unique:student_tbl,email',
            'phone' => 'required|numeric',
        ], [
            'name.required' => 'Thiếu tên',
            'email.required' => 'Thiếu email',
            'email.email' => 'Email không hợp lệ ',
            'email.unique' => 'Email đã tồn tại',
            'phone.required' => 'Thiếu số điện thoại',
            'phone.numeric' => 'Số điện thoại không khả dụng',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        StudentM::create([
            'name' => $request->name, 'email' => $request->email, 'phone' => $request->phone
        ]);
        return response()->json($this->getStudent());
    }

    public function search(Request $request)
    {
        $name = $request->name;
        return response()->json(StudentM::where('name', 'LIKE', "%$name%")->orderBy('name')->get());
    }
    /**
     * Display the specified resource.
     */
    public function show(StudentM $studentM)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function switch(Request $request, StudentM $studentM)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:student_tbl,id',
        ], [
            'id.required' => 'Choose a student',
            'id.exists' => "Student doesn't exist",
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        $status = StudentM::where('id', $request->id)->value('status');
        if ($status == 1) {
            StudentM::where('id', $request->id)->update(['status' => 0, 'updated_at' => now()]);
        } else {
            StudentM::where('id', $request->id)->update(['status' => 1, 'updated_at' => now()]);
        }
        return response()->json($this->getStudent());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StudentM $studentM)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:student_tbl,id',
            'name' => 'required',
            'phone' => 'required|numeric',
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "Student doesn't exist",
            'name.required' => 'Fill in name',
            'phone.required' => 'Fill in phone',
            'phone.numeric' => 'Phone needs to be a number',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        StudentM::where('id', $request->id)->update(['name' => $request->name, 'phone' => $request->phone, 'updated_at' => now()]);
        return response()->json($this->getStudent());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, StudentM $studentM)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:student_tbl,id',
        ], [
            'id.required' => 'Thiếu mã học viên',
            'id.exists' => "Mã học viên không tồn tại"
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $checkStudent = processM::where('id', $request->id)->count(value('id'));
        if ($checkStudent == 0) {
            StudentM::where('id', $request->id)->delete();
            return response()->json($this->getStudent());
        } else {
            return response()->json(['check' => false, 'msg' => 'This student is in a class']);
        }
    }
}
