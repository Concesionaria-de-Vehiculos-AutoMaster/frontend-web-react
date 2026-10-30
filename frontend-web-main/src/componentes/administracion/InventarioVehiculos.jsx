import React, { useMemo, useState } from 'react';
import { formatearMoneda } from '../vehiculos/TarjetaVehiculo.jsx';
import MensajeEstado from '../comunes/MensajeEstado.jsx';
import BotonAccion from '../comunes/BotonAccion.jsx';
import { crearRegistro, actualizarRegistro, eliminarRegistro } from '../../datos/operacionesCrud.js';

const FORMULARIO_VACIO = { name: '', category: 'auto', tag: '', motor: '', detail: '', price: '', stock: '1', image: '' };

export default function InventarioVehiculos({ vehiculos, establecerVehiculos, categorias }) {
  const [formulario, establecerFormulario] = useState(() => ({ ...FORMULARIO_VACIO, category: categorias[0]?.id || '' }));
  const [identificadorEnEdicion, establecerIdentificadorEnEdicion] = useState(null);
  const [vehiculoConsultado, establecerVehiculoConsultado] = useState(null);
  const [busqueda, establecerBusqueda] = useState('');
  const [mensaje, establecerMensaje] = useState('');
  const [error, establecerError] = useState('');

  const registrosVisibles = useMemo(() => vehiculos.filter(vehiculo => `${vehiculo.name} ${vehiculo.tag} ${vehiculo.category}`.toLowerCase().includes(busqueda.toLowerCase().trim())), [vehiculos, busqueda]);
  const productosCriticos = vehiculos.filter(vehiculo => Number(vehiculo.stock) <= 1);
  const cambiarCampo = evento => establecerFormulario(actual => ({ ...actual, [evento.target.name]: evento.target.value }));
  const cancelarEdicion = () => { establecerIdentificadorEnEdicion(null); establecerFormulario({ ...FORMULARIO_VACIO, category: categorias[0]?.id || '' }); establecerError(''); };

  const enviarFormulario = evento => {
    evento.preventDefault();
    const nombre = formulario.name.trim();
    const precio = Number(formulario.price);
    const existencias = Number(formulario.stock);
    if (!nombre || !formulario.category || !Number.isFinite(precio) || precio <= 0 || !Number.isInteger(existencias) || existencias < 0) {
      establecerError('Completa el nombre y la categoría, un precio mayor que cero y un stock entero igual o superior a cero.'); establecerMensaje(''); return;
    }
    if (vehiculos.some(vehiculo => vehiculo.id !== identificadorEnEdicion && vehiculo.name.trim().toLowerCase() === nombre.toLowerCase())) {
      establecerError('Ya existe un vehículo con ese nombre.'); establecerMensaje(''); return;
    }
    const valoresVehiculo = { ...formulario, name: nombre, price: precio, stock: existencias, image: formulario.image.trim() || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80' };
    establecerVehiculos(actuales => identificadorEnEdicion === null
      ? crearRegistro(actuales, valoresVehiculo)
      : actualizarRegistro(actuales, identificadorEnEdicion, valoresVehiculo));
    cancelarEdicion(); establecerMensaje(identificadorEnEdicion === null ? 'Vehículo agregado al catálogo.' : 'Vehículo actualizado.');
  };

  const editarVehiculo = vehiculo => { establecerFormulario({ name: vehiculo.name, category: vehiculo.category, tag: vehiculo.tag || '', motor: vehiculo.motor || '', detail: vehiculo.detail || '', price: String(vehiculo.price), stock: String(vehiculo.stock), image: vehiculo.image || '' }); establecerIdentificadorEnEdicion(vehiculo.id); establecerVehiculoConsultado(null); establecerMensaje(''); establecerError(''); };
  const eliminarVehiculo = vehiculo => {
    if (!window.confirm(`¿Eliminar ${vehiculo.name} del catálogo?`)) return;
    establecerVehiculos(actuales => eliminarRegistro(actuales, vehiculo.id));
    if (identificadorEnEdicion === vehiculo.id) cancelarEdicion();
    if (vehiculoConsultado?.id === vehiculo.id) establecerVehiculoConsultado(null);
    establecerMensaje('Vehículo eliminado.'); establecerError('');
  };

  return <div className="vstack gap-4">
    <p className="text-secondary mb-0">Administra los productos que aparecen en el catálogo público. Los cambios se guardan en este navegador.</p>
    <form className="border rounded-3 p-3 bg-light" onSubmit={enviarFormulario} noValidate>
      <h3 className="h6">{identificadorEnEdicion === null ? 'Nuevo producto' : 'Editar producto'}</h3>
      <div className="row g-3">
        <div className="col-md-6"><label className="form-label" htmlFor="producto-nombre">Nombre *</label><input id="producto-nombre" name="name" className="form-control" required value={formulario.name} onChange={cambiarCampo}/></div>
        <div className="col-md-3"><label className="form-label" htmlFor="producto-categoria">Categoría *</label><select id="producto-categoria" name="category" className="form-select" required value={formulario.category} onChange={cambiarCampo}>{categorias.map(categoria => <option key={categoria.id} value={categoria.id}>{categoria.title}</option>)}</select></div>
        <div className="col-md-3"><label className="form-label" htmlFor="producto-etiqueta">Tipo</label><input id="producto-etiqueta" name="tag" className="form-control" value={formulario.tag} onChange={cambiarCampo}/></div>
        <div className="col-md-4"><label className="form-label" htmlFor="producto-motor">Motor</label><input id="producto-motor" name="motor" className="form-control" value={formulario.motor} onChange={cambiarCampo}/></div>
        <div className="col-md-4"><label className="form-label" htmlFor="producto-detalle">Descripción</label><input id="producto-detalle" name="detail" className="form-control" value={formulario.detail} onChange={cambiarCampo}/></div>
        <div className="col-md-2"><label className="form-label" htmlFor="producto-precio">Precio CLP *</label><input id="producto-precio" name="price" type="number" min="1" required className="form-control" value={formulario.price} onChange={cambiarCampo}/></div>
        <div className="col-md-2"><label className="form-label" htmlFor="producto-stock">Stock *</label><input id="producto-stock" name="stock" type="number" min="0" step="1" required className="form-control" value={formulario.stock} onChange={cambiarCampo}/></div>
        <div className="col-12"><label className="form-label" htmlFor="producto-imagen">URL de imagen (opcional)</label><input id="producto-imagen" name="image" type="url" className="form-control" value={formulario.image} onChange={cambiarCampo}/></div>
      </div>
      <div className="d-flex gap-2 mt-3"><BotonAccion tipo="submit">{identificadorEnEdicion === null ? 'Guardar producto' : 'Guardar cambios'}</BotonAccion>{identificadorEnEdicion !== null && <button className="btn btn-outline-secondary" type="button" onClick={cancelarEdicion}>Cancelar</button>}</div>
    </form>
    <MensajeEstado mensaje={error} varianteEstilo="danger"/><MensajeEstado mensaje={mensaje} varianteEstilo="success"/>

    <section aria-labelledby="productos-criticos"><div className="d-flex justify-content-between align-items-center"><h3 id="productos-criticos" className="h6 mb-2">Productos con stock bajo ({productosCriticos.length})</h3></div><div className="table-responsive"><table className="table table-sm"><thead><tr><th>Producto</th><th>Stock</th></tr></thead><tbody>{productosCriticos.map(vehiculo => <tr key={vehiculo.id}><td>{vehiculo.name}</td><td>{vehiculo.stock}</td></tr>)}{productosCriticos.length === 0 && <tr><td colSpan="2">No hay productos con stock bajo.</td></tr>}</tbody></table></div></section>

    <section aria-labelledby="lista-productos"><div className="d-flex flex-wrap align-items-center justify-content-between gap-2"><h3 id="lista-productos" className="h6 mb-0">Productos ({vehiculos.length})</h3><input className="form-control" style={{ maxWidth: 340 }} aria-label="Buscar productos" placeholder="Buscar producto..." value={busqueda} onChange={evento => establecerBusqueda(evento.target.value)}/></div>
      {registrosVisibles.length === 0 ? <p className="alert alert-secondary mt-3">No hay productos que coincidan con la búsqueda.</p> : <div className="table-responsive mt-3"><table className="table table-striped table-hover align-middle"><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>{registrosVisibles.map(vehiculo => <tr key={vehiculo.id}><td>{vehiculo.name}</td><td>{categorias.find(categoria => categoria.id === vehiculo.category)?.title || vehiculo.category}</td><td>{formatearMoneda(vehiculo.price)}</td><td>{vehiculo.stock}</td><td><div className="d-flex flex-wrap gap-2"><button className="btn btn-sm btn-outline-secondary" onClick={() => establecerVehiculoConsultado(vehiculo)}>Ver</button><button className="btn btn-sm btn-outline-primary" onClick={() => editarVehiculo(vehiculo)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => eliminarVehiculo(vehiculo)}>Eliminar</button></div></td></tr>)}</tbody></table></div>}
    </section>
    {vehiculoConsultado && <div className="border rounded-3 p-3"><div className="d-flex justify-content-between gap-2"><h3 className="h6">Detalle del producto</h3><button type="button" className="btn-close" aria-label="Cerrar detalle" onClick={() => establecerVehiculoConsultado(null)} /></div><p className="mb-1"><strong>{vehiculoConsultado.name}</strong></p><p className="mb-1">{vehiculoConsultado.detail}</p><p className="mb-0">{vehiculoConsultado.motor} · {formatearMoneda(vehiculoConsultado.price)} · Stock: {vehiculoConsultado.stock}</p></div>}
  </div>;
}
