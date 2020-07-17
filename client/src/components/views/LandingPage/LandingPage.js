import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon, Col, Row, Card } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "../LandingPage/sections/CheckBox";
import RadioBox from "../LandingPage/sections/RadioBox";
import { continents, price } from "../LandingPage/sections/Datas";
import Axios from "axios";
import SearchFeature from "./sections/SearchFeature";

const { Meta } = Card;
function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState(0);
  const [SearchTerms, setSearchTerms] = useState("");
  const [Filter, setFilter] = useState({
    continents: [],
    price: [],
  });

  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit,
    };
    getProducts(variables);
  }, []);

  const getProducts = (variables) => {
    Axios.post("/api/product/getProducts", variables)
      .then((response) => {
        if (response.data.success) {
          if (variables.loadMore) {
            setProducts((prev) => {
              return [...prev, ...response.data.products];
            });
          } else {
            setProducts(response.data.products);
          }
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
      skip: skip,
      limit: Limit,
      loadMore: true,
    };
    getProducts(variables);
    setSkip(skip);
  };
  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24}>
        <Card
          hoverable={true}
          cover={
            <Link to={`/product/${product._id}`}>
              <ImageSlider images={product.images} />
            </Link>
          }
        >
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });
  const showFilteredResults = (filters) => {
    const variables = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };
    getProducts(variables);
    setSkip(0);
  };
  const handlePrice = (value) => {
    const data = price;
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };
  const handleFilters = (filters, category) => {
    const newFilters = { ...Filter };
    newFilters[category] = filters;
    if (category === "price") {
      let priceValues = handlePrice(filters);
      newFilters[category] = priceValues;
    }
    showFilteredResults(newFilters);
    setFilter(newFilters);
  };
  const updateSearchTerms = (newSearchTerm) => {
    const variables = {
      skip: 0,
      limit: Limit,
      filters: Filter,
      searchTerm: newSearchTerm,
    };
    setSkip(0);
    setSearchTerms(newSearchTerm);
    getProducts(variables);
  };
  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          {" "}
          Let's Travel Anywhere <Icon type='rocket' />
        </h2>
      </div>

      {/* filter */}
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <CheckBox
            list={continents}
            handleFilters={(filters) => handleFilters(filters, "continents")}
          />
        </Col>
        <Col lg={12} xs={24}>
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/* search */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerms} />
      </div>

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
