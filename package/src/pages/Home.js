import React from "react";

//Components
// import HomeMainSlider from "../components/Home/HomeMainSlider";
import Slide from "../components/Home/Slide";

import ClientsSlider from "./../components/Home/ClientsSlider";
import RecomendedSlider from "./../components/Home/RecomendedSlider";
import BookSaleSlider from "./../components/Home/BookSaleSlider";
// import FeaturedSlider from "./../components/Home/FeaturedSlider";
import OfferSlider from "./../components/Home/OfferSlider";
import NewsLetter from "./../components/NewsLetter";

//element
import CounterSection from "./../elements/CounterSection";

const iconBlog = [
  {
    title: "Giao hàng nhanh chóng",
    iconClass: "flaticon-power",
    description:
      "Đảm bảo hàng hóa được giao đến tay bạn một cách nhanh chóng và thuận tiện, giúp bạn tiết kiệm thời gian và trải nghiệm mua sắm dễ dàng hơn.",
  },
  {
    title: "Thanh toán bảo mật",
    iconClass: "flaticon-shield",
    description:
      "Chúng tôi sử dụng công nghệ bảo mật tiên tiến để bảo vệ thông tin thanh toán của bạn, giúp bạn an tâm khi thực hiện giao dịch.",
  },
  {
    title: "Chất lượng tin cậy",
    iconClass: "flaticon-like",
    description:
      "Sản phẩm của chúng tôi được lựa chọn cẩn thận, đảm bảo chất lượng cao và độ tin cậy, mang đến sự hài lòng cho khách hàng.",
  },
  {
    title: "Chính sách hoàn trả",
    iconClass: "flaticon-star",
    description:
      "Nếu bạn không hài lòng với sản phẩm, chúng tôi có chính sách hoàn trả linh hoạt, giúp bạn yên tâm khi mua sắm.",
  },
];

function Index1() {
  return (
    <>
      <div className="page-content bg-white">
        <div className="main-slider style-1">
          {/* <HomeMainSlider /> */}
          <Slide />
        </div>
        <div className="bg-white py-5">
          <div className="container">
            <ClientsSlider />
          </div>
        </div>
        <section className="content-inner-1 bg-grey reccomend">
          <div className="container">
            <div className="section-head text-center">
              <h2 className="title">Lượt xem nhiều nhất</h2>
              <p>
                Những cuốn sách này không chỉ gây ấn tượng mạnh mẽ mà còn nhận
                được đánh giá cao từ khách hàng nhờ nội dung hấp dẫn và chất
                lượng vượt trội.
              </p>
            </div>
            <RecomendedSlider />
          </div>
        </section>

        <section className="content-inner-2">
          <div className="container">
            <div className="row">
              {iconBlog.map((data, ind) => (
                <div className="col-lg-3 col-sm-6" key={ind}>
                  <div className="icon-bx-wraper style-1 m-b30 text-center">
                    <div className="icon-bx-sm m-b10">
                      <i className={`icon-cell ${data.iconClass}`} />
                    </div>
                    <div className="icon-content">
                      <h5 className="dz-title m-b10">{data.title}</h5>
                      <p>{data.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* <section className="content-inner-1">
          <div className="container">
            <BookSaleSlider />
          </div>
        </section> */}
        {/* <section className="content-inner-1 bg-grey reccomend">
          <div className="container">
            <div className="section-head text-center">
              <div className="circle style-1"></div>
              <h2 className="title">Featured Product</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris{" "}
              </p>
            </div>
          </div>
          <div className="container">
            <FeaturedSlider />
          </div>
        </section> */}
        <section className="content-inner-2">
          <div className="container">
            <OfferSlider />
          </div>
        </section>
        {/* <section className="content-inner-2 testimonial-wrapper">
					<TestimonialSlider />	
				</section>	 */}
        {/* <section className="content-inner-2">
					<div className="container">
						<div className="section-head text-center">
							<h2 className="title">Latest News</h2>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
						</div>
						<LatestNewsSlider />	
					</div>
				</section>	 */}
        <section className="content-inner">
          <div className="container">
            <div className="row sp15">
              <CounterSection />
            </div>
          </div>
        </section>
        <NewsLetter />
      </div>
    </>
  );
}
export default Index1;
