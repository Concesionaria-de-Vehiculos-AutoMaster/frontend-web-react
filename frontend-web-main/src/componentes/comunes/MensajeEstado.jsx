import React from 'react';

export default function MensajeEstado({ mensaje, varianteEstilo = 'info', title: titulo, role: rolAccesibilidad }) {
  if (!mensaje) return null;
  const variantesPermitidas = ['success', 'danger', 'warning', 'info', 'secondary'];
  const estiloAlerta = variantesPermitidas.includes(varianteEstilo) ? varianteEstilo : 'info';
  return (
    <div className={`alert alert-${estiloAlerta}`} role={rolAccesibilidad || (estiloAlerta === 'danger' ? 'alert' : 'status')}>
      {titulo && <strong className="d-block">{titulo}</strong>}
      {mensaje}
    </div>
  );
}
