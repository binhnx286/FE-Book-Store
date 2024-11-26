import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, Link } from "react-router-dom";

function OrderDetail() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = Cookies.get("access");

      try {
        // Gọi API chi tiết đơn hàng
        const detailsResponse = await axios.get(
          `${process.env.REACT_APP_API_DOMAIN}/cart/order-details/by-order/?order_id=${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Gọi API thông tin đơn hàng (nếu có)
        const orderResponse = await axios.get(
          `${process.env.REACT_APP_API_DOMAIN}/cart/orders/${orderId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrderDetails(detailsResponse.data);
        setOrderInfo(orderResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!orderDetails || orderDetails.length === 0) {
    return (
      <div className="container my-5">
        <p className="text-center text-danger">
          Không tìm thấy chi tiết đơn hàng.
        </p>
        <Link to="/order" className="btn btn-secondary mt-3">
          Quay lại Lịch sử Đơn Hàng
        </Link>
      </div>
    );
  }

  const statusColors = {
    Pending: "warning",
    Processing: "primary",
    Completed: "success",
    Cancelled: "danger",
  };

  return (
    <div className="container my-5">
      <Link to="/order" className="btn btn-link mb-4">
        <i className="bi bi-arrow-left"></i> Quay lại Lịch sử Đơn Hàng
      </Link>

      <h1 className="mb-4">
        <i className="bi bi-receipt me-2"></i>
        Chi Tiết Đơn Hàng #{orderId}
      </h1>

      {orderInfo && (
        <div className="mb-4">
          <h5>
            Trạng Thái:{" "}
            <span
              className={`badge bg-${
                statusColors[orderInfo.status] || "secondary"
              } ms-2`}
            >
              {orderInfo.status}
            </span>
          </h5>
          <p>
            <strong>Ngày Đặt Hàng:</strong>{" "}
            {new Date(orderInfo.create_time).toLocaleString("vi-VN")}
          </p>
          <p>
            <strong>Tổng Thanh Toán:</strong>{" "}
            {orderInfo.total.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
      )}

      <div className="card">
        <div className="card-header bg-primary">
          <h5 className="mb-0 text-white">Sản Phẩm</h5>
        </div>
        <ul className="list-group list-group-flush">
          {orderDetails.map((item) => (
            <li key={item.id} className="list-group-item">
              <div className="row align-items-center">
                <div className="col-md-2">
                  {/* Giả sử bạn có URL hình ảnh sản phẩm trong item.product_image */}
                  <img
                    src={item.product_image || "https://placehold.co/100"}
                    alt={item.product_name}
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-md-6">
                  <Link to={`/books-detail/?product=${item.product}`}>
                    <h5 className="mb-1">{item.product_name}</h5>
                  </Link>
                  <p className="mb-0">
                    <small>Mã sản phẩm: {item.product}</small>
                  </p>
                </div>
                <div className="col-md-2 text-center">
                  <span>Số lượng: {item.quantity}</span>
                </div>
                <div className="col-md-2 text-end">
                  <strong>
                    {item.total.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </strong>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="card-footer text-end">
          <h4 className="mb-0 mt-1">
            Tổng Cộng:{" "}
            <strong>
              {orderInfo.total.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </strong>
          </h4>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
