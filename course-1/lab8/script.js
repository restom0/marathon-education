var arr = [];
const buttons = document.querySelectorAll('.addtoCart');
for (let i = 0; i < buttons.length; i++) {
    const el = buttons[i];
    el.addEventListener('click', () => {
        const item = {}; 
        item.id = el.getAttribute('data-id');
        item.name = el.getAttribute('data-name');
        item.price = el.getAttribute('data-price');
        item.count = 1;
        let check = false;
        arr.forEach((i) => {
          if (i.name == item.name) {
            i.count = i.count + 1;
            check = true;
          }
        });
    
        if (!check) {
          arr.push(item);
        }
        alert('Sản phẩm đã được thêm');
        hienThiGioHang();
      });
}

function hienThiGioHang(){
    var str=``;
    var tong=0;
    arr.forEach(item => {
        var name=item.name;
        var price=parseInt(item.price);
        var count=item.count;
        str+=`
        <tr class="">
            <td scope="row">`+name+`</td>
            <td>`+price.toLocaleString('en-US')+`</td>
            <td>`+count+`</td>
            <td>`+(count*price).toLocaleString('en-US')+`</td>
            <td><span onclick="deleteItem('`+name+`')"><i class='bx bxs-folder-minus' ></i></span>
            </td>
        </tr>
        `;
        tong+=(count*price);
    });
    str+=`
    <tr>
        <td colspan="4"><span >Tổng cộng</span></td>
        <td>`+tong.toLocaleString('en-US')+`</td>
    </tr>
    `;
    var result=document.getElementById('result');
    result.innerHTML=str;
}
function deleteItem(x){
    const arr1 = [];
    arr.forEach((el) => {
      if (el.name !== x) {
        arr1.push(el);
      }
    });
    arr = arr1;
    hienThiGioHang();
}