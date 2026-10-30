import React, { useState } from 'react';
import { leerJsonSeguro } from '../datos/operacionesCrud.js';
import MensajeEstado from '../componentes/comunes/MensajeEstado.jsx';

export default function PaginaContacto() {
  const [formulario, establecerFormulario] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, establecerEnviado] = useState(false);
  const actualizarCampo = evento => establecerFormulario(actual => ({ ...actual, [evento.target.name]: evento.target.value }));
  const enviarFormulario = evento => {
    evento.preventDefault();
    const solicitudes = leerJsonSeguro(localStorage, 'automaster_react_requests', []);
    localStorage.setItem('automaster_react_requests', JSON.stringify([...solicitudes, { ...formulario, fecha: new Date().toISOString() }]));
    establecerFormulario({ nombre: '', email: '', mensaje: '' });
    establecerEnviado(true);
  };
  return <section className="section section-alt" id="contacto"><div className="container"><div className="section-heading"><span className="eyebrow">Contacto</span><h1>Contáctanos</h1><p>Completa el formulario y guardaremos tu consulta en este navegador como parte de la demostración.</p></div><form className="contact-form mx-auto" onSubmit={enviarFormulario}>
    <div className="form-group"><label htmlFor="contacto-nombre">Nombre completo *</label><input className="form-control" id="contacto-nombre" name="nombre" required value={formulario.nombre} onChange={actualizarCampo}/></div>
    <div className="form-group"><label htmlFor="contacto-email">Correo electrónico *</label><input className="form-control" id="contacto-email" name="email" type="email" required value={formulario.email} onChange={actualizarCampo}/></div>
    <div className="form-group"><label htmlFor="contacto-mensaje">Mensaje *</label><textarea className="form-control" id="contacto-mensaje" name="mensaje" rows="4" required value={formulario.mensaje} onChange={actualizarCampo}/></div>
    <button className="btn btn-primary btn-full" type="submit">Enviar consulta</button>
    <MensajeEstado varianteEstilo="success" mensaje={enviado ? 'La consulta se guardó correctamente en este navegador. No se envió un correo real.' : ''}/>
  </form></div></section>;
}
