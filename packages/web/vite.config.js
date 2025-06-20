import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // ✅ add this
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ enables Tailwind v4 styling
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
