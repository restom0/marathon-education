import React, { useState } from 'react'
import Swal from 'sweetalert2';
import "../css/login.css"
import { Button, Form, InputGroup } from 'react-bootstrap';
function Login() {
    if (localStorage.getItem('token') || localStorage.getItem('token') != null) {
        window.location.replace('/home');
    }

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

    const [email, setEmail] = useState('');

    const checkLogin = () => {
        if (!email || email === '') {
            Toast.fire({
                icon: 'error',
                title: 'Chưa nhập email'
            })
        }
        else {
            var data = new URLSearchParams();
            data.append('email', email);
            localStorage.setItem('email', email);
            fetch('https://students.trungthanhweb.com/api/checkLoginhtml', {
                method: 'POST',
                headers: { "Content-Type": 'application/x-www-form-urlencoded' },
                body: data
            }).then(res => res.json()).then((res) => {
                if (res.check === true) {
                    localStorage.setItem('token', res.apitoken);
                    Toast.fire({
                        icon: 'success',
                        title: 'Đăng nhập thành công'
                    }).then(() => {
                        window.location.replace("/home");
                    })
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: 'Đăng nhập thất bại'
                    })
                }
            });
        }
    }

    return (
        <div className="wrapper">
            <div className="container1 p-2">
                <div className="col-md-3">
                    <img src="" alt="" className="w-100" />
                </div>
                <div className="mb-3">
                    <h1 className='text-center mb-5'>Login Account</h1>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            <Form.Control
                                placeholder="nguyenvana@gmail.com"
                                aria-label="nguyenvana@gmail.com"
                                aria-describedby="basic-addon1"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputGroup>
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>

                    <button type="submit" className="btn btn-primary w-100" onClick={checkLogin}>Submit</button>

                </div>
            </div>
        </div>
    )
}

export default Login