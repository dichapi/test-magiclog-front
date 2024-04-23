import { Button, Col, Form, Input, notification, Row, Select } from "antd";
import Title from "antd/es/typography/Title";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { saveProduct } from "../../services/productService";
import { useAuth } from "../main/Context";
import { Home } from "../main/Home";

const AgregarProducto = () => {
  const Comp = () => {
    const { Option } = Select;
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const [form] = Form.useForm();
    const [role, setRole] = useState(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, title, msg) => {
      api[type]({
        message: title,
        description: msg,
      });
    };

    const onFinish = async (values) => {
      setLoading(true);
      try {
        const tokenValid = await auth.currentUser.getIdToken(true);

        values['uid'] = auth.currentUser.uid;

        const response = await saveProduct(tokenValid, values);
        if (response.success) {
          openNotificationWithIcon(
            "success",
            "Producto agregado",
            `El producto ${values.name} se guardo exitosamente.`
          );
          form.resetFields();
        } else {
          openNotificationWithIcon(
            "warning",
            "Producto no guardado",
            response.error.msg ? response.error.msg : response.error
          );
        }
      } catch (error) {
        openNotificationWithIcon(
          "error",
          "Producto no guardado",
          `El producto ${values.name} no se guardo exitosamente.`
        );
        console.error("Error: ", error);
      }
      setLoading(false);
    };

    useEffect(() => {
      const loadData = async () => {
        const decodedToken = jwtDecode(await token);
        setRole(decodedToken.role);
      };
      loadData();
    }, [token]);

    return (
      <>
        {contextHolder}
        <Title level={3} style={{ textAlign: "center" }}>
          Agregar un Producto
        </Title>
        <Form
          form={form}
          name="newProductForm"
          onFinish={onFinish}
          layout="vertical"
          // labelCol={{
          //   span: 8,
          // }}
          // wrapperCol={{
          //   span: 10,
          // }}
          initialValues={{
            price: "0.0",
          }}
          style={{ width: '100%', textAlign: 'center' }}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el nombre del producto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Código"
            name="code"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el código del producto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Cantidad" name="count">
            <Input type="number" step="1" min={1} />
          </Form.Item>
          <Form.Item label="Precio Menudeo" name="price">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar Producto
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  };

  return (
    <>
      <Home comp={<Comp />} />
    </>
  );
};

export default AgregarProducto;
