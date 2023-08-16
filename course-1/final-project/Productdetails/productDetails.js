$(document).ready(function () {
    loadData();
});
//Hiển thị sản phầm
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
                str += '<li><a class="dropdown-item" href="../Catepage/category.html?id=' + el['id'] + '&page=1" data-id="' + el['id'] + '">' + el.name + '</a></li>';
            });
            $("#listCategory").html(str);

            //Brands
            var brands = res.brands;
            str = '';
            brands.forEach((el) => {
                str += '<li><a class="dropdown-item" href="../Brandpage/brand.html?id=' + el['id'] + '&page=1" data-id="' + el['id'] + '">' + el.name + '</a></li>';
            });
            $("#listBrand").html(str);

            //Product
            var products = res.products;
            document.getElementById("productName").innerHTML = products[0].name;
            document.getElementById("productPrice").innerHTML = (products[0].price.toLocaleString('en-US') + ' đ');
            document.getElementById("addToCartBtn").setAttribute('data-id', products[0].id);
            var key = 0;
            str = `<div class="owl-carousel">`;
            res.gallery.forEach(el => {
                str += `<div>
                <img class="select" data-id=` + (key++) + ` src="` + el + `"/>
                </div>`;
            });
            str += '</div>';
            document.getElementById("slider").innerHTML = str;
            $(".owl-carousel").owlCarousel();
            document.getElementById("productContent").innerHTML = products[0].content;
            // Images
            document.getElementById("productImage").setAttribute('src', "https://students.trungthanhweb.com/images/" + products[0].images);
            $('#productImage').click(function (e) {
                e.preventDefault();
                document.getElementById("productImage").setAttribute('src', res.gallery[Math.round(Math.random() * 5)]);
            });
            $('.select').click(function (e) {
                e.preventDefault();
                document.getElementById("productImage").setAttribute('src', res.gallery[Number($(this).attr('data-id'))]);
            });
        },
    })

}