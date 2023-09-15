import React from 'react';
import '../css/homepage.css'
import Navbar1 from '../components/Navbar';
import Footer1 from '../components/Footer';
import Carousel1 from '../components/Carousel1';
import Product from '../components/Product';

function Homepage(props) {
  return (
    <div>
      <Navbar1 name={props.name} />
      <Carousel1 />
      <Product />
      <Footer1 />
    </div>
  )
};
export default Homepage