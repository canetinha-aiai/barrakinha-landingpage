import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Clock, Frown, MapPinOff, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProblemsTicker from '@/components/ProblemsTicker';
import { useIsMobile } from '@/hooks/useMediaQuery';

/*
  Seção cheia com o mesmo papel que a faixa "COM O RECONHECIMENTO DE"
  tem no smartserialnumber.com: o respiro entre o hero e a explicação
  da solução. A Barrakinha não tem marca parceira pra exibir, então a
  faixa virou a dor que o produto resolve.

  ------------------------------------------------------------------
  A seção falava só do vendedor — "conhecemos as dificuldades de quem
  vende comida de rua" — e fechava prometendo "como ajudamos VOCÊ a
  superar isso", com a seta apontando pra baixo. Só que a seção logo
  abaixo é "Da conta criada ao espetinho na mão": criar conta, ver o
  mapa, pedir e retirar. Ou seja, o caminho de quem COMPRA.

  A página montava a dor de um público e entregava a solução do outro,
  com uma seta no meio dizendo que uma respondia a outra. Quem lesse
  na ordem levava um solavanco exatamente no ponto em que a página
  promete começar a resolver alguma coisa.

  O conserto não foi trocar a seta de lugar: foi reconhecer que o
  problema da Barrakinha sempre teve dois lados, e que é justamente
  isso que o produto une. A barraca que ninguém acha e a pessoa que
  não encontra a barraca são o MESMO buraco visto de duas pontas — e
  um mapa é o que fecha os dois de uma vez.

  Então o título nomeia os dois lados, as dificuldades alternam entre
  eles (compra, vende, compra, vende...) e o fecho não promete mais
  ajudar "você" especificamente: promete que é isso que a Barrakinha
  resolve. Daí em diante a página pode abrir pelo caminho de quem
  compra sem trair o que acabou de dizer, e os dois blocos de público
  que vêm depois — "pra quem compra" e "pra quem vende" — respondem
  cada um a sua metade desta faixa.
*/
/* Alternadas de propósito: compra, vende, compra, vende. A faixa de
   baixo roda a lista invertida, então ela alterna também. */
const problems = [
  'Rodar o bairro atrás de uma barraca',
  'Ninguém sabe que abriu hoje',
  'Chegar lá e estar fechado',
  'Ponto que muda toda semana',
  'Fila e troco na correria',
  'Depender da sorte pra vender',
];

const floaters = [
  { Icon: Clock, top: '18%', left: '10%', size: 28, duration: 7, delay: 0 },
  { Icon: MapPinOff, top: '68%', left: '14%', size: 24, duration: 8, delay: 1.2 },
  { Icon: Users, top: '22%', left: '86%', size: 26, duration: 6.5, delay: 0.6 },
  { Icon: Frown, top: '70%', left: '88%', size: 24, duration: 9, delay: 2 },
];

