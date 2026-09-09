import React from 'react';
import { motion } from 'framer-motion';
import WaitlistForm from '@/components/WaitlistForm';

/*
  Fechamento igual ao do smartserialnumber.com: não é mais um bloco de
  cor cheia como antes — é a mesma seção escura do resto da página,
  centralizada, com um glow suave atrás do título e o trecho principal
  da frase pintado na cor da marca. O peso vem da tipografia grande, não
  de uma caixa colorida.
*/
const DownloadCTA = () => {
  return (
    <section
      id="lista"
      className="screen-section relative flex flex-col items-center justify-center overflow-hidden bg-ink-950 px-5 text-center scroll-mt-16 lg:py-20"
    >
      {/* Glow pulsando devagar, sem parar — o único movimento contínuo
          (não ligado a scroll nem a entrada) da seção, pra fechar a
          página com um pouco de vida em vez de um fundo parado. */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-600/[0.12] blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-xl flex-col items-center"
      >
        <h2 className="text-[34px] font-extrabold leading-[1.02] tracking-[-0.035em] text-paper text-balance sm:text-[44px] lg:text-[52px]">
          Entre na lista e{' '}
          <span className="text-ember-500">coma primeiro</span>
        </h2>

        <p className="mt-5 max-w-[36ch] text-[16px] leading-relaxed text-sand-300 text-pretty lg:text-lg">
          Chega primeiro no Android. Vale pra quem quer comprar e pra quem
          quer vender.
        </p>

        <WaitlistForm
          tone="dark"
          label="Quero o convite"
          helper="Um e-mail só, no dia do lançamento."
          messages={{
            successTitle: 'Você está na lista',
            successDescription:
              'Assim que o app entrar no ar, o convite chega no seu e-mail.',
          }}
          className="mx-auto mt-9 text-center"
        />
      </motion.div>
    </section>
  );
};

export default DownloadCTA;
