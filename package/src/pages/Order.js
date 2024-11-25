import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      // Lấy token từ cookie với key là 'access'
      const token = Cookies.get("access");

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_DOMAIN}/cart/orders/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  const statusColors = {
    Pending: "warning",
    Processing: "primary",
    Completed: "success",
    Cancelled: "danger",
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5">
        <i className="fas fa-shopping-bag me-3"></i>
        Lịch sử Đơn Hàng
      </h1>
      {orders.length > 0 ? (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    Đơn Hàng #{order.id}
                    <span
                      className={`badge bg-${
                        statusColors[order.status] || "secondary"
                      } ms-2`}
                    >
                      {order.status}
                    </span>
                  </h5>
                  <p className="card-text">
                    <strong>Giảm Giá:</strong> {order.discount}%
                  </p>
                  <p className="card-text">
                    <strong>Tổng Tiền Hàng:</strong>{" "}
                    {order.sub_total.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p className="card-text">
                    <strong>Phí Vận Chuyển:</strong>{" "}
                    {order.shipping.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p className="card-text">
                    <strong>Tổng Thanh Toán:</strong>{" "}
                    {order.total.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p className="card-text">
                    <strong>Thời Gian Tạo:</strong>{" "}
                    {new Date(order.create_time).toLocaleString("vi-VN")}
                  </p>
                  <a
                    href={`/orders/${order.id}`}
                    className="btn btn-primary mt-3"
                  >
                    Xem Chi Tiết
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">Bạn chưa có đơn hàng nào.</p>
      )}
    </div>
  );
}

export default OrderHistory;
