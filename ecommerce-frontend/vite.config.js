import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,          // Set your preferred port
    strictPort: true     // Do not fall back to another port if it's in use
  }
})
