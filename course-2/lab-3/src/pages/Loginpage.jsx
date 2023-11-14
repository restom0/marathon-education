import React from 'react'
import Login from "../components/Login";
import { Col, Image, Row } from "react-bootstrap"
function Loginpage() {
  return (
    <div style={{ backgroundImage: 'url(https://as1.ftcdn.net/v2/jpg/03/55/60/70/1000_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg)', height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <Row style={{ height: '100vh' }}>
        <Col></Col>
        <Col style={{ height: '100vh' }}>
          <div className="row" style={{ height: '100vh' }}>
            <Col className="col align-self-center">
              <div className='mx-auto'>
                <Login />
              </div>
            </Col>
            <Col className='col-6'></Col>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Loginpage