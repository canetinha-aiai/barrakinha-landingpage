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

const Row = ({ hidden, outline }) => (
  <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
    {foods.map((food) => (
      <li key={food} className="flex items-center">
        <span
          className="display-wide whitespace-nowrap px-6 text-[2.5rem] leading-[1.1] tracking-[-0.02em] transition-colors duration-200 hover:text-ember sm:px-8 sm:text-[3.5rem] lg:text-[4.5rem]"
          style={outline ? { color: 'transparent', WebkitTextStroke: '1.5px #FBF7F2' } : undefined}
        >
          {food}
        </span>
        <span aria-hidden="true" className="block h-3 w-3 rounded-full bg-ember sm:h-4 sm:w-4" />
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
      className="flex flex-col gap-2 overflow-hidden bg-night py-10 text-cream sm:gap-3 sm:py-14"
    >
      <Track direction={1} speedFactor={speedFactor} skew={reduceMotion ? 0 : skew} running={running} />
      <Track direction={-1} outline speedFactor={speedFactor} skew={reduceMotion ? 0 : skew} running={running} />
    </section>
  );
};

export default FoodMarquee;
