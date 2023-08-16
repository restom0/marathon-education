$(document).ready(function () {
    loadData();
});

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