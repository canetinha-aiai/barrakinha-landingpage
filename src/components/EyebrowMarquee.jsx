import React from 'react';
import { cn } from '@/lib/utils';

/*
  Rótulo gigante repetindo em loop, deitado no topo da seção — a marca
  d'água que o smartserialnumber.com usa pra anunciar "PARA A
  FABRICANTE" / "PARA A MARCA" / "PARA O CONSUMIDOR" antes de cada
  bloco de público. Mesmo texto, tom baixo — é textura, não título; o
  título de verdade é o `<h2>` abaixo dele.

  `tone` escolhe o par cor/opacidade: `on-ember` é pra quando a seção
  inteira é o laranja da marca (o rótulo precisa de um tom mais fundo
  pra não desaparecer no próprio fundo); `on-dark` é pra seção escura
  (o mesmo tom, só que translúcido).

  `-z-10` em vez de deixar o conteúdo por cima com `z-10`: assim quem
  precisa ficar acima da faixa (o vídeo do celular, nas seções que têm
  um) não precisa virar um contexto de empilhamento próprio só pra
  vencer essa disputa — e um contexto de empilhamento no meio do
  caminho é o que quebra o `mix-blend-mode` do vídeo (ele só enxerga o
  fundo dentro do mesmo contexto).
*/
const EyebrowMarquee = ({ label, tone = 'on-dark', className }) => {
  const items = Array.from({ length: 8 }, () => label);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 -z-10 select-none overflow-hidden whitespace-nowrap pb-2 pt-6 lg:pt-10',
        className,
      )}
    >
      <div
        className={cn(
          // 65s por volta — a mesma velocidade (bem mais lenta que a
          // faixa de chips) medida no rótulo repetido do site de
          // referência: textura de fundo, não elemento pra ler rolando.
          'flex w-max animate-[marquee_65s_linear_infinite] gap-6 font-display text-[15vw] font-medium uppercase leading-none tracking-[0.02em] motion-reduce:animate-none sm:text-[9vw] lg:gap-10 lg:text-[6vw]',
          tone === 'on-ember' ? 'text-ink-950/[0.12]' : 'text-ember-700/[0.18]',
        )}
      >
        {[...items, ...items].map((text, index) => (
          <span key={index}>{text}</span>
        ))}
      </div>
    </div>
  );
};

export default EyebrowMarquee;
