// frontend/src/components/products/ProductList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import productService from '../../services/productService';
import './AdminProductList.css'; // Si tienes estilos específicos

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar los productos (la reutilizaremos)
  const fetchProducts = async () => {
    try {
      setLoading(true); // Reiniciar loading para cada fetch
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('No se pudieron cargar los productos. Intenta de nuevo más tarde.');
      console.error('Error al obtener productos:', err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Función para manejar la eliminación de un producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productService.deleteProduct(id);
        alert('Producto eliminado exitosamente.');
        // Vuelve a cargar la lista de productos después de la eliminación
        fetchProducts();
      } catch (err) {
        alert('Error al eliminar el producto.');
        console.error('Error al eliminar producto:', err.response ? err.response.data : err.message);
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando productos...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (products.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>No hay productos disponibles.</div>;
  }

  return (
    <div className="product-list-container"> {/* Mantener el nombre de clase CSS si AdminProductList.css lo usa */}
      {products.map(product => (
        <div key={product.id} className="product-card">
          {product.imagen_url && (
            <img src={product.imagen_url} alt={product.nombre} className="product-image" />
          )}
          <h3>{product.nombre}</h3>
          <p>{product.descripcion}</p>
          <p className="product-price">Precio: ${product.precio}</p>
          {/* Botones de acción */}
          <div className="product-actions">
            <Link to={`/admin/productos/editar/${product.id}`} className="edit-button">Editar</Link>
            <button onClick={() => handleDelete(product.id)} className="delete-button">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}


export default AdminProductList;