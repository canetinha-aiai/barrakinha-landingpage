import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import PhoneFrame from '@/components/PhoneFrame';

/*
  O hero é a barraca: bloco laranja chapado, título em letra larga
  como letreiro, e o toldo listrado fechando embaixo.

  Laranja aqui é superfície de propósito — é o único momento da página
  que precisa ser reconhecido de longe. Sem degradê nem sombra: a cor
  é uma só (#F85A35), e o texto é tinta escura, que sobre ela passa de
  6:1 (branco daria 3:1).

  Movimento: o texto sobe uma vez (CSS, `animate-enter`) e a tela do
  app entra com uma mola que termina inclinada 3° — como um papel
  colado na barraca. Tudo uma vez, na chegada; depois disso nada se
  mexe sozinho. Sem selos nem etiquetas por cima: o título e a tela
  dão conta sozinhos.
*/
const Hero = () => {
  const reduceMotion = useReducedMotion();

  const go = (event, href) => {
    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative overflow-hidden bg-ember pt-16 text-night">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-14 px-5 pb-16 pt-12 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <h1 className="display-wide max-w-[13ch] animate-enter text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-balance [animation-delay:60ms] sm:text-[4rem] lg:text-[5rem]">
            O mapa da comida de rua do seu bairro.
          </h1>

          <p className="mt-7 max-w-[38ch] animate-enter text-[18px] font-medium leading-relaxed text-night/80 text-pretty [animation-delay:120ms]">
            Veja quais barracas estão abertas agora perto de você. Peça pelo app
            e retire na hora, sem fila.
          </p>

          <div className="mt-9 flex animate-enter flex-col gap-5 [animation-delay:180ms] sm:flex-row sm:items-center sm:gap-7">
            <a
              href="#lista"
              onClick={(event) => go(event, '#lista')}
              className="btn-night h-14 w-full text-base sm:h-12 sm:w-auto"
            >
              Entrar na lista de espera
            </a>
            <a
              href="#pra-quem-vende"
              onClick={(event) => go(event, '#pra-quem-vende')}
              className="self-center rounded text-[16px] font-semibold underline decoration-night/40 decoration-2 underline-offset-[6px] transition-colors duration-150 hover:decoration-night sm:self-auto"
            >
              Tenho uma barraca
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[300px] lg:col-span-5 lg:mr-0 lg:max-w-[330px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 60, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.9, delay: 0.25 }}
          >
            <PhoneFrame
              src="/models/app-screenshot.png"
              alt="Tela inicial do app da Barrakinha, mostrando o mapa de barracas abertas e os pedidos do cliente"
              className="border-2 border-night"
              crop="9 / 15"
              priority
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
