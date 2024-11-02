import React, { useState, useEffect } from "react";
import { Environment } from "../Environment";
import { useOutletContext, useLocation } from "react-router-dom";

import queryString from "query-string";

import { Link } from "react-router-dom";
import { Collapse, Dropdown } from "react-bootstrap";

//Component
import ClientsSlider from "../components/Home/ClientsSlider";
import NewsLetter from "../components/NewsLetter";

//element
import CounterSection from "../elements/CounterSection";
import ShopSidebar from "../elements/ShopSidebar";

//Images
import book16 from "./../assets/images/books/grid/book16.jpg";
import book8 from "./../assets/images/books/grid/book8.jpg";
import book14 from "./../assets/images/books/grid/book14.jpg";
import book15 from "./../assets/images/books/grid/book15.jpg";
import book4 from "./../assets/images/books/grid/book4.jpg";
import book9 from "./../assets/images/books/grid/book9.jpg";
import book2 from "./../assets/images/books/grid/book2.jpg";
import book7 from "./../assets/images/books/grid/book7.jpg";
import book13 from "./../assets/images/books/grid/book13.jpg";
import book10 from "./../assets/images/books/grid/book10.jpg";
import book11 from "./../assets/images/books/grid/book11.jpg";
import SearchModel from "../models/SearchModel";

const lableBlogData = [
  { name: "Architecture" },
  { name: "Art" },
  { name: "Action" },
  { name: "Biography & Autobiography" },
  { name: "Body, Mind & Spirit" },
  { name: "Business & Economics" },
  { name: "Children Fiction" },
  { name: "Children Non-Fiction" },
  { name: "Comics & Graphic Novels" },
  { name: "Cooking" },
  { name: "Crafts & Hobbies" },
  { name: "Design" },
  { name: "Drama" },
  { name: "Education" },
  { name: "Family & Relationships" },
  { name: "Fiction" },
  { name: "Foreign Language Study" },
  { name: "Games" },
  { name: "Gardening" },
  { name: "Health & Fitness" },
  { name: "History" },
  { name: "House & Home" },
  { name: "Humor" },
  { name: "Literary Collections" },
  { name: "Mathematics" },
];

// mock data
const cardDetials = [
  // {image:book16, name:'Thunder Stunt', sub_category:'ADVANTURE',publisher:'SCIENCE', price_origin:'54.78', new_price:'70.00' },
  // {image:book14, name:'A Heavy Lift', sub_category:'RACING',publisher:'DRAMA', price_origin:'25.18', new_price:'68.00' },
  // {image:book15, name:'Terrible Madness', sub_category:'SPORTS',publisher:'GAME', price_origin:'25.30', new_price:'38.00' },
  // {image:book4, name:'Such Fun Age', sub_category:'ADVANTURE', price_origin:'20.15', new_price:'33.00' },
  // {image:book9, name:'Pushing Clouds', sub_category:'ADVANTURE', price_origin:'30.12', new_price:'40.00' },
  // {image:book2, name:'Homie', sub_category:'HORROR',publisher:'DRAMA', price_origin:'15.25', new_price:'45.00' },
  // {image:book7, name:'SECONDS', sub_category:'SPORTS',publisher:'GAME', price_origin:'21.78', new_price:'36.00' },
  // {image:book13, name:'REWORK', sub_category:'THRILLER', price_origin:'23.20', new_price:'49.00' },
  // {image:book11, name:'ALL GOOD NEWS', sub_category:'DRAMA',publisher:'COMEDY', price_origin:'40.78', new_price:'68.00' },
  // {image:book10, name:'Emily The Back', sub_category:'DRAMA',publisher:'SIRIAL', price_origin:'54.78', new_price:'63.00' },
  // {image:book8, name:'The Adventure', sub_category:'BIOGRAPHY', price_origin:'37.00', new_price:'47.00' },
  // {image:book14, name:'A Heavy Lift', sub_category:'STORY',publisher:'BIOGRAPHY', price_origin:'22.00', new_price:'51.00' },
];

