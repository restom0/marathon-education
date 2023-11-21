import React, { useState } from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "variables/charts.js";

function Dashboard() {
  var url = 'http://127.0.0.1:8000/api'
  const [show, setShow] = useState(false);
  const [education, setEducation] = useState('');
  const [edu, setEdu] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const notyf = new Notyf({});
  if (!localStorage.getItem('user')) {
    window.location.replace('/login');
  }

  const addEducation = () => {
    if (education === '') {
      notyf.open({
        type: 'error',
        message: 'Thiếu loại giáo dục'
      });
    }
    else {
      axios({
        method: 'post',
        url: url + '/education',
        data: {
          name: education
        }
      }).then((res) => {
        if (res.data.check === true) {
          notyf.open({
            type: 'success',
            message: 'Thêm thành công'
          })
          setEdu(res.data.result);
          // setTimeout(function () {
          //   window.location.reload();
          // }, 1000);
        }
        else if (res.data.msg.name) {
          notyf.open({
            type: 'error',
            message: res.data.msg.name
          });
        }
      })
    }
  }
  return (
    <>
      {/* <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Capacity</p>
                      <CardTitle tag="p">150GB</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Revenue</p>
                      <CardTitle tag="p">$ 1,345</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-calendar" /> Last day
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Errors</p>
                      <CardTitle tag="p">23</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> In the last hour
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Followers</p>
                      <CardTitle tag="p">+45K</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Users Behavior</CardTitle>
                <p className="card-category">24 Hours performance</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboard24HoursPerformanceChart.data}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Email Statistics</CardTitle>
                <p className="card-category">Last Campaign Performance</p>
              </CardHeader>
              <CardBody style={{ height: "266px" }}>
                <Pie
                  data={dashboardEmailStatisticsChart.data}
                  options={dashboardEmailStatisticsChart.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-primary" /> Opened{" "}
                  <i className="fa fa-circle text-warning" /> Read{" "}
                  <i className="fa fa-circle text-danger" /> Deleted{" "}
                  <i className="fa fa-circle text-gray" /> Unopened
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-calendar" /> Number of emails sent
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">NASDAQ: AAPL</CardTitle>
                <p className="card-category">Line Chart with Points</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboardNASDAQChart.data}
                  options={dashboardNASDAQChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <div className="chart-legend">
                  <i className="fa fa-circle text-info" /> Tesla Model S{" "}
                  <i className="fa fa-circle text-warning" /> BMW 5 Series
                </div>
                <hr />
                <div className="card-stats">
                  <i className="fa fa-check" /> Data information certified
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div> */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" placeholder="Loại giáo dục" onChange={(e) => setEducation(e.target.value)} className="form-control" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { handleClose(); addEducation() }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="mt-5">
        <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button>
      </div>

      <div className="content">
        <br />
        <div className="container">
          {edu && edu.length > 0 && (
            <div className="table-responsive">
              <table className="table table-primary">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Tên loại hình</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Ngày tạo</th>
                    <th scope="col">Tùy chỉnh</th>
                  </tr>
                </thead>
                <tbody>
                  {edu.map((item, index) => (
                    <tr key={index}>
                      <td scope="row">{item.name}</td>
                      <td><select name="" defaultValue={item.status} id="">
                        <option value="0">Đang khóa</option>
                        <option value="1">Đang mở</option></select></td>
                      <td>{item.created_at}</td>
                      <td><button className="btn btn-warning">Edit</button>
                        <button className="btn btn-danger">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
