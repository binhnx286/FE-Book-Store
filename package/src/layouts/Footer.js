import React, { useState } from "react";
import { Link } from "react-router-dom";

function Footer({ footerChange, logoImage }) {
  return (
    <>
      <footer className={`site-footer ${footerChange}`}>
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div
                className="col-xl-3 col-lg-12 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="widget widget_about">
                  <div className="footer-logo logo-white">
                    <Link to={"/"}>
                      <img src={logoImage} alt="" />
                    </Link>
                    {/* <p className="text">Hãy đến với Bookstore để khám phá kho tàng tri thức!</p> */}
                  </div>

                  <div className="dz-social-icon style-1">
                    <ul>
                      <li>
                        <a
                          href="https://www.facebook.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-youtube"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.linkedin.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-linkedin"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-4 wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="widget widget_services">
                  <h5 className="footer-title">Dịch vụ</h5>
                  <ul>
                    <li>
                      <Link to={"/about-us"}>Về chúng tôi</Link>
                    </li>
                    <li>
                      <Link to={"/contact-us"}>Liên hệ</Link>
                    </li>
                    <li>
                      <Link to={"/privacy-policy"}>Chính sách bảo mật</Link>
                    </li>
                    <li>
                      <Link to={"/pricing"}>Bảng giá</Link>
                    </li>
                    <li>
                      <Link to={"/faq"}>FAQ</Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                className="col-xl-3 col-lg-3 col-md-12 col-sm-12 wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="widget widget_getintuch">
                  <h5 className="footer-title">Liên hệ với chúng tôi</h5>
                  <ul>
                    <li>
                      <i className="flaticon-placeholder"></i>
                      <span>60-62 Lê Lợi, Q.1, TP. HCM</span>
                    </li>
                    <li>
                      <i className="flaticon-phone"></i>
                      <span>1900636467</span>
                    </li>
                    <li>
                      <i className="flaticon-email"></i>
                      <span>
                        support@bookstore.com.vn
                        <br />
                        info@bookstore.com.vn
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                className="col-xl-2 col-lg-3 col-sm-4 col-4 wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <div className="widget widget_services">
                  <h5 className="footer-title">Tài khoản </h5>
                  <ul>
                    <li>
                      <Link to={"/login"}>Đăng nhập/Tạo mới</Link>
                    </li>
                    <li>
                      <Link to={"/change-address"}>Thay đổi địa chỉ</Link>
                    </li>
                    <li>
                      <Link to={"/account-details"}>Chi tiết tài khoản</Link>
                    </li>
                    <li>
                      <Link to={"/order-history"}>Lịch sử mua hàng</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
export default Footer;