function BooksGridViewSidebar() {
  const [accordBtn, setAccordBtn] = useState();
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [subCategories, setSubCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publicationYears, setPublicationYears] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [sortOrder, setSortOrder] = useState(null); // 'asc' cho tăng dần, 'desc' cho giảm dần
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 12; // Số sản phẩm trên mỗi trang

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { type, value } = queryParams;

  // Tim kiem
  const { searchParams } = useOutletContext();
  const [cardBookDetails, setBooks] = useState(cardDetials); // data test mac dinh

  useEffect(() => {
    const fetchBooks = async () => {
      //   let url = `${Environment.getSearchEndpoint()}/${searchParams.toQueryString()}`;
      let url = `${Environment.getSearchEndpoint()}/?${type}=${value}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (data && data.products) {
        setBooks(data.products);
        setSubCategories(data.sub_categories);
        setPublishers(data.publishers);
        setAuthors(data.authors);
        setPublicationYears(data.publication_years);
      } else {
        // khong tim thay
        setBooks([]);
      }
    };

    if (queryParams) {
      fetchBooks();
    }
  }, [queryParams]);

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handlePublisherClick = (publisher) => {
    if (selectedPublishers.includes(publisher)) {
      setSelectedPublishers(
        selectedPublishers.filter((item) => item !== publisher)
      );
    } else {
      setSelectedPublishers([...selectedPublishers, publisher]);
    }
  };

  const handleAuthorClick = (author) => {
    if (selectedAuthors.includes(author)) {
      setSelectedAuthors(selectedAuthors.filter((item) => item !== author));
    } else {
      setSelectedAuthors([...selectedAuthors, author]);
    }
  };

  const handleYearClick = (year) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((item) => item !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  // Hàm lọc sản phẩm
  const filteredProducts = cardBookDetails.filter((product) => {
    return (
      (selectedCategories.length === 0 ||
        selectedCategories.includes(product.sub_category)) &&
      (selectedPublishers.length === 0 ||
        selectedPublishers.includes(product.publisher)) &&
      (selectedAuthors.length === 0 ||
        selectedAuthors.includes(product.author)) &&
      (selectedYears.length === 0 ||
        selectedYears.includes(product.publication_year))
    );
  });

  // Hàm sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts];

  if (sortOrder === "asc") {
    sortedProducts.sort((a, b) => (a.new_price || 0) - (b.new_price || 0));
  } else if (sortOrder === "desc") {
    sortedProducts.sort((a, b) => (b.new_price || 0) - (a.new_price || 0));
  }

  // Tính toán phân trang
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="page-content bg-grey">
        <div className="content-inner-1 border-bottom">
          <div className="container">
            <div className="row ">
              <div className="col-xl-3 bg-white border rounded-1">
                {/* <ShopSidebar /> */}
                <div className="sidebar">
                  <h3>Thể loại</h3>
                  <ul>
                    {subCategories.map((category, index) => (
                      <li
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                        style={{
                          cursor: "pointer",
                          fontWeight: selectedCategories.includes(category)
                            ? "bold"
                            : "normal",
                          color: selectedCategories.includes(category)
                            ? "blue"
                            : "black",
                        }}
                      >
                        {selectedCategories.includes(category) && (
                          <i className="fas fa-check-circle"></i>
                        )}{" "}
                        {category}
                      </li>
                    ))}
                  </ul>

                  <h3>Nhà xuất bản</h3>
                  <ul>
                    {publishers.map((publisher, index) => (
                      <li
                        key={index}
                        onClick={() => handlePublisherClick(publisher)}
                        style={{
                          cursor: "pointer",
                          fontWeight: selectedPublishers.includes(publisher)
                            ? "bold"
                            : "normal",
                          color: selectedPublishers.includes(publisher)
                            ? "blue"
                            : "black",
                        }}
                      >
                        {selectedPublishers.includes(publisher) && (
                          <i className="fas fa-check-circle"></i>
                        )}{" "}
                        {publisher}
                      </li>
                    ))}
                  </ul>

                  <h3>Tác giả</h3>
                  <ul>
                    {authors.map((author, index) => (
                      <li
                        key={index}
                        onClick={() => handleAuthorClick(author)}
                        style={{
                          cursor: "pointer",
                          fontWeight: selectedAuthors.includes(author)
                            ? "bold"
                            : "normal",
                          color: selectedAuthors.includes(author)
                            ? "blue"
                            : "black",
                        }}
                      >
                        {selectedAuthors.includes(author) && (
                          <i className="fas fa-check-circle"></i>
                        )}{" "}
                        {author}
                      </li>
                    ))}
                  </ul>

                  <h3>Năm xuất bản</h3>
                  <ul>
                    {publicationYears.map((year, index) => (
                      <li
                        key={index}
                        onClick={() => handleYearClick(year)}
                        style={{
                          cursor: "pointer",
                          fontWeight: selectedYears.includes(year)
                            ? "bold"
                            : "normal",
                          color: selectedYears.includes(year)
                            ? "blue"
                            : "black",
                        }}
                      >
                        {selectedYears.includes(year) && (
                          <i className="fas fa-check-circle"></i>
                        )}{" "}
                        {year}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-xl-9">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="name">Kết quả tìm kiếm</h4>
                  <Link to={"#"} className="btn btn-primary panel-btn">
                    Filter
                  </Link>
                </div>
                <div className="filter-area m-b30">
                  <div className="grid-area">
                    {/* <div className="shop-tab">
                      <ul
                        className="nav text-center product-filter justify-content-end"
                        role="tablist"
                      >
                        <li className="nav-item">
                          <Link to={"/books-list"} className="nav-link">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 5H21C21.2652 5 21.5196 4.89464 21.7071 4.7071C21.8946 4.51957 22 4.26521 22 4C22 3.73478 21.8946 3.48043 21.7071 3.29289C21.5196 3.10536 21.2652 3 21 3H3C2.73478 3 2.48043 3.10536 2.29289 3.29289C2.10536 3.48043 2 3.73478 2 4C2 4.26521 2.10536 4.51957 2.29289 4.7071C2.48043 4.89464 2.73478 5 3 5Z"
                                fill="#AAAAAA"
                              ></path>
                              <path
                                d="M3 13H21C21.2652 13 21.5196 12.8947 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11H3C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8947 2.73478 13 3 13Z"
                                fill="#AAAAAA"
                              ></path>
                              <path
                                d="M3 21H21C21.2652 21 21.5196 20.8947 21.7071 20.7071C21.8946 20.5196 22 20.2652 22 20C22 19.7348 21.8946 19.4804 21.7071 19.2929C21.5196 19.1054 21.2652 19 21 19H3C2.73478 19 2.48043 19.1054 2.29289 19.2929C2.10536 19.4804 2 19.7348 2 20C2 20.2652 2.10536 20.5196 2.29289 20.7071C2.48043 20.8947 2.73478 21 3 21Z"
                                fill="#AAAAAA"
                              ></path>
                            </svg>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to={"/books-grid-view"} className="nav-link">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 11H10C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10V3C11 2.73478 10.8946 2.48043 10.7071 2.29289C10.5196 2.10536 10.2652 2 10 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V10C2 10.2652 2.10536 10.5196 2.29289 10.7071C2.48043 10.8946 2.73478 11 3 11ZM4 4H9V9H4V4Z"
                                fill="#AAAAAA"
                              ></path>
                              <path
                                d="M14 11H21C21.2652 11 21.5196 10.8946 21.7071 10.7071C21.8946 10.5196 22 10.2652 22 10V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2H14C13.7348 2 13.4804 2.10536 13.2929 2.29289C13.1054 2.48043 13 2.73478 13 3V10C13 10.2652 13.1054 10.5196 13.2929 10.7071C13.4804 10.8946 13.7348 11 14 11ZM15 4H20V9H15V4Z"
                                fill="#AAAAAA"
                              ></path>
                              <path
                                d="M3 22H10C10.2652 22 10.5196 21.8946 10.7071 21.7071C10.8946 21.5196 11 21.2652 11 21V14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13H3C2.73478 13 2.48043 13.1054 2.29289 13.2929C2.10536 13.4804 2 13.7348 2 14V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22ZM4 15H9V20H4V15Z"
                                fill="#AAAAAA"
                              ></path>
                              <path
                                d="M14 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V14C22 13.7348 21.8946 13.4804 21.7071 13.2929C21.5196 13.1054 21.2652 13 21 13H14C13.7348 13 13.4804 13.1054 13.2929 13.2929C13.1054 13.4804 13 13.7348 13 14V21C13 21.2652 13.1054 21.5196 13.2929 21.7071C13.4804 21.8946 13.7348 22 14 22ZM15 15H20V20H15V15Z"
                                fill="#AAAAAA"
                              ></path>
                            </svg>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to={"/books-grid-view-sidebar"}
                            className="nav-link"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22ZM13 4H20V11H13V4ZM13 13H20V20H13V13ZM4 4H11V20H4V4Z"
                                fill="#AAAAAA"
                              ></path>
                            </svg>
                          </Link>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                  <div className="category">
                    {/* <div className="filter-category">
                      <Link
                        to={"#"}
                        data-bs-toggle="collapse"
                        onClick={() => setAccordBtn(!accordBtn)}
                      >
                        <i className="fas fa-list me-2"></i>
                        Categories
                      </Link>
                    </div> */}
                    {/* <div className="form-group">
                      <i className="fas fa-sort-amount-down me-2 text-secondary"></i>
                      <Dropdown>
                        <Dropdown.Toggle className="i-false">
                          {selectBtn}{" "}
                          <i className="ms-4 font-14 fa-solid fa-caret-down" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setSelectBtn("Newest")}>
                            Newest
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setSelectBtn("1 Days")}>
                            1 Days
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setSelectBtn("2 Week")}>
                            2 Week
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setSelectBtn("3 Week")}>
                            3 Weeks
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setSelectBtn("1 Month")}
                          >
                            1 Month
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div> */}
                    <Dropdown className="sort-dropdown">
                      {" "}
                      Sắp xếp theo giá:{" "}
                      <Dropdown.Toggle id="dropdown-sort">
                        {sortOrder === "asc"
                          ? "Tăng dần"
                          : sortOrder === "desc"
                          ? "Giảm dần"
                          : "Mặc định"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSortOrder(null)}>
                          Mặc định
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortOrder("asc")}>
                          Giá tăng dần
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortOrder("desc")}>
                          Giá giảm dần
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <Collapse in={accordBtn} className="acod-content">
                  <div>
                    <div className="widget widget_services style-2">
                      {lableBlogData.map((item, ind) => (
                        <div className="form-check search-content" key={ind}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id={`productCheckBox${ind + 1}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`productCheckBox${ind + 1}`}
                          >
                            {item.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </Collapse>
                <div className="row book-grid-row">
                  {currentProducts.map((data, i) => (
                    <div className="col-book style-2" key={i}>
                      <div
                        className="dz-shop-card style-1"
                        style={{
                          "min-height": "573px",
                        }}
                      >
                        <div className="dz-media">
                          <img src={data.image} alt="book" />
                        </div>
                        <div className="bookmark-btn style-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`flexCheckDefault${i + 21}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`flexCheckDefault${i + 21}`}
                          >
                            <i className="flaticon-heart"></i>
                          </label>
                        </div>
                        <div className="dz-content">
                          <h5
                            className="name"
                            style={{
                              height: "56px",
                            }}
                          >
                            {truncateText(data.name, 30)}
                          </h5>
                          <ul>
                            <li>{data.sub_category}</li>
                            <li>Tác giả: {data.author}</li>
                            <li style={{ height: "52px" }}>
                              Nhà xuất bản {data.publisher}
                            </li>
                          </ul>
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
                              <i className="flaticon-star text-yellow"></i>
                            </li>
                          </ul>
                          <div className="price mb-3">
                            <span className="price-num fs-5 text-primary fw-bold m-r10">
                              {data.price_origin.toLocaleString("vi-VN")}₫
                            </span>
                            <del>{data.new_price.toLocaleString("vi-VN")}₫</del>
                          </div>
                          <div className="book-footer">
                            {/* <div className="price">
                              <span className="price-num">
                                ${data.price_origin}
                              </span>
                              <del>${data.new_price}</del>
                            </div> */}
                            <Link
                              to={`/books-detail/?product=${data.id}`}
                              className="btn btn-secondary box-btn btnhover btnhover2"
                            >
                              <i className="flaticon-shopping-cart-1 m-r10"></i>{" "}
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row page mt-0">
                  <div className="col-md-6">
                    {/* <p className="page-text">Showing 12 from 50 data</p> */}
                  </div>
                  <div className="col-md-6">
                    {/* <nav aria-label="Blog Pagination">
                      <ul className="pagination style-1 p-t20">
                        <li className="page-item">
                          <Link to={"#"} className="page-link prev">
                            Prev
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link to={"#"} className="page-link active">
                            1
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link to={"#"} className="page-link">
                            2
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link to={"#"} className="page-link">
                            3
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link to={"#"} className="page-link next">
                            Next
                          </Link>
                        </li>
                      </ul>
                    </nav> */}
                    <div className="pagination-container">
                      <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => paginate(currentPage - 1)}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(totalPages)].map((_, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                currentPage === index + 1 ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => paginate(index + 1)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => paginate(currentPage + 1)}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
export default BooksGridViewSidebar;
