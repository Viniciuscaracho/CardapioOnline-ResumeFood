import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Otimizações de build para produção
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para melhor caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
        },
      },
    },
    // Reduzir tamanho do bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true,
      },
    },
    // Otimizar chunks
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // Otimizações para desenvolvimento
    hmr: {
      overlay: false, // Desabilitar overlay de erro para melhor performance
    },
  },
  optimizeDeps: {
    // Pré-carregar dependências comuns
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
    ],
  },
})
