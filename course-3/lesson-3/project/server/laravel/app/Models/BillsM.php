<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillsM extends Model
{
    use HasFactory;
    protected $table = 'bill_tbl';
    protected $fillable = ['id', 'name', 'email', 'phone', 'idSchedule', 'status', 'created_at', 'updated_at'];
    protected $hidden = [];
}
