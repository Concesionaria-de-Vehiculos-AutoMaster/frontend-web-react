import React from 'react';

export default function BotonAccion({ children: contenido, onClick: alHacerClic, type: tipo = 'button', varianteEstilo = 'primary', disabled: deshabilitado = false, className: clasesCSS = '', ...propiedadesRecibidas }) {
  return (
    <button type={tipo} onClick={alHacerClic} disabled={deshabilitado} className={`btn btn-${varianteEstilo} ${clasesCSS}`.trim()} {...propiedadesRecibidas}>
      {contenido}
    </button>
  );
}
