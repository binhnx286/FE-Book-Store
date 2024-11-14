import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

// Components
import PageTitle from "./../layouts/PageTitle";

function ShopCart() {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      const accessToken = Cookies.get("access");
      if (!accessToken) {
        console.error("Access token not found");
        setError("Vui lòng đăng nhập để xem giỏ hàng.");
        setLoading(false);
        return;
      }
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_DOMAIN}/cart/carts/`,
          {
            method: "GET",
            headers: headers,
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setShopData(data[0]);
          } else {
            setShopData(null);
          }
        } else {
          console.error("Failed to fetch cart data");
          setError("Không thể tải dữ liệu giỏ hàng.");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu giỏ hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchCartData();
  }, []);

  const cartItems = shopData ? shopData.cart_items : [];

  const handleDeleteClick = async (itemId) => {
    const accessToken = Cookies.get("access");
    if (!accessToken) {
      console.error("Access token not found");
      setError("Vui lòng đăng nhập để thực hiện thao tác này.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/cart/cart-items/${itemId}/`,
        {
          method: "DELETE",
          headers: headers,
        }
      );
      if (response.ok) {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setShopData({ ...shopData, cart_items: updatedCartItems });
      } else {
        console.error("Failed to delete cart item");
        setError("Không thể xóa sản phẩm khỏi giỏ hàng.");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      setError("Đã xảy ra lỗi khi xóa sản phẩm.");
    }
  };

  const handleNumPlus = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + 1;
      updateCartItemQuantity(itemId, newQuantity);
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              total: (item.total / item.quantity) * newQuantity,
            }
          : item
      );
      setShopData({ ...shopData, cart_items: updatedCartItems });
    }
  };

  const handleNumMinus = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCartItemQuantity(itemId, newQuantity);
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              total: (item.total / item.quantity) * newQuantity,
            }
          : item
      );
      setShopData({ ...shopData, cart_items: updatedCartItems });
    }
  };

  const handleInputChange = (e, itemId) => {
    let newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      newQuantity = 1; // Đặt số lượng tối thiểu là 1 nếu giá trị không hợp lệ
    }
    updateCartItemQuantity(itemId, newQuantity);
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: newQuantity,
            total: (item.total / item.quantity) * newQuantity,
          }
        : item
    );
    setShopData({ ...shopData, cart_items: updatedCartItems });
  }

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    const accessToken = Cookies.get("access");
    if (!accessToken) {
      console.error("Access token not found");
      setError("Vui lòng đăng nhập để thực hiện thao tác này.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/cart/cart-items/${itemId}/`,
        {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      if (!response.ok) {
        console.error("Failed to update cart item quantity");
        setError("Không thể cập nhật số lượng sản phẩm.");
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      setError("Đã xảy ra lỗi khi cập nhật số lượng sản phẩm.");
    }
  };

  // Tính toán tạm tính, tổng cộng, v.v.
  const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const total = subTotal - (shopData?.discount || 0); // Nếu có discount

  if (loading) {
    return (
      <div className="page-content">
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  return (
    <>
      <div className="page-content">
        <PageTitle parentPage="Trang chủ" childPage="Giỏ hàng" />
        <section className="content-inner shop-account">
          <div className="container">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {shopData ? (
              <>
                <div className="row mb-5">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table check-tbl">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Tên sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Tổng cộng</th>
                            <th className="text-end">Xóa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => (
                            <tr key={item.id}>
                              <td className="product-item-img">
                                {/* <img
                                  src={item.image || defaultImage}
                                  alt={item.product_name}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                  }}
                                /> */}
                              </td>
                              <td className="product-item-name">
                                {item.product_name}
                              </td>
                              <td className="product-item-price">
                                {Number(
                                  item.total / item.quantity
                                ).toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </td>
                              <td className="product-item-quantity">
                                <div className="quantity btn-quantity style-1 me-3">
                                  <button
                                    className="btn btn-plus"
                                    type="button"
                                    onClick={() => handleNumPlus(item.id)}
                                  >
                                    <i className="ti-plus"></i>
                                  </button>
                                  <input
                                    type="text"
                                    className="quantity-input"
                                    value={item.quantity}
                                  />
                                  <button
                                    className="btn btn-minus"
                                    type="button"
                                    onClick={() => handleNumMinus(item.id)}
                                  >
                                    <i className="ti-minus"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="product-item-total">
                                {Number(item.total).toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </td>
                              <td className="product-item-close">
                                <button
                                  className="ti-close"
                                  onClick={() => handleDeleteClick(item.id)}
                                ></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* Phần tính toán tổng giỏ hàng */}
                  <div className="col-lg-6">
                    {/* Bạn có thể thêm các thành phần như Calculate Shipping ở đây */}
                  </div>
                  <div className="col-lg-6">
                    <div className="widget">
                      <h4 className="widget-title">Tổng Giỏ Hàng</h4>
                      <table className="table-bordered check-tbl m-b25">
                        <tbody>
                          <tr>
                            <td>Tạm tính</td>
                            <td>
                              {Number(subTotal).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td>Vận chuyển</td>
                            <td>Miễn phí</td>
                          </tr>
                          <tr>
                            <td>Phiếu giảm giá</td>
                            <td>
                              {shopData.discount
                                ? `${Number(shopData.discount).toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )}`
                                : "0₫"}
                            </td>
                          </tr>
                          <tr>
                            <td>Tổng cộng</td>
                            <td>
                              {Number(total).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="form-group m-b25">
                        <Link
                          to={"/shop-checkout"}
                          className="btn btn-primary btnhover"
                          type="button"
                        >
                          Tiến hành thanh toán
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p>Giỏ hàng của bạn đang trống.</p>
                <Link to="/shop" className="btn btn-primary">
                  Tiếp tục mua sắm
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default ShopCart;
