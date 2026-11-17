import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: true,
    // Las peticiones /api se envían al backend Node que habla con Oracle.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
