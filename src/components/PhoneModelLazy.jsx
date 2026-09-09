import React, { Suspense, lazy } from 'react';

/*
  O `PhoneModel` (three.js + drei + o carregador de `.glb`) só é
  baixado quando alguém vai realmente vê-lo.

  Com o import estático, ele entrava no pacote principal: 1,14 MB
  antes de comprimir, contra 198 kB do resto da página somado. Todo
  telefone pagava esse download — e desde que a versão estreita passou
  a desenhar o aparelho em CSS (`PhoneFrame`), pagava por um código
  que nunca chegava a executar.

  `React.lazy` corta isso na raiz: como o `useIsMobile` já sabe a
  largura no primeiro render, no celular o ramo do `PhoneModel` nunca
  é renderizado — e o que nunca é renderizado nunca é pedido. O
  arquivo vira um pedaço separado que só sai do servidor em tela
  larga.

  `fallback` é um vazio do tamanho certo, não um spinner: o espaço já
  está reservado pelo `className` que vem de fora, e piscar um
  indicador de carregamento no lugar de uma imagem decorativa só
  chamaria atenção pro que ainda não chegou.
*/
const PhoneModel = lazy(() => import('@/components/PhoneModel'));

const PhoneModelLazy = ({ className, ...props }) => (
  <Suspense fallback={<div className={className} aria-hidden="true" />}>
    <PhoneModel className={className} {...props} />
  </Suspense>
);

export default PhoneModelLazy;
