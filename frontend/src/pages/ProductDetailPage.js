// frontend/src/pages/ProductDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { formatCLP, formatUSD } from '../utils/currencyFormatter'; // Asegúrate de que este path sea correcto
import './ProductDetailPage.css';
import { useCurrency } from '../context/CurrencyContext'; // Asegúrate de que este path sea correcto

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  // Obtiene el contexto de moneda
  const { convertToUsd, displayCurrency, toggleDisplayCurrency, loading: currencyLoading, error: currencyError } = useCurrency(); 

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
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
    if (quantity > 0 && product && quantity <= product.cantidad_disponible) {
      addToCart(product.id, quantity);
    } else if (quantity <= 0) {
      alert('La cantidad debe ser al menos 1.');
    } else if (product && quantity > product.cantidad_disponible) {
      alert(`La cantidad no puede exceder el stock disponible (${product.cantidad_disponible}).`);
    } else {
      alert('No se pudo añadir el producto. Verifica la cantidad y el stock.');
    }
  };

  // Función para determinar el precio a mostrar y su formato (CLP o USD)
  const displayPrice = () => {
    if (!product || currencyLoading) {
      // Si el producto no ha cargado o la tasa de cambio aún no está lista
      return 'Cargando...';
    }
    
    // Asegúrate de parsear el precio a flotante antes de usarlo
    const productPriceFloat = parseFloat(product.precio);

    if (isNaN(productPriceFloat)) {
      return 'Precio Inválido'; // Manejo de error si el precio no es un número
    }

    if (displayCurrency === 'CLP') {
      return formatCLP(productPriceFloat);
    } else {
      const usdPrice = convertToUsd(productPriceFloat);
      return usdPrice !== null ? formatUSD(usdPrice) : 'N/A'; // N/A si la conversión falla
    }
  };

  if (loading) return <div className="loading-message">Cargando detalles del producto...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Producto no encontrado.</div>;

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
        
        {/* Aquí se muestra el precio con el formato y conversión */}
        <p className="product-detail-price">Precio: {displayPrice()}</p>
        
        {/* Botón para cambiar la moneda */}
        {!currencyLoading && !currencyError && ( // Muestra el botón solo si la API de moneda cargó bien
          <button onClick={toggleDisplayCurrency} className="btn-toggle-currency">
            Mostrar en {displayCurrency === 'CLP' ? 'USD' : 'CLP'}
          </button>
        )}
        {currencyError && (
          <p className="currency-error-message">No se pudo obtener la cotización del dólar.</p>
        )}

        <p className="product-detail-stock">Stock Disponible: {product.cantidad_disponible}</p>

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