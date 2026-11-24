import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MorphLogo from '@/components/fluid/MorphLogo';
import { samePageTarget } from '@/lib/nav';

/* Rótulos que dizem o que tem do outro lado do link, não um guarda-chuva
   vago. "Pra você" não dizia pra quem; estes dizem. */
const links = [
  { label: 'Pra quem compra', href: '/#pra-quem-compra' },
  /* Quem vende tem a página dela: na home o cliente não precisa ler
     sobre mensalidade e cardápio de vendedor. */
  { label: 'Pra quem vende', href: '/vendedores' },
  /* Comparação com a concorrência: o rótulo não cita marca. */
  { label: 'Comparativo', href: '/barrakinha-x-ifood' },
];

/*
  Header laranja: o letreiro da barraca, chapado em #F85A35 (o `ember`
  dos tokens), fixo no topo. Opaco de propósito — sem vidro nem
  desfoque, ele lê igual sobre o papel do hero e sobre as faixas
  escuras quando a página rola por baixo.

  Selo, nome e links em branco, a pedido do Pedro. Branco sobre o
  #F85A35 dá 3,2:1: passa pra texto grande e negrito, mas fica abaixo
  dos 4,5:1 recomendados pros links de 14px — se pesar na leitura, a
  volta é tinta escura (#1D1611, 5,5:1). O botão é noite com texto
  creme (16,8:1). O anel de foco também vira branco (`.header-ember`,
  em index.css): o anel laranja padrão sumiria aqui.

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

  /* Destino nesta página: rola (depois de fechar o menu, se aberto).
     Destino na outra página: deixa o navegador trocar de página. */
  const go = (event, href) => {
    const target = samePageTarget(href);
    if (!target) {
      setOpen(false);
      return;
    }
    event.preventDefault();

    if (open) {
      setOpen(false);
      setPending(target);
      return;
    }

    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="header-ember fixed inset-x-0 top-0 z-50 bg-ember text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <a
            href="/#top"
            onClick={(event) => go(event, '/#top')}
            className="flex items-center gap-2.5 rounded"
          >
            {/* O selo usa a cor do texto do header (`text-white`), igual ao
                nome do lado: branco sobre o laranja. */}
            <MorphLogo size={36} hover className="shrink-0 text-white" />
            <span className="text-[17px] font-bold tracking-[-0.02em] text-white">
              Barrakinha
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => go(event, link.href)}
                className="rounded text-[14px] font-medium text-white underline-offset-4 decoration-2 hover:underline"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#lista"
              onClick={(event) => go(event, '#lista')}
              className="btn-night h-10 text-[14px]"
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
                  className="absolute left-0 block h-[2px] w-full bg-white"
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
