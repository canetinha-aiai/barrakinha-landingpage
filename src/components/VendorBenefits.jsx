import React from 'react';
import { motion } from 'framer-motion';
import EyebrowMarquee from '@/components/EyebrowMarquee';
import SectionHeading from '@/components/SectionHeading';
import PillList from '@/components/PillList';
import PhoneFrame from '@/components/PhoneFrame';

/*
  "Pra quem vende" — e aqui a página muda de lugar, não de rótulo.

  ------------------------------------------------------------------
  O problema era real: lendo de cima a baixo, dava pra perder a conta
  de qual público fala cada seção. A primeira tentativa foi anunciar —
  um selo "PRA QUEM VENDE" abrindo a seção e uma barra fixa embaixo do
  cabeçalho repetindo isso durante a rolagem. Funcionava e estava
  errado: dizer "isto é a parte do vendedor" é mais fraco do que a
  parte do vendedor PARECER outro lugar. Rótulo é o que se usa quando
  o desenho não deu conta.

  A segunda tentativa foi virar a seção do avesso — fundo creme, o
  mesmo papel do app, contra o escuro do resto da página. Separava de
  longe, mas custava caro: a seção clareava a página inteira no meio
  do caminho e obrigava até o cabeçalho a trocar de lado pra continuar
  legível. Escuro é o clima da página, e esta seção não tinha por que
  sair dele.

  O que ficou usa a marca em vez do fundo: a seção é lacrada por uma
  faixa de toldo em cima e outra embaixo. O toldo é do vendedor — quem
  tem barraca tem toldo, quem compra não —, então a listra que já
  assina o rodapé e as listas de benefício vira aqui a estrutura do
  lugar: entra-se por baixo do toldo e sai-se por baixo dele. Nenhuma
  outra seção é fechada dos dois lados, então o trecho inteiro se lê
  como um cômodo à parte, sem precisar clarear nada nem escrever de
  quem é.

  Sobra um par que se explica sozinho: quem compra tem o laranja cheio
  (a comida, o apetite), quem vende tem o toldo (a barraca, o
  trabalho). Dois lugares, sem legenda.

  ------------------------------------------------------------------
  Do lado da imagem, a tela real do app do vendedor. Aqui já moraram
  um pino andando sobre uma malha de pontinhos e um mapa desenhado à
  mão com chave de liga/desliga — os dois existiam porque não havia
  captura de tela, e o segundo chegou a inventar interface (nome de
  barraca, contador de pedidos e faturamento), ou seja, dado
  fabricado com cara de produto.

  Agora há as duas capturas, a de barraca fechada e a de aberta, e o
  cartão do topo se transforma de uma pra outra conforme a página
  rola. Sem controle nenhum pra alternar: quem comanda é o dedo do
  leitor, descer abre a barraca e subir fecha. O que fica na tela ao
  final é a frase que o próprio app escreve — "os clientes por perto
  estão vendo você no mapa" —, que é a promessa da seção dita pelo
  produto.
*/
const statements = [
  {
    text: 'Você aparece no mapa só enquanto está vendendo',
    accent: 'só enquanto está vendendo',
  },
  { text: 'Mudou de esquina, o mapa muda junto', accent: 'o mapa muda junto' },
  {
    text: 'Cardápio, foto e preço direto do celular',
    accent: 'direto do celular',
  },
  {
    text: 'Você acompanha o que saiu e quanto rendeu',
    accent: 'o que saiu e quanto rendeu',
  },
];

const VendorBenefits = () => {
  return (
    <section
      id="pra-vendedor"
      /* `!pt-0` porque a faixa de toldo tem que encostar no topo: ela
         é o telhado da seção, e telhado com margem em cima não é
         telhado. O respiro que o `screen-section` daria vai pro
         container de dentro. */
      /* `!py-0` porque as faixas de toldo têm que encostar nas duas
         pontas: são o teto e o piso da seção, e teto com margem em
         cima não é teto. O respiro vai pro container de dentro. */
      className="screen-section relative flex flex-col overflow-hidden !py-0"
      style={{
        backgroundImage:
          'linear-gradient(180deg, #17110C 0%, #17110C 60%, #0F0C09 100%)',
      }}
    >
      <div className="awning-band shrink-0" aria-hidden="true" />

      {/* Glow ambiente, igual às outras seções escuras — sem ele o
          degradê quase-preto fica sem nenhuma cor viva. */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-24 top-1/2 -z-10 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-ember-600/[0.12] blur-[110px] sm:h-[500px] sm:w-[500px] sm:blur-[140px]"
      />

      <EyebrowMarquee label="Pra quem vende" tone="on-dark" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-14 lg:px-8 lg:py-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/*
            `contents` no celular: a coluna de texto deixa de ser uma
            caixa e seus dois filhos (título e pílulas) passam a ser
            itens diretos da grade — que é o que permite o celular
            entrar ENTRE eles na ordem estreita. Sem isso, título e
            pílulas seriam um bloco só, e a imagem só poderia ficar
            antes ou depois dos dois.

            A partir do `lg` ela volta a ser uma coluna de verdade.
          */}
          <div className="contents lg:col-span-6 lg:block">
            <div className="order-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <SectionHeading
                title="Sem ponto fixo, com endereço no mapa"
                description="Assim que a barraca abre, ela entra no mapa — sem mensalidade, sem burocracia."
                tone="dark"
              />
            </div>

            {/* No celular vêm depois da imagem: ela já demonstrou a
                primeira delas, então elas leem como continuação. */}
            <PillList items={statements} tone="on-dark" className="order-3 lg:mt-9" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 flex justify-center lg:col-span-6 lg:justify-end"
          >
            {/*
              Moldura de CSS nas duas larguras — e aqui, ao contrário
              do hero e de "pra quem compra", não é economia, é a
              única forma que funciona.

              A tela do vendedor tem conteúdo só no terço de cima; o
              resto é papel vazio. No `PhoneFrame` isso se resolve com
              máscara (`bleed`): a base dissolve e o aparelho lê como
              algo que continua fora do quadro. No `PhoneModel` não
              tem como — lá a captura é textura colada numa malha 3D,
              e máscara de CSS não alcança pixel dentro de um
              `<canvas>`.

            */}
            <PhoneFrame
              src="/models/vendor-aberta.png"
              beforeSrc="/models/vendor-fechada.png"
              alt="Tela inicial do app do vendedor da Barrakinha: a barraca está aberta e os clientes por perto estão vendo ela no mapa"
              className="w-[250px] sm:w-[300px] lg:w-[360px]"
              bleed
            />
          </motion.div>
        </div>
      </div>

      {/* A segunda faixa fecha o cômodo. É o que nenhuma outra seção
          tem: as demais abrem ou fecham, esta é lacrada dos dois
          lados. */}
      <div className="awning-band shrink-0" aria-hidden="true" />
    </section>
  );
};

export default VendorBenefits;
