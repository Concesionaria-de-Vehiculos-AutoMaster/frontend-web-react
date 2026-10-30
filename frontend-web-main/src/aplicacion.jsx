import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilos.css';
import { VEHICULOS } from './datos/vehiculos.js';
import { CATEGORIAS_INICIALES } from './datos/categorias.js';
import { leerJsonSeguro } from './datos/operacionesCrud.js';
import Encabezado from './componentes/estructura/Encabezado.jsx';
import PiePagina from './componentes/estructura/PiePagina.jsx';
import PaginaInicio from './paginas/PaginaInicio.jsx';
import PaginaCatalogo from './paginas/PaginaCatalogo.jsx';
import PaginaCategorias from './paginas/PaginaCategorias.jsx';
import PaginaDetalleCategoria from './paginas/PaginaDetalleCategoria.jsx';
import PaginaDetalleVehiculo from './paginas/PaginaDetalleVehiculo.jsx';
import PaginaOfertas from './paginas/PaginaOfertas.jsx';
import PaginaCarrito from './paginas/PaginaCarrito.jsx';
import PaginaFinalizarCompra from './paginas/PaginaFinalizarCompra.jsx';
import PaginaResultadoCompra from './paginas/PaginaResultadoCompra.jsx';
import PaginaContacto from './paginas/PaginaContacto.jsx';
import { PaginaInicioSesion, PaginaRegistro } from './paginas/PaginasCuenta.jsx';
import { PaginaNosotros, PaginaListaBlog, PaginaDetalleBlog } from './paginas/PaginasContenido.jsx';
import PanelAdministracion from './componentes/administracion/PanelAdministracion.jsx';

function leerRuta() {
  const parametros = new URLSearchParams(window.location.search);
  return { pagina: parametros.get('page') || 'inicio', parametros: Object.fromEntries(parametros.entries()) };
}

function cargarVehiculosIniciales() {
  const guardados = leerJsonSeguro(localStorage, 'automaster_react_vehicles', null);
  if (!Array.isArray(guardados)) return VEHICULOS;
  return guardados.map(vehiculo => {
    const original = VEHICULOS.find(item => String(item.id) === String(vehiculo.id) || item.name === vehiculo.name);
    return { ...(original || {}), ...vehiculo, offerPercent: vehiculo.offerPercent ?? original?.offerPercent ?? 0 };
  });
}

function cargarCarritoInicial() {
  const guardado = leerJsonSeguro(localStorage, 'automaster_react_cart', []);
  return Array.isArray(guardado) ? guardado.filter(item => item && item.vehicleId && item.quantity > 0) : [];
}

function cargarCategoriasIniciales() {
  const guardadas = leerJsonSeguro(localStorage, 'automaster_react_categories', null);
  return Array.isArray(guardadas) ? guardadas : CATEGORIAS_INICIALES;
}

