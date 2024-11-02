import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import { Button, Nav, Tab } from "react-bootstrap";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// Component
import ClientsSlider from "../components/Home/ClientsSlider";
import CounterSection from "../elements/CounterSection";
import NewsLetter from "../components/NewsLetter";

// Images
import profile2 from "./../assets/images/profile2.jpg";
import profile4 from "./../assets/images/profile4.jpg";
import profile3 from "./../assets/images/profile3.jpg";
import profile1 from "./../assets/images/profile1.jpg";
import book15 from "./../assets/images/books/grid/book15.jpg";
import book3 from "./../assets/images/books/grid/book3.jpg";
import book5 from "./../assets/images/books/grid/book5.jpg";

const relatedBook = [
  { image: book15, title: "Terrible Madness" },
  { image: book3, title: "Battle Drive" },
  { image: book5, title: "Terrible Madness" },
];

function CommentBlog({ title, image }) {
  return (
    <>
      {/* <div className="comment-body" id="div-comment-3">
        <div className="comment-author vcard">
          <img src={image} alt="" className="avatar" />
          <cite className="fn">{title}</cite>{" "}
          <span className="says">says:</span>
          <div className="comment-meta">
            <Link to={"#"}>December 28, 2022 at 6:14 am</Link>
          </div>
        </div>
        <div className="comment-content dlab-page-text">
          <p>
            Donec suscipit porta lorem eget condimentum. Morbi vitae mauris in
            leo venenatis varius. Aliquam nunc enim, egestas ac dui in, aliquam
            vulputate erat.
          </p>
        </div>
        <div className="reply">
          <Link to={"#"} className="comment-reply-link">
            <i className="fa fa-reply"></i> Reply
          </Link>
        </div>
      </div> */}
    </>
  );
}

