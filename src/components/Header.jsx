import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BrandMark from '@/components/BrandMark';

/* Rótulos que dizem o que tem do outro lado do link, não um guarda-chuva
   vago. "Pra você" não dizia pra quem; estes dizem. */
const links = [
  { label: 'Pra quem compra', href: '#pra-quem-compra' },
  { label: 'Pra quem vende', href: '#pra-quem-vende' },
];

/*
  Header de vidro: papel translúcido com desfoque e um filete embaixo,
  com a página rolando por baixo. É a única superfície translúcida do
  site — tudo o mais é papel chapado. Com `prefers-reduced-transparency`
  ele vira papel sólido (`.glass`, em index.css).

  O menu do celular entra e sai pelo mesmo caminho, num fade de 200ms.
  Sem cascata por item: são dois links, e esperar por eles não informa
  nada.
*/
const Header = () => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null);

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

    Com o body em `overflow: hidden` o navegador ignora o
    `scrollIntoView`. O destino fica guardado e a rolagem acontece
    depois que a limpeza do travamento devolveu o scroll ao body.
  */
  useEffect(() => {
    if (!pending || open) return undefined;

    const frame = requestAnimationFrame(() => {
      document.querySelector(pending)?.scrollIntoView({ behavior: 'smooth' });
      setPending(null);
    });

    return () => cancelAnimationFrame(frame);
  }, [pending, open]);

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
    <>
      <header className="glass fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <a
            href="#top"
            onClick={(event) => go(event, '#top')}
            className="flex items-center gap-2.5 rounded"
          >
            <BrandMark size={32} />
            <span className="text-[17px] font-bold tracking-[-0.02em] text-ink">
              Barrakinha
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => go(event, link.href)}
                className="rounded text-[14px] text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#lista"
              onClick={(event) => go(event, '#lista')}
              className="btn-primary h-10 text-[14px]"
            >
              Entrar na lista
            </a>
          </nav>

          {/* As duas barras viram X girando em torno do próprio centro —
              um ícone só, em movimento, em vez de trocar de ícone. É
              uma transição de estado, então é mola sem quique: o
              toque não carregou impulso nenhum. */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded md:hidden"
          >
            <span className="relative block h-5 w-[22px]">
              {[0, 1].map((index) => (
                <motion.span
                  key={index}
                  aria-hidden="true"
                  className="absolute left-0 block h-[1.5px] w-full bg-ink"
                  style={{ top: 'calc(50% - 0.75px)' }}
                  initial={false}
                  animate={
                    open
                      ? { rotate: index === 0 ? 45 : -45, y: 0 }
                      : { rotate: 0, y: index === 0 ? -4 : 4 }
                  }
                  transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                />
              ))}
            </span>
          </button>
        </div>
      </header>

      {/*
        Fora do `<header>` de propósito: `backdrop-filter` cria um novo
        bloco de contenção pra descendentes `fixed`, e o menu colapsaria
        pra caber nos 64px do header em vez de ir até o fim da tela.
      */}
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-paper px-5 pb-8 pt-4 md:hidden"
          >
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.href} className="list-none border-b border-line">
                  <a
                    href={link.href}
                    onClick={(event) => go(event, link.href)}
                    className="block rounded py-5 text-[24px] font-bold tracking-[-0.025em] text-ink active:text-ink-muted"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#lista"
              onClick={(event) => go(event, '#lista')}
              className="btn-primary mt-auto h-14 w-full text-base"
            >
              Entrar na lista de espera
            </a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Header;
