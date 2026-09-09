import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/*
  A lista de benefícios de cada bloco de público.

  Isto aqui era o componente mais genérico da página: cápsula
  `rounded-full` cinza, borda de 1px, uma frase dentro, quatro
  empilhadas. Trocando a cor, serviria pra qualquer produto de
  qualquer setor — o mesmo defeito que tirou daqui o mapa de
  pontinhos e as fichas arredondadas da faixa de dores.

  Três mudanças:

  1. Cada item ganha na aresta esquerda uma tira do TOLDO — a listra
     diagonal que é a assinatura da marca, a mesma que fecha o rodapé
     e as seções de cor cheia, só que em pé e da altura do cartão (ver
     `.awning-edge`). É o que faz a lista pertencer à Barrakinha e não
     a um kit de interface.

  2. A frase deixa de ser um bloco de texto de peso único. Cada uma
     tem um trecho que carrega o argumento — "só enquanto está
     vendendo", "antes de sair de casa" — e é esse trecho que fica em
     destaque. Quem passa o olho sem ler a lista inteira ainda leva a
     informação, que é como listas de benefício são lidas de verdade.

  3. `rounded-full` vira `rounded-2xl`. Cápsula totalmente arredondada
     lê como etiqueta ou botão; a frase aqui não é nem um nem outro, é
     uma afirmação. Canto de cartão é o que ela é.

  Os itens aceitam texto solto ou `{ text, accent }`, em que `accent`
  é o trecho de `text` que recebe o destaque. Texto solto continua
  funcionando: é o caso de quem não tem um trecho que mereça sobrar.
*/
const PillList = ({ items, tone = 'on-dark', className }) => {
  const isOnEmber = tone === 'on-ember';

  return (
    <div className={cn('flex w-full flex-col gap-2.5', className)}>
      {items.map((item, index) => {
        const text = typeof item === 'string' ? item : item.text;
        const accent = typeof item === 'string' ? null : item.accent;

        /* Parte a frase no trecho de destaque. `indexOf` e não regex:
           o trecho vem escrito à mão no mesmo arquivo da frase, então
           é literal — e regex sobre texto com acento e pontuação é
           bug esperando pra acontecer. */
        const at = accent ? text.indexOf(accent) : -1;
        const head = at >= 0 ? text.slice(0, at) : text;
        const tail = at >= 0 ? text.slice(at + accent.length) : '';

        return (
          <motion.div
            key={text}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.55,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              'relative w-full cursor-default select-none overflow-hidden rounded-2xl py-3.5 pl-[26px] pr-5 text-[14.5px] leading-snug transition-all duration-300 sm:text-[15.5px]',
              isOnEmber
                ? 'bg-white text-ink-900 shadow-[0_8px_20px_rgba(90,26,8,0.18)]'
                : 'bg-white/[0.045] text-sand-200 ring-1 ring-inset ring-white/[0.07] hover:bg-white/[0.07]',
            )}
          >
            {/* A tira de toldo na aresta. `aria-hidden` porque é
                marca, não conteúdo — quem ouve a página não perde
                nada sem ela. */}
            <span
              aria-hidden="true"
              className="awning-edge absolute inset-y-0 left-0 w-[7px]"
            />

            {at >= 0 ? (
              <>
                {head}
                <strong
                  className={cn(
                    'font-semibold',
                    isOnEmber ? 'text-ember-700' : 'text-paper',
                  )}
                >
                  {accent}
                </strong>
                {tail}
              </>
            ) : (
              text
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default PillList;
