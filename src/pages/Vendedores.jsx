import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import VendorBenefits from '@/components/VendorBenefits';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';
import MobileCTABar from '@/components/MobileCTABar';
import Magnetic from '@/components/Magnetic';
import SpringPress from '@/components/fluid/SpringPress';
import { jump } from '@/lib/nav';

/*
  /vendedores — a página de quem tem barraca.

  A home ficou só pra quem compra: o cliente não precisa ler sobre
  mensalidade, localização da barraca e quanto rendeu o dia. Quem
  clica em "Tenho uma barraca" ou "Pra quem vende" cai aqui.

  Abre no papel, como a home (é a mesma marca): o laranja fica nos
  elementos — o botão e a palavra-chave do título —, não no fundo. O
  título da página é o h1; logo abaixo vem a seção do vendedor que antes ficava
  no meio da home (VendorBenefits, com o toldo e as telas do app do
  vendedor), e fecha com a mesma lista de espera.
*/
const VendorHero = () => (
  <section id="top" className="bg-paper pt-16 text-ink">
    <div className="mx-auto w-full max-w-6xl px-5 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-20">
      <h1 className="display-wide max-w-[14ch] animate-enter text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-balance [animation-delay:80ms] sm:text-[4rem] lg:text-[5rem]">
        Sua barraca no <span className="text-ember-text">mapa</span> do bairro.
      </h1>
      <p className="mt-7 max-w-[40ch] animate-enter text-[18px] leading-relaxed text-ink-muted text-pretty [animation-delay:200ms]">
        Abriu a barraca, ela aparece pra quem está por perto. Sem ponto
        fixo, sem mensalidade e sem burocracia.
      </p>
      <div className="mt-9 flex animate-enter flex-col gap-5 [animation-delay:300ms] sm:flex-row sm:items-center sm:gap-7">
        <Magnetic className="w-full sm:w-auto">
          <SpringPress
            as="a"
            href="#lista"
            onClick={(event) => jump(event, '#lista')}
            className="btn-ember h-14 w-full text-base sm:h-12 sm:w-auto"
          >
            Entrar na lista de espera
          </SpringPress>
        </Magnetic>
        <a
          href="/"
          className="self-center rounded text-[16px] font-semibold underline decoration-ink/30 underline-offset-[6px] hover:decoration-ember sm:self-auto"
        >
          Quero comprar
        </a>
      </div>
    </div>
  </section>
);

const Vendedores = () => (
  <>
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <VendorHero />
        <VendorBenefits />
        <DownloadCTA />
      </main>
      <Footer />
      <MobileCTABar />
    </div>
    <Toaster />
    <Analytics />
  </>
);

export default Vendedores;
