import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/*
  Pílulas empilhadas — a lista de benefícios de cada bloco de público,
  no mesmo formato do smartserialnumber.com: barra arredondada cheia,
  uma frase por barra, em vez de bullet point solto. Entram em cascata
  (cada uma com um pouco mais de atraso) e reagem ao hover com uma
  escala mínima — sinal de que ali é conteúdo, não decoração.
*/
const PillList = ({ items, tone = 'on-dark', className }) => {
  const isOnEmber = tone === 'on-ember';

  return (
    <div className={cn('flex w-full flex-col gap-3', className)}>
      {items.map((text, index) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, x: -28, scale: 0.94 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.6,
            delay: index * 0.09,
            ease: [0.16, 1, 0.3, 1],
          }}
          /*
            `px-5` no celular contra `px-6` no desktop: a pílula é uma
            frase inteira numa cápsula, e numa tela de 375px cada
            12px de recuo interno é uma palavra a menos por linha —
            era o que fazia metade delas quebrarem em três linhas.
          */
          className={cn(
            'w-full cursor-default select-none rounded-full px-5 py-3.5 text-[14.5px] font-medium leading-snug transition-transform duration-300 hover:scale-[1.01] sm:px-6 sm:py-4 sm:text-base',
            isOnEmber
              ? 'bg-white text-ink-900 shadow-[0_8px_20px_rgba(90,26,8,0.18)]'
              : 'bg-white/[0.06] text-paper ring-1 ring-inset ring-white/[0.08]',
          )}
        >
          {text}
        </motion.div>
      ))}
    </div>
  );
};

export default PillList;
