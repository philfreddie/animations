import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['gl-matrix', 'dat.gui']
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
})