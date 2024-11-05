import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { Dropdown } from "react-bootstrap";
import Cookies from "js-cookie";
import SearchModel from "../models/SearchModel";
import "../assets/css/Header.css";

//images

import logo from "./../assets/images/_logo.png";
// import profile from "./../assets/images/profile1.jpg";
// import pic1 from "./../assets/images/books/small/pic1.jpg";
// import pic2 from "./../assets/images/books/small/pic2.jpg";
// import pic3 from "./../assets/images/books/small/pic3.jpg";

import Collapse from "react-bootstrap/Collapse";
import { MenuListArray2 } from "./MenuListArray2";

function Header({ onSearch }) {
  const [selectBtn, setSelectBtn] = useState("name"); //Tên sách
  const [userEmail, setUserEmail] = useState(null);
  const searchRef = useRef(null);
  const [showResults, setShowResults] = useState(false);
  /* for sticky header */
  const [headerFix, setheaderFix] = React.useState(false);
  const navigate = useNavigate();
  const [shopDataLength, setShopDataLength] = useState(0);

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { product } = queryParams;

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setheaderFix(window.scrollY > 50);
    });
  }, []);

  // Kiểm tra người dùng đã đăng nhập chưa khi component mount
  useEffect(() => {
    // Kiểm tra token access trong cookie
    const token = Cookies.get("access");
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang login
      // navigate("/login");
    } else {
      // Nếu có token, lấy email từ cookie và cập nhật state
      const email = Cookies.get("email");
      setUserEmail(email);
    }
  }, [navigate]);

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
          setShopDataLength(data[0].cart_items.length);
          console.log(data[0].cart_items.length);
        } else {
          console.error("Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, []);

  /* for open menu Toggle btn  */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const showSidebar = () => setSidebarOpen(!sidebarOpen);
  /*  Toggle btn End  */

  useEffect(() => {
    var mainMenu = document.getElementById("OpenMenu");
    if (mainMenu) {
      if (sidebarOpen) {
        mainMenu.classList.add("show");
      } else {
        mainMenu.classList.remove("show");
      }
    }
  });

  // Menu dropdown list
  const [active, setActive] = useState("Home");
  const handleMenuActive = (status) => {
    setActive(status);
    if (active === status) {
      setActive("");
    }
  };
  // Menu dropdown list End

  const logout = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("email");
    Cookies.remove("user_id");
    navigate.reload();
  };

  // Tim kiem
  const [searchParams, setSearchTerm] = useState(new SearchModel());
  const [searchResults, setSearchResults] = useState([]);

  // Hàm gọi API tìm kiếm
  const fetchSearchResults = async (term) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/book/search/?${
          searchParams.type
        }=${encodeURIComponent(term)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products);
      } else {
        console.error("Error fetching search results");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setSearchResults([]);
    }
  };

  // Sử dụng useEffect để debounce việc gọi API
  useEffect(() => {
    if (searchParams.term.length >= 3) {
      const delayDebounceFn = setTimeout(() => {
        fetchSearchResults(searchParams.term);
      }, 300); // Thời gian chờ 500ms

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchParams.term, searchParams.type]); // Theo dõi sự thay đổi của term và type

  const handleChange = (event) => {
    const term = event.target.value;
    const newSearchParams = SearchModel.fromObject({
      ...searchParams,
      term: term,
    });
    setSearchTerm(newSearchParams);
    setShowResults(true); // Hiển thị ô kết quả tìm kiếm
  };

  const handleSearchTypeChange = (type) => {
    const newSearchParams = SearchModel.fromObject({
      ...searchParams,
      type: type,
    });

    setSearchTerm(newSearchParams);
    setSelectBtn(type);
  };

  const SearchTypeStr = () => {
    switch (selectBtn) {
      default:
      case "name":
        return "Tên sách";
      case "author":
        return "Tác giả";
      case "publisher":
        return "Nhà xuất bản";
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="site-header mo-left header style-1">
      <div className="header-info-bar">
        <div className="container clearfix">
          {/* <!-- Website Logo --> */}
          <div className="logo-header logo-dark">
            <Link to={"/"}>
              <img src={logo} alt="logo" />
            </Link>
          </div>

          {/* <!-- EXTRA NAV --> */}
          <div className="extra-nav">
            <div className="extra-cell">
              <ul className="navbar-nav header-right">
                <li className="nav-item">
                  <Link to={"/wishlist"} className="nav-link">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
                    </svg>
                    {/* <span className="badge">{shopDataLength || 0}</span> */}
                  </Link>
                </li>
                <Dropdown as="li" className="nav-item">
                  <Link to={"/cart"}>
                    <Dropdown.Toggle
                      as="button"
                      type="button"
                      className="nav-link box cart-btn i-false"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                      {/* <span className="badge">{shopDataLength || 0}</span> */}
                    </Dropdown.Toggle>
                    {/* <Dropdown.Menu as="ul" className="dropdown-menu cart-list">
                    <li className="cart-item">
                      <div className="media">
                        <div className="media-left">
                          <Link to={"/books-detail"}>
                            <img alt="" className="media-object" src={pic1} />
                          </Link>
                        </div>
                        <div className="media-body">
                          <h6 className="dz-title">
                            <Link
                              to={"/books-detail"}
                              className="media-heading"
                            >
                              Real Life
                            </Link>
                          </h6>
                          <span className="dz-price">$28.00</span>
                          <span className="item-close">&times;</span>
                        </div>
                      </div>
                    </li>
                    <li className="cart-item">
                      <div className="media">
                        <div className="media-left">
                          <Link to={"/books-detail"}>
                            <img alt="" className="media-object" src={pic2} />
                          </Link>
                        </div>
                        <div className="media-body">
                          <h6 className="dz-title">
                            <Link
                              to={"/books-detail"}
                              className="media-heading"
                            >
                              Home
                            </Link>
                          </h6>
                          <span className="dz-price">$28.00</span>
                          <span className="item-close">&times;</span>
                        </div>
                      </div>
                    </li>
                    <li className="cart-item">
                      <div className="media">
                        <div className="media-left">
                          <Link to={"/books-detail"}>
                            <img alt="" className="media-object" src={pic3} />
                          </Link>
                        </div>
                        <div className="media-body">
                          <h6 className="dz-title">
                            <Link
                              to={"/books-detail"}
                              className="media-heading"
                            >
                              Such a fun age
                            </Link>
                          </h6>
                          <span className="dz-price">$28.00</span>
                          <span className="item-close">&times;</span>
                        </div>
                      </div>
                    </li>
                    <li className="cart-item text-center">
                      <h6 className="text-secondary">Totle = $500</h6>
                    </li>
                    <li className="text-center d-flex">
                      <Link
                        to={"/shop-cart"}
                        className="btn btn-sm btn-primary me-2 btnhover w-100"
                      >
                        View Cart
                      </Link>
                      <Link
                        to={"/shop-checkout"}
                        className="btn btn-sm btn-outline-primary btnhover w-100"
                      >
                        Checkout
                      </Link>
                    </li>
                  </Dropdown.Menu> */}
                  </Link>
                </Dropdown>
                <Dropdown
                  as="li"
                  className="nav-item dropdown profile-dropdown ms-4"
                >
                  <Dropdown.Toggle as="div" className="nav-link i-false">
                    <div className="profile-info">
                      {userEmail ? (
                        <>
                          <h6 className="title">Xin chào!</h6>
                          <span>{userEmail}</span>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate("/login")}
                            className="btn btn-sm btn-primary ms-2"
                          >
                            Đăng nhập
                          </button>
                        </>
                      )}
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu py-0 dropdown-menu-end">
                    {userEmail && (
                      <>
                        {/* <div className="dropdown-header">
                          <h6 className="m-0">Xin chào!</h6>
                          <span>{userEmail}</span>
                        </div> */}
                        <div className="dropdown-body">
                          <Link
                            to={"/my-profile"}
                            className="dropdown-item d-flex justify-content-between align-items-center ai-icon"
                          >
                            <div>
                              <span className="ms-2">Hồ sơ cá nhân</span>
                            </div>
                          </Link>
                          <Link
                            to={"/shop-cart"}
                            className="dropdown-item d-flex justify-content-between align-items-center ai-icon"
                          >
                            <div>
                              <span className="ms-2">Đơn hàng</span>
                            </div>
                          </Link>
                          {/* <Link
                            to={"/wishlist"}
                            className="dropdown-item d-flex justify-content-between align-items-center ai-icon"
                          >
                            <div>
                              <span className="ms-2">Danh sách</span>
                            </div>
                          </Link> */}
                        </div>
                        <div className="dropdown-footer">
                          <Link
                            // to={"/shop-login"}
                            onClick={logout}
                            className="btn btn-primary w-100 btnhover btn-sm"
                          >
                            Đăng Xuất
                          </Link>
                        </div>
                      </>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </ul>
            </div>
          </div>

          {/* <!-- header search nav --> */}
          <div className="header-search-nav" ref={searchRef}>
            {/* <form className="header-item-search" onSubmit={handleSubmit}> */}
            <form className="header-item-search">
              <div className="input-group search-input">
                <Dropdown className="dropdown bootstrap-select default-select drop-head">
                  <Dropdown.Toggle as="div" className="i-false">
                    {SearchTypeStr()}
                    <i className="ms-4 font-10 fa-solid fa-chevron-down"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleSearchTypeChange("name")}
                    >
                      Tên sách
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleSearchTypeChange("publisher")}
                    >
                      Nhà xuất bản
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleSearchTypeChange("author")}
                    >
                      Tác giả
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Text input with dropdown button"
                  placeholder="Tìm kiếm của bạn"
                  value={searchParams.term}
                  onChange={handleChange}
                />
                <Link
                  className="btn"
                  to={`/search/?type=${searchParams.type}&value=${searchParams.term}`}
                >
                  <i className="flaticon-loupe"></i>
                  {/* <i className="flaticon-loupe"></i> */}
                </Link>
              </div>
              {showResults && searchResults && searchResults.length > 0 && (
                <div className="search-results-dropdown">
                  <ul>
                    {searchResults.map((product) => (
                      <li key={product.id} className="search-result-item">
                        <Link
                          to={`/books-detail/?product=${product.id}`}
                          className="search-result-link"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="search-result-image"
                          />
                          <span className="search-result-name">
                            {product.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <div
        className={`sticky-header main-bar-wraper navbar-expand-lg ${
          headerFix ? "is-fixed" : ""
        }`}
      >
        <div className="main-bar clearfix">
          <div className="container clearfix">
            {/* <!-- Website Logo --> */}
            <div className="logo-header logo-dark">
              <Link to={"#"}>
                <img src={logo} alt="logo" />
              </Link>
            </div>

            {/* <!-- Nav Toggle Button --> */}
            <button
              className={`navbar-toggler collapsed navicon justify-content-end ${
                sidebarOpen ? "open" : ""
              }`}
              onClick={showSidebar}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* <!-- EXTRA NAV --> */}
            {/* <div className="extra-nav">
							<div className="extra-cell">
								<Link to={"/contact-us"} className="btn btn-primary btnhover">Get In Touch</Link>	
							</div>
						</div> */}

            {/* <!-- Main Nav --> */}
            <div
              className={`header-nav navbar-collapse collapse justify-content-start ${
                sidebarOpen ? "show" : ""
              }`}
              id="navbarNavDropdown"
            >
              <div className="logo-header logo-dark">
                <Link to={"#"}>
                  <img src={logo} alt="" />
                </Link>
              </div>
              <form className="search-input">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Text input with dropdown button"
                    placeholder="Search Books Here"
                  />
                  <button className="btn" type="button">
                    <i className="flaticon-loupe"></i>
                  </button>
                </div>
              </form>
              <ul className="nav navbar-nav">
                {MenuListArray2.map((data, index) => {
                  return (
                    <li
                      key={index}
                      className={`${
                        active === data.title && data.content
                          ? "sub-menu-down open"
                          : data.content
                          ? "sub-menu-down"
                          : ""
                      } `}
                    >
                      <Link
                        to={data.content ? "#" : data.to}
                        onClick={() => handleMenuActive(data.title)}
                      >
                        <span>{data.title}</span>
                      </Link>
                      {data.content && (
                        <Collapse in={active === data.title ? true : false}>
                          <ul className="sub-menu">
                            {data.content &&
                              data.content.map((data, index) => {
                                return (
                                  <li key={index}>
                                    <Link to={data.to}>{data.title}</Link>
                                  </li>
                                );
                              })}
                          </ul>
                        </Collapse>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="dz-social-icon">
                <ul>
                  <li>
                    <a
                      className="fab fa-facebook-f"
                      target="_blank"
                      rel="noreferrer"
                      href="https://www.facebook.com/dexignzone"
                    ></a>
                  </li>
                  <li>
                    <a
                      className="fab fa-twitter"
                      target="_blank"
                      rel="noreferrer"
                      href="https://twitter.com/dexignzones"
                    ></a>
                  </li>
                  <li>
                    <a
                      className="fab fa-linkedin-in"
                      target="_blank"
                      rel="noreferrer"
                      href="https://www.linkedin.com/showcase/3686700/admin/"
                    ></a>
                  </li>
                  <li>
                    <a
                      className="fab fa-instagram"
                      target="_blank"
                      rel="noreferrer"
                      href="https://www.instagram.com/website_templates__/"
                    ></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;