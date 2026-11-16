import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSpring as useFluidSpring } from '@usefluid/motion/react';

/* No pré-render não há o que animar, e a mola da Fluid usa
   useLayoutEffect, que o React reclama fora do navegador. */
const useSpring = typeof window === 'undefined' ? () => {} : useFluidSpring;
import styles from './PillTabs.module.css';

/*
  Pill Tabs da Fluid (registry/pill-tabs, MIT), em JSX e com as cores
  da casa. O marcador tem as duas bordas em molas diferentes: a da
  frente puxa rápido e a de trás vem atrás, então ele estica no
  caminho e encolhe ao chegar.

  `onPress` em vez de clique: responde no toque, como a chave antiga.
  Com menos movimento, o marcador pula direto.

  No servidor o marcador não existe (ainda não há medida), então o
  item ativo sai marcado pelo próprio fundo — ver `.tab[aria-selected]`
  com `data-ready` ausente.
*/
const LEAD = { w: 30, z: 0.82 };
const TRAIL = { w: 16, z: 0.8 };
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function PillTabs({ label, tabs, value, onChange, className }) {
  const list = useRef(null);
  const pill = useRef(null);
  const [box, setBox] = useState(null);
  const last = useRef({ left: 0, placed: false });

  useIsoLayoutEffect(() => {
    const measure = () => {
      const el = list.current?.querySelector('[aria-checked="true"]');
      if (el) setBox({ left: el.offsetLeft, right: el.offsetLeft + el.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (list.current) observer.observe(list.current);
    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (box) last.current = { left: box.left, placed: true };
  }, [box]);

  const right = !box || box.left >= last.current.left;
  const immediate = !last.current.placed;
  const edges = useRef({ left: 0, right: 0 });
  const paint = () => {
    if (!pill.current) return;
    pill.current.style.transform = `translateX(${edges.current.left}px)`;
    pill.current.style.width = `${Math.max(0, edges.current.right - edges.current.left)}px`;
  };
  useSpring({ v: box?.left ?? 0 }, ({ v }) => { edges.current.left = v; paint(); }, { ...(right ? TRAIL : LEAD), immediate });
  useSpring({ v: box?.right ?? 0 }, ({ v }) => { edges.current.right = v; paint(); }, { ...(right ? LEAD : TRAIL), immediate });

  const move = (event, i) => {
    const d = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (d) {
      event.preventDefault();
      const next = (i + d + tabs.length) % tabs.length;
      onChange(tabs[next].value);
      list.current?.querySelectorAll('[role="radio"]')[next]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      onChange(tabs[i].value);
    }
  };

  return (
    <div
      ref={list}
      role="radiogroup"
      aria-label={label}
      data-ready={box ? '' : undefined}
      className={[styles.list, className].filter(Boolean).join(' ')}
    >
      <span ref={pill} className={styles.pill} aria-hidden="true" />
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          type="button"
          role="radio"
          aria-checked={tab.value === value}
          tabIndex={tab.value === value ? 0 : -1}
          className={styles.tab}
          onPointerDown={() => onChange(tab.value)}
          onKeyDown={(event) => move(event, i)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default PillTabs;
