import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Beef, Coffee, Croissant, ArrowRight, Star, MapPin, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { config } from '@/config';

const Hero = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollToVendor = () => {
    document.getElementById('vendor-benefits')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      if (config.googleSheetUrl) {
        const response = await fetch(config.googleSheetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: email,
            created_at: new Date().toLocaleString('pt-BR')
          }),
        });
        
        if (response.ok) {
          toast({
            title: "Inscrição realizada com sucesso!",
            description: "Seu e-mail foi adicionado à lista de espera. Entraremos em contato em breve!",
          });
        } else {
          throw new Error('Falha no envio');
        }
      } else {
        // Development feedback
        console.warn("Aviso de Dev: Nenhuma URL de Planilha do Google configurada em src/config.js. Simulando sucesso.");
        
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula latência de rede
        
        toast({
          title: "Quase lá! Cadastro Simulado",
          description: "Configure a URL da planilha no arquivo src/config.js para salvar de verdade.",
        });
      }
      setEmail('');
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erro ao se cadastrar",
        description: "Não conseguimos salvar seu e-mail. Verifique sua conexão e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const floatingIcons = [
    { Icon: Beef, top: '15%', left: '42%', delay: 0 },
    { Icon: Coffee, top: '25%', right: '8%', delay: 0.2 },
    { Icon: Croissant, bottom: '20%', left: '45%', delay: 0.4 },
    { Icon: Beef, bottom: '30%', right: '5%', delay: 0.6 },
    { Icon: Coffee, top: '45%', left: '48%', delay: 0.3 },
    { Icon: Croissant, top: '10%', right: '35%', delay: 0.5 },
  ];

  return (
    <>
      <Helmet>
        <title>Barrakinha - Comida de Rua, Direto pra Você</title>
        <meta name="description" content="Descubra barrakinhas de comida de rua perto de você. Conectando vendedores ambulantes com clientes que amam comida de qualidade." />
      </Helmet>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F2] to-white py-16 lg:py-24">
        {/* Background Lights / Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-red-200/20 rounded-full blur-3xl"></div>
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Floating Food Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-orange-500/10 hidden lg:block z-0"
            style={{
              top: item.top,
              bottom: item.bottom,
              left: item.left,
              right: item.right,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 5,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <item.Icon size={44} strokeWidth={1.5} />
          </motion.div>
        ))}

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column - Content & Form */}
            <div className="lg:col-span-7 text-center lg:text-left">
              

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-fredoka text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent mb-4 leading-tight tracking-tight"
              >
                Barrakinha
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-fredoka text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6"
              >
                Comida de Rua, Direto pra Você
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 font-poppins leading-relaxed"
              >
                Conectando você com os melhores vendedores de comida de rua da sua região em tempo real. 
                Garanta seu acesso exclusivo antes de todo mundo e receba benefícios especiais!
              </motion.p>

              {/* Email Form */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col items-center lg:items-start max-w-lg mx-auto lg:mx-0"
              >
                <form 
                  onSubmit={handleSubscribe} 
                  className="flex flex-col sm:flex-row items-center gap-2 w-full bg-white p-2 rounded-2xl border border-gray-200/80 shadow-lg focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all duration-300"
                >
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail" 
                    required 
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 font-poppins text-base placeholder-gray-400 min-h-[48px]"
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-poppins font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0 min-h-[48px] flex items-center justify-center gap-2"
                  >
                    {loading ? 'Cadastrando...' : 'Garantir Acesso'}
                    {!loading && <ArrowRight size={18} />}
                  </Button>
                </form>
                <p className="text-gray-400 font-poppins text-xs mt-3">
                  Nós odiamos spam. Apenas novidades sobre o lançamento.
                </p>
              </motion.div>

              {/* Secondary Buttons / Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start items-center mt-8"
              >
                <span className="text-sm text-gray-500 font-poppins">Quer fazer parte da rede?</span>
                <Button
                  onClick={scrollToVendor}
                  variant="outline"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-poppins font-semibold px-5 py-2 text-sm rounded-full transition-all duration-300 hover:scale-105"
                >
                  Sou Vendedor
                </Button>
              </motion.div>
            </div>

            {/* Right Column - Beautiful Framed Image & Floating Badges */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 2 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="relative w-full max-w-sm md:max-w-md mx-auto aspect-[4/5]"
              >
                {/* Colored background glow behind the card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-red-600 rounded-[2rem] blur-2xl opacity-15 -rotate-6 scale-95 pointer-events-none"></div>

                {/* Main Photo Card */}
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl transition-all duration-500 ease-out hover:rotate-0 hover:scale-[1.02] group">
                  <img 
                    src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Comida de rua autêntica sendo preparada"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 pointer-events-none"></div>
                  
                  {/* Bottom Image Tag */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-fredoka font-bold text-gray-900 text-base leading-tight">Churrascaria do Seu Zé</p>
                      <p className="font-poppins text-xs text-gray-500 mt-1">Seu churrasquinho favorito!</p>
                    </div>
                    <Flame className="text-orange-500 fill-orange-500 shrink-0" size={24} />
                  </div>
                </div>

                {/* Floating Badge 1 - Rating */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -top-4 -left-6 bg-white py-2.5 px-4 rounded-2xl shadow-xl flex items-center gap-2.5 border border-gray-100/50 cursor-default"
                >
                  <Star size={18} className="text-yellow-500 fill-yellow-500 shrink-0" />
                  <div>
                    <p className="font-fredoka font-bold text-sm text-gray-900 leading-none">4.9 / 5.0</p>
                    <p className="text-[10px] text-gray-400 font-semibold font-poppins mt-0.5">Nota dos Clientes</p>
                  </div>
                </motion.div>

                {/* Floating Badge 2 - Live map info */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -bottom-2 -right-6 bg-white py-2.5 px-4 rounded-2xl shadow-xl flex items-center gap-2.5 border border-gray-100/50 cursor-default"
                >
                  <MapPin size={18} className="text-orange-500 shrink-0" />
                  <div>
                    <p className="font-fredoka font-bold text-sm text-gray-900 leading-none">Mapa em Tempo Real</p>
                    <p className="text-[10px] text-gray-400 font-semibold font-poppins mt-0.5">Vendedores no bairro</p>
                  </div>
                </motion.div>

                {/* Floating Badge 3 - Food Icon Accent */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-8 -right-8 w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white text-white"
                >
                  <Coffee size={24} />
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:block"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-orange-500/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-orange-500/50 rounded-full"></div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;