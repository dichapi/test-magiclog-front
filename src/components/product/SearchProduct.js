import {
  Form,
  Input,
  Space,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { auth } from "../../firebase";
import { Home } from "../main/Home";
import {
  getProducts,
  getProductsBySeller,
} from "../../services/productService";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../main/Context";

const BuscarProductos = () => {
  const Comp = () => {
    const [searchText, setSearchText] = useState("");
    const [pending, setPending] = React.useState(true);
    const [datalayer, setDatalayer] = React.useState([]);
    const [role, setRole] = useState(null);
    const [columns, setColumns] = useState([]);
    const { token } = useAuth();

    const filteredData = datalayer.filter(
      (item) =>
        String(item.name).toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.code).toLowerCase().includes(searchText.toLowerCase()) ||
        item.user.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.price).includes(searchText)
    );

    useEffect(() => {

      const getProductsInfo = async () => {
        const tokenValid = await auth.currentUser.getIdToken(true);
        if (role === "Administrador") {
          const products = await getProducts(tokenValid);
          setDatalayer(products.info);
        } else if (role === "Vendedor") {
          const products = await getProductsBySeller(
            tokenValid,
            auth.currentUser.uid
          );
          setDatalayer(products.info);
        }
      };

      const loadData = async () => {
        const decodedToken = jwtDecode(await token);
        setRole(decodedToken.role);
        if (role === "Administrador") {
          setColumns([
            {
              name: "Nombre",
              selector: (row) => row.name,
              sortable: true,
            },
            {
              name: "Codigo",
              selector: (row) => row.code,
              sortable: true,
            },
            {
              name: "Precio",
              selector: (row) => row.price,
              sortable: true,
            },
            {
              name: "Vendedor",
              selector: (row) => row.user,
              sortable: true,
            },
          ]);
        } else {
          setColumns([
            {
              name: "Nombre",
              selector: (row) => row.name,
              sortable: true,
            },
            {
              name: "Codigo",
              selector: (row) => row.code,
              sortable: true,
            },
            {
              name: "Precio",
              selector: (row) => row.price,
              sortable: true,
            },
          ]);
        }
        
        await getProductsInfo();
        setPending(false);
      };
      loadData();
    }, [role,token]);

    return (
      <>
        <Title level={3} style={{ textAlign: "center" }}>
          Información de Productos
        </Title>
        <Space direction="horizontal">
          {role === "Administrador" ? (
            <>
              <Form.Item
                label="Buscar"
                name="search"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa un valor.",
                  },
                ]}
              >
                <Input
                  placeholder="Buscar..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  size="large"
                />
              </Form.Item>
            </>
          ) : (
            <></>
          )}
        </Space>
        <DataTable
          className="ttbl"
          noDataComponent={"No se encontro información"}
          columns={columns}
          data={filteredData}
          progressPending={pending}
          progressComponent={<Title level={4}>Cargando datos...</Title>}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          paginationComponentOptions={{
            rowsPerPageText: "Filas por página:",
            rangeSeparatorText: "de",
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: "Todos",
          }}
          striped
          highlightOnHover
          responsive
          scrollY={400}
          defaultSortField="name"
          defaultSortAsc
        />
      </>
    );
  };

  return (
    <>
      <Home comp={<Comp />} />
    </>
  );
};

export default BuscarProductos;
