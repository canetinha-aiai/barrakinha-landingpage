import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import BenefitList from '@/components/BenefitList';
import LiveMap from '@/components/LiveMap';
import PhotoStrip from '@/components/PhotoStrip';

/*
  "Pra quem compra". Texto e lista de um lado, o mapa do bairro do
  outro — e o mapa faz a demonstração: quando ele entra na tela, as
  barracas abertas caem como pinos e uma fechada abre na frente do
  leitor (ver LiveMap).

  Embaixo, a faixa de fotos de comida (ver PhotoStrip), que só aparece
  quando houver foto de verdade em `src/assets/fotos/`.
*/
const items = [
  {
    title: 'Quem está vendendo agora',
    detail: 'Só aparecem no mapa as barracas que estão abertas agora.',
  },
  {
    title: 'Cardápio e preço no app',
    detail: 'Cada barraca mostra o que vende e quanto custa.',
  },
  {
    title: 'Pedido pronto quando você chega',
    detail: 'Você pede pelo app e retira na barraca, sem pegar fila nem precisar de troco.',
  },
];

const CustomerBenefits = () => (
  <section id="pra-quem-compra" className="section bg-paper">
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8">
      <div className="lg:col-span-6">
        <SectionHeading
          kicker="Pra quem compra"
          title="Escolha a barraca antes de sair de casa"
          description="O mapa mostra quem está vendendo perto de você neste momento."
        />
        <BenefitList items={items} className="mt-10" />
      </div>
      <LiveMap className="lg:col-span-6" />
    </div>

    <PhotoStrip className="mx-auto mt-16 max-w-6xl px-5 lg:px-8" />
  </section>
);

export default CustomerBenefits;
