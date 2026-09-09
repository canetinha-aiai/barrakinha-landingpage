import React from 'react';
import { Instagram, Music2, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import BrandMark from '@/components/BrandMark';

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
        { label: 'Pra você', onClick: () => navigate('#pra-voce') },
        { label: 'Pra vendedor', onClick: () => navigate('#pra-vendedor') },
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
     existe continua avisando que ainda não está no ar. O link não é só
     cortesia com quem clica: é ele que associa o site ao perfil, e essa
     associação é o que faz um buscador entender "Barrakinha" como nome
     próprio em vez de erro de digitação de "barraquinha". O `sameAs` do
     JSON-LD em index.html declara a mesma coisa; os dois se apoiam. */
  const socials = [
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://www.instagram.com/barrakinha.app/',
    },
    { icon: Music2, label: 'TikTok' },
  ];

  return (
    // O `html` usa `scroll-snap-type: y mandatory` (igual ao SSN) — sem
    // um ponto de encaixe próprio, o rodapé nunca é um destino válido
    // pra parar, e a rolagem sempre voltava pro CTA final antes dele.
    // `scroll-snap-align: end` faz o fim da página (a base do rodapé)
    // virar um destino de encaixe também.
    <footer className="bg-ink-950 [scroll-snap-align:end]">
      {/* A mesma listra do hero e do CTA final, só que fina: o rodapé
          fecha a página com o mesmo gesto que abre e encerra as duas
          outras seções de cor cheia. */}
      <div className="awning-band" aria-hidden="true" />

      {/* `pb-28` no celular reserva a faixa que a barra de ação fixa
          ocupa (ver MobileCTABar) — ela pode voltar a aparecer aqui
          embaixo quando o formulário sai da tela, e sem essa reserva
          ela cobriria os últimos links do rodapé. */}
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-12 sm:pb-14 sm:pt-14 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandMark size={32} />
              <span className="font-display text-xl font-extrabold tracking-[-0.04em] text-paper">
                Barrakinha
              </span>
            </div>
            <p className="mt-3 max-w-[32ch] text-[14px] leading-relaxed text-sand-400">
              O mapa da comida de rua do seu bairro.
            </p>

            <a
              href="mailto:contato@barrakinha.com"
              className="mt-5 inline-flex items-center gap-2 text-[14px] text-sand-400 transition-colors hover:text-paper"
            >
              <Mail size={15} aria-hidden="true" />
              contato@barrakinha.com
            </a>
          </div>

          {sections.map((section) => (
            <nav key={section.title}>
              <h3 className="text-[13px] font-semibold text-paper">{section.title}</h3>
              <ul className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="-my-1 block py-1 text-left text-[14px] text-sand-400 transition-colors hover:text-paper active:text-paper"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className="-my-1 block py-1 text-left text-[14px] text-sand-400 transition-colors hover:text-paper active:text-paper"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-ink-800 pt-8 sm:flex-row sm:items-center">
          <p className="text-[13px] text-sand-400">
            © {new Date().getFullYear()} Barrakinha
          </p>

          <div className="flex items-center gap-1">
            {socials.map((social) =>
              social.href ? (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  /* `me` diz que o perfil do outro lado é a MESMA
                     entidade que publica este site — é a convenção que
                     buscadores leem pra ligar identidades. `noopener` e
                     `noreferrer` são higiene de link em aba nova. */
                  rel="me noopener noreferrer"
                  aria-label={`${social.label} da Barrakinha`}
                  className="flex h-10 w-10 items-center justify-center rounded-sm text-sand-400 transition-colors hover:bg-ink-900 hover:text-paper active:text-paper"
                >
                  <social.icon size={18} aria-hidden="true" />
                </a>
              ) : (
                <button
                  key={social.label}
                  type="button"
                  onClick={() => soon(`O nosso ${social.label}`)}
                  aria-label={`${social.label} — em breve`}
                  className="flex h-10 w-10 items-center justify-center rounded-sm text-sand-400 transition-colors hover:bg-ink-900 hover:text-paper"
                >
                  <social.icon size={18} aria-hidden="true" />
                </button>
              ),
            )}
          </div>
        </div>

        {/* Crédito do modelo 3D — a licença CC BY exige atribuição,
            não destaque. Menor que o copyright acima dele, de propósito. */}
        <p className="mt-6 text-[11px] leading-relaxed text-sand-500/70">
          Modelo 3D "Samsung Phone" por{' '}
          <a
            href="https://skfb.ly/pFTxN"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-sand-500/40 underline-offset-2 transition-colors hover:text-sand-400"
          >
            DAKSH_2009
          </a>
          , licenciado sob{' '}
          <a
            href="http://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-sand-500/40 underline-offset-2 transition-colors hover:text-sand-400"
          >
            CC BY 4.0
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
