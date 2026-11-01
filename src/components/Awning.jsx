import React, { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/*
  O toldo: listras verticais com a barra recortada em meia-lua, o toldo
  de lona de qualquer barraca de rua. É a assinatura da marca — ele
  fecha o bloco de cor de cima e "pendura" sobre o de baixo.

  É SVG com `<pattern>`, não `repeating-linear-gradient`: listra e
  meia-lua são formas chapadas, com aresta dura, e escalam pra
  qualquer largura sem deformar.

  `stripe` e `between` são as duas cores da lona; o fundo do SVG é
  transparente, então o que aparece entre as meias-luas é a seção de
  baixo. `unroll` desenrola o toldo de cima pra baixo uma vez, quando
  ele entra na tela — é a barraca abrindo.
*/
const Awning = ({ stripe = '#F85A35', between = '#FBF7F2', unroll = false, className }) => {
  const id = useId().replace(/:/g, '');
  const reduceMotion = useReducedMotion();
  const animate = unroll && !reduceMotion;

  return (
    <motion.div
      aria-hidden="true"
      className={cn('h-12 w-full', className)}
      style={{ originY: 0 }}
      initial={animate ? { scaleY: 0 } : false}
      whileInView={animate ? { scaleY: 1 } : undefined}
      viewport={{ once: true, amount: 1 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.7 }}
    >
      <svg width="100%" height="100%" preserveAspectRatio="none" className="block">
        <defs>
          <pattern id={id} width="56" height="48" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="28" height="34" fill={stripe} />
            <rect x="28" y="0" width="28" height="34" fill={between} />
            <circle cx="14" cy="34" r="14" fill={stripe} />
            <circle cx="42" cy="34" r="14" fill={between} />
          </pattern>
        </defs>
        <rect width="100%" height="48" fill={`url(#${id})`} />
      </svg>
    </motion.div>
  );
};

export default Awning;
