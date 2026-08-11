import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import WaitlistForm from '@/components/WaitlistForm';

/*
  Hero de tela cheia, só tipografia e formulário.

  A faixa de categorias saiu. Ela nunca achou um lugar: solta entre as
  seções parecia jogada, e ancorada no rodapé do hero virava um segundo
  bloco disputando atenção com o formulário — que é a única ação da
  página. Sem ela, o conteúdo fica centrado na tela e o vazio em volta
  passa a ser intencional em vez de sobra.
*/
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

      <section
        id="top"
        className="screen-section flex items-center bg-paper pb-16 pt-28"
      >
        <div className="w-full">
          <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
            <motion.h1
              variants={rise}
              initial="hidden"
              animate="visible"
              custom={0}
              className="max-w-4xl text-[38px] font-extrabold leading-[0.94] tracking-[-0.04em] text-ink-900 text-balance sm:text-display-md lg:text-display-lg"
            >
              Toda rua tem uma barraca.
              <br className="hidden sm:block" />{' '}
              <span className="text-ember-700">Agora tem mapa.</span>
            </motion.h1>

            <motion.p
              variants={rise}
              initial="hidden"
              animate="visible"
              custom={0.08}
              className="mt-7 max-w-prose text-[17px] leading-relaxed text-ink-600 text-pretty md:text-lg"
            >
              Ache quem está vendendo perto de você. Peça pelo app e retire
              quentinho.
            </motion.p>

            <motion.div
              id="lista"
              variants={rise}
              initial="hidden"
              animate="visible"
              custom={0.16}
              className="mt-9 scroll-mt-24"
            >
              <WaitlistForm helper="Sem spam. Só o aviso de lançamento." />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
