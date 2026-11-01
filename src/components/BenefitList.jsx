import React from 'react';
import { cn } from '@/lib/utils';

/*
  A lista de benefícios de cada público: linhas numeradas separadas
  por filete, como um índice. O número vai em letra larga, no laranja
  de texto — é ele que dá o ritmo da lista e põe a marca nela.

  `tone="night"` é a versão pra seção escura.
*/
const BenefitList = ({ items, tone = 'paper', className }) => {
  const night = tone === 'night';

  return (
    <ol className={cn('border-t', night ? 'border-night-line' : 'border-line-strong', className)}>
      {items.map((item, index) => (
        <li
          key={item.title}
          className={cn(
            'grid grid-cols-[3rem_1fr] gap-x-4 border-b py-6 sm:grid-cols-[4rem_1fr]',
            night ? 'border-night-line' : 'border-line-strong',
          )}
        >
          <span
            className={cn(
              'numeric display-wide text-[28px] leading-none tracking-[-0.02em]',
              night ? 'text-ember' : 'text-ember-text',
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
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
        </li>
      ))}
    </ol>
  );
};

export default BenefitList;
