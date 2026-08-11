import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';

/*
  Linha do tempo.

  A versão anterior empilhava quatro elementos por passo — bolinha,
  ícone, título e frase — cada um numa linha, o que deixava a seção
  altíssima no celular e sem nenhuma ligação visível entre um passo e
  o outro. O ícone saiu: numa sequência, quem comunica ordem é o número,
  e o pictograma só repetia o título.

  Agora a régua liga os passos — vertical no celular, horizontal no
  desktop — e cada item ocupa duas linhas em vez de quatro.

  Passos escritos a partir do fluxo real do app:
  welcome → register → otp-code → mapa → cardápio → carrinho → pedido.
  A conta é obrigatória e a página diz isso; o que dá pra vender com
  honestidade é que ela é curta e sem senha, porque o login é por
  código no e-mail.
*/
const steps = [
  {
    title: 'Crie sua conta',
    description: 'Nome, e-mail e telefone. Sem senha pra decorar.',
  },
  {
    title: 'Veja quem está na rua',
    description: 'O mapa mostra as barracas abertas ali perto.',
  },
  {
    title: 'Peça e retire',
    description: 'Monte o carrinho, confirme e acompanhe até retirar.',
  },
];

const HowItWorks = () => {
  return (
    <section
      id="como-funciona"
      className="screen-section flex items-start bg-paper-100 pb-20 pt-24 lg:pt-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Como funciona"
          title="Da conta criada ao espetinho na mão"
        />

        <ol className="mt-12 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-10">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex gap-5 pb-9 last:pb-0 lg:block lg:pb-0"
              >
                {/* Régua vertical no celular: sai de baixo da bolinha e
                    vai até o próximo passo. */}
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-[19px] top-12 w-px bg-paper-200 lg:hidden"
                  />
                ) : null}

                {/* Régua horizontal no desktop, saindo da bolinha até a
                    borda da coluna. */}
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-[56px] right-0 top-[19px] hidden h-px bg-paper-200 lg:block"
                  />
                ) : null}

                {/* Círculo preto e não laranja: aqui há texto dentro do
                    bloco, e número sobre o ember-600 daria 3.77 de
                    contraste — suficiente pra ícone, insuficiente pra
                    caractere. O laranja fica nos blocos com ícone. */}
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-[15px] font-extrabold text-paper">
                  <span className="numeric">{index + 1}</span>
                </span>

                <div className="min-w-0 flex-1 lg:mt-7">
                  <h3 className="font-display text-[22px] font-extrabold leading-none tracking-[-0.035em] text-ink-900 sm:text-[26px]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-prose text-[15px] leading-relaxed text-ink-600 text-pretty">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
