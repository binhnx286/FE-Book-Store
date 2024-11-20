import React, { useState, useEffect } from "react";
import { Environment } from "../Environment";
import { useOutletContext, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import queryString from "query-string";

import { Link } from "react-router-dom";
import { Collapse, Dropdown } from "react-bootstrap";

//Component
import ClientsSlider from "../components/Home/ClientsSlider";
import NewsLetter from "../components/NewsLetter";

import CounterSection from "../elements/CounterSection";

const lableBlogData = [];

// mock data
const cardDetials = [];

function Search() {
  const [accordBtn, setAccordBtn] = useState();
  // const [selectBtn, setSelectBtn] = useState("Newest");
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
  const [viewed, setViewed] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { type, value } = queryParams;

  // Tim kiem
  // const { searchParams } = useOutletContext();
  const [cardBookDetails, setBooks] = useState(cardDetials); // data test mac dinh

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true); // Bắt đầu tải dữ liệu

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
        setViewed(data.viewed);
      } else {
        setBooks([]);
      }

      setIsLoading(false); // Kết thúc tải dữ liệu
    };

    if (queryParams) {
      fetchBooks();
    }
  }, [location.search]);

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

  const BookCardSkeleton = () => (
    <div className="col-book style-2">
      <div className="dz-shop-card style-1" style={{ minHeight: "573px" }}>
        <div className="dz-media">
          <Skeleton height={200} />
        </div>
        <div className="dz-content">
          <h5 className="name" style={{ height: "56px" }}>
            <Skeleton width={`80%`} />
          </h5>
          <ul>
            <li>
              <Skeleton width={`60%`} />
            </li>
            <li style={{ height: "52px" }}>
              <Skeleton width={`40%`} />
            </li>
          </ul>
          <ul className="dz-rating">
            <Skeleton width={80} />
          </ul>
          <div className="price mb-3">
            <span className="price-num fs-5 text-primary fw-bold m-r10">
              <Skeleton width={50} />
            </span>
            <del>
              <Skeleton width={50} />
            </del>
          </div>
          <div className="book-footer">
            <Skeleton height={36} width={150} />
          </div>
        </div>
      </div>
    </div>
  );

  const SidebarSkeleton = () => (
    <div className="sidebar my-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
          <Skeleton height={30} width={100} style={{ marginBottom: 10 }} />
          <ul>
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} style={{ marginBottom: 5 }}>
                <Skeleton width={`80%`} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="page-content bg-grey">
        <div className="content-inner-1 border-bottom">
          <div className="container">
            <div className="row ">
              <div className="col-xl-3 bg-white border rounded-1">
                {/* <ShopSidebar /> */}
                {isLoading ? (
                  <SidebarSkeleton />
                ) : (
                  <div className="sidebar my-3">
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
                )}
              </div>

              <div className="col-xl-9">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="name">Kết quả tìm kiếm</h4>
                  <Link to={"#"} className="btn btn-primary panel-btn">
                    Filter
                  </Link>
                </div>
                <div className="filter-area m-b30">
                  <div className="grid-area"></div>
                  <div className="category">
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

                {/* Pagination */}
                <div className="col-md-6 offset-6 m-b30">
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
                  {isLoading
                    ? Array.from({ length: itemsPerPage }).map((_, i) => (
                        <BookCardSkeleton key={i} />
                      ))
                    : currentProducts.map((data, i) => (
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
                            {/* <div className="bookmark-btn style-2">
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
                        </div> */}
                            <div className="dz-content">
                              <h5
                                className="name"
                                style={{
                                  height: "56px",
                                }}
                              >
                                <Link to={`/books-detail/?product=${data.id}`}>
                                  {truncateText(data.name, 30)}
                                </Link>
                              </h5>
                              <ul>
                                <li>{data.sub_category}</li>
                                <li style={{ height: "52px" }}>
                                  Tác giả: {data.author}
                                </li>
                                {/* <li style={{ height: "52px" }}>{data.publisher}</li> */}
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
                                <del>
                                  {data.new_price.toLocaleString("vi-VN")}₫
                                </del>
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
export default Search;
