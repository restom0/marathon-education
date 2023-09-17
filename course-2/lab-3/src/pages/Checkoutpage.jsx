import React, { useEffect, useState } from 'react';
import Navbar1 from '../components/Navbar';
import Container from 'react-bootstrap/Container';
import Swal from "sweetalert2";
import Checkout from '../components/Checkout';
import Footer1 from '../components/Footer';
function Checkoutpage(props) {
  return (
    <div>
      <Navbar1 name={props.name} />
      <Container style={{ marginTop: "5vh" }}>
        <Checkout />
      </Container>
      <Footer1 />
    </div>
  )
}

export default Checkoutpage