// var arr = [];
// const buttons = document.querySelectorAll('.addtoCart');
// for (let i = 0; i < buttons.length; i++) {
//   const el = buttons[i];
//   el.addEventListener('click', () => {
//     const item = {};
//     item.id = el.getAttribute('data-id');
//     item.name = el.getAttribute('data-name');
//     item.price = el.getAttribute('data-price');
//     item.count = 1;
//     let check = false;
//     arr.forEach((i) => {
//       if (i.name == item.name) {
//         i.count = i.count + 1;
//         check = true;
//       }
//     });
//     if (!check) {
//       arr.push(item);
//     }
//     alert('Sản phẩm đã được thêm');
//     loadCart();
//   });
// }
// function loadCart() {
//   var str = ``;
//   var tong = 0;
//   arr.forEach(item => {
//     var name = item.name;
//     var price = parseInt(item.price);
//     var count = item.count;
//     str += `
//         <tr class="">
//             <td scope="row">`+ name + `</td>
//             <td>`+ price.toLocaleString('en-US') + `</td>
//             <td>`+ count + `</td>
//             <td>`+ (count * price).toLocaleString('en-US') + `</td>
//             <td><span onclick="deleteItem('`+ name + `')"><i class='bx bxs-folder-minus' ></i></span>
//             </td>
//         </tr>
//         `;
//     tong += (count * price);
//   });
//   str += `
//     <tr>
//         <td colspan="4"><span >Tổng cộng</span></td>
//         <td>`+ tong.toLocaleString('en-US') + `</td>
//     </tr>
//     `;
//   var result = document.getElementById('result');
//   result.innerHTML = str;
// }
// function deleteItem(x) {
//   const arr1 = [];
//   arr.forEach((el) => {
//     if (el.name !== x) {
//       arr1.push(el);
//     }
//   });
//   arr = arr1;
//   loadCart();
// }
// function showDetails() {
//   $('.chitietBtn').click(function (e) {
//     e.preventDefault();
//     var id = $(this).attr('data-id');
//     localStorage.setItem('idProduct', id);
//   });
// }

var page = 0;
$(document).ready(function () {
  loadData();
});

//Hiện sản phầm
function loadData() {
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
      var products = res.products.data;
      str = '';
      products.forEach((el) => {
        str += `<div class="col-md-3">
                <div class="product product2">
                    <a class="product" style="text-decoration:none; height:40vh" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">
                        <img class="w-60"
                          src="https://students.trungthanhweb.com/images/`+ el['images'] + `"
                          alt="" />
                          </a>
                    <a style="text-decoration:none" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">
                    <h4>`+ el['name'] + `</h4></a>
                    <p style="color: red;font-weight:bold">`+ el['price'].toLocaleString('en-US') + ` đ</p>
                    <p> `+ el['catename'] + `</p>
                    <p> `+ el['brandname'] + `</p>
                    <a href="../Productdetails/productDetails.html?id=`+ el['id'] + `"class="btn btn-primary chitietBtn" data-id="` + el['id'] + `">
                        Chi tiết
                    </a>
                    <button class="btn btn-success addToCart" data-id="`+ el['id'] + `">
                        Thêm
                    </button>
                </div>
            </div>`;
      });
      $('#filterBtn-2').click(function (e) {
        e.preventDefault();
        var filterInput = $("#filter-2").val().trim();
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
            title: 'Bộ lọc không khả dụng'
          })
        }
        else {
          str = '';
          products.forEach((el) => {
            if (Number(el.price) <= Number(filterInput)) {
              str += `<div class="col-md-3">
              <div class="product">
                  <img class="w-60" src="https://students.trungthanhweb.com/images/`+ el['images'] + `"
                      alt="" />
                      <a style="text-decoration:none" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">
                  <h4>`+ el['name'] + `</h4></a>
                  <p style="color: red;font-weight:bold">`+ el['price'].toLocaleString('en-US') + ` đ</p>
                  <p> `+ el['catename'] + `</p>
                  <p> `+ el['brandname'] + `</p>
                  <a href="../Productdetails/productDetails.html?id=`+ el['id'] + `"class="btn btn-primary chitietBtn" data-id="` + el['id'] + `">
                      Chi tiết
                  </a>
                  <a href="#" class="btn btn-success addToCart" data-id="`+ el['id'] + `">
                      Thêm
                  </a>
              </div>
          </div>`;
            }
          });
        }
      });
      $('#resultProduct').append(str);
      showMore();
      addToCart();
      //showDetails();
    },
  })
}

//Xem thêm sản phẩm
function showMore() {
  $('#showMoreBtn').click(function (e) {
    e.preventDefault();
    page++;
    $.ajax({
      type: "GET",
      url: host + "home",
      data: {
        apitoken: localStorage.getItem('token'),
        page: page
      },
      dataType: "JSON",
      success: function (res) {
        var products = res.products.data;
        if (products.length == 0) {
          $('#showMoreBtn').hide();
        }
        str = '';
        products.forEach((el) => {
          str += `<div class="col-md-3">
                <div class="product product2">
                    <a class="product" style="text-decoration:none;color:blue;text-weight:bold" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">
                    <img class="w-60"
                        src="https://students.trungthanhweb.com/images/`+ el['images'] + `"
                        alt="" />
                      </a>
                        <a style="text-decoration:none" href="../Productdetails/productDetails.html?id=`+ el['id'] + `">
                    <h4>`+ el['name'] + `</h4></a>
                    <p style="color: red;font-weight:bold">`+ el['price'].toLocaleString('en-US') + ` đ</p>
                    <p> `+ el['catename'] + `</p>
                    <p> `+ el['brandname'] + `</p>
                    <a href="../Productdetails/productDetails.html?id=`+ el['id'] + `"class="btn btn-primary chitietBtn" data-id="` + el['id'] + `">
                        Chi tiết
                    </a>
                    <a href="#" class="btn btn-success addToCart" data-id="`+ el['id'] + `">
                        Thêm
                    </a>
                </div>
            </div>`;
        });

        $('#resultProduct').append(str);
        addToCart();
      }
    });
  });
}
