import React from 'react';
import { motion } from 'framer-motion';
import EyebrowMarquee from '@/components/EyebrowMarquee';
import PillList from '@/components/PillList';
import PhoneModel from '@/components/PhoneModelLazy';
import { useIsMobile } from '@/hooks/useMediaQuery';

/*
  "Pra quem compra" — o mesmo bloco que o smartserialnumber.com usa pra
  Fabricante e Consumidor: seção inteira na cor cheia da marca, texto
  escuro por cima, rótulo gigante repetindo no topo, celular flutuando
  de um lado e a chamada + pílulas do outro. Referência estrutural
  medida direto no site: grid de 2 colunas.

  Mesmo `PhoneModel` do hero — o modelo 3D e a screenshot são os mesmos
  arquivos; a cor de fundo daqui não importa pra ele porque o Canvas é
  transparente de verdade (`gl={{ alpha: true }}`), não uma cor assada
  que precisasse combinar com a seção.
*/
const statements = [
  { text: 'Você vê quem está vendendo agora', accent: 'agora' },
  {
    text: 'Você sabe o preço antes de sair de casa',
    accent: 'antes de sair de casa',
  },
  {
    text: 'Você pede pelo app e chega na hora de retirar',
    accent: 'na hora de retirar',
  },
];

const CustomerBenefits = () => {
  const isMobile = useIsMobile();

  return (
    <section
      id="pra-voce"
      className="screen-section relative flex flex-col overflow-hidden bg-brand lg:pt-16"
    >
      {/* Um brilho claro por trás do texto — sem ele o bloco inteiro
          era um tom só de ponta a ponta, pesado e parado. O degradê
          da marca já ajuda (`bg-brand`, não `bg-ember-500` chapado);
          este glow soma outra camada de luz por cima, deslocada pro
          canto onde o texto mora. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 -z-10 h-[560px] w-[560px] rounded-full bg-white/[0.12] blur-[140px]"
      />

      <EyebrowMarquee label="Pra quem compra" tone="on-ember" />

      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-5 lg:px-8 lg:py-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/*
            O aparelho só aparece a partir do desktop.

            No celular ele mostrava a MESMA captura de tela que o hero
            já mostrou 900px acima — a segunda vez que a pessoa via
            exatamente a mesma imagem, agora sem nada novo pra dizer.
            Repetição de imagem não é reforço, é a página perdendo o
            fôlego no meio: a seção é o argumento de quem compra, e o
            que carrega esse argumento são as três frases, não uma
            foto vista de novo.

            Sem ele a seção fica sendo o que já era de fato — cor cheia
            da marca, um título grande e as três frases —, e ganha o
            respiro que o aparelho ocupava.

            No desktop ele fica: lá as duas colunas existem lado a
            lado, a página é bem mais curta, e o aparelho faz par com
            o mapa do bloco de vendedor, mantendo os dois blocos de
            público com o mesmo peso visual.
          */}
          {!isMobile ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 flex justify-center lg:order-1 lg:col-span-6 lg:justify-start"
            >
              {/* Flutuação contínua e sutil — separada do fade de
                  entrada acima (que só roda uma vez) num wrapper à
                  parte, pra não brigar com ele pela mesma
                  propriedade. */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <PhoneModel
                  screenshotSrc="/models/app-screenshot.png"
                  className="aspect-[4/5] w-[320px] sm:w-[400px] lg:w-[460px]"
                  ariaLabel="Tela inicial do app da Barrakinha, mostrando o mapa de barracas abertas e os pedidos do cliente"
                />
              </motion.div>
            </motion.div>
          ) : null}

          <div className="order-1 flex flex-col items-center text-center lg:order-2 lg:col-span-6 lg:items-start lg:text-left">
            <h2 className="max-w-md text-[32px] font-extrabold leading-[1.03] tracking-[-0.035em] text-ink-950 text-balance sm:text-[40px] lg:text-[44px]">
              A comida da sua rua, sem depender da sorte
            </h2>
            <p className="mt-5 max-w-[38ch] text-[16px] leading-relaxed text-ink-950/80 text-pretty lg:text-[17px]">
              Veja no mapa quem está vendendo perto de você e monte o pedido
              antes de sair de casa.
            </p>

            <PillList items={statements} tone="on-ember" className="mt-7 lg:mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerBenefits;
