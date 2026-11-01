import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import { cn } from '@/lib/utils';

/*
  "O que muda com a Barrakinha" — uma cena que a pessoa liga e desliga.

  Um botão de duas posições troca o mesmo pedaço de bairro entre o
  antes e o depois. Antes: as barracas são pinos vazios com
  interrogação, e o caminho de quem tem fome serpenteia pelo bairro
  sem chegar em lugar nenhum. Depois: as barracas acendem, e o caminho
  vira uma linha reta até a aberta mais perto. Ao lado, os quatro
  assuntos trocam de texto junto.

  Quando a seção entra na tela ela começa no antes e, se ninguém mexeu,
  vira sozinha pro depois uma vez — a explicação acontece mesmo pra
  quem só rola. Daí em diante quem manda é o botão. As molas não têm
  quique (é troca de estado, não objeto arremessado) e são
  interrompíveis: clicar no meio da troca inverte de onde está.
*/
const MODES = [
  { id: 'before', label: 'Sem a Barrakinha' },
  { id: 'after', label: 'Com a Barrakinha' },
];

const rows = [
  {
    topic: 'Achar a barraca',
    before: 'Só acha quem passa na frente do ponto.',
    after: 'Toda barraca aberta aparece no mapa, perto de você.',
  },
  {
    topic: 'Saber se abriu',
    before: 'Vai até lá pra descobrir que fechou.',
    after: 'Pino laranja é barraca aberta agora.',
  },
  {
    topic: 'Escolher',
    before: 'Cardápio e preço, só chegando lá.',
    after: 'Cardápio e preço antes de sair de casa.',
  },
  {
    topic: 'Pedir',
    before: 'Fila, troco e espera na hora.',
    after: 'Pede pelo app e retira pronto.',
  },
];

const stalls = [
  { x: 210, y: 128 },
  { x: 386, y: 74 },
  { x: 474, y: 206 },
];

const PIN_PATH = 'M0 0 C-3 -9 -13 -15 -13 -26 A13 13 0 1 1 13 -26 C13 -15 3 -9 0 0 Z';

const PATHS = {
  before:
    'M70 238 C 130 238 130 182 168 182 S 262 252 300 226 S 330 150 420 158 S 520 140 512 44',
  after: 'M70 238 L 150 238 L 150 182 L 210 182 L 210 132',
};

const spring = { type: 'spring', bounce: 0, duration: 0.45 };

const Scene = ({ mode }) => {
  const after = mode === 'after';

  return (
    <svg viewBox="0 0 560 280" className="block h-auto w-full" role="img" aria-label={after ? 'Com a Barrakinha: as barracas abertas aparecem no mapa e o caminho vai direto até a mais perto' : 'Sem a Barrakinha: ninguém sabe quais barracas abriram, e o caminho dá voltas pelo bairro'}>
      {[
        [20, 20, 110, 130], [150, 20, 120, 80], [290, 20, 110, 110], [420, 20, 120, 120],
        [20, 170, 110, 90], [170, 202, 100, 58], [290, 150, 110, 110], [420, 160, 120, 100],
      ].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={6} fill="#E8DED2" />
      ))}

      {/* O caminho de quem tem fome. Redesenha a cada troca. */}
      <motion.path
        key={mode}
        d={PATHS[mode]}
        fill="none"
        stroke={after ? '#1D1611' : '#A8A096'}
        strokeWidth={after ? 4 : 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={after ? undefined : '2 9'}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: after ? 0.7 : 1.2, ease: [0.23, 1, 0.32, 1] }}
      />

      {stalls.map((stall, index) => (
        <g key={index} transform={`translate(${stall.x} ${stall.y})`}>
          <motion.g
            initial={false}
            animate={{ scale: after ? 1 : 0.86 }}
            transition={{ ...spring, delay: after ? 0.08 * index : 0 }}
            style={{ originX: '0px', originY: '0px' }}
          >
            <motion.path
              d={PIN_PATH}
              initial={false}
              animate={{ fill: after ? '#F85A35' : '#FBF7F2', stroke: after ? '#1D1611' : '#B5ACA2' }}
              transition={{ duration: 0.25, delay: after ? 0.08 * index : 0 }}
              strokeWidth={2}
            />
            <AnimatePresence initial={false} mode="wait">
              {after ? (
                <motion.circle
                  key="dot"
                  cx={0}
                  cy={-26}
                  r={4.5}
                  fill="#FBF7F2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              ) : (
                <motion.text
                  key="q"
                  x={0}
                  y={-21}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  fill="#A8A096"
                  className="font-sans"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  ?
                </motion.text>
              )}
            </AnimatePresence>
          </motion.g>
        </g>
      ))}

      {/* Você, com fome. */}
      <circle cx={70} cy={238} r={18} fill="#1D1611" opacity={0.08} />
      <circle cx={70} cy={238} r={8} fill="#1D1611" stroke="#FBF7F2" strokeWidth={3} />
      <text x={70} y={268} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1D1611" className="font-sans">
        você
      </text>
    </svg>
  );
};

