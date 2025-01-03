import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Collapse, Dropdown } from "react-bootstrap";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Components
import ClientsSlider from "../components/Home/ClientsSlider";
import NewsLetter from "../components/NewsLetter";

// Elements
import CounterSection from "../elements/CounterSection";

function Categories() {
  // State quản lý danh mục và subcategories
  const [accordBtn, setAccordBtn] = useState(false);
  const [selectBtn, setSelectBtn] = useState("Sắp xếp theo");
  const [combinedCategories, setCombinedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý sản phẩm
  const [currentProducts, setCurrentProducts] = useState([]); // Sản phẩm của trang hiện tại
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState(null);

  // State quản lý category và subcategory được chọn
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  // State quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12; // Số sản phẩm trên mỗi trang

  useEffect(() => {
    // Hàm để gọi API và lấy categories và subcategories
    const fetchData = async () => {
      try {
        const [categoriesResponse, subcategoriesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_DOMAIN}/book/categories/`),
          axios.get(`${process.env.REACT_APP_API_DOMAIN}/book/subcategories/`),
        ]);

        // Lọc các categories không bị xóas
        const activeCategories = categoriesResponse.data.filter(
          (category) => !category.is_delete
        );

        // Lọc các subcategories không bị xóa
        const activeSubcategories = subcategoriesResponse.data.filter(
          (subcategory) => !subcategory.is_delete
        );

        // Tạo một mapping từ category ID đến các subcategories tương ứng
        const categoriesWithSub = activeCategories.map((category) => ({
          ...category,
          subcategories: activeSubcategories.filter(
            (subcategory) => subcategory.category === category.id
          ),
        }));

        setCombinedCategories(categoriesWithSub);
        setLoading(false);

        // Thiết lập category mặc định có id = 1 nếu tồn tại
        const defaultCategory = activeCategories.find((cat) => cat.id === 1);
        if (defaultCategory) {
          setSelectedCategoryId(defaultCategory.id);
          fetchProductsByCategory(defaultCategory.id, 1); // Trang đầu tiên
        }
      } catch (err) {
        console.error("Error fetching categories or subcategories:", err);
        setError("Không thể tải danh mục hoặc danh mục phụ.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm để fetch sản phẩm theo categoryId
  const fetchProductsByCategory = async (categoryId, page = 1) => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_DOMAIN}/book/products/`,
        {
          params: { category: categoryId, page: page },
        }
      );

      const products = response.data.results || [];
      const apiTotalPages = response.data.total_pages || 1;

      setCurrentProducts(products);
      setTotalPages(apiTotalPages);
      setCurrentPage(page);
      setLoadingProducts(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setErrorProducts("Không thể tải dữ liệu sản phẩm.");
      setLoadingProducts(false);
    }
  };

  // Hàm để fetch sản phẩm theo subcategoryId
  const fetchProductsBySubcategory = async (subcategoryId, page = 1) => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_DOMAIN}/book/products/`,
        {
          params: { subcategory: subcategoryId, page: page },
        }
      );

      const products = response.data.results || [];
      const apiTotalPages = response.data.total_pages || 1;

      setCurrentProducts(products);
      setTotalPages(apiTotalPages);
      setCurrentPage(page);
      setLoadingProducts(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setErrorProducts("Không thể tải dữ liệu sản phẩm.");
      setLoadingProducts(false);
    }
  };

  // Hàm xử lý khi chọn category
  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
    setCurrentPage(1);
    fetchProductsByCategory(categoryId, 1);
  };

  // Hàm xử lý khi chọn subcategory
  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
    setSelectedCategoryId(null);
    setCurrentPage(1);
    fetchProductsBySubcategory(subcategoryId, 1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    setCurrentPage(pageNumber);

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch lại sản phẩm theo category hoặc subcategory đang chọn
    if (selectedCategoryId) {
      fetchProductsByCategory(selectedCategoryId, pageNumber);
    } else if (selectedSubcategoryId) {
      fetchProductsBySubcategory(selectedSubcategoryId, pageNumber);
    }
  };

  // Hàm để tạo mảng các trang hiển thị (tối đa 3 trang)
  const getPagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...");
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
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
    return pages;
  };

  function truncateText(text, maxLength) {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  const sortedProducts = React.useMemo(() => {
    let sorted = [...currentProducts];

    switch (selectBtn) {
      case "Mới nhất":
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "Giá tăng dần":
        sorted.sort((a, b) => a.price_origin - b.price_origin);
        break;
      case "Giá giảm dần":
        sorted.sort((a, b) => b.price_origin - a.price_origin);
        break;
      default:
        break;
    }

    return sorted;
  }, [selectBtn, currentProducts]);

  return (
    <>
      <div className="page-content bg-grey">
        <div className="content-inner-1 border-bottom">
          <div className="container mb-5">
            <div className="row">
              {/* Bên Trái - Sidebar */}
              <div className="col-xl-3">
                {/* Phần Hiển Thị Danh Mục và Danh Mục Phụ */}
                <div className="widget widget_services style-2">
                  <h5 className="widget-title">Danh mục</h5>
                  {loading && (
                    <div>
                      <Skeleton
                        height={30}
                        count={5}
                        style={{ marginBottom: "10px" }}
                      />
                    </div>
                  )}
                  {error && <p className="text-danger">{error}</p>}
                  {!loading && !error && combinedCategories.length === 0 && (
                    <p>Không có danh mục nào.</p>
                  )}
                  {!loading &&
                    !error &&
                    combinedCategories.map((category) => (
                      <div className="category-item mb-3" key={category.id}>
                        {/* Tên Category */}
                        <h6
                          className={`category-name fw-bold ${
                            selectedCategoryId === category.id ? "active" : ""
                          }`}
                        >
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryClick(category.id);
                            }}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              cursor: "pointer",
                              display: "block",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              backgroundColor:
                                selectedCategoryId === category.id
                                  ? "#007bff"
                                  : "transparent",
                              color:
                                selectedCategoryId === category.id
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {category.name}
                          </Link>
                        </h6>
                        {/* Subcategories */}
                        {Array.isArray(category.subcategories) &&
                          category.subcategories.length > 0 && (
                            <div
                              className="subcategory-list mt-2"
                              style={{ paddingLeft: "20px" }}
                            >
                              {category.subcategories.map((subcategory) => (
                                <div
                                  className="subcategory-item mb-1"
                                  key={subcategory.id}
                                >
                                  <Link
                                    to="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleSubcategoryClick(subcategory.id);
                                    }}
                                    className={`subcategory-link ${
                                      selectedSubcategoryId === subcategory.id
                                        ? "active"
                                        : ""
                                    }`}
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                      cursor: "pointer",
                                      display: "block",
                                      padding: "3px 10px",
                                      borderRadius: "4px",
                                      backgroundColor:
                                        selectedSubcategoryId === subcategory.id
                                          ? "#28a745"
                                          : "transparent",
                                      color:
                                        selectedSubcategoryId === subcategory.id
                                          ? "#fff"
                                          : "inherit",
                                    }}
                                  >
                                    {subcategory.name}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Bên Phải - Nội Dung Chính */}
              <div className="col-xl-9">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="title">
                    {selectedCategoryId
                      ? combinedCategories.find(
                          (cat) => cat.id === selectedCategoryId
                        )?.name
                      : selectedSubcategoryId
                      ? combinedCategories
                          .flatMap((cat) => cat.subcategories)
                          .find((sub) => sub.id === selectedSubcategoryId)?.name
                      : "Sách"}
                  </h4>
                  <Link to={"#"} className="btn btn-primary panel-btn">
                    Filter
                  </Link>
                </div>
                <div className="filter-area m-b10">
                  <div className="grid-area"></div>
                  <div className="category">
                    <div className="filter-category"></div>
                    <div className="form-group m-r50">
                      <i className="fas fa-sort-amount-down me-2 text-secondary"></i>
                      <Dropdown>
                        <Dropdown.Toggle className="i-false">
                          {selectBtn}{" "}
                          {/* <i className="ms-4 font-14 fa-solid fa-caret-down" /> */}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="m-r20">
                          <Dropdown.Item
                            onClick={() => setSelectBtn("Mới nhất")}
                          >
                            Mới nhất
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setSelectBtn("Giá tăng dần")}
                          >
                            Giá tăng dần
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setSelectBtn("Giá giảm dần")}
                          >
                            Giá giảm dần
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>

                {/* Phân Trang */}
                <div className="row page mt-0 m-b30">
                  <div className="col-md-6">
                    {/* <p className="page-text">
                      {`Hiển thị ${sortedProducts.length} sản phẩm trong tổng số ${totalPages} trang`}
                    </p> */}
                  </div>
                  <div className="col-md-6">
                    <nav aria-label="Product Pagination">
                      <ul className="pagination pagination-sm style-1 p-t20 justify-content-end">
                        {/* Nút Prev */}
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link prev"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Prev
                          </button>
                        </li>

                        {/* Hiển thị các số trang */}
                        {getPagination().map((page, index) =>
                          page === "..." ? (
                            <li
                              key={`ellipsis-${index}`}
                              className="page-item disabled d-none d-sm-block"
                            >
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
                                onClick={() => handlePageChange(page)}
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
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>

                {/* Collapse cho categories nếu cần */}
                <Collapse in={accordBtn} className="acod-content">
                  <div>
                    <div className="widget widget_services style-2">
                      {loading && <p>Đang tải...</p>}
                      {error && <p className="text-danger">{error}</p>}
                      {!loading &&
                        !error &&
                        combinedCategories.length === 0 && (
                          <p>Không có danh mục nào.</p>
                        )}
                      {!loading &&
                        !error &&
                        combinedCategories.map((category) => (
                          <div className="category-item mb-3" key={category.id}>
                            {/* Tên Category */}
                            <h6
                              className={`category-name fw-bold ${
                                selectedCategoryId === category.id
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCategoryClick(category.id);
                                }}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  cursor: "pointer",
                                  display: "block",
                                  padding: "5px 10px",
                                  borderRadius: "4px",
                                  backgroundColor:
                                    selectedCategoryId === category.id
                                      ? "#007bff"
                                      : "transparent",
                                  color:
                                    selectedCategoryId === category.id
                                      ? "#fff"
                                      : "inherit",
                                }}
                              >
                                {category.name}
                              </Link>
                            </h6>
                            {/* Subcategories */}
                            {Array.isArray(category.subcategories) &&
                              category.subcategories.length > 0 && (
                                <div
                                  className="subcategory-list mt-2"
                                  style={{ paddingLeft: "20px" }}
                                >
                                  {category.subcategories.map((subcategory) => (
                                    <div
                                      className="subcategory-item mb-1"
                                      key={subcategory.id}
                                    >
                                      <Link
                                        to="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleSubcategoryClick(
                                            subcategory.id
                                          );
                                        }}
                                        className={`subcategory-link ${
                                          selectedSubcategoryId ===
                                          subcategory.id
                                            ? "active"
                                            : ""
                                        }`}
                                        style={{
                                          textDecoration: "none",
                                          color: "inherit",
                                          cursor: "pointer",
                                          display: "block",
                                          padding: "3px 10px",
                                          borderRadius: "4px",
                                          backgroundColor:
                                            selectedSubcategoryId ===
                                            subcategory.id
                                              ? "#28a745"
                                              : "transparent",
                                          color:
                                            selectedSubcategoryId ===
                                            subcategory.id
                                              ? "#fff"
                                              : "inherit",
                                        }}
                                      >
                                        {subcategory.name}
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                    </div>
                  </div>
                </Collapse>

                {/* Hiển Thị Sản Phẩm */}
                <div className="row book-grid-row">
                  {loadingProducts && (
                    <div className="row book-grid-row">
                      {Array.from({ length: 12 }).map((_, index) => (
                        <div className="col-book style-2" key={index}>
                          <div className="dz-shop-card style-1">
                            <div className="dz-media">
                              <Skeleton height={200} />
                            </div>
                            <div className="dz-content">
                              <h5 className="title" style={{ height: "56px" }}>
                                <Skeleton />
                              </h5>
                              <ul className="dz-tags flex-column">
                                <li>
                                  <Skeleton width={100} />
                                </li>
                                <li style={{ height: "52px" }}>
                                  <Skeleton width={80} />
                                </li>
                              </ul>
                              <div className="price mb-3">
                                <Skeleton width={60} />
                              </div>
                              <div className="book-footer">
                                <Skeleton width={100} height={36} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errorProducts && (
                    <p className="text-danger">{errorProducts}</p>
                  )}
                  {!loadingProducts &&
                    !errorProducts &&
                    currentProducts.length === 0 && (
                      <p>Không có sản phẩm nào để hiển thị.</p>
                    )}
                  {!loadingProducts &&
                    !errorProducts &&
                    sortedProducts.map((product) => (
                      <div className="col-book style-2" key={product.id}>
                        <div className="dz-shop-card style-1">
                          <div className="dz-media">
                            <img
                              src={product.image}
                              alt={product.name || "Sản phẩm"}
                              style={{ width: "100%", height: "auto" }}
                            />
                          </div>
                          <div className="dz-content">
                            <h5 className="title" style={{ height: "56px" }}>
                              <Link to={`/books-detail/?product=${product.id}`}>
                                {truncateText(product.name, 30)}
                              </Link>
                            </h5>
                            <ul className="dz-tags flex-column">
                              <li>
                                <Link
                                  to={`/books-grid-view?subcategory=${encodeURIComponent(
                                    product.sub_category
                                  )}`}
                                >
                                  {product.sub_category}
                                </Link>
                              </li>
                              <li style={{ height: "52px" }}>
                                <Link
                                  to={`/books-grid-view?author=${encodeURIComponent(
                                    product.author
                                  )}`}
                                >
                                  Tác giả: {product.author}
                                </Link>
                              </li>
                            </ul>
                            <div className="price mb-3">
                              <span className="price-num fs-5 text-primary fw-bold m-r10">
                                {product.new_price.toLocaleString("vi-VN")}₫
                              </span>
                              <del>
                                {product.price_origin.toLocaleString("vi-VN")}₫
                              </del>
                            </div>
                            <div className="book-footer">
                              <Link
                                to={`/books-detail/?product=${product.id}`}
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

                {/* Phân Trang */}
                <div className="row page mt-0">
                  <div className="col-md-6">
                    {/* <p className="page-text">
                      {`Hiển thị ${sortedProducts.length} sản phẩm trong tổng số ${totalPages} trang`}
                    </p> */}
                  </div>
                  <div className="col-md-6">
                    <nav aria-label="Product Pagination">
                      <ul className="pagination pagination-sm style-1 p-t20 justify-content-end">
                        {/* Nút Prev */}
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link prev"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Prev
                          </button>
                        </li>

                        {/* Hiển thị các số trang */}
                        {getPagination().map((page, index) =>
                          page === "..." ? (
                            <li
                              key={`ellipsis-${index}`}
                              className="page-item disabled d-none d-sm-block"
                            >
                              <span className="page-link">...</span>
                            </li>
                          ) : (
                            <li
                              key={page}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page)}
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
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
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

          {/* Clients Slider */}
          <div className="bg-white py-5">
            <div className="container">
              <ClientsSlider />
            </div>
          </div>

          {/* Counter Section */}
          <section className="content-inner">
            <div className="container">
              <div className="row sp15">
                <CounterSection />
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <NewsLetter />
        </div>
      </div>
    </>
  );
}

export default Categories;
