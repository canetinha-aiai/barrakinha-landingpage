import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
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
const PhoneFrame = ({
  src,
  alt,
  className,
  glow = true,
  delay = 0,
  bleed = false,
  beforeSrc,
}) => {
  const reduceMotion = useReducedMotion();
  const revealRef = useRef(null);

  /*
    A troca entre o estado de antes e o de depois anda com a ROLAGEM,
    não com um relógio.

    A primeira versão era uma revelação cronometrada: entrava na
    vista, esperava 0,9s e trocava sozinha. Funcionava, mas o momento
    da troca não tinha nada a ver com o leitor — quem rolasse rápido
    perdia, quem parasse via acontecer sem ter feito nada.

    Ligada ao scroll, a barraca abre porque a pessoa rolou. O gesto de
    descer a página vira o gesto de abrir a barraca, e a troca fica
    reversível: subir de volta fecha. É a diferença entre assistir e
    operar — sem nenhum controle na tela pra operar, que é o que não
    se queria aqui.

    `useSpring` amortece o valor cru do scroll, que anda em degraus a
    cada evento; sem ele a imagem pisca em vez de dissolver.
  */
  const { scrollYProgress } = useScroll({
    target: revealRef,
    offset: ['start 0.9', 'center 0.4'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  /* A troca acontece no miolo do percurso, não nas pontas: assim ela
     não começa com o aparelho meio fora da tela nem termina depois de
     ele já ter passado. */
  const beforeOpacity = useTransform(smooth, [0.45, 0.85], [1, 0]);

  return (
    <div ref={revealRef} className={cn('relative', className)}>
      {/* Halo atrás do aparelho — é o que descola o celular do fundo
          escuro. Sem ele a moldura preta some dentro da seção preta. */}
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -inset-y-8 rounded-[64px] bg-ember-600/20 blur-3xl"
        />
      ) : null}

      {/*
        `bleed`: o aparelho é cortado na base e dissolve.

        Nem toda tela do app enche um telefone. A do vendedor tem o
        cartão de abrir a barraca e um pedido recente no topo, e daí
        pra baixo é papel vazio — quase metade da altura. Mostrada
        inteira numa moldura 9:20, ela vira um retângulo creme sem
        nada dentro ocupando metade da seção.

        Cortar reto resolveria o vazio e criaria outro problema: uma
        aresta horizontal atravessando o aparelho, que lê como imagem
        quebrada. A máscara resolve os dois — a altura para onde o
        conteúdo para, e o que sobra da moldura desaparece num
        degradê em vez de num corte. O aparelho passa a ler como algo
        que continua fora do quadro, que é o mesmo recurso que o hero
        usa ao empurrar o telefone pra fora da primeira dobra.

        A máscara vai no contêiner de fora, não só na imagem: assim a
        lateral da moldura some junto com a tela, em vez de a borda
        continuar desenhada depois que o conteúdo já sumiu.
      */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className={cn('relative', bleed && 'overflow-hidden')}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{
          perspective: 800,
          ...(bleed
            ? {
                aspectRatio: '9 / 10',
                WebkitMaskImage:
                  'linear-gradient(to bottom, #000 76%, transparent 99%)',
                maskImage:
                  'linear-gradient(to bottom, #000 76%, transparent 99%)',
              }
            : null),
        }}
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
                `beforeSrc`: o estado anterior da MESMA tela, por
                cima, que se apaga conforme a página rola (ver o
                `useScroll` lá em cima).

                Não é um controle de liga/desliga nem um laço: quem
                comanda é o dedo do leitor. Descer abre a barraca,
                subir fecha de novo.

                Cruzamento simples (uma opacidade) funciona porque as
                duas capturas são a mesma tela: tudo está no mesmo
                lugar nos dois arquivos, e só o cartão do topo muda de
                cor e de texto. Então o olho não lê "trocaram a
                imagem", lê "aquele cartão mudou" — que é exatamente o
                que acontece no aparelho do vendedor.

                Fica de fora de quem pediu menos movimento: sem
                animação, o estado de depois já é o que está embaixo,
                então basta não desenhar a camada de cima.
              */}
              {beforeSrc && !reduceMotion ? (
                <motion.img
                  src={beforeSrc}
                  alt=""
                  aria-hidden="true"
                  width={1080}
                  height={2400}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 block w-full"
                  style={{ opacity: beforeOpacity }}
                />
              ) : null}

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
