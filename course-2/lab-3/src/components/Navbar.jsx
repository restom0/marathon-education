import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import { Col, Row, Table } from 'react-bootstrap';

import Swal from 'sweetalert2';
import 'boxicons'
import { getCates } from '../redux/cateSlice';
import { getBrands } from '../redux/brandSlice';
import { getCarts, deleteItems } from '../redux/cartSlice';

function Navbar1(props) {
    if (!localStorage.getItem('token') || localStorage.getItem('token') == null) {
        window.location.replace('/');
    }
    const dispatch = useDispatch();
    const { cates, loading } = useSelector((state) => state.cate);
    const { brands, loading1 } = useSelector((state) => state.brand);
    const { carts, loading2 } = useSelector((state) => state.cart);
    const [input, setInput] = useState('');
    const [searchResult, setSearchResult] = useState(false);
    const [filter, setFilter] = useState('');
    const [below, setBelow] = useState(0);
    const [above, setAbove] = useState(1000000000000);
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

    const [count, setCount] = useState(0);

    const [result, setResult] = useState({});

    const [showAccount, setAccount] = useState(false);
    const handleCloseAccount = () => setAccount(false);
    const handleShowAccount = () => setAccount(true);

    const [showLog, setShowLog] = useState(false);
    const handleCloseLog = () => setShowLog(false);
    const handleShowLog = () => setShowLog(true);

    const [showSearch, setShowSearch] = useState(false);
    const handleCloseSearch = () => setShowSearch(false);
    const handleShowSearch = () => setShowSearch(true);

    const [showCart, setShowCart] = useState(false);
    const handleCloseCart = () => setShowCart(false);
    const handleShowCart = () => setShowCart(true);

    useEffect(() => {
        dispatch(getCates());
        dispatch(getBrands());
        if (localStorage.getItem('cart')) {
            var localCart = JSON.parse(localStorage.getItem('cart'));
            if (localCart != null) {
                var id = [];
                localCart.forEach(el => {
                    id.push([el.id, el.qty]);
                });
            }
            localStorage.setItem('id', JSON.stringify(id));
            dispatch(getCarts());
        }
        setInterval(() => {
            if (localStorage.getItem('cart')) {
                setCount(JSON.parse(localStorage.getItem('cart')).length);
            }
            else {
                setCount(0);
            }
        }, 1000)
    }, []);
    const loadCate = cates && cates.map((item) =>
        <NavDropdown.Item key={item.id} href={"category?page=1&id=" + item.id} id="">{item.name}</NavDropdown.Item>
    )
    const loadBrand = brands && brands.map((item) =>
        <NavDropdown.Item key={item.id} href={"brand?page=1&id=" + item.id} id="">{item.name}</NavDropdown.Item>
    )
    var sum = 0;
    carts && carts.map((item) => {
        sum += item[6];
    })
    const deleteItem = (id) => {
        Swal.fire({
            icon: 'question',
            title: 'Bạn chắc chứ ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Xóa',
            denyButtonText: `Không`,
        }).then((result) => {
            if (result.isConfirmed) {
                Toast.fire({
                    icon: 'success',
                    title: 'Đã xóa thành công'
                }).then(() => {
                    dispatch(deleteItems(id));
                })
            }
            else if (result.isDenied) {
            }
        });

    }
    const loadCart = carts && carts.map((item, index) =>
        <tr key={index}>
            <td>{item[1]}</td>
            <td>{parseInt(item[5]).toLocaleString('en-US')} đ</td>
            <td>{parseInt(item[4])}</td>
            <td>{(parseInt(item[6])).toLocaleString('en-US')} đ</td>
            <td><Button variant='danger' onClick={() => deleteItem(item[0])}>Xóa</Button>
            </td>
        </tr >)
    const logout = () => {
        if (localStorage.getItem('token') || localStorage.getItem('token') != null) {
            Swal.fire({
                icon: 'question',
                title: 'Đăng xuất ?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Đăng xuất',
                denyButtonText: `Không`,
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('email');
                    Toast.fire({
                        icon: 'success',
                        title: 'Đã đăng xuất thành công'
                    }).then(() => {
                        window.location.replace('/')
                    })
                }
                else if (result.isDenied) {
                }
            });

        }
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
    return (
        <div>
            <Modal show={showAccount} onHide={handleCloseAccount} >
                <Modal.Header closeButton>
                    <Modal.Title>Tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">
                            Email
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={localStorage.getItem('email')}
                            disabled
                            readOnly
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">
                            API
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={localStorage.getItem('token')}
                            disabled
                            readOnly
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAccount}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={logout}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showLog} onHide={handleCloseLog}>
                <Modal.Header closeButton>
                    <Modal.Title>Lịch sử đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLog}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCloseLog}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSearch} onHide={handleCloseSearch} size='xl'>
                <Modal.Header closeButton>
                    <Col>
                        <Modal.Title>Kết quả tìm kiếm</Modal.Title>
                    </Col>
                    <Col></Col>

                </Modal.Header>
                <Modal.Body>
                    {
                        searchResult === true ?
                            <div className="filter">
                                {
                                    <div id="between">
                                        <Row>
                                            <Col>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text id="inputGroup-sizing-default">
                                                        Giá sàn
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        aria-label="Default"
                                                        aria-describedby="inputGroup-sizing-default"
                                                        onChange={(e) => setAbove(e.target.value) && setAbove(0)}
                                                    />
                                                </InputGroup>
                                            </Col>
                                            <Col>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text id="inputGroup-sizing-default">
                                                        Giá trần
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        aria-label="Default"
                                                        aria-describedby="inputGroup-sizing-default"
                                                        onChange={(e) => setBelow(e.target.value) && setBelow(1000000000000)}
                                                    />
                                                </InputGroup>
                                            </Col>
                                            <Col>
                                                <Button className="outline-primary" style={{ marginTop: "0px" }}
                                                    onClick={() => setFilter(true)}>Áp dụng</Button></Col>
                                        </Row>
                                        <br />
                                        <br />
                                    </div>
                                }
                            </div> :
                            <div></div>
                    }
                    <div className=" table-responsive">
                        <table className="table table-primary">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên sản phẩm</th>
                                    <th scope="col">Đơn giá</th>
                                    <th scope="col">Thương hiệu</th>
                                    <th scope="col">Loại thiết bị</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filter === true ?
                                        searchResult == true ?
                                            result && result.map((el) => (
                                                parseInt(el.price) >= parseInt(above) && parseInt(el.price) <= parseInt(below) ?
                                                    <tr>
                                                        <td style={{ width: "20%" }}><img style={{ width: "50%" }} src={"https://students.trungthanhweb.com/images/" + el.image} alt="" /></td>
                                                        <td><a style={{ textDecoration: "none", color: "blue", textWeight: "bold" }} href={"/productDetails?id=" + el['id']}>{el.name}</a></td >
                                                        <td>{el.price.toLocaleString('en-US')} đ</td>
                                                        <td>{el.brandname}</td>
                                                        <td>{el.catename}</td>
                                                    </tr>
                                                    : ""
                                            ))
                                            : <tr>
                                                <td></td>
                                                <td></td>
                                                <td><p className='text-center'>Không có kết quả tìm kiếm</p></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        : searchResult === true ?
                                            result && result.map((el) => (

                                                <tr>
                                                    <td style={{ width: "20%" }}><img style={{ width: "50%" }} src={"https://students.trungthanhweb.com/images/" + el.image} alt="" /></td>
                                                    <td><a style={{ textDecoration: "none", color: "blue", textWeight: "bold" }} href={"/productDetails?id=" + el['id']}>{el.name}</a></td >
                                                    <td>{el.price.toLocaleString('en-US')} đ</td>
                                                    <td>{el.brandname}</td>
                                                    <td>{el.catename}</td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td></td>
                                                <td></td>
                                                <td><p className='text-center'>Không có kết quả tìm kiếm</p></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSearch}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showCart} onHide={handleCloseCart} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Giỏ hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Đơn giá</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Thành tiền</th>
                                <th scope="col">Tùy chỉnh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadCart}
                            {
                                <tr>
                                    <td colSpan="3"><span >Tổng cộng</span></td>
                                    <td>`{sum.toLocaleString('en-US')} đ</td>
                                    <td></td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCart}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCloseCart}>
                        Thanh toán
                    </Button>
                </Modal.Footer>
            </Modal>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand href="/">Hello {props.name}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="/home">Home</Nav.Link>
                            <NavDropdown title="Loại sản phẩm" id="basic-nav-dropdown">
                                {loadCate}
                            </NavDropdown>
                            <NavDropdown title="Thương hiệu" id="basic-nav-dropdown">
                                {loadBrand}
                            </NavDropdown>
                            <NavDropdown title={<box-icon name='user' type='solid' color='#ffffff' ></box-icon>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="" onClick={handleShowAccount}>
                                    Tài khoản
                                </NavDropdown.Item>
                                <NavDropdown.Item href="" onClick={handleShowLog} >
                                    Lịch sử đơn hàng
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="" onClick={logout}>Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button variant="outline-success" className="me-2" onClick={() => { handleShowSearch(); searchItem() }}>Search</Button>
                            <Button variant="outline-success" onClick={handleShowCart}><box-icon name='cart-alt' color='#198754' className="justify-content-center"></box-icon></Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div >
    )
}

export default Navbar1;
