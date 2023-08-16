const host = 'https://students.trungthanhweb.com/api/';
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

$(document).ready(function () {
    checkLogin();
    Login();
    Logout();
    loadCart();
    searchItem();
    loadBill();
    addToCart();
});
//Kiểm tra đăng nhập
function checkLogin() {
    if (localStorage.getItem('token') && localStorage.getItem('token') != null) {
        $("#Email").val(localStorage.getItem('email'));
        $('#Email').attr('readonly', 'readonly');
        $('#API').val(localStorage.getItem('token'));
        $('#API').attr('readonly', 'readonly');
        str = `
            `
        $('#login').html(str);
        $('#API').show();
        $('#loginbtn').hide();
        $('#account').show();
        $('#logoutbtn-2').show();
        $('#loginModalLabel').text('Tài khoản');
        Logout();
    }
    else {
        $('#loginbtn').attr('disabled', false);
    }
}

//Đăng nhập
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
                        Toast.fire({
                            icon: 'success',
                            title: 'Đăng nhập thành công'
                        }).then(() => {
                            $('#loginbtl').attr('disabled', 'disabled');
                            window.location.reload();
                        })
                    }
                    if (res.msg.email) {

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

// Đăng xuất
function Logout() {
    if (!localStorage.getItem('token') && localStorage.getItem('token') == null) {
        $('#logoutbtn-2').hide();
        $('#account').hide();
    }
    else {
        $('#logoutbtn').click(function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            Toast.fire({
                icon: 'success',
                title: 'Đăng xuất thành công'
            }).then(() => {
                window.location.reload();
            })
        })
        $('#logoutbtn-2').click(function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            Toast.fire({
                icon: 'success',
                title: 'Đăng xuất thành công'
            }).then(() => {
                window.location.reload();
            })
        })
    };
}
//Hiển thị bill
function loadBill() {
    $('#loadBillBtn').click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: host + "bills",
            data: {
                api_token: localStorage.getItem('token'),
            },
            dataType: "JSON",
            success: function (res) {
                if (res.check == true) {
                    str = ``;
                    let i = 1;
                    res.bills.forEach(el => {
                        str += `
                        <tr class="" >
                        <td scope="row">`+ i + `</td>
                        <td scope="row">`+ el.tenKH + `</td>
                        <td>`+ el.created_at + `</td>
                        <td><button type="button" class="btn-sm btn-primary billDetails" data-id="`+ parseInt(el.id) + `">Chi tiết</button>
                        </td>
                    </tr >
                        `;
                        i++
                    });
                    $('#logResult').html(str);
                    billDetails();
                }
            },
        });
    });

}

//Chi tiết bill
function billDetails() {
    $('.toggle').click(function (e) {
        e.preventDefault();
        $("#billModal").modal('show');
    });
    $('.billDetails').click(function (e) {
        e.preventDefault();
        $("#billDetailModal").modal('show');
        $("#billModal").modal('hide');
        let i = 1, tong = 0;
        var id = $(this).attr('data-id');
        $.ajax({
            type: "GET",
            url: host + "singlebill",
            data: {
                api_token: localStorage.getItem('token'),
                id: id
            },
            dataType: "JSON",
            success: function (res) {
                if (res.check == true) {
                    str = ``;
                    res.result.forEach(el => {
                        str += `
            <tr class="" >
            <td scope="row">`+ i + `</td>
            <td style=" width:20%"><img style=" width:50%" src="https://students.trungthanhweb.com/images/`+ el.image + `"/></td>
            <td>`+ el.productname + `</td>
            <td>`+ parseInt(el.price).toLocaleString('en-US') + ` đ</td>
            <td>`+ el.qty + `</td>
            <td>`+ (parseInt(el.price) * el.qty).toLocaleString('en-US') + ` đ</td>
        </tr >
            `
                        i++;
                        tong += (parseInt(el.price) * el.qty);
                    })

                    str += `
            <tr >
        <td colspan="3"><span >Tổng cộng</span></td>
        <td></td>
        <td></td>
        <td>`+ tong.toLocaleString('en-US') + ` đ</td>
        
    </tr>
            `;
                    $('#detailResult').html(str);
                }
            }
        })
    })
}

