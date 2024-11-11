import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

const PromotionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_API_DOMAIN}/promotion/promotions/${id}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setPromotion(data))
      .catch((error) =>
        console.error("Error fetching promotion details:", error)
      );
  }, [id]);

  if (!promotion) {
    return <p>Loading...</p>;
  }

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = promotion.products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleViewDetail = (productId) => {
    navigate(`/books-detail/?product=${productId}`);
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      {/* Banner Image */}
      {promotion.image && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={promotion.image}
            alt={promotion.name}
            style={{
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
              width: "100%",
            }}
          />
        </div>
      )}

      {/* Promotion Info */}
      <Card
        style={{
          padding: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          {promotion.name}
        </h1>
        <Badge
          style={{
            fontSize: "1rem",
            marginBottom: "10px",
            padding: "4px 16px",
          }}
        >
          Giảm giá: {promotion.discount_percent}%
        </Badge>
        <div dangerouslySetInnerHTML={{ __html: promotion.description }}></div>
        <p>
          <strong>Thời gian khuyến mãi:</strong>{" "}
          {new Date(promotion.start_date).toLocaleDateString()} -{" "}
          {new Date(promotion.end_date).toLocaleDateString()}
        </p>
      </Card>

      {/* Product List with Pagination */}
      <h3 style={{ marginBottom: "20px" }}>Sản phẩm trong chương trình</h3>
      <Row xs={1} sm={2} md={3} className="g-3">
        {currentProducts.map((product) => (
          <Col key={product.id}>
            <Card
              style={{
                height: "100%",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.name}
                style={{
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  maxHeight: "180px",
                  objectFit: "cover",
                }}
              />
              <Card.Body>
                <Card.Title
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.name}
                </Card.Title>
                <p style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                  <strong>Tác giả:</strong> {product.author}
                  <br />
                  <strong>Nhà xuất bản:</strong> {product.publisher}
                  <br />
                  <strong>Kích thước:</strong> {product.dimensions}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        textDecoration: "line-through",
                        color: "#6c757d",
                      }}
                    >
                      {product.price_origin.toLocaleString()} VND
                    </div>
                    <div style={{ color: "#dc3545", fontWeight: "bold" }}>
                      {product.new_price.toLocaleString()} VND
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleViewDetail(product.id)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination Controls */}
      {/* <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{ marginRight: "10px" }}
        >
          Trước
        </Button>
        <span style={{ alignSelf: "center" }}>Trang {currentPage}</span>
        <Button
          variant="secondary"
          disabled={indexOfLastProduct >= promotion.products.length}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{ marginLeft: "10px" }}
        >
          Tiếp
        </Button>
      </div> */}
    </Container>
  );
};

export default PromotionDetail;
