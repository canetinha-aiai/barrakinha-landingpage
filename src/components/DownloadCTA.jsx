import React from 'react';
import { motion } from 'framer-motion';
import WaitlistForm from '@/components/WaitlistForm';
import BrandMark from '@/components/BrandMark';

/*
  Fechamento no laranja da marca, fechado pela faixa de toldo.

  Era um bloco preto: numa página inteira de papel, a inversão dava
  peso, mas deixava a única cor forte da página fora do momento em que
  se pede a ação. Agora o fechamento tem a cor da marca — e o hero e o
  rodapé da página passam a rimar, com o mesmo bloco e a mesma faixa.

  O rótulo "Lançamento" em caixa alta saiu junto com os outros: o título
  já diz que é lista de espera.

  O botão falso de Google Play continua fora: botão que só abre um toast
  é ruído, não CTA.
*/
const DownloadCTA = () => {
  return (
    <section className="screen-section flex items-center bg-paper pb-16 pt-20 lg:pb-20 lg:pt-24">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl shadow-lift"
        >
          <div className="relative overflow-hidden bg-brand px-6 py-10 sm:px-8 sm:py-12 lg:px-14 lg:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-awning-lg"
            />
            <div className="brand-scrim" aria-hidden="true" />

            <div className="relative grid grid-cols-1 items-end gap-9 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <BrandMark size={48} />

                {/* No celular o título usa um corpo menor que o
                    display-sm: 40px dentro de um bloco com 24px de
                    padding lateral estoura em telas de 375px. */}
                <h2 className="mt-6 text-[32px] font-extrabold leading-[0.98] tracking-[-0.04em] text-white text-balance sm:text-display-sm md:text-[3rem] md:leading-[0.95] md:tracking-[-0.045em]">
                  Entre na lista e coma primeiro
                </h2>

                <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-white text-pretty md:text-base">
                  Chega primeiro no Android. Vale pra quem quer comprar e pra
                  quem quer vender.
                </p>
              </div>

              <div className="lg:col-span-5">
                <WaitlistForm
                  tone="brand"
                  label="Quero o convite"
                  helper="Um e-mail só, no dia do lançamento."
                  messages={{
                    successTitle: 'Você está na lista',
                    successDescription:
                      'Assim que o app entrar no ar, o convite chega no seu e-mail.',
                  }}
                  className="max-w-none"
                />
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default DownloadCTA;
