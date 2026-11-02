import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import RevealText from '@/components/RevealText';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';

/*
  A cena do problema, entre o hero e a explicação do produto.

  A seção não argumenta, conta: a barraca abriu e voltou com metade do
  isopor cheio, você pediu no aplicativo e chegou morno, e vocês
  estavam a 180 metros um do outro. A virada está na última linha, e
  ela só funciona porque as duas primeiras são lidas separadas — por
  isso são duas colunas com a distância entre elas.

  As duas pontas são cenas que andam juntas, num relógio só (`night`,
  de 0 a 1, ~4,5s), que começa quando o celular do pedido entra na
  tela:
  - na barraca, o relógio da parede vai das 18h às 20h40, as lâmpadas
    do varal piscam e o vapor do pastel vai sumindo — esfriou sem
    ninguém passar;
  - no celular, o pedido passa de confirmado a entregue, os minutos
    correm até 40, a moto anda pela barra e a temperatura do pastel
    cai de 82° pra 31°.
  Os dois pastéis esfriam ao mesmo tempo, a 180 metros um do outro. É
  explicação, não enfeite. No fim aparece "Ver de novo", que roda a
  noite outra vez.

  Lâmpadas e vapor são loops: só rodam enquanto a cena está na tela.
  Com menos movimento, a noite já nasce terminada.

  Nada aqui é dado: é uma cena, e o rótulo diz isso ("uma terça
  qualquer").
*/
const DURATION = 4.5;

/* Vapor: três fios que sobem e somem, defasados. `fade` é o quanto
   ainda tem de calor (1 quente, 0 frio). */
const Steam = ({ x, y, fade, scale = 1 }) => (
  <g opacity={fade} transform={`translate(${x} ${y}) scale(${scale})`}>
    {[-6, 0, 6].map((dx, index) => (
      <path
        key={dx}
        d={`M${dx} 0 c -3 -4 3 -6 0 -10 c -3 -4 3 -6 0 -10`}
        fill="none"
        stroke="#FBF7F2"
        strokeWidth={2}
        strokeLinecap="round"
        className="animate-steam motion-reduce:animate-none"
        style={{ animationDelay: `${index * 0.6}s`, transformBox: 'fill-box', transformOrigin: 'bottom' }}
      />
    ))}
  </g>
);

const clock = (night) => {
  const minutes = 18 * 60 + Math.round(night * 160);
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
};

const StallScene = ({ night }) => (
  <svg viewBox="0 0 200 150" className="h-full w-full" aria-hidden="true">
    {/* Toldo. */}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <g key={i}>
        <rect x={20 + i * 20} y={22} width={20} height={26} fill={i % 2 ? '#FBF7F2' : '#F85A35'} />
        <circle cx={30 + i * 20} cy={48} r={10} fill={i % 2 ? '#FBF7F2' : '#F85A35'} />
      </g>
    ))}
    {/* Varal de lâmpadas, piscando fora de compasso. */}
    <path d="M30 62 Q 100 74 170 62" fill="none" stroke="#453B31" strokeWidth={1} />
    {[40, 62, 84, 106, 128, 150].map((cx, index) => (
      <circle
        key={cx}
        cx={cx}
        cy={64 + Math.sin((index / 5) * Math.PI) * 5}
        r={2.6}
        fill="#F85A35"
        className="animate-twinkle motion-reduce:animate-none"
        style={{ animationDelay: `${index * 0.37}s` }}
      />
    ))}
    <rect x={28} y={58} width={4} height={82} fill="#FBF7F2" />
    <rect x={168} y={58} width={4} height={82} fill="#FBF7F2" />
    {/* Balcão com o nome. */}
    <rect x={36} y={104} width={128} height={36} rx={4} fill="#FBF7F2" />
    <text x={100} y={127} textAnchor="middle" fontSize="12" fontWeight="800" letterSpacing="2" fill="#1D1611" className="font-sans">
      PASTEL
    </text>
    {/* Os pastéis que sobraram, esfriando, e o isopor ainda cheio. */}
    <path d="M48 104 a12 12 0 0 1 24 0 z" fill="#E9B872" />
    <path d="M70 104 a12 12 0 0 1 24 0 z" fill="#E9B872" />
    <Steam x={71} y={90} fade={1 - night} scale={0.8} />
    <rect x={112} y={80} width={40} height={24} rx={3} fill="none" stroke="#FBF7F2" strokeWidth={3} />
    <path d="M118 92 h28" stroke="#FBF7F2" strokeWidth={3} />
    {/* Relógio da noite. */}
    <text x={186} y={14} textAnchor="end" fontSize="11" fontWeight="700" fill="#A29C94" className="numeric font-sans">
      {clock(night)}
    </text>
  </svg>
);

