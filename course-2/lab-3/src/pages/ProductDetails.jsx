import React from 'react';
import Navbar1 from '../components/Navbar';
import Footer1 from '../components/Footer';
import ProductDetail from '../components/ProductDetail';
function ProductDetails(props) {
  return (
    <div>
      <Navbar1 name={props.name} />
      <ProductDetail />
      <Footer1 />
    </div>
  )
}

export default ProductDetails