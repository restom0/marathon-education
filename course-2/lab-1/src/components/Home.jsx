import React, { useState } from 'react';
import Navbar from './Navbar';
import Container from 'react-bootstrap/Container';
import Swal  from "sweetalert2";
function Home(props) {
    const [todo, setTodo] = useState([]);
    const [item, setItem] = useState([]);
    const todoList = todo.map((item, index) =>
        <tr>
            <th>{++index}</th>
            <td>{item.todo}</td>
            <td>{
                item.status === 0 ?
                    <input type="checkbox" onChange={(e)=>updateTodo(index-1,e)} name="" id="" />
                    :
                    <input type="checkbox" checked disabled name="" id="" />
            }</td>
            <td><button className='btn btn-danger' onClick={() => deleteTodo(item.id)}>Xóa</button></td>
        </tr>
    )

    const addTodo = () => {
        var item1 = new Object();
        item1.id = Date.now();
        item1.todo = item;
        item1.status = 0;
        setTodo(todo => [...todo, item1]);
    }
    const deleteTodo = (i) => {
        Swal.fire({
            icon:'question',
            title: 'Xóa todo ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Xóa',
            denyButtonText: `Không`,
          }).then((result) => {
            if (result.isConfirmed) {
                setTodo((current) =>
                current.filter((todo) => todo.id !== i))
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          })
        
    }
    const updateTodo = (i,e) => {
        todo[i]['status'] =1;
        const todoList = todo.map((item, index) =>
        <tr>
            <th>{++index}</th>
            <td>{item.todo}</td>
            <td>{
                item.status === 0 ?
                    <input type="checkbox" onChange={(e)=>updateTodo(index-1,e)} name="" id="" />
                    :
                    <input type="checkbox" checked disabled name="" id="" />
            }</td>
            <td><button className='btn btn-danger' onClick={() => deleteTodo(item.id)}>Xóa</button></td>
        </tr>
    )
    }
    return (
        <div>
            <Navbar name={props.name} />
            <Container>
                <div className='mt-4 row w-100'>
                    <div className='row mt-3 ms-3'>
                        <div className="col-md-8">
                            <input type="text" className="form-control" placeholder='Todo' onChange={(e) => setItem(e.target.value)} id="" />
                        </div>
                        <div className="col-md">
                            <button className='btn btn-primary w-50' onClick={addTodo}>Thêm</button>
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
