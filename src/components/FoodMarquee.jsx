import React, { useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { FOOD_ICONS, HOT } from '@/components/FoodIcons';
import Reveal from '@/components/Reveal';

/*
  A faixa do cardápio da rua: o nome das comidas passando em letra
  larga, logo abaixo do toldo do hero. É o que diz, antes de qualquer
  explicação, de que tipo de comida a página está falando.

  Duas linhas em sentidos opostos — a de cima cheia, a de baixo só no
  contorno — e as duas respondem à rolagem: rolar rápido acelera o
  letreiro e o inclina na direção do movimento; rolar pra cima inverte
  o sentido. Parado, volta pro passo de letreiro.

  O deslocamento é calculado por quadro (`useAnimationFrame`) porque
  depende da velocidade da rolagem, que CSS não enxerga. Só roda
  enquanto a faixa está na tela, para no hover (dá pra ler) e fica
  parada com `prefers-reduced-motion`. O texto aparece uma vez pra
  quem ouve a página; as cópias que fecham o laço são `aria-hidden`.
*/
const foods = [
  'Pastel',
  'Espetinho',
  'Acarajé',
  'Tapioca',
  'Churros',
  'Milho cozido',
  'Cachorro-quente',
  'Açaí',
  'Caldo de cana',
  'Coxinha',
];

/* Passo de letreiro, em % da largura de uma cópia por segundo. */
const BASE_SPEED = 2.2;

const wrap = (min, max, value) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/*
  Entre um nome e outro, a comida desenhada (FoodIcons, no traço da
  barraquinha do hero). Passar o mouse ou tocar faz ela pular com
  mola — e, se é quente, sair vapor. A faixa já para no hover, então
  dá pra brincar com ela parada. Com menos movimento, não pula.
*/
const FoodIcon = ({ food }) => {
  const reduceMotion = useReducedMotion();
  const [hops, setHops] = useState(0);
  const Icon = FOOD_ICONS[food];
  const hop = () => setHops((n) => n + 1);
  const live = hops > 0 && !reduceMotion;

  return (
    <span
      aria-hidden="true"
      onPointerEnter={hop}
      onClick={hop}
      className="relative mx-1 block h-8 w-8 shrink-0 cursor-pointer sm:h-10 sm:w-10 lg:h-12 lg:w-12"
    >
      <motion.span
        key={hops}
        className="block h-full w-full"
        initial={false}
        animate={live ? { y: [0, -20, 0], rotate: [0, -12, 8, 0] } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.6, times: [0, 0.35, 0.7, 1], ease: 'easeOut' }}
      >
        <svg viewBox="0 0 64 64" className="block h-full w-full overflow-visible">
          <Icon />
        </svg>
      </motion.span>
      {live && HOT.has(food) ? (
        <svg key={`v${hops}`} viewBox="0 0 64 64" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {[22, 34, 44].map((x, i) => (
            <g key={x} className="stall-steam-burst" style={{ animationDelay: `${i * 70}ms` }}>
              <circle cx={x} cy={8} r={5} fill="#FBF7F2" />
              <circle cx={x + 4} cy={5} r={3.5} fill="#FBF7F2" />
            </g>
          ))}
        </svg>
      ) : null}
      {live && food === 'Caldo de cana' ? (
        <svg key={`b${hops}`} viewBox="0 0 64 64" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {[[26, 3], [34, 4.5], [40, 2.5], [30, 2]].map(([x, r], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={20}
              r={r}
              fill="none"
              stroke="#C9D86B"
              strokeWidth={1.5}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -26 - i * 4, opacity: 0 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
            />
          ))}
        </svg>
      ) : null}
      {live && food === 'Açaí' ? (
        <svg key={`g${hops}`} viewBox="0 0 64 64" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <motion.path
            d="M48 50 q3 5 0 8 q-3 -3 0 -8 Z"
            fill="#7A3D8F"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeIn' }}
          />
        </svg>
      ) : null}
    </span>
  );
};

const Row = ({ hidden, outline }) => (
  <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
    {foods.map((food) => (
      <li key={food} className="flex items-center">
        <span
          className="display-wide whitespace-nowrap px-4 text-[1.6rem] leading-[1.1] tracking-[-0.02em] transition-colors duration-200 hover:text-ember sm:px-6 sm:text-[2.1rem] lg:text-[2.75rem]"
          style={outline ? { color: 'transparent', WebkitTextStroke: '1px #FBF7F2' } : undefined}
        >
          {food}
        </span>
        <FoodIcon food={food} />
      </li>
    ))}
  </ul>
);

const Track = ({ direction, outline, speedFactor, skew, running }) => {
  const x = useMotionValue(0);
  const position = useTransform(x, (value) => `${wrap(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (!running.current) return;
    const factor = speedFactor.get();
    const sign = factor < 0 ? -1 : 1;
    const step = direction * sign * BASE_SPEED * (delta / 1000) * (1 + Math.abs(factor));
    x.set(x.get() - step);
  });

  return (
    <motion.div className="flex w-max" style={{ x: position, skewX: skew }}>
      <Row hidden={outline} outline={outline} />
      <Row hidden outline={outline} />
    </motion.div>
  );
};

const FoodMarquee = () => {
  const ref = useRef(null);
  const onScreen = useInView(ref);
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const running = useRef(false);
  running.current = onScreen && !hovered && !reduceMotion;

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const speedFactor = useTransform(velocity, [-2000, 0, 2000], [-6, 0, 6], { clamp: false });
  const skew = useTransform(velocity, [-2500, 2500], [6, -6]);

  return (
    <section
      ref={ref}
      aria-label="Comidas de rua"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="flex flex-col gap-1 overflow-hidden bg-night py-6 text-cream sm:gap-2 sm:py-8"
    >
      <Reveal x={-48} y={0}><Track direction={1} speedFactor={speedFactor} skew={reduceMotion ? 0 : skew} running={running} /></Reveal>
      <Reveal x={48} y={0} delay={0.08}><Track direction={-1} outline speedFactor={speedFactor} skew={reduceMotion ? 0 : skew} running={running} /></Reveal>
    </section>
  );
};

export default FoodMarquee;
