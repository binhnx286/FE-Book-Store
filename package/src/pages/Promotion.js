import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetch("/promotion/promotions/")
      .then((response) => response.json())
      .then((data) => {
        // Lọc danh sách để chỉ lấy những chương trình có is_active_promotion là true
        const activePromotions = data.filter(
          (promo) => promo.is_active_promotion === true
        );
        setPromotions(activePromotions);
      })
      .catch((error) => console.error("Error fetching promotions:", error));
  }, []);

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Chương trình khuyến mãi đang diễn ra</h1>
      {promotions.length === 0 ? (
        <p className="text-center">
          Hiện không có chương trình khuyến mãi nào đang diễn ra.
        </p>
      ) : (
        promotions.map((promo) => (
          <Card key={promo.id} className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>{promo.name}</Card.Title>
              <Card.Text
                dangerouslySetInnerHTML={{ __html: promo.description }}
              />
              <Row className="mt-3">
                <Col>Giảm giá: {promo.discount_percent}%</Col>
                <Col>
                  Ngày bắt đầu:{" "}
                  {new Date(promo.start_date).toLocaleDateString()}
                </Col>
                <Col>
                  Ngày kết thúc: {new Date(promo.end_date).toLocaleDateString()}
                </Col>
              </Row>

              {promo.products.length > 0 && (
                <div className="mt-4">
                  <h5>Sản phẩm trong chương trình:</h5>
                  <Row>
                    {promo.products.map((product) => (
                      <Col key={product.id} md={4} className="mb-3">
                        <Card>
                          <Card.Img
                            variant="top"
                            src={product.image}
                            alt={product.name}
                          />
                          <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            {/* <Card.Text>
                              <small>{product.description}</small>
                            </Card.Text> */}
                            <Card.Text>
                              Giá gốc: {product.price_origin} VND
                            </Card.Text>
                            <Card.Text>
                              Giá mới: {product.new_price} VND
                            </Card.Text>
                            <Card.Text>Tác giả: {product.author}</Card.Text>
                            <Card.Text>
                              Nhà xuất bản: {product.publisher}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default PromotionsPage;
