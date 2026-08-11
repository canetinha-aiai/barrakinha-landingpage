import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Navigation, UtensilsCrossed, TrendingUp } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

/*
  Mesma construção da seção do cliente: frase grande, número em versalete
  e ícone em marca d'água cortado pela borda. A diferença entre as duas
  seções é o conteúdo e o tom do fundo da seção vizinha, não um segundo
  padrão de componente.

  A funcionalidade descrita aqui é a "jornada" do app, mas o termo não
  aparece: quem chega neste site ainda não usou o produto e não tem por
  que conhecer o vocabulário interno dele. A página descreve o que
  acontece — abrir, aparecer no mapa, fechar — e o app apresenta o nome
  depois.

  Nada sobre taxa, comissão ou repasse, e nada sobre o passo a passo do
  cadastro: as duas conversas acontecem dentro do app, na hora certa.
*/
const statements = [
  /*
    "Fechou, sai da lista" soava como punição — o vendedor sendo
    removido de algum lugar. O fato é o mesmo, mas dito do ponto de
    vista de quem vende: ele é que decide quando aparece.
  */
  {
    icon: Clock,
    before: 'Você aparece no mapa ',
    accent: 'só enquanto está vendendo',
    after: '.',
  },
  {
    icon: Navigation,
    before: 'Mudou de esquina, ',
    accent: 'o mapa muda junto',
    after: '.',
  },
  {
    icon: UtensilsCrossed,
    before: 'Cardápio, foto e preço ',
    accent: 'direto do celular',
    after: '.',
  },
  {
    icon: TrendingUp,
    before: 'Você acompanha ',
    accent: 'o que saiu e quanto rendeu',
    after: '.',
  },
];

const VendorBenefits = () => {
  return (
    <section
      id="pra-vendedor"
      className="screen-section flex items-start bg-paper pb-20 pt-24 lg:pt-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Pra quem vende"
          title="Sem ponto fixo, com endereço no mapa"
        />

        <ul className="mt-12 lg:mt-14">
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
              className="relative overflow-hidden border-t border-paper-200 py-6 last:border-b sm:py-8"
            >
              <statement.icon
                aria-hidden="true"
                strokeWidth={1}
                className="pointer-events-none absolute -right-6 top-1/2 h-20 w-20 -translate-y-1/2 text-ember-600/20 sm:-right-8 sm:h-32 sm:w-32 lg:h-36 lg:w-36"
              />

              <div className="relative flex items-baseline gap-4 sm:gap-5">
                <span className="numeric shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-700">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <p className="max-w-[16ch] font-display text-[24px] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink-900 text-balance sm:max-w-[20ch] sm:text-[30px] lg:max-w-[24ch] lg:text-[36px]">
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

export default VendorBenefits;
