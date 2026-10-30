import React, { useMemo, useState } from 'react';
import TarjetaVehiculo from './TarjetaVehiculo.jsx';

/** Lista reutilizable. Recibe productos y acciones mediante props; controla sus filtros locales. */
export default function ListaVehiculos({ vehiculos = [], categorias = [], alSeleccionarVehiculo, alAgregarAlCarrito, mostrarCategorias = true, textoSinResultados = 'No encontramos vehículos con esos criterios.' }) {
  const [categoriaSeleccionada, establecerCategoriaSeleccionada] = useState('todos');
  const [busqueda, establecerBusqueda] = useState('');
  const resultadosFiltrados = useMemo(() => vehiculos.filter(vehiculo =>
    (categoriaSeleccionada === 'todos' || vehiculo.category === categoriaSeleccionada) &&
    `${vehiculo.name} ${vehiculo.tag || ''} ${vehiculo.motor || ''}`.toLowerCase().includes(busqueda.toLowerCase().trim())
  ), [vehiculos, categoriaSeleccionada, busqueda]);
  return <div className="vehicle-grid-region">
    <div className="catalog-toolbar">
      {mostrarCategorias && <div className="catalog-filters" role="group" aria-label="Filtrar por categoría">
        <button type="button" className={`catalog-filter ${categoriaSeleccionada === 'todos' ? 'active' : ''}`} aria-pressed={categoriaSeleccionada === 'todos'} onClick={() => establecerCategoriaSeleccionada('todos')}>Todos</button>
        {categorias.map(categoria => <button key={categoria.id} type="button" className={`catalog-filter ${categoriaSeleccionada === categoria.id ? 'active' : ''}`} aria-pressed={categoriaSeleccionada === categoria.id} onClick={() => establecerCategoriaSeleccionada(categoria.id)}>{categoria.title}</button>)}
      </div>}
      <label className="catalog-search"><span className="visually-hidden">Buscar vehículos</span><input className="form-control" type="search" value={busqueda} onChange={evento => establecerBusqueda(evento.target.value)} placeholder="Buscar por modelo, categoría o motor" /></label>
    </div>
    <p className="text-secondary small" aria-live="polite">{resultadosFiltrados.length} resultado(s)</p>
    {resultadosFiltrados.length === 0 ? <p className="alert alert-secondary" role="status">{textoSinResultados}</p> : <div className="catalog-grid">{resultadosFiltrados.map(vehiculo => <TarjetaVehiculo key={vehiculo.id} vehiculo={vehiculo} alSeleccionarVehiculo={alSeleccionarVehiculo} alAgregarAlCarrito={alAgregarAlCarrito} />)}</div>}
  </div>;
}
