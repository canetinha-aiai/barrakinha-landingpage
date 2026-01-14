import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Beef, Coffee, Croissant, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const DownloadCTA = () => {
  const { toast } = useToast();

  const handleNotifyMe = () => {
    toast({
      title: "🚀 Estamos cozinhando algo especial!",
      description: "O app estará disponível no Google Play em breve. Obrigado pelo interesse!",
    });
  };

  const floatingIcons = [
    { Icon: Beef, top: '10%', left: '5%', delay: 0 },
    { Icon: Coffee, top: '20%', right: '8%', delay: 0.2 },
    { Icon: Croissant, bottom: '15%', left: '10%', delay: 0.4 },
    { Icon: Beef, bottom: '25%', right: '5%', delay: 0.6 },
  ];

  return (
    <section id="download" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-600 via-orange-500 to-red-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        ></motion.div>
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
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 5,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <item.Icon size={64} strokeWidth={1.5} />
        </motion.div>
      ))}

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold font-poppins mb-6 animate-pulse">
            🚧 Em Desenvolvimento
          </div>
          <h2 className="font-fredoka text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Estamos Quase Lá!
          </h2>
          <p className="text-2xl sm:text-3xl text-white/95 font-poppins mb-12 max-w-3xl mx-auto">
            O Barrakinha está sendo preparado com muito carinho e sabor. Em breve no seu Android!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
        >
          {/* iOS Removed as requested */}

          <Button
            onClick={handleNotifyMe}
            size="lg"
            className="bg-white/90 hover:bg-white text-gray-500 font-poppins font-semibold px-10 py-7 text-lg rounded-2xl shadow-xl transition-all duration-300 cursor-not-allowed flex items-center gap-3 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gray-100/50"></div>
            <div className="relative flex items-center gap-3 z-10 opacity-70">
              <Smartphone size={32} />
              <div className="text-left">
                <div className="text-xs uppercase tracking-wider font-bold">Em Breve no</div>
                <div className="text-xl font-bold">Google Play</div>
              </div>
            </div>
            <div className="absolute top-2 right-2 text-orange-500">
              <Clock size={16} />
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 text-white/90 font-poppins text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Download será Grátis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Versão Beta em Breve</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadCTA;