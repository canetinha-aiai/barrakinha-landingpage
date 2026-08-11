import React from 'react';
import { motion } from 'framer-motion';
import WaitlistForm from '@/components/WaitlistForm';

/*
  Único bloco escuro da página. Ele existe pra dar peso ao fechamento —
  numa página inteira de papel, a inversão vale mais que qualquer
  aumento de corpo de fonte.

  O botão falso de Google Play saiu: botão que só abre um toast é
  ruído, não CTA.
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
          className="grid grid-cols-1 items-end gap-9 rounded-xl bg-ink-900 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-16"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-ink-700" aria-hidden="true" />
              <span className="eyebrow text-sand-400">Lançamento</span>
            </div>

            {/* No celular o título usa um corpo menor que o display-sm:
                40px dentro de um bloco com 24px de padding lateral
                estoura em telas de 375px. */}
            <h2 className="mt-5 text-[32px] font-extrabold leading-[0.98] tracking-[-0.04em] text-paper text-balance sm:text-display-sm md:text-[3rem] md:leading-[0.95] md:tracking-[-0.045em]">
              Entre na lista e coma primeiro
            </h2>

            <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-sand-300 text-pretty md:text-base">
              Chega primeiro no Android. Vale pra quem quer comprar e pra quem
              quer vender.
            </p>
          </div>

          <div className="lg:col-span-5">
            <WaitlistForm
              tone="dark"
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
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadCTA;
