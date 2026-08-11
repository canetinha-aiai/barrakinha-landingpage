import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tag, Bike } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

/*
  Frase grande + ícone em marca d'água.

  Histórico desta seção: card com ícone em círculo, célula dividida por
  régua, carrossel com diagrama, linha com ícone solto, quadrado
  colorido, bloco sangrando e texto puro. Os cinco primeiros pareciam
  template; o texto puro ficou correto porém sem acabamento.

  A saída não é voltar à moldura. É mudar a escala do ícone: a 128px com
  traço de 1px e cortado pela borda direita, ele deixa de ser pictograma
  de interface e vira textura de fundo. Dá camada e cor sem card, sem
  sombra e sem quadradinho.

  O número em versalete ancora cada linha e devolve a hierarquia que o
  texto puro tinha perdido.

  Fora daqui de propósito:
  1. "Jornada" é termo do app do vendedor — jargão pro cliente.
  2. Nota, estrela e avaliação: a funcionalidade não existe.
*/
const statements = [
  {
    icon: MapPin,
    label: 'Mapa',
    before: 'Você vê ',
    accent: 'quem está vendendo agora',
    after: '.',
  },
  {
    icon: Tag,
    label: 'Cardápio',
    before: 'Você sabe ',
    accent: 'o preço antes de sair de casa',
    after: '.',
  },
  {
    icon: Bike,
    label: 'Pedido',
    before: 'Você pede pelo app e ',
    accent: 'chega na hora de retirar',
    after: '.',
  },
];

const CustomerBenefits = () => {
  return (
    <section
      id="pra-voce"
      className="screen-section flex items-start bg-paper pb-20 pt-24 lg:pt-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Pra quem come"
          title="A comida da sua rua, sem depender da sorte"
        />

        <ul className="mt-12 lg:mt-16">
          {statements.map((statement, index) => (
            <motion.li
              key={statement.accent}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative overflow-hidden border-t border-paper-200 py-7 last:border-b sm:py-9 lg:py-11"
            >
              {/* Marca d'água: sai pela borda direita de propósito, o
                  corte é o que a faz parecer textura e não ilustração
                  centralizada num quadro. */}
              <statement.icon
                aria-hidden="true"
                strokeWidth={1}
                className="pointer-events-none absolute -right-6 top-1/2 h-24 w-24 -translate-y-1/2 text-ember-600/20 sm:-right-8 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
              />

              <div className="relative flex items-baseline gap-4 sm:gap-5">
                <span className="numeric shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-700">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <p className="max-w-[16ch] font-display text-[26px] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink-900 text-balance sm:max-w-[20ch] sm:text-[34px] lg:max-w-[24ch] lg:text-[40px]">
                  {statement.before}
                  <span className="text-ember-700">{statement.accent}</span>
                  {statement.after}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CustomerBenefits;
