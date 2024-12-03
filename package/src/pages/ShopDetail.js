import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import { Button, Nav, Tab, Pagination } from "react-bootstrap";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Rating from "react-rating";

// Component
import ClientsSlider from "../components/Home/ClientsSlider";
import CounterSection from "../elements/CounterSection";
import NewsLetter from "../components/NewsLetter";

// Images
import profile2 from "./../assets/images/profile2.jpg";
import profile4 from "./../assets/images/profile4.jpg";
import profile3 from "./../assets/images/profile3.jpg";
import profile1 from "./../assets/images/profile1.jpg";
import avatar from "./../assets/images/avatar.jpg";

const relatedBook = [
  { image: profile2, title: "Terrible Madness" },
  { image: profile4, title: "Battle Drive" },
  { image: profile3, title: "Terrible Madness" },
];

function CommentBlog({ title, image, rating, feedback, date }) {
  return (
    <>
      <div className="comment-body">
        <div className="comment-author vcard">
          {/* <img src={image} alt="" className="avatar" /> */}
          <cite className="fn">{title}</cite>{" "}
          <span className="says">says:</span>
          <div className="comment-meta">
            <Link to={"#"}>{date}</Link>
          </div>
          <div className="dz-rating">
            <Rating
              emptySymbol="far fa-star"
              fullSymbol="fas fa-star"
              initialRating={rating}
              readonly
              style={{
                color: "#FDCC0D",
                fontSize: "16px",
                marginRight: "16px",
              }}
            />
          </div>
        </div>
        <div className="comment-content dlab-page-text">
          <p>{feedback}</p>
        </div>
      </div>
    </>
  );
}

