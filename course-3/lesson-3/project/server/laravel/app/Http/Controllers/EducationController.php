<?php

namespace App\Http\Controllers;

use App\Models\CourseCateM;
use App\Models\EduM;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EducationController extends Controller
{
    public function getEdu()
    {
        $result = EduM::all();
        return $result;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json($this->getEdu());
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
            'name' => 'required|unique:edu_tbl,name'
        ], [
            'name.required' => 'Thiếu tên loại hình giáo dục',
            'name.unique' => 'Tên loại hình giáo dục đã trùng'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        EduM::create(['name' => $request->name]);
        $result = $this->getEdu();
        return response()->json(['check' => true, 'result' => $result]);
    }
    public function switch(Request $request, EduM $eduM)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:edu_tbl,id',
        ], [
            'id.required' => 'Choose a educations for usesr',
            'id.exists' => "Education doesn't exist",
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        $status = EduM::where('id', $request->id)->value('status');
        if ($status == 1) {
            EduM::where('id', $request->id)->update(['status' => 0, 'updated_at' => now()]);
        } else {
            EduM::where('id', $request->id)->update(['status' => 1, 'updated_at' => now()]);
        }
        $result = $this->getEdu();
        return response()->json($result);
    }
    /**
     * Display the specified resource.
     */
    public function show(Request $request, EduM $eduM)
    {
        $result = EduM::where('status', 1)->get();
        return response()->json($result);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EduM $eduM)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EduM $eduM)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:edu_tbl,id',
            'name' => 'required|unique:edu_tbl,name',
        ], [
            'id.required' => 'Choose a educations for usesr',
            'id.exists' => "Education doesn't exist",
            'name.required' => 'Fill in name',
            'name.unique' => 'Name already exist'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }

        EduM::where('id', $request->id)->update(['name' => $request->name, 'updated_at' => now()]);
        $result = EduM::all();
        return response()->json($result);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, EduM $eduM)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:edu_tbl,id',
        ], [
            'id.required' => 'Choose a educations to delete',
            'id.exists' => "Education doesn't exist"
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $check = CourseCateM::where('education_id', $request->id)->count(value('id'));
        if ($check != 0) {
            return response()->json(['check' => false, 'msg' => 'A category is using this education']);
        } else {
            EduM::where('id', $request->id)->delete();
            $result = $this->getEdu();
            return response()->json($result);
        }
    }
}