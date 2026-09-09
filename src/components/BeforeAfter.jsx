import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';

/*
  "O que muda com a Barrakinha" — o cartão de comparação do
  smartserialnumber.com, com mais camada de vida em cima da base
  estrutural (vidro translúcido + blur + hairline) que já existia:

  1. Dois glows de cor atrás dos cartões (vermelho fosco no "antes",
     ember no "depois") — sem eles o fundo inteiro era ink-950 parado,
     e a única cor vinha dos contornos finos das pílulas.
  2. O ícone de cada linha entra com um "estalo" de mola, separado do
     texto ao lado (que só desliza) — o pop marca a linha como um
     veredito (certo/errado), o texto só descreve.
  3. As duas colunas são pareadas por posição — "antes[i]" é o problema
     que "depois[i]" resolve. Passar o mouse numa linha destaca ela e a
     correspondente do outro lado ao mesmo tempo (`hoveredIndex`, no
     componente pai, compartilhado pelos dois cartões), deixando esse
     par explícito em vez de só sugerido pela ordem.

  (A inclinação 3D do cartão inteiro seguindo o mouse, que morou aqui,
  saiu — competia com o destaque das linhas por atenção.)

  ------------------------------------------------------------------
  E era exatamente o item 3 que não existia no celular: o pareamento
  vivia inteiro no `:hover`, e tela de toque não tem hover. Quem abria
  a página no telefone recebia dois cartões empilhados de 1.310px
  somados — mais de uma tela e meia — e tinha que segurar oito frases
  na cabeça pra comparar quatro pares que a página nunca mostrava
  juntos.

  A versão estreita troca a mecânica em vez de encolher a de cima: um
  par de cada vez, ocupando a tela inteira, com o "antes" e o "depois"
  do MESMO par um debaixo do outro. O que era um destaque simultâneo
  que dependia do mouse vira a própria estrutura da tela — e passar de
  um par pro outro é arrastar o dedo, que é o gesto que o aparelho já
  oferece.
*/
const before = {
  eyebrow: 'Antes',
  title: 'Do jeito de sempre',
  description: 'Ponto fixo e venda por sorte, sem visibilidade nenhuma.',
  items: [
    'Ponto fixo que nem todo mundo conhece',
    'Fila, troco e espera pra pedir',
    'Ninguém sabe se você abriu hoje',
    'Cliente decide na sorte, quando passa na rua',
  ],
};

const after = {
  eyebrow: 'Depois',
  title: 'Com a Barrakinha',
  description: 'Mapa em tempo real, pedido pronto pra retirar.',
  items: [
    'Apareça no mapa assim que abrir a barraca',
    'Cliente pede antes e retira pronto, sem fila',
    'Toda barraca aberta perto, sempre atualizada',
    'Cardápio e preço vistos antes de sair de casa',
  ],
};

/* O título curto de cada par — o assunto que o "antes" e o "depois"
   têm em comum. Só o celular usa: é ele que diz de que par se está
   falando agora, papel que no desktop a posição na coluna já cumpre. */
const pairLabels = [
  'Ser encontrado',
  'A hora do pedido',
  'Saber quem abriu',
  'Decidir o que comer',
];

