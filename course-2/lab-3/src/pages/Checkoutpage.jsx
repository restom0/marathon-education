import React from 'react';

import Navbar1 from '../components/Navbar';
import Container from 'react-bootstrap/Container';
import Checkout from '../components/Checkout';
import Footer1 from '../components/Footer';
function Checkoutpage() {
  return (
    <div>
      <Navbar1 />
      <Container style={{ marginTop: "5vh" }}>
        <Checkout />
      </Container>
      <Footer1 />
    </div>
  )
}

export default Checkoutpage