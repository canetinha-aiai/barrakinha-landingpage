import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { FOOD_ICONS } from '@/components/FoodIcons';
import { cn } from '@/lib/utils';

/*
  "A corrida da fome": a mesma fome, na mesma praça, por dois caminhos.

  A seção é alta (260vh) e o conteúdo fica preso na tela; a rolagem é o
  relógio, e a página só segue depois que as duas pistas terminaram. A
  Barrakinha tem quatro passos curtos e termina com o pastel na mão
  antes da metade; o delivery tem mais passos e só entrega no fim.

  Nada de minutos do lado do delivery: o tempo de entrega muda com
  loja, horário e distância, e a gente não tem como provar um número.
  A cena fala por si.

  Com "menos movimento" a seção não prende a tela: mostra o estado
  final das duas pistas, uma embaixo da outra.
*/

const LANES = [
  {
    key: 'barrakinha',
    title: 'Pela Barrakinha',
    steps: ['Abriu o app', 'Viu o pastel a 80 m', 'Pediu e pagou no Pix', 'Pastel na mão'],
    /* termina na metade da rolagem */
    end: 0.5,
    ours: true,
  },
  {
    key: 'delivery',
    title: 'Pelo delivery',
    steps: [
      'Abriu o app',
      'Achou um restaurante que entrega aí',
      'Esperou o preparo',
      'Entregador a caminho',
      'Entregador procurando você na praça',
      'Pedido entregue',
    ],
    /* chega ao fim, mas só no último trecho da rolagem: a Barrakinha já
       estava comendo há muito tempo. */
    end: 0.9,
  },
];

const Lane = ({ lane, progress, still }) => {
  const fill = useTransform(progress, [0.05, lane.end], [0, 1], { clamp: true });
  const smooth = useSpring(fill, { stiffness: 140, damping: 26 });
  const [reached, setReached] = useState(still ? lane.steps.length : 0);
  const n = lane.steps.length;

  useMotionValueEvent(fill, 'change', (v) => {
    if (still) return;
    setReached(Math.min(n, Math.floor(v * (n - 1) + 1.0001)));
  });

  const done = reached >= n;
  const sweet = lane.ours && done;
  const width = useTransform(smooth, (v) => `${(still ? 1 : v) * 100}%`);
  const Pastel = FOOD_ICONS.Pastel;

  return (
    <div
      className={cn(
        'relative rounded p-5 sm:p-8',
        lane.ours ? 'border-2 border-ember bg-ember/[0.12] text-cream' : 'border border-night-line bg-night text-cream',
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="display-wide text-[22px] leading-none tracking-[-0.02em] sm:text-[28px]">{lane.title}</h3>
        <span className={cn('text-[14px] font-semibold', lane.ours ? 'text-ember' : 'text-night-muted')}>
          {done ? (lane.ours ? 'Pronto' : 'Entregue') : lane.ours ? 'Andando' : 'Esperando'}
        </span>
      </div>

      {/* pista */}
      <div className={cn('relative mt-5 h-2 rounded-full sm:mt-6', 'bg-cream/10')}>
        <motion.div
          className={cn('absolute inset-y-0 left-0 rounded-full', lane.ours ? 'bg-ember' : 'bg-cream/60')}
          style={{ width }}
        />
        {/* o "você" que anda na pista */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: width }}
        >
          <div
            className={cn(
              '-ml-3 h-6 w-6 rounded-full border-[3px]',
              lane.ours ? 'border-ember bg-night' : 'border-cream/80 bg-night',
            )}
          />
        </motion.div>
      </div>

      <ol className="mt-5 space-y-2 sm:mt-7 sm:space-y-3">
        {lane.steps.map((step, i) => {
          const on = i < reached;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300',
                  lane.ours
                    ? on
                      ? 'border-ember bg-ember text-night'
                      : 'border-cream/35'
                    : on
                      ? 'border-cream/70 bg-cream/70 text-night'
                      : 'border-cream/35',
                )}
              >
                {on ? (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                    <motion.path
                      d="M3.5 8.5l3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={still ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.35 }}
                    />
                  </svg>
                ) : null}
              </span>
              <span
                className={cn(
                  'text-[15px] leading-snug transition-opacity duration-300 sm:text-[17px]',
                  /* passo que ainda não chegou: mais claro, mas legível
                     (contraste ~4,5:1 nos dois fundos) */
                  on ? 'opacity-100' : 'text-night-muted',
                  lane.ours && 'font-medium',
                )}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>

      {/* o prêmio: o pastel pula na pista da Barrakinha */}
      {lane.ours ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-4 right-3 h-20 w-20 sm:-bottom-6 sm:right-6 sm:h-28 sm:w-28"
          initial={false}
          animate={sweet ? { scale: 1, rotate: -12, opacity: 1 } : { scale: 0.2, rotate: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 14 }}
        >
          <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible drop-shadow-none">
            <Pastel />
          </svg>
        </motion.div>
      ) : null}
    </div>
  );
};

const FomeRace = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section
      ref={ref}
      aria-labelledby="corrida-titulo"
      className={cn('relative bg-night text-cream', reduce ? '' : 'h-[260vh]')}
    >
      <div className={cn(reduce ? 'section' : 'sticky top-0 flex min-h-screen items-center pb-6 pt-20 sm:py-24')}>
        <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
          <h2
            id="corrida-titulo"
            className="display-wide max-w-[18ch] text-[1.9rem] leading-[1.0] tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]"
          >
            Mesma fome, mesma praça, dois caminhos.
          </h2>
          <p className="mt-4 hidden max-w-[46ch] text-[17px] leading-relaxed text-night-muted sm:block">
            Role a página e acompanhe os dois pedidos ao mesmo tempo.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2">
            {LANES.map((lane) => (
              <Lane key={lane.key} lane={lane} progress={scrollYProgress} still={reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FomeRace;
