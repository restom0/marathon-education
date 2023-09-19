import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Brandpage from "./pages/Brandpage";
import CatePage from "./pages/Catepage";
import Loginpage from "./pages/Loginpage";
import ProductDetails from "./pages/ProductDetails";
import Checkoutpage from "./pages/Checkoutpage";
import TodoRaw from "./pages/TodoRaw";
import TodoAPI from "./pages/TodoAPI";
import TodoRedux from "./pages/TodoRedux";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Homepage />} />
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/" element={<Loginpage />} />
          <Route path="/brand" element={<Brandpage />} />
          <Route path="/checkout" element={<Checkoutpage />} />
          <Route path="/category" element={<CatePage />} />
          <Route path="/todoraw" element={<TodoRaw />} />
          <Route path="/todoapi" element={<TodoAPI />} />
          <Route path="/todoredux" element={<TodoRedux />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
