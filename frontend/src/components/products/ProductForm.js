// frontend/src/components/products/ProductForm.js

import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import './ProductForm.css';

// Añadimos props initialData y isEditMode
function ProductForm({ onProductCreated, initialData = null, isEditMode = false }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    impuesto_porcentaje: '',
    descuento_porcentaje: '',
    cantidad_disponible: '',
    imagen_url: '',
    marca: '',
    tipo_producto: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [marcas, setMarcas] = useState([]);
  const [tiposProducto, setTiposProducto] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState(null);

  // useEffect para cargar las marcas y tipos de producto al montar el componente
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchedMarcas = await productService.getAllMarcas();
        const fetchedTiposProducto = await productService.getAllTiposProducto();
        setMarcas(fetchedMarcas);
        setTiposProducto(fetchedTiposProducto);
      } catch (err) {
        setOptionsError('Error al cargar opciones de Marca/Tipo de Producto.');
        console.error('Error fetching options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // NUEVO useEffect para pre-llenar el formulario en modo edición
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        precio: initialData.precio ? parseFloat(initialData.precio) : '', // Asegúrate de parsear si viene como string
        impuesto_porcentaje: initialData.impuesto_porcentaje ? parseFloat(initialData.impuesto_porcentaje) : '',
        descuento_porcentaje: initialData.descuento_porcentaje ? parseFloat(initialData.descuento_porcentaje) : '',
        cantidad_disponible: initialData.cantidad_disponible || '',
        imagen_url: initialData.imagen_url || '',
        marca: initialData.marca || '', // Este ya debe ser el ID
        tipo_producto: initialData.tipo_producto || '', // Este ya debe ser el ID
      });
    } else if (!isEditMode) {
      // Si no es modo edición, resetear el formulario (útil después de crear)
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        impuesto_porcentaje: '',
        descuento_porcentaje: '',
        cantidad_disponible: '',
        imagen_url: '',
        marca: '',
        tipo_producto: '',
      });
    }
  }, [isEditMode, initialData]); // Depende de si está en modo edición y si los datos iniciales cambian


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.marca || !formData.tipo_producto) {
      setError('Debes seleccionar una Marca y un Tipo de Producto.');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        // Convertir a número flotante, si es un campo de texto
        precio: parseFloat(formData.precio),
        impuesto_porcentaje: formData.impuesto_porcentaje ? parseFloat(formData.impuesto_porcentaje) : null,
        descuento_porcentaje: formData.descuento_porcentaje ? parseFloat(formData.descuento_porcentaje) : null,
        cantidad_disponible: parseInt(formData.cantidad_disponible, 10),
        imagen_url: formData.imagen_url,
        marca: parseInt(formData.marca, 10),
        tipo_producto: parseInt(formData.tipo_producto, 10),
      };

      let resultProduct;
      if (isEditMode && initialData && initialData.id) {
        resultProduct = await productService.updateProduct(initialData.id, productData);
        setSuccess(true);
        console.log('Producto actualizado exitosamente:', resultProduct);
      } else {
        resultProduct = await productService.createProduct(productData);
        setSuccess(true);
        console.log('Producto creado exitosamente:', resultProduct);
        // Solo limpiar el formulario si estamos creando
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          impuesto_porcentaje: '',
          descuento_porcentaje: '',
          cantidad_disponible: '',
          imagen_url: '',
          marca: '',
          tipo_producto: '',
        });
      }

      if (onProductCreated) { // Usamos onProductCreated para ambos casos (crear y actualizar)
        onProductCreated(resultProduct);
      }
    } catch (err) {
      console.error('Error al guardar producto:', err.response ? err.response.data : err.message);
      let errorMessage = 'Error al guardar producto. Verifica los datos.';
      if (err.response && err.response.data) {
        // DRF a menudo devuelve un objeto con errores de campo
        errorMessage += ' Detalles: ' + JSON.stringify(err.response.data);
      } else {
        errorMessage += ' Detalle: ' + err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando opciones de Marca y Tipo de Producto...</div>;
  }

  if (optionsError) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{optionsError}</div>;
  }

  return (
    <div className="product-form-container">
      <h2>{isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2> {/* Título dinámico */}
      <form onSubmit={handleSubmit} className="product-form">
        {/* ... (Tus campos de formulario como nombre, descripcion, precio, etc.) ... */}
        {/* Asegúrate de que todos los campos tengan `name` y `value` y `onChange` */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input type="number" id="precio" name="precio" step="0.001" value={formData.precio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="impuesto_porcentaje">Impuesto (%):</label>
          <input type="number" id="impuesto_porcentaje" name="impuesto_porcentaje" step="0.01" value={formData.impuesto_porcentaje} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="descuento_porcentaje">Descuento (%):</label>
          <input type="number" id="descuento_porcentaje" name="descuento_porcentaje" step="0.01" value={formData.descuento_porcentaje} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="cantidad_disponible">Cantidad Disponible:</label>
          <input type="number" id="cantidad_disponible" name="cantidad_disponible" value={formData.cantidad_disponible} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="imagen_url">URL de Imagen:</label>
          <input type="url" id="imagen_url" name="imagen_url" value={formData.imagen_url} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="marca">Marca:</label>
          <select id="marca" name="marca" value={formData.marca} onChange={handleChange} required>
            <option value="">Selecciona una marca</option>
            {marcas.map(marca => (
              <option key={marca.id} value={marca.id}>{marca.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tipo_producto">Tipo de Producto:</label>
          <select id="tipo_producto" name="tipo_producto" value={formData.tipo_producto} onChange={handleChange} required>
            <option value="">Selecciona un tipo</option>
            {tiposProducto.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}
        </button>

        {success && <p className="success-message">¡Producto {isEditMode ? 'actualizado' : 'creado'} exitosamente!</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default ProductForm;