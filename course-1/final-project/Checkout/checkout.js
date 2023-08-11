const host = 'https://students.trungthanhweb.com/api/';
$(document).ready(function () {
    loadData();
    checkLogin();
    Login();
    Logout();
    loadCart();
    searchItem();
});

//Kiểm tra đăng nhập
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

// Đăng xuất
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
                title: 'Đăng xuất thành công'
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
                title: 'Đăng xuất thành công'
            }).then(() => {
                window.location.reload();
            })
        })
    };
}

//Hiển thị sản phẩm
function loadData() {
    var str = '', tong = 0, i = 1;
    $.ajax({
        type: "GET",
        url: host + "home",
        data: { apitoken: localStorage.getItem('token') },
        dataType: "JSON",
        success: function (res) {
            var categories = res.categrories;
            str = '';
            categories.forEach((el) => {
                str += '<li><a class="dropdown-item" href="../Catepage/category.html?id=' + el['id'] + '&page=1" data-id="' + el['id'] + '">' + el.name + '</a></li>';
            });
            $("#listCategory").html(str);
            var brands = res.brands;
            str = '';
            brands.forEach((el) => {
                str += '<li><a class="dropdown-item" href="../Brandpage/brand.html?id=' + el['id'] + '&page=1" data-id="' + el['id'] + '">' + el.name + '</a></li>';
            });
            $("#listBrand").html(str);
        }
    });
    var arr = JSON.parse(localStorage.getItem('cartDetails'));
    if (arr != null) {
        arr.forEach(el => {
            str += `
            <tr class="" >
            <td scope="row">`+ i + `</td>
            <td scope="row" style="width:20%"><img style="width:50%" src="`+ el.images + `"></td>
            <td scope="row"><a style="text-decoration:none;color:blue;text-weight:bold" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
            <td>`+ parseInt(el.price).toLocaleString('en-US') + `đ</td>
            <td>`+ el.qty + `</td>
            <td>`+ (parseInt(el.price) * el.qty).toLocaleString('en-US') + `đ</td>
            <td><button type="button" class="btn-sm btn-danger danger" id="deleteItems" data-id="`+ parseInt(el.id) + `">Xóa</button>
            </td>
        </tr >
            `;
            tong += (parseInt(el.price) * el.qty);
            i++;
        });
    }
    str += `
        <tr>
        <td></td>
        <td colspan="3" style="font-size:20pt"><span>Tổng cộng</span></td>
        <td></td>
        <td style="font-size:20pt">`+ tong.toLocaleString('en-US') + `đ</td>
        <td><button type="button" class="btn-sm btn-success success" id="deleteAllItem">
        Thanh toán
    </button></td>
    </tr >
            `;
    $('#productResult').append(str);
    deleteItem();
    deleteAllItem();
}

//Thanh toán
function deleteAllItem() {
    if (!localStorage.getItem('cart') || localStorage.getItem('cart') == []) {
        $('#deleteAllItem').attr('disabled', 'disabled');
    }
    else {
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
        arr.forEach(el => {
            str += `
            <tr class="" >
            <td scope="row"><a style="text-decoration:none;color:blue;text-weight:bold" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
            <td>`+ parseInt(el.price).toLocaleString('en-US') + `đ</td>
            <td>`+ el.qty + `</td>
            <td>`+ (parseInt(el.price) * el.qty).toLocaleString('en-US') + `đ</td>
            <td><button type="button" class="btn-sm btn-danger danger" id="deleteItems" data-id="`+ parseInt(el.id) + `">Xóa</button>
            </td>
        </tr >
            `;
            tong += (parseInt(el.price) * el.qty);
        });
    }
    str += `
            <tr >
        <td colspan="3"><span >Tổng cộng</span></td>
        <td>`+ tong.toLocaleString('en-US') + `</td>
        <td></td>
    </tr>
            `;
    var result = document.getElementById('result');
    result.innerHTML = str;
    deleteItem();
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
                    res.result.forEach((el) => {
                        str += `
<tr class="">
    <td style=" width:20%"><img style=" width:50%" src="https://students.trungthanhweb.com/images/`+ el.image + `"/></td>
    <td><a style="text-decoration:none;color:blue;text-weight:bold" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
    <td>`+ el.price.toLocaleString('en-US') + `đ</td>
    <td>`+ el.brandname + `</td>
    <td>`+ el.catename + `</td>
    </td>
</tr>
`;
                    })
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
                        console.log(Number(filterInput));
                        if (filterInput == '') {
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
                      <td>`+ el.price.toLocaleString('en-US') + `đ</td>
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
                      <td>`+ el.price.toLocaleString('en-US') + `đ</td>
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
                        console.log(belowfilterInput);
                        console.log(abovefilterInput);
                        if (belowfilterInput == '' || abovefilterInput == '') {
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
                      <td>`+ el.price.toLocaleString('en-US') + `đ</td>
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

