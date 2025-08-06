import { defineConfig } from 'vite'
//import { fileURLToPath, URL } from 'node:url'
import path from 'path';
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      //'@': fileURLToPath(new URL('./src', import.meta.url)),
      '@': path.resolve(__dirname, './src')
    },
  },
  plugins: [vue(),tailwindcss()],
  build: {
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
})
