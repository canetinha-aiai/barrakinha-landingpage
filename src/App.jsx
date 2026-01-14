import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import Hero from '@/components/Hero';
import CustomerBenefits from '@/components/CustomerBenefits';
import VendorBenefits from '@/components/VendorBenefits';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';

function App() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Hero />
        <CustomerBenefits />
        <VendorBenefits />
        <HowItWorks />
        <Testimonials />
        <DownloadCTA />
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default App;