import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

function UncontrolledExample() {
  return (
    <Carousel interval={3000} controls={true} indicators={true}>
      <Carousel.Item style={{ height: "500px" }}>
        <img
          className="d-block w-100"
          src="https://theme.hstatic.net/200000845405/1001223012/14/home_slider_image_2.jpg"
          alt="First slide"
          style={{ height: "100%", objectFit: "cover" }}
        />
      </Carousel.Item>

      <Carousel.Item style={{ height: "500px" }}>
        <img
          className="d-block w-100"
          src="https://sachkhainguyen.com/wp-content/uploads/2023/03/slide-3.jpg"
          alt="Second slide"
          style={{ height: "100%", objectFit: "cover" }}
        />
      </Carousel.Item>

      <Carousel.Item style={{ height: "500px" }}>
        <img
          className="d-block w-100"
          src="https://bookbuy.vn/Res/Images/Album/00456729-e290-44a5-bbe9-da9a261ff77b.png?w=920&h=420&mode=crop"
          alt="Third slide"
          style={{ height: "100%", objectFit: "cover" }}
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolledExample;
