import React from 'react';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import EyebrowMarquee from '@/components/EyebrowMarquee';
import SectionHeading from '@/components/SectionHeading';
import PillList from '@/components/PillList';
import VendorMapCard from '@/components/VendorMapCard';

/*
  "Pra quem vende" — o par escuro do bloco anterior, igual ao par
  Fabricante (laranja) / Marca (escuro) do smartserialnumber.com: a
  seção alterna de cor cheia pra gradiente quase preto, texto claro no
  lugar do escuro.

  Não tem gravação do app do vendedor pra mostrar aqui, então o lado
  da imagem é um gráfico original: o `VendorMapCard`, que mostra a
  chave de abrir a barraca e o mapa reagindo a ela. Ele ilustra a
  primeira frase da lista abaixo — "você aparece no mapa só enquanto
  está vendendo" — que é a promessa inteira da seção num gesto só.

  ------------------------------------------------------------------
  No celular a ordem estava invertida contra a leitura: o `lg:order-2`
  colocava o gráfico em segundo lugar só a partir do desktop, o que
  significa que na tela estreita ele vinha PRIMEIRO — o leitor caía
  num cartão animado antes de qualquer palavra dizendo de que seção
  se trata. Agora o título abre a seção nas duas larguras, e o
  gráfico ilustra o que já foi dito.
*/
const statements = [
  'Você aparece no mapa só enquanto está vendendo',
  'Mudou de esquina, o mapa muda junto',
  'Cardápio, foto e preço direto do celular',
  'Você acompanha o que saiu e quanto rendeu',
];

const VendorBenefits = () => {
  return (
    <section
      id="pra-vendedor"
      className="screen-section relative flex flex-col overflow-hidden lg:pt-16"
      style={{
        backgroundImage:
          'linear-gradient(180deg, #17110C 0%, #17110C 60%, #0F0C09 100%)',
      }}
    >
      {/* Glow ambiente, igual às outras seções — sem ele o degradê
          quase-preto ficava sem nenhuma cor viva fora do gráfico. */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-24 top-1/2 -z-10 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-ember-600/[0.12] blur-[110px] sm:h-[500px] sm:w-[500px] sm:blur-[140px]"
      />

      <EyebrowMarquee label="Pra quem vende" tone="on-dark" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-5 lg:px-8 lg:py-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/*
            `contents` no celular: a coluna de texto deixa de ser uma
            caixa e seus dois filhos (título e pílulas) passam a ser
            itens diretos da grade — que é o que permite o gráfico
            entrar ENTRE eles na ordem estreita. Sem isso, o título e
            as pílulas seriam sempre um bloco só, e o cartão só poderia
            ficar antes ou depois dos dois.

            A partir do `lg` ela volta a ser uma coluna de verdade, com
            título e pílulas juntos à esquerda e o cartão à direita.
          */}
          <div className="contents lg:col-span-6 lg:block">
            <div className="order-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="mb-4 flex h-12 w-12 shrink-0 animate-pulse items-center justify-center rounded-2xl bg-white/[0.06] text-ember-500">
                <Store size={24} aria-hidden="true" />
              </span>

              <SectionHeading
                title="Sem ponto fixo, com endereço no mapa"
                description="Assim que a barraca abre, ela entra no mapa — sem mensalidade, sem burocracia."
                tone="dark"
              />
            </div>

            {/* No celular vêm depois do gráfico: ele já demonstrou a
                primeira delas, então elas leem como a continuação. */}
            <PillList items={statements} tone="on-dark" className="order-3 lg:mt-9" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 flex justify-center lg:col-span-6 lg:justify-end"
          >
            <VendorMapCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VendorBenefits;
