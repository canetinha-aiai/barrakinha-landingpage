import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import PhoneFrame from '@/components/PhoneFrame';
import Magnetic from '@/components/Magnetic';
import { SPRING_SOFT, useFinePointer } from '@/lib/motion';

/*
  O hero é a barraca: bloco laranja chapado, título em letra larga
  como letreiro, e o toldo listrado fechando embaixo.

  Laranja aqui é superfície de propósito — é o único momento da página
  que precisa ser reconhecido de longe. Sem degradê nem sombra: a cor
  é uma só (#F85A35), e o texto é tinta escura, que sobre ela passa de
  6:1 (branco daria 3:1).

  Movimento, em ordem de chegada:
  1. O título sobe palavra por palavra de trás de uma máscara. É CSS
     (`animate-word-rise`), não Motion: roda já no HTML pré-renderizado
     e não pisca quando o React assume.
  2. A tela do app entra com uma mola que termina inclinada 3° — como
     um papel colado na barraca. Nada por cima dela: a captura fala
     sozinha.

  Com mouse, a tela inclina em 3D seguindo o ponteiro. Rolando a
  página, ela sobe um pouco mais devagar que o texto. Tudo isso fica
  de fora no toque e com menos movimento.
*/
const TITLE = 'O mapa da comida de rua do seu bairro.';

const Hero = () => {
  const reduceMotion = useReducedMotion();
  const fine = useFinePointer();
  const sectionRef = useRef(null);
  const tilt = fine && !reduceMotion;

  /* Ponteiro normalizado em -1…1 sobre o hero inteiro, amortecido. */
  const px = useSpring(0, SPRING_SOFT);
  const py = useSpring(0, SPRING_SOFT);
  const rotateY = useTransform(px, [-1, 1], [-9, 9]);
  const rotateX = useTransform(py, [-1, 1], [7, -7]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const lift = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -90]);

  const onPointerMove = (event) => {
    if (!tilt || !sectionRef.current) return;
    const box = sectionRef.current.getBoundingClientRect();
    px.set(((event.clientX - box.left) / box.width) * 2 - 1);
    py.set(((event.clientY - box.top) / box.height) * 2 - 1);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const go = (event, href) => {
    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const words = TITLE.split(' ');

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative overflow-hidden bg-ember pt-16 text-night"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-14 px-5 pb-16 pt-12 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <h1 className="display-wide max-w-[13ch] text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-balance sm:text-[4rem] lg:text-[5rem]">
            {words.map((word, index) => (
              <React.Fragment key={`${word}-${index}`}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                  <span
                    className="inline-block animate-word-rise motion-reduce:animate-none"
                    style={{ animationDelay: `${60 + index * 55}ms` }}
                  >
                    {word}
                  </span>
                </span>
                {index < words.length - 1 ? ' ' : null}
              </React.Fragment>
            ))}
          </h1>

          <p className="mt-7 max-w-[38ch] animate-enter text-[18px] font-medium leading-relaxed text-night/80 text-pretty [animation-delay:520ms]">
            Veja quais barracas estão abertas agora perto de você, peça pelo app
            e retire o pedido pronto na barraca.
          </p>

          <div className="mt-9 flex animate-enter flex-col gap-5 [animation-delay:620ms] sm:flex-row sm:items-center sm:gap-7">
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#lista"
                onClick={(event) => go(event, '#lista')}
                className="btn-night h-14 w-full text-base sm:h-12 sm:w-auto"
              >
                Entrar na lista de espera
              </a>
            </Magnetic>
            <a
              href="#pra-quem-vende"
              onClick={(event) => go(event, '#pra-quem-vende')}
              className="group relative self-center rounded text-[16px] font-semibold sm:self-auto"
            >
              Tenho uma barraca
              {/* Sublinhado que se redesenha da esquerda no hover. */}
              <span aria-hidden="true" className="absolute inset-x-0 -bottom-1.5 h-0.5 bg-night/40" />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1.5 h-0.5 origin-left scale-x-0 bg-night transition-transform duration-300 ease-out hover-fine:group-hover:scale-x-100"
              />
            </a>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-[300px] lg:col-span-5 lg:mr-0 lg:max-w-[330px]"
          style={{ perspective: 1200 }}
        >
          <motion.div style={{ y: lift }}>
            <motion.div style={tilt ? { rotateX, rotateY } : undefined}>
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
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
