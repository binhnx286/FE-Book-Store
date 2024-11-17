import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import PageTitle from "./../layouts/PageTitle";

function Login() {
  const [forgotPass, setForgotPass] = useState(false);
  const [email, setEmail] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [forgotPasswordError, setForgotPasswordError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const navigate = useNavigate();

  // Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/user/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Đăng nhập không thành công. Vui lòng kiểm tra lại email hoặc mật khẩu."
        );
      }

      const data = await response.json();
      // Xử lý đăng nhập thành công (lưu token, điều hướng, vv.)
      Cookies.set("refresh", data.refresh, { expires: 10 });
      Cookies.set("access", data.access, { expires: 1 });
      Cookies.set("email", data.email, { expires: 1 });
      Cookies.set("user_id", data.user_id, { expires: 1 });

      console.log("Đăng nhập thành công:", data);
      toast.success(
        <>
          Đăng nhập thành công!
          <br />
          Bạn sẽ được chuyển sang trang chủ sau 3 giây...
        </>,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      // Sau khi đăng nhập thành công, chuyển hướng đến trang chủ sau 3 giây
      setTimeout(() => {
        navigate("/"); // Chuyển đến trang chủ
      }, 3500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý quên mật khẩu
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/user/password-reset/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: forgotPasswordEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
      }

      const data = await response.json();

      toast.success(
        <>
          Yêu cầu đặt lại mật khẩu đã được gửi!
          <br />
          Vui lòng kiểm tra email của bạn.
        </>,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      setForgotPasswordEmail("");
    } catch (err) {
      setForgotPasswordError(err.message);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="page-content">
        <PageTitle parentPage="Trang chủ" childPage="Đăng nhập" />
        <section className="content-inner shop-account">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 mb-4">
                <div className="login-area">
                  <div className="tab-content">
                    <h4>KHÁCH HÀNG MỚI</h4>
                    <p>
                      Tạo tài khoản với chúng tôi để tận hưởng quy trình thanh
                      toán nhanh chóng, lưu trữ nhiều địa chỉ giao hàng, xem và
                      theo dõi đơn hàng trong tài khoản, cùng nhiều tiện ích
                      khác.
                    </p>
                    <Link
                      to={"/signup"}
                      className="btn btn-primary btnhover m-r5 button-lg radius-no"
                    >
                      Tạo tài khoản
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 mb-4">
                <div className="login-area">
                  <div className="tab-content nav">
                    <form
                      onSubmit={handleLogin}
                      className={` col-12 ${forgotPass ? "d-none" : ""}`}
                    >
                      <h4 className="text-secondary">Đăng nhập</h4>
                      <p className="font-weight-600">
                        Vui lòng đăng nhập nếu đã có tài khoản
                      </p>
                      <div className="mb-4">
                        <label className="label-title">Địa chỉ Email *</label>
                        <input
                          name="email"
                          required
                          className="form-control"
                          placeholder="Nhập Email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="label-title">Mật khẩu *</label>
                        <input
                          name="password"
                          required
                          className="form-control"
                          placeholder="Nhập mật khẩu"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {error && <div className="text-danger mb-3">{error}</div>}
                      <div className="text-left">
                        <button
                          type="submit"
                          className="btn btn-primary btnhover me-2"
                          disabled={isLoading}
                        >
                          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                        <Link
                          to={"#"}
                          className="m-l5"
                          onClick={() => setForgotPass(!forgotPass)}
                        >
                          <i className="fas fa-unlock-alt"></i> Quên mật khẩu
                        </Link>
                      </div>
                    </form>
                    <form
                      onSubmit={handleForgotPassword}
                      className={` col-12 ${forgotPass ? "" : "d-none"}`}
                    >
                      <h4 className="text-secondary">Quên mật khẩu?</h4>
                      <p className="font-weight-600">
                        Nhập email để nhận mật khẩu mới
                      </p>
                      <div className="mb-3">
                        <label className="label-title">E-MAIL *</label>
                        <input
                          name="forgotPasswordEmail"
                          required
                          className="form-control"
                          placeholder="Email của bạn"
                          type="email"
                          value={forgotPasswordEmail}
                          onChange={(e) =>
                            setForgotPasswordEmail(e.target.value)
                          }
                        />
                      </div>
                      {forgotPasswordError && (
                        <div className="text-danger mb-3">
                          {forgotPasswordError}
                        </div>
                      )}
                      <div className="text-left">
                        <Link
                          to={"#"}
                          className="btn btn-outline-secondary btnhover m-r10 active"
                          onClick={() => setForgotPass(!forgotPass)}
                        >
                          Đăng nhập
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary btnhover"
                          disabled={forgotPasswordLoading}
                        >
                          {forgotPasswordLoading ? "Đang xử lý..." : "Gửi"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Login;
