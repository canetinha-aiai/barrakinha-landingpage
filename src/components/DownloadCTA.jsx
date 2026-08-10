import React from 'react';
import { motion } from 'framer-motion';
import WaitlistForm from '@/components/WaitlistForm';

/*
  Antes: fundo em gradiente vermelho→laranja→vermelho, quatro ícones de
  comida girando, dois blobs animados em blur e um botão falso de
  Google Play.

  Agora: um único bloco de cor chapada com o título grande e o
  formulário. O botão de loja saiu porque ele não levava a lugar nenhum —
  botão que abre um toast é ruído, não CTA.
*/
const DownloadCTA = () => {
  return (
    <section id="lista-final" className="bg-ink-950 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-16"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-ink-500" aria-hidden="true" />
              <span className="eyebrow">Lançamento</span>
            </div>

            <h2 className="mt-5 text-display-sm text-cream-50 text-balance md:text-display-md">
              Entre na lista e coma
              <br className="hidden sm:block" /> primeiro que o resto do bairro
            </h2>

            <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-sand-400 text-pretty md:text-base">
              O app está em desenvolvimento e chega primeiro no Android. Quem
              está na lista recebe o convite antes da abertura pública — vale
              pra quem quer comprar e pra quem quer cadastrar a barraca.
            </p>
          </div>

          <div className="lg:col-span-5">
            <WaitlistForm
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