const CompareCard = ({ data, kind, delay, hoveredIndex, onHoverIndex }) => {
  const isAfter = kind === 'after';

  return (
    <motion.div
      initial={{ opacity: 0, x: isAfter ? 48 : -48, rotate: isAfter ? 3 : -3 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-1 rounded-2xl border border-white/[0.06] p-6 backdrop-blur-sm sm:p-8"
      style={{
        background:
          'linear-gradient(82deg, rgba(42,33,26,0.65) 0%, rgba(29,22,17,0.6) 100%)',
      }}
    >
      <div className="flex flex-col gap-2 border-b border-white/[0.05] pb-5 text-center">
        <span
          className={
            isAfter
              ? 'text-[12px] font-bold uppercase tracking-[0.15em] text-ember-500'
              : 'text-[12px] font-bold uppercase tracking-[0.15em] text-rose-500'
          }
        >
          {data.eyebrow}
        </span>
        <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] text-paper sm:text-2xl">
          {data.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-sand-400">
          {data.description}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {data.items.map((label, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={label}
              onMouseEnter={() => onHoverIndex(index)}
              onMouseLeave={() => onHoverIndex(null)}
              initial={{ opacity: 0, x: isAfter ? 16 : -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: delay + 0.25 + index * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                'flex min-h-[56px] scale-100 cursor-default items-center gap-3 rounded-2xl border px-4 py-3 opacity-60 transition-all duration-200',
                isAfter
                  ? 'border-ember-500/30 bg-ember-500/[0.07]'
                  : 'border-rose-500/25 bg-transparent',
                isHovered &&
                  (isAfter
                    ? 'scale-[1.03] border-ember-500/70 bg-ember-500/[0.16] opacity-100 shadow-[0_8px_24px_rgba(244,63,30,0.18)]'
                    : 'scale-[1.03] border-rose-500/60 bg-rose-500/[0.09] opacity-100'),
              )}
            >
              <motion.span
                initial={{ scale: 0, rotate: isAfter ? -90 : 90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 16,
                  delay: delay + 0.4 + index * 0.07,
                }}
                className="shrink-0"
              >
                {isAfter ? (
                  <Check size={18} aria-hidden="true" className="text-ember-500" />
                ) : (
                  <X size={18} aria-hidden="true" className="text-rose-500" />
                )}
              </motion.span>
              <span className="text-[14px] leading-snug text-sand-200 sm:text-[15px]">
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/*
  A versão de toque: um par por vez, arrastável.

  `drag="x"` com `dragConstraints` zerado deixa o cartão ceder ao dedo
  e voltar sozinho — o elástico que diz "dá pra arrastar" sem precisar
  de instrução escrita. Quem decide a virada é o `offset` do gesto
  (mais de 60px) OU a `velocity` (um peteleco rápido, mesmo curto),
  que é como o sistema operacional interpreta swipe; olhar só a
  distância faz o gesto rápido — o mais comum — parecer que falhou.

  `custom={direction}` alimenta as variantes com o sentido da virada,
  pra o cartão que sai e o que entra andarem no mesmo sentido do dedo.
*/
const swipe = {
  enter: (direction) => ({ x: direction > 0 ? 260 : -260, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -260 : 260, opacity: 0 }),
};

const MobileCompare = () => {
  const [[index, direction], setState] = useState([0, 0]);
  const total = before.items.length;

  const paginate = (step) => {
    const next = index + step;
    if (next < 0 || next > total - 1) return;
    setState([next, step]);
  };

  return (
    <div className="mt-8">
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={swipe}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(event, info) => {
              const power = info.offset.x;
              const flick = info.velocity.x;
              if (power < -60 || flick < -450) paginate(1);
              else if (power > 60 || flick > 450) paginate(-1);
            }}
            className="touch-pan-y"
          >
            <p className="mb-4 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-sand-400">
              {pairLabels[index]}
            </p>

            {/* O par, um em cima do outro. A ordem é a da narrativa:
                o problema primeiro, a resposta embaixo. */}
            <div className="flex flex-col gap-3">
              <div className="rounded-3xl border border-rose-500/25 bg-rose-500/[0.05] p-5">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-rose-400">
                  <X size={13} aria-hidden="true" />
                  {before.eyebrow}
                </span>
                <p className="mt-2.5 text-[16px] leading-snug text-sand-300">
                  {before.items[index]}
                </p>
              </div>

              <div className="rounded-3xl border border-ember-500/40 bg-ember-500/[0.11] p-5 shadow-[0_10px_30px_rgba(244,63,30,0.14)]">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-ember-500">
                  <Check size={13} aria-hidden="true" />
                  {after.eyebrow}
                </span>
                <p className="mt-2.5 text-[16px] font-medium leading-snug text-paper">
                  {after.items[index]}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/*
        Os pontos são botões de verdade, não enfeite: quem não pegar o
        gesto de arrastar ainda consegue tocar. Cada um é uma área de
        44px (o alvo mínimo de toque), com o traço colorido desenhado
        por dentro — o alvo é grande, a marca é fina.
      */}
      <div className="mt-7 flex items-center justify-center gap-1">
        {before.items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setState([i, i > index ? 1 : -1])}
            aria-label={`Ver o par ${i + 1} de ${total}: ${pairLabels[i]}`}
            aria-current={i === index}
            className="flex h-11 w-11 items-center justify-center"
          >
            <span
              className={cn(
                'block h-[3px] rounded-full transition-all duration-300',
                i === index ? 'w-7 bg-ember-500' : 'w-3 bg-white/20',
              )}
            />
          </button>
        ))}
      </div>

      <p className="text-center text-[12px] text-sand-500">
        Arraste para ver os outros
      </p>
    </div>
  );
};

const BeforeAfter = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isMobile = useIsMobile();

  return (
    <section
      id="antes-depois"
      className="screen-section relative flex flex-col justify-center overflow-hidden bg-ink-950 lg:py-20"
    >
      {/* Dois glows de cor, um por lado — vermelho fosco atrás do
          "antes", ember atrás do "depois". Cada um pulsa devagar e
          fora de fase do outro (delay de 3s), pra não respirarem
          juntos feito uma coisa só. */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-[8%] top-1/2 -z-10 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-rose-600/[0.10] blur-[110px] sm:h-[420px] sm:w-[420px] sm:blur-[130px]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="pointer-events-none absolute right-[8%] top-1/2 -z-10 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-ember-600/[0.14] blur-[110px] sm:h-[420px] sm:w-[420px] sm:blur-[130px]"
      />

      <div className="mx-auto w-full max-w-5xl px-5 lg:px-8">
        <SectionHeading
          title="O que muda com a Barrakinha"
          description="Veja como fica vender e comprar comida de rua quando o ponto vira mapa."
          tone="dark"
          align="center"
          className="mx-auto"
        />

        {isMobile ? (
          <MobileCompare />
        ) : (
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-stretch">
            <CompareCard
              data={before}
              kind="before"
              delay={0}
              hoveredIndex={hoveredIndex}
              onHoverIndex={setHoveredIndex}
            />
            <CompareCard
              data={after}
              kind="after"
              delay={0.12}
              hoveredIndex={hoveredIndex}
              onHoverIndex={setHoveredIndex}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default BeforeAfter;
