import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

/*
  Ticker vertical — não é o marquee horizontal que a primeira versão
  tinha. Inspecionado direto no smartserialnumber.com: a lista de
  dificuldades ali é uma janela de altura fixa com máscara de
  esmaecimento em cima e embaixo (`.ticker-fade`), avançando um item por
  vez sozinha, não um trilho correndo para o lado.

  Mecânica: a lista se repete uma vez (`[...items, ...items]`) e o
  índice sobe a cada `INTERVAL`. Ao cruzar o fim da primeira cópia, o
  `onTransitionEnd` da própria transform — não um `setTimeout` chutando
  a duração — subtrai `items.length` do índice com a transição
  desligada por um frame, faz o salto ficar invisível, igual ao loop
  sem costura de qualquer marquee, só que no eixo vertical.
*/
const ITEM_HEIGHT = 60;
const INTERVAL = 2600;
const EASE = 'cubic-bezier(0,0,0.2,1)';

const ProblemsTicker = ({ items }) => {
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);
  const loop = [...items, ...items];

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), INTERVAL);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!instant) return undefined;
    const raf = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(raf);
  }, [instant]);

  const handleTransitionEnd = () => {
    if (index >= items.length) {
      setInstant(true);
      setIndex((i) => i - items.length);
    }
  };

  return (
    <div
      className="ticker-fade relative mx-auto h-[180px] w-full max-w-md overflow-hidden"
      role="list"
      aria-label="Dificuldades de quem vende comida de rua"
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translateY(-${index * ITEM_HEIGHT}px)`,
          transition: instant ? 'none' : `transform 600ms ${EASE}`,
        }}
      >
        {loop.map((text, i) => (
          <div
            key={i}
            role="listitem"
            style={{ height: ITEM_HEIGHT }}
            className="flex items-center justify-center gap-2 px-6 text-center text-[15px] text-sand-200 sm:text-base"
          >
            <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-ember-500" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemsTicker;
