import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CustomerBenefits from '@/components/CustomerBenefits';
import HowItWorks from '@/components/HowItWorks';
import VendorBenefits from '@/components/VendorBenefits';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';

/*
  Ritmo: papel do começo ao fim, com um degrau de tom no "Como funciona"
  (paper-100) e um único bloco escuro no CTA final. Fundo muda por
  significado, não por variedade.

  A navegação entre os dois públicos vive só no header — ter os mesmos
  dois destinos repetidos em cards logo abaixo do hero era redundância,
  não orientação.
*/
function App() {
  return (
    <>
      <div className="min-h-screen bg-paper">
        <Header />
        <main>
          <Hero />
          <CustomerBenefits />
          <HowItWorks />
          <VendorBenefits />
          <DownloadCTA />
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default App;
