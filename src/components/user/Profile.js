import { Avatar, Button, Form, Input, notification } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { Home } from "../main/Home";
import { useAuth } from "../main/Context";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const Perfil = () => {
  
  const Comp = () => {
    const navigate = useNavigate();
    const {currentUser, token } = useAuth();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, title, msg) => {
      api[type]({
        message: title,
        description: msg,
      });
    };

    const onFinish = async (values) => {
      try {
        setButtonDisabled(true);
        
        await currentUser.updateProfile({
          displayName: values.displayName,
        });
        
        openNotificationWithIcon(
          "success",
          "Información actualizada",
          "Se actualizó con éxito la información de perfil"
          );
          
        setButtonDisabled(false);
        setTimeout(() => {
          navigate("/perfil", { replace: true });
        }, 5000)
      } catch (error) {
        console.error("Error al actualizar la información del usuario:", error);
      }
    };

    return (
      <>
        {contextHolder}
        <Title level={2}>Perfil</Title>
        <div style={{ maxWidth: 400, margin: "auto" }}>
          <Form
            name="profileForm"
            onFinish={onFinish}
            initialValues={{
              displayName: currentUser.displayName
                ? currentUser.displayName
                : "",
              email: currentUser.email
            }}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label="Avatar">
              <Avatar
                src={currentUser.photoURL}
                size={92}
                icon={<UserOutlined />}
              />
              {/* </Tooltip>
                <Button icon={<UploadOutlined />}>Subir Imagen</Button>
              </Upload> */}
            </Form.Item>
            <Form.Item
              label="Nombre"
              name="displayName"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu nombre completo",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { type: "email", message: "Correo electrónico inválido" },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                // loading={loading}
                disabled={buttonDisabled}
              >
                Guardar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    );
  };

  return (
    <>
      <Home comp={<Comp />} />
    </>
  );
};

export default Perfil;