//Xóa khỏi giỏ hàng
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
    $('.deleteItems').click(function (e) {
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
            cancelButtonText: 'Hủy bỏ',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
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
                loadCart();
                swalWithBootstrapButtons.fire(
                    'Đã xóa',
                    'Sản phẩm đã bị xóa khỏi giỏ hàng',
                    'success'
                ).then(() => {
                    window.location.reload();
                })
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

//Tìm sản phẩm
$('#below').hide();
$('#above').hide();
$('#between').hide();
var prev_choice = null;
function searchItem() {
    $('#searchBtn').click(function (e) {
        e.preventDefault();
        var searchInput = $("#searchInput").val().trim();
        if (searchInput == '') {
            Toast.fire({
                icon: 'error',
                title: 'Giá trị nhập không khả dụng'
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
                    if (res.result.length == 0) {
                        $('#chooseFilter').attr('disabled', 'disabled');
                        str = `
                                <tr>
                                <td></td>
                                <td></td>
                                <td><p class='text-center'>Không có kết quả tìm kiếm</p></td>
                                <td></td>
                                <td></td>
                                </tr>`
                    }
                    else {
                        res.result.forEach((el) => {
                            str += `
<tr class="">
    <td style=" width:20%"><img style=" width:50%" src="https://students.trungthanhweb.com/images/`+ el.image + `"/></td>
    <td><a style="text-decoration:none;color:blue;text-weight:bold" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
    <td>`+ el.price.toLocaleString('en-US') + ` đ</td>
    <td>`+ el.brandname + `</td>
    <td>`+ el.catename + `</td>
    </td>
</tr>
`;
                        })
                    }
                    $('#searchResult').html(str);
                    $('#chooseFilter').click(function (e) {
                        e.preventDefault();
                        var cur_choice = $(this).val();
                        if (prev_choice) {
                            $('#' + prev_choice).hide();
                        }
                        $('#' + cur_choice).show();
                        prev_choice = cur_choice;
                    });
                    $('#below-filterBtn').click(function (e) {
                        e.preventDefault();
                        var filterInput = $("#below-filter").val().trim();
                        if (filterInput == '') {
                            Toast.fire({
                                icon: 'error',
                                title: 'Giá trị nhập không khả dụng'
                            })
                        }
                        else {
                            str = '';
                            res.result.forEach((el) => {
                                if (Number(el.price) <= Number(filterInput)) {
                                    str += `
                  <tr class="">
                      <td style=" width:20%"><img style=" width:50%" src="https://students.trungthanhweb.com/images/`+ el.image + `"/></td>
                      <td><a style="text-decoration:none;color:blue;text-weight:bold" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
                      <td>`+ el.price.toLocaleString('en-US') + ` đ</td>
                      <td>`+ el.brandname + `</td>
                      <td>`+ el.catename + `</td>
                      </td>
                  </tr>
                  `;
                                }
                            })
                            $('#searchResult').html(str);
                        }
                    });
                    $('#above-filterBtn').click(function (e) {
                        e.preventDefault();
                        var filterInput = $("#above-filter").val().trim();
                        if (filterInput == '') {

                            Toast.fire({
                                icon: 'error',
                                title: 'Giá trị nhập không khả dụng'
                            })
                        }
                        else {
                            str = '';
                            res.result.forEach((el) => {
                                if (Number(el.price) >= Number(filterInput)) {
                                    str += `
                  <tr class="">
                      <td style=" width:20%"><img style=" width:50%" src="https://students.trungthanhweb.com/images/`+ el.image + `"/></td>
                      <td><a style="text-decoration:none;color:blue;text-weight:bold" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
                      <td>`+ el.price.toLocaleString('en-US') + ` đ</td>
                      <td>`+ el.brandname + `</td>
                      <td>`+ el.catename + `</td>
                      </td>
                  </tr>
                  `;
                                }
                            })
                            $('#searchResult').html(str);
                        }
                    });
                    $('#between-filterBtn').click(function (e) {
                        e.preventDefault();
                        var belowfilterInput = $("#below-between-filter").val().trim();
                        var abovefilterInput = $("#above-between-filter").val().trim();
                        if (belowfilterInput == '' || abovefilterInput == '') {

                            Toast.fire({
                                icon: 'error',
                                title: 'Giá trị nhập không khả dụng'
                            })
                        }
                        else {
                            str = '';
                            res.result.forEach((el) => {
                                if (Number(el.price) >= Number(abovefilterInput) && Number(el.price) <= Number(belowfilterInput)) {
                                    str += `
                  <tr class="">
                      <td style=" width:20%"><img style=" width:50%" src="https://students.trungthanhweb.com/images/`+ el.image + `"/></td>
                      <td><a style="text-decoration:none;color:blue;text-weight:bold" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
                      <td>`+ el.price.toLocaleString('en-US') + ` đ</td>
                      <td>`+ el.brandname + `</td>
                      <td>`+ el.catename + `</td>
                      </td>
                  </tr>
                  `;
                                }
                            })
                            $('#searchResult').html(str);
                        }
                    });
                }
            })
        }
    });
}

//Thêm vào giỏ hàng
function addToCart() {
    $("#addToCartBtn").click(function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        if (!localStorage.getItem('cart') || localStorage.getItem('cart') == null) {
            var arr = [];
            var item = { id: id, qty: 1 };
            arr.push(item);
            localStorage.setItem('cart', JSON.stringify(arr));
        }
        else {
            var arr = JSON.parse(localStorage.getItem('cart'));
            var check = 0;
            arr.forEach(el => {
                if (el.id == id) {
                    el.qty++;
                    check = 1;
                }
            });
            if (check == 0) {
                var item = { id: id, qty: 1 };
                arr.push(item);
            }
            localStorage.setItem('cart', JSON.stringify(arr));
        }
        loadCart();
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
            title: 'Mua thành công'
        }).then(() => {
            window.location.reload();
        })
    });
    $(".addToCart").click(function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        if (!localStorage.getItem('cart') || localStorage.getItem('cart') == null) {
            var arr = [];
            var item = { id: id, qty: 1 };
            arr.push(item);
            localStorage.setItem('cart', JSON.stringify(arr));
        }
        else {
            var arr = JSON.parse(localStorage.getItem('cart'));
            var check = 0;
            arr.forEach(el => {
                if (el.id == id) {
                    el.qty++;
                    check = 1;
                }
            });
            if (check == 0) {
                var item = { id: id, qty: 1 };
                arr.push(item);
            }
            localStorage.setItem('cart', JSON.stringify(arr));
        }
        loadCart();
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
            title: 'Mua thành công'
        }).then(() => {
            window.location.reload();
        })
    });
}

