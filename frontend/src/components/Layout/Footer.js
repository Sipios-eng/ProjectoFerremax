// frontend/src/components/Footer.js

import React from 'react';
import './Footer.css'; // Opcional: para estilos específicos del Footer

function Footer() {
  return (
    <footer className="main-footer">
      <p>&copy; {new Date().getFullYear()} Ferremas. Todos los derechos reservados.</p>
      <div className="footer-links">
        <a href="/politica-privacidad">Política de Privacidad</a>
        <a href="/terminos-servicio">Términos de Servicio</a>
      </div>
    </footer>
  );
}

export default Footer;