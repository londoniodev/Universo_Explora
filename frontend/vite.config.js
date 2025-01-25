import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      three: resolve('./node_modules/three'),
    },
  },
  optimizeDeps: {
    include: ["jspdf", "jspdf-autotable"],
  },
});