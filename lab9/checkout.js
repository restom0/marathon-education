const host = 'https://students.trungthanhweb.com/api/';
$(document).ready(function () {
    loadData();
    checkLogin();
    Login();
    Logout();
    hienThiGioHang();
    checkout();
    searchItem();
    deleteAllItem();
});
function loadData() {
    var str = '', tong = 0;
    var arr = JSON.parse(localStorage.getItem('cartDetails'));
    arr.forEach(item => {
        var name = item.name;
        var price = parseInt(item.price);
        var count = item.qty;
        str += `
        <tr class="">
            <td scope="row">`+ name + `</td>
            <td>`+ price.toLocaleString('en-US') + `</td>
            <td>`+ count + `</td>
            <td>`+ (count * price).toLocaleString('en-US') + `</td>
            <td><span id="deleteItems" data-id="`+ parseInt(item.id) + `"><i class='bx bxs-folder-minus' ></i></span>
            </td>
        </tr>
        `;
        tong += (count * price);

    });
    str += `
    <tr>
        <td colspan="3"><span >Tổng cộng</span></td>
        <td>`+ tong.toLocaleString('en-US') + `</td>
        <td></td>
    </tr>
    `;
    $('#productResult').append(str);
    deleteItem();
}
function hienThiGioHang() {
    var localCart = JSON.parse(localStorage.getItem('cart'))
    var id = [];
    localCart.forEach(el => {
        id.push([el.id, el.qty]);
    });
    $.ajax({
        type: "GET",
        url: host + "getCart",
        data: {
            apitoken: localStorage.getItem('token'),
            id: id
        },
        dataType: "JSON",
        success: function (res) {
            var arr = [];
            if (res.check == true) {
                let i = 0;
                res.result.forEach(el => {
                    var temp = { id: el[0], name: el[1], price: el[2], images: el[3], qty: localCart[i].qty };
                    arr.push(temp);
                    i++;
                });
                localStorage.setItem('cartDetails', JSON.stringify(arr))
            }
        },

    });
    var str = ``;
    var tong = 0;
    var arr = JSON.parse(localStorage.getItem('cartDetails'));

    arr.forEach(item => {
        var name = item.name;
        var price = parseInt(item.price);
        var count = item.qty;
        str += `
        <tr class="">
            <td scope="row">`+ name + `</td>
            <td>`+ price.toLocaleString('en-US') + `</td>
            <td>`+ count + `</td>
            <td>`+ (count * price).toLocaleString('en-US') + `</td>
            <td><span id="deleteItems" data-id="`+ parseInt(item.id) + `"><i class='bx bxs-folder-minus' ></i></span>
            </td>
        </tr>
        `;
        tong += (count * price);

    });
    str += `
    <tr>
        <td colspan="3"><span >Tổng cộng</span></td>
        <td>`+ tong.toLocaleString('en-US') + `</td>
        <td></td>
    </tr>
    `;
    var result = document.getElementById('result');
    result.innerHTML = str;
    deleteItem();
}
function deleteItem() {
    // $('#deleteItems').click(function (e) {
    //     e.preventDefault();
    //     $("#deleteItemsModal").modal('show');
    //     $("#cartModal").modal('hide');
    // });
    // $('#cancel').click(function (e) {
    //     e.preventDefault();
    //     $("#cartModal").modal('show');
    // })
    $('#deleteItems').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Bạn chắc chứ?',
            text: "Bạn sẽ không khôi phục lại được",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Đã xóa',
                    'Sản phẩm đã bị xóa khỏi giỏ hàng',
                    'success'
                )
                var arr1 = [];
                var arr = JSON.parse(localStorage.getItem('cartDetails'));

                arr.forEach((el) => {
                    if (el.id != id) {
                        arr1.push(el);
                    }
                });
                localStorage.setItem('cartDetails', JSON.stringify(arr1));
                var arr1 = [];
                var arr = JSON.parse(localStorage.getItem('cart'));
                arr.forEach((el) => {
                    if (el.id != id) {
                        arr1.push(el);
                    }
                });
                localStorage.setItem('cart', JSON.stringify(arr1));
                hienThiGioHang();
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Đã hủy bỏ',
                    'error'
                )
            }
        })
    })
}
function checkLogin() {
    if (localStorage.getItem('token') && localStorage.getItem('token') != null) {
        $("#Email").val(localStorage.getItem('email'));
        $('#Email').attr('readonly', 'readonly');
        $('#API').val(localStorage.getItem('token'));
        $('#API').attr('readonly', 'readonly');
        $('#login').text('Account');
        $('#API').show();
        $('#loginbtn').hide();
        $('#logoutbtn').show();
        $('#logoutbtn-2').show();
    }
    else {
        $('#loginbtn').attr('disabled', false);
    }
}
// Đăng nhập
function Logout() {
    if (!localStorage.getItem('token') && localStorage.getItem('token') == null) {
        $('#logoutbtn-2').hide();
        $('#logoutbtn').hide();
    }
    else {
        $('#logoutbtn').click(function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Logout successfully'
            }).then(() => {
                window.location.reload();
            })
        })
        $('#logoutbtn-2').click(function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Logout successfully'
            }).then(() => {
                window.location.reload();
            })
        })
    };
}
//Đăng xuất
function Login() {
    if (!localStorage.getItem('token') && localStorage.getItem('token') == null) {
        $('#label-API').hide();
        $('#API').hide();
    }
    $('#loginbtn').click(function (e) {
        e.preventDefault();
        $('#loginbtn').show();
        var email = $("#Email").val().trim();
        if (email == '') {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'error',
                title: 'No email'
            })
        } else {
            localStorage.setItem('email', email);
            $.ajax({
                type: "post",
                url: host + "checkLoginhtml",
                data: {
                    email: email,
                },
                dataType: "JSON",
                success: function (res) {
                    if (res.check == true) {
                        if (!localStorage.getItem('token') || localStorage.getItem('token') == null) {
                            localStorage.setItem('token', res.apitoken);
                        } else {
                            localStorage.removeItem('token');
                            localStorage.setItem('token', res.apitoken);
                        }
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })

                        Toast.fire({
                            icon: 'success',
                            title: 'Đăng nhập thành công'
                        }).then(() => {
                            $('#loginbtl').attr('disabled', 'disabled');
                            window.location.reload();
                        })
                    }
                    if (res.msg.email) {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })

                        Toast.fire({
                            icon: 'error',
                            title: 'Đăng nhập thất bại'
                        })
                    }
                }
            });
        }
    });
}
function checkout() {
    var href = "/lab9/checkout.html?cartDetails=" + encodeURIComponent(localStorage.getItem("cartDetails"));
    document.getElementById('checkoutBtn').setAttribute("href", href);
}
function searchItem() {
    $('#searchBtn').click(function (e) {
        e.preventDefault();
        var searchInput = $("#searchInput").val().trim();
        if (searchInput == '') {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'error',
                title: 'No input'
            })
        }
        else {
            $.ajax({
                type: "GET",
                url: host + "getSearchProducts",
                data: {
                    apitoken: localStorage.getItem('token'),
                    name: searchInput
                },
                dataType: "JSON",
                success: function (res) {
                    var str = ``;
                    console.log(res.result);
                    res.result.forEach((el) => {
                        str += `
        <tr class="">
            <td style=" width:20%"><img style=" width:50%" src="https://students.trungthanhweb.com/images/`+ el.image + `"/></td>
            <td><a style="text-decoration:none;color:blue;text-weight:bold" href="/lab9/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
            <td>`+ el.price.toLocaleString('en-US') + `</td>
            <td>`+ el.brandname + `</td>
            <td>`+ el.catename + `</td>
            </td>
        </tr>
        `;
                    })
                    $('#searchResult').html(str);
                }
            })
        }
    });
}
function deleteAllItem() {
    $('#deleteAllItem').click(function (e) {
        e.preventDefault();
        let arr1 = [];
        localStorage.setItem("cart", JSON.stringify(arr1));
        localStorage.setItem("cartDetails", JSON.stringify(arr1));
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Thanh toán thành công'
        }).then(() => {
            window.location.reload();
        })
    });

}