const STAGES = [
  { until: 0.12, label: 'Confirmado' },
  { until: 0.3, label: 'Preparando' },
  { until: 0.999, label: 'A caminho' },
  { until: Infinity, label: 'Entregue' },
];

/* A tela do app de entrega, viva. Tudo sai de `night`. */
const OrderScene = ({ night }) => {
  const stage = STAGES.find((item) => night < item.until).label;
  const minutes = Math.round(night * 40);
  const temperature = Math.round(82 - night * 51);
  const cold = night > 0.7;

  return (
    <div aria-hidden="true" className="flex h-full items-center justify-center">
      <div className="flex h-full w-[150px] flex-col rounded border-2 border-cream px-3.5 py-3 sm:w-[160px]">
        <div className="flex items-center justify-between text-[10px] font-semibold">
          <span className="text-night-muted">Seu pedido</span>
          <span className="relative h-3.5 w-[64px] overflow-hidden text-right">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={stage}
                className={cn('absolute inset-0', stage === 'Entregue' ? 'text-cream' : 'text-ember')}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
              >
                {stage}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <div className="mt-auto flex items-baseline gap-1">
          <span className="numeric display-wide text-[40px] leading-none tracking-[-0.03em] text-ember sm:text-[44px]">
            {minutes}
          </span>
          <span className="text-[12px] font-bold text-cream">min</span>
        </div>

        {/* A rota: barra que enche e a moto (o ponto) andando nela. */}
        <div className="relative mt-3 h-1 rounded-full bg-[#453B31]">
          <div
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-ember"
            style={{ transform: `scaleX(${night})` }}
          />
          {/* O trilho da moto tem a largura da barra menos a dela; o
              translate em % é da própria caixa, então anda certinho
              de uma ponta à outra. */}
          <div
            className="absolute -top-[5px] left-0 right-3.5"
            style={{ transform: `translateX(${night * 100}%)` }}
          >
            <div className="h-3.5 w-3.5 rounded-full border-2 border-night bg-cream" />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between text-[11px] font-semibold">
          <span className="text-night-muted">Pastel</span>
          <span
            className="numeric transition-colors duration-500"
            style={{ color: cold ? '#A29C94' : '#F85A35' }}
          >
            {temperature}°{cold ? ' · frio' : ''}
          </span>
        </div>
        <div className="mt-1 text-[10px] text-night-muted">+ taxa de entrega</div>
      </div>
    </div>
  );
};

const sides = [
  {
    role: 'Quem vende',
    Scene: StallScene,
    lead: 'A barraca de pastel abriu às seis da tarde.',
    detail:
      'Fritou, esperou e quase ninguém passou. Voltou pra casa com metade do isopor cheio.',
  },
  {
    role: 'Quem compra',
    Scene: OrderScene,
    lead: 'A duas quadras dali, alguém com fome pediu pelo aplicativo.',
    detail: 'Pagou a taxa de entrega, esperou quarenta minutos e recebeu o pastel frio.',
  },
];

const Side = ({ side, night, looping, index, sceneRef }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex-1"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE_OUT }}
    >
      <div ref={sceneRef} className={cn('h-56 rounded bg-[#2A211A] p-4 sm:h-60', !looping && 'loops-off')}>
        <side.Scene night={night} />
      </div>
      <p className="display-wide mt-6 text-[15px] uppercase tracking-[0.04em] text-ember">
        {side.role}
      </p>
      <p className="display-wide mt-2 text-[22px] leading-[1.12] tracking-[-0.02em] text-cream text-balance sm:text-[26px]">
        {side.lead}
      </p>
      <p className="mt-3 max-w-[36ch] text-[16px] leading-relaxed text-night-muted text-pretty">
        {side.detail}
      </p>
    </motion.div>
  );
};

