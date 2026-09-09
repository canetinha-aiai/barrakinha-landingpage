import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/*
  O celular do celular.

  No desktop quem mostra o app é o `PhoneModel`: um `.glb` de 1,5 MB
  dentro de um `<canvas>` WebGL, com ambiente de luz, textura
  remapeada e um quadro de animação rodando o tempo todo. É bonito e
  cabe lá.

  No telefone não cabe. A página montava DOIS desses contextos WebGL
  (o do hero e o de "pra quem compra") num aparelho que costuma dar
  conta de poucos, sobre uma rede que costuma ser de dados móveis, e
  cada um deles mantém um `requestAnimationFrame` vivo drenando
  bateria — tudo isso pra desenhar o que é, no fim, um retângulo com
  uma captura de tela dentro.

  Aqui o mesmo retângulo é feito de CSS: moldura, brilho da tela e a
  própria captura. Sai 1,5 MB de download e os dois contextos WebGL;
  entra uma `<img>` que o navegador já sabia carregar.

  O que se perde do 3D — a inclinação seguindo o ponteiro — não existe
  em tela de toque de qualquer forma. O que fica no lugar é o que se
  enxerga num aparelho pequeno: o reflexo varrendo o vidro, que é o
  gesto que faz uma tela parecer uma tela de verdade e não um
  recorte chapado.
*/
const PhoneFrame = ({ src, alt, className, glow = true, delay = 0 }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn('relative', className)}>
      {/* Halo atrás do aparelho — é o que descola o celular do fundo
          escuro. Sem ele a moldura preta some dentro da seção preta. */}
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -inset-y-8 rounded-[64px] bg-ember-600/20 blur-3xl"
        />
      ) : null}

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
        style={{ perspective: 800 }}
      >
        {/*
          Flutuação contínua, num wrapper à parte da entrada acima —
          duas animações na mesma propriedade (`y`) no mesmo elemento
          brigam, e quem perde é a que roda uma vez só.
        */}
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative rounded-[2.4rem] bg-gradient-to-b from-ink-700 via-ink-900 to-ink-950 p-[3px] shadow-float"
        >
          {/* Aro interno claro: a linha de luz que corre na quina de
              metal de qualquer aparelho, e o que dá espessura à
              moldura em vez de deixá-la uma borda chapada. */}
          <div className="rounded-[2.3rem] bg-ink-950 p-[5px] ring-1 ring-inset ring-white/[0.09]">
            <div className="relative overflow-hidden rounded-[1.95rem] bg-ink-900">
              <img
                src={src}
                alt={alt}
                width={1080}
                height={2400}
                loading="lazy"
                decoding="async"
                className="block w-full"
              />

              {/*
                Reflexo varrendo o vidro. É uma faixa clara inclinada
                atravessando a tela a cada 7s — bem espaçado de
                propósito: perto demais vira pisca-pisca, e o que se
                quer é a impressão de vidro pegando luz de vez em
                quando.
              */}
              {!reduceMotion ? (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 w-1/2"
                  style={{
                    background:
                      'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.16) 45%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.16) 55%, transparent 100%)',
                  }}
                  animate={{ left: ['-60%', '160%'] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    repeatDelay: 5.4,
                    ease: 'easeInOut',
                  }}
                />
              ) : null}

              {/* Sombra interna nas bordas: o vidro de um telefone
                  nunca encosta reto na moldura, escurece antes dela. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[1.95rem] shadow-[inset_0_0_18px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>

          {/* Ilha da câmera — o detalhe que faz o desenho ser lido como
              telefone à primeira vista, em vez de moldura genérica. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[10px] h-[18px] w-[74px] -translate-x-1/2 rounded-full bg-ink-950"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PhoneFrame;
