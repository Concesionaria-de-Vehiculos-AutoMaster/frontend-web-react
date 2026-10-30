import React, { useState } from 'react';
import MensajeEstado from '../componentes/comunes/MensajeEstado.jsx';
import { leerJsonSeguro } from '../datos/operacionesCrud.js';

const CAMPOS_CLIENTE = ['id', 'name', 'email', 'phone', 'address', 'region', 'commune'];
function obtenerPerfilDesdeCuenta(cuentaUsuario) {
  return Object.fromEntries(CAMPOS_CLIENTE.map(clave => [clave, cuentaUsuario[clave] || (clave === 'region' ? 'Región Metropolitana' : '')]));
}

export function PaginaInicioSesion({ navegar }) {
  const [formulario, establecerFormulario] = useState({ email: '', password: '' });
  const [mensaje, establecerMensaje] = useState('');
  const [varianteEstilo, establecerVarianteEstilo] = useState('danger');
  const [sesionIniciada, establecerSesionIniciada] = useState(false);
  const enviarFormulario = evento => {
    evento.preventDefault();
    const cuentasGuardadas = leerJsonSeguro(localStorage, 'automaster_react_accounts', []);
    const cuentaUsuario = cuentasGuardadas.find(elemento => elemento.email.toLowerCase() === formulario.email.trim().toLowerCase() && elemento.password === formulario.password);
    if (!cuentaUsuario) { establecerVarianteEstilo('danger'); establecerMensaje('No encontramos una cuenta con esos datos. Revisa tus credenciales o regístrate.'); establecerSesionIniciada(false); return; }
    sessionStorage.setItem('automaster_react_customer', JSON.stringify(obtenerPerfilDesdeCuenta(cuentaUsuario)));
    establecerVarianteEstilo('success'); establecerMensaje(`Bienvenido/a, ${cuentaUsuario.name}. Tus datos de contacto quedarán disponibles en el checkout.`); establecerSesionIniciada(true);
  };
  return <section className="section section-alt"><div className="container"><div className="section-heading"><span className="eyebrow">Mi cuenta</span><h1>Iniciar sesión</h1><p>Accede a la cuenta de demostración registrada en este navegador.</p></div><form className="contact-form mx-auto" onSubmit={enviarFormulario}>
    <div className="form-group"><label htmlFor="login-email">Correo electrónico</label><input id="login-email" className="form-control" type="email" autoComplete="email" required value={formulario.email} onChange={evento => establecerFormulario(estadoActual => ({ ...estadoActual, email: evento.target.value }))}/></div>
    <div className="form-group"><label htmlFor="login-password">Contraseña de demostración</label><input id="login-password" className="form-control" type="password" autoComplete="current-password" required value={formulario.password} onChange={evento => establecerFormulario(estadoActual => ({ ...estadoActual, password: evento.target.value }))}/></div>
    <button className="btn btn-primary btn-full" type="submit">Ingresar</button><MensajeEstado mensaje={mensaje} varianteEstilo={varianteEstilo}/>
    {sesionIniciada && <button className="btn btn-outline-primary btn-full mt-2" type="button" onClick={() => navegar('carrito')}>Continuar al carrito</button>}
    <p className="mt-3 mb-0">¿Aún no tienes cuenta? <button className="btn btn-link p-0 align-baseline" type="button" onClick={() => navegar('registro')}>Crear cuenta</button></p>
    <p className="help-text mt-3">Demostración local: las cuentas no se sincronizan con un servidor y no debes usar contraseñas personales.</p>
  </form></div></section>;
}

