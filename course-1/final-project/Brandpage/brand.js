const host = 'https://students.trungthanhweb.com/api/';
$(document).ready(function () {
    loadData();
    checkLogin();
    Login();
    Logout();
    searchItem();
    addToCart();
    loadCart();
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
        localStorage.setItem('email', email);
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
                            timer: 3000,
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

//Đăng xuất
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
                timer: 3000,
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
                timer: 3000,
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
    var id = new URLSearchParams(window.location.search).get('id');
    var page = new URLSearchParams(window.location.search).get('page');
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
        },
    })


    $.ajax({
        type: "GET",
        url: host + "getBrandProducts",
        data: {
            apitoken: localStorage.getItem('token'),
            id: id,
            page: page
        },
        dataType: "JSON",
        success: function (res) {
            if (res.products.data.length == 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hiện tại trang đang bảo trì!',
                }).then(() => {
                    window.location.replace("../Homepage/homepage.html")
                });
            }
            else {
                str = `
            <li class="page-item">
                <a class="page-link" href="#" id="firstPage">
                <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" id="prevPage">Previous</a>
            </li>`;
                localStorage.setItem('last_page', res.products.last_page);

                for (let i = 1; i <= Number(res.products.last_page); i++) {
                    str += `<li class="page-item">
                <a class="page-link page" href="#" data-id="`+ i + `">` + i + `</a>
            </li>`;
                }
                str += `
            <li class="page-item">
                <a class="page-link" href="#" id="nextPage">Next</a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" id="lastPage">
                <span aria-hidden="true">&raquo;</span>
                </a>
            </li>`;
                $('#splitPage').html(str);
                nextPage();
                prevPage();
                clickPage();
                firstPage();
                lastPage();
                var products = res.products.data;
                $('#title').html(res.products.data[0].brandname);
                str = '';
                products.forEach((el) => {
                    str += `<div class="col-md-4">
                  <div class="product">
                      <img class="w-60" src="https://students.trungthanhweb.com/images/`+ el['image'] + `"
                          alt="" />
                      <a style="text-decoration:none" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">
                      <h4>`+ el['name'] + `</h4></a>
                      <p style="color: red;font-weight:bold">`+ el['price'].toLocaleString('en-US') + ` đ</p>
                      <p> `+ el['catename'] + `</p>
                      <a href="../Productdetails/productDetails.html?id=`+ el['id'] + `"class="btn btn-primary chitietBtn" data-id="` + el['id'] + `">
                          Chi tiết
                      </a>
                      <button class="btn btn-success addToCart" data-id="`+ el['id'] + `">
                          Thêm
                      </button>
                  </div>
              </div>`;
                });
                $('#resultProduct').html(str);
                addToCart();
            }
        }
    });
}

//Chọn trang
function clickPage() {
    var id = new URLSearchParams(window.location.search).get('id')
    $('.page').click(function (e) {
        e.preventDefault();
        var href = "../Brandpage/brand.html?id=" + id + "&page=" + $(this).attr('data-id');
        location.replace(href)
    });
}

//Trang trước
function prevPage() {
    var id = new URLSearchParams(window.location.search).get('id')
    var page = new URLSearchParams(window.location.search).get('page');
    if (--page == 0) {
        $('#prevPage').hide();
    }
    $('#prevPage').click(function (e) {
        e.preventDefault();
        var href = "../Brandpage/brand.html?id=" + id + "&page=" + (page);
        location.replace(href)
    });
}

//Trang sau
function nextPage() {
    var id = new URLSearchParams(window.location.search).get('id')
    var page = new URLSearchParams(window.location.search).get('page');
    if (++page > Number(localStorage.getItem('last_page'))) {
        $('#nextPage').hide();
    }
    $('#nextPage').click(function (e) {
        e.preventDefault();
        var href = "../Brandpage/brand.html?id=" + id + "&page=" + (page);
        location.replace(href)
    });
}

//Trang đầu
function firstPage() {
    var id = new URLSearchParams(window.location.search).get('id');
    var page = new URLSearchParams(window.location.search).get('page');
    if (--page == 0) {
        $('#firstPage').hide();
    }
    $('#firstPage').click(function (e) {
        e.preventDefault();
        var href = "../Catepage/category.html?id=" + id + "&page=1";
        location.replace(href)
    });
}

//Trang cuối
function lastPage() {
    var id = new URLSearchParams(window.location.search).get('id');
    var page = new URLSearchParams(window.location.search).get('page');
    if (++page > Number(localStorage.getItem('last_page'))) {
        $('#lastPage').hide();
    }
    $('#lastPage').click(function (e) {
        e.preventDefault();
        var href = "../Catepage/category.html?id=" + id + "&page=" + Number(localStorage.getItem('last_page'));
        location.replace(href)
    });
}

//Thêm vào giỏ hàng
function addToCart() {
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
        });
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
                                title: 'Input không khả dụng'
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
                                title: 'Input không khả dụng'
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
                                title: 'Input không khả dụng'
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