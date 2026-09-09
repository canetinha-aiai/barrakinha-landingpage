import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/*
  Barra de ação fixa na base — só no celular.

  A página tem um convite só, o formulário do fecho, e no celular ele
  mora a mais de 6.000px do topo: quem se convence no meio do caminho
  não tem o que tocar. No desktop isso não pesa (o botão do header
  fica visível o tempo todo, e a página inteira é bem mais curta em
  telas largas); no celular o header só tem o hambúrguer, então não
  sobra nenhuma ação à mão.

  Regras de aparição, nas duas pontas:

  1. Só entra depois que o hero sai — antes disso o botão grande do
     hero já está na tela, e repetir o mesmo destino a 80px dele é
     ruído, não ajuda.
  2. Some quando o formulário de verdade entra na tela. Uma barra
     dizendo "entrar na lista" flutuando por cima do campo de entrar
     na lista é a própria definição de atrapalhar.

  As duas decisões saem de `IntersectionObserver`, não de contas com
  `scrollY`: o navegador já sabe responder "esse elemento está
  visível?" sem acordar o JavaScript a cada quadro de rolagem.
*/
const MobileCTABar = () => {
  const [pastHero, setPastHero] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('#top');
    const form = document.querySelector('#lista');
    if (!hero || !form) return undefined;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      // Um pedacinho do hero ainda visível já conta como "no hero":
      // a barra só aparece quando ele saiu de vez.
      { threshold: 0, rootMargin: '-20% 0px 0px 0px' },
    );
    heroObserver.observe(hero);

    const formObserver = new IntersectionObserver(
      ([entry]) => setAtForm(entry.isIntersecting),
      { threshold: 0.25 },
    );
    formObserver.observe(form);

    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !atForm;

  const go = (event) => {
    event.preventDefault();
    document.querySelector('#lista')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pb-safe fixed inset-x-0 bottom-0 z-40 px-4 pt-3 md:hidden"
        >
          {/* Degradê acima da barra: sem ele o conteúdo da página
              encosta na cápsula e some por baixo dela num corte reto. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 -top-10 bg-gradient-to-t from-ink-950 via-ink-950/90 to-transparent"
          />

          <a
            href="#lista"
            onClick={go}
            className="relative flex items-center justify-between gap-3 rounded-full border border-white/10 bg-ink-900/90 py-2 pl-5 pr-2 shadow-float backdrop-blur-xl transition-transform duration-200 active:scale-[0.98]"
          >
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-tight text-paper">
                Chega primeiro no Android
              </span>
              <span className="block truncate text-[11px] leading-tight text-sand-400">
                Comprar ou vender — é a mesma lista
              </span>
            </span>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-[13px] font-semibold text-white shadow-glow">
              Entrar
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileCTABar;
