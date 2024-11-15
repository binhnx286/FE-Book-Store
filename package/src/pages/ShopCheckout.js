import React, { useState, useEffect } from "react";
import { Collapse, Form } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

// Components
import PageTitle from "./../layouts/PageTitle";

// Images
import book1 from "./../assets/images/books/grid/book1.jpg";

// Mapping product ID to images
const productImages = {
  90: book1,
};

const SingleInput = ({
  title,
  changeClass,
  value,
  onChange,
  type = "text",
  name,
}) => {
  return (
    <div className={`form-group ${changeClass}`}>
      <input
        type={type}
        className="form-control"
        placeholder={title}
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  );
};

function ShopCheckout() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State quản lý form
  const [formData, setFormData] = useState({
    province: "",
    district: "",
    ward: "",
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

  // State lưu trữ danh sách tỉnh/thành phố, quận/huyện, phường/xã
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // State lưu trữ phí vận chuyển
  const [shippingFee, setShippingFee] = useState(0);

  const FROM_DISTRICT_ID = 1542; // Mã quận/huyện gửi hàng của bạn
  const SHOP_ID = 195350; // Mã shop của bạn

  // fetch province
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const token = process.env.REACT_APP_SHIPPING_TOKEN;
        const config = {
          headers: {
            Token: token,
            "Content-Type": "application/json",
          },
        };

        const response = await axios.get(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
          config
        );
        const provincesData = response.data.data;
        setProvinces(provincesData);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  // Hàm fetch districts khi chọn province
  const fetchDistricts = async (provinceId) => {
    try {
      const token = process.env.REACT_APP_SHIPPING_TOKEN;

      const config = {
        headers: {
          Token: token,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
        { province_id: Number(provinceId) },
        config
      );
      const districtsData = response.data.data;
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Hàm fetch wards khi chọn district
  const fetchWards = async (districtId) => {
    try {
      const token = process.env.REACT_APP_SHIPPING_TOKEN;

      const config = {
        headers: {
          Token: token,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        { district_id: Number(districtId) },
        config
      );
      const wardsData = response.data.data;
      setWards(wardsData);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

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

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "province") {
      fetchDistricts(value);
      setFormData((prevState) => ({
        ...prevState,
        district: "",
        ward: "",
      }));
      setDistricts([]);
      setWards([]);
    } else if (name === "district") {
      fetchWards(value);
      setFormData((prevState) => ({
        ...prevState,
        ward: "",
      }));
      setWards([]);
    }
  };

  // Gọi calculateShippingFee khi người dùng chọn xong phường/xã
  useEffect(() => {
    if (formData.province && formData.district && formData.ward) {
      calculateShippingFee();
    }
  }, [formData.province, formData.district, formData.ward]);

  // Hàm lấy service_id
  const getServiceId = async () => {
    try {
      const token = process.env.REACT_APP_SHIPPING_TOKEN;
      const config = {
        headers: {
          Token: token,
          "Content-Type": "application/json",
        },
      };

      const payload = {
        shop_id: SHOP_ID,
        from_district: FROM_DISTRICT_ID,
        to_district: Number(formData.district),
      };

      const response = await axios.post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
        payload,
        config
      );

      const services = response.data.data;

      if (services && services.length > 0) {
        const serviceId = services[0].service_id;
        return serviceId;
      } else {
        throw new Error("Không tìm thấy dịch vụ vận chuyển phù hợp.");
      }
    } catch (error) {
      console.error("Error getting service ID:", error);
    }
  };

  // Hàm tính phí vận chuyển
  const calculateShippingFee = async () => {
    try {
      const serviceId = await getServiceId();

      if (!serviceId) {
        throw new Error("Không thể lấy service_id.");
      }

      const token = process.env.REACT_APP_SHIPPING_TOKEN;
      const config = {
        headers: {
          Token: token,
          "Content-Type": "application/json",
        },
      };

      const payload = {
        // service_id: serviceId,
        service_id: 53321,
        // insurance_value: cartData.total,
        insurance_value: 500000,
        coupon: null,
        from_district_id: FROM_DISTRICT_ID,
        to_district_id: Number(formData.district),
        to_ward_code: formData.ward,
        height: 15,
        length: 15,
        weight: 1000,
        width: 15,
      };

      const response = await axios.post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        payload,
        config
      );

      const shippingFee = response.data.data.total;
      setShippingFee(shippingFee);
    } catch (error) {
      console.error("Error calculating shipping fee:", error);
    }
  };

  if (loading) {
    return <div className="page-content">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="page-content text-danger">{error}</div>;
  }

  const { discount, sub_total, total, cart_items } = cartData;

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

      // Tạo payload từ formData và các thông tin cần thiết
      const payload = {
        // shipping_address: {
        //   province_id: Number(formData.province),
        //   district_id: Number(formData.district),
        //   ward_code: formData.ward,
        //   address: formData.address,
        //   apartment: formData.apartment,
        // },
        // full_name: formData.firstName,
        // email: formData.email,
        // phone: formData.phone,
        // payment_method: formData.cardType,
        // shipping_fee: shippingFee,
        // Thêm các thông tin khác nếu API yêu cầu
        shipping: shippingFee,
      };

      // Gọi API đặt hàng
      const response = await axios.post(
        `${process.env.REACT_APP_API_DOMAIN}/cart/checkout/`,
        payload,
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
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="widget">
                    <h4 className="widget-title">
                      Địa chỉ thanh toán và giao hàng
                    </h4>
                    <div className="form-group">
                      <Form.Select
                        aria-label="Province Select"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="mb-3"
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {provinces.map((province) => (
                          <option
                            key={province.ProvinceID}
                            value={province.ProvinceID}
                          >
                            {province.ProvinceName}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Select
                        aria-label="District Select"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="mb-3"
                        disabled={!formData.province}
                      >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((district) => (
                          <option
                            key={district.DistrictID}
                            value={district.DistrictID}
                          >
                            {district.DistrictName}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Select
                        aria-label="Ward Select"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        className="mb-3"
                        disabled={!formData.district}
                      >
                        <option value="">Chọn phường/xã</option>
                        {wards.map((ward) => (
                          <option key={ward.WardCode} value={ward.WardCode}>
                            {ward.WardName}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="row">
                      <SingleInput
                        title="Địa chỉ"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      <SingleInput
                        // changeClass="col-md-6"
                        title="Họ và tên"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <SingleInput
                      title="Căn hộ, tòa nhà,..."
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                    />
                    <SingleInput
                      title="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <SingleInput
                      title="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Phần còn lại của form nếu cần */}
              </div>
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
                            : "Không có"}
                        </td>
                      </tr>
                      <tr>
                        <td>Phí vận chuyển</td>
                        <td className="product-price">
                          {shippingFee > 0
                            ? `${new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(shippingFee)}`
                            : "Đang tính..."}
                        </td>
                      </tr>
                      <tr>
                        <td>Thành tiền</td>
                        <td className="product-price-total">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(total + shippingFee)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <h4 className="widget-title">Phương thức thanh toán</h4>
                  <div className="form-group">
                    <Form.Select
                      aria-label="Payment Method"
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleChange}
                    >
                      <option value="">Chọn phương thức thanh toán</option>
                      <option value="Momo">Thanh toán qua Momo</option>
                      <option value="COD">Thanh toán khi nhận hàng</option>
                    </Form.Select>
                  </div>
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
