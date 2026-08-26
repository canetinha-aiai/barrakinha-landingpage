import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
/*
  Frase grande com o trecho principal no laranja da marca, numerada.

  Histórico desta seção: card com ícone em círculo, célula dividida por
  régua, carrossel com diagrama, linha com ícone solto, quadrado
  colorido, bloco sangrando, texto puro e — na versão anterior — ícone
  do lucide a 128px servindo de marca d'água atrás da frase.

  O ícone voltou duas vezes depois disto — ao lado do numeral, dentro
  de um selo colorido; depois empilhado em cima dele, sem selo — e nas
  duas vezes ficou estranho. O numeral em degradê já é uma peça gráfica
  cheia; qualquer ícone perto dele compete em vez de somar. Ficou só o
  número.

  Fora daqui de propósito:
  1. "Jornada" é termo do app do vendedor — jargão pro cliente.
  2. Nota, estrela e avaliação: a funcionalidade não existe.

  Tipografia e espaçamento fluidos, em `clamp()` com `vh` — não mais
  presos a um breakpoint de largura. A primeira tentativa de fazer a
  seção caber usou tamanho fixo por tier (`lg:text-[44px]` etc):
  resolveu o estouro no celular baixo, mas como largura não é altura,
  o mesmo tamanho pequeno aparecia também num celular alto ou num
  monitor — onde sobrava espaço de sobra. Com `vh` cada valor cresce
  com a altura de verdade da tela: fica no mínimo (o que já provou
  caber em 667px) só quando a tela é baixa, e sobe até o teto nas
  telas com espaço.
*/
const statements = [
  {
    before: 'Você vê ',
    accent: 'quem está vendendo agora',
    after: '.',
  },
  {
    before: 'Você sabe ',
    accent: 'o preço antes de sair de casa',
    after: '.',
  },
  {
    before: 'Você pede pelo app e ',
    accent: 'chega na hora de retirar',
    after: '.',
  },
];

const CustomerBenefits = () => {
  return (
    <section
      id="pra-voce"
      className="screen-section flex flex-col justify-center bg-paper pb-12 pt-16 lg:pt-20"
    >
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading title="A comida da sua rua, sem depender da sorte" />

        <ul className="mt-[clamp(24px,4.2vh,40px)]">
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
              className="border-t border-paper-200 py-[clamp(16px,2.9vh,28px)] last:border-b"
            >
              <div className="flex items-baseline gap-4 sm:gap-6">
                {/* O degradê da marca recortado no próprio numeral. O
                    `text-transparent` é o que deixa o fundo aparecer
                    através da letra — sem ele o número cobre o degradê
                    com a cor do texto. */}
                <span
                  aria-hidden="true"
                  className="numeric shrink-0 bg-brand bg-clip-text font-display text-[clamp(30px,5.5vh,52px)] font-extrabold leading-none tracking-[-0.05em] text-transparent"
                >
                  {index + 1}
                </span>

                <p className="max-w-[26ch] font-display text-[clamp(19px,3.4vh,32px)] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink-900 text-balance">
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
