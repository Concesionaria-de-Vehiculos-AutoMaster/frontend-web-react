# AutoMaster - Evaluación Parcial 2

Tienda de vehículos desarrollada con React, Vite, JavaScript y Bootstrap 5. Los datos son de demostración y se guardan en el almacenamiento local del navegador.

## Requisitos

- Node.js 22 o superior.
- npm incluido con Node.js.

## Ejecutar

Abre una terminal en esta carpeta y ejecuta:

```bash
npm install
npm run dev
```

En Windows PowerShell, usa `npm.cmd` si la política de scripts bloquea `npm.ps1`.

## Compilar y probar

```bash
npm run build
npm test
npm run test:coverage
```

El informe de cobertura se limita a los módulos que tienen pruebas unitarias; no representa la cobertura de todas las páginas de la aplicación.

El proyecto usa Vitest porque el docente indicó que reemplaza Jasmine y Karma para esta evaluación. Hay 10 pruebas de componentes React y 10 pruebas de las funciones de datos (CRUD y lectura segura).

## Contenido estrictamente asociado a la pauta

- Tienda: inicio, productos, detalle, registro, inicio de sesión, nosotros, blog, contacto, categorías, carrito, checkout, resultados de pago y ofertas.
- Administración: dashboard, órdenes/boletas, productos (CRUD y stock bajo), categorías (CRUD), usuarios (CRUD e historial de compras), reportes y perfil.
- Datos simulados con operaciones CRUD y persistencia en `localStorage`.
- Componentes React con props, estado y eventos; diseño responsive con Bootstrap.
- Pruebas unitarias de lógica y componentes con Vitest.

## Acceso de demostración al panel

Usuario: cualquier texto no vacío. Contraseña: `AutoMaster2026!`.

Este acceso y los datos guardados en el navegador son solo para una demostración académica. No existe backend, autenticación segura ni pasarela de pago real.
