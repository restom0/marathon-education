import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import News from "./components/News";
// import About from "./components/About";
// import Login from "./components/Login";
// import Todo from "./components/Todo";
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
          {/* <Route path="/todo" element={<Todo name='dsa' />} /> */}
          <Route path="/home" element={<Homepage name='dsa' />} />
          <Route path="/productDetails" element={<ProductDetails name='dsa' />} />
          <Route path="/" element={<Login name='dsa' />} />
          <Route path="/brand" element={<Brandpage name='dsa' />} />
          <Route path="/checkout" element={<Checkoutpage name='dsa' />} />
          <Route path="/category" element={<CatePage name='dsa' />} />
          {/* <Route exact path="/news" element={<News />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="/about" element={<About />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
