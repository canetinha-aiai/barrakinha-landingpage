import React, { useEffect, useRef, useState } from 'react';
import { fitPath, shapes } from '@usefluid/motion';
import { MorphPath, useInView, useReducedMotion } from '@usefluid/motion/react';
import badgeSvg from './barrakinha-logo.svg?raw';

/*
  O selo da Barrakinha vivo, com o Metamorph da Fluid (MorphPath +
  fitPath). O `d` vem do mesmo SVG de `public/logo` (há uma cópia ao
  lado porque o Vite não importa de public/), encaixado numa caixa de
  120.

  - `start="mount"` (header): o pré-render sai com o selo pronto e
    parado; quando a página monta, ele vira gota e escorre de volta
    até o selo. Passar o mouse transforma o selo numa flor, e tirar
    o mouse volta.
  - `start="view"` (rodapé): o pré-render também sai com o selo pronto;
    depois de montar ele vira gota (fora da tela, ninguém vê) e escorre
    até o selo quando entra na tela.

  Com menos movimento, fica só o selo parado. No servidor sai um
  <path> comum: o MorphPath usa useLayoutEffect, que o React reclama
  fora do navegador.
*/
const raw = badgeSvg.match(/\sd="([^"]+)"/)[1];
/* Uma casa decimal basta numa caixa de 120 (é 1/1200 do selo) e corta
   ~20% do caminho, que sai no HTML pré-renderizado do header e do rodapé. */
export const BADGE = fitPath(raw).replace(/-?\d+\.\d+/g, (n) => String(+(+n).toFixed(1)));

const MorphLogo = ({ size = 36, start = 'mount', hover = false, label = '', className }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, 0.6);
  const [mounted, setMounted] = useState(false);
  const [formed, setFormed] = useState(false);
  const [over, setOver] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return undefined;
    if (start === 'view' && !inView) return undefined;
    const timer = setTimeout(() => setFormed(true), start === 'mount' ? 180 : 0);
    return () => clearTimeout(timer);
  }, [mounted, inView, start]);

  const still = !mounted || reduced;
  const d = over ? shapes.flower : formed ? BADGE : shapes.drop;

  return (
    <svg
      ref={ref}
      viewBox="-6 -6 132 132"
      width={size}
      height={size}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : 'true'}
      className={className}
      onPointerEnter={hover ? (e) => e.pointerType === 'mouse' && setOver(true) : undefined}
      onPointerLeave={hover ? () => setOver(false) : undefined}
    >
      {still ? (
        /* Pré-render e menos movimento: o selo pronto e parado. */
        <path d={BADGE} fill="currentColor" fillRule="evenodd" />
      ) : (
        <MorphPath d={d} fill="currentColor" fillRule="evenodd" config={{ w: 9, z: 0.78, spread: 0.18 }} />
      )}
    </svg>
  );
};

export default MorphLogo;
