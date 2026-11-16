import React from 'react';
import ReactDOM from 'react-dom/client';
import Vendedores from '@/pages/Vendedores';
import '@/index.css';

/* Mesmo esquema da home (src/main.jsx): o React monta por cima do HTML
   que o tools/prerender.mjs escreveu em vendedores/index.html. */
ReactDOM.createRoot(document.getElementById('root')).render(<Vendedores />);
