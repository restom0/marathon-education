import React, { useState } from 'react'
import Swal from 'sweetalert2';
import "../css/login.css"
function Login() {
    if (localStorage.getItem('token') || localStorage.getItem('token') != null) {
        window.location.replace('/home');
    }
    const [email, setEmail] = useState('');
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
        <div>
            <div className="wrapper">
                <div className="container1 p-2">
                    <div className="col-md-3">
                        <img src="" alt="" className="w-100" />
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control" id="exampleInputEmail1" onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" />
                        <button type="submit" className="btn btn-primary" onClick={checkLogin}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login