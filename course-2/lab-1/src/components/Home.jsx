import React, { useState } from 'react';
import Navbar from './Navbar';
import Container from 'react-bootstrap/Container';

function Home(props) {
    const [todo, setTodo] = useState([]);
    const [item, setItem] = useState([]);
    const addTodo = () => {
        setTodo(todo => [...todo, item]);
    }
    return (
        <div>
            <Navbar name={props.name} />
            <Container>
                <div className='mt-4 row w-100'>
                    <div className="col-md-8">
                        <input type="text" className="form-control" placeholder='Todo' onKeyUp={(e) => setItem(e.target.value)} id="" />
                    </div>
                    <div className="col-md">
                        <button className='btn btn-primary w-50' onClick={addTodo}>Thêm</button>
                    </div>
                    <div className="row mt-3 ms-3">
                        {todo && todo.map(item => (
                            <li key={item.id}>
                                {item}
                            </li>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Home;
