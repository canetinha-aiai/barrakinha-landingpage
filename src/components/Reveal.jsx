import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { EASE_OUT } from '@/lib/motion';

/*
  Entrada por rolagem, só no celular: o bloco sobe um pouco (ou vem
  de lado, com `x`) e aparece quando chega na tela, uma vez só. Só
  transform e opacidade, que o celular fraco anima sem esforço.

  No desktop e pra quem pede menos movimento é o elemento puro, sem
  nada. O pré-render também sai puro (lá não existe `window`, então
  `useIsMobile` é falso): o HTML nasce visível, e o estado escondido
  só existe depois que o React monta no celular.
*/
const Reveal = ({ as = 'div', delay = 0, x = 0, y = 32, amount = 0.2, className, children, ...rest }) => {
  const mobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  if (!mobile || reduceMotion) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
