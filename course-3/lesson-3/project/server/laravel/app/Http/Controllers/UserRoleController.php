<?php

namespace App\Http\Controllers;

use App\Models\UserRoleModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UserRoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = UserRoleModel::all();
        return view('users.roles', compact('roles'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function detail($id)
    {
        return view('users.roles');
    }

    public function delete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:role_tbl,id',
        ], [
            'id.required' => 'Chưa có mã loại',
            'id.exists' => 'Mã loại không tồn tại',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $count = User::where('idRole', $request->id)->count('id');
        if ($count > 0) {
            return response()->json(['check' => false, 'msg' => 'Không thể xóa loại này, vui lòng xóa người dùng trong loại này']);
        }
        UserRoleModel::where('id', $request->id)->delete();
        return response()->json(['check' => true]);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rolename' => 'required|unique:role_tbl,name',
        ], [
            'rolename.required' => 'Chưa có tên loại',
            'rolename.unique' => 'Tên loại đã tồn tại',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        UserRoleModel::create(['name' => $request->rolename]);
        return response()->json(['check' => true]);
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
    public function show(UserRoleModel $userRoleModel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, UserRoleModel $userRoleModel)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:role_tbl,id',
            'rolename' => 'required|unique:role_tbl,name',
        ], [
            'id.required' => 'Chưa có mã loại',
            'id.exists' => 'Mã loại không tồn tại',
            'rolename.required' => 'Chưa có tên loại',
            'rolename.unique' => 'Tên loại đã tồn tại',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        UserRoleModel::where('id', $request->id)->update(['name' => $request->rolename, 'updated_at' => now()]);
        return response()->json(['check' => true]);
    }

    public function switch(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:role_tbl,id',
            'status' => 'required|numeric|min:0|max:1',
        ], [
            'id.required' => 'Chưa có mã loại',
            'id.exists' => 'Mã loại không tồn tại',
            'status.required' => 'Chưa có trạng thái',
            'status.numeric' => 'Trạng thái không hợp lệ',
            'status.max' => 'Trạng thái không hợp lệ',
            'status.min' => 'Trạng thái không hợp lệ',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        UserRoleModel::where('id', $request->id)->update(['status' => $request->status, 'updated_at' => now()]);
        return response()->json(['check' => true]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserRoleModel $userRoleModel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserRoleModel $userRoleModel)
    {
        //

    }
}