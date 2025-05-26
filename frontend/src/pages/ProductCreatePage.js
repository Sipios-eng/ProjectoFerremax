// frontend/src/pages/ProductCreatePage.js

import React from 'react';
import ProductForm from '../components/products/ProductForm'; // Importa el formulario

function ProductCreatePage() {
  const handleProductCreated = (newProduct) => {
    // Aquí puedes añadir lógica después de que un producto se crea exitosamente,
    // por ejemplo, redirigir al usuario a la lista de productos o mostrar un mensaje.
    console.log('Producto creado, ahora puedes actualizar la lista o redirigir.', newProduct);
    // history.push('/productos'); // Si usas useHistory de react-router-dom
  };

  return (
    <div className="product-create-page-container">
      <ProductForm onProductCreated={handleProductCreated} />
    </div>
  );
}

export default ProductCreatePage;