function ShopDetail() {
  const [count, setCount] = useState(1);
  const [productData, setProductData] = useState(null);
  const [ratingsData, setRatingsData] = useState(null);
  const [newRating, setNewRating] = useState(4);
  const [newFeedback, setNewFeedback] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Added state for current page
  const commentsPerPage = 5; // Number of comments per page
  const [viewed, setViewed] = useState(1);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { product } = queryParams;

  useEffect(() => {
    const fetchProductData = async () => {
      const productId = product || 1;
      try {
        // Fetch product data
        const response = await fetch(
          `${process.env.REACT_APP_API_DOMAIN}/book/products/${productId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProductData(data);
        // setViewed(data.viewed);

        // console.log("Current viewed count from server: " + data.viewed);

        const newViewed = data.viewed + 1;
        setViewed(newViewed);
        // console.log("Incremented viewed count: " + newViewed);

        await fetch(
          `${process.env.REACT_APP_API_DOMAIN}/book/products/${productId}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ viewed: newViewed.toString() }),
          }
        );

        // Fetch ratings data
        fetchRatingsData(productId);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProductData();
  }, [product]);

  // Function to fetch ratings data
  const fetchRatingsData = async (productId) => {
    try {
      const ratingsResponse = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/rating/ratings/${productId}/average_rating`
      );
      if (!ratingsResponse.ok) {
        throw new Error(`HTTP error! status: ${ratingsResponse.status}`);
      }
      const ratingsData = await ratingsResponse.json();
      setRatingsData(ratingsData);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      const user_id = Cookies.get("user_id");
      if (!user_id) {
        return;
      }
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_DOMAIN}/rating/recommendations/${user_id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.message) {
          setRecommendedProducts([]);
        } else {
          setRecommendedProducts(data);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendedProducts([]);
      }
    };
    fetchRecommendedProducts();
  }, []);

  // Calculate pagination values
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (ratingsData && ratingsData.ratings) {
      const total = Math.ceil(ratingsData.ratings.length / commentsPerPage);
      setTotalPages(total);
      if (currentPage > total) {
        setCurrentPage(total);
      }
    }
  }, [ratingsData, currentPage]);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments =
    ratingsData && ratingsData.ratings
      ? ratingsData.ratings.slice(indexOfFirstComment, indexOfLastComment)
      : [];

  if (!productData) {
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

  const handleIncrement = () => {
    if (count < productData.quantity) {
      setCount(count + 1);
    } else {
      toast.error("Vượt quá số lượng sản phẩm cho phép");
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue) || parsedValue < 1) {
      setCount(1);
    } else if (parsedValue > productData.quantity) {
      setCount(productData.quantity);
      toast.error("Vượt quá số lượng sản phẩm cho phép");
    } else {
      setCount(parsedValue);
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

  // Limit the description to 800 characters
  const maxLength = 800; // Adjust the length as needed
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
      return;
    }

    const cartItem = {
      product_id: productData.id,
      quantity: count,
    };

    fetch(`${process.env.REACT_APP_API_DOMAIN}/cart/carts/`, {
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
        console.log(data);
        toast.success("Thêm sản phẩm thành công!");
      })
      .catch((error) => {
        // Handle errors (e.g., show an error message)
        toast.error("Thêm sản phẩm thất bại!");
      });
  };

  // Function to handle submitting a new review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    const accessToken = Cookies.get("access");
    const user_id = Cookies.get("user_id");

    if (!accessToken) {
      // User is not logged in
      toast.error("Hãy đăng nhập để đánh giá sản phẩm");
      return;
    }

    const reviewData = {
      user: user_id,
      product: productData.id,
      rate: newRating,
      feed_back: newFeedback,
    };

    fetch(`${process.env.REACT_APP_API_DOMAIN}/rating/ratings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to submit review.");
          });
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Đánh giá của bạn đã được gửi!");
        // Reset the form
        setNewRating(0);
        setNewFeedback("");
        // Refresh the ratings data
        fetchRatingsData(productData.id);
      })
      .catch((error) => {
        toast.error("Gửi đánh giá thất bại!");
      });
  };

  return (
    <>
      <div className="page-content bg-grey">
        <section className="content-inner-1">
          <div className="container">
            <div className="row book-grid-row style-4 m-b60">
              <div className="col mb-4">
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
                            <Rating
                              emptySymbol="far fa-star"
                              fullSymbol="fas fa-star"
                              initialRating={
                                ratingsData ? ratingsData.average_rating : ""
                              }
                              readonly
                              style={{
                                color: "#FDCC0D",
                                fontSize: "24px",
                                marginRight: "16px",
                              }}
                            />
                          </ul>
                          <h4 className="m-b0">
                            {ratingsData
                              ? ratingsData.average_rating.toFixed(1)
                              : "0.0"}
                          </h4>
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
                            <span>Nhà xuất bản </span>
                            {productData.publisher}
                          </li>
                          <li>
                            <span>Năm xuất bản</span>
                            {productData.publication_year}
                          </li>
                        </ul>
                      </div>
                      <p className="text-1">{shortDescription}</p>
                      <div className="book-footer">
                        <div className="price">
                          <h5>{productData.new_price.toLocaleString()}₫</h5>
                          <p className="p-lr10">
                            {productData.price_origin.toLocaleString()}₫
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
                              onChange={handleInputChange}
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
                            <span style={{ marginLeft: "0" }}>
                              Thêm vào giỏ hàng
                            </span>
                          </Button>
                          {/* <div className="bookmark-btn style-1 d-none d-sm-block">
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
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                                <th>Tên sách</th>
                                <td>{productData.name}</td>
                              </tr>
                              <tr>
                                <th>Tác giả</th>
                                <td>{productData.author}</td>
                              </tr>
                              <tr>
                                <th>Năm xuất bản</th>
                                <td>{productData.publication_year}</td>
                              </tr>
                              <tr>
                                <th>Nhà xuất bản</th>
                                <td>{productData.publisher}</td>
                              </tr>
                              <tr>
                                <th>Tái bản</th>
                                <td>{productData.reprint_edition}</td>
                              </tr>
                              <tr>
                                <th>Kích thước</th>
                                <td>{productData.dimensions}</td>
                              </tr>
                              <tr>
                                <th>Loại bìa</th>
                                <td>{productData.cover_type}</td>
                              </tr>
                            </tbody>
                          </table>
                        </Tab.Pane>
                        <Tab.Pane eventKey="review">
                          {/* Customer Reviews Section */}
                          <div className="clear" id="comment-list">
                            <div className="post-comments comments-area style-1 clearfix">
                              <h4 className="comments-title">Bình luận</h4>
                              <div id="comment">
                                {currentComments &&
                                currentComments.length > 0 ? (
                                  <ol className="comment-list">
                                    {currentComments.map((rating) => (
                                      <li
                                        key={rating.id}
                                        className="comment even thread-even depth-1 comment"
                                        id={`comment-${rating.id}`}
                                      >
                                        <CommentBlog
                                          title={rating.user.name}
                                          image={avatar}
                                          rating={rating.rate}
                                          feedback={rating.feed_back}
                                          // date={
                                          //   rating.created_at || "Ngày đăng"
                                          // }
                                        />
                                      </li>
                                    ))}
                                  </ol>
                                ) : (
                                  <p>Chưa có đánh giá nào.</p>
                                )}
                              </div>
                              {/* Pagination Controls */}
                              {totalPages > 1 && (
                                <Pagination className="mt-1 mb-3">
                                  <Pagination.First
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                  />
                                  <Pagination.Prev
                                    onClick={() =>
                                      setCurrentPage((prev) => prev - 1)
                                    }
                                    disabled={currentPage === 1}
                                  />
                                  {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                  ).map((number) => (
                                    <Pagination.Item
                                      key={number}
                                      active={number === currentPage}
                                      onClick={() => setCurrentPage(number)}
                                    >
                                      {number}
                                    </Pagination.Item>
                                  ))}
                                  <Pagination.Next
                                    onClick={() =>
                                      setCurrentPage((prev) => prev + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                  />
                                  <Pagination.Last
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                  />
                                </Pagination>
                              )}
                              <div
                                className="default-form comment-respond style-1"
                                id="respond"
                              >
                                <h4
                                  className="comment-reply-title"
                                  id="reply-title"
                                >
                                  Đánh giá của bạn
                                </h4>
                                <div className="clearfix">
                                  <form
                                    onSubmit={handleSubmitReview}
                                    id="comments_form"
                                    className="comment-form"
                                    noValidate
                                  >
                                    <Rating
                                      emptySymbol="far fa-star"
                                      fullSymbol="fas fa-star"
                                      initialRating={newRating}
                                      onChange={(value) => setNewRating(value)}
                                      style={{
                                        color: "#FDCC0D",
                                        marginLeft: "20px",
                                        marginBottom: "20px",
                                        fontSize: "24px",
                                      }}
                                    />
                                    <p className="comment-form-comment">
                                      <textarea
                                        id="comments"
                                        placeholder="Viết bình luận của bạn"
                                        className="form-control4"
                                        name="comment"
                                        cols="45"
                                        rows="3"
                                        required="required"
                                        value={newFeedback}
                                        onChange={(e) =>
                                          setNewFeedback(e.target.value)
                                        }
                                      ></textarea>
                                    </p>
                                    <p className="col-md-12 col-sm-12 col-xs-12 form-submit">
                                      <button
                                        id="submit"
                                        type="submit"
                                        className="submit btn btn-primary filled"
                                      >
                                        Gửi đánh giá{" "}
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
                {recommendedProducts && recommendedProducts.length > 0 && (
                  <div className="col-xl-4 mt-5 mt-xl-0">
                    <div className="widget">
                      <h4 className="widget-title">Đề xuất cho bạn</h4>
                      <div className="row">
                        {recommendedProducts.map((data, index) => (
                          <div className="col-xl-12 col-lg-6" key={index}>
                            <div className="dz-shop-card style-5">
                              <div className="dz-media">
                                <img src={data.image} alt={data.name} />
                              </div>
                              <div className="dz-content">
                                <h5 className="subtitle">{data.name}</h5>
                                <ul className="dz-tags">
                                  <li>{data.sub_category}</li>
                                </ul>
                                <div className="price">
                                  <span className="price-num">
                                    {data.new_price.toLocaleString()}₫
                                  </span>
                                  {data.discount_percent > 0 && (
                                    <del>
                                      {data.price_origin.toLocaleString()}₫
                                    </del>
                                  )}
                                </div>
                                <Link
                                  to={`/shop-detail?product=${data.id}`}
                                  className="btn btn-outline-primary btn-sm btnhover btnhover2"
                                >
                                  <i className="flaticon-shopping-cart-1 me-2"></i>
                                  Xem chi tiết
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
