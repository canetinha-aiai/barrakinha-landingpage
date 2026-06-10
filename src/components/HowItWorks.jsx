import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Utensils } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Encontre Barrakinhas',
      description: 'Descubra barrakinhas próximas usando nosso mapa interativo em tempo real. Filtre por tipo de comida, avaliação e distância.',
    },
    {
      number: 2,
      icon: ShoppingBag,
      title: 'Faça seu Pedido',
      description: 'Navegue pelo cardápio digital do vendedor, escolha seus pratos favoritos e faça o pedido de forma rápida e fácil.',
    },
    {
      number: 3,
      icon: Utensils,
      title: 'Saboreie na Hora',
      description: 'Pegue sua comida direto com o vendedor. Comida de rua autêntica, fresca, quentinha e cheia de sabor para você aproveitar!',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-fredoka text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Como Funciona?
          </h2>
          <p className="text-base sm:text-lg text-gray-500 font-poppins max-w-2xl mx-auto leading-relaxed">
            Três passos simples para você saborear a melhor comida de rua da sua cidade
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative bg-[#FAFAFA] border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              {/* Large, elegant step number background indicator */}
              <span className="font-fredoka text-8xl font-black text-gray-200/40 absolute -top-2 -right-2 select-none group-hover:text-orange-500/5 transition-colors duration-300">
                0{step.number}
              </span>
              
              <div className="relative z-10">
                {/* Clean soft-colored icon container */}
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100/50 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <step.icon size={22} strokeWidth={2} />
                </div>
                
                {/* Title */}
                <h3 className="font-fredoka text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-500 font-poppins leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;