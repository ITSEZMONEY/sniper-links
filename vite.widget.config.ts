import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget/index.ts'),
      name: 'SniperLink',
      fileName: (format) => `sniperlink${format === 'es' ? '.esm' : ''}.js`,
      formats: ['iife', 'es']
    },
    rollupOptions: {
      output: {
        // Ensure the IIFE format has the global name
        name: 'SniperLink',
        // Minimize external dependencies
        globals: {}
      },
      external: []
    },
    outDir: 'dist/widget',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging during development
        drop_debugger: true
      },
      mangle: {
        reserved: ['SniperLink']
      }
    },
    sourcemap: true,
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  esbuild: {
    target: 'es2020'
  }
});