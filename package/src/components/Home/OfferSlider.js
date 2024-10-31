import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
//import "swiper/css";
import { Navigation, Pagination } from "swiper";

function OfferSlider() {
  const [products, setProducts] = useState([]);
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  useEffect(() => {
    // Fetch data from API
    fetch(`${process.env.REACT_APP_API_DOMAIN}/book/products/top-discount/`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <div className="section-head book-align">
        <h2 className="title mb-0">Giảm giá đặc biệt</h2>
        <div className="pagination-align style-1">
          <div
            className="book-button-prev swiper-button-prev"
            ref={navigationPrevRef}
          >
            <i className="fa-solid fa-angle-left"></i>
          </div>
          <div
            className="book-button-next swiper-button-next"
            ref={navigationNextRef}
          >
            <i className="fa-solid fa-angle-right"></i>
          </div>
        </div>
      </div>
      <Swiper
        className="swiper-container book-swiper"
        slidesPerView={3}
        spaceBetween={30}
        autoplay={{ delay: 4000 }}
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            swiper.params.navigation.nextEl = navigationNextRef.current;
            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
          });
        }}
        modules={[Navigation, Pagination]}
        breakpoints={{
          360: {
            slidesPerView: 1,
          },
          600: {
            slidesPerView: 1,
          },
          767: {
            slidesPerView: 2,
          },
          991: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
          1680: {
            slidesPerView: 3,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="dz-card style-2">
              <div className="dz-media">
                <Link to={`/books-detail/${product.id}`}>
                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name}
                  />
                </Link>
              </div>
              <div className="dz-info">
                <h4 className="dz-title">
                  <Link to={`/books-detail/${product.id}`}>{product.name}</Link>
                </h4>
                <div className="dz-meta">
                  <ul className="dz-tags">
                    <li>
                      <span className="me-1">{product.sub_category}</span>
                    </li>
                  </ul>
                </div>
                {/* <p>{product.description || "Không có mô tả"}</p> */}
                <div
                  className="bookcard-footer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="price-details"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "end",
                    }}
                  >
                    <h4 className="mb-0 m-r10">
                      {product.new_price.toLocaleString("vi-VN")}₫{" "}
                    </h4>
                    <del className="mb-1 m-r10">
                      {product.price_origin.toLocaleString("vi-VN")}₫
                    </del>
                    <p className="fs-6 bg-primary py-1 px-2 rounded rounded-3 text-light">
                      {product.discount_percent}%
                    </p>
                  </div>
                  <Link
                    to={"/shop-cart"}
                    className="btn btn-primary m-t15 btnhover btnhover2"
                  >
                    <i className="flaticon-shopping-cart-1 m-r10"></i> Thêm vào
                    giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default OfferSlider;
