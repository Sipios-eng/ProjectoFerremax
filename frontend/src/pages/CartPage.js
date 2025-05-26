// frontend/src/pages/CartPage.js

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Para obtener direcciones y métodos de pago
import './CartPage.css';

function CartPage() {
  const { cart, loadingCart, cartError, updateCartItem, removeCartItem, clearCart, fetchCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    // Si el usuario está logueado, carga direcciones y métodos de pago
    if (isLoggedIn()) {
      const fetchCheckoutData = async () => {
        try {
          const [addressesRes, paymentRes] = await Promise.all([
            api.get('/direcciones/'),
            api.get('/metodos-pago/')
          ]);
          setShippingAddresses(addressesRes.data);
          setPaymentMethods(paymentRes.data);
        } catch (err) {
          console.error('Error fetching checkout data:', err);
        }
      };
      fetchCheckoutData();
    }
  }, [isLoggedIn]);

  const handleQuantityChange = (detalleId, newQuantity) => {
    const qty = parseInt(newQuantity);
    if (qty > 0) {
      updateCartItem(detalleId, qty);
    } else if (qty === 0) {
      if (window.confirm('¿Eliminar este producto del carrito?')) {
        removeCartItem(detalleId);
      }
    }
  };

  const handleRemoveItem = (detalleId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      removeCartItem(detalleId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      clearCart();
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn()) {
      alert('Debes iniciar sesión para completar la compra.');
      navigate('/login');
      return;
    }

    if (!cart || cart.detalles.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    if (!selectedAddress || !selectedPaymentMethod) {
      alert('Por favor, selecciona una dirección de entrega y un método de pago.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const response = await api.post('/checkout/', {
        direccion_id: selectedAddress,
        metodo_pago_id: selectedPaymentMethod,
      });
      alert('¡Compra realizada con éxito! Tu pedido ha sido procesado.');
      fetchCart(); // Recargar el carrito para que se actualice a vacío (o el siguiente pendiente)
      navigate(`/pedidos/${response.data.id}`); // O redirigir a una página de confirmación
    } catch (err) {
      console.error('Error durante el checkout:', err.response?.data || err.message);
      setCheckoutError(err.response?.data?.error || 'Error al procesar la compra.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!isLoggedIn()) {
    return (
      <div className="cart-page-message">
        <h2>Tu Carrito de Compras</h2>
        <p>Inicia sesión para ver y gestionar tu carrito de compras.</p>
        <button onClick={() => navigate('/login')} className="btn-primary">Iniciar Sesión</button>
      </div>
    );
  }

  if (loadingCart) return <div className="loading-message">Cargando carrito...</div>;
  if (cartError) return <div className="error-message">{cartError}</div>;

  if (!cart || cart.detalles.length === 0) {
    return (
      <div className="cart-page-message">
        <h2>Tu Carrito de Compras</h2>
        <p>Tu carrito está vacío.</p>
        <button onClick={() => navigate('/productos')} className="btn-primary">Ver Productos</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Mi Carrito de Compras</h2>
      <div className="cart-items">
        {cart.detalles.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.producto_imagen_url} alt={item.producto_nombre} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.producto_nombre}</h3>
              <p>Precio Unitario: ${parseFloat(item.precio_unitario).toFixed(2)}</p>
              <p>Subtotal: ${(item.cantidad * item.precio_unitario).toFixed(2)}</p>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(item.id, item.cantidad - 1)} disabled={item.cantidad <= 1}>-</button>
                <input
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  min="1"
                  max={item.producto.cantidad_disponible + item.cantidad} // Permite ajustar hasta el stock original + lo que ya está en el carrito
                />
                <button onClick={() => handleQuantityChange(item.id, item.cantidad + 1)} disabled={item.cantidad >= (item.producto.cantidad_disponible + item.cantidad)}>+</button>
              </div>
              <button onClick={() => handleRemoveItem(item.id)} className="remove-item-btn">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Resumen del Carrito</h3>
        <p>Total Ítems: {cart.total_cantidad}</p>
        <p>Total a Pagar: ${parseFloat(cart.total_monto).toFixed(2)}</p>
        <button onClick={handleClearCart} className="clear-cart-btn">Vaciar Carrito</button>
      </div>

      <div className="checkout-section">
        <h3>Opciones de Envío y Pago</h3>
        {shippingAddresses.length > 0 ? (
          <div className="form-group">
            <label htmlFor="shipping-address">Dirección de Entrega:</label>
            <select
              id="shipping-address"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              required
            >
              <option value="">Selecciona una dirección</option>
              {shippingAddresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.direccion}, {addr.ciudad}, {addr.region} ({addr.codigo_postal})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>No tienes direcciones guardadas. <Link to="/perfil/direcciones">Añadir Dirección</Link></p>
        )}

        {paymentMethods.length > 0 ? (
          <div className="form-group">
            <label htmlFor="payment-method">Método de Pago:</label>
            <select
              id="payment-method"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              required
            >
              <option value="">Selecciona un método de pago</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.metodo}
                </option>
              ))}
            </select>
          </div>
        ) : (
           <p>No hay métodos de pago disponibles.</p>
        )}

        {checkoutError && <p className="error-message">{checkoutError}</p>}
        <button
          onClick={handleCheckout}
          className="checkout-btn"
          disabled={checkoutLoading || !cart || cart.detalles.length === 0 || !selectedAddress || !selectedPaymentMethod}
        >
          {checkoutLoading ? 'Procesando Compra...' : 'Finalizar Compra'}
        </button>
      </div>
    </div>
  );
}

export default CartPage;