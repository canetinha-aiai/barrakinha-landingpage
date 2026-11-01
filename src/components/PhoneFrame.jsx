import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { cn } from '@/lib/utils';

/*
  A tela do app, mostrada como o que ela é: uma captura de tela.

  Já foi um telefone desenhado em CSS — moldura em degradê, halo
  laranja, sombra interna, reflexo varrendo o vidro a cada 7s e uma
  flutuação sem fim — e, no desktop, um `.glb` de 1,5 MB girando num
  `<canvas>`. Tudo isso pra emoldurar um retângulo. Agora é a captura
  num quadro de papel: filete de 1px, o raio de 10px do resto da
  página e nada se mexendo sozinho.

  `crop` corta a captura numa proporção (`'9 / 11'`, por exemplo) pra
  telas que só têm conteúdo em cima. O corte é reto e honesto: o
  quadro tem borda própria, então não lê como imagem quebrada.
*/
const PhoneFrame = ({
  src,
  alt,
  className,
  crop,
  priority = false,
  beforeSrc,
}) => {
  const reduceMotion = useReducedMotion();
  const revealRef = useRef(null);

  /*
    `beforeSrc`: o estado anterior da MESMA tela, por cima, que se
    apaga conforme a página rola. Quem comanda é o dedo do leitor —
    descer abre a barraca, subir fecha. É a única animação de conteúdo
    que ficou na página, porque é a única que explica alguma coisa: o
    cartão do topo mudando de "fechada" pra "aberta" é o produto.

    `useSpring` amortece o valor cru do scroll, que anda em degraus a
    cada evento; sem ele a imagem pisca em vez de dissolver. Sem
    quique — é um cruzamento, não um objeto com massa.
  */
  const { scrollYProgress } = useScroll({
    target: revealRef,
    offset: ['start 0.9', 'center 0.4'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  const beforeOpacity = useTransform(smooth, [0.45, 0.85], [1, 0]);

  return (
    <figure
      ref={revealRef}
      className={cn(
        'relative overflow-hidden rounded border border-line-strong bg-paper-raised',
        className,
      )}
      style={crop ? { aspectRatio: crop } : undefined}
    >
      <img
        src={src}
        alt={alt}
        width={1080}
        height={2400}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
        className="block w-full"
      />

      {/* Fica de fora de quem pediu menos movimento: sem animação, o
          estado de depois já é o que está embaixo. */}
      {beforeSrc && !reduceMotion ? (
        <motion.img
          src={beforeSrc}
          alt=""
          aria-hidden="true"
          width={1080}
          height={2400}
          loading="lazy"
          decoding="async"
          className="absolute inset-x-0 top-0 block w-full"
          style={{ opacity: beforeOpacity }}
        />
      ) : null}
    </figure>
  );
};

export default PhoneFrame;
