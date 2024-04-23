import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Perfil from "../user/Profile";
import AddProduct from "../../components/product/AddProduct";
import ProductStore from "../../components/product/ProductStore";
import SearchProduct from "../../components/product/SearchProduct";
import Component404 from "./Component404";
import { useAuth } from "./Context";
import { Spin } from "antd";

const Navigation = () => {
  const { loading, currentUser } = useAuth();

  if (loading) {
    console.log('varificando autenticación')

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" tip="Cargando..." />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductStore showM={true} />} />
        <Route path="/perfil" element={currentUser ? <Perfil /> : <Navigate to="/" />} />
        <Route path="/productos/buscar" element={currentUser ? <SearchProduct /> : <Navigate to="/" />} />
        <Route path="/productos/agregar" element={currentUser ? <AddProduct /> : <Navigate to="/" /> } />
        <Route path="*" element={<Component404 />} />
      </Routes>
    </Router>
  );
};

export default Navigation;
