import React from 'react';
import ListaVehiculos from '../componentes/vehiculos/ListaVehiculos.jsx';
export default function PaginaDetalleCategoria({ categoria, categorias, vehiculos, alSeleccionarVehiculo, alAgregarAlCarrito, navegar }) {
  if (!categoria) return <section className="section"><div className="container"><p className="alert alert-secondary">La categoría solicitada no existe.</p><button className="btn btn-primary" onClick={() => navegar('categorias')}>Volver a categorías</button></div></section>;
  const vehiculosCategoria = vehiculos.filter(vehiculo => vehiculo.category === categoria.id);
  return <section className="section"><div className="container"><button className="btn btn-link px-0" onClick={() => navegar('categorias')}>Volver a categorías</button><div className="section-heading"><span className="eyebrow">Categoría</span><h1>{categoria.title}</h1><p>{categoria.description}</p></div><ListaVehiculos vehiculos={vehiculosCategoria} categorias={categorias} mostrarCategorias={false} alSeleccionarVehiculo={alSeleccionarVehiculo} alAgregarAlCarrito={alAgregarAlCarrito} /></div></section>;
}
