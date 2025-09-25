import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose to all network interfaces
    port: 5173,
    strictPort: true, // Fail if port is already in use
    hmr: {
      // Allows HMR to work in a container environment
      clientPort: 5173 
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  }
});