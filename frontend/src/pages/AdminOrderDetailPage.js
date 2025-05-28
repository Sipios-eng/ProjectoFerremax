// frontend/src/pages/AdminOrderDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminOrderDetailPage.css'; // Crea este CSS para estilos

function AdminOrderDetailPage() {
  const { id } = useParams(); // Obtiene el ID de la venta de la URL
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Asumiendo que /api/ventas/:id/ te da los detalles de la venta
        const response = await api.get(`/ventas/${id}/`);
        setSale(response.data);
      } catch (err) {
        console.error('Error fetching sale details:', err.response?.data || err.message);
        if (err.response && err.response.status === 404) {
          setError('Venta no encontrada.');
        } else {
          setError('Error al cargar los detalles de la venta.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSaleDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate('/admin/ventas'); // Vuelve a la página de gestión de ventas
  };

  // Puedes añadir funciones para actualizar la venta aquí (ej. cambiar estado de entrega)
  // const handleUpdateSaleStatus = async (newStatus) => { ... }


  if (loading) return <div className="loading-message">Cargando detalles de la venta...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!sale) return <div className="error-message">Detalles de la venta no disponibles.</div>;

  return (
    <div className="admin-order-detail-container">
      <h2>Detalles de la Venta #{sale.id}</h2>
      <div className="sale-info-section">
        <p><strong>ID Venta:</strong> {sale.id}</p>
        <p><strong>ID Pedido:</strong> {sale.pedido_id}</p>
        <p><strong>Usuario:</strong> {sale.usuario_username}</p>
        <p><strong>Método de Pago:</strong> {sale.metodo_pago_nombre}</p>
        <p><strong>Monto Total:</strong> ${parseFloat(sale.monto).toFixed(2)}</p>
        <p><strong>Fecha de Transacción:</strong> {new Date(sale.fecha_transaccion).toLocaleString()}</p>
        <p><strong>Estado del Pedido:</strong> {sale.pedido_estado}</p>
        {/* Aquí puedes añadir más detalles del pedido si los traes en el serializer */}
      </div>

      {/* Sección de productos del pedido */}
      <h3>Productos del Pedido</h3>
      {sale.detalle_pedido_set && sale.detalle_pedido_set.length > 0 ? (
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.detalle_pedido_set.map(item => (
              <tr key={item.id}>
                <td>{item.producto_nombre}</td> {/* Asegúrate que el serializer expose producto_nombre */}
                <td>{item.cantidad}</td>
                <td>${parseFloat(item.precio_unitario).toFixed(2)}</td>
                <td>${parseFloat(item.cantidad * item.precio_unitario).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Este pedido no tiene productos asociados o los datos no se cargaron.</p>
      )}

      {/* Puedes añadir sección para detalles de la entrega si los tienes */}
      {/* <h3>Detalles de la Entrega</h3>
      {sale.entrega_info ? ( // Asumiendo que el serializer anida la info de entrega
        <div>
          <p>Estado Entrega: {sale.entrega_info.estado_entrega_nombre}</p>
          <p>Fecha Entrega: {new Date(sale.entrega_info.fecha_entrega).toLocaleString()}</p>
          // ... otros campos de entrega
        </div>
      ) : (
        <p>No hay información de entrega disponible.</p>
      )} */}

      <button onClick={handleGoBack} className="btn btn-secondary back-button">Volver a Gestión de Ventas</button>
    </div>
  );
}

export default AdminOrderDetailPage;