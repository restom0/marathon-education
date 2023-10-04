import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getCarts, deleteItems } from '../redux/cartSlice';
import { Button, Form, Image, InputGroup, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';

function Checkout() {
  const [change, setChange] = useState(true);
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
  const { carts, loading2 } = useSelector((state) => state.cart);

  const [showCheckout, setCheckout] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const handleCloseCheckout = () => setCheckout(false);
  const handleShowCheckout = () => setCheckout(true);

  const loadCart1 = () => {
    setChange(false);
    if (localStorage.getItem('cart')) {
      var localCart = JSON.parse(localStorage.getItem('cart'));
      if (localCart != null) {
        var id = [];
        localCart.forEach(el => {
          id.push([el.id, el.qty]);
        });
      }
      localStorage.setItem('productId', JSON.stringify(id));
      dispatch(getCarts());
    }
  }

  useEffect(() => {
    if (change === true) { loadCart1(); }

  }, []);
  var sum = 0;
  carts && carts.map((item) => {
    sum += item[6];
  })
  const loadCart = carts && carts.map((item, index) => (
    <tr key={index}>
      <td style={{ width: "20%" }}><img style={{ width: "50%" }} src={item[3]} alt="" /></td>
      <td>{item[1]}</td>
      <td>{parseInt(item[5]).toLocaleString('en-US')} đ</td>
      <td>{parseInt(item[4])}</td>
      <td>{(parseInt(item[6])).toLocaleString('en-US')} đ</td>
      <td><Button variant='danger' onClick={() => deleteItem(item[0])}>Xóa</Button>
      </td>
    </tr >))

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
  const finishOrder = () => {
    // var contact = JSON.parse(localStorage.getItem("contact"));
    // if (contact) {
    if (!phone.match(/(0[3|5|7|9])+([0-9]{8})\b/g)) {
      Toast.fire({
        icon: 'error',
        title: 'Số điện thoại không khả dụng'
      })
    }
    else if (name === '' || phone === '' || address === '') {
      Toast.fire({
        icon: 'error',
        title: 'Thông tin không đầy đủ'
      })
    }
    else {
      var data = new URLSearchParams();
      data.append('apitoken', localStorage.getItem('token'));
      data.append('tenKH', name);
      data.append('phone', phone);
      data.append('address', address);
      data.append('cart', localStorage.getItem("productId"));
      return fetch('https://students.trungthanhweb.com/api/createBill', {
        method: 'POST',
        headers: { "Content-Type": 'application/x-www-form-urlencoded' },
        body: data
      }).then(res => res.json()).then((res) => {
        console.log(res);
        if (res.check === true) {
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
            icon: 'success',
            title: 'Đặt hàng thành công'
          }).then(() => {
            localStorage.removeItem('cart');
            localStorage.removeItem('productId');
            window.location.replace('/home');
          })
        }
        else {

          Toast.fire({
            icon: 'warning',
            title: 'Đặt hàng thất bại'
          })
        }
      });
    }
  }
  return (
    <div>
      <Modal show={showCheckout} onHide={handleCloseCheckout} >
        <Modal.Header closeButton>
          <Modal.Title>Tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Họ và tên
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Số điện thoại
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onChange={(e) => setPhone(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Địa chỉ
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onChange={(e) => setAddress(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCheckout}>
            Close
          </Button>
          <Button variant="success" onClick={finishOrder}>
            Đặt hàng
          </Button>
        </Modal.Footer>
      </Modal>
      <h1>Giỏ mua hàng</h1>
      <div id="cartContainer">
        <Table responsive="sm">
          <thead>
            <tr>
              <th scope="col">#</th>
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

                <td><Button variant='success' className="success" onClick={handleShowCheckout}>
                  Thanh toán
                </Button></td>
              </tr>
            }
          </tbody>
        </Table>
      </div></div>
  )
}

export default Checkout