import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Cabeçalho de seção: título e, quando faz falta, uma frase de apoio.
 *
 * O rótulo em CAIXA ALTA com régua fina que abria cada seção saiu. Ele
 * dizia "Pra quem come" logo acima de um título que já dizia a mesma
 * coisa, e repetido em quatro seções virava moldura — o olho aprende a
 * pular. Sem ele, o título abre a seção sozinho, que é o trabalho dele.
 */
const SectionHeading = ({
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
      {/* Tamanho fluido, não fixo por tier de largura.
          Este título abre as três seções que precisam caber inteiras
          numa tela — celular ou PC — sem rolar. A primeira tentativa
          travava um tamanho por breakpoint de largura; pra caber no
          celular mais baixo (SE, 667px de altura) esse tamanho saiu
          pequeno demais — e como largura não sabe nada sobre altura,
          ficou do mesmo jeito pequeno num celular alto ou num monitor,
          onde sobra espaço de verdade.

          `clamp(mín, valor-fluido-em-vh, máx)` resolve isso: o
          tamanho cresce com a altura da tela, não com a largura. Em
          667px de altura ele fica perto do mínimo (26px, o que já
          provou caber); num celular alto ou PC ele sobe até o teto de
          40px — sem nunca estourar a seção, porque é a própria altura
          da tela que dirige o cálculo. */}
      <h2
        className={cn(
          'max-w-3xl text-[clamp(26px,4.2vh,40px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance',
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
