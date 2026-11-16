import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { DARK_MODE_ENABLED } from './src/config.js';

/* No `npm run dev`, /vendedores (sem barra) cairia na home: o Vite só
   acha vendedores/index.html com a barra no fim. Em produção quem faz
   isso é o rewrite do vercel.json. */
const vendorRoute = {
  name: 'vendedores-route',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/vendedores' || req.url.startsWith('/vendedores?')) {
        req.url = req.url.replace('/vendedores', '/vendedores/index.html');
      }
      next();
    });
  },
};

/* Modo escuro atrás de uma chave só (src/config.js). As páginas saem
   claras do jeito que estão escritas; com a chave ligada, este plugin
   devolve o que o escuro precisa em cada HTML: a classe que ativa a
   paleta escura do index.css, o color-scheme duplo e a cor da barra
   do navegador no escuro. */
const colorScheme = {
  name: 'color-scheme',
  transformIndexHtml(html) {
    if (!DARK_MODE_ENABLED) return html;
    return html
      .replace('<html lang="pt-BR">', '<html lang="pt-BR" class="theme-auto">')
      .replace(
        '<meta name="color-scheme" content="light" />',
        '<meta name="color-scheme" content="light dark" />',
      )
      .replace(
        '<meta name="theme-color" content="#F85A35" />',
        '<meta name="theme-color" content="#F85A35" media="(prefers-color-scheme: light)" />\n    <meta name="theme-color" content="#12100E" media="(prefers-color-scheme: dark)" />',
      );
  },
};

export default defineConfig({
  plugins: [react(), vendorRoute, colorScheme],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        privacidade: path.resolve(__dirname, 'privacidade.html'),
        vendedores: path.resolve(__dirname, 'vendedores/index.html'),
      },
    },
  },
});
