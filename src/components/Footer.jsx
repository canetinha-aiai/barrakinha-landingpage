import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import BrandMark from '@/components/BrandMark';

/*
  Rodapé em noite — a página fecha escura depois do laranja da lista,
  como o fim do expediente da barraca. Não tem formulário aqui de
  propósito: o mesmo campo duas vezes na página não aumenta conversão,
  só dilui o convite.

  As redes viraram texto em vez de ícone. Três ícones de traço fino
  soltos num canto eram o detalhe mais genérico da página, e o nome
  escrito é mais rápido de reconhecer do que um logo de 18px.

  O crédito do modelo 3D saiu junto com o modelo: a página não usa
  mais o `.glb`, e a licença CC BY pede atribuição só onde a obra
  aparece.
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
        { label: 'Pra quem compra', onClick: () => navigate('#pra-quem-compra') },
        { label: 'Pra quem vende', onClick: () => navigate('#pra-quem-vende') },
        { label: 'Lista de espera', onClick: () => navigate('#lista') },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Termos de uso', onClick: () => soon('Os termos de uso') },
        { label: 'Política de privacidade', href: '/privacidade.html' },
      ],
    },
  ];

  /* Rede que já existe leva `href` e vira link de verdade; a que não
     existe continua avisando que ainda não está no ar. O link associa
     o site ao perfil — é o que faz um buscador entender "Barrakinha"
     como nome próprio e não como erro de digitação de "barraquinha".
     O `sameAs` do JSON-LD em index.html declara a mesma coisa. */
  const socials = [
    { label: 'Instagram', href: 'https://www.instagram.com/barrakinha.app/' },
    /* `x.com` e não `twitter.com`: o antigo redireciona pro novo. */
    { label: 'X', href: 'https://x.com/barrakinha_app' },
    { label: 'TikTok' },
  ];

  const linkClass =
    '-my-1 block rounded py-1 text-left text-[15px] text-night-muted transition-colors duration-150 hover:text-cream active:text-cream';

  return (
    <footer className="bg-night text-cream">
      {/* `pb-28` no celular reserva a faixa que a barra de ação fixa
          ocupa (ver MobileCTABar) — sem essa reserva ela cobriria os
          últimos links do rodapé. */}
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-14 sm:pb-14 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <BrandMark size={28} />
              <span className="text-[17px] font-bold tracking-[-0.02em] text-cream">
                Barrakinha
              </span>
            </div>
            <p className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-night-muted">
              O mapa da comida de rua do seu bairro.
            </p>
            <a
              href="mailto:contato@barrakinha.com"
              className="mt-5 inline-block rounded text-[15px] text-cream underline decoration-night-line underline-offset-[5px] transition-colors duration-150 hover:decoration-cream"
            >
              contato@barrakinha.com
            </a>
          </div>

          {sections.map((section) => (
            <nav key={section.title} className="md:col-span-3">
              <h3 className="text-label font-semibold text-cream">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a href={item.href} className={linkClass}>
                        {item.label}
                      </a>
                    ) : (
                      <button type="button" onClick={item.onClick} className={linkClass}>
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-5 border-t border-night-line pt-6 sm:flex-row sm:items-center">
          <p className="text-[14px] text-night-muted">
            © {new Date().getFullYear()} Barrakinha
          </p>

          <ul className="flex items-center gap-6">
            {socials.map((social) => (
              <li key={social.label}>
                {social.href ? (
                  <a
                    href={social.href}
                    target="_blank"
                    /* `me` diz que o perfil do outro lado é a MESMA
                       entidade que publica este site. */
                    rel="me noopener noreferrer"
                    className="rounded text-[14px] text-night-muted transition-colors duration-150 hover:text-cream"
                  >
                    {social.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => soon(`O nosso ${social.label}`)}
                    className="rounded text-[14px] text-night-muted/70 transition-colors duration-150 hover:text-cream"
                  >
                    {social.label} (em breve)
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
