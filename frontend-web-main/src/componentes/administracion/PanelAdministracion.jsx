import React, { useState } from 'react';
import InventarioVehiculos from './InventarioVehiculos.jsx';
import ModuloAdministrativo from './ModuloAdministrativo.jsx';
import { cargarRegistros, leerJsonSeguro } from '../../datos/operacionesCrud.js';
import { formatearMoneda } from '../vehiculos/TarjetaVehiculo.jsx';
import MensajeEstado from '../comunes/MensajeEstado.jsx';

const SECCIONES = [
  ['inicio', 'Inicio / Dashboard'], ['ordenes', 'Órdenes / Boletas'], ['productos', 'Productos'],
  ['categorias', 'Categorías'], ['usuarios', 'Usuarios'], ['reportes', 'Reportes'], ['perfil', 'Perfil']
];
const CLAVE_PEDIDOS = 'automaster_react_orders';

export default function PanelAdministracion({ vehiculos, establecerVehiculos, categorias, establecerCategorias }) {
  const [seccion, establecerSeccion] = useState('inicio');
  const [sesionIniciada, establecerSesionIniciada] = useState(() => sessionStorage.getItem('automaster_react_auth') === 'true');
  const [usuario, establecerUsuario] = useState('');
  const [clave, establecerClave] = useState('');
  const [mensaje, establecerMensaje] = useState('');
  const [tipoMensaje, establecerTipoMensaje] = useState('danger');
  const [pedidos, establecerPedidos] = useState(() => cargarRegistros(localStorage, CLAVE_PEDIDOS));
  const [perfil, establecerPerfil] = useState(() => leerJsonSeguro(localStorage, 'automaster_react_admin_profile', { name: 'Administrador AutoMaster', email: 'admin@automaster.cl' }));
  const [perfilGuardado, establecerPerfilGuardado] = useState('');
  const [pedidoConsultado, establecerPedidoConsultado] = useState(null);
  const totalVentas = pedidos.reduce((suma, pedido) => suma + Number(pedido.total || 0), 0);
  const productosCriticos = vehiculos.filter(vehiculo => Number(vehiculo.stock) <= 1);

  const iniciarSesion = evento => {
    evento.preventDefault();
    if (!usuario.trim() || clave !== 'AutoMaster2026!') { establecerMensaje('Revisa el usuario y la contraseña de demostración.'); establecerTipoMensaje('danger'); return; }
    sessionStorage.setItem('automaster_react_auth', 'true'); establecerSesionIniciada(true); establecerMensaje('');
  };

  const actualizarPedidos = () => establecerPedidos(cargarRegistros(localStorage, CLAVE_PEDIDOS));
  const guardarPerfil = evento => {
    evento.preventDefault(); localStorage.setItem('automaster_react_admin_profile', JSON.stringify(perfil)); establecerPerfilGuardado('Perfil actualizado.');
  };

  if (!sesionIniciada) return <section className="section section-alt"><div className="container"><div className="section-heading"><span className="eyebrow">Área privada</span><h1>Acceso de funcionarios</h1><p>Ingresa para administrar los registros de la tienda.</p></div><form className="contact-form mx-auto" onSubmit={iniciarSesion}><div className="form-group"><label htmlFor="admin-user">Usuario</label><input className="form-control" id="admin-user" autoComplete="username" value={usuario} onChange={evento => establecerUsuario(evento.target.value)} required /></div><div className="form-group"><label htmlFor="admin-password">Contraseña</label><input className="form-control" id="admin-password" type="password" autoComplete="current-password" value={clave} onChange={evento => establecerClave(evento.target.value)} required /></div><button className="btn btn-primary btn-full" type="submit">Ingresar</button><MensajeEstado mensaje={mensaje} varianteEstilo={tipoMensaje}/><p className="help-text mt-3">Acceso académico: usa cualquier usuario y la contraseña <code>AutoMaster2026!</code>. No es una autenticación segura.</p></form></div></section>;

  return <section className="section admin-section"><div className="container">
    <div className="admin-heading"><div><span className="eyebrow">Administración</span><h1>Panel de administración</h1><p>Secciones solicitadas para gestionar la tienda.</p></div><button className="btn btn-outline-danger" onClick={() => { sessionStorage.removeItem('automaster_react_auth'); establecerSesionIniciada(false); establecerUsuario(''); establecerClave(''); }}>Cerrar sesión</button></div>
    <div className="admin-layout"><aside className="admin-sidebar"><h2 className="h6">Menú</h2><div className="list-group">{SECCIONES.map(([id, titulo]) => <button key={id} className={`list-group-item list-group-item-action ${seccion === id ? 'active' : ''}`} aria-current={seccion === id ? 'page' : undefined} onClick={() => { establecerSeccion(id); actualizarPedidos(); }}>{titulo}</button>)}</div></aside>
      <div className="admin-content">
        {seccion === 'inicio' && <><h2 className="h3">Dashboard</h2><p>Resumen general del catálogo y de las compras registradas.</p><div className="admin-metrics"><article><span>Productos</span><strong>{vehiculos.length}</strong></article><article><span>Categorías</span><strong>{categorias.length}</strong></article><article><span>Usuarios</span><strong>{cargarRegistros(localStorage, 'automaster_react_accounts').length}</strong></article><article><span>Órdenes</span><strong>{pedidos.length}</strong></article></div></>}
        {seccion === 'ordenes' && <section><div className="d-flex justify-content-between align-items-center flex-wrap gap-2"><div><h2 className="h3">Órdenes / Boletas</h2><p>Compras aprobadas en la demostración.</p></div><button className="btn btn-outline-secondary" onClick={actualizarPedidos}>Actualizar</button></div>{pedidos.length ? <div className="table-responsive"><table className="table table-striped align-middle"><thead><tr><th>Boleta</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Acción</th></tr></thead><tbody>{pedidos.map(pedido => <tr key={pedido.orderNumber}><td>{pedido.orderNumber}</td><td>{pedido.customer?.name}<br/><small>{pedido.customer?.email}</small></td><td>{pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString('es-CL') : '—'}</td><td>{formatearMoneda(pedido.total)}</td><td><button className="btn btn-sm btn-outline-secondary" onClick={() => establecerPedidoConsultado(pedido)}>Ver boleta</button></td></tr>)}</tbody></table></div> : <p className="alert alert-secondary">Todavía no hay órdenes aprobadas.</p>}{pedidoConsultado && <div className="border rounded-3 p-3 mt-3"><div className="d-flex justify-content-between"><h3 className="h6">Boleta {pedidoConsultado.orderNumber}</h3><button className="btn-close" aria-label="Cerrar boleta" onClick={() => establecerPedidoConsultado(null)} /></div><p>{pedidoConsultado.customer?.name} · {pedidoConsultado.customer?.email}</p>{pedidoConsultado.items?.map(item => <div className="d-flex justify-content-between border-top py-2" key={item.vehicleId}><span>{item.name} × {item.quantity}</span><strong>{formatearMoneda(item.price * item.quantity)}</strong></div>)}<div className="d-flex justify-content-between border-top pt-2"><strong>Total</strong><strong>{formatearMoneda(pedidoConsultado.total)}</strong></div></div>}</section>}
        {seccion === 'productos' && <><h2 className="h3">Productos</h2><InventarioVehiculos vehiculos={vehiculos} establecerVehiculos={establecerVehiculos} categorias={categorias}/></>}
        {seccion === 'categorias' && <><h2 className="h3">Categorías</h2><ModuloAdministrativo tipo="categorias" categorias={categorias} establecerCategorias={establecerCategorias} vehiculos={vehiculos}/></>}
        {seccion === 'usuarios' && <><h2 className="h3">Usuarios</h2><ModuloAdministrativo tipo="usuarios" categorias={categorias} establecerCategorias={establecerCategorias} vehiculos={vehiculos}/></>}
        {seccion === 'reportes' && <section><h2 className="h3">Reportes</h2><div className="admin-metrics"><article><span>Ventas registradas</span><strong>{pedidos.length}</strong></article><article><span>Total vendido</span><strong>{formatearMoneda(totalVentas)}</strong></article><article><span>Productos con stock bajo</span><strong>{productosCriticos.length}</strong></article><article><span>Usuarios registrados</span><strong>{cargarRegistros(localStorage, 'automaster_react_accounts').length}</strong></article></div><h3 className="h6 mt-4">Productos que requieren reposición</h3><ul>{productosCriticos.length ? productosCriticos.map(vehiculo => <li key={vehiculo.id}>{vehiculo.name}: {vehiculo.stock} unidad(es)</li>) : <li>No hay productos con stock bajo.</li>}</ul></section>}
        {seccion === 'perfil' && <section><h2 className="h3">Perfil</h2><form className="contact-form" onSubmit={guardarPerfil}><div className="form-group"><label htmlFor="perfil-nombre">Nombre</label><input id="perfil-nombre" className="form-control" value={perfil.name} onChange={evento => establecerPerfil(actual => ({ ...actual, name: evento.target.value }))} required /></div><div className="form-group"><label htmlFor="perfil-correo">Correo</label><input id="perfil-correo" type="email" className="form-control" value={perfil.email} onChange={evento => establecerPerfil(actual => ({ ...actual, email: evento.target.value }))} required /></div><button className="btn btn-primary" type="submit">Guardar perfil</button><MensajeEstado mensaje={perfilGuardado} varianteEstilo="success"/></form></section>}
      </div>
    </div>
    <p className="help-text mt-3">Los registros se guardan en el navegador de este equipo. El proyecto utiliza datos de demostración y no tiene backend.</p>
  </div></section>;
}
