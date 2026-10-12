import { defineConfig } from 'vite';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [{
    name: 'widget-public-paths',
    closeBundle() {
      const widget = resolve('public/widget/sniperlink.js');
      copyFileSync(widget, resolve('public/widget/sniperlink.min.js'));
      copyFileSync(widget, resolve('public/sniperlink.js'));
      copyFileSync(widget, resolve('public/sniperlink.min.js'));
    }
  }],
  build: {
    lib: {
      entry: resolve('src/widget/index.ts'),
      name: 'SniperLink',
      fileName: format => format === 'es' ? 'sniperlink.esm.js' : 'sniperlink.js',
      formats: ['iife', 'es']
    },
    outDir: 'public/widget',
    copyPublicDir: false,
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: false,
    target: 'es2020'
  }
});
