import React from 'react';

const ENLACES_PIE_PAGINA = [['catalogo','Catálogo'],['ofertas','Ofertas'],['categorias','Categorías'],['contacto','Contacto'],['funcionarios','Área funcionarios']];
export default function PiePagina({ navegar }) {
  return <footer className="site-footer"><div className="container footer-inner">
    <div><strong>AutoMaster</strong><p>Concesionaria y gestión automotriz.</p><small>Prototipo académico con datos de demostración.</small></div>
    <div className="d-flex flex-wrap gap-2">{ENLACES_PIE_PAGINA.map(([clave, etiqueta]) => <button key={clave} className="btn btn-link" onClick={() => navegar(clave)}>{etiqueta}</button>)}</div>
    <small>© {new Date().getFullYear()} AutoMaster · Proyecto académico</small>
  </div></footer>;
}
