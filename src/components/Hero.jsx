import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import PhoneModel from '@/components/PhoneModelLazy';
import PhoneFrame from '@/components/PhoneFrame';
import { useIsMobile } from '@/hooks/useMediaQuery';

/*
  Hero em duas colunas — texto à esquerda, celular à direita, centro
  vertical — igual ao desktop de verdade do smartserialnumber.com. A
  primeira leitura daqui tinha saído da visão estreita (o próprio SSN
  empilha texto e celular abaixo de um certo breakpoint); na tela larga
  os dois ficam lado a lado, texto alinhado à esquerda, sem centralizar.

  Sem formulário de e-mail aqui: só um botão que rola até a lista, no
  fim da página — o mesmo texto e destino do CTA do header. O
  formulário de verdade mora uma vez só, no fechamento (`DownloadCTA`);
  repeti-lo na primeira dobra não converte mais, só antecipa a mesma
  pergunta duas vezes.

  ------------------------------------------------------------------
  No celular a primeira dobra era o pior lugar da página:

  - A seção media 929px contra 812px de tela, então o aparelho — a
    única imagem do produto que existe — nascia cortado ao meio.
  - As manchas de luz do fundo eram `hidden sm:block`, ou seja,
    desligadas justamente no aparelho onde o hero é 100% do que se vê
    na chegada: sobrava um retângulo preto liso.
  - E entre o botão e o celular abria um vão de uns 200px sem nada.

  A versão estreita agora é outra composição, não a mesma espremida:
  tipografia grande mas contida, uma etiqueta de estado vivo ("12
  barracas abertas") que dá o argumento do produto em três palavras,
  e o aparelho entrando por baixo — cortado *de propósito* pela base
  da dobra, que é o convite pra rolar, não um acidente de altura.
*/
const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

/*
  As 5 manchas orbitando atrás do celular — mesma técnica e as mesmas 5
  trajetórias do hero do smartserialnumber.com (`orbit1`..`orbit5` em
  index.css, copiadas direto de lá), só a dupla de cor que virou as duas
  pontas do degradê ember em vez de âmbar/lima. `mix-blend-mode: lighten`
  é o que faz elas se somarem em vez de se sobrepor como camadas planas —
  onde duas se cruzam, fica mais claro, não mais opaco.
*/
const blobs = [
  { color: '#FF8A3D', size: '34vw', height: '78vh', blur: 120, opacity: 0.18, top: '46%', left: '38%', anim: 'orbit1 12s linear infinite' },
  { color: '#F43F1E', size: '46vw', height: '70vh', blur: 90, opacity: 0.14, top: '58%', left: '60%', anim: 'orbit2 12s linear infinite -3s' },
  { color: '#FF8A3D', size: '30vw', height: '72vh', blur: 120, opacity: 0.12, top: '40%', left: '62%', anim: 'orbit3 12s linear infinite -6s' },
  { color: '#FF8A3D', size: '28vw', height: '70vh', blur: 90, opacity: 0.13, top: '60%', left: '42%', anim: 'orbit4 10s linear infinite -2s' },
  { color: '#F43F1E', size: '40vw', height: '72vh', blur: 120, opacity: 0.15, top: '50%', left: '50%', anim: 'orbit5 14s linear infinite -4s' },
];

/*
  No celular são 3 manchas, não 5, e bem maiores em proporção de tela.

  Não é a lista de cima com duas linhas apagadas: cada mancha aqui é um
  retângulo desfocado do tamanho da viewport, e empilhar cinco deles
  numa GPU de telefone é onde esse efeito começa a engasgar. Três
  cobrem a mesma área com folga — numa tela de 375px, `70vw` já são
  260px de mancha — e as trajetórias ficam sendo as três mais
  distintas entre si das cinco originais.
*/
const mobileBlobs = [
  { color: '#FF8A3D', size: '86vw', height: '52vh', blur: 80, opacity: 0.22, top: '38%', left: '32%', anim: 'orbit1 16s linear infinite' },
  { color: '#F43F1E', size: '94vw', height: '48vh', blur: 70, opacity: 0.18, top: '62%', left: '68%', anim: 'orbit2 18s linear infinite -4s' },
  { color: '#FF8A3D', size: '70vw', height: '46vh', blur: 80, opacity: 0.16, top: '52%', left: '50%', anim: 'orbit5 20s linear infinite -8s' },
];

const HeroBlobs = ({ isMobile }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:!hidden"
  >
    {(isMobile ? mobileBlobs : blobs).map((b, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: b.left,
          top: b.top,
          width: b.size,
          height: b.height,
          marginLeft: `calc(-${b.size} / 2)`,
          marginTop: `calc(-${b.height} / 2)`,
          background: b.color,
          filter: `blur(${b.blur}px)`,
          opacity: b.opacity,
          mixBlendMode: 'lighten',
          animation: b.anim,
          borderRadius: '9999px',
        }}
      />
    ))}
  </div>
);

