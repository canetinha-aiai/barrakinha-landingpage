import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE_OUT, useFinePointer } from '@/lib/motion';
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

  Depois disso o mapa é de quem está lendo: tocar (ou passar o mouse
  em) um pino desenha o caminho a pé de "você" até ele, com a
  distância e o tempo — ou avisa que está fechada. A tapioca que acabou
  de abrir já vem escolhida, pra mostrar que dá pra tocar. O "você"
  emite uma onda contínua, só enquanto o mapa está na tela.
*/
const pins = [
  { x: 112, y: 104, label: 'Pastel', open: true },
  { x: 334, y: 92, label: 'Espetinho', open: true },
  { x: 406, y: 222, label: 'Açaí', open: false },
  { x: 90, y: 280, label: 'Tapioca', open: false, opensLater: true, bubbleBelow: true },
  { x: 246, y: 310, label: 'Churros', open: true },
];

const blocks = [
  [24, 24, 132, 96], [180, 24, 120, 70], [324, 24, 132, 120],
  [24, 144, 132, 72], [180, 118, 120, 120], [324, 168, 132, 72],
  [24, 240, 132, 96], [180, 262, 120, 74], [324, 264, 132, 72],
];

/* Pino de mapa com a ponta em (0, 0) e a cabeça em (0, -26). */
export const PIN_PATH = 'M0 0 C-3 -9 -13 -15 -13 -26 A13 13 0 1 1 13 -26 C13 -15 3 -9 0 0 Z';

const ME = { x: 240, y: 178 };

/* Caminho pelas ruas: anda na horizontal e depois na vertical. Cada
   pixel do desenho vale 1,5 m; 80 m por minuto a pé. */
const routeTo = (pin) => `M${ME.x} ${ME.y} L${pin.x} ${ME.y} L${pin.x} ${pin.y - 2}`;
const walk = (pin) => {
  const meters = Math.round(((Math.abs(pin.x - ME.x) + Math.abs(pin.y - ME.y)) * 1.5) / 10) * 10;
  return { meters, minutes: Math.max(1, Math.round(meters / 80)) };
};

const Pin = ({ pin, index, active, lateOpen, selected, onSelect, fine }) => {
  const isOpen = pin.open || (pin.opensLater && lateOpen);
  const justOpened = pin.opensLater && lateOpen;

  return (
    <g
      transform={`translate(${pin.x} ${pin.y})`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${pin.label}: ${isOpen ? `aberta, ${walk(pin).minutes} min a pé` : 'fechada'}`}
      onClick={() => onSelect(pin.label)}
      onPointerEnter={fine ? () => onSelect(pin.label) : undefined}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(pin.label);
        }
      }}
      className="cursor-pointer outline-none [&:focus-visible_path]:stroke-[3]"
    >
      {/* Área de toque maior que o desenho. */}
      <circle cx={0} cy={-14} r={26} fill="transparent" />
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
          animate={justOpened ? { scale: [1, 1.18, 1] } : { scale: selected ? 1.15 : 1 }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
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

/* O balão em cima do pino escolhido (embaixo quando em cima ele
   cobriria o "você"). Entra com 6px de deslocamento vindo do pino. */
const Bubble = ({ pin, open }) => {
  const { minutes, meters } = walk(pin);
  const text = open ? `${minutes} min a pé · ${meters} m` : 'Fechada agora';
  const width = open ? 140 : 108;
  const above = !pin.bubbleBelow;
  const y = above ? -78 : 30;
  const x = Math.min(Math.max(-width / 2, 14 - pin.x), 466 - pin.x - width);

  return (
    <motion.g
      transform={`translate(${pin.x} ${pin.y})`}
      pointerEvents="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
    >
      <motion.g
        initial={{ y: above ? 6 : -6 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
      >
        <rect x={x} y={y} width={width} height={34} rx={10} fill={open ? '#1D1611' : '#FBF7F2'} stroke="#1D1611" strokeWidth={2} />
        <text x={x + width / 2} y={y + 22} textAnchor="middle" fontSize="13" fontWeight="700" fill={open ? '#FBF7F2' : '#6B6560'} className="font-sans">
          {text}
        </text>
      </motion.g>
    </motion.g>
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
  const onScreen = useInView(ref);
  const fine = useFinePointer();
  const [lateOpen, setLateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!active) return undefined;
    const timer = setTimeout(() => {
      setLateOpen(true);
      setSelected((current) => current ?? 'Tapioca');
    }, reduceMotion ? 0 : 1600);
    return () => clearTimeout(timer);
  }, [active, reduceMotion]);

  const chosen = pins.find((pin) => pin.label === selected);
  const chosenOpen = chosen && (chosen.open || (chosen.opensLater && lateOpen));

  return (
    <figure ref={ref} className={cn('overflow-hidden rounded border-2 border-night bg-[#F4EEE7]', className)}>
      <svg viewBox="0 0 480 360" className="block h-auto w-full" role="img" aria-label="Mapa de um bairro com barracas de comida: pastel, espetinho e churros abertas, açaí fechada, e a tapioca abrindo agora">
        {blocks.map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={6} fill="#E8DED2" />
        ))}
        {/* A praça. */}
        <rect x={186} y={124} width={108} height={108} rx={6} fill="#DCE8D2" />

        {/* O caminho a pé até a barraca escolhida, redesenhado a cada
            troca. Só pra aberta: pra fechada não há aonde ir. */}
        <AnimatePresence>
          {chosen && chosenOpen ? (
            <motion.path
              key={chosen.label}
              d={routeTo(chosen)}
              fill="none"
              stroke="#1D1611"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 7"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            />
          ) : null}
        </AnimatePresence>

        {/* Você, com uma onda saindo — só enquanto o mapa está na tela. */}
        <circle
          cx={240}
          cy={178}
          r={22}
          fill="#1D1611"
          opacity={0.08}
          className={cn('animate-ripple motion-reduce:animate-none', !onScreen && 'loops-off')}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <circle cx={240} cy={178} r={8} fill="#1D1611" stroke="#FBF7F2" strokeWidth={3} />
        <text x={240} y={212} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1D1611" className="font-sans">
          você
        </text>

        {pins.map((pin, index) => (
          <Pin
            key={pin.label}
            pin={pin}
            index={index}
            active={active}
            lateOpen={lateOpen}
            selected={selected === pin.label}
            onSelect={setSelected}
            fine={fine}
          />
        ))}

        <AnimatePresence>
          {chosen ? <Bubble key={chosen.label} pin={chosen} open={chosenOpen} /> : null}
        </AnimatePresence>
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
        <span className="ml-auto hidden text-[#6B6560] sm:inline">Toque num pino</span>
      </figcaption>
    </figure>
  );
};

export default LiveMap;
