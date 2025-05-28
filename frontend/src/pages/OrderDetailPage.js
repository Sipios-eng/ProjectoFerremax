// frontend/src/pages/OrderDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './OrderDetailPage.css'; // Crea un CSS para esta página

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn, user, isAdmin } = useAuth(); // Para permisos de edición/actualización de estado (futuro)

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      setError('Debes iniciar sesión para ver los detalles de tu pedido.');
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/pedidos/${id}/`);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Pedido no encontrado o error al cargar los detalles.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, isLoggedIn, user]); // Dependencia del usuario para seguridad

  if (loading) return <div className="loading-message">Cargando detalles del pedido...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return <div className="error-message">Pedido no encontrado.</div>;

  return (
    <div className="order-detail-container">
      <h2>Detalles del Pedido #{order.id}</h2>
      <div className="order-summary-card">
        <p><strong>Usuario:</strong> {order.usuario_username}</p>
        <p><strong>Fecha del Pedido:</strong> {new Date(order.fecha_pedido).toLocaleDateString()} {new Date(order.fecha_pedido).toLocaleTimeString()}</p>
        <p><strong>Estado:</strong> <span className={`order-status ${order.estado_nombre.toLowerCase().replace(' ', '-')}`}>{order.estado_nombre}</span></p>
        <p><strong>Total de Ítems:</strong> {order.total_cantidad}</p>
        <p><strong>Monto Total:</strong> ${parseFloat(order.total_monto).toFixed(2)}</p>
        {order.alias && <p><strong>Alias/Referencia:</strong> {order.alias}</p>}
      </div>

      <div className="order-shipping-card">
        <h3>Dirección de Entrega</h3>
        {order.direccion_entrega_detalle ? (
          <>
            <p>{order.direccion_entrega_detalle.direccion}</p>
            <p>{order.direccion_entrega_detalle.ciudad}, {order.direccion_entrega_detalle.region}</p>
            <p>Código Postal: {order.direccion_entrega_detalle.codigo_postal}</p>
          </>
        ) : (
          <p>No se especificó dirección de entrega para este pedido.</p>
        )}
      </div>

      <h3>Productos en el Pedido</h3>
      <div className="order-items">
        {order.detalles.length === 0 ? (
          <p>Este pedido no tiene productos.</p>
        ) : (
          order.detalles.map((item) => (
            <div key={item.id} className="order-item">
              <img src={item.producto_imagen_url} alt={item.producto_nombre} className="order-item-image" />
              <div className="order-item-details">
                <h4>{item.producto_nombre}</h4>
                <p>Cantidad: {item.cantidad}</p>
                <p>Precio Unitario al Comprar: ${parseFloat(item.precio_unitario).toFixed(2)}</p>
                <p>Subtotal: ${(item.cantidad * item.precio_unitario).toFixed(2)}</p>
                <Link to={`/productos/${item.producto.id}`} className="view-product-link">Ver Producto</Link>
              </div>
            </div>
          ))
        )}
      </div>

      {isAdmin() && (
        <div className="admin-actions">
          <h3>Acciones de Administrador</h3>
          {/* Aquí podrías añadir botones para cambiar el estado del pedido, ver la venta asociada, etc. */}
          {/* Por ejemplo, un selector para actualizar el estado del pedido */}
          <p>Futuras opciones para cambiar estado, gestionar entrega, etc.</p>
        </div>
      )}

      <button onClick={() => window.history.back()} className="back-btn">Volver</button>
    </div>
  );
}

export default OrderDetailPage;