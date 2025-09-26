import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/physioclinic/', // 👈 Important for Nginx root deployment
  build: {
    outDir: 'dist', // default for Vite
    emptyOutDir: true
  }
})