function ShopDetail() {
  const [count, setCount] = useState(1);
  const [productData, setProductData] = useState(null);

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { product } = queryParams;

  useEffect(() => {
    const productId = product || 2;
    fetch(`/api/book/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProductData(data))
      .catch((error) => console.error("Error:", error));
  }, [product]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  const handleIncrement = () => {
    if (count < productData.quantity) {
      setCount(count + 1);
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  // Utility function to strip HTML tags
  const stripHTML = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // Get the plain text description
  const plainDescription = stripHTML(productData.description || "");

  // Limit the description to 200 characters
  const maxLength = 1000; // Adjust the length as needed
  const shortDescription =
    plainDescription.length > maxLength
      ? plainDescription.substring(0, maxLength) + "..."
      : plainDescription;

  // Function to handle adding to cart
  const handleAddToCart = () => {
    const accessToken = Cookies.get("access"); // Get the access token from cookies

    if (!accessToken) {
      // If the user is not logged in, redirect to login or show a message
      toast.error("Hãy đăng nhập để thêm vào giỏ hàng");
      // You can redirect to login page if needed
      // window.location.href = "/login";
      return;
    }

    const cartItem = {
      product_id: productData.id,
      quantity: count,
    };

    fetch("/api/cart/carts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Include the bearer token
      },
      body: JSON.stringify(cartItem),
    })
      .then((response) => {
        if (!response.ok) {
          // Handle errors
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to add to cart.");
          });
        }
        return response.json();
      })
      .then((data) => {
        // Handle success (e.g., show a success message or update cart count)
        toast.success("Thêm sản phẩm thành công!");
        // console.log("Add to cart response:", data);
      })
      .catch((error) => {
        // Handle errors (e.g., show an error message)
        // console.error("Error adding to cart:", error);
        toast.error("Thêm sản phẩm thất bại!");
      });
  };
  return (
    <>
      <div className="page-content bg-grey">
        <section className="content-inner-1">
          <div className="container">
            <div className="row book-grid-row style-4 m-b60">
              <div className="col">
                <div className="dz-box">
                  <div className="dz-media">
                    <img src={productData.image} alt="book" />
                  </div>
                  <div className="dz-content">
                    <div className="dz-header">
                      <h3 className="title">{productData.name}</h3>
                      <div className="shop-item-rating">
                        <div className="d-lg-flex d-sm-inline-flex d-flex align-items-center">
                          <ul className="dz-rating">
                            <li>
                              <i className="flaticon-star text-yellow"></i>
                            </li>
                            <li>
                              <i className="flaticon-star text-yellow"></i>
                            </li>
                            <li>
                              <i className="flaticon-star text-yellow"></i>
                            </li>
                            <li>
                              <i className="flaticon-star text-yellow"></i>
                            </li>
                            <li>
                              <i className="flaticon-star text-muted"></i>
                            </li>
                          </ul>
                          <h6 className="m-b0">4.0</h6>
                        </div>
                        <div className="social-area">
                          <ul className="dz-social-icon style-3">
                            <li className="me-2">
                              <a
                                href="https://www.facebook.com/dexignzone"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i className="fa-brands fa-facebook-f"></i>
                              </a>
                            </li>
                            <li className="me-2">
                              <a
                                href="https://twitter.com/dexignzones"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i className="fa-brands fa-twitter"></i>
                              </a>
                            </li>
                            <li className="me-2">
                              <a
                                href="https://www.whatsapp.com/"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i className="fa-brands fa-whatsapp"></i>
                              </a>
                            </li>
                            <li>
                              <a
                                href="https://www.google.com/intl/en-GB/gmail/about/"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i className="fa-solid fa-envelope"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="dz-body">
                      <div className="book-detail">
                        <ul className="book-info">
                          <li>
                            <div className="writer-info">
                              {/* <img src={profile2} alt="author" /> */}
                              <div>
                                <span>Tác giả </span>
                                {productData.author}
                              </div>
                            </div>
                          </li>
                          <li>
                            <span>Publisher </span>
                            {productData.publisher}
                          </li>
                          <li>
                            <span>Year </span>
                            {productData.publication_year}
                          </li>
                        </ul>
                      </div>
                      <p className="text-1">{shortDescription}</p>
                      <div className="book-footer">
                        <div className="price">
                          <h5>{productData.new_price.toLocaleString()} VND</h5>
                          <p className="p-lr10">
                            {productData.price_origin.toLocaleString()} VND
                          </p>
                        </div>
                        <div className="product-num">
                          <div className="quantity btn-quantity style-1 me-3">
                            <button
                              className="btn btn-plus"
                              type="button"
                              onClick={handleIncrement}
                            >
                              <i className="ti-plus"></i>
                            </button>
                            <input
                              className="quantity-input"
                              type="text"
                              value={count}
                              readOnly
                            />
                            <button
                              className="btn btn-minus"
                              type="button"
                              onClick={handleDecrement}
                            >
                              <i className="ti-minus"></i>
                            </button>
                          </div>
                          <Button
                            onClick={handleAddToCart}
                            className="btn btn-primary btnhover btnhover2 flex justify-content-center"
                          >
                            {/* <i className="flaticon-shopping-cart-1"></i>{" "} */}
                            <span style={{ "margin-left": "0" }}>
                              Thêm vào giỏ hàng
                            </span>
                          </Button>
                          <div className="bookmark-btn style-1 d-none d-sm-block">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckDefault1"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexCheckDefault1"
                            >
                              <i className="flaticon-heart"></i>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Move the closing tags for container and section after the product details */}
              {/* Product Details and Reviews */}
              <div className="row mt-4">
                <div className="col-xl-8">
                  <Tab.Container defaultActiveKey="details">
                    <div className="product-description tabs-site-button">
                      <Nav as="ul" className="nav nav-tabs">
                        <Nav.Item as="li">
                          <Nav.Link eventKey="details">
                            Chi tiết sản phẩm
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="review">
                            Nhận xét khách hàng
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey="details">
                          <table className="table border book-overview">
                            <tbody>
                              <tr>
                                <th>Book Title</th>
                                <td>{productData.name}</td>
                              </tr>
                              <tr>
                                <th>Author</th>
                                <td>{productData.author}</td>
                              </tr>
                              <tr>
                                <th>Publication Year</th>
                                <td>{productData.publication_year}</td>
                              </tr>
                              <tr>
                                <th>Publisher</th>
                                <td>{productData.publisher}</td>
                              </tr>
                              <tr>
                                <th>Reprint Edition</th>
                                <td>{productData.reprint_edition}</td>
                              </tr>
                              <tr>
                                <th>Dimensions</th>
                                <td>{productData.dimensions}</td>
                              </tr>
                              <tr>
                                <th>Cover Type</th>
                                <td>{productData.cover_type}</td>
                              </tr>
                            </tbody>
                          </table>
                        </Tab.Pane>
                        <Tab.Pane eventKey="review">
                          {/* Customer Reviews Section */}
                          <div className="clear" id="comment-list">
                            <div className="post-comments comments-area style-1 clearfix">
                              <h4 className="comments-title">4 COMMENTS</h4>
                              <div id="comment">
                                <ol className="comment-list">
                                  <li
                                    className="comment even thread-even depth-1 comment"
                                    id="comment-2"
                                  >
                                    <CommentBlog
                                      title="Michel Poe"
                                      image={profile4}
                                    />
                                    <ol className="children">
                                      <li
                                        className="comment byuser comment-author-w3itexpertsuser bypostauthor odd alt depth-2 comment"
                                        id="comment-3"
                                      >
                                        <CommentBlog
                                          title="Celesto Anderson"
                                          image={profile3}
                                        />
                                      </li>
                                    </ol>
                                  </li>
                                  <li
                                    className="comment even thread-odd thread-alt depth-1 comment"
                                    id="comment-4"
                                  >
                                    <CommentBlog
                                      title="Ryan"
                                      image={profile2}
                                    />
                                  </li>
                                  <li
                                    className="comment odd alt thread-even depth-1 comment"
                                    id="comment-5"
                                  >
                                    <CommentBlog
                                      title="Stuart"
                                      image={profile1}
                                    />
                                  </li>
                                </ol>
                              </div>
                              <div
                                className="default-form comment-respond style-1"
                                id="respond"
                              >
                                <h4
                                  className="comment-reply-title"
                                  id="reply-title"
                                >
                                  LEAVE A REPLY
                                  <small>
                                    <Link
                                      to={"#"}
                                      rel="nofollow"
                                      id="cancel-comment-reply-link"
                                      style={{ display: "none" }}
                                    >
                                      Cancel reply
                                    </Link>
                                  </small>
                                </h4>
                                <div className="clearfix">
                                  <form
                                    method="post"
                                    id="comments_form"
                                    className="comment-form"
                                    noValidate
                                  >
                                    <p className="comment-form-author">
                                      <input
                                        id="name"
                                        placeholder="Author"
                                        name="author"
                                        type="text"
                                        value=""
                                      />
                                    </p>
                                    <p className="comment-form-email">
                                      <input
                                        id="email"
                                        required="required"
                                        placeholder="Email"
                                        name="email"
                                        type="email"
                                        value=""
                                      />
                                    </p>
                                    <p className="comment-form-comment">
                                      <textarea
                                        id="comments"
                                        placeholder="Type Comment Here"
                                        className="form-control4"
                                        name="comment"
                                        cols="45"
                                        rows="3"
                                        required="required"
                                      ></textarea>
                                    </p>
                                    <p className="col-md-12 col-sm-12 col-xs-12 form-submit">
                                      <button
                                        id="submit"
                                        type="submit"
                                        className="submit btn btn-primary filled"
                                      >
                                        Submit Now{" "}
                                        <i className="fa fa-angle-right m-l10"></i>
                                      </button>
                                    </p>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </div>
                  </Tab.Container>
                </div>
                {/* Related Books Section */}
                {/* <div className="col-xl-4 mt-5 mt-xl-0">
                  <div className="widget">
                    <h4 className="widget-title">Related Books</h4>
                    <div className="row">
                      {relatedBook.map((data, index) => (
                        <div className="col-xl-12 col-lg-6" key={index}>
                          <div className="dz-shop-card style-5">
                            <div className="dz-media">
                              <img src={data.image} alt="" />
                            </div>
                            <div className="dz-content">
                              <h5 className="subtitle">{data.title}</h5>
                              <ul className="dz-tags">
                                <li>THRILLE,</li>
                                <li>DRAMA,</li>
                                <li>HORROR</li>
                              </ul>
                              <div className="price">
                                <span className="price-num">$45.4</span>
                                <del>$98.4</del>
                              </div>
                              <Link
                                to={"/shop-cart"}
                                className="btn btn-outline-primary btn-sm btnhover btnhover2"
                              >
                                <i className="flaticon-shopping-cart-1 me-2"></i>{" "}
                                Add to cart
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div> */}
              </div>
              {/* Close the container and section divs here */}
            </div>
          </div>
        </section>
        <div className="bg-white py-5">
          <div className="container">
            <ClientsSlider />
          </div>
        </div>
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

export default ShopDetail;
