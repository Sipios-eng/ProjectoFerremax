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

  // Podrías añadir funciones para el CRUD completo aquí:
  // createProduct: async (productData) => {
  //   const response = await api.post('producto/', productData);
  //   return response.data;
  // },
  // updateProduct: async (id, productData) => {
  //   const response = await api.put(`producto/${id}/`, productData);
  //   return response.data;
  // },
  // deleteProduct: async (id) => {
  //   const response = await api.delete(`producto/${id}/`);
  //   return response.data;
  // },
};

export default productService;