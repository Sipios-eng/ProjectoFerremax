// frontend/src/components/products/ProductList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Necesitamos Link para ir al detalle del producto
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext'; // Importa el hook del carrito
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Obtén la función para añadir al carrito

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

  const handleAddToCart = (productId) => {
    // Aquí puedes añadir lógica para la cantidad si quieres, por ahora es 1
    addToCart(productId, 1);
  };

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
    <div className="product-list-container">
      {products.map(product => (
        <div key={product.id} className="product-card">
          {/* Enlace a la página de detalle del producto */}
          <Link to={`/productos/${product.id}`} className="product-image-link">
            {product.imagen_url && (
              <img src={product.imagen_url} alt={product.nombre} className="product-image" />
            )}
          </Link>
          <div className="product-info"> {/* Agregado un div para info, como en el ProductCard que sugerí */}
            <h3>{product.nombre}</h3>
            <p className="product-price">Precio: ${parseFloat(product.precio).toFixed(2)}</p>
            <p className="product-stock">Stock: {product.cantidad_disponible}</p> {/* Mostrar stock */}

            {/* Botón Añadir al Carrito */}
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(product.id)}
              disabled={product.cantidad_disponible <= 0} // Deshabilita si no hay stock
            >
              {product.cantidad_disponible > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
            </button>

             {/* Opcional: Si quieres un botón específico para "Ver Detalle" además del clic en la imagen */}
            {/* <Link to={`/productos/${product.id}`} className="view-detail-button">Ver Detalle</Link> */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;