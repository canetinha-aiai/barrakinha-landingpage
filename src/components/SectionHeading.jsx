import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import RevealText from '@/components/RevealText';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/lib/motion';

/**
 * Cabeçalho de seção: rótulo curto, título em letra larga e, quando
 * faz falta, uma frase de apoio.
 *
 * O rótulo diz de quem é a seção ("Pra quem vende"), coisa que o
 * título sozinho não diz. `tone="night"` é a versão pra seção escura.
 *
 * Entrada em três tempos quando chega na tela: o rótulo aparece, o
 * título sobe palavra por palavra (RevealText) e a frase de apoio vem
 * por último, quando o olho já terminou o título.
 */
const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 0.6, delay, ease: EASE_OUT },
});

const SectionHeading = ({ kicker, title, description, tone = 'paper', className }) => {
  const night = tone === 'night';
  const reduceMotion = useReducedMotion();
  const enter = (delay) => (reduceMotion ? {} : fadeUp(delay));

  return (
    <div className={className}>
      {kicker ? (
        <motion.p
          {...enter(0)}
          className={cn('flex items-center gap-2 text-label font-semibold', night ? 'text-ember' : 'text-ember-text')}
        >
          <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-ember" />
          {kicker}
        </motion.p>
      ) : null}
      <RevealText
        text={title}
        className={cn(
          'display-wide max-w-[16ch] text-[2.25rem] leading-[1.0] tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]',
          night ? 'text-cream' : 'text-ink',
          kicker && 'mt-4',
        )}
      />
      {description ? (
        <motion.p
          {...enter(0.35)}
          className={cn(
            'mt-5 max-w-prose text-[18px] leading-relaxed text-pretty',
            night ? 'text-night-muted' : 'text-ink-muted',
          )}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
