import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import MorphLogo from '@/components/fluid/MorphLogo';
import { cn } from '@/lib/utils';
import { Bell, Banknote, Bike, Clock, HandPlatter, Home, MapPin, PackageCheck, Smartphone } from 'lucide-react';

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
    steps: [
      'Abre o app e **vê quem está aberto**',
      'Pede e paga no Pix, **sem endereço e sem taxa**',
      'Espera o preparo, **sem ficar parado**',
      'O app **avisa quando fica pronto**',
      'Busca e come **na hora**',
    ],
    icons: [MapPin, Banknote, Clock, Bell, HandPlatter],
    /* termina na metade da rolagem */
    end: 0.5,
    ours: true,
  },
  {
    key: 'delivery',
    title: 'Pelo delivery',
    steps: [
      'Abre o app',
      'Cadastra o endereço',
      'Escolhe e paga, com taxa de entrega',
      'Espera o preparo',
      'O entregador te procura na praça',
      'Pedido entregue',
    ],
    icons: [Smartphone, Home, Banknote, Clock, Bike, PackageCheck],
    /* chega ao fim, mas só no último trecho da rolagem: a Barrakinha já
       estava comendo há muito tempo. */
    end: 0.9,
  },
];

/* A motinha do delivery: formas chapadas, no mesmo traço das comidas e
   da barraca (sem contorno, sem degradê). Entra quando o entregador sai. */
