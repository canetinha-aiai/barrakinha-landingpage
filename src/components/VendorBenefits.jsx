import React from 'react';
import { motion } from 'framer-motion';
import { MapPinned, TrendingUp, Smartphone, Users } from 'lucide-react';

const VendorBenefits = () => {
  const benefits = [
    {
      icon: MapPinned,
      title: 'Venda em Qualquer Lugar da Região',
      description: 'Mobilidade total. Marque sua localização e deixe os clientes te encontrarem onde quer que você esteja.',
    },
    {
      icon: TrendingUp,
      title: 'Destaque Automático no Mapa',
      description: 'Seu negócio aparece automaticamente para clientes próximos, aumentando sua visibilidade.',
    },
    {
      icon: Smartphone,
      title: 'Gerenciamento de Pedidos Simplificado',
      description: 'Receba, gerencie e confirme pedidos direto pelo app. Tudo na palma da sua mão.',
    },
    {
      icon: Users,
      title: 'Aumento de Clientes',
      description: 'Conecte-se com milhares de clientes que procuram comida de rua autêntica e de qualidade.',
    },
  ];

  return (
    <section id="vendor-benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-100 via-orange-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1610139413990-b0cd120a8d84" 
                alt="Vendedor de comida de rua"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/40 to-transparent"></div>
            </div>
            
            {/* Decorative Food Illustrations */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full opacity-20 blur-xl"
            ></motion.div>
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full opacity-20 blur-xl"
            ></motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-fredoka text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Venda Sem Lugar Fixo, Com Visibilidade Total
            </h2>
            <p className="text-xl text-gray-700 font-poppins mb-10">
              Transforme seu negócio ambulante em um empreendimento digital. Alcance mais clientes e venda mais, sem complicação.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="text-white" size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-fredoka text-xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 font-poppins">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VendorBenefits;