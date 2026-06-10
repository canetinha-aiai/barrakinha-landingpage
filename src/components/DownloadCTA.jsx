import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Beef, Coffee, Croissant, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { config } from '@/config';

const DownloadCTA = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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
            description: "Avisaremos você assim que o aplicativo for lançado no Google Play!",
          });
        } else {
          throw new Error('Falha no envio');
        }
      } else {
        console.warn("Aviso de Dev: Nenhuma URL de Planilha do Google configurada em src/config.js. Simulando sucesso.");
        await new Promise(resolve => setTimeout(resolve, 800));
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
        description: "Não conseguimos cadastrar seu e-mail. Verifique a conexão e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyMe = () => {
    toast({
      title: "Estamos cozinhando algo especial!",
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
            Em Desenvolvimento
          </div>
          <h2 className="font-fredoka text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Estamos Quase Lá!
          </h2>
          <p className="text-xl sm:text-2xl text-white/95 font-poppins mb-10 max-w-3xl mx-auto">
            O Barrakinha está sendo preparado com muito carinho e sabor. Em breve no seu Android!
          </p>
        </motion.div>

        {/* Email Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-md mx-auto mb-12 text-left sm:text-center"
        >
          <form 
            onSubmit={handleSubscribe} 
            className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-xl focus-within:ring-2 focus-within:ring-white transition-all duration-300"
          >
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail" 
              required 
              autoComplete="email"
              className="w-full px-4 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder-white/70 font-poppins text-base min-h-[48px]"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto bg-white hover:bg-orange-50 text-orange-600 font-poppins font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0 min-h-[48px] flex items-center justify-center gap-2"
            >
              {loading ? 'Cadastrando...' : 'Me Avise!'}
            </button>
          </form>
          <p className="text-white/80 font-poppins text-xs mt-3 text-center">
            Notificaremos assim que o aplicativo for lançado.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
        >
          <Button
            onClick={handleNotifyMe}
            size="lg"
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-poppins font-semibold px-8 py-5 text-sm rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-3"
          >
            <Smartphone size={24} />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">Em Breve no</div>
              <div className="text-base font-bold">Google Play</div>
            </div>
            <Clock size={14} className="text-white/80" />
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
            <span>Novidades em Breve</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadCTA;