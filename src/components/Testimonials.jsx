import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Cliente',
      avatar: 'MS',
      rating: 5,
      text: 'Finalmente consigo encontrar aquele pastel que eu sempre procurava! O app é super fácil de usar e os vendedores são incríveis.',
      color: 'from-orange-400 to-red-500',
    },
    {
      name: 'João Santos',
      role: 'Vendedor de Espetinhos',
      avatar: 'JS',
      rating: 5,
      text: 'Meu faturamento aumentou 40% depois que comecei a usar o Barrakinha. Agora os clientes me acham onde quer que eu esteja!',
      color: 'from-red-500 to-pink-500',
    },
    {
      name: 'Ana Costa',
      role: 'Cliente',
      avatar: 'AC',
      rating: 5,
      text: 'Adoro a variedade! Todo dia descubro uma barrakinha nova. As avaliações me ajudam muito a escolher onde comer.',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      name: 'Carlos Mendes',
      role: 'Vendedor de Tapioca',
      avatar: 'CM',
      rating: 5,
      text: 'Simples, prático e eficiente. Recebo os pedidos direto no celular e consigo gerenciar tudo sem complicação.',
      color: 'from-pink-500 to-red-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50/50 to-cream-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
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
            O Que Estão Falando
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Histórias reais de clientes satisfeitos e vendedores que cresceram com a gente
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote size={48} className="text-gray-900" />
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center shadow-lg`}>
                  <span className="font-fredoka text-lg font-bold text-white">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <h4 className="font-fredoka text-lg font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 font-poppins">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 font-poppins leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;