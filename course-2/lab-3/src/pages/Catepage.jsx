import React from 'react';

import '../css/homepage.css'

import Navbar1 from '../components/Navbar';
import Carousel1 from '../components/Carousel1';
import Cate from '../components/Cate';
import Footer1 from '../components/Footer';

function Catepage() {
  return (
    <div>
      <Navbar1 />
      <Carousel1 />
      <Cate />
      <Footer1 />
    </div>
  )
}

export default Catepage