export function Aplicacion() {
  const [rutaActual, establecerRuta] = useState(leerRuta);
  const [vehiculos, establecerVehiculos] = useState(cargarVehiculosIniciales);
  const [categorias, establecerCategorias] = useState(cargarCategoriasIniciales);
  const [carrito, establecerCarrito] = useState(cargarCarritoInicial);
  const [ultimoPedido, establecerUltimoPedido] = useState(() => leerJsonSeguro(localStorage, 'automaster_react_last_order', null));

  useEffect(() => localStorage.setItem('automaster_react_vehicles', JSON.stringify(vehiculos)), [vehiculos]);
  useEffect(() => localStorage.setItem('automaster_react_categories', JSON.stringify(categorias)), [categorias]);
  useEffect(() => localStorage.setItem('automaster_react_cart', JSON.stringify(carrito)), [carrito]);
  useEffect(() => {
    const actualizarRuta = () => establecerRuta(leerRuta());
    window.addEventListener('popstate', actualizarRuta);
    return () => window.removeEventListener('popstate', actualizarRuta);
  }, []);

  const navegar = (paginaDestino, datosAdicionales = {}) => {
    const parametros = new URLSearchParams({ page: paginaDestino, ...Object.fromEntries(Object.entries(datosAdicionales).filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')) });
    window.history.pushState({}, '', `${window.location.pathname}?${parametros.toString()}`);
    establecerRuta({ pagina: paginaDestino, parametros: Object.fromEntries(parametros.entries()) });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const seleccionarVehiculo = vehiculo => navegar('detalle-producto', { vehicleId: vehiculo.id });
  const agregarAlCarrito = vehiculo => {
    establecerCarrito(actuales => {
      const stockDisponible = Math.max(0, Number(vehiculo.stock) || 0);
      if (stockDisponible < 1) return actuales;
      const existente = actuales.find(item => item.vehicleId === vehiculo.id);
      if (existente) return actuales.map(item => item.vehicleId === vehiculo.id ? { ...item, stock: stockDisponible, quantity: Math.min(stockDisponible, item.quantity + 1) } : item);
      const precio = vehiculo.offerPercent ? Math.round(Number(vehiculo.price) * (1 - Number(vehiculo.offerPercent) / 100)) : Number(vehiculo.price) || 0;
      return [...actuales, { vehicleId: vehiculo.id, name: vehiculo.name, image: vehiculo.image, price: precio, stock: stockDisponible, quantity: 1 }];
    });
  };

  const completarCompra = pedido => {
    establecerUltimoPedido(pedido);
    localStorage.setItem('automaster_react_last_order', JSON.stringify(pedido));
    if (pedido.status === 'approved') {
      const pedidosGuardados = leerJsonSeguro(localStorage, 'automaster_react_orders', []);
      localStorage.setItem('automaster_react_orders', JSON.stringify([...pedidosGuardados, pedido]));
      establecerVehiculos(actuales => actuales.map(vehiculo => {
        const comprado = pedido.items.find(item => String(item.vehicleId) === String(vehiculo.id));
        return comprado ? { ...vehiculo, stock: Math.max(0, Number(vehiculo.stock) - Number(comprado.quantity)) } : vehiculo;
      }));
      establecerCarrito([]);
    }
  };

  const propiedadesVehiculos = { vehiculos, categorias, alSeleccionarVehiculo: seleccionarVehiculo, alAgregarAlCarrito: agregarAlCarrito };
  let contenidoPagina;
  switch (rutaActual.pagina) {
    case 'catalogo': contenidoPagina = <PaginaCatalogo {...propiedadesVehiculos} />; break;
    case 'categorias': contenidoPagina = <PaginaCategorias vehiculos={vehiculos} categorias={categorias} navegar={navegar} />; break;
    case 'categoria-detalle': contenidoPagina = <PaginaDetalleCategoria categoria={categorias.find(item => item.id === rutaActual.parametros.category)} {...propiedadesVehiculos} navegar={navegar} />; break;
    case 'detalle-producto': contenidoPagina = <PaginaDetalleVehiculo vehiculo={vehiculos.find(item => String(item.id) === String(rutaActual.parametros.vehicleId))} navegar={navegar} alAgregarAlCarrito={agregarAlCarrito} />; break;
    case 'ofertas': contenidoPagina = <PaginaOfertas {...propiedadesVehiculos} />; break;
    case 'carrito': contenidoPagina = <PaginaCarrito carrito={carrito} establecerCarrito={establecerCarrito} navegar={navegar} />; break;
    case 'checkout': contenidoPagina = <PaginaFinalizarCompra carrito={carrito} navegar={navegar} alCompletarCompra={completarCompra} />; break;
    case 'compra-exitosa': contenidoPagina = <PaginaResultadoCompra type="success" pedido={ultimoPedido?.status === 'approved' ? ultimoPedido : null} navegar={navegar} />; break;
    case 'pago-error': contenidoPagina = <PaginaResultadoCompra type="failure" pedido={ultimoPedido?.status === 'rejected' ? ultimoPedido : null} navegar={navegar} />; break;
    case 'contacto': contenidoPagina = <PaginaContacto />; break;
    case 'registro': contenidoPagina = <PaginaRegistro navegar={navegar} />; break;
    case 'login': contenidoPagina = <PaginaInicioSesion navegar={navegar} />; break;
    case 'nosotros': contenidoPagina = <PaginaNosotros navegar={navegar} />; break;
    case 'blogs': contenidoPagina = <PaginaListaBlog navegar={navegar} />; break;
    case 'blog-detalle': contenidoPagina = <PaginaDetalleBlog identificadorArticulo={rutaActual.parametros.postId} navegar={navegar} />; break;
    case 'funcionarios': contenidoPagina = <PanelAdministracion vehiculos={vehiculos} establecerVehiculos={establecerVehiculos} categorias={categorias} establecerCategorias={establecerCategorias} />; break;
    default: contenidoPagina = <PaginaInicio {...propiedadesVehiculos} navegar={navegar} />;
  }

  const cantidadCarrito = carrito.reduce((suma, item) => suma + Number(item.quantity || 0), 0);
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><Encabezado paginaDestino={rutaActual.pagina} navegar={navegar} cantidadElementosCarrito={cantidadCarrito} /><main id="contenido" key={rutaActual.pagina}>{contenidoPagina}</main><PiePagina navegar={navegar} /></>;
}

createRoot(document.getElementById('root')).render(<Aplicacion />);
