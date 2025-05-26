// frontend/src/context/CartContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Tu instancia de axios
import { useAuth } from './AuthContext'; // Para saber si el usuario está logueado

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null); // Almacenará el objeto Pedido completo
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);
  const { user, isLoggedIn } = useAuth(); // Obtén el usuario y su estado de login

  // Función para obtener el carrito del backend
  const fetchCart = async () => {
    if (!isLoggedIn()) {
      setCart(null); // Si no está logueado, no hay carrito persistente
      setLoadingCart(false);
      return;
    }

    setLoadingCart(true);
    setCartError(null);
    try {
      const response = await api.get('/carrito/');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Si el error es 404 (carrito no encontrado) o similar, establecer cart como null
      if (error.response && error.response.status === 404) {
        setCart(null);
      } else {
        setCartError('Error al cargar el carrito.');
      }
    } finally {
      setLoadingCart(false);
    }
  };

  // Efecto para cargar el carrito cuando el usuario cambia de estado de login
  useEffect(() => {
    fetchCart();
  }, [user, isLoggedIn]); // Dependencias: user cambia al loguearse/desloguearse

  // Funciones para modificar el carrito (llamadas desde componentes)
  const addToCart = async (productId, quantity = 1) => {
    if (!isLoggedIn()) {
      // Opcional: Implementar carrito anónimo en LocalStorage o redirigir a login
      alert('Debes iniciar sesión para añadir productos al carrito persistente.');
      return;
    }
    setLoadingCart(true);
    setCartError(null);
    try {
      const response = await api.post('/carrito/', { producto_id: productId, cantidad: quantity });
      setCart(response.data);
      alert('Producto añadido al carrito!');
    } catch (error) {
      console.error('Error adding to cart:', error.response?.data || error.message);
      setCartError(error.response?.data?.error || 'Error al añadir producto al carrito.');
    } finally {
      setLoadingCart(false);
    }
  };

  const updateCartItem = async (detalleId, newQuantity) => {
    if (!isLoggedIn()) return; // Solo para usuarios logueados
    setLoadingCart(true);
    setCartError(null);
    try {
      const response = await api.put('/carrito/', { detalle_id: detalleId, cantidad: newQuantity });
      setCart(response.data);
    } catch (error) {
      console.error('Error updating cart item:', error.response?.data || error.message);
      setCartError(error.response?.data?.error || 'Error al actualizar cantidad del carrito.');
    } finally {
      setLoadingCart(false);
    }
  };

  const removeCartItem = async (detalleId) => {
    if (!isLoggedIn()) return; // Solo para usuarios logueados
    setLoadingCart(true);
    setCartError(null);
    try {
      // Usa data en peticiones DELETE con body
      await api.delete('/carrito/', { data: { detalle_id: detalleId } });
      setCart(prevCart => ({
        ...prevCart,
        detalles: prevCart.detalles.filter(item => item.id !== detalleId),
        // Recalcular totales aquí si los necesitas inmediatamente sin otro fetch
        total_cantidad: (prevCart.total_cantidad || 0) - (prevCart.detalles.find(item => item.id === detalleId)?.cantidad || 0),
        total_monto: (prevCart.total_monto || 0) - ((prevCart.detalles.find(item => item.id === detalleId)?.cantidad || 0) * (prevCart.detalles.find(item => item.id === detalleId)?.precio_unitario || 0))
      }));
      alert('Producto eliminado del carrito.');
    } catch (error) {
      console.error('Error removing cart item:', error.response?.data || error.message);
      setCartError(error.response?.data?.error || 'Error al eliminar producto del carrito.');
    } finally {
      setLoadingCart(false);
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn()) return; // Solo para usuarios logueados
    setLoadingCart(true);
    setCartError(null);
    try {
      await api.delete('/carrito/', { data: { vaciar_carrito: true } });
      setCart(null); // El carrito ahora está vacío
      alert('Carrito vaciado.');
    } catch (error) {
      console.error('Error clearing cart:', error.response?.data || error.message);
      setCartError(error.response?.data?.error || 'Error al vaciar el carrito.');
    } finally {
      setLoadingCart(false);
    }
  };

  // El valor que se proporciona al contexto
  const cartContextValue = {
    cart,
    loadingCart,
    cartError,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    fetchCart // Para recargar el carrito manualmente si es necesario
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};