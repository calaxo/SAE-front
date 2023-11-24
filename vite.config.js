import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      '@components': path.resolve(__dirname, './src/components'),

        '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
        output: {
            dir: 'builded/',
            entryFileNames: 'plugin.js',
            assetFileNames: 'plugin.css',
            chunkFileNames: "chunk.js",
            manualChunks: {
              vendor: ['react', 'react-dom'],

            },
        },
    },
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari12'],
}


})