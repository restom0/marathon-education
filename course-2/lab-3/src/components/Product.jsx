import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { Button, Col, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { getProducts, updateProducts } from '../redux/productSlice';

function Product() {
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

    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.product);
    const [page, setPage] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch])
    const loadProduct = products.data && products.data.map((el, index) =>
        <Col className="col-md-3 text-center" key={index} >
            <div className="product product2">
                <a className="product" style={{ textDecoration: "none", height: "40vh" }} href={"/productDetails?id=" + el['id']}>
                    <Image style={{ height: "40vh", width: "40vh" }}
                        src={"https://students.trungthanhweb.com/images/" + el['images']}
                        fluid />
                </a>
                <a style={{ textDecoration: "none" }} href={"/productDetails?id=" + el['id']}>
                    <h4>{el['name']}</h4></a>
                <p style={{ color: "red", fontWeight: "bold" }}>{parseInt(el['price']).toLocaleString('en-US')} đ</p>
                <p>{el['catename']}</p>
                <p>{el['brandname']}</p>
                <Button href={"/productDetails?id=" + el['id']} className="btn btn-primary me-2" size='lg' data-id={el['id']} >
                    Chi tiết
                </Button>
                <Button className="btn btn-success ms-2" size='lg' onClick={() => addToCart(parseInt(el['id']))}>
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
        // loadCart();
        Toast.fire({
            icon: 'success',
            title: 'Mua thành công'
        }).then(() => {
            window.location.reload();
        })
    }
    const showMore = () => {
        setPage(page + 1);
        if (page > products.last_page) {
            setIsLoading(true);
        }
        var data = new URLSearchParams();
        data.append('apitoken', localStorage.getItem('token'));
        data.append('page', page);
        fetch("https://students.trungthanhweb.com/api/home?" + data).then(res => res.json()).then((res) => {
            var newProducts = res.products.data;
            dispatch(updateProducts(newProducts));
        })
    }
    return (
        <div>
            <div>
                <h1 className='text-center'>Sản phẩm</h1>
                <Row>
                    {loadProduct}
                </Row>
            </div>
            <div className="row w-100 mt-3">
                <button style={{ border: "none", margin: "30px auto" }} type="button" className="btn btn-outline-primary w-25"
                    onClick={() => showMore()} disabled={isLoading}>{isLoading ? "" : "Xem thêm..."}</button>

            </div>
        </div>
    )
};
export default Product