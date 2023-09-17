import React from 'react'
import { Col, Row } from 'react-bootstrap'

function Footer1() {
    return (
        <Row className='bg-dark text-white ' style={{ marginTop: '10vh' }}>
            <Col className="text-center w-100 m-0" style={{ height: '30vh' }}>
                <p className="text-light text-bold" style={{ fontSize: '30pt', marginTop: '20vh' }}>Project của @Thái Ngọc Rạng</p>
            </Col>
            <Col style={{ textAlign: 'right' }}>
                <iframe title='Địa chỉ Cellphones'
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125416.29258233657!2d106.6054413070929!3d10.79145350168102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529bb1d45be4f%3A0xd12fc501f18409fb!2sCellphoneS!5e0!3m2!1svi!2s!4v1691809483418!5m2!1svi!2s"
                    width="600" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"></iframe>
            </Col>
        </Row >

    )
}

export default Footer1