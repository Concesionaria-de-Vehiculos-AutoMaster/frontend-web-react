import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: false },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.pruebas.js', 'pruebas/**/*.pruebas.jsx'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/datos/operacionesCrud.js',
        'src/componentes/vehiculos/ListaVehiculos.jsx',
        'src/componentes/vehiculos/TarjetaVehiculo.jsx',
        'src/componentes/comunes/BotonAccion.jsx',
        'src/componentes/comunes/MensajeEstado.jsx'
      ],
      exclude: ['**/*.pruebas.*']
    }
  }
});
