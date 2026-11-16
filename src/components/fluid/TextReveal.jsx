import React, { useEffect, useRef, useState } from 'react';
import { springCss, springs } from '@usefluid/motion';
import { useInView } from '@usefluid/motion/react';
import styles from './TextReveal.module.css';

/*
  Text Reveal da Fluid (registry/text-reveal, MIT): o título chega
  letra por letra, cada uma numa mola com quique.

  Mudanças em relação ao original, por causa do pré-render e do SEO:
  - O HTML do servidor sai com as letras visíveis. Só depois de montar,
    e enquanto o título ainda não entrou na tela, elas se escondem;
    quando ele entra, sobem. Nada de opacity 0 no HTML estático.
  - As letras vêm de `::before { content: attr(data-c) }`. O texto que
    o buscador e o leitor de tela leem é a frase inteira, uma vez só.

  `as` escolhe a tag; o resto das props vai pra ela.
*/
const spring = springCss(springs.bouncy);

const TextReveal = ({ as: Tag = 'h2', text, stagger = 22, className, ...props }) => {
  const ref = useRef(null);
  const inView = useInView(ref, 0.5);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const state = !mounted ? undefined : inView ? 'true' : 'false';
  let index = 0;
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={className} {...props}>
      <span
        className={styles.root}
        data-play={state}
        style={{ '--easing': spring.easing, '--duration': `${spring.duration}ms` }}
      >
        <span className={styles.srOnly}>{text}</span>
        <span aria-hidden="true">
          {words.map((word, w) => (
            <React.Fragment key={w}>
              <span className={styles.word}>
                {Array.from(word).map((char, c) => (
                  <span
                    key={c}
                    className={styles.char}
                    data-c={char}
                    style={{ transitionDelay: state === 'true' ? `${index++ * stagger}ms` : '0ms' }}
                  />
                ))}
              </span>
              {w < words.length - 1 ? ' ' : null}
            </React.Fragment>
          ))}
        </span>
      </span>
    </Tag>
  );
};

export default TextReveal;
