import React from 'react';
import WaitlistForm from '@/components/WaitlistForm';
import Awning from '@/components/Awning';
import RevealText from '@/components/RevealText';

/*
  O fechamento volta ao laranja do hero: a página abre e fecha na
  mesma barraca, com o toldo pendurado no topo do bloco. O título sobe
  palavra por palavra como o do hero, e quem se inscreve ganha a rajada
  de pinos do botão (ver PinBurst).
*/
const DownloadCTA = () => (
  <section id="lista" className="scroll-mt-16 bg-ember text-night">
    <Awning stripe="#F85A35" between="#FBF7F2" unroll />

    <div className="section !pt-14 lg:!pt-20">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 lg:grid-cols-12 lg:items-end lg:gap-8 lg:px-8">
        <div className="lg:col-span-7">
          <p className="text-label font-semibold">Lista de espera</p>
          <RevealText
            text="Guarde seu lugar na estreia."
            className="display-wide mt-4 max-w-[13ch] text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-balance sm:text-[4rem] lg:text-[5rem]"
          />
          <p className="mt-6 max-w-[40ch] text-[18px] font-medium leading-relaxed text-night/80 text-pretty">
            Deixe seu e-mail e a gente avisa quando o app chegar no Android, tanto
            pra quem compra quanto pra quem vende.
          </p>
        </div>

        <WaitlistForm
          tone="ember"
          className="lg:col-span-5"
          label="Entrar na lista"
          helper="A gente manda um e-mail só, no dia do lançamento."
          messages={{
            successTitle: 'Você está na lista',
            successDescription:
              'Quando o app entrar no ar, o convite chega no seu e-mail.',
          }}
        />
      </div>
    </div>
  </section>
);

export default DownloadCTA;
