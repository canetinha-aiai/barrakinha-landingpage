import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FoodMarquee from '@/components/FoodMarquee';
import HowItWorks from '@/components/HowItWorks';
import BeforeAfter from '@/components/BeforeAfter';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';
import MobileCTABar from '@/components/MobileCTABar';

/*
  A página alterna as três superfícies da marca: header laranja → hero
  em papel com o mapa → faixa das comidas em noite (corte reto) → pra quem compra (os três passos do app) em papel → antes e
  depois em papel → lista de espera no laranja → rodapé noite.

  Sem barra de progresso de rolagem: o navegador já mostra onde a
  pessoa está, e uma segunda barra colorida no topo era só mais uma
  coisa se mexendo.
*/
function App() {
  return (
    <>
      <div className="min-h-screen bg-paper">
        <Header />
        <main>
          <Hero />
          <FoodMarquee />
          <HowItWorks />
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
      <Analytics />
    </>
  );
}

export default App;
