import React from 'react';
import ReactDOM from 'react-dom/client';
import BarrakinhaXIfood from '@/pages/BarrakinhaXIfood';
import '@/index.css';

/* Mesmo esquema de /vendedores: o React monta por cima do HTML que o
   tools/prerender.mjs escreveu em barrakinha-x-ifood/index.html. */
ReactDOM.createRoot(document.getElementById('root')).render(<BarrakinhaXIfood />);
