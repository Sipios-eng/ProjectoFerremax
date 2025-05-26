// frontend/src/pages/ProductDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext'; // <-- Importa el hook del carrito
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad a añadir
  const { addToCart } = useCart(); // Obtén la función para añadir al carrito

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // CAMBIO AQUÍ: 'productos' a 'producto' para que coincida con el backend
        const response = await api.get(`/producto/${id}/`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Producto no encontrado o error de carga.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Asegúrate de que la cantidad sea válida
    if (quantity > 0 && product && quantity <= product.cantidad_disponible) { // Añadido 'product &&' para seguridad
      addToCart(product.id, quantity);
    } else if (quantity <= 0) {
      alert('La cantidad debe ser al menos 1.');
    } else if (product && quantity > product.cantidad_disponible) { // Solo si product existe
      alert(`La cantidad no puede exceder el stock disponible (${product.cantidad_disponible}).`);
    } else {
      alert('No se pudo añadir el producto. Verifica la cantidad y el stock.'); // Mensaje más general si product es null
    }
  };

  if (loading) return <div className="loading-message">Cargando detalles del producto...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Producto no encontrado.</div>;

  const finalPrice = parseFloat(product.precio).toFixed(2);
  // Aquí podrías calcular precio con impuestos/descuentos si los tienes

  return (
    <div className="product-detail-container">
      <div className="product-detail-image-box">
        <img src={product.imagen_url} alt={product.nombre} className="product-detail-image" />
      </div>
      <div className="product-detail-info">
        <h2 className="product-detail-title">{product.nombre}</h2>
        <p className="product-detail-brand">Marca: {product.marca_nombre}</p>
        <p className="product-detail-type">Tipo: {product.tipo_producto_nombre}</p>
        <p className="product-detail-description">{product.descripcion}</p>
        <p className="product-detail-price">Precio: ${finalPrice}</p>
        <p className="product-detail-stock">Stock Disponible: {product.cantidad_disponible}</p>

        {/* Input de Cantidad y Botón Añadir al Carrito */}
        <div className="add-to-cart-section">
          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max={product.cantidad_disponible}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="quantity-input"
          />
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={product.cantidad_disponible <= 0 || quantity <= 0 || quantity > product.cantidad_disponible}
          >
            {product.cantidad_disponible > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
          </button>
        </div>

        <button onClick={() => navigate(-1)} className="back-button">Volver</button>
      </div>
    </div>
  );
}

export default ProductDetailPage;