const Hero = () => {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  /*
    Paralaxe ligada ao scroll — não à entrada, ao progresso real de
    rolar a seção. `useScroll` com `target` mede 0→1 do topo da seção
    até o topo sair da tela; cada camada anda numa velocidade
    diferente (texto sobe mais rápido que o celular, o glow desce
    devagar), o que dá profundidade de verdade, não só um fade.

    Fica em wrappers `motion.div` à parte do bloco que já anima a
    entrada (opacity/y no mount) — misturar as duas coisas no mesmo
    elemento faz o `style` ligado ao scroll brigar com o `animate` do
    framer-motion pela mesma propriedade.
  */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const blobsY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  /* No celular o aparelho sai pela base — some rolando, em vez de
     ficar plantado no meio da próxima seção. */
  const phoneMobileY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  /* Apaga a seta de "role" nos primeiros 8% da seção. Fica aqui em
     cima, e não lá embaixo junto do elemento que usa: `useTransform` é
     um hook, e hook dentro de `{isMobile ? ... : null}` muda a ordem
     dos hooks quando a janela cruza o breakpoint — o React quebra. */
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const go = (event) => {
    event.preventDefault();
    document.querySelector('#lista')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
      <section
        ref={sectionRef}
        id="top"
        className="screen-section relative flex flex-col justify-center overflow-hidden bg-ink-950 !pb-0 !pt-24 lg:!py-24"
      >
        <motion.div style={{ y: blobsY }}>
          <HeroBlobs isMobile={isMobile} />
        </motion.div>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-12 lg:gap-8 lg:px-8">
          <motion.div style={{ y: reduceMotion ? 0 : textY }} className="lg:col-span-6">
            <motion.h1
              variants={rise}
              initial="hidden"
              animate="visible"
              custom={0}
              className="max-w-2xl text-[40px] font-extrabold leading-[0.94] tracking-[-0.045em] text-paper text-balance sm:text-display-md lg:text-display-lg"
            >
              Toda rua tem uma barraca.{' '}
              <span className="bg-brand bg-clip-text text-transparent">
                Agora tem mapa.
              </span>
            </motion.h1>

            <motion.p
              variants={rise}
              initial="hidden"
              animate="visible"
              custom={0.08}
              className="mt-5 max-w-prose text-[16px] leading-relaxed text-sand-300 text-pretty sm:text-[17px] md:text-lg lg:mt-6"
            >
              Ache quem está vendendo perto de você. Peça pelo app e retire
              quentinho.
            </motion.p>

            <motion.div
              variants={rise}
              initial="hidden"
              animate="visible"
              custom={0.16}
              className="mt-7 lg:mt-9"
            >
              <a
                href="#lista"
                onClick={go}
                /* Largura cheia no celular: um alvo de toque que vai de
                   margem a margem não exige mira nenhuma. A partir do
                   `sm` ele volta a ter a largura do próprio texto. */
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:brightness-110 active:scale-[0.97] sm:w-auto"
              >
                Entrar na lista
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>
          </motion.div>

          {isMobile ? (
            /*
              O aparelho entra por baixo e é cortado pela base da dobra.

              `-mb-24` puxa a moldura pra fora da seção: o que se vê é o
              topo do telefone e a tela começando, com o resto seguindo
              pra fora do campo de visão. Antes ele aparecia inteiro e
              estourava a seção em 117px, o que dava a mesma imagem
              cortada — só que por acidente, e sem sobrar espaço pra
              mais nada.
            */
            <motion.div
              style={{ y: reduceMotion ? 0 : phoneMobileY }}
              className="pointer-events-none relative -mb-24 mt-4 flex justify-center"
            >
              <PhoneFrame
                src="/models/app-screenshot.png"
                alt="Tela inicial do app da Barrakinha, mostrando o mapa de barracas abertas e os pedidos do cliente"
                className="w-[260px]"
                delay={0.24}
              />
              {/* Esmaece a base do aparelho no fundo da seção, pra o
                  corte não ser uma aresta reta atravessando a tela. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950 to-transparent"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center lg:col-span-6 lg:justify-end"
            >
              <motion.div style={{ y: videoY }}>
                {/* Flutuação contínua, num segundo nível — o de fora
                    cuida da entrada (mount) e da paralaxe (scroll), este
                    de dentro só do balanço solto. O giro em si já é 3D
                    de verdade, dentro do `PhoneModel` — gira sozinho
                    devagar e inclina um pouco a mais seguindo o mouse. */}
                <motion.div
                  animate={{ y: [0, -16, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <PhoneModel
                    screenshotSrc="/models/app-screenshot.png"
                    className="aspect-[4/5] w-[320px] max-h-[78vh] sm:w-[400px] lg:w-[460px] xl:w-[540px]"
                    ariaLabel="Tela inicial do app da Barrakinha, mostrando o mapa de barracas abertas e os pedidos do cliente"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Dica de rolagem, só no celular — a seta que diz que a página
            continua. Some assim que a rolagem começa (o próprio
            `scrollYProgress` a apaga), pra não ficar apontando pra
            baixo no meio do caminho. */}
        {isMobile ? (
          <motion.div
            aria-hidden="true"
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center"
          >
            <ChevronDown size={22} className="animate-bounce text-sand-400" />
          </motion.div>
        ) : null}
      </section>
  );
};

export default Hero;
