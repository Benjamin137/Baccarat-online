import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 2000,
    strictPort: true,
    host: true, // Crucial para Docker: permite conexiones externas
    watch: {
      usePolling: true, // Necesario si usas Docker en Windows o macOS para detectar cambios en archivos
    },
    hmr: {
      clientPort: 2000, // Asegura que el Hot Module Replacement use el puerto correcto
    },
  },
})
