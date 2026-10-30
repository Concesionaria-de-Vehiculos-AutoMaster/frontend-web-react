import React from 'react';
import ListaVehiculos from '../componentes/vehiculos/ListaVehiculos.jsx';
export default function PaginaCatalogo({ vehiculos, categorias, alSeleccionarVehiculo, alAgregarAlCarrito }) {
  return <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">Catálogo</span><h1>Vehículos y motos</h1><p>Busca por modelo, categoría o motor y agrega unidades disponibles al carrito.</p></div><ListaVehiculos vehiculos={vehiculos} categorias={categorias} alSeleccionarVehiculo={alSeleccionarVehiculo} alAgregarAlCarrito={alAgregarAlCarrito} /></div></section>;
}
