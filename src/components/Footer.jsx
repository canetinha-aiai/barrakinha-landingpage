import React from 'react';
import { Instagram, Music2, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

/*
  Rodapé claro, separado por hairline. Não tem formulário aqui de
  propósito: o mesmo campo três vezes na página não aumenta conversão,
  só dilui o CTA e triplica o código a manter.
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
    <footer className="border-t border-paper-200 bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          <div className="col-span-2">
            <div className="font-display text-xl font-extrabold tracking-[-0.04em] text-ink-900">
              barrakinha
            </div>
            <p className="mt-3 max-w-[32ch] text-[14px] leading-relaxed text-ink-600">
              O mapa da comida de rua do seu bairro.
            </p>

            <a
              href="mailto:contato@barrakinha.com"
              className="mt-5 inline-flex items-center gap-2 text-[14px] text-ink-600 transition-colors hover:text-ink-900"
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
                      className="text-left text-[14px] text-ink-600 transition-colors hover:text-ink-900"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-paper-200 pt-8 sm:flex-row sm:items-center">
          <p className="text-[13px] text-ink-600">
            © {new Date().getFullYear()} Barrakinha
          </p>

          <div className="flex items-center gap-1">
            {socials.map((social) => (
              <button
                key={social.label}
                type="button"
                onClick={() => soon(`O nosso ${social.label}`)}
                aria-label={`${social.label} — em breve`}
                className="flex h-10 w-10 items-center justify-center rounded-sm text-sand-500 transition-colors hover:bg-paper-100 hover:text-ink-900"
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
