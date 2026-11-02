import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

/*
  Título que sobe palavra por palavra, cada uma saindo de trás de uma
  máscara — como letreiro sendo pendurado. Toca uma vez, quando o
  título entra na tela.

  Cada palavra é uma caixa com `overflow: hidden` e a palavra de dentro
  vem de `translateY(140%)`: só transform, nada de layout. O respiro
  de 0,14em embaixo da máscara existe pra não cortar a perna do "g" e
  do "p" com entrelinha 1,0 — e é por causa dele que a partida é 140%
  e não 100%: com menos, o topo das letras aparece no respiro antes da
  palavra subir.

  `as` escolhe a tag (h1, h2…); o resto das props vai pra ela. Com
  menos movimento o texto já nasce no lugar.
*/
const container = {
  hidden: {},
  shown: (stagger) => ({ transition: { staggerChildren: stagger } }),
};

const word = {
  hidden: { y: '140%' },
  shown: { y: '0%', transition: { duration: 0.7, ease: EASE_OUT } },
};

const RevealText = ({ as = 'h2', text, stagger = 0.045, className, ...props }) => {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(' ');

  return (
    <Tag
      className={className}
      variants={container}
      custom={stagger}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      {...props}
    >
      {words.map((value, index) => (
        <React.Fragment key={`${value}-${index}`}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
            <motion.span className="inline-block" variants={word}>
              {value}
            </motion.span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
};

export default RevealText;