/*
  Uma faixa de dificuldades correndo.

  A primeira versão eram cápsulas: cada frase numa pílula arredondada
  com contorno fino e um ícone. Funcionava e não dizia nada — cápsula
  arredondada com ícone é o componente mais genérico que existe numa
  interface, e o que rolava ali eram as DORES do público, o trecho mais
  duro da página. Vinham amaciadas em widget.

  Aqui a faixa é tipografia, sem caixa nenhuma: as frases em caixa
  alta, no display da marca, uma linha cheia e outra vazada correndo em
  sentidos opostos. O contraste entre a letra sólida e a de contorno é
  o que dá profundidade e ritmo — trabalho que antes estava sendo feito
  por borda e fundo, e agora é feito pela própria letra. É o mesmo
  gesto que o `EyebrowMarquee` já usa no topo das seções de público,
  então a página ganha uma família, não mais um componente.

  A lista é duplicada e o trilho anda exatamente -50%: quando a segunda
  cópia chega onde a primeira começou, a animação reinicia num quadro
  idêntico ao anterior, e o loop não tem emenda. `reverse` inverte o
  sentido pela direção da animação, não por uma segunda regra de
  keyframes.
*/
const Band = ({ items, duration = 38, reverse = false, outline = false }) => (
  <div className="edge-fade overflow-hidden">
    <div
      className="flex w-max items-center motion-reduce:animate-none"
      style={{
        animation: `marquee ${duration}s linear infinite`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      {[...items, ...items].map((text, index) => (
        <span key={index} className="flex shrink-0 items-center">
          <span
            className={cn(
              'font-display text-[21px] font-extrabold uppercase leading-none tracking-[-0.02em] sm:text-[26px]',
              outline ? 'hollow' : 'text-paper',
            )}
          >
            {text}
          </span>

          {/* O losango entre as frases: um quadrado girado 45°, não um
              caractere de fonte. Marca de separação que não é
              pontuação — o mesmo registro geométrico das listras do
              toldo e da silhueta de prédios. */}
          <span
            aria-hidden="true"
            className="mx-5 block h-1.5 w-1.5 rotate-45 bg-ember-500 sm:mx-7"
          />
        </span>
      ))}
    </div>
  </div>
);

const ProblemsMarquee = () => {
  const isMobile = useIsMobile();

  return (
    <section className="screen-section relative flex flex-col justify-center overflow-hidden bg-ink-950 lg:py-16">
      {/* Glow ambiente, parado no centro — a seção era só texto sobre
          fundo chapado antes disso. */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-600/[0.12] blur-[100px] sm:h-[480px] sm:w-[480px] sm:blur-[130px]"
      />

      {/* Ícones das próprias dificuldades, soltos e flutuando bem
          devagar — só visíveis em telas largas, onde sobra margem dos
          dois lados do bloco de texto sem disputar espaço com ele. No
          celular esse papel é das fichas rolando, que dizem a mesma
          coisa ocupando a largura em vez das sobras. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {floaters.map(({ Icon, top, left, size, duration, delay }, i) => (
          <motion.div
            key={i}
            className="absolute text-ember-500/[0.16]"
            style={{ top, left }}
            animate={{ y: [0, -16, 0], rotate: [0, i % 2 === 0 ? 6 : -6, 0] }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
          >
            <Icon size={size} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <h2 className="mx-auto max-w-lg px-5 text-center text-[24px] font-extrabold leading-[1.12] tracking-[-0.03em] text-paper text-balance sm:text-[28px]">
          Quem vende não aparece. Quem compra não encontra.
        </h2>
      </motion.div>

      {isMobile ? (
        /* Duas faixas em sentidos opostos. A de baixo é um pouco mais
           lenta e começa por outro ícone, pra as duas não lerem como
           uma coisa só duplicada. */
        <div className="relative z-10 mt-9 flex flex-col gap-3.5">
          <Band items={problems} duration={38} />
          <Band items={problems.slice().reverse()} duration={46} reverse outline />
        </div>
      ) : (
        /* Anel fino ao redor do ticker — antes ele flutuava sozinho
           sobre o fundo escuro, sem nada marcando onde a "janela"
           termina. */
        <div className="relative z-10 mx-auto mt-8 w-full max-w-md rounded-[28px] border border-white/[0.06] bg-white/[0.02] px-5 py-2">
          <ProblemsTicker items={problems} />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="relative z-10 mt-12 flex flex-col items-center gap-3 lg:mt-16 lg:gap-4"
      >
        <span className="max-w-[280px] text-center text-[13px] font-semibold uppercase leading-tight tracking-[0.06em] text-ember-400 sm:text-[15px] sm:tracking-[0.03em]">
          É isso que a Barrakinha resolve
        </span>
        <ChevronDown
          size={22}
          aria-hidden="true"
          className="animate-bounce text-ember-400"
        />
      </motion.div>
    </section>
  );
};

export default ProblemsMarquee;
