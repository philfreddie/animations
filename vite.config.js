import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    minify: 'terser'
  },
  server: {
    host: true,
    port: 3000
  }
})