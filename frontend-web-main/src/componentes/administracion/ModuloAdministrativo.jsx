import React, { useEffect, useState } from 'react';
import { crearRegistro, actualizarRegistro, eliminarRegistro, cargarRegistros, guardarRegistros } from '../../datos/operacionesCrud.js';
import MensajeEstado from '../comunes/MensajeEstado.jsx';

const CLAVE_USUARIOS = 'automaster_react_accounts';

/** CRUD mínimo para las dos entidades que aparecen en el flujo administrativo: categorías y usuarios. */
export default function ModuloAdministrativo({ tipo, categorias, establecerCategorias, vehiculos }) {
  const esModuloCategorias = tipo === 'categorias';
  const [usuarios, establecerUsuarios] = useState(() => cargarRegistros(localStorage, CLAVE_USUARIOS).map((usuario, indice) => ({ ...usuario, id: usuario.id ?? `usuario-${indice + 1}` })));
  const [formulario, establecerFormulario] = useState({});
  const [identificadorEnEdicion, establecerIdentificadorEnEdicion] = useState(null);
  const [mensaje, establecerMensaje] = useState('');
  const [error, establecerError] = useState('');
  const [usuarioConsultado, establecerUsuarioConsultado] = useState(null);
  const [pedidos, establecerPedidos] = useState(() => cargarRegistros(localStorage, 'automaster_react_orders'));

  const registros = esModuloCategorias ? categorias : usuarios;
  const establecerRegistros = esModuloCategorias ? establecerCategorias : establecerUsuarios;
  const campos = esModuloCategorias
    ? [{ clave: 'title', etiqueta: 'Nombre de categoría', requerido: true }, { clave: 'description', etiqueta: 'Descripción', requerido: true }]
    : [{ clave: 'name', etiqueta: 'Nombre completo', requerido: true }, { clave: 'email', etiqueta: 'Correo electrónico', requerido: true, tipo: 'email' }, { clave: 'phone', etiqueta: 'Teléfono', requerido: true }, { clave: 'password', etiqueta: 'Contraseña de demostración', requerido: identificadorEnEdicion === null, tipo: 'password' }];

  useEffect(() => {
    if (!esModuloCategorias) guardarRegistros(localStorage, CLAVE_USUARIOS, usuarios);
  }, [esModuloCategorias, usuarios]);

  const cambiarCampo = evento => establecerFormulario(actual => ({ ...actual, [evento.target.name]: evento.target.value }));
  const cancelarEdicion = () => { establecerIdentificadorEnEdicion(null); establecerFormulario({}); establecerError(''); };
  const enviarFormulario = evento => {
    evento.preventDefault();
    const valores = Object.fromEntries(campos.map(campo => [campo.clave, String(formulario[campo.clave] || '').trim()]));
    const campoVacio = campos.find(campo => campo.requerido && !valores[campo.clave]);
    if (campoVacio) { establecerError(`Completa el campo ${campoVacio.etiqueta}.`); establecerMensaje(''); return; }
    if (!esModuloCategorias && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email)) { establecerError('Ingresa un correo válido.'); return; }
    const campoUnico = esModuloCategorias ? 'title' : 'email';
    const valorUnico = (valores[campoUnico] || '').toLowerCase();
    if (registros.some(registro => registro.id !== identificadorEnEdicion && String(registro[campoUnico] || '').toLowerCase() === valorUnico)) { establecerError(`Ya existe un registro con ese ${esModuloCategorias ? 'nombre' : 'correo'}.`); return; }
    if (esModuloCategorias) {
      const slug = valores.title.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (identificadorEnEdicion === null && categorias.some(categoria => categoria.id === slug)) { establecerError('Ya existe una categoría con ese nombre.'); return; }
      const valoresCategoria = { ...valores, ...(identificadorEnEdicion === null ? { id: slug || `categoria-${Date.now()}`, icon: '🚘' } : {}) };
      establecerRegistros(actuales => identificadorEnEdicion === null ? crearRegistro(actuales, valoresCategoria, () => valoresCategoria.id) : actualizarRegistro(actuales, identificadorEnEdicion, valores));
    } else {
      const valoresUsuario = { ...valores };
      if (identificadorEnEdicion !== null && !valoresUsuario.password) delete valoresUsuario.password;
      establecerRegistros(actuales => identificadorEnEdicion === null ? crearRegistro(actuales, valoresUsuario) : actualizarRegistro(actuales, identificadorEnEdicion, valoresUsuario));
      establecerPedidos(cargarRegistros(localStorage, 'automaster_react_orders'));
    }
    cancelarEdicion(); establecerMensaje(identificadorEnEdicion === null ? 'Registro creado correctamente.' : 'Registro actualizado correctamente.');
  };

  const editarRegistro = registro => {
    establecerFormulario(esModuloCategorias ? { title: registro.title, description: registro.description } : { name: registro.name || '', email: registro.email || '', phone: registro.phone || '', password: '' });
    establecerIdentificadorEnEdicion(registro.id); establecerError(''); establecerMensaje(''); establecerUsuarioConsultado(null);
  };
  const borrarRegistro = registro => {
    if (esModuloCategorias && vehiculos.some(vehiculo => vehiculo.category === registro.id)) { establecerError('No puedes eliminar una categoría que tiene productos asociados.'); return; }
    if (!window.confirm('¿Eliminar este registro?')) return;
    establecerRegistros(actuales => eliminarRegistro(actuales, registro.id));
    if (identificadorEnEdicion === registro.id) cancelarEdicion();
    establecerMensaje('Registro eliminado.'); establecerError('');
  };

  const historialUsuario = usuarioConsultado ? pedidos.filter(pedido => usuarioConsultado.id != null && pedido.customer?.id != null ? String(pedido.customer.id) === String(usuarioConsultado.id) : pedido.customer?.email?.toLowerCase() === usuarioConsultado.email.toLowerCase()) : [];

  return <div className="vstack gap-3">
    <p className="text-secondary">{esModuloCategorias ? 'Crea, consulta, edita y elimina categorías del catálogo.' : 'Crea, consulta y actualiza usuarios registrados; también puedes revisar sus compras.'} Los cambios se guardan localmente.</p>
    <form className="border rounded-3 p-3 bg-light" onSubmit={enviarFormulario} noValidate>
      <h3 className="h6">{identificadorEnEdicion === null ? `Nuevo ${esModuloCategorias ? 'categoría' : 'usuario'}` : `Editar ${esModuloCategorias ? 'categoría' : 'usuario'}`}</h3>
      <div className="row g-3">{campos.map(campo => <div className="col-md-6" key={campo.clave}><label className="form-label" htmlFor={`registro-${tipo}-${campo.clave}`}>{campo.etiqueta}{campo.requerido ? ' *' : ''}</label><input id={`registro-${tipo}-${campo.clave}`} className="form-control" name={campo.clave} type={campo.tipo || 'text'} required={campo.requerido} value={formulario[campo.clave] || ''} onChange={cambiarCampo} /></div>)}</div>
      {!esModuloCategorias && identificadorEnEdicion !== null && <small className="text-secondary">Deja la contraseña vacía si no deseas modificarla.</small>}
      <div className="d-flex gap-2 mt-3"><button className="btn btn-primary" type="submit">{identificadorEnEdicion === null ? 'Guardar' : 'Guardar cambios'}</button>{identificadorEnEdicion !== null && <button className="btn btn-outline-secondary" type="button" onClick={cancelarEdicion}>Cancelar</button>}</div>
    </form>
    <MensajeEstado mensaje={error} varianteEstilo="danger"/><MensajeEstado mensaje={mensaje} varianteEstilo="success"/>
    <div className="table-responsive"><table className="table table-striped align-middle"><thead><tr>{(esModuloCategorias ? ['Categoría', 'Descripción'] : ['Nombre', 'Correo', 'Teléfono']).map(titulo => <th key={titulo}>{titulo}</th>)}<th>Acciones</th></tr></thead><tbody>
      {registros.map(registro => <tr key={registro.id}><td>{esModuloCategorias ? registro.title : registro.name}</td>{esModuloCategorias ? <td>{registro.description}</td> : <><td>{registro.email}</td><td>{registro.phone}</td></>}<td><div className="d-flex flex-wrap gap-2">{!esModuloCategorias && <button className="btn btn-sm btn-outline-secondary" onClick={() => { establecerUsuarioConsultado(registro); establecerPedidos(cargarRegistros(localStorage, 'automaster_react_orders')); }}>Historial</button>}<button className="btn btn-sm btn-outline-primary" onClick={() => editarRegistro(registro)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => borrarRegistro(registro)}>Eliminar</button></div></td></tr>)}
      {registros.length === 0 && <tr><td colSpan={esModuloCategorias ? 3 : 4}>No hay registros todavía.</td></tr>}
    </tbody></table></div>
    {usuarioConsultado && <section className="border rounded-3 p-3"><div className="d-flex align-items-center justify-content-between gap-2"><h3 className="h6">Historial de compras: {usuarioConsultado.name}</h3><button className="btn-close" aria-label="Cerrar historial" onClick={() => establecerUsuarioConsultado(null)} /></div>{historialUsuario.length ? historialUsuario.map(pedido => <div className="d-flex justify-content-between border-top py-2" key={pedido.orderNumber}><span>{pedido.orderNumber} · {new Date(pedido.createdAt).toLocaleDateString('es-CL')}</span><strong>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(pedido.total)}</strong></div>) : <p className="mb-0">Este usuario no tiene compras registradas.</p>}</section>}
  </div>;
}
