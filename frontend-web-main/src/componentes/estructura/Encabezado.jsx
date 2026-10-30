import React, { useState } from 'react';

const ENLACES_NAVEGACION = [
  ['inicio', 'Inicio'], ['catalogo', 'Catálogo'], ['categorias', 'Categorías'],
  ['ofertas', 'Ofertas'], ['nosotros', 'Nosotros'],
  ['blogs', 'Blog'], ['contacto', 'Contacto']
];

export default function Encabezado({ paginaDestino, navegar, cantidadElementosCarrito = 0 }) {
  const [menuAbierto, establecerMenuAbierto] = useState(false);
  const estaActivo = (clave) => paginaDestino === clave || (clave === 'categorias' && paginaDestino === 'categoria-detalle') || (clave === 'blogs' && paginaDestino === 'blog-detalle');
  const irA = (clave) => { navegar(clave); establecerMenuAbierto(false); };
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="logo border-0 bg-transparent" onClick={() => irA('inicio')} aria-label="AutoMaster inicio">
          <span className="logo-mark">A</span><span>AutoMaster</span>
        </button>
        <button className="menu-toggle" onClick={() => establecerMenuAbierto(valor => !valor)} aria-expanded={menuAbierto} aria-label="Mostrar u ocultar menú">☰</button>
        <nav aria-label="Navegación principal" className={`main-nav ${menuAbierto ? 'nav-open' : ''}`}>
          <ul>{ENLACES_NAVEGACION.map(([clave, etiqueta]) => (
            <li key={clave}><button className={`nav-link ${estaActivo(clave) ? 'active-page' : ''}`} aria-current={estaActivo(clave) ? 'page' : undefined} onClick={() => irA(clave)}>{etiqueta}</button></li>
          ))}</ul>
        </nav>
        <div className="header-actions">
          <button className="btn btn-sm btn-outline-light" onClick={() => irA('carrito')} aria-label={`Ver carrito, ${cantidadElementosCarrito} productos`}>Carrito <span className="badge text-bg-warning ms-1">{cantidadElementosCarrito}</span></button>
          <button className="btn btn-sm btn-outline-light" onClick={() => irA('login')}>Ingresar</button>
          <button className="btn btn-sm btn-primary" onClick={() => irA('funcionarios')}>Funcionarios</button>
        </div>
      </div>
    </header>
  );
}
