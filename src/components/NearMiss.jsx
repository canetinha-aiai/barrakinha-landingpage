import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';

/*
  A cena do problema, entre o hero e a explicação do produto.

  A seção não argumenta, conta: a barraca abriu e voltou com metade do
  isopor cheio, você pediu no aplicativo e chegou morno, e vocês
  estavam a 180 metros um do outro. A virada está na última linha, e
  ela só funciona porque as duas primeiras são lidas separadas — por
  isso são duas colunas com a distância entre elas.

  A distância é medida na frente do leitor: quando a cena entra na
  tela, o tracejado corre de um ponto ao outro e o número conta de 0 a
  180. É explicação, não enfeite — é a medida que transforma duas
  reclamações num desencontro. Uma vez só; com menos movimento, já
  nasce pronta.

  Nada aqui é dado: é uma cena, e o rótulo diz isso ("uma terça
  qualquer").
*/
/*
  As duas pontas da cena, cada uma com o seu desenho: a barraca (quem
  vende) e o celular esperando a entrega (quem compra). O desenho diz
  de quem é cada lado antes de qualquer palavra — o rótulo pequeno de
  antes não dava conta disso.
*/
const Stall = () => (
  <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <g key={i}>
        <rect x={20 + i * 20} y={18} width={20} height={28} fill={i % 2 ? '#FBF7F2' : '#F85A35'} />
        <circle cx={30 + i * 20} cy={46} r={10} fill={i % 2 ? '#FBF7F2' : '#F85A35'} />
      </g>
    ))}
    <rect x={28} y={56} width={4} height={74} fill="#FBF7F2" />
    <rect x={168} y={56} width={4} height={74} fill="#FBF7F2" />
    <rect x={36} y={96} width={128} height={34} rx={4} fill="#FBF7F2" />
    {/* Os pastéis que sobraram e o isopor ainda cheio. */}
    <path d="M48 96 a12 12 0 0 1 24 0 z" fill="#E9B872" />
    <path d="M70 96 a12 12 0 0 1 24 0 z" fill="#E9B872" />
    <rect x={112} y={72} width={40} height={24} rx={3} fill="none" stroke="#FBF7F2" strokeWidth={3} />
    <path d="M118 84 h28" stroke="#FBF7F2" strokeWidth={3} />
  </svg>
);

const Phone = () => (
  <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
    <rect x={68} y={6} width={64} height={128} rx={10} fill="#2A211A" stroke="#FBF7F2" strokeWidth={3} />
    <text x={100} y={34} textAnchor="middle" fontSize="9" fill="#A29C94" className="font-sans">
      Chega em
    </text>
    <text x={100} y={70} textAnchor="middle" fontSize="26" fontWeight="800" fill="#F85A35" className="font-sans">
      40
    </text>
    <text x={100} y={84} textAnchor="middle" fontSize="10" fontWeight="700" fill="#FBF7F2" className="font-sans">
      minutos
    </text>
    <rect x={80} y={100} width={40} height={4} rx={2} fill="#453B31" />
    <rect x={80} y={100} width={10} height={4} rx={2} fill="#F85A35" />
    <text x={100} y={120} textAnchor="middle" fontSize="8" fill="#A29C94" className="font-sans">
      + taxa
    </text>
  </svg>
);

const sides = [
  {
    role: 'Quem vende',
    Art: Stall,
    lead: 'A barraca de pastel abriu às seis da tarde.',
    detail:
      'Fritou, esperou e quase ninguém passou. Voltou pra casa com metade do isopor cheio.',
  },
  {
    role: 'Quem compra',
    Art: Phone,
    lead: 'A duas quadras dali, alguém com fome pediu pelo aplicativo.',
    detail: 'Pagou a taxa, esperou quarenta minutos e o pastel chegou frio.',
  },
];

const Side = ({ side }) => (
  <div className="flex-1">
    <div className="h-40 rounded bg-[#2A211A] p-4 sm:h-44">
      <side.Art />
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
  </div>
);

const Distance = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  // No pré-render (sem `window`) o HTML já sai com a medida certa.
  const [meters, setMeters] = useState(() =>
    typeof window === 'undefined' || reduceMotion ? 180 : 0,
  );

  useEffect(() => {
    if (!inView || reduceMotion) return undefined;
    const controls = animate(0, 180, {
      duration: 1.1,
      delay: 0.2,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (value) => setMeters(Math.round(value)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion]);

  const drawn = inView || reduceMotion;

  return (
    <div ref={ref} className="relative flex items-center justify-center py-12 lg:mt-[4.5rem] lg:w-52 lg:shrink-0 lg:py-0">
      {/* Vertical no celular, horizontal no desktop. */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ scaleY: drawn ? 1 : 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        style={{ originY: 0 }}
        className="absolute inset-y-0 left-1/2 w-0.5 bg-[repeating-linear-gradient(to_bottom,#F85A35_0_8px,transparent_8px_16px)] lg:hidden"
      />
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ scaleX: drawn ? 1 : 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        style={{ originX: 0 }}
        className="absolute inset-x-0 top-1/2 hidden h-0.5 bg-[repeating-linear-gradient(to_right,#F85A35_0_8px,transparent_8px_16px)] lg:block"
      />
      <span className="relative flex items-baseline gap-1.5 bg-night px-4 py-1">
        <span className="numeric display-wide text-[56px] leading-none tracking-[-0.03em] text-ember">
          {meters}
        </span>
        <span className="text-label font-semibold text-night-muted">metros</span>
        <span className="sr-only">de distância</span>
      </span>
    </div>
  );
};

const NearMiss = () => (
  <section className="section bg-night text-cream">
    <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
      <p className="text-label font-semibold text-ember">Uma terça qualquer, 20h40</p>

      <div className="mt-10 flex flex-col lg:mt-14 lg:flex-row lg:items-start">
        <Side side={sides[0]} />
        <Distance />
        <Side side={sides[1]} />
      </div>

      <div className="mt-14 border-t border-night-line pt-10 lg:mt-20 lg:pt-14">
        <h2 className="display-wide max-w-[18ch] text-[2.25rem] leading-[1.0] tracking-[-0.03em] text-cream text-balance sm:text-[3rem] lg:text-[4rem]">
          Estavam a 180 metros. Nenhum dos dois sabia do outro.
        </h2>
        <p className="mt-5 max-w-[44ch] text-[18px] leading-relaxed text-night-muted">
          A Barrakinha põe a barraca aberta no mapa de quem está por perto.
        </p>
      </div>
    </div>
  </section>
);

export default NearMiss;
