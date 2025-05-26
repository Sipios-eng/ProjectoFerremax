// frontend/src/pages/ProductsPage.js (PÁGINA PARA EL USUARIO FINAL)

import React from 'react';
import ProductList from '../components/products/ProductList'; // <-- Importa el NUEVO ProductList

function ProductsPage() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '20px 0' }}>Nuestros Productos Ferremax</h1>
      <ProductList /> {/* <-- Renderiza el NUEVO ProductList */}
    </div>
  );
}

export default ProductsPage;