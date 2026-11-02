import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import BenefitList from '@/components/BenefitList';
import PhoneFrame from '@/components/PhoneFrame';
import Awning from '@/components/Awning';

/*
  "Pra quem vende" — a seção do vendedor é a barraca por dentro: fundo
  noite, com o toldo pendurado no topo. O toldo é do vendedor (quem tem
  barraca tem toldo), então é aqui que ele mais aparece.

  A captura é a tela real do app do vendedor, com as duas versões
  (barraca fechada e aberta) cruzando conforme a página rola: descer
  abre a barraca. O que fica na tela é a frase que o próprio app
  escreve — "os clientes por perto estão vendo você no mapa".
*/
const items = [
  {
    title: 'No mapa só enquanto vende',
    detail: 'A barraca aparece quando você abre e some quando você fecha, então ninguém vai até lá à toa.',
  },
  {
    title: 'Trocou de esquina, o mapa acompanha',
    detail: 'A localização da barraca muda junto com você.',
  },
  {
    title: 'Cardápio no celular',
    detail: 'Você muda fotos, itens e preços de onde estiver.',
  },
  {
    title: 'Quanto rendeu o dia',
    detail: 'Você vê o que vendeu e quanto entrou.',
  },
];

const VendorBenefits = () => (
  <section id="pra-quem-vende" className="bg-night text-cream">
    <Awning stripe="#F85A35" between="#FBF7F2" unroll />

    <div className="section !pt-16 lg:!pt-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-12 lg:items-start lg:gap-10 lg:px-8">
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <SectionHeading
            tone="night"
            kicker="Pra quem vende"
            title="Sem ponto fixo, com endereço no mapa"
            description="Quando você abre a barraca, ela aparece no mapa. Não tem mensalidade nem burocracia."
          />
          <BenefitList tone="night" items={items} className="mt-10" />
        </div>

        <div className="flex justify-center lg:col-span-5 lg:row-start-1 lg:justify-start">
          <PhoneFrame
            src="/models/vendor-aberta.png"
            beforeSrc="/models/vendor-fechada.png"
            alt="Tela inicial do app do vendedor da Barrakinha: a barraca está aberta e os clientes por perto estão vendo ela no mapa"
            className="w-full max-w-[340px] -rotate-2 border-2 border-cream lg:sticky lg:top-28"
            crop="9 / 10"
          />
        </div>
      </div>
    </div>
  </section>
);

export default VendorBenefits;
