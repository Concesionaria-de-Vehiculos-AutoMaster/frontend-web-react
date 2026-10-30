import React from 'react';
import ListaVehiculos from '../componentes/vehiculos/ListaVehiculos.jsx';
export default function PaginaOfertas({ vehiculos, categorias, alSeleccionarVehiculo, alAgregarAlCarrito }) {
  const vehiculosEnOferta = vehiculos.filter(vehiculo => Number(vehiculo.offerPercent) > 0);
  return <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">Promociones</span><h1>Ofertas AutoMaster</h1><p>Productos con precio promocional dentro del catálogo de demostración.</p></div>{vehiculosEnOferta.length ? <ListaVehiculos vehiculos={vehiculosEnOferta} categorias={categorias} mostrarCategorias={false} alSeleccionarVehiculo={alSeleccionarVehiculo} alAgregarAlCarrito={alAgregarAlCarrito} /> : <p className="alert alert-secondary">No hay ofertas publicadas.</p>}</div></section>;
}
