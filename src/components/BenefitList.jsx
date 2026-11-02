import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/lib/motion';

/*
  A lista de benefícios de cada público: linhas numeradas separadas
  por filete, como um índice. O número vai em letra larga, no laranja
  de texto — é ele que dá o ritmo da lista e põe a marca nela.

  `tone="night"` é a versão pra seção escura.

  Movimento:
  - Entrada em cascata, 80ms entre linhas, quando a lista chega na
    tela. O filete de cada linha se desenha da esquerda junto.
  - No mouse, a linha sob o ponteiro ganha uma faixa de cor que varre
    da esquerda e o título anda 6px — a lista responde a quem está
    lendo. Só com `hover: hover`, pela variante `hover-fine` (ver
    tailwind.config.js), pra não grudar no toque.
*/
const list = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const row = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const rule = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 0.9, ease: EASE_OUT } },
};

const BenefitList = ({ items, tone = 'paper', className }) => {
  const night = tone === 'night';
  const reduceMotion = useReducedMotion();

  return (
    <motion.ol
      variants={list}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      className={cn('border-t', night ? 'border-night-line' : 'border-line-strong', className)}
    >
      {items.map((item, index) => (
        <motion.li
          key={item.title}
          variants={row}
          className="group relative grid grid-cols-[3rem_1fr] gap-x-4 py-6 sm:grid-cols-[4rem_1fr]"
        >
          {/* A faixa do hover: escala da esquerda, por baixo do texto. */}
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -inset-x-3 inset-y-0 origin-left scale-x-0 rounded transition-transform duration-500 ease-out hover-fine:group-hover:scale-x-100',
              night ? 'bg-cream/[0.04]' : 'bg-ember/[0.06]',
            )}
          />
          <motion.span
            aria-hidden="true"
            variants={rule}
            className={cn(
              'absolute inset-x-0 bottom-0 h-px origin-left',
              night ? 'bg-night-line' : 'bg-line-strong',
            )}
          />
          <span
            className={cn(
              'numeric display-wide relative text-[28px] leading-none tracking-[-0.02em] transition-transform duration-300 ease-out hover-fine:group-hover:-translate-y-0.5',
              night ? 'text-ember' : 'text-ember-text',
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="relative transition-transform duration-300 ease-out hover-fine:group-hover:translate-x-1.5">
            <h3
              className={cn(
                'text-[20px] font-bold leading-snug tracking-[-0.015em]',
                night ? 'text-cream' : 'text-ink',
              )}
            >
              {item.title}
            </h3>
            <p
              className={cn(
                'mt-1.5 max-w-[46ch] text-[16px] leading-relaxed text-pretty',
                night ? 'text-night-muted' : 'text-ink-muted',
              )}
            >
              {item.detail}
            </p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
};

export default BenefitList;