//Hiển thị giỏ hàng
function loadCart() {
    var localCart = JSON.parse(localStorage.getItem('cart'))

    var id = [];
    if (localCart != null) {
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
    }
    var str = ``;
    var tong = 0;
    var arr = JSON.parse(localStorage.getItem('cartDetails'));
    if (arr != null) {
        arr.forEach(item => {
            str += `
        <tr class="">
            <td scope="row">`+ item.name + `</td>
            <td>`+ parseInt(item.price).toLocaleString('en-US') + ` đ</td>
            <td>`+ item.qty + `</td>
            <td>`+ (item.qty * parseInt(item.price)).toLocaleString('en-US') + ` đ</td>
            <td><button type="button" class="btn-sm btn-danger danger deleteItems" data-id="`+ parseInt(item.id) + `">Xóa</button>
            </td>
        </tr>
        `;
            tong += (item.qty * parseInt(item.price));

        });
    }
    str += `
    <tr>
        <td colspan="3"><span >Tổng cộng</span></td>
        <td>`+ tong.toLocaleString('en-US') + ` đ</td>
        <td></td>
    </tr>
    `;
    var result = document.getElementById('result');
    result.innerHTML = str;
    deleteItem();
}

//Xóa khỏi giỏ hàng
function deleteItem() {
    $('.deleteItems').click(function (e) {
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
                loadCart();
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
