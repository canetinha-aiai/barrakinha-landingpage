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
      className="screen-section relative flex flex-col overflow-hidden bg-ink-900 !pb-0 lg:!pt-20"
    >
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute inset-0 text-ember-500/[0.08]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 lg:px-8">
        {/* A linha de apoio diz de QUAL lado é este caminho.

            Sem ela, a seção vinha logo depois de uma faixa que nomeia
            os dois públicos e começava a listar passos sem avisar de
            quem eram — e "crie sua conta" serve pros dois. Nomear o
            lado aqui é o que deixa a seção seguinte ("pra quem
            compra") ler como continuação, e a de depois ("pra quem
            vende") como a outra metade. */}
        <SectionHeading
          title="Da conta criada ao espetinho na mão"
          description="O caminho de quem compra — do primeiro acesso até retirar o pedido."
          tone="dark"
        />

        <ol className="mt-7 lg:mt-8 lg:grid lg:grid-cols-3 lg:gap-10">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5 lg:block lg:pb-0"
              >
                {/* Régua vertical no celular: sai de baixo da bolinha e
                    vai até o próximo passo — "desenha" (scaleY 0→1) ao
                    entrar na tela, não aparece pronta. */}
                {!isLast ? (
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, delay: index * 0.08 + 0.2, ease: 'easeOut' }}
                    style={{ originY: 0 }}
                    className="absolute bottom-0 left-[19px] top-[48px] w-px bg-gradient-to-b from-ember-500/40 to-ink-700 sm:left-[21px] sm:top-[52px] lg:hidden"
                  />
                ) : null}

                {/* Régua horizontal no desktop, saindo da bolinha até a
                    borda da coluna — mesmo desenho, no eixo X. */}
                {!isLast ? (
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, delay: index * 0.08 + 0.2, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                    className="absolute left-[60px] right-0 top-[21px] hidden h-px bg-ink-700 lg:block"
                  />
                ) : null}

                {/* Disco no degradê da marca — entra com um pop de
                    mola, não só um fade, pra marcar cada passo como um
                    "clique" na sequência. O numeral vai em branco e em
                    negrito sobre o fim da rampa, que é o tom mais
                    fundo — sobre a ponta clara ele não teria contraste
                    para caractere. */}
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 18,
                    delay: index * 0.08,
                  }}
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-display text-[15px] font-extrabold text-white shadow-glow sm:h-11 sm:w-11 sm:text-[16px]"
                >
                  <span className="numeric">{index + 1}</span>
                </motion.span>

                <div className="min-w-0 flex-1 lg:mt-8">
                  <h3 className="font-display text-[21px] font-extrabold leading-none tracking-[-0.035em] text-paper sm:text-[26px]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-prose text-[15px] leading-relaxed text-sand-300 text-pretty">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <StreetSkyline className="mt-12 bg-ink-900 lg:mt-0" />
    </section>
  );
};

export default HowItWorks;
