import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
  O gráfico do bloco "pra quem vende".

  O que morava aqui era um pino andando por uma linha pontilhada em
  ziguezague sobre uma malha de pontinhos. O desenho não dizia nada:
  malha de pontos não é mapa (é textura de fundo, e a mesma que a
  seção "como funciona" já usa), linha quebrada entre três marcas não
  é rua, e o pino passeando sozinho ilustrava um vendedor que muda de
  esquina o dia inteiro — que não é a promessa. Era um gráfico
  abstrato genérico: trocando a cor, serviria pra qualquer produto.

  O que está aqui agora é a promessa em si, que é a primeira frase da
  lista ao lado: "você aparece no mapa só enquanto está vendendo".

  O desenho é essa frase e nada além dela. A barraca entra no mapa: o
  pino cai, o sinal se espalha, os vizinhos ali perto acendem em
  volta. A barraca sai: o pino vai embora, os vizinhos apagam, o mapa
  esfria. O ciclo roda sozinho porque é a COMPARAÇÃO entre os dois
  estados que carrega o sentido — ver só o mapa aceso não diz que ele
  depende de a barraca estar aberta.

  Nada de moldura de aplicativo em volta: nem chave de liga/desliga,
  nem nome de barraca, nem contador de pedidos e faturamento. Tudo
  isso era interface inventada pro site — a Barrakinha ainda não
  lançou, então nome de vendedor e número de pedidos seriam dado
  fabricado apresentado como se fosse tela de produto. O mapa sozinho
  diz a mesma coisa sem afirmar nada que não existe.

  As ruas são geometria de verdade — quarteirões e vias com largura,
  uma praça, uma avenida cruzando na diagonal — e não pontinhos. É o
  registro que dá pra desenhar com precisão: retângulo é matemática.
*/

/* Quarteirões: x, y, largura, altura em coordenadas do viewBox 100×100.
   Os vãos entre eles são as ruas — não há "rua" desenhada, há espaço
   entre blocos, que é como uma planta de cidade funciona de verdade. */
const BLOCKS = [
  { x: 0, y: 0, w: 27, h: 23 },
  { x: 32, y: 0, w: 31, h: 23 },
  { x: 68, y: 0, w: 32, h: 15 },
  { x: 68, y: 20, w: 32, h: 24 },

  { x: 0, y: 28, w: 27, h: 30 },
  { x: 32, y: 28, w: 31, h: 16 },

  { x: 0, y: 63, w: 18, h: 37 },
  { x: 23, y: 63, w: 22, h: 20 },
  { x: 23, y: 88, w: 22, h: 12 },
  { x: 50, y: 63, w: 24, h: 37 },
  { x: 79, y: 63, w: 21, h: 37 },
  { x: 79, y: 49, w: 21, h: 9 },
];

/* A praça: o único bloco que não é construção. Um mapa sem nenhum
   verde lê como diagrama; com um, lê como bairro. */
const PARK = { x: 32, y: 49, w: 31, h: 9 };

/*
  Quem está por perto — pontinhos que acendem em volta da barraca
  quando ela entra no mapa. Cada um com um atraso diferente: quem está
  ali perto não descobre todo mundo no mesmo instante.
*/
const NEARBY = [
  { x: 16, y: 40, delay: 0.5 },
  { x: 52, y: 34, delay: 0.75 },
  { x: 40, y: 72, delay: 1.0 },
  { x: 14, y: 74, delay: 1.25 },
  { x: 60, y: 55, delay: 1.5 },
  { x: 86, y: 36, delay: 1.75 },
];

/* Onde a barraca fica: na esquina, no vão entre quarteirões — ou
   seja, na rua, que é onde uma barraca fica. */
const STALL = { x: 29.5, y: 61 };

const OPEN_MS = 6200;
const CLOSED_MS = 2600;

