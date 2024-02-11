<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRoleModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\scheduleM;
use App\Models\processM;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = UserRoleModel::where('status', 1)->get();
        $users = DB::Table('users')->join('role_tbl', 'users.idRole', '=', 'role_tbl.id')->select('users.*', 'role_tbl.name as rolename')->get();
        return view('users.users', compact('roles', 'users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'idRole' => 'required|exists:role_tbl,id',
        ], [
            'name.required' => 'Chưa có username',
            'email.required' => 'Chưa có email',
            'email.email' => 'Email không hợp lệ',
            'email.unique' => 'Email đã tồn tại',
            'idRole.required' => 'Chưa có idRole',
            'idRole.exists' => 'idRole đã tồn tại',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $random = random_int(10000, 99999);
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'idRole' => $request->idRole,
            'phone' => $request->phone,
            'password' => Hash::make($random),
        ];
        $mailData = [
            'name' => $request->name,
            'email' => $request->email,
            'idRole' => $request->idRole,
            'password' => $random,
        ];
        Mail::to($request->email)->send(new UserMail($mailData));
        User::create($data);
        return response()->json(['check' => true]);
    }

    public function delete(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:users,id',
        ], [
            'id.required' => 'Chưa có mã loại',
            'id.exists' => 'Mã loại không tồn tại',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        if ($request->id == 1) {
            return response()->json(['check' => false, 'msg' => 'Không thể xóa tài khoản hệ thống']);
        }
        $countProcess = processM::where('idTeacher', $request->id)->count('id');
        $countSchedule = scheduleM::where('idTeacher', $request->id)->count('id');
        if ($countProcess > 0 && $countSchedule > 0) {
            return response()->json(['check' => false, 'msg' => 'Không thể xóa loại này']);
        }
        User::where('id', $request->id)->delete();
        return response()->json(['check' => true]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function editUserRole(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:users,id',
            'role' => 'required|exists:role_tbl,id',
        ], [
            'id.required' => 'Chưa có mã loại',
            'id.exists' => 'Mã loại không tồn tại',
            'role.required' => 'Chưa có tên loại',
            'role.exists' => 'Tên loại không tồn tại'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        User::where('id', $request->id)->update(['idRole' => $request->role, 'updated_at' => now()]);
        return response()->json(['check' => true]);
    }
    public function switch(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:users,id',
            'status' => 'required|numeric|min:0|max:1',
        ], [
            'id.required' => 'Chưa có mã loại',
            'id.exists' => 'Mã loại không tồn tại',
            'status.required' => 'Chưa có trạng thái',
            'status.numeric' => 'Trạng thái không hợp lệ',
            'status.min' => 'Trạng thái không hợp lệ',
            'status.max' => 'Trạng thái không hợp lệ'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        User::where('id', $request->id)->update(['status' => $request->status, 'updated_at' => now()]);
        return response()->json(['check' => true]);
    }
    public function checkLoginEmail(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Chưa có email',
            'email.email' => 'Email không hợp lệ',
            'email.exists' => 'Email không tồn tại',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $user = User::where('email', $request->email)->first();
        if ($user) {
            Auth::login($user, true);
            return response()->json(['check' => true, 'token' => Auth::user()->remember_token]);
        } else {
            return response()->json(['check' => false, 'msg' => "Email chưa được đăng ký"]);
        }
    }
    public function checkLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required',
        ], [
            'email.required' => 'Chưa có email',
            'email.email' => 'Email không hợp lệ',
            'email.exists' => 'Email không tồn tại',
            'password.required' => 'Không có password',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password, 'status' => 1], true)) {
            return response()->json(['check' => true, 'token' => Auth::user()->remember_token]);
        } else {
            return response()->json(['check' => false, 'msg' => 'Sai email hoặc mật khẩu']);
        }
    }
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
