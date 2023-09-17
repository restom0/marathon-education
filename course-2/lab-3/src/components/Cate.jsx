import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Col, Image, Button } from 'react-bootstrap'
import Swal from 'sweetalert2';
import { getCateProducts } from '../redux/cateProductSlice';
import { Row } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
function Cate() {
    var id = new URLSearchParams(window.location.search).get('id');
    var page = new URLSearchParams(window.location.search).get('page');
    localStorage.setItem('id', id);
    localStorage.setItem('page', page);
    const dispatch = useDispatch();

    const [paging, setPaging] = useState(false);

    const { cateProducts, loading } = useSelector((state) => state.cateProduct);
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
    const changePage = (page) => {
        if (localStorage.getItem('page') !== page && page >= 1 && page <= cateProducts.last_page) {
            localStorage.setItem('page', page);
            window.location.replace("/category?page=" + page + "&id=" + localStorage.getItem('id'))
        }
    }
    const loadProduct = cateProducts.data && cateProducts.data.map((el, index) =>
        <Col className="col-md-4 text-center" key={index} >
            <div className="product product2">
                <a className="product" style={{ textDecoration: "none", height: "40vh" }} href={"/productDetails?id=" + el['id']}>
                    <Image style={{ height: "40vh", width: "40vh" }}
                        src={"https://students.trungthanhweb.com/images/" + el['image']}
                        fluid />
                </a>
                <a style={{ textDecoration: "none" }} href={"/productDetails?id=" + el['id']}>
                    <h4>{el['name']}</h4></a>
                <p style={{ color: "red", fontWeight: "bold" }}>{el['price'].toLocaleString('en-US')} đ</p>
                <p>{el['catename']}</p>
                <p>{el['brandname']}</p>
                <Button href={"/productDetails?id=" + el['id']} className="btn btn-primary chitietBtn" data-id={el['id']} >
                    Chi tiết
                </Button>
                <Button className="btn btn-success" onClick={() => addToCart(parseInt(el['id']))}>
                    Thêm
                </Button>
            </div>
        </Col>
    )
    const addToCart = (id) => {
        var arr = [];
        if (!localStorage.getItem('cart') || localStorage.getItem('cart') == null) {
            var item = { id: id, qty: 1 };
            arr.push(item);
            localStorage.setItem('cart', JSON.stringify(arr));
        }
        else {
            var arr = JSON.parse(localStorage.getItem('cart'));
            var check = 0;
            arr.forEach(el => {
                if (el.id === id) {
                    el.qty++;
                    check = 1;
                }
            });
            if (check === 0) {
                var item = { id: id, qty: 1 };
                arr.push(item);
            }
            localStorage.setItem('cart', JSON.stringify(arr));
        }
        Toast.fire({
            icon: 'success',
            title: 'Mua thành công'
        }).then(() => {
            window.location.reload();
        })
    }
    const num = Array.from({ length: cateProducts.last_page }, (_, i) => i + 1);
    useEffect(() => {
        dispatch(getCateProducts());
    }, [])
    return (
        <div>
            <div className="banner">
                <h1 className="text-center"></h1>
                <hr />
                <Row>{loadProduct}</Row>
                <Pagination style={{ float: "right" }}>
                    {
                        parseInt(page) != 1 ?
                            <Pagination.First onClick={() => changePage(1)} />


                            :
                            <div></div>
                    }
                    {
                        parseInt(page) != 1 ?
                            <Pagination.Prev onClick={() => changePage(parseInt(page) - 1)} />
                            :
                            <div></div>
                    }{
                        num.map((el, index = 1) => (
                            <Pagination.Item onClick={() => changePage(el)} key={index} active={parseInt(el) === parseInt(page)}>{el}</Pagination.Item>
                        ))
                    }{
                        parseInt(page) != cateProducts.last_page ?
                            < Pagination.Next onClick={() => changePage(parseInt(page) + 1)} />
                            :
                            <div></div>
                    }
                    {
                        parseInt(page) != cateProducts.last_page ?
                            <Pagination.Last onClick={() => changePage(cateProducts.last_page)} />
                            :
                            <div></div>
                    }

                </Pagination>
            </div>
        </div>
    )
}

export default Cate