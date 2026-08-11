import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Cabeçalho de seção: régua fina + rótulo curto + título.
 *
 * A descrição virou opcional e ficou limitada a uma frase. O trabalho
 * de explicar passou pros próprios componentes — ícone, número, ordem —
 * em vez de parágrafo de apoio embaixo de cada título.
 */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  tone = 'light',
  align = 'left',
  className,
}) => {
  const isDark = tone === 'dark';
  const centered = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(centered && 'mx-auto text-center', className)}
    >
      {eyebrow ? (
        <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
          <span
            className={cn('h-px w-8', isDark ? 'bg-ink-700' : 'bg-paper-200')}
            aria-hidden="true"
          />
          <span className={cn('eyebrow', isDark && 'text-sand-400')}>{eyebrow}</span>
        </div>
      ) : null}

      {/* 32px no celular e só depois o display-sm: 40px com 20px de
          margem lateral quebra mal em telas de 375px. */}
      <h2
        className={cn(
          'mt-5 max-w-3xl text-[32px] font-extrabold leading-[0.98] tracking-[-0.04em] text-balance',
          'sm:text-display-sm md:text-display-md',
          centered && 'mx-auto',
          isDark ? 'text-paper' : 'text-ink-900',
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            'mt-5 max-w-prose text-[16px] leading-relaxed text-pretty',
            centered && 'mx-auto',
            isDark ? 'text-sand-300' : 'text-ink-600',
          )}
        >
          {description}
        </p>
      ) : null}
    </motion.div>
  );
};

export default SectionHeading;
