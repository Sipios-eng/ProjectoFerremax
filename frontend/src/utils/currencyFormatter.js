// frontend/src/utils/currencyFormatter.js

/**
 * Formatea un número a formato de moneda chilena (CLP).
 * Ejemplo: 1234567.89 -> "$1.234.567"
 * @param {number} amount - El monto a formatear.
 * @returns {string} El monto formateado como CLP.
 */
export const formatCLP = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0'; // O manejar el error como prefieras
  }
  // Usamos Intl.NumberFormat para un formato de moneda robusto
  // Estilo 'currency' para el símbolo de moneda, 'es-CL' para el locale chileno
  // currencyDisplay: 'symbol' para mostrar '$'
  // No mostramos decimales para CLP por convención, pero se puede añadir minimumFractionDigits
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0, // CLP no usa decimales en su formato común
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea un número a formato de dólar estadounidense (USD).
 * Ejemplo: 1234.56 -> "US$1,234.56"
 * @param {number} amount - El monto a formatear.
 * @returns {string} El monto formateado como USD.
 */
export const formatUSD = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'US$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};