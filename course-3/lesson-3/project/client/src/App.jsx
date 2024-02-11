import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Education from "./pages/Education";
import Schedule from "./pages/Schedule";
import CourseCate from "./pages/CourseCate";
import EditCourse from "./pages/EditCourse";
import Course from "./pages/Course";
import NotFound from "./pages/NotFound";

function App() {
  if (!localStorage.getItem("token")) {
    return <Login />;
  }
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/education" element={<Education />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/education/:id" element={<CourseCate />} />
            <Route path="/editCourse/:id" element={<EditCourse />} />
            <Route path="/cate/:id" element={<Course />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
