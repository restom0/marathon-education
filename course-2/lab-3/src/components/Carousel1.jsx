import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import { Col, Row } from 'react-bootstrap';
function Carousel1() {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };
    return (
        <div>
            <Carousel activeIndex={index} onSelect={handleSelect} size='sm'>
                <Carousel.Item>
                    <Image src="https://shopdunk.com/images/uploaded/ipadPC6.png" fluid />
                </Carousel.Item>
                <Carousel.Item>
                    <Image src="https://shopdunk.com/images/uploaded/PC661.jpg" fluid />
                </Carousel.Item>
                <Carousel.Item>
                    <Image src="https://shopdunk.com/images/uploaded/ipPC6.png" fluid />
                </Carousel.Item>
            </Carousel>
            <div className="banner">
                <Row>
                    <Col>
                        <Image src="https://shopdunk.com/images/uploaded/Bonus%20banner-36.png" fluid />
                    </Col>
                    <Col>
                        <Image src="https://shopdunk.com/images/uploaded/Bonus%20banner-26.png" fluid />
                    </Col>
                    <Col>
                        <Image src="https://shopdunk.com/images/uploaded/Bonus%20banner-16.png" fluid />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Carousel1