import React from 'react';
import { Card, Typography } from 'antd';

const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({ sku, name, price, image }) => {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<img alt={name} src={image} />}
    >
      <Meta title={name} description={<Text strong>{`SKU: ${sku}`}<br/>{`Precio: $${price}`}</Text>} />
    </Card>
  );
};

export default ProductCard;
