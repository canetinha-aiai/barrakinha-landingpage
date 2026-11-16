import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@usefluid/motion/react';
import styles from './WordCycle.module.css';

/*
  Word Cycle da Fluid (registry/word-cycle, MIT), copiado e adaptado.

  A palavra troca saindo de um desfoque, e a frase nunca muda de
  largura: todas as palavras ficam empilhadas invisíveis na mesma
  célula e a maior define o espaço.

  Mudanças em relação ao original:
  - As palavras visíveis vêm de `::before { content: attr(data-word) }`
    e não de texto no DOM. Assim o h1 que o buscador lê no HTML
    pré-renderizado é só a frase final ("…do seu bairro."), e não
    "bairro. trabalho. caminho." repetido.
  - `delay` segura a primeira troca até o título terminar de subir.
  - Chaves por posição; a primeira palavra é a "oficial" (leitor de
    tela, menos movimento e HTML do servidor).

  Com menos movimento, fica parado na primeira palavra (é também a
  que o HTML pré-renderizado e o leitor de tela recebem).
*/
export function WordCycle({ words, every = 1.6, delay = 0, loop = true, play = true }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const [started, setStarted] = useState(delay === 0);
  const last = words.length - 1;
  const finished = !loop && index >= last;

  useEffect(() => {
    if (started || !play || reduced) return undefined;
    const timer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [started, play, reduced, delay]);

  useEffect(() => {
    if (!started || !play || reduced || finished || words.length < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => {
        if (!loop && i >= last) return i;
        setLeaving(i);
        return i + 1 <= last ? i + 1 : 0;
      });
    }, every * 1000);
    return () => clearInterval(timer);
  }, [started, play, reduced, finished, every, loop, last, words.length]);

  const current = reduced ? 0 : index;
  const out = reduced ? null : leaving;

  return (
    <span className={styles.root}>
      <span className={styles.srOnly}>{words[0]}</span>
      <span className={styles.stack} aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className={`${styles.word} ${styles.sizer}`} data-word={word} />
        ))}
        <span
          key={`in-${current}`}
          className={`${styles.word} ${out === null ? styles.still : styles.in}`}
          data-word={words[current]}
          onAnimationEnd={() => setLeaving(null)}
        />
        {out !== null && (
          <span key={`out-${out}`} className={`${styles.word} ${styles.out}`} data-word={words[out]} />
        )}
      </span>
    </span>
  );
}

export default WordCycle;
