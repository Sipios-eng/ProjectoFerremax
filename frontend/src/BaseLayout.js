// frontend/src/BaseLayout.js

import React from 'react';
import Header from './components/Header'; // Importamos el Header
import Footer from './components/Footer'; // Importamos el Footer
import './BaseLayout.css'; // Opcional: para estilos generales del layout

function BaseLayout({ children }) {
  // 'children' es una prop especial de React que representa el contenido
  // que se renderizará dentro de este componente.
  return (
    <div className="app-container">
      <Header /> {/* Aquí se renderiza el Header */}
      <main className="main-content">
        {children} {/* Aquí se renderizará el contenido específico de cada página */}
      </main>
      <Footer /> {/* Aquí se renderiza el Footer */}
    </div>
  );
}

export default BaseLayout;