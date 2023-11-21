import React, { useState } from 'react'
import Icon from '../components/Icon'
import "../components/style/Icon.css"
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
function Login() {
    var url = 'http://127.0.0.1:8000/api'
    const notyf = new Notyf({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const checkLogin = () => {
        if (email === '') {
            notyf.open({
                type: 'error',
                message: 'Thiếu email'
            });
        }
        else if (password === '') {
            notyf.open({
                type: 'error',
                message: 'Thiếu mật khẩu'
            });
        }
        else {
            axios({
                method: 'post',
                url: url + '/checkLogin',
                data: {
                    email: email,
                    password: password
                }
            }).then((res) => {
                if (res.data.check === true) {
                    var user = {
                        email: email,
                        token: res.data.token
                    }
                    notyf.open({
                        type: 'success',
                        message: 'Đăng nhập thành công'
                    })

                    localStorage.setItem('user', JSON.stringify(user))
                    setTimeout(function () {
                        window.location.href = '/dashboard';
                    }, 1000);
                }
                else if (res.data.msg.email) {
                    notyf.open({
                        type: 'success',
                        message: res.msg.email
                    });
                }
                else if (res.data.msg.password) {
                    notyf.open({
                        type: 'success',
                        message: res.msg.password
                    });
                }
            })
        }
    }
    return (
        <Container>
            <div className='border mx-auto mt-5' style={{ height: "50vh" }}>
                <Row className='p-3' >
                    <Col className='text-center'>
                        <Icon className="mx-auto" fluid />
                    </Col>
                    <Col className="">
                        <form className='mt-5 me-5'>
                            <div className="mb-3">
                                <input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                            </div>
                            <button type="button" onClick={checkLogin} className="btn btn-primary">Submit</button>
                        </form>
                    </Col>
                </Row>
            </div>
        </Container >

    )
}

export default Login