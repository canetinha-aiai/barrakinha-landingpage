import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Indicador de "tem mais pra rolar" — mouse com a bolinha descendo.
 *
 * Cada seção da página ocupa o dispositivo inteiro (`screen-section`),
 * o que é ótimo pra imersão mas esconde que existe conteúdo abaixo: sem
 * nada na borda de baixo, a primeira dobra parece a página inteira. O
 * ícone clássico de mouse resolve isso sem precisar de texto.
 *
 * O padrão de mercado (Apple, e a maioria dos sites de uma página só):
 * o ícone vive na dobra e some assim que a rolagem de verdade começa —
 * ele não acompanha o usuário. A primeira versão daqui usava `sticky`
 * sem esse desligamento, e o resultado era um ícone "perseguindo" a
 * rolagem por baixo da lista inteira de afirmações — o comportamento
 * estranho que motivou esta reescrita.
 *
 * A correção precisa das duas peças, não só uma: onde o ícone fica, e
 * quando ele aparece.
 *
 * Onde: `position: fixed`, não `sticky`. Sticky tentado antes, mas ele
 * só "gruda" na borda quando o fluxo normal do conteúdo *passaria* do
 * limite rolando — no hero, com título+texto+formulário centralizados
 * (`justify-center`) numa seção do tamanho exato da tela, o ícone
 * nunca chegava perto desse limite: a posição natural dele era logo
 * abaixo do formulário, no meio da tela, bem mais alto do que a borda
 * de baixo de verdade. `fixed` ignora o fluxo — fica sempre a 24px do
 * fundo da janela, sem depender de onde o conteúdo centraliza nem da
 * altura da seção.
 *
 * Quando: um observador que apaga o ícone assim que a seção deixa de
 * estar "recém-chegada" no topo da tela — ou seja, assim que o usuário
 * já rolou pra dentro dela. Sem isso, `fixed` sozinho deixaria o ícone
 * grudado na tela o tempo todo, aparecendo por cima de toda seção
 * seguinte também.
 *
 * Só vive no hero. Chegou a aparecer em toda `screen-section` da
 * página — decisão revertida: nas seções seguintes o próprio ato de já
 * ter rolado até ali é o aviso de que dá pra rolar mais, o ícone virava
 * redundância. Sem variação de cor por seção, ele é sempre branco — é a
 * única superfície onde mora, e ela é sempre o laranja da marca.
 */
const ScrollCue = ({ className }) => {
  const iconRef = useRef(null);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const section = iconRef.current?.closest('section');
    if (!section) return undefined;

    // Tolerância de 32px: a seção não precisa estar num pixel exato do
    // topo pra contar como "recém-chegada" — só não pode já ter
    // rolagem de verdade pra dentro dela.
    const TOLERANCE = 32;
    let frame = null;

    const check = () => {
      frame = null;
      setAtTop(section.getBoundingClientRect().top > -TOLERANCE);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={iconRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-6 z-10 flex justify-center transition-opacity duration-300 sm:bottom-8',
        atTop ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      <svg width="22" height="34" viewBox="0 0 22 34" fill="none">
        <rect
          x="1"
          y="1"
          width="20"
          height="32"
          rx="10"
          strokeWidth="1.5"
          className="stroke-white/70"
        />
        {/* A animação da bolinha roda sempre, independente de `atTop` —
            ela fica escondida atrás do `opacity-0` do wrapper quando a
            seção não está mais no topo, e não custa nada continuar
            rodando por trás; tentar pausá-la via `animate={{}}` do
            framer-motion é ambíguo (não limpa o ciclo anterior) e não
            economiza nada que valha a complicação. */}
        <motion.circle
          cx="11"
          r="2.5"
          className="fill-white"
          initial={{ cy: 9, opacity: 1 }}
          animate={{ cy: 21, opacity: 0 }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeIn',
          }}
        />
      </svg>
    </div>
  );
};

export default ScrollCue;
