import React from 'react';
import { Instagram, Music2, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

/*
  O terceiro formulário de e-mail saiu daqui. Ter o mesmo campo três
  vezes na mesma página não aumenta conversão — só dilui o CTA e triplica
  o código a manter. O rodapé agora é navegação e contato, como deve ser.
*/
const Footer = () => {
  const { toast } = useToast();

  const navigate = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const soon = (label) => {
    toast({
      title: 'Ainda não está no ar',
      description: `${label} entra junto com o lançamento do app.`,
    });
  };

  const sections = [
    {
      title: 'Navegar',
      items: [
        { label: 'Como funciona', onClick: () => navigate('#como-funciona') },
        { label: 'Pra você', onClick: () => navigate('#pra-voce') },
        { label: 'Pra vendedor', onClick: () => navigate('#pra-vendedor') },
        { label: 'Entrar na lista', onClick: () => navigate('#lista') },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Termos de uso', onClick: () => soon('Os termos de uso') },
        {
          label: 'Política de privacidade',
          onClick: () => soon('A política de privacidade'),
        },
      ],
    },
  ];

  const socials = [
    { icon: Instagram, label: 'Instagram' },
    { icon: Music2, label: 'TikTok' },
  ];

  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <div className="font-display text-xl font-extrabold tracking-[-0.04em] text-cream-50">
              barrakinha
            </div>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-sand-500">
              O mapa da comida de rua do seu bairro. Feito no Brasil, pra quem
              cozinha na calçada e pra quem come em pé.
            </p>

            <a
              href="mailto:contato@barrakinha.com"
              className="mt-6 inline-flex items-center gap-2 text-[14px] text-sand-400 transition-colors hover:text-cream-50"
            >
              <Mail size={15} aria-hidden="true" />
              contato@barrakinha.com
            </a>
          </div>

          {sections.map((section) => (
            <nav key={section.title}>
              <h3 className="eyebrow font-sans">{section.title}</h3>
              <ul className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="text-left text-[14px] text-sand-400 transition-colors hover:text-cream-50"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-6 border-t border-ink-700 pt-8 sm:flex-row sm:items-center">
          <p className="text-[13px] text-sand-500">
            © {new Date().getFullYear()} Barrakinha
          </p>

          <div className="flex items-center gap-1">
            {socials.map((social) => (
              <button
                key={social.label}
                type="button"
                onClick={() => soon(`O nosso ${social.label}`)}
                aria-label={`${social.label} — em breve`}
                className="flex h-10 w-10 items-center justify-center rounded-sm text-sand-500 transition-colors hover:bg-ink-800 hover:text-cream-50"
              >
                <social.icon size={18} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
