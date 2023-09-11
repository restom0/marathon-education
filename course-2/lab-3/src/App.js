import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import News from "./components/News";
import About from "./components/About";
import Login from "./components/Login";
import Todo from "./components/Todo";

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home name='dsa' />} />
          <Route path="/" element={<Todo name='dsa' />} />
          <Route exact path="/news" element={<News />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
