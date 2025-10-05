import React from 'react';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="app-title">Harmonia</h1>
          <p className="app-subtitle">Transformation Audio Thérapeutique</p>
        </div>
        <nav className="main-nav">
          <button className="nav-button">Accueil</button>
          <button className="nav-button">Base de Connaissances</button>
          <button className="nav-button">À Propos</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;