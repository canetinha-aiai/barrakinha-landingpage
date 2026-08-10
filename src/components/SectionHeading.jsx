import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Cabeçalho de seção editorial: régua fina + rótulo pequeno em versalete,
 * título grande e um parágrafo curto. A régua substitui as "pills"
 * decorativas do design anterior — comunica hierarquia, não enfeite.
 */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  tone = 'dark',
  align = 'left',
  className,
}) => {
  const isLight = tone === 'light';
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
        <div
          className={cn(
            'flex items-center gap-3',
            centered && 'justify-center',
          )}
        >
          <span
            className={cn(
              'h-px w-8',
              isLight ? 'bg-ink-900/20' : 'bg-ink-500',
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              'eyebrow',
              isLight && 'text-sand-600',
            )}
          >
            {eyebrow}
          </span>
        </div>
      ) : null}

      <h2
        className={cn(
          'mt-5 max-w-3xl text-display-sm text-balance md:text-display-md',
          centered && 'mx-auto',
          isLight ? 'text-ink-900' : 'text-cream-50',
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            'mt-5 max-w-prose text-[15px] leading-relaxed text-pretty md:text-base',
            centered && 'mx-auto',
            isLight ? 'text-sand-600' : 'text-sand-400',
          )}
        >
          {description}
        </p>
      ) : null}
    </motion.div>
  );
};

export default SectionHeading;
