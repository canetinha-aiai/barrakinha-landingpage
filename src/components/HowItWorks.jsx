import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';

/*
  Passos escritos a partir do fluxo real do app (barrakinha-vendedor):
  welcome → register (nome, e-mail, telefone) → otp-code → mapa de
  vendedores → cardápio da loja → carrinho → pedido.

  A versão anterior dizia "nenhum cadastro chato", o que era falso: a
  conta é obrigatória. O que dá pra dizer com honestidade é que ela é
  curta e sem senha, porque o login é por código no e-mail.

  Sem "jornada" e sem avaliação nesta seção: a primeira é termo do app
  do vendedor, a segunda é funcionalidade que ainda não existe.
*/
const steps = [
  {
    title: 'Crie sua conta',
    description:
      'Nome, e-mail e telefone. A confirmação chega por código e o login é sempre assim — você não precisa criar nem lembrar de senha.',
  },
  {
    title: 'Veja quem está na rua',
    description:
      'O mapa mostra as barracas que estão vendendo naquele momento e a que distância cada uma fica de onde você está.',
  },
  {
    title: 'Peça e retire',
    description:
      'Abre o cardápio da barraca, monta o carrinho, confirma o pedido e acompanha o status até a hora de pegar.',
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="bg-ink-900 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Como funciona"
          title="Da conta criada ao espetinho na mão"
          description="Três passos, sem senha pra decorar."
        />

        <ol className="mt-14 border-t border-ink-700 lg:mt-16">
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group border-b border-ink-700 py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-10 md:py-9"
            >
              {/* `md:contents` dissolve este wrapper no desktop, e aí número
                  e título voltam a ser células da grade. No celular ele
                  mantém os dois na mesma linha — antes o número de 44px
                  ocupava uma linha inteira sozinho. */}
              <div className="flex items-baseline gap-4 md:contents">
                <span className="numeric font-display text-[30px] font-extrabold leading-none tracking-[-0.05em] text-sand-600 transition-colors duration-300 group-hover:text-ember-500 md:col-span-2 md:text-[44px]">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="text-[20px] leading-tight text-cream-50 md:col-span-4 md:text-[22px]">
                  {step.title}
                </h3>
              </div>

              <p className="mt-3.5 max-w-prose text-[15px] leading-relaxed text-sand-400 text-pretty md:col-span-6 md:mt-0">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
