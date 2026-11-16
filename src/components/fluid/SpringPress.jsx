import React, { forwardRef, useRef, useState } from 'react';
import { springs } from '@usefluid/motion';
import { useSpring as useFluidSpring } from '@usefluid/motion/react';

/* No pré-render não há o que animar, e a mola da Fluid usa
   useLayoutEffect, que o React reclama fora do navegador. */
const useSpring = typeof window === 'undefined' ? () => {} : useFluidSpring;

/*
  A mola do Spring Button da Fluid (registry/spring-button, MIT), em
  volta de qualquer botão ou link que já existe: afunda no toque, cresce
  um pouco no hover do mouse e estica na direção da velocidade quando
  solta. Sem o visual do botão da Fluid — o estilo continua sendo o
  `btn-night`/`btn-primary` da casa.

  `as` escolhe a tag ('a' ou 'button'); o resto das props vai pra ela.
  Com menos movimento a Fluid aplica a escala sem mola (fica parado).
*/
const SpringPress = forwardRef(({ as: Tag = 'button', className, style, ...props }, outer) => {
  const el = useRef(null);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useSpring(
    { s: down ? 0.93 : hover ? 1.03 : 1 },
    ({ s }, velocity) => {
      if (!el.current) return;
      const stretch = Math.max(-0.05, Math.min(0.05, velocity.s * 0.03));
      el.current.style.transform = `scale(${s - stretch}, ${s + stretch})`;
    },
    springs.bouncy,
  );

  const setRef = (node) => {
    el.current = node;
    if (typeof outer === 'function') outer(node);
    else if (outer) outer.current = node;
  };

  return (
    <Tag
      {...props}
      ref={setRef}
      className={className}
      style={{ ...style, touchAction: 'manipulation' }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(true); props.onPointerEnter?.(e); }}
      onPointerLeave={(e) => { setHover(false); setDown(false); props.onPointerLeave?.(e); }}
      onPointerDown={(e) => { setDown(true); props.onPointerDown?.(e); }}
      onPointerUp={(e) => { setDown(false); props.onPointerUp?.(e); }}
      onPointerCancel={(e) => { setDown(false); props.onPointerCancel?.(e); }}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setDown(true); props.onKeyDown?.(e); }}
      onKeyUp={(e) => { setDown(false); props.onKeyUp?.(e); }}
      onBlur={(e) => { setDown(false); props.onBlur?.(e); }}
    />
  );
});

SpringPress.displayName = 'SpringPress';
export default SpringPress;
