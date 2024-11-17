import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Slide() {
  const navigate = useNavigate(); // Sử dụng navigate để điều hướng

  const handleSlideClick = () => {
    navigate("/promotion"); // Điều hướng đến trang promotion
  };

  return (
    <Carousel interval={3000} controls={true} indicators={true}>
      <Carousel.Item
        onClick={handleSlideClick}
        style={{ height: "500px", cursor: "pointer" }}
      >
        <img
          className="d-block w-100"
          src="https://theme.hstatic.net/200000845405/1001223012/14/home_slider_image_2.jpg"
          alt="Khuyễn mãi"
          title="Khuyễn mãi"
          style={{ height: "100%", objectFit: "cover" }}
        />
      </Carousel.Item>

      <Carousel.Item
        onClick={handleSlideClick}
        style={{ height: "500px", cursor: "pointer" }}
      >
        <img
          className="d-block w-100"
          src="https://sachkhainguyen.com/wp-content/uploads/2023/03/slide-3.jpg"
          alt="Khuyễn mãi"
          title="Khuyễn mãi"
          style={{ height: "100%", objectFit: "cover" }}
        />
      </Carousel.Item>

      <Carousel.Item
        onClick={handleSlideClick}
        style={{ height: "500px", cursor: "pointer" }}
      >
        <img
          className="d-block w-100"
          src="https://bookbuy.vn/Res/Images/Album/00456729-e290-44a5-bbe9-da9a261ff77b.png?w=920&h=420&mode=crop"
          alt="Khuyễn mãi"
          title="Khuyễn mãi"
          style={{ height: "100%", objectFit: "cover" }}
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default Slide;
