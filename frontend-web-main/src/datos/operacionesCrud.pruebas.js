import { beforeEach, describe, expect, it } from 'vitest';
import { crearRegistro, eliminarRegistro, cargarRegistros, guardarRegistros, actualizarRegistro, leerJsonSeguro } from './operacionesCrud.js';

describe('Operaciones CRUD de AutoMaster', () => {
  let almacenamiento;
  beforeEach(() => {
    const valores = new Map();
    almacenamiento = {
      getItem: clave => valores.has(clave) ? valores.get(clave) : null,
      setItem: (clave, valor) => valores.set(clave, String(valor))
    };
  });

  it('carga una lista vacía si no existen datos guardados', () => {
    expect(cargarRegistros(almacenamiento, 'clientes')).toEqual([]);
  });

  it('guarda y recupera registros desde el almacenamiento', () => {
    const registros = [{ id: 1, name: 'Ana Pérez' }];
    guardarRegistros(almacenamiento, 'clientes', registros);
    expect(cargarRegistros(almacenamiento, 'clientes')).toEqual(registros);
  });

  it('crea un registro con identificador', () => {
    const registroCreado = crearRegistro([], { name: 'Ana Pérez' }, () => 123);
    expect(registroCreado.length).toBe(1);
    expect(registroCreado[0].id).toBe(123);
    expect(registroCreado[0].name).toBe('Ana Pérez');
  });

  it('actualiza solo el registro cuyo identificador coincide', () => {
    const registros = [{ id: 1, name: 'Ana' }, { id: 2, name: 'Luis' }];
    const registrosActualizados = actualizarRegistro(registros, 2, { name: 'Luis Soto' });
    expect(registrosActualizados[0].name).toBe('Ana');
    expect(registrosActualizados[1].name).toBe('Luis Soto');
  });

  it('elimina solo el registro seleccionado', () => {
    const registrosRestantes = eliminarRegistro([{ id: 1 }, { id: 2 }], 1);
    expect(registrosRestantes).toEqual([{ id: 2 }]);
  });

  it('devuelve una lista vacía cuando el JSON guardado está corrupto', () => {
    const almacenamientoConDatosCorruptos = { getItem: () => '{esto no es json' };
    expect(cargarRegistros(almacenamientoConDatosCorruptos, 'clientes')).toEqual([]);
  });

  it('informa cuando no se pudo persistir por un error del almacenamiento', () => {
    const almacenamientoConError = { setItem: () => { throw new Error('quota'); } };
    expect(guardarRegistros(almacenamientoConError, 'clientes', [])).toBe(false);
  });


  it('lee un objeto JSON válido desde el almacenamiento', () => {
    const almacenamientoConPerfil = { getItem: () => '{"nombre":"Ana"}' };
    expect(leerJsonSeguro(almacenamientoConPerfil, 'perfil', {})).toEqual({ nombre: 'Ana' });
  });

  it('devuelve el valor alternativo si el JSON no se puede leer', () => {
    const almacenamientoConDatosCorruptos = { getItem: () => '{dato inválido' };
    expect(leerJsonSeguro(almacenamientoConDatosCorruptos, 'perfil', {})).toEqual({});
  });

  it('devuelve el valor alternativo si el almacenamiento no está disponible', () => {
    const almacenamientoNoDisponible = { getItem: () => { throw new Error('storage unavailable'); } };
    expect(leerJsonSeguro(almacenamientoNoDisponible, 'perfil', {})).toEqual({});
  });

});
