import React, { useState, useEffect } from "react";
import { Collapse, Form } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

// Components
import PageTitle from "./../layouts/PageTitle";

// Images
import book1 from "./../assets/images/books/grid/book1.jpg";
import book2 from "./../assets/images/books/grid/book2.jpg";
import book3 from "./../assets/images/books/grid/book3.jpg";
import book4 from "./../assets/images/books/grid/book4.jpg";
import book5 from "./../assets/images/books/grid/book5.jpg";

// Mapping product ID to images
const productImages = {
  90: book1, // Giả sử product ID 90 tương ứng với book1.jpg
  // Thêm các mapping khác nếu cần
  // Ví dụ:
  // 91: book2,
  // 92: book3,
  // ...
};

const inputData = [
  { name1: "Apartment, suite, unit etc.", name2: "Town / City" },
  { name1: "State / County", name2: "Postcode / Zip" },
  { name1: "Email", name2: "Phone" },
];

const SingleInput = ({
  title,
  changeClass,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div className={`form-group ${changeClass}`}>
      <input
        type={type}
        className="form-control"
        placeholder={title}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

function ShopCheckout() {
  const [accordBtn, setAccordBtn] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý form
  const [formData, setFormData] = useState({
    country: "",
    firstName: "",
    lastName: "",
    companyName: "",
    address: "",
    apartment: "",
    town: "",
    state: "",
    postcode: "",
    email: "",
    phone: "",
    password: "",
    notes: "",
    nameOnCard: "",
    cardType: "",
    cardNumber: "",
    cardCVV: "",
  });

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Lấy Bearer Token từ cookie
        const token = Cookies.get("access");

        if (!token) {
          throw new Error(
            "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
          );
        }

        // Cấu hình headers với Bearer Token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            // Thêm các headers khác nếu cần
          },
        };

        // Gọi API với headers đã cấu hình
        const response = await axios.get(
          `${process.env.REACT_APP_API_DOMAIN}/cart/carts/`,
          config
        );
        setCartData(response.data[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart data:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Có lỗi xảy ra khi tải dữ liệu giỏ hàng."
        );
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  if (loading) {
    return <div className="page-content">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="page-content text-danger">{error}</div>;
  }

  const { discount, sub_total, total, cart_items } = cartData;

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Hàm xử lý đặt hàng
  const handlePlaceOrder = async () => {
    try {
      // Lấy Bearer Token từ cookie
      const token = Cookies.get("access");

      if (!token) {
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      // Cấu hình headers với Bearer Token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Tạo payload từ formData và cartData
      //   const payload = {
      //     billing_address: {
      //       country: formData.country,
      //       first_name: formData.firstName,
      //       last_name: formData.lastName,
      //       company: formData.companyName,
      //       address: formData.address,
      //       apartment: formData.apartment,
      //       town: formData.town,
      //       state: formData.state,
      //       postcode: formData.postcode,
      //       email: formData.email,
      //       phone: formData.phone,
      //     },
      //     notes: formData.notes,
      //     payment_method: "credit_card",
      //     payment_details: {
      //       name_on_card: formData.nameOnCard,
      //       card_type: formData.cardType,
      //       card_number: formData.cardNumber,
      //       cvv: formData.cardCVV,
      //     },
      //   };

      // Gọi API đặt hàng
      const response = await axios.post(
        `${process.env.REACT_APP_API_DOMAIN}/cart/checkout/`,
        {},
        config
      );

      const { payUrl } = response.data;

      if (payUrl) {
        window.location.assign(payUrl);
      } else {
        throw new Error("Không nhận được URL thanh toán.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi đặt hàng."
      );
    }
  };

  return (
    <>
      <div className="page-content">
        <PageTitle parentPage="Trang chủ" childPage="Thanh toán" />
        <section className="content-inner-1">
          {/* <!-- Product --> */}
          <div className="container">
            <form className="shop-form">
              {/* <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="widget">
                    <h4 className="widget-title">Billing & Shipping Address</h4>
                    <div className="form-group">
                      <Form.Select
                        aria-label="Country Select"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option value="">Chọn Quốc Gia</option>
                        <option value="1">Afghanistan</option>
                        <option value="2">Albania</option>
                        <option value="3">Algeria</option>
                        <option value="4">Andorra</option>
                        <option value="5">Angola</option>
                        <option value="6">Anguilla</option>
                        <option value="7">Antarctica</option>
                        <option value="8">Antigua and Barbuda</option>
                        <option value="9">Argentina</option>
                        <option value="10">Armenia</option>
                        <option value="11">Aruba</option>
                        <option value="12">Australia</option>
                      </Form.Select>
                    </div>
                    <div className="row">
                      <SingleInput
                        changeClass="col-md-6"
                        title="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      <SingleInput
                        changeClass="col-md-6"
                        title="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <SingleInput
                      title="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                    <SingleInput
                      title="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {inputData.map((data, index) => (
                      <div className="row" key={index}>
                        <div className="form-group col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={data.name1}
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={data.name2}
                            name={data.name2.toLowerCase().replace(/\s+/g, "")}
                            value={
                              formData[
                                data.name2.toLowerCase().replace(/\s+/g, "")
                              ]
                            }
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-primary btnhover mb-3"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#create-an-account"
                    >
                      Create an account{" "}
                      <i className="fa fa-arrow-circle-o-down"></i>
                    </button>
                    <div id="create-an-account" className="collapse">
                      <p>
                        Create an account by entering the information below. If
                        you are a returning customer please login at the top of
                        the page.
                      </p>
                      <div className="form-group">
                        <SingleInput
                          title="Password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <button
                    className="btn btn-primary btnhover mb-3"
                    type="button"
                    onClick={() => setAccordBtn(!accordBtn)}
                  >
                    Ship to a different address{" "}
                    <i className="fa fa-arrow-circle-o-down"></i>
                  </button>
                  <Collapse in={accordBtn}>
                    <div>
                      <p>
                        If you have shopped with us before, please enter your
                        details in the boxes below. If you are a new customer
                        please proceed to the Billing & Shipping section.
                      </p>
                      <div className="form-group">
                        <Form.Select
                          aria-label="Country Select"
                          name="countryDifferent"
                          value={formData.countryDifferent}
                          onChange={handleChange}
                        >
                          <option value="">Chọn Quốc Gia</option>
                          <option value="1">Afghanistan</option>
                          <option value="2">Albania</option>
                          <option value="3">Algeria</option>
                          <option value="4">Andorra</option>
                          <option value="5">Angola</option>
                          <option value="6">Anguilla</option>
                          <option value="7">Antarctica</option>
                          <option value="8">Antigua and Barbuda</option>
                          <option value="9">Argentina</option>
                          <option value="10">Armenia</option>
                          <option value="11">Aruba</option>
                          <option value="12">Australia</option>
                        </Form.Select>
                      </div>
                      <div className="row">
                        <SingleInput
                          changeClass="col-md-6"
                          title="First Name"
                          name="firstNameDifferent"
                          value={formData.firstNameDifferent}
                          onChange={handleChange}
                        />
                        <SingleInput
                          changeClass="col-md-6"
                          title="Last Name"
                          name="lastNameDifferent"
                          value={formData.lastNameDifferent}
                          onChange={handleChange}
                        />
                      </div>
                      <SingleInput
                        title="Company Name"
                        name="companyNameDifferent"
                        value={formData.companyNameDifferent}
                        onChange={handleChange}
                      />
                      <SingleInput
                        title="Address"
                        name="addressDifferent"
                        value={formData.addressDifferent}
                        onChange={handleChange}
                      />
                      {inputData.map((data, index) => (
                        <div className="row" key={index}>
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={data.name1}
                              name={`apartmentDifferent${index}`}
                              value={formData[`apartmentDifferent${index}`]}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={data.name2}
                              name={`fieldDifferent${index}`}
                              value={formData[`fieldDifferent${index}`]}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      ))}
                      <p>
                        Create an account by entering the information below. If
                        you are a returning customer please login at the top of
                        the page.
                      </p>
                    </div>
                  </Collapse>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      placeholder="Notes about your order, e.g. special notes for delivery"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div> */}
            </form>
            <div className="dz-divider bg-gray-dark text-gray-dark icon-center my-5">
              <i className="fa fa-circle bg-white text-gray-dark"></i>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="widget">
                  <h4 className="widget-title">Đơn hàng của bạn</h4>
                  <table className="table-bordered check-tbl">
                    <thead className="text-center">
                      <tr>
                        {/* <th>IMAGE</th> */}
                        <th>Tên sản phẩm</th>
                        <th>Tổng cộng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart_items.map((item) => (
                        <tr key={item.id}>
                          {/* <td className="product-item-img">
                            <img
                              src={productImages[item.product] || book1}
                              alt={item.product_name}
                            />
                          </td> */}
                          <td className="product-item-name">
                            {item.product_name}
                          </td>
                          <td className="product-price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-lg-6">
                <form className="shop-form widget">
                  <h4 className="widget-title">Tổng thanh toán</h4>
                  <table className="table-bordered check-tbl mb-4">
                    <tbody>
                      <tr>
                        <td>Giá trị đơn hàng</td>
                        <td className="product-price">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(sub_total)}
                        </td>
                      </tr>
                      <tr>
                        <td>Giảm giá</td>
                        <td className="product-price">
                          {discount > 0
                            ? `- ${new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(discount)}`
                            : "No Discount"}
                        </td>
                      </tr>
                      <tr>
                        <td>Thành tiền</td>
                        <td className="product-price-total">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <h4 className="widget-title">Phương thức thanh toán</h4>
                  {/* <SingleInput
                    title="Name on Card"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleChange}
                  /> */}
                  <div className="form-group">
                    <Form.Select
                      aria-label="Credit Card Type"
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleChange}
                    >
                      <option value="">Phương thức thanh toán</option>
                      <option value="Momo">Thanh toán qua momo</option>
                      <option value="COD">Thanh toán khi nhận hàng</option>
                      {/* <option value="Business credit cards">
                        Business credit cards
                      </option> */}
                    </Form.Select>
                  </div>
                  {/* <SingleInput
                    title="Credit Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                  />
                  <SingleInput
                    title="Card Verification Number"
                    name="cardCVV"
                    value={formData.cardCVV}
                    onChange={handleChange}
                    type="password"
                  /> */}
                  <div className="form-group">
                    <button
                      className="btn btn-primary btnhover"
                      type="button"
                      onClick={handlePlaceOrder}
                    >
                      Đặt hàng
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- Product END --> */}
        </section>
      </div>
    </>
  );
}

export default ShopCheckout;
