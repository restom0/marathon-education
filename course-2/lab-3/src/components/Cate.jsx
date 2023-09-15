import React, { useEffect, useState } from 'react'
import { Pagination } from 'react-bootstrap'
import Swal from 'sweetalert2';
var max_page = 1;
function Cate() {
    var id = new URLSearchParams(window.location.search).get('id');
    var page = new URLSearchParams(window.location.search).get('page');
    const [paging, setPaging] = useState(false);
    const [num, setNum] = useState([]);
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
    const loadData = () => {
        fetch("https://students.trungthanhweb.com/api/getCateProducts?apitoken=" + localStorage.getItem('token') + "&id=" + id + "&page=" + page).then(res => res.json()).then((res) => {
            if (res.products.data.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hiện tại trang đang bảo trì!',
                }).then(() => {
                    window.location.replace("/home")
                });
            }
            else {
                localStorage.setItem('last_page', res.products.last_page);
                setPaging(true);
                for (let i = 1; i <= Number(res.products.last_page); i++) {
                    setNum([...num, i]);
                }
            }
        })
    }
    console.log(num);
    useEffect(() => {
        loadData();
    })
    return (
        <div>
            <div class="banner">
                <h1 className="text-center"></h1>
                <hr />
                <div class="row" id="resultProduct">
                </div>
                <Pagination style={{ float: "right" }}>
                    <Pagination.First />
                    <Pagination.Prev />
                    {
                        paging === true ?
                            num.map((el) => (
                                <Pagination.Item>{el}</Pagination.Item>
                            ))
                            : <div></div>
                    }
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </div>
        </div>
    )
}

export default Cate