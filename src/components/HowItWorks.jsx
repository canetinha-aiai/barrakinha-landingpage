import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import StreetSkyline from '@/components/StreetSkyline';

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

  Fundo com textura de pontos: esta era a seção mais plana do site —
  paper-100 liso, sem gradiente, sem card, sem ícone. O `dot-grid` dá
  o que olhar sem competir com a régua que já liga os três passos.

  Padding reduzido para bater com o respiro comprimido das duas seções
  vizinhas — a régua e a lista já eram compactas, não precisava de
  redução de tipografia aqui, só de alinhar o espaçamento externo.

  O `StreetSkyline` no fim da seção marca a virada de tom pra "Pra quem
  vende" (paper-100 → paper). Já viveu solto entre as duas seções, mas
  aí o scroll magnético — que só encaixa em `screen-section` — pulava
  direto por cima dele: sem destino de encaixe próprio, a faixa nunca
  ficava visível na navegação normal. Dentro desta seção, ela é vista
  sempre que "Como funciona" está em foco.

  A seção não centraliza mais inteira (`justify-center` saiu daqui).
  Centralizada, o grupo era [cabeçalho+lista, faixa] junto — a faixa
  ficava colada embaixo da lista, não no fim da seção, porque "no fim"
  dependia de quanto espaço sobrava pro grupo inteiro, não só pra ela.
  Agora só o bloco de conteúdo centraliza (`flex-1` + `justify-center`
  nele, não na seção) — ele ocupa e centra dentro do espaço que sobra
  *acima* da faixa, e a faixa, de fora desse bloco, fica sempre
  encostada no fim de verdade.
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
      className="screen-section relative flex flex-col overflow-hidden bg-paper-100 pb-12 pt-16 lg:pt-20"
    >
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute inset-0 text-ember-700/[0.07]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 lg:px-8">
        <SectionHeading title="Da conta criada ao espetinho na mão" />

        <ol className="mt-6 lg:mt-8 lg:grid lg:grid-cols-3 lg:gap-10">
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
                    vai até o próximo passo.

                    Era `bg-paper-200` — contraste de 1,06:1 contra o
                    `paper-100` da seção, quase a mesma cor do fundo.
                    `sand-300` sobe pra 1,26:1; visível sem virar régua
                    de destaque. */}
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-[21px] top-[52px] w-px bg-sand-300 lg:hidden"
                  />
                ) : null}

                {/* Régua horizontal no desktop, saindo da bolinha até a
                    borda da coluna. */}
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-[60px] right-0 top-[21px] hidden h-px bg-sand-300 lg:block"
                  />
                ) : null}

                {/* Disco no degradê da marca. O numeral vai em branco
                    e em negrito sobre o fim da rampa, que é o tom mais
                    fundo — sobre a ponta clara ele não teria contraste
                    para caractere. */}
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand font-display text-[16px] font-extrabold text-white shadow-glow">
                  <span className="numeric">{index + 1}</span>
                </span>

                <div className="min-w-0 flex-1 lg:mt-8">
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

      <StreetSkyline className="bg-paper-100" />
    </section>
  );
};

export default HowItWorks;
