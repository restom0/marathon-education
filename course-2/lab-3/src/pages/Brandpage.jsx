import React from 'react';

import '../css/homepage.css'

import Navbar1 from '../components/Navbar';
import Carousel1 from '../components/Carousel1';
import Brand from '../components/Brand';
import Footer1 from '../components/Footer';

function Brandpage() {
  return (
    <div>
      <Navbar1 />
      <Carousel1 />
      <Brand />
      <Footer1 />
    </div>
  )
}

export default Brandpage