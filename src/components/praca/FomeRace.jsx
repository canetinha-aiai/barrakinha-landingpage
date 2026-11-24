import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { FOOD_ICONS } from '@/components/FoodIcons';
import MorphLogo from '@/components/fluid/MorphLogo';
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

/* A motinha do delivery: desenho chapado com duas faces na caixa, no
   mesmo traço isométrico da praça. Entra quando o entregador sai. */
const Moto = () => (
  <svg viewBox="0 0 120 84" className="h-full w-full overflow-visible">
    <ellipse cx="60" cy="78" rx="48" ry="4" fill="#000" opacity="0.25" />
    {/* caixa de entrega: face da frente, lado e topo */}
    <polygon points="4,12 36,12 40,8 8,8" fill="#F1EBE0" />
    <rect x="4" y="12" width="32" height="26" rx="2" fill="#D9D1C3" />
    <polygon points="36,12 40,8 40,34 36,38" fill="#A39B8C" />
    <rect x="9" y="21" width="22" height="3" rx="1.5" fill="#8A8478" />
    {/* corpo e banco */}
    <path d="M30 44 L62 44 L66 52 L84 52 L90 66 L46 66 Z" fill="#B9B2A5" />
    <rect x="30" y="38" width="36" height="7" rx="3" fill="#4A4540" />
    {/* piloto */}
    <path d="M52 38 L56 20 L68 20 L70 32 L86 30" fill="none" stroke="#6B645A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="63" cy="12" r="7" fill="#4A4540" />
    <rect x="63" y="10" width="8" height="4" rx="2" fill="#F1EBE0" opacity="0.8" />
    {/* garfo e guidão */}
    <path d="M88 30 L96 66" stroke="#D9D1C3" strokeWidth="4" strokeLinecap="round" />
    <path d="M84 28 L94 28" stroke="#D9D1C3" strokeWidth="4" strokeLinecap="round" />
    {/* rodas */}
    {[28, 98].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy="66" r="12" fill="#26221E" stroke="#D9D1C3" strokeWidth="3" />
        <circle cx={cx} cy="66" r="3.5" fill="#D9D1C3" />
      </g>
    ))}
  </svg>
);

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
        'relative rounded p-5 sm:p-8', 'pb-24 sm:pb-8',
        lane.ours ? 'bg-paper text-ink' : 'border border-night-line bg-night text-cream',
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="display-wide text-[22px] leading-none tracking-[-0.02em] sm:text-[28px]">{lane.title}</h3>
        <span className={cn('text-[14px] font-semibold', lane.ours ? 'text-ember-text' : 'text-night-muted')}>
          {done ? (lane.ours ? 'Pronto' : 'Entregue') : lane.ours ? 'Andando' : 'Esperando'}
        </span>
      </div>

      {/* pista */}
      <div className={cn('relative mt-5 h-2 rounded-full sm:mt-6', lane.ours ? 'bg-ink/10' : 'bg-cream/10')}>
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
              lane.ours ? 'border-ember bg-paper' : 'border-cream/80 bg-night',
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
                      ? 'border-ember bg-ember text-paper'
                      : 'border-ink/25'
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
                  on ? 'opacity-100' : lane.ours ? 'text-ink-muted' : 'text-night-muted',
                  lane.ours && 'font-medium',
                )}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>

      {/* a motinha entra quando o entregador sai */}
      {!lane.ours ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-4 h-20 w-28 sm:bottom-6 sm:right-6 sm:h-24 sm:w-36"
          initial={false}
          animate={reached >= 4 ? { x: 0, opacity: 1 } : { x: -40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        >
          <Moto />
        </motion.div>
      ) : null}

      {/* o prêmio: o pastel pula na pista da Barrakinha */}
      {lane.ours ? (
        <MorphLogo
          size={112}
          start="view"
          label="Barrakinha"
          className="pointer-events-none absolute bottom-4 right-4 h-20 w-20 -rotate-12 text-ember-text sm:bottom-6 sm:right-6 sm:h-28 sm:w-28"
        />
      ) : null}

      {lane.ours ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-20 right-24 h-14 w-14 sm:bottom-24 sm:right-6 sm:h-20 sm:w-20"
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
