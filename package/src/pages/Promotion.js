import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../layouts/PageTitle";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

// Hàm để trích xuất URL của ảnh từ description
const extractImageUrl = (htmlString) => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const result = imgRegex.exec(htmlString);
  return result ? result[1] : null;
};

const BlogGrid = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách chương trình khuyến mãi
    const apiUrl = `${process.env.REACT_APP_API_DOMAIN}/promotion/promotions/`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const activePromotions = data.filter(
          (promo) => promo.is_active === true
        );
        setPromotions(activePromotions);
      })
      .catch((error) => console.error("Error fetching promotions:", error));
  }, []);

  return (
    <>
      <div className="page-content">
        <PageTitle parentPage="Promotions" childPage="Promotion Grid" />
        <section className="content-inner-1 bg-img-fix">
          <Container>
            <Row>
              {promotions.length === 0 ? (
                <p className="text-center">
                  Hiện không có chương trình khuyến mãi nào đang diễn ra.
                </p>
              ) : (
                promotions.map((promo, index) => {
                  // Lấy URL hình ảnh từ description
                  const imageUrl = promo.image;

                  return (
                    <Col key={index} xl={6} lg={6} className="mb-4">
                      <Card className="bg-white shadow-sm h-100">
                        {imageUrl && (
                          // <div className="dz-media dz-img-effect zoom">
                          <div>
                            <img
                              src={imageUrl}
                              alt={promo.name}
                              className="w-100"
                              style={{ height: "180px" }}
                            />
                          </div>
                        )}
                        <Card.Body>
                          <Card.Title>
                            <Link to={`/promotion-details/${promo.id}`}>
                              {promo.name}
                            </Link>
                          </Card.Title>
                          <Card.Text
                            dangerouslySetInnerHTML={{
                              __html:
                                promo.description.length > 100
                                  ? `${promo.description.slice(0, 100)}...`
                                  : promo.description,
                            }}
                          ></Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>Giảm giá: {promo.discount_percent}%</span>
                            <Button
                              variant="primary"
                              as={Link}
                              to={`/promotion-details/${promo.id}`}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
              )}
            </Row>

            {/* Pagination (giả lập phân trang nếu cần) */}
            {/* <nav aria-label="Promotion Pagination">
              <ul className="pagination text-center style-1 p-t20">
                <li className="page-item">
                  <Link to="#" className="page-link prev">
                    Prev
                  </Link>
                </li>
                <li className="page-item">
                  <Link to="#" className="page-link active">
                    1
                  </Link>
                </li>
                <li className="page-item">
                  <Link to="#" className="page-link">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link to="#" className="page-link">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <Link to="#" className="page-link next">
                    Next
                  </Link>
                </li>
              </ul>
            </nav> */}
          </Container>
        </section>
      </div>
    </>
  );
};

export default BlogGrid;
