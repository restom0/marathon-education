import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Container from 'react-bootstrap/Container';
import Swal from "sweetalert2";
function Home(props) {
    const [todo, setTodo] = useState([]);
    const [item, setItem] = useState('');
    const [id, setId] = useState();
    const [edit, setEdit] = useState(false);
    const [login, setLogin] = useState(false);
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
        if (localStorage.getItem('token') && localStorage.getItem('token') != null) {
            setLogin(true);
        }
    }

    const getTodo = () => {
        fetch('https://students.trungthanhweb.com/api/todo?apitoken=' + localStorage.getItem('token'))
            .then((res) => res.json()).then((res) => {
                if (res.check === true) {
                    setTodo(res.todo);
                }
            });
    }
    const todoList = todo.map((item, index) =>
        <tr key={index}>
            <th>{++index}</th>
            <td>{item.note}</td>
            <td>{
                item.status == 1 ?
                    <input type="checkbox" checked disabled name="" id="" />
                    :
                    <input type="checkbox" onChange={() => statusTodo(item.id)} name="" id="" />
            }</td>
            <td><button className='btn btn-danger' onClick={() => deleteTodo(item.id)}>Xóa</button>
                <button className='btn btn-warning ms-3' onClick={() => updateTodo(item.id, item.note)} >Sửa</button></td>
        </tr>
    )

    const addTodo = () => {
        var data = new URLSearchParams();
        data.append('apitoken', localStorage.getItem('token'));
        data.append('todo', item);
        fetch('https://students.trungthanhweb.com/api/todo', {
            method: 'POST',
            headers: { "Content-Type": 'application/x-www-form-urlencoded' },
            body: data
        }).then(res => res.json()).then((res) => {
            if (res.check === true) {
                Toast.fire({
                    icon: 'success',
                    title: 'Thêm thành công'
                }).then(() => { getTodo(); });
            }
            else if (res.msg.apitoken) {
                Toast.fire({
                    icon: 'error',
                    title: res.msg.apitoken
                })
            }
            else if (res.msg.todo) {
                Toast.fire({
                    icon: 'error',
                    title: res.msg.todo
                })
            }
        });
    }
    const deleteTodo = (i) => {
        Swal.fire({
            icon: 'question',
            title: 'Xóa todo ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Xóa',
            denyButtonText: `Không`,
        }).then((result) => {
            if (result.isConfirmed) {
                var data = new URLSearchParams();
                data.append('apitoken', localStorage.getItem('token'));
                data.append('id', i);
                fetch('https://students.trungthanhweb.com/api/deletetodo', {
                    method: 'POST',
                    headers: { "Content-Type": 'application/x-www-form-urlencoded' },
                    body: data
                }).then(res => res.json()).then((res) => {
                    if (res.check === true) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Xóa thành công'
                        }).then(() => { getTodo(); });
                    }
                    else if (res.msg.apitoken) {
                        Toast.fire({
                            icon: 'error',
                            title: res.msg.apitoken
                        })
                    }
                    else if (res.msg.id) {
                        Toast.fire({
                            icon: 'error',
                            title: res.msg.id
                        })
                    }
                });
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }
    const updateTodo = (i, old) => {
        setId(i);
        setEdit(true);
        setItem(old);
    }
    const updateSubmitTodo = () => {
        var data = new URLSearchParams();
        data.append('apitoken', localStorage.getItem('token'));
        data.append('todo', item);
        data.append('id', id);
        fetch('https://students.trungthanhweb.com/api/updatetodo', {
            method: 'POST',
            headers: { "Content-Type": 'application/x-www-form-urlencoded' },
            body: data
        }).then(res => res.json()).then((res) => {
            if (res.check === true) {
                Toast.fire({
                    icon: 'success',
                    title: 'Sửa thành công'
                }).then(() => { getTodo(); setEdit(false) });
            }
            else if (res.msg.apitoken) {
                Toast.fire({
                    icon: 'error',
                    title: res.msg.apitoken
                })
            }
            else if (res.msg.todo) {
                Toast.fire({
                    icon: 'error',
                    title: res.msg.todo
                })
            }
            else if (res.msg.id) {
                Toast.fire({
                    icon: 'error',
                    title: res.msg.id
                })
            }
        });
    }
    const statusTodo = (i) => {
        Swal.fire({
            icon: 'question',
            title: 'Hoàn thành task ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Hoàn thành',
            denyButtonText: `Không`,
        }).then((result) => {
            if (result.isConfirmed) {
                var data = new URLSearchParams();
                data.append('apitoken', localStorage.getItem('token'));
                data.append('id', i);
                fetch('https://students.trungthanhweb.com/api/statusTodo', {
                    method: 'POST',
                    headers: { "Content-Type": 'application/x-www-form-urlencoded' },
                    body: data
                }).then(res => res.json()).then((res) => {
                    if (res.check === true) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Đã hoàn thành task'
                        }).then(() => {
                            setItem('');
                            getTodo();
                        }
                        );
                    }
                    else if (res.msg.apitoken) {
                        Toast.fire({
                            icon: 'error',
                            title: res.msg.apitoken
                        })
                    }
                    else if (res.msg.id) {
                        Toast.fire({
                            icon: 'error',
                            title: res.msg.id
                        })
                    }
                    else if (result.isDenied) {
                        Swal.fire('Trở về trang chính', '', '')

                    }
                });
            }
        });
    }
    useEffect(() => {
        checkLogin();
        getTodo();
    }, []);
    return (
        <div>
            <Navbar name={props.name} />
            <Container>
                <div className='mt-4 row w-100'>
                    <div className='row mt-3 ms-3'>
                        <div className="col-md-8">
                            <input type="text" className="form-control" value={item} placeholder='Todo' onChange={(e) => setItem(e.target.value)} id="" />
                        </div>
                        <div className="col-md">
                            {edit === true ?
                                <button className='btn btn-warning w-50' onClick={updateSubmitTodo} >Sửa</button>
                                :
                                <button className='btn btn-primary w-50' onClick={addTodo}>Thêm</button>}
                        </div>
                    </div>
                    <div className="row mt-3 ms-3">
                        {/* {todo && todo.map(item => (
                            <li key={item.id}>
                                {item}
                            </li>
                        ))} */}
                        {/* {todo && todo.length > 0 &&
                            <ul>
                                {todoList}
                            </ul>
                        } */}
                        {todo && (
                            <table className="table">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Todo</th>
                                        <th scope="col">Tình trạng</th>
                                        <th scope="col">Tùy chỉnh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todoList}
                                </tbody>
                            </table>)}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Home;
