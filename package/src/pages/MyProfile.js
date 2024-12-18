import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const profilePages = [
  { to: "/cart", icons: "flaticon-shopping-cart-1", name: "Giỏ hàng của tôi" },
  { to: "/categories", icons: "fa fa-briefcase", name: "Cửa hàng" },
];

function MyProfile() {
  // Biến trạng thái để lưu trữ thông tin người dùng
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(""); // URL ảnh hiển thị
  const [selectedImage, setSelectedImage] = useState(null); // Ảnh được chọn

  // Biến trạng thái cho chức năng đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Lấy dữ liệu người dùng khi component được tải
  useEffect(() => {
    const user_id = Cookies.get("user_id");
    if (user_id) {
      fetch(`${process.env.REACT_APP_API_DOMAIN}/user/accounts/${user_id}/`)
        .then((response) => response.json())
        .then((data) => {
          setUsername(data.username);
          setPhone(data.phone);
          setEmail(data.email);
          setAddress(data.address);
          setImage(data.image); // Giả sử data.image là URL ảnh
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  // Xử lý khi người dùng chọn ảnh mới
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Cập nhật ảnh xem trước
      setImage(URL.createObjectURL(file));
    }
  };

  // Xử lý gửi form để cập nhật dữ liệu người dùng
  const handleSubmit = (e) => {
    e.preventDefault();
    const user_id = Cookies.get("user_id");

    // Kiểm tra xác nhận mật khẩu
    if (newPassword || confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        return;
      }
      if (!currentPassword) {
        alert("Vui lòng nhập mật khẩu hiện tại.");
        return;
      }
    }

    // Xây dựng đối tượng FormData để cập nhật
    const formData = new FormData();
    formData.append("username", username);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);

    // Bao gồm ảnh nếu người dùng đã chọn
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Bao gồm trường mật khẩu nếu người dùng muốn đổi mật khẩu
    if (newPassword && currentPassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("password", newPassword);
    }

    fetch(`${process.env.REACT_APP_API_DOMAIN}/user/accounts/${user_id}/`, {
      method: "PATCH",
      // Không đặt header 'Content-Type' khi gửi FormData
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Xử lý khi cập nhật thành công
          alert("Cập nhật hồ sơ thành công.");
        } else {
          // Xử lý lỗi
          alert("Lỗi khi cập nhật hồ sơ.");
        }
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  return (
    <>
      <div className="page-content bg-white">
        <div className="content-block">
          <section className="content-inner bg-white">
            <div className="container">
              <div className="row">
                <div className="col-xl-3 col-lg-4 m-b30">
                  <div className="sticky-top">
                    <div className="shop-account">
                      <div className="account-detail text-center">
                        <div className="my-image">
                          {/* <Link to={"#"}>
                            {image ? (
                              <img alt="profile" src={image} />
                            ) : (
                              <img
                                alt="profile"
                                src="/path/to/default/image.jpg"
                              />
                            )}
                          </Link> */}
                          {image ? (
                            <img
                              alt="profile"
                              src={image}
                              style={{ height: "100%" }}
                            />
                          ) : (
                            <img
                              alt="profile"
                              src="/path/to/default/image.jpg"
                              style={{ height: "100%" }}
                            />
                          )}
                        </div>
                      </div>
                      <ul className="account-list">
                        <li>
                          <Link to={"/my-profile"} className="active">
                            <i className="far fa-user" aria-hidden="true"></i>
                            <span>Thông tin tài khoản</span>
                          </Link>
                        </li>
                        {profilePages.map((item, ind) => (
                          <li key={ind}>
                            <Link to={item.to}>
                              <i className={item.icons}></i>
                              <span>{item.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-9 col-lg-8 m-b30">
                  <div className="shop-bx shop-profile">
                    <div className="shop-bx-title clearfix">
                      <h5 className="text-uppercase">Thông tin cơ bản</h5>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="row m-b30">
                        {/* Trường tên người dùng */}
                        <div className="col-lg-6 col-md-6">
                          <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                              Username :
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                        </div>
                        {/* Trường ảnh đại diện */}
                        <div className="col-lg-6 col-md-6">
                          <div className="mb-3">
                            <label htmlFor="image" className="form-label">
                              Ảnh đại diện :
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="image"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Thông tin liên hệ */}
                      <div className="row">
                        {/* Trường số điện thoại */}
                        <div className="col-lg-6 col-md-6">
                          <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                              Số điện thoại liên hệ :
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                        </div>
                        {/* Trường email */}
                        <div className="col-lg-6 col-md-6">
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                              Địa chỉ email :
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        {/* Trường địa chỉ */}
                        <div className="col-lg-12 col-md-12">
                          <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                              Địa chỉ đầy đủ :
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Phần đổi mật khẩu */}
                      <div className="shop-bx-title clearfix">
                        <h5 className="text-uppercase">Đổi mật khẩu</h5>
                      </div>
                      <div className="row">
                        {/* Trường mật khẩu hiện tại */}
                        <div className="col-lg-12 col-md-12">
                          <div className="mb-3">
                            <label
                              htmlFor="currentPassword"
                              className="form-label"
                            >
                              Mật khẩu hiện tại :
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="currentPassword"
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        {/* Trường mật khẩu mới */}
                        <div className="col-lg-6 col-md-6">
                          <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">
                              Mật khẩu mới :
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="newPassword"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>
                        </div>
                        {/* Trường xác nhận mật khẩu mới */}
                        <div className="col-lg-6 col-md-6">
                          <div className="mb-3">
                            <label
                              htmlFor="confirmNewPassword"
                              className="form-label"
                            >
                              Xác nhận mật khẩu mới :
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="confirmNewPassword"
                              value={confirmNewPassword}
                              onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btnhover mt-2"
                      >
                        Lưu cài đặt
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
