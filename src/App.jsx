import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CustomerBenefits from '@/components/CustomerBenefits';
import VendorBenefits from '@/components/VendorBenefits';
import HowItWorks from '@/components/HowItWorks';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';

/*
  Ritmo da página: escuro → escuro → creme → escuro → escuro.
  A única inversão de fundo é a seção do vendedor, que também é onde o
  público muda. Fundo não deve mudar por variedade, só por significado.
*/
function App() {
  return (
    <>
      <div className="min-h-screen bg-ink-900">
        <Header />
        <main>
          <Hero />
          <CustomerBenefits />
          <VendorBenefits />
          <HowItWorks />
          <DownloadCTA />
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default App;
