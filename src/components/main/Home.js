import React, { useState, useContext, useEffect } from "react";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { Button, message, Modal } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  LogoutOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { Layout, Menu } from "antd";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./Context";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";

const { Header, Content, Sider } = Layout;

export const Home = ({ comp, showM }) => {
  const { token, currentUser, setCurrentUser, setToken } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => {
    setShowModal(false);
    setShowModal(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      message.success("Sesión cerrada con exito.");
      setCurrentUser(null);
      setToken(null);
      navigate("/", { replace: false });
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const footerModalComponent = () => {
    if (showSignIn) {
      return (
        <Button key="register" type="primary" onClick={handleRegister}>
          Registrarse
        </Button>
      );
    } else if (showSignUp) {
      return (
        <Button key="login" onClick={handleLogin}>
          Iniciar sesión
        </Button>
      );
    } else {
      return (
        <>
          <Button key="login" onClick={handleLogin}>
            Iniciar sesión
          </Button>
          <Button key="register" type="primary" onClick={handleRegister}>
            Registrarse
          </Button>
        </>
      );
    }
  };

  const handleLogin = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const showSignInModal = () => {
    setShowSignIn(true);
    setShowModal(true);
    setShowSignUp(false);
  };

  const handleRegister = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  useEffect(() => {
    const loadData = async () => {
      console.log('currentUser: ', currentUser);
      if (currentUser) {
        setShowModal(false);
        const decodedToken = jwtDecode(await token);
        setRole(decodedToken.role);
        console.log("Token session: ", await auth.currentUser.getIdToken(true));
      } else {
        if(showM) 
          setShowModal(true);
        else 
          setShowModal(false);
      }
    };

    loadData();
  }, [currentUser, token, showM]);

  return (
    <>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "lightgray",
          }}
        >
          <Title level={4} style={{ color: "white" }}>
            Company Name
          </Title>
          {currentUser ? (
            <>
              <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button icon={<LoginOutlined />} onClick={showSignInModal}>
                Iniciar sesión
              </Button>
            </>
          )}
        </Header>
        <Layout>
          <Sider
            width={200}
            style={{
              background: "lightgray",
            }}
          >
            <Menu theme="lark" mode="inline" defaultSelectedKeys={["home"]}>
              {currentUser ? (
                <>
                  <Title level={4} style={{ textAlign: "center" }}>
                    {role}
                  </Title>
                </>
              ) : (
                <></>
              )}
              {role === "Administrador" ? (
                <>
                  <Menu.Item key="Perfil" icon={<UserOutlined />}>
                    <Link to="/perfil">Perfil</Link>
                  </Menu.Item>
                </>
              ) : (
                <></>
                )}
              {role === "Administrador" || role === 'Vendedor' ? (
                  <Menu.Item key="buscar/producto" icon={<SearchOutlined />}>
                    <Link to="/productos/buscar">Productos</Link>
                  </Menu.Item>
              ) : (
                <></>
              )}
              {role === "Vendedor" ? (
                <>
                  <Menu.Item key="agregarProducto" icon={<PlusOutlined />}>
                    <Link to="/productos/agregar">Agregar producto</Link>
                  </Menu.Item>
                </>
              ) : (
                <></>
              )}

              {currentUser === null ? (
                <>
                  <Menu.Item key="comprar" icon={<ShoppingCartOutlined />}>
                    <Link to="/">Productos</Link>
                  </Menu.Item>
                </>
              ) : (
                <></>
              )}
            </Menu>
          </Sider>
          <Layout
            style={{
              padding: "0",
            }}
          >
            <Content className="content">
              {currentUser ? (
                <>{comp !== null ? comp : (<></>)}</>
              ) : (
                <>{comp ? comp : <></>}</>
              )}
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <Modal
        visible={showModal}
        onCancel={closeModal}
        title="Iniciar sesión o Registrarse"
        footer={footerModalComponent}
      >
        {showSignIn ? (
          <>
            <SignInForm closeModal={closeModal} />
          </>
        ) : showSignUp ? (
          <>
            <SignUpForm closeModal={closeModal}></SignUpForm>
          </>
        ) : (
          <>
            <p>
              Registrate o inicia una sesión para empezar a agregar productos a
              tu inventario.
            </p>
          </>
        )}
      </Modal>
    </>
  );
};
