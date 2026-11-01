import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Awning from '@/components/Awning';
import FoodMarquee from '@/components/FoodMarquee';
import NearMiss from '@/components/NearMiss';
import CustomerBenefits from '@/components/CustomerBenefits';
import VendorBenefits from '@/components/VendorBenefits';
import BeforeAfter from '@/components/BeforeAfter';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';
import MobileCTABar from '@/components/MobileCTABar';

/*
  A página alterna as três superfícies da marca: hero laranja com o
  toldo → faixa das comidas e a cena do problema em noite → pra quem
  compra em papel → pra quem vende em noite, debaixo do toldo → antes e
  depois em papel → lista de espera de volta no laranja → rodapé noite.

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
          {/* O toldo do hero pendura sobre a faixa escura de baixo. */}
          <div className="bg-night">
            <Awning stripe="#F85A35" between="#FBF7F2" />
          </div>
          <FoodMarquee />
          <NearMiss />
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
      <Analytics />
    </>
  );
}

export default App;