export function PaginaRegistro({ navegar }) {
  const [formulario, establecerFormulario] = useState({ name: '', email: '', phone: '', address: '', region: 'Región Metropolitana', commune: '', password: '', confirm: '' });
  const [mensaje, establecerMensaje] = useState('');
  const [varianteEstilo, establecerVarianteEstilo] = useState('danger');
  const cambiarCampo = evento => establecerFormulario(estadoActual => ({ ...estadoActual, [evento.target.name]: evento.target.value }));
  const enviarFormulario = evento => {
    evento.preventDefault();
    if (formulario.password.length < 6) { establecerVarianteEstilo('danger'); establecerMensaje('La contraseña de demostración debe tener al menos 6 caracteres.'); return; }
    if (formulario.password !== formulario.confirm) { establecerVarianteEstilo('danger'); establecerMensaje('Las contraseñas no coinciden.'); return; }
    const cuentasGuardadas = leerJsonSeguro(localStorage, 'automaster_react_accounts', []);
    if (cuentasGuardadas.some(cuentaUsuario => cuentaUsuario.email.toLowerCase() === formulario.email.trim().toLowerCase())) { establecerVarianteEstilo('danger'); establecerMensaje('Ya existe una cuenta con ese correo.'); return; }
    const cuentaUsuario = { id: Date.now(), ...obtenerPerfilDesdeCuenta(formulario), password: formulario.password, createdAt: new Date().toISOString() };
    localStorage.setItem('automaster_react_accounts', JSON.stringify([...cuentasGuardadas, cuentaUsuario]));
    establecerVarianteEstilo('success'); establecerMensaje('La cuenta se creó correctamente. Ahora puedes iniciar sesión y reutilizar tus datos en el checkout.');
    establecerFormulario({ name: '', email: '', phone: '', address: '', region: 'Región Metropolitana', commune: '', password: '', confirm: '' });
  };
  return <section className="section section-alt"><div className="container"><div className="section-heading"><span className="eyebrow">Únete a AutoMaster</span><h1>Crear una cuenta</h1><p>Completa los datos de prueba; nombre, contacto y dirección se pueden precargar en el checkout después de iniciar sesión.</p></div><form className="contact-form mx-auto" onSubmit={enviarFormulario}>
    <div className="form-group"><label htmlFor="register-name">Nombre completo *</label><input id="register-name" name="name" className="form-control" autoComplete="name" required value={formulario.name} onChange={cambiarCampo}/></div>
    <div className="form-group"><label htmlFor="register-email">Correo electrónico *</label><input id="register-email" name="email" className="form-control" type="email" autoComplete="email" required value={formulario.email} onChange={cambiarCampo}/></div>
    <div className="form-group"><label htmlFor="register-phone">Teléfono de contacto *</label><input id="register-phone" name="phone" className="form-control" autoComplete="tel" required value={formulario.phone} onChange={cambiarCampo} placeholder="+56 9 1234 5678"/></div>
    <div className="form-group"><label htmlFor="register-address">Dirección de referencia *</label><input id="register-address" name="address" className="form-control" autoComplete="street-address" minLength="5" required value={formulario.address} onChange={cambiarCampo}/></div>
    <div className="row g-3"><div className="col-md-6 form-group"><label htmlFor="register-region">Región</label><select id="register-region" name="region" className="form-select" value={formulario.region} onChange={cambiarCampo}><option>Región Metropolitana</option><option>Valparaíso</option><option>Biobío</option><option>La Araucanía</option><option>Los Lagos</option><option>Otra</option></select></div><div className="col-md-6 form-group"><label htmlFor="register-commune">Comuna *</label><input id="register-commune" name="commune" className="form-control" autoComplete="address-level2" required value={formulario.commune} onChange={cambiarCampo}/></div></div>
    <div className="form-group"><label htmlFor="register-password">Contraseña de demostración *</label><input id="register-password" name="password" className="form-control" type="password" autoComplete="new-password" minLength="6" required value={formulario.password} onChange={cambiarCampo}/></div>
    <div className="form-group"><label htmlFor="register-confirm">Confirmar contraseña *</label><input id="register-confirm" name="confirm" className="form-control" type="password" autoComplete="new-password" required value={formulario.confirm} onChange={cambiarCampo}/></div>
    <button className="btn btn-primary btn-full" type="submit">Crear cuenta</button><MensajeEstado mensaje={mensaje} varianteEstilo={varianteEstilo}/><p className="help-text mt-3">No ingreses una contraseña personal: esta aplicación guarda datos localmente solo para la demostración.</p><button className="btn btn-link px-0" type="button" onClick={() => navegar('login')}>Ya tengo cuenta</button>
  </form></div></section>;
}
