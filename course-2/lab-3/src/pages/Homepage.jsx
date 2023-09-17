import React from 'react';

import '../css/homepage.css'

import Navbar1 from '../components/Navbar';
import Carousel1 from '../components/Carousel1';
import Product from '../components/Product';
import Footer1 from '../components/Footer';

function Homepage() {
  return (
    <div>
      <Navbar1 />
      <Carousel1 />
      <Product />
      <Footer1 />
    </div>
  )
};
export default Homepage