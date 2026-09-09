import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import ScrollProgress from '@/components/ScrollProgress';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProblemsMarquee from '@/components/ProblemsMarquee';
import CustomerBenefits from '@/components/CustomerBenefits';
import HowItWorks from '@/components/HowItWorks';
import VendorBenefits from '@/components/VendorBenefits';
import BeforeAfter from '@/components/BeforeAfter';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';
import MobileCTABar from '@/components/MobileCTABar';

/*
  Estrutura copiada seção a seção do smartserialnumber.com, só trocando
  conteúdo e cor: hero com mockup do produto → faixa rolando com as
  dores do público (no lugar do "com o reconhecimento de", que a
  Barrakinha não tem) → como funciona → os dois blocos de público, um
  do lado do outro, alternando cor cheia da marca e fundo escuro — a
  mesma alternância que lá é Fabricante (lima) / Marca (escuro) /
  Consumidor (lima) — → comparação antes/depois → CTA final escuro e
  centralizado. O case de sucesso do site de referência ficou de fora:
  a Barrakinha ainda não tem um caso real pra mostrar.

  A navegação entre os dois públicos vive só no header; repetir os
  mesmos dois destinos em card logo abaixo do hero seria redundância,
  não orientação.
*/
function App() {
  return (
    <>
      <div className="min-h-screen bg-ink-950">
        <ScrollProgress />
        <Header />
        <main>
          <Hero />
          <ProblemsMarquee />
          <HowItWorks />
          <CustomerBenefits />
          <VendorBenefits />
          <BeforeAfter />
          <DownloadCTA />
        </main>
        <Footer />
        {/* Barra de ação fixa na base, só no celular — ver
            MobileCTABar. No desktop o botão do header cumpre esse
            papel, e ali ele está visível o tempo todo. */}
        <MobileCTABar />
      </div>
      <Toaster />
    </>
  );
}

export default App;
