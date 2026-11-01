import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/*
  O argumento da seção desenhado: um pedaço de bairro com as barracas
  como pinos. Quando o mapa entra na tela, as abertas aparecem uma a
  uma, as fechadas ficam apagadas — e um segundo depois uma delas abre.
  É a frase "você vê quem está vendendo agora" acontecendo, sem
  legenda.

  Toca uma vez só. Os pinos caem com mola e um pouco de quique: um
  pino espetado no mapa tem peso. Aberta é pino laranja cheio com nome
  em negrito; fechada é o mesmo pino vazio, em cinza claro — a
  diferença está na cor, sem texto extra em cima do mapa.

  Os nomes são tipos de comida, não barracas inventadas.
*/
const pins = [
  { x: 112, y: 104, label: 'Pastel', open: true },
  { x: 334, y: 92, label: 'Espetinho', open: true },
  { x: 406, y: 222, label: 'Açaí', open: false },
  { x: 90, y: 280, label: 'Tapioca', open: false, opensLater: true },
  { x: 246, y: 310, label: 'Churros', open: true },
];

const blocks = [
  [24, 24, 132, 96], [180, 24, 120, 70], [324, 24, 132, 120],
  [24, 144, 132, 72], [180, 118, 120, 120], [324, 168, 132, 72],
  [24, 240, 132, 96], [180, 262, 120, 74], [324, 264, 132, 72],
];

/* Pino de mapa com a ponta em (0, 0) e a cabeça em (0, -26). */
const PIN_PATH = 'M0 0 C-3 -9 -13 -15 -13 -26 A13 13 0 1 1 13 -26 C13 -15 3 -9 0 0 Z';

const Pin = ({ pin, index, active, lateOpen }) => {
  const isOpen = pin.open || (pin.opensLater && lateOpen);
  const justOpened = pin.opensLater && lateOpen;

  return (
    <g transform={`translate(${pin.x} ${pin.y})`}>
      {/* O pino cai no lugar: entra de cima e assenta com um quique
          curto, como um alfinete espetado no mapa. */}
      <motion.g
        initial={{ y: -28, opacity: 0 }}
        animate={active ? { y: 0, opacity: 1 } : undefined}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.55, delay: 0.15 + index * 0.12 }}
      >
        {justOpened ? (
          <motion.circle
            cx={0}
            cy={-26}
            r={13}
            fill="none"
            stroke="#F85A35"
            strokeWidth={2}
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            style={{ originX: '0px', originY: '-26px' }}
          />
        ) : null}
        <motion.g
          animate={justOpened ? { scale: [1, 1.18, 1] } : undefined}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{ originX: '0px', originY: '0px' }}
        >
          <path
            d={PIN_PATH}
            fill={isOpen ? '#F85A35' : '#FBF7F2'}
            stroke={isOpen ? '#1D1611' : '#B5ACA2'}
            strokeWidth={isOpen ? 2 : 1.5}
            style={{ transition: 'fill 200ms ease, stroke 200ms ease' }}
          />
          <circle cx={0} cy={-26} r={4.5} fill={isOpen ? '#FBF7F2' : '#D9D0C5'} />
        </motion.g>
        <text
          x={0}
          y={18}
          textAnchor="middle"
          className="font-sans"
          fontSize="13"
          fontWeight={isOpen ? 700 : 500}
          fill={isOpen ? '#1D1611' : '#9A9188'}
        >
          {pin.label}
        </text>
      </motion.g>
    </g>
  );
};

/* A legenda usa o mesmo desenho do pino, em miniatura. */
const LegendPin = ({ open }) => (
  <svg viewBox="-15 -42 30 44" className="h-5 w-4" aria-hidden="true">
    <path
      d={PIN_PATH}
      fill={open ? '#F85A35' : '#FBF7F2'}
      stroke={open ? '#1D1611' : '#B5ACA2'}
      strokeWidth={open ? 2 : 1.5}
    />
    <circle cx={0} cy={-26} r={4.5} fill={open ? '#FBF7F2' : '#D9D0C5'} />
  </svg>
);

const LiveMap = ({ className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const active = inView || reduceMotion;
  const [lateOpen, setLateOpen] = useState(false);

  useEffect(() => {
    if (!active) return undefined;
    const timer = setTimeout(() => setLateOpen(true), reduceMotion ? 0 : 1600);
    return () => clearTimeout(timer);
  }, [active, reduceMotion]);

  return (
    <figure ref={ref} className={cn('overflow-hidden rounded border-2 border-night bg-[#F4EEE7]', className)}>
      <svg viewBox="0 0 480 360" className="block h-auto w-full" role="img" aria-label="Mapa de um bairro com barracas de comida: pastel, espetinho e churros abertas, açaí fechada, e a tapioca abrindo agora">
        {blocks.map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={6} fill="#E8DED2" />
        ))}
        {/* A praça. */}
        <rect x={186} y={124} width={108} height={108} rx={6} fill="#DCE8D2" />

        {/* Você. */}
        <circle cx={240} cy={178} r={22} fill="#1D1611" opacity={0.08} />
        <circle cx={240} cy={178} r={8} fill="#1D1611" stroke="#FBF7F2" strokeWidth={3} />
        <text x={240} y={212} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1D1611" className="font-sans">
          você
        </text>

        {pins.map((pin, index) => (
          <Pin key={pin.label} pin={pin} index={index} active={active} lateOpen={lateOpen} />
        ))}
      </svg>
      <figcaption className="flex items-center gap-5 border-t-2 border-night bg-[#FBF7F2] px-4 py-3 text-[13px] font-semibold text-[#1D1611]">
        <span className="flex items-center gap-1.5">
          <LegendPin open />
          aberta agora
        </span>
        <span className="flex items-center gap-1.5 text-[#6B6560]">
          <LegendPin />
          fechada
        </span>
      </figcaption>
    </figure>
  );
};

export default LiveMap;
