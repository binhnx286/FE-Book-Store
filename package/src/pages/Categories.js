import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Collapse, Dropdown } from "react-bootstrap";
import axios from "axios"; // Đảm bảo bạn đã cài đặt axios: npm install axios

// Components
import ClientsSlider from "../components/Home/ClientsSlider";
import NewsLetter from "../components/NewsLetter";

// Elements
import CounterSection from "../elements/CounterSection";

function Categories() {
  // State quản lý danh mục và subcategories
  const [accordBtn, setAccordBtn] = useState(false);
  const [selectBtn, setSelectBtn] = useState("Sắp xếp theo");
  const [combinedCategories, setCombinedCategories] = useState([]); // State cho categories và subcategories
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải categories
  const [error, setError] = useState(null); // State để quản lý lỗi categories

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
  const pageSize = 12; // Số sản phẩm trên mỗi trang (nếu cần)

  useEffect(() => {
    // Hàm để gọi API và lấy categories và subcategories
    const fetchData = async () => {
      try {
        // Sử dụng Promise.all để gọi đồng thời cả hai API
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
  }, []); // Chạy một lần khi component được mount

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

      // Giả sử API trả về sản phẩm trong response.data.results và total_pages trong response.data.total_pages
      const products = response.data.results || [];
      const apiTotalPages = response.data.total_pages || 1;

      // Cập nhật state
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

      // Giả sử API trả về sản phẩm trong response.data.results và total_pages trong response.data.total_pages
      const products = response.data.results || [];
      const apiTotalPages = response.data.total_pages || 1;

      // Cập nhật state
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
    setSelectedSubcategoryId(null); // Reset subcategory khi chọn category mới
    setCurrentPage(1); // Reset về trang đầu khi thay đổi category
    fetchProductsByCategory(categoryId, 1);
  };

  // Hàm xử lý khi chọn subcategory
  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
    setSelectedCategoryId(null); // Reset category khi chọn subcategory mới
    setCurrentPage(1); // Reset về trang đầu khi thay đổi subcategory
    fetchProductsBySubcategory(subcategoryId, 1);
  };

  // Hàm xử lý khi thay đổi trang (bao gồm scroll to top)
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    setCurrentPage(pageNumber);

    // Cuộn lên đầu trang với hiệu ứng mượt mà
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

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage === 1) {
        pages.push(1, 2, 3);
      } else if (currentPage === totalPages) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  };

  // Hàm để cắt ngắn văn bản
  function truncateText(text, maxLength) {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  // Hàm để sắp xếp sản phẩm dựa trên selectBtn (tùy chọn frontend)
  const sortedProducts = React.useMemo(() => {
    let sorted = [...currentProducts];

    switch (selectBtn) {
      case "Mới nhất":
        // Giả sử sản phẩm mới nhất có id lớn nhất
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "Giá tăng dần":
        sorted.sort((a, b) => a.price_origin - b.price_origin);
        break;
      case "Giá giảm dần":
        sorted.sort((a, b) => b.price_origin - a.price_origin);
        break;
      // Thêm các case khác nếu cần
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
                  {loading && <p>Đang tải...</p>}
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
                    <div className="filter-category">
                      {/* Bạn có thể thêm chức năng collapse nếu cần */}
                      {/* <Link
                        to="#"
                        data-bs-toggle="collapse"
                        onClick={() => setAccordBtn(!accordBtn)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fas fa-list me-2"></i>
                        Categories
                      </Link> */}
                    </div>
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
                    <p className="page-text">
                      {`Hiển thị ${sortedProducts.length} sản phẩm trong tổng số ${totalPages} trang`}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <nav aria-label="Product Pagination">
                      <ul className="pagination style-1 p-t20 justify-content-end">
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
                              className="page-item disabled"
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
                  {loadingProducts && <p>Đang tải dữ liệu sản phẩm...</p>}
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
                          {/* <div className="bookmark-btn style-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`flexCheckDefault${product.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`flexCheckDefault${product.id}`}
                            >
                              <i className="flaticon-heart"></i>
                            </label>
                          </div> */}
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
                            <ul className="dz-rating">
                              {/* Hiển thị rating nếu có */}
                              {/* {Array.isArray(product.rating) ? (
                                product.rating.map((rate, index) => (
                                  <li key={index}>
                                    <i className="flaticon-star text-yellow"></i>
                                  </li>
                                ))
                              ) : (
                                // Nếu không có rating, có thể hiển thị 0 sao hoặc thông báo
                                <li>Chưa có đánh giá</li>
                              )} */}
                            </ul>
                            <div className="price mb-3">
                              <span className="price-num fs-5 text-primary fw-bold m-r10">
                                {product.price_origin.toLocaleString("vi-VN")}₫
                              </span>
                              <del>
                                {product.new_price.toLocaleString("vi-VN")}₫
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
                    <p className="page-text">
                      {`Hiển thị ${sortedProducts.length} sản phẩm trong tổng số ${totalPages} trang`}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <nav aria-label="Product Pagination">
                      <ul className="pagination style-1 p-t20 justify-content-end">
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
                              className="page-item disabled"
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
