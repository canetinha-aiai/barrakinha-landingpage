import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/*
  Barra de ação fixa na base — só no celular.

  A página tem um convite só, o formulário do fecho, e no celular ele
  mora longe do topo: quem se convence no meio do caminho precisa ter o
  que tocar. No desktop o botão do header cumpre esse papel.

  Regras de aparição, nas duas pontas:

  1. Só entra depois que o hero sai — antes disso o botão do hero já
     está na tela.
  2. Some quando o formulário de verdade entra na tela.

  As duas decisões saem de `IntersectionObserver`, não de contas com
  `scrollY`: o navegador responde "esse elemento está visível?" sem
  acordar o JavaScript a cada quadro de rolagem.

  Entra e sai pelo mesmo caminho — de baixo, pela própria altura
  (`100%`) —, com mola sem quique: é interrompível, então se a pessoa
  rola pra cima e pra baixo rápido a barra inverte de onde está em vez
  de terminar a animação antiga primeiro.

  Era uma cápsula flutuante com sombra, degradê por cima e botão em
  degradê. Agora é uma faixa de papel com filete em cima, encostada na
  base — o mesmo material do header.
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
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
          className="glass pb-safe fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-paper/90 px-5 pt-3 backdrop-blur-md md:hidden"
        >
          <span className="min-w-0 text-[14px] leading-tight text-ink-muted">
            Lançamento no Android
          </span>
          <a href="#lista" onClick={go} className="btn-primary h-11 shrink-0 text-[15px]">
            Entrar na lista
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileCTABar;
