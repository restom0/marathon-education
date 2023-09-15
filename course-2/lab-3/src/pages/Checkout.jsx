import React, { useEffect, useState } from 'react';
import Navbar1 from '../components/Navbar';
import Container from 'react-bootstrap/Container';
import Swal from "sweetalert2";
function Checkout(props) {
  return (
    <Navbar1 name={props.name} />
  )
}

export default Checkout