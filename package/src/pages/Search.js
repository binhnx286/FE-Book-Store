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

  const [collapsedSections, setCollapsedSections] = useState({
    subCategories: false,
    publishers: true,
    authors: true,
    publicationYears: true,
  });

  const toggleSection = (section) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // Tim kiem
  // const { searchParams } = useOutletContext();
  const [cardBookDetails, setBooks] = useState(cardDetials); // data test mac dinh

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true); // Bắt đầu tải dữ liệu

      // let url = `${Environment.getSearchEndpoint()}/?${type}=${value}`;
      let url = `${process.env.REACT_APP_API_LOCAL}/book/advanced-search/?q=${value}&search_field=${type}`;
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

  const renderPagination = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      // Nếu tổng số trang ít hơn hoặc bằng 5, hiển thị tất cả các trang
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Nếu tổng số trang lớn hơn 5, chỉ hiển thị một số trang
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage > totalPages - 3) {
        pageNumbers.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return (
      <ul className="pagination pagination-sm style-1 p-t20 justify-content-end">
        {/* Nút Prev */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link prev"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
        </li>

        {/* Hiển thị các số trang */}
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <li key={`ellipsis-${index}`} className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          ) : (
            <li
              key={page}
              className={`page-item z-0 ${
                currentPage === page ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(page)}
                style={
                  currentPage === page
                    ? {
                        backgroundColor: "#007bff",
                        color: "#fff",
                        borderColor: "#007bff",
                      }
                    : {}
                }
              >
                {page}
              </button>
            </li>
          )
        )}

        {/* Nút Next */}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link next"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    );
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
              <div className="col-xl-3 col-md-12 col-sm-12">
                {/* Sidebar */}
                <div className="bg-white border rounded-1 p-3">
                  {/* Thể loại */}
                  <h3
                    className="fs-5 border-bottom pb-2 d-flex justify-content-between align-items-center"
                    onClick={() => toggleSection("subCategories")}
                    style={{ cursor: "pointer" }}
                  >
                    Thể loại
                    <i
                      className={`fas ${
                        collapsedSections.subCategories
                          ? "fa-chevron-down"
                          : "fa-chevron-up"
                      }`}
                    ></i>
                  </h3>
                  {!collapsedSections.subCategories && (
                    <ul className="list-unstyled mb-4">
                      {subCategories.map((category, index) => (
                        <li
                          key={index}
                          onClick={() => handleCategoryClick(category)}
                          className={`py-2 px-3 ${
                            selectedCategories.includes(category)
                              ? "fw-bold text-primary"
                              : "text-dark"
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          {selectedCategories.includes(category) && (
                            <i className="fas fa-check-circle me-2"></i>
                          )}
                          {category}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Nhà xuất bản */}
                  <h3
                    className="fs-5 border-bottom pb-2 d-flex justify-content-between align-items-center"
                    onClick={() => toggleSection("publishers")}
                    style={{ cursor: "pointer" }}
                  >
                    Nhà xuất bản
                    <i
                      className={`fas ${
                        collapsedSections.publishers
                          ? "fa-chevron-down"
                          : "fa-chevron-up"
                      }`}
                    ></i>
                  </h3>
                  {!collapsedSections.publishers && (
                    <ul className="list-unstyled mb-4">
                      {publishers.map((publisher, index) => (
                        <li
                          key={index}
                          onClick={() => handlePublisherClick(publisher)}
                          className={`py-2 px-3 ${
                            selectedPublishers.includes(publisher)
                              ? "fw-bold text-primary"
                              : "text-dark"
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          {selectedPublishers.includes(publisher) && (
                            <i className="fas fa-check-circle me-2"></i>
                          )}
                          {publisher}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tác giả */}
                  <h3
                    className="fs-5 border-bottom pb-2 d-flex justify-content-between align-items-center"
                    onClick={() => toggleSection("authors")}
                    style={{ cursor: "pointer" }}
                  >
                    Tác giả
                    <i
                      className={`fas ${
                        collapsedSections.authors
                          ? "fa-chevron-down"
                          : "fa-chevron-up"
                      }`}
                    ></i>
                  </h3>
                  {!collapsedSections.authors && (
                    <ul className="list-unstyled mb-4">
                      {authors.map((author, index) => (
                        <li
                          key={index}
                          onClick={() => handleAuthorClick(author)}
                          className={`py-2 px-3 ${
                            selectedAuthors.includes(author)
                              ? "fw-bold text-primary"
                              : "text-dark"
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          {selectedAuthors.includes(author) && (
                            <i className="fas fa-check-circle me-2"></i>
                          )}
                          {author}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Năm xuất bản */}
                  <h3
                    className="fs-5 border-bottom pb-2 d-flex justify-content-between align-items-center"
                    onClick={() => toggleSection("publicationYears")}
                    style={{ cursor: "pointer" }}
                  >
                    Năm xuất bản
                    <i
                      className={`fas ${
                        collapsedSections.publicationYears
                          ? "fa-chevron-down"
                          : "fa-chevron-up"
                      }`}
                    ></i>
                  </h3>
                  {!collapsedSections.publicationYears && (
                    <ul className="list-unstyled">
                      {publicationYears.map((year, index) => (
                        <li
                          key={index}
                          onClick={() => handleYearClick(year)}
                          className={`py-2 px-3 ${
                            selectedYears.includes(year)
                              ? "fw-bold text-primary"
                              : "text-dark"
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          {selectedYears.includes(year) && (
                            <i className="fas fa-check-circle me-2"></i>
                          )}
                          {year}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="col-xl-9">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="name">Kết quả tìm kiếm</h4>
                </div>
                <div className="filter-area m-b30 d-flex">
                  <div className="grid-area"></div>
                  <div className="category">
                    <Dropdown className="sort-dropdown z-3">
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
                    <nav aria-label="Product Pagination">
                      {renderPagination()}
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
                  {isLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, i) => (
                      <BookCardSkeleton key={i} />
                    ))
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((data, i) => (
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
                    ))
                  ) : (
                    <div className="text-center w-100 my-5">
                      <img
                        src="https://via.placeholder.com/150"
                        alt="No products"
                        style={{ maxWidth: "150px", marginBottom: "20px" }}
                      />
                      <h3 className="text-muted">
                        Rất tiếc, không tìm thấy sản phẩm nào phù hợp.
                      </h3>
                      <p className="text-muted">
                        Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa
                        khác.
                      </p>
                      <Link to="/" className="btn btn-primary mt-3">
                        Quay lại trang chủ
                      </Link>
                    </div>
                  )}
                </div>
                <div className="row page mt-0">
                  <div className="col-md-6">
                    {/* <p className="page-text">Showing 12 from 50 data</p> */}
                  </div>
                  <div className="col-md-6">
                    <div className="pagination-container">
                      <nav aria-label="Page navigation">
                        {renderPagination()}
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
