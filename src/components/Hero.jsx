import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import WaitlistForm from '@/components/WaitlistForm';
import ScrollCue from '@/components/ScrollCue';

/*
  Hero no degradê da marca, sangrando de ponta a ponta e fechado pela
  faixa de toldo.

  Só tipografia e formulário. Aqui já flutuaram dois cartões brancos
  imitando telas do app; eles saíram junto com o bloco parecido que
  havia na seção do vendedor. O motivo é o mesmo nos dois casos: eram
  interface de mentira, com preço e distância inventados, disputando a
  dobra com o formulário — que é a única ação que esta página tem. Sem
  eles a chamada ocupa a largura toda e o vazio em volta passa a ser
  intencional em vez de sobra.

  O que segura a primeira dobra agora é a cor e a listra, não uma
  ilustração. A faixa de toldo no lugar do canto arredondado é o gesto
  que o site divide com o app: retângulo com raio é o fundo de qualquer
  página; a listra diagonal diz barraca de rua.

  Altura de tela inteira em qualquer largura — isso não é negociável:
  a página inteira é pensada em seções do tamanho da tela. (E "tela
  inteira" era, por um tempo, uma mentira: a seção descontava 4rem do
  header no cálculo da própria altura, pensando em não ficar embaixo
  dele — mas o header é `fixed`, sobrepõe a página em vez de empurrá-la.
  O desconto só encolhia a seção 64px a menos que a tela de verdade,
  vazando uma tira do fundo da próxima seção no rodapé da primeira
  dobra. Corrigido na `.screen-section`, não aqui.)

  Título, texto e formulário têm largura máxima e só crescem de tamanho
  por breakpoint de largura — nada os faz crescer com a altura da tela.
  Titulo e formulário já viveram centralizados como um bloco só, depois
  separados em dois blocos (título no topo, formulário embaixo, com
  `justify-between` esticando o vão entre eles) — as duas vezes ficou
  errado: centralizado sobrava vazio nas duas pontas: separado, virava
  duas ilhas sem relação, com o `flex-1` dando de novo um vão vazio
  entre elas quando a tela era alta o bastante.

  Agora título, texto e formulário são um bloco só, centralizado
  (`justify-center`) na seção. Com a seção do tamanho certo — sem o
  desconto de 4rem que a encolhia por engano —, o vazio ao redor do
  bloco é o de uma seção cheia de verdade, não o de uma seção que
  media 64px a menos do que dizia medir.
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

      <section id="top" className="screen-section flex flex-col bg-paper">
        <div className="relative flex flex-1 flex-col justify-center overflow-hidden bg-brand pb-14 pt-24 lg:pb-16 lg:pt-28">
          {/* Toldo de fundo: textura, não desenho para olhar. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-awning-lg"
          />
          <div className="brand-scrim" aria-hidden="true" />

          {/* Bloco único — título, texto e formulário juntos — que o
              `justify-end` do pai empurra para o fim da seção. A sobra
              de tela vai inteira para cima dele. */}
          <div className="relative mx-auto w-full max-w-6xl px-5 lg:px-8">
            <motion.h1
              variants={rise}
              initial="hidden"
              animate="visible"
              custom={0}
              className="max-w-4xl text-[38px] font-extrabold leading-[0.94] tracking-[-0.04em] text-white text-balance sm:text-display-md lg:text-display-lg"
            >
              Toda rua tem uma barraca.
              <br className="hidden sm:block" />{' '}
              <span className="text-white/85">Agora tem mapa.</span>
            </motion.h1>

            <motion.p
              variants={rise}
              initial="hidden"
              animate="visible"
              custom={0.08}
              className="mt-7 max-w-prose text-[17px] leading-relaxed text-white text-pretty md:text-lg"
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
              <WaitlistForm
                tone="brand"
                helper="Sem spam. Só o aviso de lançamento."
              />
            </motion.div>
          </div>

          <ScrollCue />
        </div>

      </section>
    </>
  );
};

export default Hero;
