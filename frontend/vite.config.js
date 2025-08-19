import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Make sure paths work correctly on Render
  base: "/",
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
    open: true,
  },
});
