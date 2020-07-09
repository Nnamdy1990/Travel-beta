import React, { useState, useEffect } from "react";
import { Icon, Col, Row, Card } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import Axios from "axios";

const { Meta } = Card;
function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState(8);

  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit,
    };
    getProducts(variables);
  }, []);
  console.log(Products, "hghfgfh");
  const getProducts = (variables) => {
    Axios.post("/api/product/getProducts", variables)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.products, "===prodyiccffff");
          setProducts((prev) => {
            return [...prev, ...response.data.products];
          });
          setPostSize(response.data.postSize);
        } else {
          console.log("failed to fetch product data");
        }
      })
      .catch((err) => {
        console.error(err.response);
      });
  };
  const onLoadMore = () => {
    let skip = Skip + Limit;
    const variables = {
      skip: Skip,
      limit: Limit,
    };
    getProducts(variables);
  };
  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24}>
        <Card hoverable={true} cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });
  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          {" "}
          Let's Travel Anywhere <Icon type='rocket' />
        </h2>
      </div>

      {/* filter */}
      {/* search */}

      {Products.length === 0 ? (
        <div
          style={{
            display: "flex",
            height: "300px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>No post yet....</h2>
        </div>
      ) : (
        <div>
          <Row gutter={[16, 16]}>{renderCards}</Row>
        </div>
      )}
      <br />
      <br />
      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={onLoadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
