import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Utensils } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Clientes Encontram',
      description: 'Usuários descobrem barrakinhas próximas usando nosso mapa interativo. Filtram por tipo de comida, avaliações e distância.',
      color: 'from-orange-400 to-red-500',
    },
    {
      number: 2,
      icon: ShoppingBag,
      title: 'Fazem Pedidos',
      description: 'Navegam pelo cardápio, escolhem seus pratos favoritos e fazem o pedido de forma rápida e fácil pelo app.',
      color: 'from-red-500 to-pink-500',
    },
    {
      number: 3,
      icon: Utensils,
      title: 'Recebem Comida Fresca',
      description: 'Pegam sua comida direto com o vendedor. Comida de rua autêntica, fresquinha e cheia de sabor!',
      color: 'from-pink-500 to-red-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-fredoka text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Como Funciona?
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Três passos simples para matar a fome com comida de rua de verdade
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 via-red-400 to-pink-400 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Number Circle */}
                  <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl mb-6 group hover:scale-110 transition-transform duration-300`}>
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                    <span className="font-fredoka text-4xl font-bold text-white relative z-10">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4`}>
                    <step.icon className="text-white" size={32} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="font-fredoka text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 font-poppins leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-6">
                    <div className="w-1 h-12 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;