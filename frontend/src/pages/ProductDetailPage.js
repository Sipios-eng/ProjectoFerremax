import React from 'react';
import { useParams } from 'react-router-dom';

function ProductDetailPage() {
  const { id } = useParams(); // Para obtener el ID del producto de la URL
  return (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <h1>Detalle del Producto #{id}</h1>
      <p>Aquí se mostrará la información específica de un producto.</p>
      {/* Eventualmente, aquí harás una llamada a la API para obtener los datos del producto con 'id' */}
    </div>
  );
}

export default ProductDetailPage;