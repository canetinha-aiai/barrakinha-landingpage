import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Cabeçalho de seção: rótulo curto, título em letra larga e, quando
 * faz falta, uma frase de apoio.
 *
 * O rótulo diz de quem é a seção ("Pra quem vende"), coisa que o
 * título sozinho não diz. `tone="night"` é a versão pra seção escura.
 */
const SectionHeading = ({ kicker, title, description, tone = 'paper', className }) => {
  const night = tone === 'night';

  return (
    <div className={className}>
      {kicker ? (
        <p className={cn('text-label font-semibold', night ? 'text-ember' : 'text-ember-text')}>
          {kicker}
        </p>
      ) : null}
      <h2
        className={cn(
          'display-wide max-w-[16ch] text-[2.25rem] leading-[1.0] tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]',
          night ? 'text-cream' : 'text-ink',
          kicker && 'mt-4',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-5 max-w-prose text-[18px] leading-relaxed text-pretty',
            night ? 'text-night-muted' : 'text-ink-muted',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
