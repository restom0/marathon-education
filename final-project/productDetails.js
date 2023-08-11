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
            <td>`+ price.toLocaleString('en-US') + `đ</td>
            <td>`+ count + `</td>
            <td>`+ (count * price).toLocaleString('en-US') + `đ</td>
            <td><button type="button" class="btn-sm btn-danger danger" id="deleteItems" data-id="`+ parseInt(item.id) + `">Xóa</button>
            </td>
        </tr>
        `;
        tong += (count * price);

    });
    str += `
    <tr>
        <td colspan="3"><span >Tổng cộng</span></td>
        <td>`+ tong.toLocaleString('en-US') + `đ</td>
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

const host = 'https://students.trungthanhweb.com/api/';
$(document).ready(function () {
    loadData();
    checkLogin();
    Login();
    Logout();
    addToCart();
    hienThiGioHang();
    searchItem();
});
//Load san pham
function loadData() {
    var id = new URLSearchParams(window.location.search);
    id = id.get('id');
    $.ajax({
        type: "GET",
        url: host + "single",
        data: {
            apitoken: localStorage.getItem('token'),
            id: id
        },
        dataType: "JSON",
        success: function (res) {
            //Category
            var categories = res.categrories;
            str = '';
            categories.forEach((el) => {
                str += '<li><a class="dropdown-item" href="#">' + el.name + '</a></li>';
            });
            $("#listCategory").html(str);

            //Brands
            var brands = res.brands;
            str = '';
            brands.forEach((el) => {
                str += '<li><a class="dropdown-item" href="#" data-id="' + el['id'] + '">' + el.name + '</a></li>';
            });
            $("#listBrand").html(str);

            //Product
            var products = res.products;
            document.getElementById("productName").innerHTML = products[0].name;
            document.getElementById("productPrice").innerHTML = Intl.NumberFormat('en-US').format(products[0].price);
            document.getElementById("addToCartBtn").setAttribute('data-id', products[0].id);
            str = `<div class="owl-carousel">`;
            res.gallery.forEach(el => {
                str += `<div>
                <img src="`+ el + `"/>
                </div>`;
            });
            str += '</div>';
            document.getElementById("slider").innerHTML = str;
            $(".owl-carousel").owlCarousel();
            document.getElementById("productContent").innerHTML = products[0].content;

            // Images
            document.getElementById("productImage").setAttribute('src', "https://students.trungthanhweb.com/images/" + products[0].images);
        },
    })

}
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
        hienThiGioHang();
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
                timer: 3000,
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
                timer: 3000,
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
                    res.result.forEach((el) => {
                        str += `
        <tr class="">
            <td style=" width:20%"><img style=" width:50%" src="https://students.trungthanhweb.com/images/`+ el.image + `"/></td>
            <td><a style="text-decoration:none;color:blue;text-weight:bold" href="/final-project/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
            <td>`+ el.price.toLocaleString('en-US') + `đ</td>
            <td>`+ el.brandname + `</td>
            <td>`+ el.catename + `</td>
            </td>
        </tr>
        `;
                    })
                    $('#searchResult').html(str);
                    $('#filterBtn').click(function (e) {
                        e.preventDefault();
                        var filterInput = $("#filter").val().trim();

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
                                icon: 'success',
                                title: 'Input không khả dụng'
                            })
                        }
                        else {
                            str = '';
                            res.result.forEach((el) => {
                                if (Number(el.price) <= Number(filterInput)) {
                                    str += `
                    <tr class="" >
                    <td style=" width:20%"><img style=" width:50%" src="https://students.trungthanhweb.com/images/`+ el.image + `"/></td>
                    <td><a style="text-decoration:none;color:blue;text-weight:bold" href="/final-project/productDetails.html?id=`+ el['id'] + `">` + el.name + `</a></td>
                    <td>`+ el.price.toLocaleString('en-US') + `đ</td>
                    <td>`+ el.brandname + `</td>
                    <td>`+ el.catename + `</td>
                    </td >
                </tr >
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