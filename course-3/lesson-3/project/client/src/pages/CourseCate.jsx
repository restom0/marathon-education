import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Notyf } from "notyf";
import Sidebar from "../components/Sidebar";
function CourseCate() {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [idCate, setIdCate] = useState(0);
  const [coursecate, setCourseCate] = useState("");
  const [cate, setCate] = useState([]);
  const url = "http://127.0.0.1:8000/api/";
  const notyFR = new Notyf({
    position: {
      x: "right",
      y: "top",
    },
    types: [
      {
        type: "info",
        background: "blue",
        icon: false,
      },
    ],
  });
  const setAdd = () => {
    setCourseCate("");
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const submitAddCate = () => {};
  const setEdit = (id, old) => {
    setCourseCate(old);
    setIdCate(id);
    handleShow();
  };
  const switchCate = (idSwitch, status) => {};
  const deleteCate = (idD) => {};
  const submitEditCate = () => {};
  useEffect(() => {}, []);
  return (
    <>
      <Sidebar />
    </>
  );
}

export default CourseCate;
