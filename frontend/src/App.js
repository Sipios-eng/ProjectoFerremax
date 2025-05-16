// frontend/src/App.js
import React from 'react';
import './App.css'; // Puedes mantener o modificar los estilos CSS
// import logo from './logo.svg'; // Puedes borrar esta línea si no usas el logo
import ItemList from './components/ItemList'; // Importa tu componente ItemList

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Puedes borrar o comentar el logo y el texto predeterminado */}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>Bienvenido a Ferremax</h1>
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
      <main>
        {/* Renderiza tu componente ItemList aquí */}
        <ItemList />
      </main>
    </div>
  );
}

export default App;