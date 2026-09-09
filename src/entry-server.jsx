import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '@/App';

/*
  Entrada usada só no build, nunca no navegador.

  O `tools/prerender.mjs` importa este arquivo em Node, renderiza a
  árvore inteira pra texto e grava o resultado dentro do
  `<div id="root">` do `index.html`. Serve pra que quem lê a página
  sem executar JavaScript — buscadores em primeira passada, e qualquer
  robô que não renderize — encontre o conteúdo já escrito, em vez do
  `<div>` vazio que a versão anterior entregava.
*/
export function render() {
  return renderToString(<App />);
}
