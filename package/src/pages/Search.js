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
// import ShopSidebar from "../elements/ShopSidebar";

//Images
// import book16 from "./../assets/images/books/grid/book16.jpg";
// import book8 from "./../assets/images/books/grid/book8.jpg";
// import book14 from "./../assets/images/books/grid/book14.jpg";
// import book15 from "./../assets/images/books/grid/book15.jpg";
// import book4 from "./../assets/images/books/grid/book4.jpg";
// import book9 from "./../assets/images/books/grid/book9.jpg";
// import book2 from "./../assets/images/books/grid/book2.jpg";
// import book7 from "./../assets/images/books/grid/book7.jpg";
// import book13 from "./../assets/images/books/grid/book13.jpg";
// import book10 from "./../assets/images/books/grid/book10.jpg";
// import book11 from "./../assets/images/books/grid/book11.jpg";
// import SearchModel from "../models/SearchModel";

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

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { type, value } = queryParams;

  // Tim kiem
  // const { searchParams } = useOutletContext();
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
        setViewed(data.viewed);
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
