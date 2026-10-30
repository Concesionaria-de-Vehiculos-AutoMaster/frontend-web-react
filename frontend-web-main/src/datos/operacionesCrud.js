/** Operaciones CRUD reutilizables. storage puede ser localStorage o un adaptador de prueba. */
export function cargarRegistros(almacenamiento, clave) {
  try {
    const datosAnalizados = JSON.parse(almacenamiento.getItem(clave) || '[]');
    return Array.isArray(datosAnalizados) ? datosAnalizados : [];
  } catch {
    return [];
  }
}

export function crearRegistro(registros, valores, generarIdentificador = () => Date.now()) {
  return [...registros, { id: generarIdentificador(), ...valores, createdAt: new Date().toISOString() }];
}

export function actualizarRegistro(registros, identificador, valores) {
  return registros.map(registro => registro.id === identificador
    ? { ...registro, ...valores, updatedAt: new Date().toISOString() }
    : registro);
}

export function eliminarRegistro(registros, identificador) {
  return registros.filter(registro => registro.id !== identificador);
}

export function guardarRegistros(almacenamiento, clave, registros) {
  try {
    almacenamiento.setItem(clave, JSON.stringify(registros));
    return true;
  } catch {
    return false;
  }
}

export function leerJsonSeguro(almacenamiento, clave, valorAlternativo = []) {
  try {
    const valor = JSON.parse(almacenamiento.getItem(clave) || 'null');
    return valor == null ? valorAlternativo : valor;
  } catch {
    return valorAlternativo;
  }
}
