// frontend/src/services/productService.js

import api from './api';

const productService = {
  // Función para obtener todos los productos de tu API
  getAllProducts: async () => {
    try {
      const response = await api.get('producto/'); // <-- CAMBIADO: 'producto/' para coincidir con tu URL de Django
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Función para obtener un producto por su ID (útil para ProductDetailPage)
  getProductById: async (id) => {
    try {
      const response = await api.get(`producto/${id}/`); // <-- CAMBIADO: 'producto/'
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },
  createProduct: async (productData) => {
     const response = await api.post('producto/', productData);
     return response.data;
  },

  updateProduct: async (id, productData) => {
    try {
      // Envía los datos actualizados del producto a la API
      const response = await api.put(`producto/${id}/`, productData); // Usamos PUT
      return response.data; // Devuelve el producto actualizado
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      // Envía una petición DELETE para eliminar el producto
      await api.delete(`producto/${id}/`);
      return { message: 'Producto eliminado exitosamente.' }; // No hay datos de respuesta en 204 No Content
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  },

  getAllMarcas: async () => {
    try {
      const response = await api.get('marcas/'); // <-- URL de tu API de Marcas
      return response.data;
    } catch (error) {
      console.error('Error fetching marcas:', error);
      throw error;
    }
  },
  
  getAllTiposProducto: async () => {
    try {
      const response = await api.get('tipos-producto/'); // <-- URL de tu API de Tipos de Producto
      return response.data;
    } catch (error) {
      console.error('Error fetching tipos de producto:', error);
      throw error;
    }
  },
};

export default productService;