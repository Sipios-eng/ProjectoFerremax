// frontend/src/components/products/ProductList.js (PARA USUARIO NORMAL)

import React, { useEffect, useState } from 'react';
// No necesitamos Link ni useNavigate aquí si no hay botones de acción
import productService from '../../services/productService';
import './ProductList.css'; // Usará un CSS más simple

function ProductList() { // Este es el ProductList para el usuario final
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
        console.error('Error al obtener productos:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    <div className="product-list-container"> {/* Reutilizamos la misma clase si los estilos base son similares */}
      {products.map(product => (
        <div key={product.id} className="product-card">
          {product.imagen_url && (
            <img src={product.imagen_url} alt={product.nombre} className="product-image" />
          )}
          <h3>{product.nombre}</h3>
          <p>{product.descripcion}</p>
          <p className="product-price">Precio: ${product.precio}</p>
          {/* AQUÍ NO HAY BOTONES DE EDITAR/ELIMINAR */}
          {/* Puedes añadir un botón "Ver Detalle" o "Añadir al Carrito" aquí */}
        </div>
      ))}
    </div>
  );
}

export default ProductList;