// frontend/src/pages/ProductsPage.js

import React from 'react';
import ProductList from '../components/products/ProductList'; // <-- CAMBIADO: Importa ProductList

function ProductsPage() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '20px 0' }}>Nuestros Productos Ferremax</h1>
      <ProductList /> {/* <-- Usamos ProductList */}
    </div>
  );
}

export default ProductsPage;