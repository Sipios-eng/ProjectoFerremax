// frontend/src/App.js

import React from 'react';
import BaseLayout from './BaseLayout'; // Importamos el componente de layout base
import ItemList from './components/ItemList'; // Tu componente ItemList
import './App.css'; // Mantén o modifica tus estilos CSS generales de App.js

function App() {
  return (
    // En lugar de un <div> con header y main directos,
    // usamos nuestro BaseLayout.
    <BaseLayout>
      {/*
        Todo lo que pongas aquí dentro de <BaseLayout>
        se renderizará en el espacio de {children} que definimos
        en BaseLayout.js.
        Así, Header y Footer siempre serán visibles.
      */}

      {/* Aquí es donde normalmente iría el contenido de tu página de inicio.
          Ahora renderizamos ItemList directamente aquí. */}
      <div className="home-page-content"> {/* Puedes envolverlo en un div para estilos específicos de la página */}
        <h1 style={{ textAlign: 'center', padding: '20px 0' }}>Productos Ferremax</h1>
        <ItemList />
      </div>

      {/* Puedes borrar o comentar el contenido anterior de <header className="App-header">
          ya que BaseLayout ya incluye un Header y un Footer. */}
    </BaseLayout>
  );
}

export default App;