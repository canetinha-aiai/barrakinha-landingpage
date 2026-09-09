import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/*
  O respiro entre o hero e a explicação do produto — o lugar da página
  onde o problema precisa doer antes de a solução aparecer.

  ------------------------------------------------------------------
  Aqui já moraram três versões, e as três falharam pelo mesmo motivo.

  Primeiro foram fichas arredondadas com ícone rolando em duas faixas.
  Depois as mesmas frases em tipografia grande, cheia e vazada,
  correndo em sentidos opostos. E por cima disso um título que
  resumia tudo: "Quem vende não aparece. Quem compra não encontra."

  O texto estava certo e a seção continuava sem atrair ninguém, porque
  o problema não era o acabamento — era o registro. Tudo ali era
  ABSTRAÇÃO: uma proposição lógica sobre visibilidade, ilustrada por
  uma lista de outras proposições, passando de lado numa velocidade
  em que ninguém lê frase inteira. Texto correndo é textura, não
  informação. E "quem vende não aparece" é uma constatação, não uma
  perda: ninguém se reconhece numa constatação.

  Comida de rua não é um problema de visibilidade, é uma noite
  específica. Então a seção deixa de argumentar e passa a contar o que
  aconteceu:

    a barraca abriu e voltou com metade do isopor cheio,
    você pediu no aplicativo e chegou morno,
    e vocês estavam a 180 metros um do outro.

  A virada está na terceira linha, e ela só funciona porque as duas
  primeiras foram lidas separadas — por isso são dois cartões
  distantes, com a distância desenhada entre eles, e não dois itens de
  uma lista. O leitor monta a conta sozinho; a seção só entrega as
  duas pontas.

  É a mesma dupla de públicos que a versão anterior nomeava ("quem
  vende" / "quem compra"), agora vivida em vez de anunciada — o que
  também mantém o encadeamento com as seções seguintes, que respondem
  cada uma a uma das metades.

  Nada aqui é dado: é uma cena, e o rótulo diz isso ("uma terça
  qualquer"). Por isso também não tem preço de concorrente nem nome de
  vendedor inventado — "pagou a taxa" e "a barraca" bastam pra cena e
  não afirmam nada sobre ninguém.
*/
const sides = [
  {
    label: 'Quem vende',
    lead: 'A barraca abriu às seis da tarde.',
    detail:
      'Fritou, esperou, guardou tudo de volta. Metade do isopor voltou cheia.',
  },
  {
    label: 'Quem compra',
    lead: 'Você pediu pelo aplicativo.',
    detail: 'Pagou a taxa, esperou quarenta minutos. Chegou morno.',
  },
];

const ease = [0.16, 1, 0.3, 1];

const SideCard = ({ side, delay, from }) => (
  <motion.div
    initial={{ opacity: 0, x: from, y: 12 }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.7, delay, ease }}
    className="relative flex-1 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] py-5 pl-[26px] pr-5"
  >
    {/* A mesma tira de toldo das listas de benefício: os dois lados da
        história são da mesma marca, mesmo sendo pessoas diferentes. */}
    <span
      aria-hidden="true"
      className="awning-edge absolute inset-y-0 left-0 w-[7px]"
    />

    <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-ember-500">
      {side.label}
    </span>

    <p className="mt-2.5 font-display text-[19px] font-extrabold leading-[1.15] tracking-[-0.03em] text-paper text-balance sm:text-[21px]">
      {side.lead}
    </p>
    <p className="mt-2 text-[14.5px] leading-relaxed text-sand-400 text-pretty">
      {side.detail}
    </p>
  </motion.div>
);

/*
  A distância entre os dois cartões, desenhada.

  É o elemento que faz a seção funcionar: sem ela os dois cartões são
  duas reclamações soltas; com ela, são dois pontos no mapa que nunca
  se encontraram. O tracejado "cresce" de um cartão até o outro
  (`scaleY`/`scaleX` de 0 a 1) em vez de já nascer pronto, porque o
  que se quer mostrar é a separação entre eles, e separação é uma
  medida — medida se percorre.

  O numeral vai vazado, o mesmo `.hollow` dos numerais da seção "como
  funciona": número grande e oco lê como distância, e não como
  quantidade de alguma coisa.
*/
const Distance = () => (
  /* O vão é generoso de propósito: é ele que representa os 180
     metros. Apertado, o tracejado vira um tracinho entre dois cartões
     colados e a seção volta a ser uma lista de dois itens. */
  <div className="relative flex shrink-0 items-center justify-center py-9 lg:w-44 lg:py-0">
    {/* Vertical no celular, horizontal no desktop. São dois elementos
        e não um girado: tracejado que gira fica com o traço na
        diagonal, e o que se quer é a linha na direção da leitura. */}
    <motion.span
      aria-hidden="true"
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
      style={{ originY: 0 }}
      className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 lg:hidden"
    >
      <span className="block h-full w-full bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.28)_0_5px,transparent_5px_11px)]" />
    </motion.span>

    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
      style={{ originX: 0 }}
      className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 lg:block"
    >
      <span className="block h-full w-full bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.28)_0_5px,transparent_5px_11px)]" />
    </motion.span>

    {/* O rótulo tapa o tracejado no meio — a medida sempre é escrita
        em cima da linha que ela mede. `bg-ink-950` é o fundo da seção. */}
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: 1.05, ease }}
      className="relative flex items-baseline gap-1.5 bg-ink-950 px-3"
    >
      <span
        className="hollow numeric font-display text-[38px] font-extrabold leading-none tracking-[-0.04em] sm:text-[44px]"
        style={{ WebkitTextStrokeWidth: '1.5px' }}
      >
        180
      </span>
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-sand-500">
        metros
      </span>
    </motion.span>
  </div>
);

const NearMiss = () => {
  return (
    <section className="screen-section relative flex flex-col justify-center overflow-hidden bg-ink-950 lg:py-16">
      {/* Glow ambiente — sem ele a seção é um retângulo preto liso. */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-600/[0.12] blur-[100px] sm:h-[520px] sm:w-[520px] sm:blur-[140px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, ease }}
          className="text-center text-[12px] font-bold uppercase tracking-[0.2em] text-sand-500"
        >
          Uma terça qualquer, 20h40
        </motion.p>

        <div className="mt-7 flex flex-col lg:mt-10 lg:flex-row lg:items-stretch">
          <SideCard side={sides[0]} delay={0} from={-28} />
          <Distance />
          <SideCard side={sides[1]} delay={0.15} from={28} />
        </div>

        {/* A virada. É o `h2` da seção: as duas frases acima montam a
            conta, esta cobra. */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 1.25, ease }}
          className="mx-auto mt-10 max-w-2xl text-center text-[27px] font-extrabold leading-[1.08] tracking-[-0.04em] text-paper text-balance sm:text-[36px] lg:mt-14 lg:text-[44px]"
        >
          E nenhum dos dois sabia{' '}
          <span className="bg-brand bg-clip-text text-transparent">
            do outro.
          </span>
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 1.6, ease: 'easeOut' }}
        className="relative z-10 mt-10 flex flex-col items-center gap-3 lg:mt-14"
      >
        <span className="text-center text-[13px] font-semibold uppercase leading-tight tracking-[0.06em] text-ember-400 sm:text-[14px]">
          É isso que a Barrakinha resolve
        </span>
        <ChevronDown size={22} aria-hidden="true" className="animate-bounce text-ember-400" />
      </motion.div>
    </section>
  );
};

export default NearMiss;
