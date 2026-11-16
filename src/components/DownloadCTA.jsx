import React from 'react';
import WaitlistForm from '@/components/WaitlistForm';
import RevealText from '@/components/fluid/TextReveal';
import Reveal from '@/components/Reveal';

/*
  O fechamento é laranja chapado, como o header: o título grande em
  branco com sombra chapada de tinta, estilo letreiro; o texto menor, o campo
  e o botão em tinta, onde o contraste precisa ser maior. O título sobe
  palavra por palavra como o do hero, e quem se inscreve ganha a rajada
  de pinos do botão (ver PinBurst).
*/
const DownloadCTA = () => (
  <section id="lista" className="scroll-mt-16 bg-ember text-night">
    <div className="section">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 lg:grid-cols-12 lg:items-end lg:gap-8 lg:px-8">
        <div className="lg:col-span-7">
          <RevealText
            text="Guarde seu lugar na estreia."
            className="display-wide max-w-[13ch] text-white [text-shadow:3px_3px_0_#1D1611] sm:[text-shadow:5px_5px_0_#1D1611] text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-balance sm:text-[4rem] lg:text-[5rem]"
          />
          <Reveal as="p" delay={0.1} className="mt-6 max-w-[40ch] text-[18px] font-medium leading-relaxed text-night/80 text-pretty">
            Deixe seu e-mail e a gente avisa quando o app chegar no Android, tanto
            pra quem compra quanto pra quem vende.
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-5">
        <WaitlistForm
          tone="ember"
          label="Entrar na lista"
          helper="A gente manda um e-mail só, no dia do lançamento."
          messages={{
            successTitle: 'Você está na lista',
            successDescription:
              'Quando o app entrar no ar, o convite chega no seu e-mail.',
          }}
        />
        </Reveal>
      </div>
    </div>
  </section>
);

export default DownloadCTA;
