<?php

namespace App\Http\Controllers;

use App\Models\EduM;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EducationController extends Controller
{
    public function getEdu()
    {
        $result = DB::Table('edu_tbl')->get();
        return $result;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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

    /**
     * Display the specified resource.
     */
    public function show(EduM $eduM)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EduM $eduM)
    {
        //
    }
}
