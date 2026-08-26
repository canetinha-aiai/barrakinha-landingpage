import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
/*
  Mesma construção da seção do cliente: frase grande, número em degradê
  e o trecho principal no laranja. A diferença entre as duas seções é o
  conteúdo, não um segundo padrão de componente.

  Aqui já houve um bloco laranja ao lado da lista, com o cartão de
  "pedido novo" dentro. Saiu: no hero os cartões funcionam porque estão
  soltos sobre a cor e ancorados na chamada, mas aqui o mesmo cartão
  precisava de um retângulo laranja só pra ter contra o que se destacar
  — e um bloco de cor no meio de uma lista de texto quebra a leitura em
  vez de apoiá-la.

  A funcionalidade descrita aqui é a "jornada" do app, mas o termo não
  aparece: quem chega neste site ainda não usou o produto e não tem por
  que conhecer o vocabulário interno dele.

  Nada sobre taxa, comissão ou repasse: essa conversa acontece dentro do
  app, na hora certa.

  Aqui também se tentou ícone ao lado do numeral, depois empilhado —
  as duas vezes competindo com o degradê em vez de somar. Ficou só o
  número, como na seção do cliente.

  Tipografia e espaçamento fluidos (`clamp()` com `vh`), como na seção
  do cliente — mesma razão: tamanho fixo por breakpoint de largura não
  sabe nada sobre altura, então ou estourava a tela baixa ou ficava
  pequeno demais na tela alta. Os tetos aqui são menores que os da
  seção do cliente porque são quatro afirmações em vez de três — o
  mesmo teto não caberia.
*/
const statements = [
  /*
    "Fechou, sai da lista" soava como punição — o vendedor sendo
    removido de algum lugar. O fato é o mesmo, mas dito do ponto de
    vista de quem vende: ele é que decide quando aparece.
  */
  {
    before: 'Você aparece no mapa ',
    accent: 'só enquanto está vendendo',
    after: '.',
  },
  {
    before: 'Mudou de esquina, ',
    accent: 'o mapa muda junto',
    after: '.',
  },
  {
    before: 'Cardápio, foto e preço ',
    accent: 'direto do celular',
    after: '.',
  },
  {
    before: 'Você acompanha ',
    accent: 'o que saiu e quanto rendeu',
    after: '.',
  },
];

const VendorBenefits = () => {
  return (
    <section
      id="pra-vendedor"
      className="screen-section flex flex-col justify-center bg-paper pb-10 pt-14 lg:pt-16"
    >
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading title="Sem ponto fixo, com endereço no mapa" />

        <ul className="mt-[clamp(20px,3.4vh,32px)]">
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
              className="border-t border-paper-200 py-[clamp(12px,2.1vh,20px)] last:border-b"
            >
              <div className="flex items-baseline gap-4 sm:gap-6">
                <span
                  aria-hidden="true"
                  className="numeric shrink-0 bg-brand bg-clip-text font-display text-[clamp(24px,4.2vh,40px)] font-extrabold leading-none tracking-[-0.05em] text-transparent"
                >
                  {index + 1}
                </span>

                <p className="max-w-[26ch] font-display text-[clamp(16px,2.5vh,24px)] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink-900 text-balance">
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
