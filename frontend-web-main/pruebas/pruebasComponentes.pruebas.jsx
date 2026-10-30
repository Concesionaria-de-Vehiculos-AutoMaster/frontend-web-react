import React, { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import ListaVehiculos from '../src/componentes/vehiculos/ListaVehiculos.jsx';
import TarjetaVehiculo from '../src/componentes/vehiculos/TarjetaVehiculo.jsx';
import BotonAccion from '../src/componentes/comunes/BotonAccion.jsx';
import MensajeEstado from '../src/componentes/comunes/MensajeEstado.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const VEHICULOS_PRUEBA = [
  { id: 1, name: 'Auto Demo', category: 'auto', tag: 'Sedán', motor: '1.6', detail: 'Automático', price: 10000000, stock: 1, image: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' },
  { id: 2, name: 'Moto Demo', category: 'moto', tag: 'Urbana', motor: '250 cc', detail: 'Manual', price: 3000000, stock: 2, image: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' }
];
const CATEGORIAS_PRUEBA = [{ id: 'auto', title: 'Autos' }, { id: 'moto', title: 'Motos' }];

describe('Componentes React de AutoMaster', () => {
  let contenedorPruebas;
  let raizPruebas;

  beforeEach(() => {
    contenedorPruebas = document.createElement('div');
    document.body.appendChild(contenedorPruebas);
    raizPruebas = createRoot(contenedorPruebas);
  });

  afterEach(async () => {
    if (raizPruebas) await act(async () => raizPruebas.unmount());
    contenedorPruebas?.remove();
  });

  it('1. renderiza todos los vehículos recibidos por props', async () => {
    await act(async () => raizPruebas.render(<ListaVehiculos vehiculos={VEHICULOS_PRUEBA} categorias={CATEGORIAS_PRUEBA} alSeleccionarVehiculo={() => {}} alAgregarAlCarrito={() => {}} />));
    expect(contenedorPruebas.textContent).toContain('Auto Demo');
    expect(contenedorPruebas.textContent).toContain('Moto Demo');
    expect(contenedorPruebas.querySelectorAll('.vehicle-card')).toHaveLength(2);
  });

  it('2. utiliza la función de selección que recibe por props', async () => {
    const alSeleccionarVehiculo = vi.fn();
    await act(async () => raizPruebas.render(<ListaVehiculos vehiculos={VEHICULOS_PRUEBA} categorias={CATEGORIAS_PRUEBA} alSeleccionarVehiculo={alSeleccionarVehiculo} alAgregarAlCarrito={() => {}} />));
    const boton = contenedorPruebas.querySelector('.vehicle-image-button');
    await act(async () => boton.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(alSeleccionarVehiculo).toHaveBeenCalledTimes(1);
    expect(alSeleccionarVehiculo).toHaveBeenCalledWith(VEHICULOS_PRUEBA[0]);
  });

  it('3. actualiza el estado de búsqueda y filtra la lista', async () => {
    await act(async () => raizPruebas.render(<ListaVehiculos vehiculos={VEHICULOS_PRUEBA} categorias={CATEGORIAS_PRUEBA} alSeleccionarVehiculo={() => {}} alAgregarAlCarrito={() => {}} />));
    const campo = contenedorPruebas.querySelector('input[type="search"]');
    const establecerValor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    await act(async () => { establecerValor.call(campo, 'Moto'); campo.dispatchEvent(new Event('input', { bubbles: true })); });
    expect(contenedorPruebas.textContent).toContain('Moto Demo');
    expect(contenedorPruebas.textContent).not.toContain('Auto Demo');
    expect(contenedorPruebas.querySelectorAll('.vehicle-card')).toHaveLength(1);
  });

  it('4. muestra un mensaje de error solo cuando recibe contenido', async () => {
    await act(async () => raizPruebas.render(<MensajeEstado varianteEstilo="danger" mensaje="Campo requerido" />));
    expect(contenedorPruebas.textContent).toContain('Campo requerido');
    expect(contenedorPruebas.querySelector('[role="alert"]')).not.toBeNull();
    await act(async () => raizPruebas.render(<MensajeEstado varianteEstilo="danger" mensaje="" />));
    expect(contenedorPruebas.querySelector('[role="alert"]')).toBeNull();
  });

  it('5. recibe la etiqueta y ejecuta el evento del botón por props', async () => {
    const alHacerClic = vi.fn();
    await act(async () => raizPruebas.render(<BotonAccion onClick={alHacerClic} varianteEstilo="primary">Guardar prueba</BotonAccion>));
    const boton = contenedorPruebas.querySelector('button');
    expect(boton.textContent).toContain('Guardar prueba');
    await act(async () => boton.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(alHacerClic).toHaveBeenCalledTimes(1);
  });

  it('6. filtra los productos al seleccionar una categoría', async () => {
    await act(async () => raizPruebas.render(<ListaVehiculos vehiculos={VEHICULOS_PRUEBA} categorias={CATEGORIAS_PRUEBA} alSeleccionarVehiculo={() => {}} alAgregarAlCarrito={() => {}} />));
    const botonMotos = [...contenedorPruebas.querySelectorAll('.catalog-filter')].find(boton => boton.textContent === 'Motos');
    await act(async () => botonMotos.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(contenedorPruebas.textContent).toContain('Moto Demo');
    expect(contenedorPruebas.textContent).not.toContain('Auto Demo');
  });

  it('7. muestra el mensaje de lista vacía cuando no hay productos', async () => {
    await act(async () => raizPruebas.render(<ListaVehiculos vehiculos={[]} categorias={CATEGORIAS_PRUEBA} alSeleccionarVehiculo={() => {}} alAgregarAlCarrito={() => {}} />));
    expect(contenedorPruebas.textContent).toContain('No encontramos vehículos');
  });

  it('8. deshabilita agregar al carrito si el producto no tiene stock', async () => {
    const vehiculoSinStock = { ...VEHICULOS_PRUEBA[0], stock: 0 };
    await act(async () => raizPruebas.render(<TarjetaVehiculo vehiculo={vehiculoSinStock} alAgregarAlCarrito={vi.fn()} alSeleccionarVehiculo={() => {}} />));
    const botonAgregar = [...contenedorPruebas.querySelectorAll('button')].find(boton => boton.textContent.includes('Agregar al carrito'));
    expect(botonAgregar.disabled).toBe(true);
  });

  it('9. muestra el precio rebajado cuando el producto está en oferta', async () => {
    const vehiculoEnOferta = { ...VEHICULOS_PRUEBA[0], offerPercent: 10 };
    await act(async () => raizPruebas.render(<TarjetaVehiculo vehiculo={vehiculoEnOferta} alAgregarAlCarrito={() => {}} alSeleccionarVehiculo={() => {}} />));
    expect(contenedorPruebas.textContent).toContain('-10%');
    expect(contenedorPruebas.textContent).toContain('9.000.000');
  });

  it('10. respeta la propiedad disabled del botón reutilizable', async () => {
    const alHacerClic = vi.fn();
    await act(async () => raizPruebas.render(<BotonAccion disabled onClick={alHacerClic}>No disponible</BotonAccion>));
    const boton = contenedorPruebas.querySelector('button');
    expect(boton.disabled).toBe(true);
    await act(async () => boton.click());
    expect(alHacerClic).not.toHaveBeenCalled();
  });
});
