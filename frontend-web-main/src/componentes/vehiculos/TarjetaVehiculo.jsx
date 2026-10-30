import React from 'react';

export function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(valor) || 0);
}

export function calcularPrecioVehiculo(vehiculo) {
  return vehiculo.offerPercent ? Math.round(Number(vehiculo.price) * (1 - Number(vehiculo.offerPercent) / 100)) : Number(vehiculo.price) || 0;
}

export default function TarjetaVehiculo({ vehiculo, alSeleccionarVehiculo, alAgregarAlCarrito }) {
  const precioActual = calcularPrecioVehiculo(vehiculo);
  return <article className="vehicle-card h-100">
    <button className="vehicle-image-button" onClick={() => alSeleccionarVehiculo?.(vehiculo)} aria-label={`Ver detalle de ${vehiculo.name}`}><img src={vehiculo.image} alt={vehiculo.name} loading="lazy" /></button>
    <div className="vehicle-content"><div className="vehicle-topline"><span className="vehicle-tag">{vehiculo.tag || vehiculo.category}</span><span>{vehiculo.stock > 0 ? `Stock: ${vehiculo.stock}` : 'Sin stock'}</span></div>
      <h2>{vehiculo.name}</h2><ul><li><strong>Motor:</strong> {vehiculo.motor || 'Por especificar'}</li><li>{vehiculo.detail || 'Consulta por más información'}</li></ul>
      <div className="vehicle-price-block">{vehiculo.offerPercent > 0 && <span className="old-price">{formatearMoneda(vehiculo.price)}</span>}<strong>{formatearMoneda(precioActual)}</strong>{vehiculo.offerPercent > 0 && <span className="offer-label">-{vehiculo.offerPercent}%</span>}</div>
      <div className="vehicle-actions mt-3"><button className="btn btn-primary" onClick={() => alAgregarAlCarrito?.(vehiculo)} disabled={vehiculo.stock <= 0}>Agregar al carrito</button><button className="btn btn-outline-secondary" onClick={() => alSeleccionarVehiculo?.(vehiculo)}>Ver detalle</button></div>
    </div>
  </article>;
}
