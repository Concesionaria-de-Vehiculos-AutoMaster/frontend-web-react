import React from 'react';
export default function PaginaCategorias({ vehiculos, categorias, navegar }) {
  return <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">Explora por tipo</span><h1>Categorías de vehículos</h1><p>Selecciona una categoría para ver sus modelos.</p></div><div className="category-grid">{categorias.map(categoria => {
    const cantidad = vehiculos.filter(vehiculo => vehiculo.category === categoria.id).length;
    return <article className="category-card" key={categoria.id}><span className="category-icon" aria-hidden="true">{categoria.icon || '🚘'}</span><h2>{categoria.title}</h2><p>{categoria.description}</p><p className="text-secondary">{cantidad} modelo(s)</p><button className="btn btn-primary" onClick={() => navegar('categoria-detalle', { category: categoria.id })}>Ver categoría</button></article>;
  })}</div></div></section>;
}
