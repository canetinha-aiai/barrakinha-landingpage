import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BookOpen, ClipboardList, Heart } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

/*
  Cada item corresponde a uma tela que já existe no app do cliente:
  mapa, cardápio da loja, pedidos e favoritos.

  Duas coisas que ficaram de fora de propósito:

  1. "Jornada" é o nome que o vendedor usa pra abrir e fechar o ponto
     dentro do app dele. Pro cliente isso é jargão — ele só precisa
     saber que a barraca aparece quando está aberta e some quando fecha.

  2. Nada de nota, estrela ou avaliação: essa funcionalidade não existe.
     Anunciar aqui seria promessa que o app não cumpre no dia 1.
*/
const benefits = [
  {
    icon: MapPin,
    title: 'Mapa em tempo real',
    description:
      'A barraca aparece no mapa enquanto está vendendo e some quando fecha. Você só vê quem está na rua agora.',
  },
  {
    icon: BookOpen,
    title: 'Cardápio com preço',
    description:
      'Comida, lanche e bebida com valor antes de sair de casa. Nada de chegar e descobrir o preço.',
  },
  {
    icon: ClipboardList,
    title: 'Pedido acompanhado',
    description:
      'Monte o carrinho, confirme e acompanhe o status até a hora de retirar. Sem esperar em pé na calçada.',
  },
  {
    icon: Heart,
    title: 'Barracas favoritas',
    description:
      'Marque as que você gosta e ache elas rápido sempre que estiverem abertas por perto.',
  },
];

/*
  Antes: quatro caixas brancas soltas, cada uma com um círculo de
  gradiente diferente e sombra pesada no hover.

  Agora: um único bloco dividido por hairlines, do jeito que uma
  tabela editorial faria. O ícone é traço fino, o índice numérico dá
  ordem de leitura e o hover só troca a cor de fundo da célula.

  Nada aqui fala de taxa ou repasse — isso é assunto do app, depois
  do cadastro, não da primeira visita.
*/
const CustomerBenefits = () => {
  return (
    <section id="pra-voce" className="bg-ink-900 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Pra quem come"
          title="A comida boa da sua rua, sem depender da sorte"
          description="Você já sabe que a barraca existe. O que falta é saber se ela está lá hoje."
        />

        {/* No celular a célula vai de ponta a ponta e o texto alinha com a
            margem da seção. Com padding horizontal, a linha ganhava recuo
            duplo e o card ficava apertado. O hover também só entra a
            partir do sm — em tela de toque ele não existe. */}
        <div className="mt-14 grid grid-cols-1 border-t border-ink-700 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group border-b border-ink-700 py-7 transition-colors duration-300 sm:p-7 sm:hover:bg-ink-800 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 lg:[&:nth-child(odd)]:border-r"
            >
              <div className="flex items-center justify-between">
                <benefit.icon
                  size={22}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="text-ember-500"
                />
                <span className="numeric font-display text-[13px] font-bold text-sand-500 transition-colors group-hover:text-cream-50">
                  0{index + 1}
                </span>
              </div>

              <h3 className="mt-6 text-[19px] leading-tight text-cream-50 sm:mt-8">
                {benefit.title}
              </h3>

              <p className="mt-2.5 text-[15px] leading-relaxed text-sand-400 text-pretty sm:mt-3 sm:text-[14px]">
                {benefit.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerBenefits;
