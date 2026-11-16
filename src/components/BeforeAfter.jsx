import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import { EASE_OUT } from '@/lib/motion';

/*
  "O que muda com a Barrakinha" — dois cartões lado a lado, lidos de
  uma vez, sem chave pra ligar nem cena pra decifrar.

  À esquerda, o jeito de hoje: papel apagado, texto em cinza e um X em
  cada linha. À direita, com o app: noite, texto creme e o visto no
  laranja da marca. As quatro linhas são os mesmos quatro assuntos nos
  dois lados, na mesma ordem e na mesma altura, então o olho compara
  linha com linha.

  No celular os cartões empilham, antes em cima e depois embaixo. Os
  cartões sobem quando chegam na tela; com menos movimento, já nascem
  no lugar (e o pré-render reabre a opacidade).
*/
const rows = [
  {
    topic: 'Achar a barraca',
    before: 'Só encontra quem passa na frente.',
    after: 'Toda barraca aberta aparece no mapa.',
  },
  {
    topic: 'Saber se abriu',
    before: 'Vai até lá pra descobrir que fechou.',
    after: 'O app mostra quem está aberto agora.',
  },
  {
    topic: 'Escolher',
    before: 'Cardápio e preço, só quando chega lá.',
    after: 'Cardápio e preço antes de sair de casa.',
  },
  {
    topic: 'Pedir',
    before: 'Fila, espera e conta de troco.',
    after: 'Pede pelo app e retira pronto.',
  },
];

const Mark = ({ positive }) => (
  <span
    aria-hidden="true"
    className={
      positive
        ? 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ember'
        : 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-line-strong'
    }
  >
    <svg viewBox="0 0 12 12" className="h-3 w-3">
      {positive ? (
        <path d="M2 6.5 L5 9 L10 3" fill="none" stroke="#1D1611" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3 3 L9 9 M9 3 L3 9" fill="none" stroke="#A8A096" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  </span>
);

const Card = ({ positive, title, delay }) => {
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, delay, ease: EASE_OUT },
      };

  return (
    <motion.div
      {...enter}
      className={
        positive
          ? 'rounded bg-night p-6 text-cream sm:p-8'
          : 'rounded border border-line-strong bg-paper-raised p-6 text-ink sm:p-8'
      }
    >
      <p className={positive ? 'text-[15px] font-semibold text-ember' : 'text-[15px] font-semibold text-ink-muted'}>
        {positive ? 'Com a Barrakinha' : 'Sem a Barrakinha'}
      </p>
      <p className="display-wide mt-2 text-[1.6rem] leading-[1.05] tracking-[-0.02em] sm:text-[1.9rem]">
        {title}
      </p>

      <ul className="mt-6">
        {rows.map((row) => (
          <li
            key={row.topic}
            className={`flex gap-4 border-t py-5 last:pb-0 ${positive ? 'border-night-line' : 'border-line-strong'}`}
          >
            <Mark positive={positive} />
            <div className="min-w-0">
              <h3 className={`text-[13px] font-semibold uppercase tracking-[0.06em] ${positive ? 'text-night-muted' : 'text-ink-muted'}`}>
                {row.topic}
              </h3>
              <p className={`mt-1 text-[17px] leading-snug ${positive ? 'font-semibold text-cream' : 'text-ink-muted'}`}>
                {positive ? row.after : row.before}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const BeforeAfter = () => (
  <section id="antes-depois" className="section bg-paper">
    <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
      <SectionHeading kicker="Antes e depois" title="O que muda com a Barrakinha" />

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
        <Card positive={false} title="Sair na sorte." delay={0} />
        <Card positive title="Sair sabendo." delay={0.12} />
      </div>
    </div>
  </section>
);

export default BeforeAfter;
