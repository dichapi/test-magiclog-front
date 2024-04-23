import React, { useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import "../../App.css";
import { LoginOutlined } from "@ant-design/icons";
import { auth } from "../../firebase";
import { useAuth } from "./Context";

const { Title } = Typography;

const SignInForm = ({ closeModal }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setToken, setCurrentUser } = useAuth();
  const [buttonDisabled, setButtonDisabled] = useState(false);


  const onFinishSignIn = async () => {
    setLoading(true);
    setButtonDisabled(true);
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      setToken(token);
      setCurrentUser(user);
      closeModal();
    } catch (error) {
      setLoading(false); // Ocultar loader después de iniciar sesión (ya sea éxito o fallo)
      setButtonDisabled(false);
      console.error("Error al iniciar sesión:", error.message);
      setErrorMessage("Credenciales incorrectas."); // Actualiza el mensaje de error
    }
  };
  return (
      <div className="tbody">
            <div className="login-content">
              <Title className="txt-center mb-5" level={2}>
                Iniciar sesión
              </Title>
              <br></br>
              <Form
                name="login-form"
                onFinish={onFinishSignIn}
              >
                <Form.Item
                  label="Usuario"
                  name="email"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingresa tu usuario.",
                    },
                  ]}
                >
                  <Input
                    maxLength={25}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Contraseña"
                  name="password"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
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
                    Ingresar
                  </Button>
                </Form.Item>
              </Form>
            </div>
            {errorMessage && (
              <Alert
                message={errorMessage}
                type="error"
                showIcon
                className="custom-alert"
              />
            )}
      </div>
  );
};

export default SignInForm;
