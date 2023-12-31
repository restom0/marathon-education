import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { Container } from 'react-bootstrap';

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
    const [input, setInput] = useState('');
    const [searchResult, setSearchResult] = useState(false);
    const [filter, setFilter] = useState('');
    const [below, setBelow] = useState(0);
    const [above, setAbove] = useState(1000000000000);
    const [count, setCount] = useState(0);
    const [result, setResult] = useState({});

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch])

    const loadProduct = products.data && products.data.map((el, index) =>
        <Col className="col-md-3 text-center mb-3" key={index} >
            <div className="product product2">
                <a className="product" style={{ textDecoration: "none", height: "40vh" }} href={"/productDetails?id=" + el['id']}>
                    <Image
                        src={"https://students.trungthanhweb.com/images/" + el['images']}
                        fluid className='img-fluid' />
                </a>
                <a style={{ textDecoration: "none" }} href={"/productDetails?id=" + el['id']}>
                    <h4>{el['name']}</h4></a>
                <p style={{ color: "red", fontWeight: "bold" }}>{parseInt(el['price']).toLocaleString('en-US')} đ</p>
                <p>{el['catename']}</p>
                <p>{el['brandname']}</p>
                <Button href={"/productDetails?id=" + el['id']} className="me-2" variant='primary'>Chi tiết</Button>
                <Button className="ms-2" variant='success' onClick={() => addToCart(parseInt(el['id']))}>Thêm</Button>
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
            arr = JSON.parse(localStorage.getItem('cart'));
            var check = 0;
            arr.forEach(el => {
                if (el.id === id) {
                    el.qty++;
                    check = 1;
                }
            });
            if (check === 0) {
                item = { id: id, qty: 1 };
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
    const searchItem = () => {
        if (input === '') {
            Toast.fire({
                icon: 'error',
                title: 'Giá trị nhập không khả dụng'
            })
        }
        else {
            fetch("https://students.trungthanhweb.com/api/getSearchProducts?apitoken=" + localStorage.getItem('token') + "&name=" + input).then(res => res.json()).then((res) => {
                if (res.result.length === 0) {
                    setSearchResult(false);
                }
                else {
                    setSearchResult(true);
                    setResult(res.result);
                    setFilter(false);
                    setAbove(0);
                    setBelow(1000000000000);
                }
            })
        }
    }
    const loadResult = result && result.length > 0 && result.map((el, index) =>
        <Col className="col-md-3 text-center mb-3" key={index} >
            <div className="product product2">
                <a className="product" style={{ textDecoration: "none", height: "40vh" }} href={"/productDetails?id=" + el['id']}>
                    <Image
                        src={"https://students.trungthanhweb.com/images/" + el['image']}
                        fluid className='img-fluid' />
                </a>
                <a style={{ textDecoration: "none" }} href={"/productDetails?id=" + el['id']}>
                    <h4>{el['name']}</h4></a>
                <p style={{ color: "red", fontWeight: "bold" }}>{parseInt(el['price']).toLocaleString('en-US')} đ</p>
                <p>{el['catename']}</p>
                <p>{el['brandname']}</p>
                <Button href={"/productDetails?id=" + el['id']} className="me-2" variant='primary'>Chi tiết</Button>
                <Button className="ms-2" variant='success' onClick={() => addToCart(parseInt(el['id']))}>Thêm</Button>
            </div>
        </Col>
    )
    return (
        <div>
            <h1 className='text-center'>Sản phẩm</h1>
            <Row>
                <Col className='col-md-2 ms-4'>
                    <Form className="d-flex mb-3">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button variant="outline-success" className="me-2" onClick={() => { searchItem() }}>Search</Button>
                    </Form>
                    <Row>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">Giá sàn</InputGroup.Text>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                onChange={(e) => setAbove(e.target.value) && setAbove(0)}
                            />
                        </InputGroup>
                    </Row>
                    <Row>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">Giá trần</InputGroup.Text>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                onChange={(e) => setBelow(e.target.value) && setBelow(1000000000000)}
                            />
                        </InputGroup>
                    </Row>
                    <Row>
                        <Button className="outline-primary" style={{ marginTop: "0px" }} onClick={() => setFilter(true)}>Áp dụng</Button>
                    </Row>
                </Col>
                <Col className='col-md-9'><Row>
                    {
                        searchResult === true ?
                            loadResult :
                            loadProduct
                    }{
                        searchResult === true ?
                            <div></div>
                            :
                            <Button style={{ border: "none", margin: "30px auto" }} className="w-25" variant='outline-primary' onClick={() => showMore()} disabled={isLoading}>{isLoading ? "" : "Xem thêm..."}</Button>
                    }

                </Row></Col>
            </Row>
        </div>
    )
};

export default Product