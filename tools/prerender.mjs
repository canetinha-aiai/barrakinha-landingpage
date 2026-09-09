import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const htmlPath = path.join(root, 'dist', 'index.html');

const { render } = await import(path.join(root, 'dist-ssr', 'entry-server.js'));

let markup = render();

/*
  Reabre o que as animações de entrada deixariam fechado.

  Quase todo bloco da página nasce com `initial={{ opacity: 0 }}` e só
  aparece quando entra na tela. Isso é comportamento de navegador — mas
  o `renderToString` não sabe disso e escreve o estado inicial como
  estilo embutido. Sem este passo, o HTML pré-renderizado sairia com o
  texto todo em `opacity:0`: para um buscador, uma página cheia de
  conteúdo escondido, que é pior do que a página vazia de antes.

  A troca é deliberadamente estreita — só `opacity:0` exatamente, e só
  quando é a declaração inteira (o que vem depois é `;` ou o fim do
  atributo). `opacity:0.18` das manchas de luz do hero não casa, porque
  ali o próximo caractere é um ponto.

  Os deslocamentos (`transform: translateY(20px)`) ficam como estão de
  propósito: eles movem, não escondem — o texto continua legível pra
  quem lê o HTML, e mexer neles arriscaria pegar `transform` que é
  posicionamento de verdade, como o `translate(-50%,-100%)` que
  centraliza pino em mapa.
*/
const hidden = (markup.match(/opacity:0(?=[;"])/g) || []).length;
markup = markup.replace(/opacity:0(?=[;"])/g, 'opacity:1');

const html = await readFile(htmlPath, 'utf8');
const marker = '<div id="root"></div>';

if (!html.includes(marker)) {
  throw new Error(
    `Âncora ${marker} não encontrada em dist/index.html — o HTML mudou e a injeção não tem onde entrar.`,
  );
}

await writeFile(
  htmlPath,
  html.replace(marker, `<div id="root">${markup}</div>`),
  'utf8',
);

console.log(
  `prerender: ${markup.length} bytes no #root (${hidden} estilos opacity:0 reabertos)`,
);
