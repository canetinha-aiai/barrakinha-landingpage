import React from 'react';

/*
  A faixa do cardápio da rua: o nome das comidas passando em letra
  larga, logo abaixo do toldo do hero. É o que diz, antes de qualquer
  explicação, de que tipo de comida a página está falando.

  Movimento contínuo, linear, porque é um letreiro. Para no hover (dá
  pra ler) e fica parado com `prefers-reduced-motion`. O texto aparece
  uma vez pra quem ouve a página; a cópia que fecha o laço é
  `aria-hidden`.
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

const Row = ({ hidden }) => (
  <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
    {foods.map((food) => (
      <li key={food} className="flex items-center">
        <span className="display-wide whitespace-nowrap px-6 text-[2.5rem] leading-none tracking-[-0.02em] sm:px-8 sm:text-[3.5rem] lg:text-[4.5rem]">
          {food}
        </span>
        <span aria-hidden="true" className="block h-3 w-3 rounded-full bg-ember sm:h-4 sm:w-4" />
      </li>
    ))}
  </ul>
);

const FoodMarquee = () => (
  <section aria-label="Comidas de rua" className="overflow-hidden bg-night py-10 text-cream sm:py-14">
    <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
      <Row />
      <Row hidden />
    </div>
  </section>
);

export default FoodMarquee;
