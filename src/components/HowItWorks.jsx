import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import { EASE_OUT } from '@/lib/motion';
import Reveal from '@/components/Reveal';
import { useIsMobile } from '@/hooks/useMediaQuery';

/*
  "Pra quem compra" — o app em três passos, lidos em cinco segundos.

  Entrou no lugar da história da terça à noite (NearMiss). Cada passo é
  um número grande, um
  título curto, uma frase e o pedaço da tela do app que faz aquilo —
  capturas do app de verdade no simulador, com uma barraca de teste
  aberta na Praça Cívica (ponto público, nada de endereço de ninguém).

  Fica no papel, logo depois da faixa escura das comidas. Os cartões
  sobem em cascata quando chegam na tela; com menos movimento, já
  nascem no lugar (e o pré-render reabre a opacidade).
*/
const steps = [
  {
    title: 'Veja quem está aberto',
    text: 'O mapa mostra as barracas abertas agora, perto de você.',
    img: '/models/passo-mapa',
    alt: 'Mapa do app da Barrakinha com uma barraca aberta perto de você e o cartão dela: Espetinhos do Pedro, aberta, a 380 m, com o botão Ver cardápio',
    size: [720, 1278],
  },
  {
    title: 'Peça pelo app',
    text: 'Escolha no cardápio, já vendo o preço, e faça o pedido.',
    img: '/models/passo-pedir',
    alt: 'Cardápio da barraca Espetinhos do Pedro no app, aberta agora, com batata frita a R$ 20,00',
    size: [720, 1278],
  },
  {
    title: 'Retire pronto',
    text: 'Acompanhe o pedido e pegue na barraca, sem fila.',
    img: '/models/passo-retirar',
    alt: 'Pedido de R$ 20,00 na Espetinhos do Pedro acompanhado no app, com o status Aguardando a loja e as etapas até a retirada',
    size: [720, 1278],
  },
];

const list = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const HowItWorks = () => {
  const reduceMotion = useReducedMotion();
  // No celular os passos empilham: cada um entra quando ele chega na
  // tela, em vez de os três de uma vez com o primeiro.
  const mobile = useIsMobile();
  const own = mobile && !reduceMotion
    ? { initial: 'hidden', whileInView: 'shown', viewport: { once: true, amount: 0.15, margin: '0px 0px -8% 0px' } }
    : {};

  return (
    <section id="pra-quem-compra" className="section bg-paper text-ink">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading title="Do mapa à barraca em três passos" />

        <motion.ol
          variants={list}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="shown"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.li key={step.title} variants={card} {...own} className="flex flex-col">
              <span className="display-wide text-[2.75rem] leading-none tracking-[-0.03em] text-ember-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-[22px] font-bold leading-tight tracking-[-0.02em] text-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[30ch] text-[17px] leading-relaxed text-ink-muted">{step.text}</p>
              {/* A tela inteira do app (sem a barra de status e sem a barra
                  de abas), dentro de uma moldura simples de celular: borda
                  de tinta e cantos redondos. As três têm o mesmo tamanho,
                  pra fileira alinhar no desktop. */}
              <Reveal as="figure" y={56} amount={0.05} delay={0.05} className="mx-auto mt-6 w-full max-w-[320px] rounded-[30px] bg-ink p-[6px] md:max-w-none">
                <picture className="block overflow-hidden rounded-[24px] bg-paper [aspect-ratio:720/1278]">
                  <source type="image/avif" srcSet={`${step.img}.avif`} />
                  <source type="image/webp" srcSet={`${step.img}.webp`} />
                  <img
                    src={`${step.img}.png`}
                    alt={step.alt}
                    width={step.size[0]}
                    height={step.size[1]}
                    loading="lazy"
                    decoding="async"
                    className="block h-full w-full object-cover object-top"
                  />
                </picture>
              </Reveal>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default HowItWorks;
