import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configuración de Vite para KakoJuegos.
// "base" debe coincidir con el nombre del repositorio de GitHub,
// porque GitHub Pages publica el sitio en https://kakogf.github.io/EFT-Frontend/
// Sin esta línea, el sitio publicado no encontraría sus archivos JS, CSS ni imágenes.
export default defineConfig({
  plugins: [react()],
  base: '/EFT-Frontend/',
})
