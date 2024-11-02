import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

// import Swiper core and required modules
import { Autoplay } from "swiper";

export default function RecomendedSlider() {
  // State để lưu trữ dữ liệu sản phẩm
  const [products, setProducts] = useState([]);

  // useEffect để gọi API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_DOMAIN}/book/products/top-views/`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  return (
    <>
      <Swiper
        className="swiper-container swiper-two"
        speed={1500}
        slidesPerView={5}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 2500,
        }}
        modules={[Autoplay]}
        breakpoints={{
          1200: {
            slidesPerView: 5,
          },
          1024: {
            slidesPerView: 4,
          },
          991: {
            slidesPerView: 3,
          },
          767: {
            slidesPerView: 3,
            centeredSlides: true,
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 15,
            centeredSlides: true,
          },
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
            <div
              className="books-card style-1 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="dz-media">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="dz-content">
                <h5
                  className="title"
                  style={{
                    minHeight: "3em",
                    lineHeight: "1.5em",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {truncateText(product.name, 30)}
                </h5>
                <span className="price">
                  {formatCurrency(product.new_price)}
                </span>
                <Link
                  to={`/books-detail/?product=${product.id}`}
                  className="btn btn-secondary btnhover btnhover2"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
