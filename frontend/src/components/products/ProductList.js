// frontend/src/components/products/ProductList.js

import React, { useEffect, useState } from 'react';
import productService from '../../services/productService'; // Asegúrate de la ruta correcta
import './ProductList.css'; // Si renombraste ItemList.css a ProductList.css

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.');
        // Muestra el error completo en la consola para depuración
        console.error('Error al obtener productos:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // El array vacío [] asegura que el efecto se ejecute solo una vez al montar el componente

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando productos...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (products.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>No hay productos disponibles para mostrar.</div>;
  }

  return (
    <div className="product-list-container"> {/* Renombrado de item-list-container */}
      {products.map(product => (
        <div key={product.id} className="product-card"> {/* Renombrado de item-card */}
          {product.imagen_url && (
            <img src={product.imagen_url} alt={product.nombre} className="product-image" />
          )}
          <h3>{product.nombre}</h3> {/* Usamos 'nombre' según tu modelo Django */}
          <p>{product.descripcion}</p> {/* Usamos 'descripcion' */}
          <p className="product-price">Precio: ${product.precio}</p> {/* Usamos 'precio' */}
          {/* Puedes añadir más detalles como marca, tipo_producto, cantidad_disponible, etc. */}
        </div>
      ))}
    </div>
  );
}

export default ProductList;