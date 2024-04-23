import React, { useState } from "react";
import { Form, Input, Button, Typography, Select, message } from "antd";
import "../../App.css";
import { LoginOutlined } from "@ant-design/icons";
import { signUp } from "../../services/signUpService";
import { auth } from "../../firebase";
import { useAuth } from "./Context";

const { Title } = Typography;
const { Option } = Select;

const SignInForm = ({ closeModal }) => {
  const [loading, setLoading] = useState(false);
  const { setToken, setCurrentUser } = useAuth();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const onFinishSignUp = async (values) => {
    setLoading(true);
    setButtonDisabled(true);
    try {
      if (values.password !== values.confirmPassword) {
        message.warning('Las contraseña no coinciden.');
        setLoading(false);
        setButtonDisabled(false);
        return;
      }
      
      const response = await signUp(values);
      if (response.success) {
        message.success('Cuenta creada exitosamente');
        const userCredential = await auth.signInWithEmailAndPassword(
          values.email,
          values.password
        );
        const user = userCredential.user;
        const token = await user.getIdToken();
        setToken(token);
        setCurrentUser(user);
        closeModal()
      } else {
        message.warning('La cuenta ya existe.')
      }
      setLoading(false);
      setButtonDisabled(false);
    } catch (error) {
      setLoading(false);
      setButtonDisabled(false);
      console.error("Error al registrarse:", error.message);
      // setErrorMessage("Lo sentimos no se pudo crear el usuario, intente más tarde.");
    }
  };
  return (
    <div className="tbody">
      <div className="login-content">
        <Title className="txt-center" level={3}>
          Registrarse
        </Title>
        <br></br>
        <Form name="login-form" onFinish={onFinishSignUp}>
          <Form.Item
            name="name"
            wrapperCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu nombre.",
              },
            ]}
          >
            <Input maxLength={25} placeholder="Nombre" />
          </Form.Item>
          <Form.Item
            name="email"
            wrapperCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu usuario.",
              },
            ]}
          >
            <Input maxLength={25} placeholder="Usuario" />
          </Form.Item>

          <Form.Item
            name="password"
            wrapperCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu contraseña.",
              },
            ]}
          >
            <Input.Password
              maxLength={20}
              placeholder="Contraseña"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            wrapperCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Por favor confirma tu contraseña.",
              },
            ]}
          >
            <Input.Password
              maxLength={20}
              placeholder="Confirmar contraseña"
            />
          </Form.Item>
          <Form.Item
            name="rol"
            rules={[
              {
                required: true,
                message: "Debe seleccionar un rol"
              }
            ]}
          >
            <Select
              defaultValue={"0"}
            >
              <Option value="0" disabled>Selecciona un rol</Option>
              <Option value="Administrador">Administrador</Option>
              <Option value="Vendedor">Vendedor</Option>
              <Option value="Cliente">Cliente</Option>
            </Select>
          </Form.Item>

          <Form.Item className="txt-center mt-5">
            <Button
              type="primary"
              htmlType="submit  "
              icon={<LoginOutlined />}
              loading={loading}
              disabled={buttonDisabled}
              size="large"
            >
              Registrarme
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInForm;
