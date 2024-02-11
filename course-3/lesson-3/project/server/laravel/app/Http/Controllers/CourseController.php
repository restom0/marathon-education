<?php

namespace App\Http\Controllers;

use App\Models\CourseCateM;
use App\Models\CourseM;
use App\Models\durationM;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Constraint\Count;

class CourseController extends Controller
{
    public function getCourseCate($id)
    {
        $result = DB::Table('course_cates')->where('idEdu', $id)->get();
        return $result;
    }
    public function getDuration($id)
    {
        $result = DB::Table('course_duration')->where('idCourse', $id)->select('id', 'duration', 'price')->get();
        return $result;
    }
    public function getActiveCourses()
    {
        $result = DB::Table('course')->where('status', 1)->select('id', 'name')->get();
        return response()->json($result);
    }
    public function getCoursePrice($id)
    {
        $result = $this->getDuration($id);
        return response()->json($result);
    }
    public function addPrice(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'duration' => 'required|min:0',
                'id' => 'required|exists:course,id',
                'price' => 'required|min:0'
            ],
            [
                'duration.required' => 'Thiếu thời lượng khóa học',
                'duration.min' => 'Thời lượng khóa học không hợp lệ',
                'price.required' => 'Thiếu giá khóa học',
                'price.min' => 'Giá khóa học không hợp lệ',
                'id.required' => 'Thiếu mã khóa học',
                'id.exists' => 'Mã khóa học không tồn tại',
            ]
        );
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        durationM::create(['idCourse' => $request->id, 'durationM' => $request->duration, 'price' => $request->price]);
        $result = $this->getDuration($request->id);
        return response()->json(['check' => true, 'result' => $result]);
    }
    public function deleteDuration($id)
    {
        $check = durationM::where('id', $id)->count('id');
        if ($check == 0) {
            return response()->json(['check' => false, 'msg' => 'Không tồn tại']);
        }
        $idCourse = durationM::where('id', $id)->value('idCourse');
        durationM::where('id', $id)->delete();
        $result = $this->getDuration($idCourse);
        return response()->json(['check' => true, 'result' => $result]);
    }
    public function switchCate(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'status' => 'required|min:0|max:1',
                'id' => 'required|numeric|exists:course_cates,id'
            ],
            [
                'status.required' => 'Thiếu trạng thái loại hình lớp',
                'status.min|status.max' => 'Trạng thái không hợp lệ',
                'id.required' => 'Thiếu mã loại hình',
                'id.exists' => 'Loại hình lớp học không tồn tại',
            ]
        );
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        CourseCateM::where('id', $request->id)->update(['status' => $request->status]);
        $idEdu = CourseCateM::where('id', $request->id)->value('idEdu');
        $result = $this->getCourseCate($idEdu);
        return response()->json(['check' => true, 'result' => $result]);
    }
    public function activeCate()
    {
        $result = CourseCateM::where('status', 1)->select('id', 'name')->get();
        return response()->json($result);
    }
    public function editCourseCate(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'id' => 'required|numeric|exists:course_cates,id',
            ],
            [
                'name.required' => 'Thiếu tên loại lớp học',
                'id.required' => 'Thiếu mã loại lớp học',
                'id.exists' => 'Mã loại lớp học không tồn tại',
            ]
        );
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        CourseCateM::where('id', $request->id)->update(['name' => $request->name, 'updated_at' => now()]);
        $idEdu = CourseCateM::where('id', $request->id)->value('idEdu');
        $result = $this->getCourseCate($idEdu);
        return response()->json(['check' => true, 'result' => $result]);
    }
    public function deleteCate(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'idD' => 'required|exists:course_cates,id',
            ],
            [
                'idD.required' => 'Thiếu mã loại lớp học',
                'idD.exists' => 'Mã loại lớp học không tồn tại'
            ]
        );
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        $idEdu = CourseCateM::where('id', $request->idD)->value('idEdu');
        $check = CourseM::where('idCourseCate', $request->idD)->count('id');
        if ($check != 0) {
            return response()->json(['check' => false, 'msg' => 'Đã có khóa học']);
        }
        $idEdu = CourseCateM::where('id', $request->idD)->value('idEdu');
        CourseCateM::where('id', $request->idD)->delete();
        $result = DB::Table('course_cates')->where('idEdu', $idEdu)->get();
        return response()->json(['check' => true, 'result' => $result]);
    }
    public function createCourseCate(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'idEdu' => 'required|exists:edu_tbl,id',
            ],
            [
                'name.required' => 'Thiếu tên loại lớp học',
                'idEdu.requied' => 'Thiếu mã loại hình giáo dục',
                'idEdu.exists' => 'Mã loại hình không tồn tại'
            ]
        );
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()]);
        }
        CourseCateM::create(['name' => $request->name, 'idEdu' => $request->idEdu]);
        $result = $this->getCourseCate($request->idEdu);
        return response()->json(['check' => true, 'result' => $result]);
    }
    public function index($id)
    {
        $result = $this->getCourseCate($id);
        return response()->json($result);
    }
    public function getCourse($id)
    {
        $result = DB::table('course')->where('idCourseCate', $id)->get();
        return $result;
    }
    public function getAdminCourses()
    {
        $result = $this->getCourse(null);
        return response()->json($result);
    }
}