const VendorMapCard = ({ className }) => {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(true);

  /*
    O ciclo entra e sai sozinho, com tempos diferentes pra cada
    estado: no mapa é o estado que interessa mostrar, fora dele é só o
    contraste que prova que o mapa depende da barraca estar vendendo —
    então dura menos da metade.

    `setTimeout` reagendado a cada troca, não um `setInterval`: os dois
    trechos têm durações diferentes, e intervalo só sabe repetir um
    número.
  */
  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = setTimeout(() => setOpen((v) => !v), open ? OPEN_MS : CLOSED_MS);
    return () => clearTimeout(id);
  }, [open, reduceMotion]);

  return (
    <div
      className={cn(
        'relative aspect-[4/5] w-[280px] overflow-hidden rounded-[28px] border border-white/[0.09] shadow-float sm:w-[320px] lg:w-[360px]',
        className,
      )}
      role="img"
      aria-label="Mapa de um bairro: a barraca entra no mapa e quem está por perto passa a vê-la; quando ela para de vender, sai do mapa."
    >
      {/*
        O mapa perde a cor quando a barraca sai dele. Não some — some
        seria "o mapa acabou"; apagar é "o mapa continua lá, você é que
        saiu dele", que é o que de fato acontece.
      */}
      <motion.div
        className="absolute inset-0"
        animate={{
          filter: open ? 'saturate(1)' : 'saturate(0.25)',
          opacity: open ? 1 : 0.5,
        }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
          aria-hidden="true"
        >
          {/*
            Rua clara sobre quarteirão escuro, não o contrário.

            A primeira tentativa pintou o asfalto de ink-950 e os
            quarteirões de ink-800 — dois tons vizinhos da mesma rampa,
            e o resultado foi um retângulo quase liso: não dava pra ver
            onde ficava a rua, que é justamente o que um mapa precisa
            mostrar. É também o oposto da convenção de todo mapa em
            modo escuro (Google, Apple, Mapbox), em que a via é a linha
            CLARA e o miolo do quarteirão é o fundo.

            Então o fundo desta camada é a malha viária, e cada
            quarteirão é um bloco escuro por cima. As ruas passam a ser
            o que sobra entre eles — que é como uma planta de cidade se
            desenha de verdade.
          */}
          <rect x="0" y="0" width="100" height="100" className="fill-ink-700" />

          {BLOCKS.map((b) => (
            <rect
              key={`${b.x}-${b.y}`}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="1.6"
              className="fill-ink-950"
            />
          ))}

          <rect
            x={PARK.x}
            y={PARK.y}
            width={PARK.w}
            height={PARK.h}
            rx="1.6"
            className="fill-signal-open/30"
          />

          {/* A avenida na diagonal — o traço que quebra a grade e
              impede o mapa de parecer papel quadriculado. Mais larga
              que as ruas comuns, porque avenida é isso. */}
          <path
            d="M -6 84 L 106 14"
            className="stroke-ink-700"
            strokeWidth="8"
            fill="none"
          />
          {/* A faixa central pontilhada. */}
          <path
            d="M -6 84 L 106 14"
            className="stroke-white/[0.13]"
            strokeWidth="0.45"
            strokeDasharray="3 3"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Quem está por perto: acendem em volta depois que a barraca
          entra no mapa, um a um. Cada um pisca devagar no próprio
          ritmo. */}
      <AnimatePresence>
        {open
          ? NEARBY.map((p) => (
              <motion.span
                key={`${p.x}-${p.y}`}
                className="absolute h-1.5 w-1.5 rounded-full bg-paper/70 ring-2 ring-paper/15"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0.55, 1],
                  scale: 1,
                  transition: {
                    delay: p.delay,
                    duration: 2.4,
                    times: [0, 0.2, 0.6, 1],
                    repeat: Infinity,
                    repeatDelay: 1.2,
                  },
                }}
                /*
                  A transição da saída vai DENTRO do `exit`, não numa
                  prop `transition` compartilhada.

                  Compartilhada, a saída herdava o `repeat: Infinity` e
                  o `delay` da entrada — e uma animação de saída que
                  repete pra sempre nunca termina, então o
                  `AnimatePresence` nunca desmontava o ponto. O
                  resultado era vizinhos continuarem acesos em volta de
                  uma barraca que já tinha saído do mapa, que é
                  exatamente o contrário do que este gráfico existe pra
                  mostrar.
                */
                exit={{
                  opacity: 0,
                  scale: 0,
                  transition: { duration: 0.3, delay: 0, repeat: 0 },
                }}
              />
            ))
          : null}
      </AnimatePresence>

      {/* A barraca. Cai de cima com mola quando entra e sobe de volta
          quando sai — o pino não aparece por fade, ele *chega*. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute z-10"
            style={{
              left: `${STALL.x}%`,
              top: `${STALL.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
            initial={{ y: -26, opacity: 0, scale: 0.7 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -18, opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              {/* O sinal se espalhando: dois anéis defasados, pra
                  pulsar como onda e não como piscada única. */}
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-ember-500/60"
                  animate={{ scale: [1, 5], opacity: [0.55, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: i * 1.2,
                  }}
                />
              ))}
              <MapPin
                size={30}
                aria-hidden="true"
                className="relative fill-ember-500 text-ink-950 drop-shadow-[0_4px_10px_rgba(244,63,30,0.55)]"
              />
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Vinheta: escurece as quatro bordas pra o mapa parecer um
          recorte de algo maior, e não uma planta que acaba onde o
          cartão acaba. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_0_40px_rgba(15,12,9,0.6)]"
      />
    </div>
  );
};

export default VendorMapCard;
