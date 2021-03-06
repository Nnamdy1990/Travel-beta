import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import FileUpload from "../../utils/FileUpload";
import Axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const Continents = [
  { key: 1, value: "Africa" },
  { key: 2, value: "Europe" },
  { key: 3, value: "Asia" },
  { key: 4, value: "North America" },
  { key: 5, value: "South America" },
  { key: 6, value: "Australia" },
  { key: 7, value: "Antarctica" },
];

function UploadPage(props) {
  console.log(props, "ghghghghghghg");
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [continentValue, setContinentValue] = useState(1);
  const [images, setImages] = useState([]);

  const onTitleChange = (e) => {
    setTitleValue(e.currentTarget.value);
  };
  const onDescriptionChange = (e) => {
    setDescriptionValue(e.currentTarget.value);
  };
  const onPriceChange = (e) => {
    setPriceValue(e.currentTarget.value);
  };
  const onContinentSelect = (e) => {
    setContinentValue(e.currentTarget.value);
  };
  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      !titleValue ||
      !descriptionValue ||
      !priceValue ||
      !continentValue ||
      !images
    ) {
      return alert("fill all the fields first");
    }

    const variables = {
      writer: props.user.userData._id,
      title: titleValue,
      description: descriptionValue,
      price: priceValue,
      images: images,
      continents: continentValue,
    };
    Axios.post("/api/product/uploadProduct", variables)
      .then((response) => {
        if (response.data.success) {
          console.log("Product successfully uplaoded");
          props.history.push("/");
        } else {
          console.log("Failed to upload product");
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}> Upload Travel Product</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <FileUpload refreshFunction={updateImages} />

        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={titleValue} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={descriptionValue} />
        <br />
        <br />
        <label>Price($)</label>
        <Input onChange={onPriceChange} value={priceValue} type='number' />
        <select onChange={onContinentSelect}>
          {Continents.map((items) => (
            <option key={items.key} value={items.key}>
              {items.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button onClick={onSubmit}>Submit</Button>
      </Form>
    </div>
  );
}

export default UploadPage;
