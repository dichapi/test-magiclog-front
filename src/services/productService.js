
export const saveProduct = (token, values) => {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...values, price: values.price > 0 ? parseFloat(values.price) : 0, count: values.count > 0 ? parseFloat(values.count) : 0 })
          };
          
          fetch("http://localhost:5000/test-magiclog/us-central1/admin/add-product", requestOptions).then(res => res.json()).then(data => {
            resolve(data);
          }).catch(err => {
            console.error("Error al guardar el producto: ", err);
            reject(false);
          });
    })
}

export const getProducts = (token) => {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          };
          
          fetch("http://localhost:5000/test-magiclog/us-central1/admin/get-products", requestOptions).then(res => res.json()).then(data => {
            resolve(data);
          }).catch(err => {
            console.error("Error al obtener productos: ", err);
            reject(false);
          });
    })
}

export const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          };
          
          fetch("http://localhost:5000/test-magiclog/us-central1/admin/get-all-products", requestOptions).then(res => res.json()).then(data => {
            resolve(data);
          }).catch(err => {
            console.error("Error al obtener productos: ", err);
            reject([]);
          });
    })
}

export const getProductsBySeller = (token, uid) => {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ uid: uid })
          };
          
          fetch("http://localhost:5000/test-magiclog/us-central1/admin/get-products-by-seller", requestOptions).then(res => res.json()).then(data => {
            resolve(data);
          }).catch(err => {
            console.error("Error al obtener productos del vendedor: ", err);
            reject(false);
          });
    })
}
