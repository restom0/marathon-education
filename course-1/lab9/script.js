var arr=[];
function addToCart(x,y){
    var str= 'Tên sản phâm là : ';
    var tenSP = x;
    var giaSP = y;
    var item = Object();
    item.ten = tenSP;
    item.gia = giaSP;
    item.gia = giaSP;
    item.soLuong=1;
    var check = 0;
    arr.forEach(el => {
        if(el.ten==tenSP){
            el.soLuong =el.soLuong+1;
            check=1;
        }
    });
    // ============Check =? 1
    if(check==0){
        arr.push(item);
    }
    alert("Sản phẩm đã được thêm");
    hienThiGioHang();
}
function hienThiGioHang(){
    var str=``;
    var tong=0;
    arr.forEach(el => {
        var ten=el.ten;
        var gia=el.gia;
        var soLuong=el.soLuong;
        str+=`
        <tr class="">
            <td scope="row">`+ten+`</td>
            <td>`+gia.toLocaleString('en-US')+`</td>
            <td>`+soLuong+`</td>
            <td>`+(soLuong*gia).toLocaleString('en-US')+`</td>
            <td><span onclick="deleteItem('`+ten+`')"><i class='bx bxs-folder-minus' ></i></span>
            </td>
        </tr>
        `;
        tong+=(soLuong*gia);
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
    var arr1=[];
    arr.forEach(el => {
        if(el.ten!=x){
            arr1.push(el);
        }
    });
    arr=arr1;
    hienThiGioHang();
}