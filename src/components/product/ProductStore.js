import { Col, Form, Input, Row, Slider } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { Home } from "../main/Home";
import ProductCard from "../product/ProductCard";
import { getAllProducts } from "../../services/productService";
import Paragraph from "antd/es/typography/Paragraph";

const BuscarProductos = ({ showM }) => {
  const Comp = () => {
    const [searchText, setSearchText] = useState("");
    const [datalayer, setDatalayer] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [inputValue, setInputValue] = useState(1000);

    const onChange = (newValue) => {
      setInputValue(newValue);
    };

    useEffect(() => {
      const loadData = async () => {
        try {
          const products = await getAllProducts();
          if (products.success) {
            setDatalayer(products.info);
          }
        } catch (error) {
          console.log("error: ", error.info);
          setDatalayer(error.info);
        }
      };

      loadData();
    }, []);

    useEffect(() => {
      if (datalayer && datalayer.length > 0) {
        const newFilteredData = datalayer.filter(
          (item) =>
            parseInt(item.price, 10) <= parseInt(inputValue, 10) &&
            (item.name.toLowerCase().includes(searchText.toLowerCase()) ||
              item.sku.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredData(newFilteredData);
      }
    }, [inputValue, searchText, datalayer]);

    return (
      <>
        <Title level={3} style={{ textAlign: "center" }}>
          Tienda
        </Title>
        <Row gutter={{xs: 12, sm: 16, md: 24}}>
          <Col>
            <Form.Item label="Buscar" name="search">
              <Input
                placeholder="Buscar..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col offset={{md: 2}} style={{width: '200px'}}>
            <Form.Item label="Precio">
              <Slider
                min={0}
                max={1000}
                onChange={onChange}
                step={50}
                value={inputValue}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{xs: 4, sm: 16, md: 24}} >
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <Col style={{marginBottom: '20px'}}>
                <ProductCard
                  sku={item.sku}
                  name={item.name}
                  price={item.price}
                  image={""}
                />
              </Col>
            ))
          ) : (
            <>
              <Paragraph>Sin productos</Paragraph>
            </>
          )}
        </Row>
      </>
    );
  };

  return (
    <>
      <Home comp={<Comp />} showM={showM} />
    </>
  );
};

export default BuscarProductos;
