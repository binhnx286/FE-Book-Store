import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Cookies from "js-cookie";
// Placeholder image
// import defaultImage from "./../assets/images/default-product.jpg";
//Components
import PageTitle from "./../layouts/PageTitle";

function ShopCart() {
  const [shopData, setShopData] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      const accessToken = Cookies.get("access");
      if (!accessToken) {
        console.error("Access token not found");
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
          setShopData(data);
        } else {
          console.error("Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, []);

  const cartItems = shopData.length > 0 ? shopData[0].cart_items : [];

  const handleDeleteClick = (itemId) => {
    const accessToken = Cookies.get("access");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    fetch(`${process.env.REACT_APP_API_DOMAIN}/cart/cart-items/${itemId}/`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          const updatedCartItems = cartItems.filter(
            (item) => item.id !== itemId
          );
          const updatedShopData = [...shopData];
          updatedShopData[0].cart_items = updatedCartItems;
          setShopData(updatedShopData);
        } else {
          console.error("Failed to delete cart item");
        }
      })
      .catch((error) => {
        console.error("Error deleting cart item:", error);
      });
  };

  const handleNumPlus = (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + 1;
        updateCartItemQuantity(itemId, newQuantity);
        return {
          ...item,
          quantity: newQuantity,
          total: (item.total / item.quantity) * newQuantity,
        };
      }
      return item;
    });
    const updatedShopData = [...shopData];
    updatedShopData[0].cart_items = updatedCartItems;
    setShopData(updatedShopData);
  };

  const handleNumMinus = (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId && item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        updateCartItemQuantity(itemId, newQuantity);
        return {
          ...item,
          quantity: newQuantity,
          total: (item.total / item.quantity) * newQuantity,
        };
      }
      return item;
    });
    const updatedShopData = [...shopData];
    updatedShopData[0].cart_items = updatedCartItems;
    setShopData(updatedShopData);
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    const accessToken = Cookies.get("access");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    fetch(`${process.env.REACT_APP_API_DOMAIN}/cart/cart-items/${itemId}/`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to update cart item quantity");
        }
      })
      .catch((error) => {
        console.error("Error updating cart item quantity:", error);
      });
  };

  // Calculate subtotal, total, etc.
  const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <div className="page-content">
        <PageTitle parentPage="Shop" childPage="Cart" />
        <section className="content-inner shop-account">
          {/* <!-- Product --> */}
          <div className="container">
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
                      {cartItems.map((data, index) => (
                        <tr key={index}>
                          <td className="product-item-img">
                            <img src={data.image} alt="" />
                          </td>
                          <td className="product-item-name">
                            {data.product_name}
                          </td>
                          <td className="product-item-price">
                            {Number(data.total / data.quantity).toLocaleString(
                              "vi-VN",
                              { style: "currency", currency: "VND" }
                            )}
                          </td>
                          <td className="product-item-quantity">
                            <div className="quantity btn-quantity style-1 me-3">
                              <button
                                className="btn btn-plus"
                                type="button"
                                onClick={() => {
                                  handleNumPlus(data.id);
                                }}
                              >
                                <i className="ti-plus"></i>
                              </button>
                              <input
                                type="text"
                                className="quantity-input"
                                value={data.quantity}
                                readOnly
                              />
                              <button
                                className="btn btn-minus "
                                type="button"
                                onClick={() => {
                                  handleNumMinus(data.id);
                                }}
                              >
                                <i className="ti-minus"></i>
                              </button>
                            </div>
                          </td>
                          <td className="product-item-total">
                            {Number(data.total).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </td>
                          <td className="product-item-close">
                            <Link
                              to={"#"}
                              className="ti-close"
                              onClick={() => handleDeleteClick(data.id)}
                            ></Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row">
              {/* Other components like Calculate Shipping, Cart Subtotal, etc. */}
              <div className="col-lg-6">
                {/* Shipping form can remain the same */}
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
                        <td>0₫</td>
                      </tr>
                      <tr>
                        <td>Tổng cộng</td>
                        <td>
                          {Number(subTotal).toLocaleString("vi-VN", {
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
          </div>
          {/* <!-- Product END --> */}
        </section>
      </div>
    </>
  );
}

export default ShopCart;
