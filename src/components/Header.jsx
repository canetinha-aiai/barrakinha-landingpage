import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import BrandMark from '@/components/BrandMark';

const links = [
  { label: 'Pra você', href: '#pra-voce' },
  { label: 'Pra vendedor', href: '#pra-vendedor' },
];

const easeOutExpo = [0.16, 1, 0.3, 1];

/*
  Header em vidro fosco permanente — não um estado que só aparece ao
  rolar. Medido direto no smartserialnumber.com: a barra fixa já nasce
  com `bg-black/[0.11] backdrop-blur-[19px] border-b border-white/[0.05]`,
  igual em qualquer posição de scroll. A versão anterior daqui só ligava
  isso depois de 24px rolados; virou permanente porque é o que o site de
  referência faz — e porque simplifica: um header, uma aparência.

  Menu mobile também copiado de lá: não é mais um painel-sanfona que
  empurra a página, é um overlay de tela cheia (escuro, com o próprio
  desfoque) que entra com um único fade + leve queda de cima
  (`menu-in`, 0.2s ease-out, ver index.css) — sem stagger por item,
  porque não tem lá.
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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.05] bg-black/[0.11] backdrop-blur-[19px] transition-colors duration-300">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        {/* O "B" do ícone do app ao lado do nome: o site e o produto
            assinam igual. */}
        <a
          href="#top"
          onClick={(event) => go(event, '#top')}
          className="flex items-center gap-2.5"
        >
          <BrandMark size={40} />
          <span className="font-display text-lg font-extrabold tracking-[-0.04em] text-paper">
            Barrakinha
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => go(event, link.href)}
              className="text-[13px] tracking-wide text-sand-300 transition-colors duration-300 hover:text-ember-500"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#lista"
            onClick={(event) => go(event, '#lista')}
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
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
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-300 hover:bg-white/[0.03] md:hidden"
        >
          <span className="relative block h-5 w-[22px]">
            {[0, 1].map((index) => (
              <motion.span
                key={index}
                aria-hidden="true"
                className="absolute left-0 block h-[1.5px] w-full rounded-full bg-paper transition-colors"
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
      </header>

      {/*
        Fora do `<header>` de propósito: `backdrop-filter` (o vidro
        fosco do cabeçalho) cria um novo bloco de contenção pra
        descendentes `fixed` — como o `<header>` só tem 64px de altura,
        um menu `fixed` filho dele herdava esse contexto e colapsava
        pra caber ali dentro, em vez de esticar até o fim da tela. Como
        irmão do header, o menu volta a se posicionar contra a janela.
      */}
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-ink-950/95 p-6 backdrop-blur-md md:hidden"
          >
            {/*
              O menu ganhou o mesmo glow das seções — aberto, ele era
              um retângulo preto liso com três palavras, a única tela
              da página sem nenhuma cor da marca.
            */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-ember-600/[0.16] blur-[110px]"
            />

            <ul className="relative mb-10 mt-4 flex w-full flex-col items-stretch gap-1">
              {links.map((link, index) => (
                <li key={link.href} className="list-none">
                  {/*
                    Aqui SIM entra em cascata, um item depois do outro.

                    O menu de tela cheia foi copiado do
                    smartserialnumber.com, e lá o painel inteiro entra
                    num fade só — mas lá o menu é um detalhe de um site
                    de desktop. No celular ele é a navegação inteira, a
                    única tela cheia que a página abre a pedido do
                    usuário, e é o momento em que dá pra gastar 200ms
                    mostrando que os destinos são uma lista com ordem,
                    não um bloco de texto que apareceu.
                  */}
                  <motion.a
                    href={link.href}
                    onClick={(event) => go(event, link.href)}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.06 + index * 0.06,
                      ease: easeOutExpo,
                    }}
                    className="flex items-center justify-between rounded-2xl px-2 py-3.5 text-[24px] font-extrabold tracking-[-0.03em] text-sand-200 outline-none transition-colors duration-300 hover:text-ember-500 focus-visible:text-ember-500 focus-visible:ring-1 focus-visible:ring-ember-500 active:bg-white/[0.04]"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={20}
                      aria-hidden="true"
                      className="shrink-0 text-ember-500/60"
                    />
                  </motion.a>

                  {/* Régua entre os destinos: sem ela três frases
                      grandes empilhadas leem como um parágrafo. */}
                  {index < links.length - 1 ? (
                    <span aria-hidden="true" className="block h-px bg-white/[0.06]" />
                  ) : null}
                </li>
              ))}
            </ul>

            <motion.a
              href="#lista"
              onClick={(event) => go(event, '#lista')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24, ease: easeOutExpo }}
              className="relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 text-center text-base font-semibold text-white shadow-glow transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
            >
              Entrar na lista
              <ArrowUpRight size={18} aria-hidden="true" />
            </motion.a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Header;
