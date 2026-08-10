import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import WaitlistForm from '@/components/WaitlistForm';

/*
  Hero tipográfico, sem imagem.

  A faixa de categorias faz o trabalho que a foto faria — comunica o
  repertório do app — e funciona como placa de rua, que é o clima certo
  pra comida de rua. Sem foto também não há dependência de banco de
  imagem nem risco de a legenda não bater com o que a imagem mostra.

  Se um dia entrar foto, o lugar dela é entre o formulário e a faixa, e
  ela precisa ser própria: barraca real, vendedor real.
*/
const categories = [
  'Espetinho',
  'Tapioca',
  'Pastel',
  'Caldo de cana',
  'Churrasquinho',
  'Açaí',
  'Cachorro-quente',
];

const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Hero = () => {
  return (
    <>
      <Helmet>
        <title>Barrakinha — toda rua tem uma barraca. Agora tem mapa.</title>
        <meta
          name="description"
          content="Veja no mapa quais barracas de comida de rua estão abertas perto de você, monte o pedido pelo cardápio e retire pronto."
        />
      </Helmet>

      <section id="top" className="bg-ink-900 pt-36 lg:pt-44">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <motion.h1
            variants={rise}
            initial="hidden"
            animate="visible"
            custom={0}
            className="max-w-4xl text-display-sm text-cream-50 text-balance sm:text-display-md lg:text-display-lg"
          >
            Toda rua tem uma barraca.
            <br className="hidden sm:block" />{' '}
            <span className="text-ember-500">Agora tem mapa.</span>
          </motion.h1>

          <motion.p
            variants={rise}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="mt-8 max-w-prose text-[17px] leading-relaxed text-sand-400 text-pretty md:text-lg"
          >
            Descubra quem está vendendo perto de você, monte o pedido pelo
            cardápio e retire quentinho. Sem fila e sem troco.
          </motion.p>

          <motion.div
            id="lista"
            variants={rise}
            initial="hidden"
            animate="visible"
            custom={0.16}
            className="mt-10 scroll-mt-28"
          >
            <WaitlistForm helper="Sem spam. Só o aviso de lançamento na sua cidade." />
          </motion.div>
        </div>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={0.28}
          className="mt-24 border-y border-ink-700 py-7 lg:mt-32"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 sm:gap-x-8 lg:gap-x-12">
            {categories.map((category) => (
              <li
                key={category}
                className="font-display text-[17px] font-bold tracking-[-0.03em] text-sand-500 sm:text-[19px] lg:text-[24px]"
              >
                {category}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
