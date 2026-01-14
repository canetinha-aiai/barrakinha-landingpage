import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Zap, Heart } from 'lucide-react';

const CustomerBenefits = () => {
  const benefits = [
    {
      icon: MapPin,
      title: 'Encontre Barrakinhas no Mapa',
      description: 'Descubra vendedores de comida de rua perto de você em tempo real. Nunca mais perca aquela barrakinha favorita!',
      color: 'from-orange-400 to-red-500',
    },
    {
      icon: Star,
      title: 'Avaliações e Comentários',
      description: 'Veja o que outros clientes estão dizendo. Avaliações reais de pessoas reais que amam comida de rua.',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Zap,
      title: 'Pedidos Rápidos e Fáceis',
      description: 'Sistema de pedido simples e direto. Peça, pague e pegue sua comida sem complicação.',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Heart,
      title: 'Suporte Local',
      description: 'Apoie vendedores locais e ajude a fortalecer a economia da sua comunidade.',
      color: 'from-pink-500 to-red-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-fredoka text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Por Que Nossos Clientes Amam
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Tudo que você precisa para descobrir e saborear a melhor comida de rua da região
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <benefit.icon className="text-white" size={32} strokeWidth={2} />
                </div>
                <h3 className="font-fredoka text-2xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 font-poppins leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerBenefits;