import { defineConfig } from 'vite'

// Vite configuration for vanilla HTML/CSS/JS portfolio
export default defineConfig({
  server: {
    port: 5173,
    open: false,
    host: true
  },
  preview: {
    port: 4173,
    open: false
  }
})
