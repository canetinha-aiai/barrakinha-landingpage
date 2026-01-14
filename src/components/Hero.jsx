import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Beef, Coffee, Croissant } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToDownload = () => {
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVendor = () => {
    document.getElementById('vendor-benefits')?.scrollIntoView({ behavior: 'smooth' });
  };

  const floatingIcons = [
    { Icon: Beef, top: '15%', left: '10%', delay: 0 },
    { Icon: Coffee, top: '25%', right: '15%', delay: 0.2 },
    { Icon: Croissant, bottom: '20%', left: '12%', delay: 0.4 },
    { Icon: Beef, bottom: '30%', right: '10%', delay: 0.6 },
    { Icon: Coffee, top: '40%', left: '8%', delay: 0.3 },
    { Icon: Croissant, top: '60%', right: '12%', delay: 0.5 },
  ];

  return (
    <>
      <Helmet>
        <title>Barrakinha - Comida de Rua, Direto pra Você</title>
        <meta name="description" content="Descubra barrakinhas de comida de rua perto de você. Conectando vendedores ambulantes com clientes que amam comida de qualidade." />
      </Helmet>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1672934324126-257a393a9aa8" 
            alt="Comida de rua deliciosa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/80 via-orange-500/60 to-transparent"></div>
        </div>

        {/* Floating Food Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-white/20 hidden md:block"
            style={{
              top: item.top,
              bottom: item.bottom,
              left: item.left,
              right: item.right,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <item.Icon size={48} strokeWidth={1.5} />
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-fredoka text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Barrakinha
            </h1>
            <p className="font-fredoka text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-8">
              Comida de Rua, Direto pra Você
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-poppins"
          >
            Conectando você com os melhores vendedores de comida de rua da região. 
            Autêntico, saboroso e sempre pertinho de você!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={scrollToDownload}
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-poppins font-semibold px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
            >
              Baixar App
            </Button>
            <Button
              onClick={scrollToVendor}
              size="lg"
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-orange-600 font-poppins font-semibold px-8 py-6 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105"
            >
              Sou Vendedor
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;