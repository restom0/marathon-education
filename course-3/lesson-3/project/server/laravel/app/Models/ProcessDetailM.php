<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcessDetailM extends Model
{
    use HasFactory;
    protected $table = 'proccess_detail';
    protected $fillable = ['id', 'idProcess', 'idStudent', 'created_at', 'updated_at'];
    protected $hidden = [];
}
