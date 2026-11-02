import React, { useRef } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { SPRING_SOFT, useFinePointer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/*
  Ímã: o botão vai um pouco atrás do mouse quando ele passa por cima e
  volta pro lugar com mola quando sai. `strength` é a fração do
  deslocamento do ponteiro que o botão acompanha — 0,25 já é bastante.

  Só com mouse (no toque não existe "passar por cima") e fora de menos
  movimento. Mola porque o ponteiro muda de direção a todo instante e a
  mola herda a velocidade em vez de recomeçar.
*/
const Magnetic = ({ children, strength = 0.25, className }) => {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, SPRING_SOFT);
  const y = useSpring(0, SPRING_SOFT);
  const active = fine && !reduceMotion;

  const onPointerMove = (event) => {
    if (!active || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * strength);
    y.set((event.clientY - (box.top + box.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
