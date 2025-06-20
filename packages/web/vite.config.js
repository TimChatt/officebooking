import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindVite from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindVite(),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
