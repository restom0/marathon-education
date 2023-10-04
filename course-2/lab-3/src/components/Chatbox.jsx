import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Image, InputGroup, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { getChat } from '../redux/chatSlice';
function Chatbox() {
    const [input, setInput] = useState('');
    const [respond, setRepond] = useState('');
    const { chat, loading } = useSelector((state) => state.chat);
    const bottomRef = useRef(null);

    const dispatch = useDispatch();
    const addChat = () => {
        if (input !== '') {
            var data = new URLSearchParams();
            data.append('id', localStorage.getItem('idRole'));
            data.append('mess', input);
            return fetch('https://students.trungthanhweb.com/api/sendchat', {
                method: 'POST',
                headers: { "Content-Type": 'application/x-www-form-urlencoded' },
                body: data
            }).then(res => res.json()).then((res) => {
                if (res.length !== 0) {
                    setInput('');
                    dispatch(getChat());
                }
            })
        }
    };
    const loadChat = chat && chat.map((item) => (
        <ListGroup.Item >
            <Row align="end" className='justify-content-end'>
                <Col className='col-md-10' style={{ height: "auto", paddingRight: 0 }}>
                    <p className=' rounded' style={{ height: "auto", border: "1px solid black", display: "inline-block", paddingLeft: "10px", paddingRight: "10px" }}>{item.question}</p>
                </Col>
                <Col className='col-md-1' style={{ paddingLeft: 0 }}>
                    <box-icon name='user' type='solid' style={{ border: "1px solid black", height: "4vh", width: "4vh", borderRadius: "100%" }} ></box-icon>
                </Col>
            </Row>
            <br />
            <br />
            <Row>
                <Col className='col-md-1' style={{ paddingRight: 0 }}>
                    <box-icon name='bot' style={{ border: "1px solid black", height: "4vh", width: "4vh", borderRadius: "100%" }} ></box-icon>
                </Col>
                <Col className='col-md-10' style={{ height: "auto", paddingLeft: 0 }}>
                    <p className=' rounded ms-1' style={{ height: "auto", border: "1px solid black", display: "inline-block", paddingLeft: "10px", paddingRight: "10px" }}>{item.response}</p>

                </Col>
            </Row>
        </ListGroup.Item>
    ));
    useEffect(() => {
        dispatch(getChat());
    }, [dispatch])
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat])
    return (
        <div>
            <ListGroup variant="flush" style={{ height: "50vh", overflow: "scroll", overflowX: 'hidden' }}>
                <ListGroup.Item>
                    <Row>
                        <Col className='col-md-1' style={{ paddingRight: 0 }}>
                            <box-icon name='bot' style={{ border: "1px solid black", height: "4vh", width: "4vh", borderRadius: "100%" }} ></box-icon>
                        </Col>
                        <Col className='col-md-10' style={{ height: "auto", paddingLeft: 0 }}>
                            <p className=' rounded ms-1' style={{ height: "auto", border: "1px solid black", display: "inline-block", paddingLeft: "10px", paddingRight: "10px" }}>Xin chào, tôi có thể giúp gì cho bạn </p>

                        </Col>
                    </Row>
                </ListGroup.Item>
                {loadChat}
                <div ref={bottomRef} />
            </ListGroup>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Nhập tin nhắn"
                    aria-label="Nhập tin nhắn"
                    aria-describedby="basic-addon2" onChange={(e) => setInput(e.target.value)}
                />
                <Button variant="outline-success" id="button-addon2" onClick={addChat}>
                    Gửi
                </Button>
            </InputGroup>
        </div>
    )
}

export default Chatbox