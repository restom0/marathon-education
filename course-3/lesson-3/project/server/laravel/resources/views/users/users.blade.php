@extends('layout.layout')
@section('menunav')
    <button class="btn btn-primary" id="addUserBtn">Thêm</button>
@endsection
@section('main')
    @if (count($roles) > 0)
        <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userModalLabel">Tài khoản</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="text" placeholder="Username" class="form-control mb-2" id="username">
                        <input type="text" placeholder="Email" class="form-control mb-2" id="email">
                        <select name="idRole" id="idRole" class="form-control mb-2">
                            @foreach ($roles as $item)
                                <option value="{{ $item->id }}">{{ $item->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="submitUserBtn">Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    @endif
    @if (count($users) > 0)
        <div class="table-responsive">
            <table class="table table-primary">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên tài khoản</th>
                        <th scope="col">Email</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Loại tài khoản</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($users as $key => $item)
                        <tr class="">
                            <td scope="row">{{ ++$key }}</td>
                            <td><span class="editUserName" data-id="{{ $key }}"></span>{{ $item->name }}</td>
                            <td><span class="editEmail" data-id="{{ $key }}"></span>{{ $item->email }}</td>
                            <td>
                                <select name="" class="form-control userstatus" data-id="{{ $item->id }}"
                                    id="">
                                    @if ($item->status == 0)
                                        <option value="0" selected>Khóa</option>
                                        <option value="1">Mở</option>
                                    @else
                                        <option value="0">Khóa</option>
                                        <option value="1" selected>Mở</option>
                                    @endif
                                </select>
                            </td>
                            <td>
                                <select class="form-control mb-2 userrole" data-id="{{ $item->id }}">
                                    @foreach ($roles as $item1)
                                        @if ($item1->id == $item->idRole)
                                            <option value="{{ $item1->id }}" selected>{{ $item1->name }}</option>
                                        @else
                                            <option value="{{ $item1->id }}">{{ $item1->name }}</option>
                                        @endif
                                    @endforeach
                                </select>
                            </td>
                            <td>{{ $item->created_at }}</td>
                            <td><button class="btn btn-danger deleteUserBtn" data-id="{{ $item->id }}">Xóa</button>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
    <script>
        $(document).ready(function() {
            addUser();
            deleteUser();
            editUserRole();
            editUserStatus();
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

        function addUser() {
            $('#addUserBtn').click(function(e) {
                e.preventDefault();
                $('#userModal').modal('show');
                $('#submitUserBtn').click(function(e) {
                    e.preventDefault();
                    var name = $('#username').val().trim();
                    var email = $('#email').val().trim();
                    var idRole = $('#idRole option:selected').val();
                    if (name == '') {
                        Toast.fire({
                            icon: "error",
                            title: "Thiếu username"
                        })
                    } else if (email == '') {
                        Toast.fire({
                            icon: "error",
                            title: "Thiếu email"
                        })
                    } else {
                        $.ajax({
                            type: "post",
                            url: "/user",
                            data: {
                                name: name,
                                email: email,
                                idRole: idRole
                            },
                            dataType: "JSON",
                            success: function(res) {
                                if (res.check === true) {
                                    Toast.fire({
                                        icon: "success",
                                        title: "Thêm tài khoản thành công"
                                    }).then(() => {
                                        window.location.reload();
                                    })
                                } else if (res.msg.name) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg.name
                                    })
                                } else if (res.msg.email) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg.email
                                    })
                                } else if (res.msg.idRole) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg.idRole
                                    })
                                }
                            }
                        });
                    }
                });
            });
        }

        function deleteUser() {
            $('.deleteUserBtn').click(function(e) {
                e.preventDefault();
                var id = $(this).attr('data-id');
                Swal.fire({
                    icon: "question",
                    text: "Bạn muốn xóa tài khoản ư?",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Đúng",
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            type: "post",
                            url: "/deleteUser",
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

        function editUserRole() {
            $('.userrole').change(function(e) {
                e.preventDefault();
                var id = $(this).attr('data-id');
                var role = $(this).val();
                $.ajax({
                    type: "post",
                    url: "/editUserRole",
                    data: {
                        id: id,
                        role: role
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
                        } else if (res.msg.id) {
                            Toast.fire({
                                icon: "error",
                                title: res.msg.id
                            })
                        } else if (res.msg.role) {
                            Toast.fire({
                                icon: "error",
                                title: res.msg.role
                            })
                        } else {
                            Toast.fire({
                                icon: "error",
                                title: res.msg
                            })
                        }
                    }
                });
            });
        }

        function editUserStatus() {
            $('.userstatus').change(function(e) {
                e.preventDefault();
                var id = $(this).attr('data-id');
                var status = $(this).val();
                Swal.fire({
                    icon: "question",
                    text: "Bạn muốn chỉnh tài khoản ư?",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Đúng"
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            type: "post",
                            url: "/switchUser",
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
                                } else if (res.msg.id) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg.id
                                    })
                                } else if (res.msg.status) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.msg.status
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
                })

            });
        }
    </script>
@endsection
