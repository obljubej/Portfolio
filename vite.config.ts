import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Portfolio/',
  plugins: [react()],
  build: {
    // Raise the warning threshold — Three.js is inherently large
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk: Three.js + R3F ecosystem
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          // Animation chunk
          'vendor-gsap': ['gsap'],
          // State chunk
          'vendor-state': ['zustand'],
        },
      },
    },
  },
  optimizeDeps: {
    // Pre-bundle heavy deps for faster dev server startup
    include: ['three', '@react-three/fiber', '@react-three/drei', 'gsap', 'zustand'],
  },
});
