import React, { useEffect, useState } from 'react';
import Navbar1 from '../components/Navbar';
import Container from 'react-bootstrap/Container';
import Swal from "sweetalert2";
import Carousel1 from '../components/Carousel1';
import Footer1 from '../components/Footer';
import Brand from '../components/Brand';
function Brandpage(props) {
  return (
    <div>
      <Navbar1 name={props.name} />
      <Carousel1 />
      <Brand />
      <Footer1 />
    </div>
  )
}

export default Brandpage