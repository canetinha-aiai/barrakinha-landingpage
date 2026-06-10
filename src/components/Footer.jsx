import React, { useState } from 'react';
import { Instagram, Music2, Mail, MapPin, Phone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { config } from '@/config';

const Footer = () => {
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
            description: "Seu e-mail foi adicionado à nossa newsletter!",
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
        title: "Erro ao se inscrever",
        description: "Não conseguimos salvar seu e-mail. Verifique a conexão e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (section) => {
    toast({
      title: "Em breve!",
      description: `A seção ${section} estará disponível em breve!`,
    });
  };

  const handleSocialClick = (platform) => {
    toast({
      title: "Redes Sociais",
      description: `Nosso ${platform} estará no ar em breve. Aguarde novidades!`,
    });
  };

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
    { icon: Music2, label: 'TikTok', color: 'text-purple-500' },
  ];

  const quickLinks = [
    { label: 'Sobre Nós', section: 'Sobre' },
    { label: 'Contato', section: 'Contato' },
    { label: 'Termos de Uso', section: 'Termos' },
    { label: 'Política de Privacidade', section: 'Privacidade' },
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <h3 className="font-fredoka text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              Barrakinha
            </h3>
            <p className="text-gray-400 font-poppins mb-4">
              Conectando você com a melhor comida de rua da região.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <div key={index} className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSocialClick(social.label)}
                    className={`opacity-50 cursor-not-allowed hover:bg-transparent ${social.color} transition-colors duration-300`}
                    aria-label={`${social.label} (Em breve)`}
                  >
                    <social.icon size={20} />
                  </Button>
                  {/* "Coming Soon" tooltip-like indicator */}
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Em breve
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-fredoka text-lg font-bold mb-4 text-orange-400">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.section)}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-300 font-poppins"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-fredoka text-lg font-bold mb-4 text-orange-400">
              Contato
            </h4>
            <ul className="space-y-3 text-gray-400 font-poppins">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-orange-400" />
                <span>contato@barrakinha.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-orange-400" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-orange-400" />
                <span>Brasil</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="font-fredoka text-lg font-bold mb-4 text-orange-400">
              Fique Ligado
            </h4>
            <p className="text-gray-400 font-poppins mb-4 text-sm">
              Receba novidades sobre novos vendedores e promoções!
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail" 
                required 
                autoComplete="email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-white placeholder-gray-500 text-sm font-poppins min-h-[40px]"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-poppins font-semibold rounded-lg transition-all duration-300 py-2 text-sm min-h-[40px] flex items-center justify-center"
              >
                {loading ? 'Cadastrando...' : 'Inscrever-se'}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 font-poppins text-sm text-center md:text-left">
              © 2026 Barrakinha. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 font-poppins text-sm text-center md:text-right flex items-center justify-center md:justify-end gap-1">
              Feito com <Heart size={14} className="text-red-500 fill-red-500 inline shrink-0" /> para amantes de comida de rua
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;