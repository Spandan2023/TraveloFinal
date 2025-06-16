import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for OpenWeatherMap API
      '/api/weather': {
        target: 'https://api.openweathermap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, '')
      },
      // Proxy for Spring Boot backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // This line avoids rewriting /api (we want to keep /api/blogs etc. intact)
        rewrite: (path) => path
      }
    }
  }
});