const Distance = ({ night }) => {
  const meters = Math.round(Math.min(1, night / 0.35) * 180);
  const drawn = Math.min(1, night / 0.35);

  return (
    <div className="relative flex items-center justify-center py-12 lg:mt-[6.5rem] lg:w-72 lg:shrink-0 lg:py-0">
      {/* Vertical no celular, horizontal no desktop. */}
      <span
        aria-hidden="true"
        style={{ transform: `scaleY(${drawn})` }}
        className="absolute inset-y-0 left-1/2 w-0.5 origin-top bg-[repeating-linear-gradient(to_bottom,#F85A35_0_8px,transparent_8px_16px)] lg:hidden"
      />
      <span
        aria-hidden="true"
        style={{ transform: `scaleX(${drawn})` }}
        className="absolute inset-x-0 top-1/2 hidden h-0.5 origin-left bg-[repeating-linear-gradient(to_right,#F85A35_0_8px,transparent_8px_16px)] lg:block"
      />
      <span className="relative flex items-baseline gap-1.5 bg-night px-3 py-1">
        <span className="numeric display-wide text-[56px] leading-none tracking-[-0.03em] text-ember">
          {meters}
        </span>
        <span className="text-label font-semibold text-night-muted">metros</span>
        <span className="sr-only">de distância</span>
      </span>
    </div>
  );
};

const NearMiss = () => {
  const ref = useRef(null);
  /* A noite começa quando o celular do pedido aparece inteiro. No
     desktop ele está ao lado da barraca, então é a cena toda; no
     celular, empilhado, ele é o último a chegar — e é ele que precisa
     ser visto andando. */
  const orderRef = useRef(null);
  const started = useInView(orderRef, { once: true, amount: 0.8 });
  const onScreen = useInView(ref);
  const reduceMotion = useReducedMotion();
  // No pré-render (sem `window`) o HTML já sai com a noite terminada.
  const [night, setNight] = useState(() =>
    typeof window === 'undefined' || reduceMotion ? 1 : 0,
  );
  const [run, setRun] = useState(0);
  const controls = useRef(null);

  const play = useCallback(() => {
    controls.current?.stop();
    controls.current = animate(0, 1, {
      duration: DURATION,
      delay: 0.3,
      ease: [0.45, 0, 0.55, 1],
      onUpdate: setNight,
    });
  }, []);

  useEffect(() => {
    if (!started) return undefined;
    if (reduceMotion) {
      setNight(1);
      return undefined;
    }
    play();
    return () => controls.current?.stop();
  }, [started, reduceMotion, play, run]);

  const done = night >= 1;

  return (
    <section className="section bg-night text-cream">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-label font-semibold text-ember">
            Uma terça qualquer, <span className="numeric">{clock(night).replace(':', 'h')}</span>
          </p>
          {/* Sempre montado: some e volta por opacidade, sem mexer
              no layout nem tirar o foco de quem acabou de clicar. */}
          {!reduceMotion ? (
            <motion.button
              type="button"
              onClick={() => {
                setNight(0);
                setRun((value) => value + 1);
              }}
              initial={false}
              animate={{ opacity: done ? 1 : 0, y: done ? 0 : 6 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              tabIndex={done ? 0 : -1}
              aria-hidden={!done || undefined}
              className={cn(
                'group flex h-9 items-center gap-1.5 rounded px-2 text-label font-semibold text-night-muted transition-colors duration-150 hover:text-cream',
                !done && 'pointer-events-none',
              )}
            >
              <RotateCcw
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 ease-out hover-fine:group-hover:-rotate-90"
              />
              Ver de novo
            </motion.button>
          ) : null}
        </div>

        <div ref={ref} className="mt-10 flex flex-col lg:mt-14 lg:flex-row lg:items-start">
          <Side side={sides[0]} night={night} looping={onScreen} index={0} />
          <Distance night={night} />
          <Side side={sides[1]} night={night} looping={onScreen} index={1} sceneRef={orderRef} />
        </div>

        <div className="mt-14 border-t border-night-line pt-10 lg:mt-20 lg:pt-14">
          <RevealText
            text="Estavam a 180 metros um do outro e nenhum dos dois sabia."
            className="display-wide max-w-[18ch] text-[2.25rem] leading-[1.0] tracking-[-0.03em] text-cream text-balance sm:text-[3rem] lg:text-[4rem]"
          />
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
            className="mt-5 max-w-[44ch] text-[18px] leading-relaxed text-night-muted"
          >
            A Barrakinha põe a barraca aberta no mapa de quem está por perto.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default NearMiss;