const Moto = () => (
  <svg viewBox="0 0 96 64" className="h-full w-full overflow-visible">
    <ellipse cx="48" cy="60" rx="40" ry="3" fill="#000" opacity="0.2" />
    {/* caixa de entrega */}
    <rect x="4" y="10" width="28" height="22" rx="3" fill="#FFC23D" />
    <rect x="4" y="10" width="28" height="7" rx="3" fill="#C98A12" opacity="0.45" />
    {/* corpo, banco e escudo da frente */}
    <rect x="16" y="30" width="40" height="14" rx="7" fill="#FBF7F2" />
    <rect x="22" y="26" width="22" height="6" rx="3" fill="#4A4540" />
    <path d="M58 18 L66 18 L72 44 L62 44 Z" fill="#FBF7F2" />
    <line x1="68" y1="30" x2="76" y2="48" stroke="#FBF7F2" strokeWidth="4" strokeLinecap="round" />
    {/* guidão e farol */}
    <rect x="56" y="13" width="12" height="4" rx="2" fill="#4A4540" />
    <circle cx="71" cy="22" r="3" fill="#FFC23D" />
    {/* piloto */}
    <path d="M40 26 L44 16 L54 16 L56 26 Z" fill="#8A8478" />
    <line x1="52" y1="19" x2="62" y2="15" stroke="#8A8478" strokeWidth="4" strokeLinecap="round" />
    <circle cx="47" cy="10" r="6" fill="#BDB5A8" />
    {/* rodas */}
    {[20, 76].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy="48" r="11" fill="#26221E" />
        <circle cx={cx} cy="48" r="4" fill="#FBF7F2" />
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
  const width = useTransform(smooth, (v) => `${(still ? 1 : v) * 100}%`);

  return (
    <div
      className={cn(
        'relative rounded p-3 pb-16 sm:p-8 sm:pb-8',
        lane.ours ? 'bg-paper text-ink' : 'border border-night-line bg-night text-cream',
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="display-wide text-[15px] leading-none tracking-[-0.02em] sm:text-[28px]">{lane.title}</h3>
        <span className={cn('text-[11px] font-semibold sm:text-[14px]', lane.ours ? 'text-ember-text' : 'text-night-muted')}>
          {done ? (lane.ours ? 'Pronto' : 'Entregue') : lane.ours ? 'Andando' : 'Esperando'}
        </span>
      </div>

      {/* pista */}
      <div className={cn('relative mt-3 h-2 rounded-full sm:mt-6', lane.ours ? 'bg-ink/10' : 'bg-cream/10')}>
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
              '-ml-2.5 h-5 w-5 rounded-full border-[3px] sm:-ml-3 sm:h-6 sm:w-6',
              lane.ours ? 'border-ember bg-paper' : 'border-cream/80 bg-night',
            )}
          />
        </motion.div>
      </div>

      <ol className="mt-4 space-y-2.5 sm:mt-7 sm:space-y-3">
        {lane.steps.map((step, i) => {
          const on = i < reached;
          return (
            <li key={step} className="flex items-center gap-2 sm:gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  'grid h-6 w-6 shrink-0 sm:h-8 sm:w-8 place-items-center rounded-full border-2 transition-colors duration-300',
                  lane.ours
                    ? on
                      ? 'border-ember bg-ember text-paper'
                      : 'border-ink/25 text-ink-muted'
                    : on
                      ? 'border-cream/70 bg-cream/70 text-night'
                      : 'border-cream/35 text-night-muted',
                )}
              >
                {React.createElement(lane.icons[i], { className: 'h-3 w-3 sm:h-4 sm:w-4', strokeWidth: 2.2 })}
              </span>
              <span
                className={cn(
                  'text-[12.5px] leading-tight transition-opacity duration-300 sm:text-[17px] sm:leading-snug',
                  /* passo que ainda não chegou: mais claro, mas legível
                     (contraste ~4,5:1 nos dois fundos) */
                  on ? 'opacity-100' : lane.ours ? 'text-ink-muted' : 'text-night-muted',
                  lane.ours && 'font-medium',
                )}
              >
                {step.split('**').map((part, k) =>
                  k % 2 ? (
                    <strong key={k} className="font-bold text-ember-text">
                      {part}
                    </strong>
                  ) : (
                    part
                  ),
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {/* a motinha entra quando o entregador sai */}
      {!lane.ours ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-2 h-12 w-16 sm:bottom-6 sm:right-6 sm:h-24 sm:w-36"
          initial={false}
          animate={reached >= 5 ? { x: 0, opacity: 1 } : { x: -40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        >
          <Moto />
        </motion.div>
      ) : null}

      {lane.ours ? (
        <MorphLogo
          size={112}
          start="view"
          label="Barrakinha"
          className="pointer-events-none absolute bottom-2 right-2 h-14 w-14 -rotate-12 text-ember-text sm:bottom-6 sm:right-6 sm:h-28 sm:w-28"
        />
      ) : null}
    </div>
  );
};

const FomeRace = () => {
  const ref = useRef(null);
  const innerRef = useRef(null);
  const gridRef = useRef(null);
  const reduce = useReducedMotion();
  /* Telas baixas (celular): o conteúdo não cabe na tela, então a seção
     não prende; a corrida anda conforme os cards passam pela tela. */
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const measure = () => {
      const h = innerRef.current?.firstElementChild?.getBoundingClientRect().height ?? 0;
      setCompact(h + 120 > window.innerHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const sticky = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress;
  const flow = useScroll({ target: gridRef, offset: ['start 75%', 'end 55%'] }).scrollYProgress;
  const progress = useMotionValue(0);
  useMotionValueEvent(sticky, 'change', (v) => {
    if (!compact) progress.set(v);
  });
  useMotionValueEvent(flow, 'change', (v) => {
    if (compact) progress.set(v);
  });
  useEffect(() => {
    progress.set((compact ? flow : sticky).get());
  }, [compact, flow, sticky, progress]);

  const still = reduce;
  const pinned = !reduce && !compact;

  return (
    <section
      ref={ref}
      aria-labelledby="corrida-titulo"
      className={cn('relative bg-night text-cream', pinned ? 'h-[260vh]' : '')}
    >
      <div ref={innerRef} className={cn(pinned ? 'sticky top-0 flex min-h-screen items-center pb-6 pt-20 sm:py-24' : 'section')}>
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
          <div ref={gridRef} className="mt-6 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-5">
            {LANES.map((lane) => (
              <Lane key={lane.key} lane={lane} progress={progress} still={still} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FomeRace;
