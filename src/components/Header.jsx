import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import BrandMark from '@/components/BrandMark';

const links = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Pra você', href: '#pra-voce' },
  { label: 'Pra vendedor', href: '#pra-vendedor' },
];

const easeOutExpo = [0.16, 1, 0.3, 1];

/* O painel abre pela altura e os itens entram escalonados atrás dele. */
const panel = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.38, ease: easeOutExpo },
      opacity: { duration: 0.2 },
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { height: { duration: 0.28, ease: easeOutExpo }, opacity: { duration: 0.15 } },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOutExpo } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Menu aberto trava a rolagem do fundo e fecha no Esc — sem isso, o
     usuário rola a página atrás do painel e se perde. */
  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  /*
    Rolar só depois que o menu fechar.

    Enquanto o painel está aberto o body fica com `overflow: hidden`, e
    nesse estado o navegador simplesmente ignora o `scrollIntoView` — era
    por isso que os itens do menu não levavam a lugar nenhum. O destino
    fica guardado e a rolagem acontece no efeito abaixo, depois que a
    limpeza do travamento devolveu o scroll ao body.
  */
  useEffect(() => {
    if (!pending || open) return undefined;

    const frame = requestAnimationFrame(() => {
      document.querySelector(pending)?.scrollIntoView({ behavior: 'smooth' });
      setPending(null);
    });

    return () => cancelAnimationFrame(frame);
  }, [pending, open]);

  /*
    O header é transparente e o hero é laranja, então no topo da página
    ele flutua sobre a cor da marca — e ali tinta escura sobre laranja
    não se lê. Como o hero é a primeira seção, "não rolou" e "está sobre
    o hero" são a mesma condição, e uma variável resolve as duas.

    Com o menu aberto o painel traz o fundo de papel junto, então nesse
    caso vale a versão escura mesmo no topo.
  */
  const onHero = !scrolled && !open;

  const go = (event, href) => {
    event.preventDefault();

    if (open) {
      setOpen(false);
      setPending(href);
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open
          ? 'border-b border-paper-200 bg-paper/95 backdrop-blur-sm'
          : 'border-b border-transparent',
      )}
    >
      {/*
        Véu por baixo do texto branco, só sobre o hero.

        O header é fixo e sobrepõe o hero de fora — ele não é filho do
        gradiente, então não herda o `.brand-scrim` que escurece o
        conteúdo do hero por dentro. Sem véu próprio, "Como funciona" /
        "Pra você" / "Pra vendedor" (13px, branco) caíam a 2,5–3,1:1 de
        contraste contra o laranja claro do canto esquerdo — abaixo do
        4,5:1 que texto desse tamanho pede.

        41% do mesmo tom quente do `.brand-scrim` (não preto puro, pra
        não destoar) resolve o pior caso (canto esquerdo, perto do
        logo) e sobra folga no resto da faixa.
      */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-300',
          onHero ? 'opacity-100' : 'opacity-0',
        )}
        style={{ backgroundColor: 'rgba(90, 26, 8, 0.41)' }}
      />

      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        {/* O "B" do ícone do app ao lado do nome: o site e o produto
            assinam igual. */}
        <a
          href="#top"
          onClick={(event) => go(event, '#top')}
          className="flex items-center gap-2.5"
        >
          <BrandMark size={30} />
          <span
            className={cn(
              'font-display text-lg font-extrabold tracking-[-0.04em] transition-colors',
              onHero ? 'text-white' : 'text-ink-900',
            )}
          >
            Barrakinha
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => go(event, link.href)}
              className={cn(
                'text-[13px] transition-colors',
                onHero
                  ? 'text-white/85 hover:text-white'
                  : 'text-ink-600 hover:text-ink-900',
              )}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#lista"
            onClick={(event) => go(event, '#lista')}
            className={cn(
              'rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all',
              onHero
                ? 'bg-white text-ember-700 hover:bg-white/90'
                : 'bg-brand text-white shadow-glow hover:brightness-105',
            )}
          >
            Entrar na lista
          </a>
        </nav>

        {/* As duas barras viram X girando em torno do próprio centro —
            um ícone só, em movimento, em vez de trocar de ícone. */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="menu-mobile"
          className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="relative block h-5 w-[22px]">
            {[0, 1].map((index) => (
              <motion.span
                key={index}
                aria-hidden="true"
                className={cn(
                  'absolute left-0 block h-[1.5px] w-full rounded-full transition-colors',
                  onHero ? 'bg-white' : 'bg-ink-900',
                )}
                style={{ top: 'calc(50% - 0.75px)' }}
                initial={false}
                animate={
                  open
                    ? { rotate: index === 0 ? 45 : -45, y: 0 }
                    : { rotate: 0, y: index === 0 ? -4 : 4 }
                }
                transition={{ duration: 0.32, ease: easeOutExpo }}
              />
            ))}
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav
            id="menu-mobile"
            key="menu"
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden border-t border-paper-200 bg-paper md:hidden"
          >
            <div className="px-5 pb-6 pt-2">
              {links.map((link) => (
                <motion.a
                  key={link.href}
                  variants={item}
                  href={link.href}
                  onClick={(event) => go(event, link.href)}
                  className="group flex items-center justify-between border-b border-paper-200 py-4"
                >
                  <span className="font-display text-[22px] font-extrabold tracking-[-0.03em] text-ink-900">
                    {link.label}
                  </span>
                  <ArrowUpRight
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-sand-400 transition-transform duration-300 ease-out-expo group-active:translate-x-0.5 group-active:-translate-y-0.5"
                  />
                </motion.a>
              ))}

              <motion.a
                variants={item}
                href="#lista"
                onClick={(event) => go(event, '#lista')}
                className="mt-6 flex h-14 items-center justify-center rounded-full bg-brand text-base font-semibold text-white shadow-glow"
              >
                Entrar na lista
              </motion.a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Header;
