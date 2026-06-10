import React from 'react';
import { motion } from 'framer-motion';
import { MapPinned, TrendingUp, Smartphone, Users } from 'lucide-react';

const VendorBenefits = () => {
  const benefits = [
    {
      icon: MapPinned,
      title: 'Venda em Qualquer Lugar',
      description: 'Mobilidade total. Marque sua localização e deixe os clientes te encontrarem onde você estiver.',
    },
    {
      icon: TrendingUp,
      title: 'Destaque no Mapa',
      description: 'Seu negócio aparece automaticamente para clientes na sua região, aumentando sua visibilidade.',
    },
    {
      icon: Smartphone,
      title: 'Painel de Pedidos Simples',
      description: 'Receba, gerencie e confirme pedidos direto pelo app. Sem burocracia, tudo na palma da mão.',
    },
    {
      icon: Users,
      title: 'Mais Clientes Próximos',
      description: 'Conecte-se de forma direta com milhares de clientes que procuram comida de rua autêntica.',
    },
  ];

  return (
    <section id="vendor-benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Image Column - Clean, Framed, order-last on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 order-last lg:order-first relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 aspect-[16/9] sm:aspect-[4/3] bg-white">
              <img 
                src="https://images.unsplash.com/photo-1610139413990-b0cd120a8d84" 
                alt="Vendedor ambulante de comida de rua preparando lanches"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <h2 className="font-fredoka text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Venda Sem Lugar Fixo, Com Visibilidade Total
            </h2>
            <p className="text-base sm:text-lg text-gray-500 font-poppins mb-10 max-w-2xl leading-relaxed">
              Transforme seu negócio ambulante em um ponto digital dinâmico. Alcance novos clientes na sua vizinhança e venda mais, sem complicação.
            </p>

            {/* Clean Grid Layout - flex-row on items for cleaner mobile scanning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex flex-row items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100/50 shrink-0 mt-0.5">
                    <benefit.icon size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-fredoka text-lg font-bold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-poppins leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default VendorBenefits;