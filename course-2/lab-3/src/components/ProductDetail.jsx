import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Swal from "sweetalert2";
import { Image } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Button } from 'react-bootstrap';
function ProductDetail() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    const [product, setProduct] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [defaultPic, setDefaultPic] = useState('');
    const loadData = () => {
        var id = new URLSearchParams(window.location.search);
        id = id.get('id');
        fetch("https://students.trungthanhweb.com/api/single?apitoken=" + localStorage.getItem('token') + "&id=" + id).then(res => res.json()).then((res) => {
            setProduct(res.products);
            setGallery(res.gallery);
            setDefaultPic("https://students.trungthanhweb.com/images/" + res.products[0].images)
        })
    }
    const changePicture = (pic) => {
        setDefaultPic(pic);
    }
    useEffect(() => {
        loadData();
    }, [])
    const addToCart = (id) => {
        var arr = [];
        if (!localStorage.getItem('cart') || localStorage.getItem('cart') == null) {
            var item = { id: id, qty: 1 };
            arr.push(item);
            localStorage.setItem('cart', JSON.stringify(arr));
        }
        else {
            var arr = JSON.parse(localStorage.getItem('cart'));
            var check = 0;
            arr.forEach(el => {
                if (el.id === id) {
                    el.qty++;
                    check = 1;
                }
            });
            if (check === 0) {
                var item = { id: id, qty: 1 };
                arr.push(item);
            }
            localStorage.setItem('cart', JSON.stringify(arr));
        }
        Toast.fire({
            icon: 'success',
            title: 'Mua thành công'
        }).then(() => {
            window.location.reload();
        })
    }
    return (
        <div>
            {
                product.length !== 0 ?
                    <Container style={{ width: "80%", margin: "10px auto" }}>
                        <div className="row mt-3">
                            <div className="col-md-4">
                                <Image src={defaultPic} alt="" className="w-100" />
                            </div>
                            <div className="col-md-6 text-center" style={{ margin: "10px auto" }}>
                                <h4 className="text-bold" style={{ marginTop: "20vh" }}>{product[0].name}</h4>
                                <h4 className="text-bold text-danger">{product[0].price} đ</h4>
                                <div className="row">
                                    <div className="col-md">
                                        <Button variant='primary' className="w-100" onClick={() => addToCart(parseInt(product[0].id))}>Mua ngay</Button>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md">
                                        <button className="w-100 btn btn-outline-primary">Trả góp</button>
                                    </div>
                                    <div className="col-md">
                                        <button className="w-100 btn btn-outline-primary">Thu cũ đổi mới</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 w-100">
                            <div className="col-md-4">
                                <Swiper
                                    spaceBetween={50}
                                    slidesPerView={3}
                                    onSlideChange={() => console.log('slide change')}
                                    onSwiper={(swiper) => console.log(swiper)}
                                >
                                    {gallery && gallery.map((el, index) => (
                                        <SwiperSlide><Image className="select w-100" data-id={index} src={el} onClick={() => changePicture(el)} /></SwiperSlide>
                                    ))}
                                </Swiper></div>
                        </div>
                        <div className="row mt-3 w-100">{product[0].content}</div>
                    </Container>
                    : <div></div>
            }
        </div>


    )
}

export default ProductDetail