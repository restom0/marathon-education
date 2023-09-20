import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Swal from "sweetalert2";
import { addTask, selectTask, editTask, finishTask, deleteTaskSlice } from "../redux/todoSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar1 from '../components/Navbar';

function TodoRedux() {
  const dispatch = useDispatch();
  const [item, setItem] = useState('');
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const todos = useSelector((state) => state.task);

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
  const addTodo = async (e) => {
    e.preventDefault();
    if (!item || item == '') {
      Toast.fire({
        icon: 'error',
        title: 'Chưa nhập todo'
      })
    }
    else {
      var item1 = new Object();
      item1.id = Date.now();
      item1.todo = item;
      item1.status = false;
      Toast.fire({
        icon: 'success',
        title: 'Thêm thành công'
      }).then(() => {
        dispatch(addTask(item1));
        setItem('');
      })
    }
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
        Toast.fire({
          icon: 'success',
          title: 'Thêm thành công'
        }).then(() => {
          dispatch(deleteTaskSlice(i));
        })
      } else if (result.isDenied) {
      }
    })

  }

  const updateTodo = (i, todo) => {
    setId(i);
    setItem(todo);
    setEdit(true);
  }
  const editTodo = async (e) => {
    e.preventDefault();
    Toast.fire({
      icon: 'success',
      title: 'Sửa thành công'
    }).then(() => {
      dispatch(editTask({
        id: id,
        todo: item
      }))
      setItem('');
      setEdit(false);
    })
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
        Toast.fire({
          icon: 'success',
          title: 'Đã hoàn thành task'
        }).then(() => {
          console.log(i);
          dispatch(finishTask(i));
          setItem('');
        })
      }
    });
  }

  // const updateTodo = (i, e) => {
  /////   todo[i]['status'] = 1;
  //   const todoList = todo.map((item, index) =>
  //     <tr>
  //       <th>{++index}</th>
  //       <td>{item.todo}</td>
  //       <td>{
  //         item.status === 0 ?
  //           <input type="checkbox" onChange={(e) => updateTodo(index - 1, e)} name="" id="" />
  //           :
  //           <input type="checkbox" checked disabled name="" id="" />
  //       }</td>
  //       <td><button className='btn btn-danger' onClick={() => deleteTodo(item.id)}>Xóa</button></td>
  //     </tr>
  //   )
  // }
  return (
    <div>
      <Navbar1 />
      <Container>
        <div className='mt-4 row w-100'>
          <div className='row mt-3 ms-3'>
            <div className="col-md-8">
              <input type="text" className="form-control" placeholder='Todo' onChange={(e) => setItem(e.target.value)} id="" />
            </div>
            <div className="col-md">
              {edit === true ?
                <button className='btn btn-warning w-50' onClick={editTodo} >Sửa</button> :
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
                {todos.todos && todos.todos.length > 0 ?
                  todos.todos.map((item, index) =>
                    <tr key={index}>
                      <th>{++index}</th>
                      <td>{item.todo}</td>
                      <td>{
                        item.status === true ?
                          <input type="checkbox" checked disabled name="" id="" />
                          :
                          <input type="checkbox" onChange={() => statusTodo(item.id)} name="" id="" />

                      }</td>
                      <td><button className='btn btn-danger' onClick={() => deleteTodo(item.id)}>Xóa</button>
                        <button className='btn btn-warning ms-3' onClick={() => updateTodo(item.id, todos.todos)} >Sửa</button></td>
                    </tr>
                  ) : <tr></tr>}
                {/* {todoList} */}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TodoRedux;
