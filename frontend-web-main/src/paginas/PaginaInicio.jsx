import React from 'react';
import TarjetaVehiculo from '../componentes/vehiculos/TarjetaVehiculo.jsx';

export default function PaginaInicio({ vehiculos, categorias, navegar, alSeleccionarVehiculo, alAgregarAlCarrito }) {
  const vehiculosDestacados = vehiculos.slice(0, 3);
  return <>
    <section className="hero" id="inicio"><div className="hero-overlay"/><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow">Concesionaria AutoMaster</span><h1>Tu próximo vehículo comienza aquí</h1>
        <p>Explora el catálogo, revisa las características de cada modelo y completa una compra de demostración.</p>
        <div className="hero-actions"><button className="btn btn-primary" onClick={() => navegar('catalogo')}>Ver productos</button><button className="btn btn-secondary" onClick={() => navegar('ofertas')}>Ver ofertas</button><button className="btn btn-ghost" onClick={() => navegar('funcionarios')}>Acceso funcionarios</button></div>
        <div className="hero-highlights"><div className="mini-card"><strong>{vehiculos.length}</strong><span>Vehículos de muestra</span></div><div className="mini-card"><strong>{categorias.length}</strong><span>Categorías</span></div><div className="mini-card"><strong>Compra</strong><span>Checkout de demostración</span></div></div>
      </div>
      <div className="hero-panel"><div className="hero-panel-card"><span className="status-pill">Tienda online</span><h2>Encuentra el modelo que buscas</h2><p>Compara productos y revisa sus características antes de agregarlos al carrito.</p><div className="quick-summary"><div><span>Catálogo</span><strong>{vehiculos.length} modelos</strong></div><div><span>Ofertas</span><strong>Promociones de muestra</strong></div><div><span>Compra</span><strong>Resumen de pedido</strong></div></div><button className="btn btn-primary btn-full" onClick={() => navegar('catalogo')}>Comenzar</button></div></div>
    </div></section>
    <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">Selección AutoMaster</span><h2>Productos destacados</h2><p>Consulta las características de cada vehículo o agrégalo al carrito.</p></div><div className="catalog-grid">{vehiculosDestacados.map(vehiculo => <TarjetaVehiculo key={vehiculo.id} vehiculo={vehiculo} alSeleccionarVehiculo={alSeleccionarVehiculo} alAgregarAlCarrito={alAgregarAlCarrito} />)}</div><div className="text-center mt-4"><button className="btn btn-primary" onClick={() => navegar('catalogo')}>Ver catálogo completo</button></div></div></section>
  </>;
}