const Toggle = ({ mode, onChange }) => (
  <div role="radiogroup" aria-label="Comparar" className="inline-flex rounded border-2 border-night p-1">
    {MODES.map((option) => {
      const active = option.id === mode;
      return (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={active}
          /* Responde no toque, não na soltura. */
          onPointerDown={() => onChange(option.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') onChange(option.id);
          }}
          className={cn(
            'relative h-11 rounded-[6px] px-4 text-[15px] font-semibold transition-colors duration-150 sm:px-5',
            active ? 'text-night' : 'text-ink-muted hover:text-ink',
          )}
        >
          {active ? (
            <motion.span
              layoutId="before-after-thumb"
              className="absolute inset-0 rounded-[6px] bg-ember"
              transition={spring}
            />
          ) : null}
          <span className="relative">{option.label}</span>
        </button>
      );
    })}
  </div>
);

const BeforeAfter = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState('before');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || touched) return undefined;
    const timer = setTimeout(() => setMode('after'), reduceMotion ? 0 : 1400);
    return () => clearTimeout(timer);
  }, [inView, touched, reduceMotion]);

  const change = (next) => {
    setTouched(true);
    setMode(next);
  };

  const after = mode === 'after';

  return (
    <section id="antes-depois" className="section bg-paper">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading
          kicker="Antes e depois"
          title="O que muda com a Barrakinha"
          description="Troque a chave e veja o mesmo bairro com e sem o mapa."
        />

        <div className="mt-10">
          <Toggle mode={mode} onChange={change} />
        </div>

        <div ref={ref} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
          <figure className="overflow-hidden rounded border-2 border-night bg-[#F4EEE7] lg:col-span-7">
            <Scene mode={mode} />
          </figure>

          <ul className="border-t border-line-strong lg:col-span-5">
            {rows.map((row) => (
              <li key={row.topic} className="grid grid-cols-[1.75rem_1fr] gap-x-3 border-b border-line-strong py-5">
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-200',
                    after ? 'border-night bg-ember' : 'border-line-strong bg-transparent',
                  )}
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3">
                    {after ? (
                      <path d="M2 6.5 L5 9 L10 3" fill="none" stroke="#1D1611" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M3 3 L9 9 M9 3 L3 9" fill="none" stroke="#A8A096" strokeWidth="2" strokeLinecap="round" />
                    )}
                  </svg>
                </span>
                <div>
                  <h3 className="text-[17px] font-bold tracking-[-0.01em] text-ink">{row.topic}</h3>
                  <AnimatePresence initial={false} mode="wait">
                    <motion.p
                      key={mode}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                      className={cn('mt-1 text-[16px] leading-relaxed', after ? 'text-ink' : 'text-ink-muted')}
                    >
                      {after ? row.after : row.before}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
