<style>
    .pointer {
        cursor: pointer;
    }
</style>
@extends('layout.layout')
@section('menunav')
    <button class="btn btn-primary" id="addRoleBtn">Thêm</button>
@endsection
@section('main')
    <div class="container-fluid">
        <div class="row">
            @if (count($roles) > 0)
                <div class="table-responsive">
                    <table class="table table-primary">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên loại</th>
                                <th scope="col">Status</th>
                                <th scope="col">Ngày tạo</th>
                                <th scope="col">Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($roles as $key => $item)
                                <tr class="">
                                    <td scope="row">{{ ++$key }}</td>
                                    <td><span class="editRoleName pointer"
                                            data-id="{{ $item->id }}">{{ $item->name }}</span>
                                    </td>
                                    <td>
                                        <select name="" id="" class="form-control switchRole pointer"
                                            data-id="{{ $item->id }}">
                                            @if ($item->status == 0)
                                                <option value="0" selected>Đang khóa</option>
                                                <option value="1">Đang mở</option>
                                            @else
                                                <option value="0">Đang khóa</option>
                                                <option value="1" selected>Đang mở</option>
                                            @endif
                                        </select>
                                    </td>
                                    <td>{{ $item->created_at }}</td>
                                    <td><button class="btn btn-danger deleteRoleBtn"
                                            data-id="{{ $item->id }}">Xóa</button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
    </div>
    <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel">Loại tài khoản</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="text" id="rolename" class="form-control" placeholder="Tên loại tài khoản">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="submitRoleBtn">Lưu</button>
                </div>
            </div>
        </div>
    </div>
    <script>
        $(document).ready(function() {
            addRole();
            editRole();
            switchRole();
            deleteRole();
        });
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        function switchRole() {
            $('.switchRole').change(function(e) {
                e.preventDefault();
                var id = $(this).attr('data-id');
                var status = $(this).val();
                $.ajax({
                    type: "post",
                    url: "/switchRole",
                    data: {
                        id: id,
                        status: status
                    },
                    dataType: "JSON",
                    success: function(res) {
                        if (res.check === true) {
                            Toast.fire({
                                icon: "success",
                                title: "Chỉnh sửa thành công"
                            }).then(() => {
                                window.location.reload();
                            })
                        }
                        if (res.msg.id) {
                            Toast.fire({
                                icon: "error",
                                title: res.msg.id
                            })
                        } else if (res.msg.status) {
                            Toast.fire({
                                icon: "error",
                                title: res.msg.status
                            })
                        }
                    }
                });
            });
        }

        function editRole() {
            $('.editRoleName').click(function(e) {
                e.preventDefault();
                var id = $(this).attr('data-id');
                var old = $(this).text();
                $('#rolename').val(old);
                $('#addModal').modal('show');
                $('#submitRoleBtn').click(function(e) {
                    e.preventDefault();
                    var rolename = $('#rolename').val().trim();
                    if (rolename == '') {
                        Toast.fire({
                            icon: "error",
                            title: "Chưa nhập tên tài khoản"
                        });
                    } else if (rolename == old) {
                        Toast.fire({
                            icon: "error",
                            title: "Không thay đổi tên"
                        });
                    } else {
                        $.ajax({
                            type: "post",
                            url: "/editRole",
                            data: {
                                id: id,
                                rolename: rolename
                            },
                            dataType: "JSON",
                            success: function(res) {
                                if (res.check == true) {
                                    Toast.fire({
                                        icon: "success",
                                        title: "Chỉnh sửa thành công"
                                    }).then(() => {
                                        window.location.reload();
                                    })
                                }
                                if (res.msg.id) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg.id
                                    })
                                }
                                if (res.msg.rolename) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg.rolename
                                    })
                                }
                            }
                        });
                    }
                });
            });
        }

        function addRole() {
            $('#addRoleBtn').click(function(e) {
                e.preventDefault();
                $('#addModal').modal('show');
                $('#submitRoleBtn').click(function(e) {
                    e.preventDefault();
                    var rolename = $('#rolename').val().trim();
                    if (rolename == '') {
                        Toast.fire({
                            icon: "error",
                            title: "Chưa nhập tên tài khoản"
                        });
                    } else {
                        $.ajax({
                            type: "post",
                            url: "/role",
                            data: {
                                rolename: rolename
                            },
                            dataType: "JSON",
                            success: function(res) {
                                if (res.check == true) {
                                    Toast.fire({
                                        icon: "success",
                                        title: "Thêm thành công"
                                    }).then(() => {
                                        window.location.reload();
                                    })
                                }
                                if (res.msg.rolename) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg.rolename
                                    })
                                }
                            }
                        });
                    }
                })
            });
        }

        function deleteRole() {
            $('.deleteRoleBtn').click(function(e) {
                e.preventDefault();
                var id = $(this).attr('data-id');
                Swal.fire({
                    icon: "question",
                    text: "Bạn muốn xóa tài khoản ư?",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Đúng",
                    denyButtonText: `Không`
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            type: "post",
                            url: "/deleteRole",
                            data: {
                                id: id
                            },
                            dataType: "JSON",
                            success: function(res) {
                                if (res.check === true) {
                                    Toast.fire({
                                        icon: "success",
                                        title: "Xóa thành công"
                                    }).then(() => {
                                        window.location.reload();
                                    })
                                } else if (res.msg.id) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg.id
                                    })
                                } else {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg
                                    })
                                }
                            }
                        });
                    } else if (result.isDenied) {}
                });
            });
        }
    </script>
@endsection
