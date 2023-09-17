import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Brandpage from "./pages/Brandpage";
import CatePage from "./pages/Catepage";
import Login from "./components/Login";
import ProductDetails from "./pages/ProductDetails";
import Checkoutpage from "./pages/Checkoutpage";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Homepage />} />
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/" element={<Login />} />
          <Route path="/brand" element={<Brandpage />} />
          <Route path="/checkout" element={<Checkoutpage />} />
          <Route path="/category" element={<CatePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
