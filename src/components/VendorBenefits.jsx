import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Navigation,
  ClipboardList,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

/*
  A funcionalidade descrita aqui é a "jornada" do app, mas o termo não
  aparece em lugar nenhum da página: quem chega neste site ainda não
  usou o produto e não tem por que conhecer o vocabulário interno dele.
  A landing descreve o que acontece — abrir, aparecer no mapa, fechar —
  e o app apresenta o nome depois.

  Nenhuma menção a taxa, comissão ou repasse: essa conversa acontece
  dentro do app, no cadastro. Anunciar número aqui só cria expectativa
  antes da hora.
*/
const benefits = [
  {
    icon: Clock,
    title: 'Você marca a hora de abrir e fechar',
    description:
      'Enquanto está vendendo, sua barraca aparece no mapa. Ao encerrar, ela sai da lista — ninguém aparece atrás de você depois que fechou.',
  },
  {
    icon: Navigation,
    title: 'Seu ponto é onde você parar',
    description:
      'A localização é a do lugar onde você abriu naquele dia. Mudou de esquina amanhã, o mapa muda junto.',
  },
  {
    icon: ClipboardList,
    title: 'Cardápio e pedidos no celular',
    description:
      'Cadastre comida, lanche e bebida com foto e preço. Os pedidos chegam prontos pra aceitar, sem comanda de papel.',
  },
  {
    icon: BarChart3,
    title: 'Acompanhe suas vendas',
    description:
      'O que saiu, quanto rendeu e em quais dias. Dá pra decidir onde parar amanhã olhando o histórico.',
  },
];

const VendorBenefits = () => {
  return (
    <section id="pra-vendedor" className="bg-cream-50 py-24 text-ink-900 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="light"
              eyebrow="Pra quem vende"
              title="Sem ponto fixo, com endereço no mapa"
              description="Você já tem o cliente do bairro. O que falta é ele saber que hoje você está na rua — e onde."
            />

            {/*
              Aqui entra uma foto real de barraca ou de vendedor
              cadastrado. Sem mock de UI e sem foto de banco de imagem:
              enquanto o material real não existe, a seção se sustenta
              na tipografia.
            */}

            <motion.a
              href="#lista"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => {
                event.preventDefault();
                document
                  .querySelector('#lista')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group mt-9 flex h-14 w-full items-center justify-center gap-2 rounded-sm bg-ink-900 text-base font-medium text-cream-50 transition-colors hover:bg-ink-700 sm:inline-flex sm:h-auto sm:w-auto sm:px-6 sm:py-3.5 sm:text-[15px]"
            >
              Quero cadastrar minha barraca
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"
              />
            </motion.a>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <benefit.icon
                    size={22}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="text-ember-600"
                  />
                  <h3 className="mt-5 text-[19px] leading-tight text-ink-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-sand-600 text-pretty">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-14 border-t border-ink-900/10 pt-8">
              <p className="max-w-prose text-[15px] leading-relaxed text-sand-600 text-pretty">
                O cadastro leva alguns minutos e é feito direto pelo app, com
                e-mail e código de confirmação. As condições de recebimento
                aparecem pra você antes da primeira venda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorBenefits;
