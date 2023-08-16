$(document).ready(function () {
    loadData();
    createBill();
});

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
            <td>`+ parseInt(el.price).toLocaleString('en-US') + ` đ</td>
            <td>`+ el.qty + `</td>
            <td>`+ (parseInt(el.price) * el.qty).toLocaleString('en-US') + ` đ</td>
            <td><button type="button" class="btn-sm btn-danger danger deleteItems" data-id="`+ parseInt(el.id) + `">Xóa</button>
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
        <td style="font-size:20pt">`+ tong.toLocaleString('en-US') + ` đ</td>
        <td><button type="button" class="btn-sm btn-success success" data-bs-toggle="modal" data-bs-target="#createBill" id="checkBill">
        Thanh toán
    </button></td>
    </tr >
            `;
    $('#productResult').append(str);
    deleteItem();
}

//Thanh toán
function createBill() {
    if (!localStorage.getItem('cart') || localStorage.getItem('cart') == []) {
        $('#checkBill').hide();
    }
    else {
        var cart = [];
        var temp = JSON.parse(localStorage.getItem('cart'));
        temp.forEach(el => {
            cart.push([el.id, el.qty]);
        });
        $('#checkBill').click(function (e) {
            e.preventDefault();
            if (!localStorage.getItem('contact') || localStorage.getItem('contact') == null) {
                $('#confirm').click(function (e) {
                    e.preventDefault();
                    var phone = $('#billPhone').val().trim();
                    if (!phone.match(/(0[3|5|7|9])+([0-9]{8})\b/g)) {


                        Toast.fire({
                            icon: 'error',
                            title: 'Số điện thoại không khả dụng'
                        })
                    }
                    else {
                        var contact = {
                            name: $('#billName').val().trim(),
                            phone: $('#billPhone').val().trim(),
                            address: $('#billAddress').val().trim()
                        }
                        if (contact.name === '' || contact.phone === '' || contact.address === '') {

                            Toast.fire({
                                icon: 'error',
                                title: 'Thông tin không đầy đủ'
                            })
                        }
                        else {
                            localStorage.setItem('contact', JSON.stringify(contact))

                            $.ajax({
                                type: "POST",
                                url: host + "createBill",
                                data: {
                                    api_token: localStorage.getItem('token'),
                                    tenKH: contact.name,
                                    phone: contact.phone,
                                    address: contact.address,
                                    cart: cart
                                },
                                dataType: "JSON",
                                success: function (res) {
                                    if (res.check == true) {
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
                                            title: 'Đặt hàng thành công'
                                        }).then(() => {
                                            localStorage.removeItem('cart');
                                            localStorage.removeItem('cartDetails');
                                            localStorage.removeItem('contact');
                                            window.location.replace('../Homepage/homepage.html');
                                        })
                                    }
                                    else {
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
                                            icon: 'warning',
                                            title: 'Đặt hàng thất bại'
                                        })
                                    }
                                }
                            });
                        }
                    }
                })
            }
            else {
                var contact = JSON.parse(localStorage.getItem('contact'))
                $('#billName').val(contact.name);
                $('#billPhone').val(contact.phone);
                $('#billAddress').val(contact.address);
                $('#confirm').click(function (e) {
                    e.preventDefault();
                    if (contact.name === '' || contact.phone === '' || contact.address === '') {
                        Toast.fire({
                            icon: 'error',
                            title: 'Thông tin không đầy đủ'
                        })
                    }
                    else {
                        localStorage.setItem('contact', JSON.stringify(contact))
                        $.ajax({
                            type: "POST",
                            url: host + "createBill",
                            data: {
                                api_token: localStorage.getItem('token'),
                                tenKH: contact.name,
                                phone: contact.phone,
                                address: contact.address,
                                cart: cart
                            },
                            dataType: "JSON",
                            success: function (res) {
                                if (res.check == true) {
                                    Toast.fire({
                                        icon: 'success',
                                        title: 'Đặt hàng thành công'
                                    }).then(() => {
                                        localStorage.removeItem('cart');
                                        localStorage.removeItem('cartDetails');
                                        localStorage.removeItem('contact');
                                        window.location.reload();
                                    })
                                }
                                else {


                                    Toast.fire({
                                        icon: 'warning',
                                        title: 'Đặt hàng thất bại'
                                    })
                                }
                            }
                        });
                    }
                });
            }
        });
    }
}