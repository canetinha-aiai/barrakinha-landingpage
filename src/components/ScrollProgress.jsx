import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/*
  Barra de progresso do scroll — fina, colada no topo, acima do
  header. `useScroll` sem `target` acompanha a rolagem da página
  inteira; `useSpring` suaviza o valor bruto (que anda em degraus,
  reto) num movimento com um pouco de inércia, em vez de saltar preso
  a cada evento de scroll.
*/
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.2,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-brand"
    />
  );
};

export default ScrollProgress;
