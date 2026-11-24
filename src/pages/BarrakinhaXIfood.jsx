import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import BenefitList from '@/components/BenefitList';
import SectionHeading from '@/components/SectionHeading';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';
import MobileCTABar from '@/components/MobileCTABar';
import Magnetic from '@/components/Magnetic';
import Reveal from '@/components/Reveal';
import SpringPress from '@/components/fluid/SpringPress';
import { jump } from '@/lib/nav';
import PracaIso from '@/components/praca/PracaIso';
import MorphLogo from '@/components/fluid/MorphLogo';
import FomeRace from '@/components/praca/FomeRace';


/*
  /barrakinha-x-ifood — a página de comparação.

  Versão "na praça": abre com a praça isométrica (PracaIso, ilustração
  fixa no desenho da barraca da home), o "x" grande entre as duas marcas, a corrida da fome presa na rolagem (FomeRace)
  e depois a comparação, a barraca e o FAQ.

  A pergunta que todo mundo faz é "é tipo um iFood?". A resposta não
  briga com o iFood: são coisas pra horas diferentes. O iFood leva a
  comida até você; a Barrakinha mostra a barraca aberta agora, perto,
  pra pedir e buscar.

  Cuidado com o que se afirma do outro lado: nada de número de taxa ou
  comissão do iFood (muda por plano e por loja e a gente não tem como
  provar). O lado do iFood só diz o que qualquer pessoa vê no app
  ("pode ter taxa de entrega", "depende do plano").

  Do nosso lado, só o que é verdade hoje: retirada na barraca, Pix no
  app, R$1 por pedido pago descontado da barraca, sem mensalidade e
  sem taxa pra quem compra.

  Também serve pro buscador: o título tem "Barrakinha" e "iFood", e o
  FAQ responde "é com K mesmo?", que é a busca que o Google troca por
  "barraquinha".
*/

const FEE_SOURCE = 'https://saipos.com/integracoes/ifood/taxa-ifood';

const Hero = () => (
  <section id="top" className="relative overflow-hidden bg-paper pt-16 text-ink">
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 px-5 pb-10 pt-10 lg:grid-cols-12 lg:gap-4 lg:px-8 lg:pb-16 lg:pt-14">
      <div className="lg:col-span-6">
        <h1 className="display-wide animate-enter text-[2.5rem] leading-[0.98] tracking-[-0.03em] text-balance [animation-delay:80ms] sm:text-[3.6rem] lg:text-[4.1rem]">
          Com fome na <span className="text-ember-text">praça</span>, ninguém pede iFood.
        </h1>
        <p className="mt-6 max-w-[42ch] animate-enter text-[18px] leading-relaxed text-ink-muted text-pretty [animation-delay:200ms] lg:text-[19px]">
          Você abre a Barrakinha e vê as barracas abertas aí do lado, com a
          distância até cada uma. Pede, paga no Pix e busca. Sem entregador
          e sem taxa de entrega.
        </p>
        <div className="mt-8 flex animate-enter flex-col gap-5 [animation-delay:300ms] sm:flex-row sm:items-center sm:gap-7">
          <Magnetic className="w-full sm:w-auto">
            <SpringPress
              as="a"
              href="#lista"
              onClick={(event) => jump(event, '#lista')}
              className="btn-ember h-14 w-full text-base sm:h-12 sm:w-auto"
            >
              Entrar na lista de espera
            </SpringPress>
          </Magnetic>
          <a
            href="#comparacao"
            onClick={(event) => jump(event, '#comparacao')}
            className="self-center rounded text-[16px] font-semibold underline decoration-ink/30 underline-offset-[6px] hover:decoration-ember sm:self-auto"
          >
            Ver a comparação
          </a>
        </div>
      </div>
      <PracaIso className="mx-auto w-full max-w-[540px] lg:col-span-6 lg:-mr-6 lg:max-w-none" />
    </div>
  </section>
);

/*
  O "x" do título, grande: o selo da Barrakinha de um lado, "iFood"
  escrito do outro. O iFood vai só em texto, na cor neutra: logo e
  vermelho deles são marca registrada, e a página não usa.

  O "x" gira com a rolagem, e os dois nomes se aproximam até se
  encostarem no meio da faixa.
*/
const Versus = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-90, 270]);
  const left = useTransform(scrollYProgress, [0, 0.5], ['-12%', '0%']);
  const right = useTransform(scrollYProgress, [0, 0.5], ['12%', '0%']);

  return (
    <section ref={ref} aria-label="Barrakinha x iFood" className="overflow-hidden border-y border-line bg-paper-raised">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2.5 px-4 py-14 sm:gap-10 lg:py-20">
        <motion.div style={reduce ? undefined : { x: left }} className="flex items-center gap-3 sm:gap-5">
          <MorphLogo size={72} start="view" label="Barrakinha" className="hidden text-ember sm:block" />
          <MorphLogo size={34} start="view" label="Barrakinha" className="text-ember sm:hidden" />
          <span className="display-wide text-[22px] leading-none tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[72px]">
            Barrakinha
          </span>
        </motion.div>
        <motion.span
          aria-hidden="true"
          style={reduce ? undefined : { rotate }}
          className="display-wide inline-block text-[34px] leading-none text-ember sm:text-[88px] lg:text-[112px]"
        >
          x
        </motion.span>
        <motion.span
          style={reduce ? undefined : { x: right }}
          className="display-wide text-[22px] leading-none tracking-[-0.03em] text-ink-muted sm:text-[56px] lg:text-[72px]"
        >
          iFood
        </motion.span>
      </div>
    </section>
  );
};

/* Cada linha: o que se compara, o nosso lado e o lado do delivery. O
   lado do iFood fica em texto neutro, no cinza; o nosso em tinta. */
const rows = [
  {
    label: 'Pra que serve',
    us: 'Comer na rua, perto de onde você está agora',
    them: 'Receber comida onde você estiver',
  },
  {
    label: 'Quem vende',
    us: 'Barracas, food trucks e ambulantes do bairro',
    them: 'Restaurantes, mercados e lojas',
  },
  {
    label: 'Como chega',
    us: 'Você busca na barraca, e o app avisa quando fica pronto',
    them: 'Um entregador leva até você',
  },
  {
    label: 'Taxa de entrega',
    us: 'Não tem, porque não tem entrega',
    them: 'Pode ter, conforme a loja e a distância',
  },
  {
    label: 'O que você paga',
    us: 'O preço do cardápio da barraca, sem taxa extra',
    them: 'O pedido mais as taxas do app, quando houver',
  },
  {
    label: 'Como achar',
    us: 'Mapa com quem está aberto agora e a distância até lá',
    them: 'Lista das lojas que entregam no seu endereço',
  },
  {
    label: 'Pra quem vende',
    us: 'R$1 fixo por pedido pago. Sem mensalidade e sem porcentagem',
    them: 'A partir de 12% do pedido, mais taxa de pagamento online. Mais caro ainda no plano em que o iFood entrega*',
  },
];

/*
  "Lado a lado": lista de filetes, no estilo do resto do site. Sem
  caixas, ícones nem vistos: a Barrakinha em tinta, o iFood em cinza, e
  só a linha da taxa da barraca ganha destaque (título largo, número em
  laranja de texto), que é onde a diferença pesa. No celular o nome da
  linha vem em cima e as duas colunas ficam lado a lado.
*/
const Comparison = () => (
  <section id="comparacao" className="scroll-mt-16 border-t border-line bg-paper text-ink">
    <div className="section">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading
          title="Lado a lado"
          description="Não é um contra o outro. São apps pra momentos diferentes do dia."
        />

        <div className="mt-12 grid grid-cols-2 gap-x-6 md:grid-cols-[200px_1fr_1fr] md:gap-x-10">
          <div className="hidden border-b-2 border-ink md:block" />
          <p className="display-wide border-b-2 border-ink pb-4 text-[22px] leading-none tracking-[-0.02em] text-ember-text sm:text-[28px]">
            Barrakinha
          </p>
          <p className="display-wide border-b-2 border-ink pb-4 text-[22px] leading-none tracking-[-0.02em] text-ink-muted sm:text-[28px]">
            iFood
          </p>

          {rows.map((row) => {
            const big = row.label === 'Pra quem vende';
            return (
              <React.Fragment key={row.label}>
                <p className="col-span-2 pt-5 text-[14px] font-semibold text-ink-muted md:col-span-1 md:border-b md:border-line-strong md:py-5 md:text-[15px]">
                  {row.label}
                </p>
                <p
                  className={
                    big
                      ? 'display-wide border-b border-line-strong pb-5 pt-1 text-[17px] leading-[1.2] tracking-[-0.02em] text-ember-text text-balance sm:text-[24px] md:py-5'
                      : 'border-b border-line-strong pb-5 pt-1 text-[16px] font-semibold leading-snug text-ink text-balance sm:text-[18px] md:py-5'
                  }
                >
                  {row.us}
                </p>
                <p
                  className={
                    big
                      ? 'border-b border-line-strong pb-5 pt-1 text-[16px] leading-snug text-ink-muted sm:text-[18px] md:py-5'
                      : 'border-b border-line-strong pb-5 pt-1 text-[16px] leading-snug text-ink-muted sm:text-[18px] md:py-5'
                  }
                >
                  {row.them}
                </p>
              </React.Fragment>
            );
          })}
        </div>

        <p className="mt-8 max-w-[70ch] text-[14px] leading-relaxed text-ink-muted">
          * Comissão cobrada de restaurantes, segundo a{' '}
          <a href={FEE_SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
            Saipos
          </a>
          : plano Básico, 12% sobre o pedido mais a taxa de pagamento online; o plano com entrega do iFood é
          mais alto. Os valores mudam conforme plano, cidade e contrato, então confira no iFood. Conferido em
          24/11/2026.
        </p>
      </div>
    </div>
  </section>
);

const moments = [
  {
    title: 'Hora de iFood',
    items: [
      'Está chovendo e você não quer sair de casa.',
      'Quer pedir de um restaurante longe de você.',
      'Vai receber gente em casa e precisa de entrega.',
    ],
  },
  {
    title: 'Hora de Barrakinha',
    items: [
      'Saiu do trabalho e bateu a fome no caminho.',
      'Está na praça, na feira ou no evento e quer saber o que tem ali.',
      'Quer o pastel quentinho, sem esperar entregador.',
    ],
    ours: true,
  },
];

const WhenToUse = () => (
  <section className="border-t border-line bg-paper-raised text-ink">
    <div className="section">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading title="Cada um na sua hora" />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {moments.map((moment, index) => (
            <Reveal
              key={moment.title}
              delay={0.08 * index}
              className={
                moment.ours
                  ? 'relative overflow-hidden rounded bg-ember p-7 text-night sm:p-9'
                  : 'rounded border border-line-strong bg-paper p-7 sm:p-9'
              }
            >
              {/* O selo da Barrakinha como carimbo: branco, no canto de cima,
                  inteiro e um pouco torto. */}
              {moment.ours ? (
                <MorphLogo
                  size={96}
                  start="view"
                  label="Barrakinha"
                  className="pointer-events-none absolute right-4 top-4 h-16 w-16 -rotate-12 text-white sm:right-6 sm:top-6 sm:h-24 sm:w-24"
                />
              ) : null}
              <h3
                className={`relative display-wide text-[26px] leading-none tracking-[-0.02em] sm:text-[32px] ${moment.ours ? 'pr-20 sm:pr-28' : ''}`}
              >
                {moment.title}
              </h3>
              <ul className="relative mt-6 space-y-4">
                {moment.items.map((item) => (
                  <li
                    key={item}
                    className={
                      moment.ours
                        ? 'border-t border-night/20 pt-4 text-[17px] font-medium leading-snug'
                        : 'border-t border-line-strong pt-4 text-[17px] leading-snug text-ink-muted'
                    }
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const vendorItems = [
  {
    title: 'Sem mensalidade',
    detail: 'Estar no app não custa nada. Não vendeu, não paga.',
  },
  {
    title: 'Sem porcentagem',
    detail: 'É R$1 por pedido pago no Pix, seja um pastel de R$8 ou um combo de R$80.',
  },
  {
    title: 'Sem entregador',
    detail: 'O cliente vem buscar. Você não depende de motoboy nem embala pra viagem.',
  },
  {
    title: 'O preço é seu',
    detail: 'Não precisa subir o preço no app pra cobrir taxa. O cardápio é o mesmo do balcão.',
  },
];

/*
  O exemplo do pedido de R$25, contado na tela: quando o cartão entra,
  o valor desce de R$25 pra R$24 e a linha do R$1 aparece. O número é
  o que o split faz hoje: o pedido menos R$1 vai pra conta da barraca.
*/
const brl = (v) => v.toFixed(2).replace('.', ',');

const MoneyCard = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(25);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setValue(24);
      setPhase(2);
      return undefined;
    }
    setPhase(1);
    const controls = animate(25, 24, {
      duration: 1.1,
      delay: 0.5,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: setValue,
      onComplete: () => setPhase(2),
    });
    return () => controls.stop();
  }, [inView, reduce]);

  return (
    <div ref={ref} className="mt-10 rounded border border-night-line p-6">
      <p className="text-[15px] text-night-muted">Pedido de R$25 no Pix</p>
      <p className="display-wide mt-2 text-[44px] leading-none tracking-[-0.03em] text-cream">
        R${brl(value)}{' '}
        <span className="text-[18px] font-semibold tracking-normal text-night-muted">pra você</span>
      </p>
      <motion.p
        initial={false}
        animate={phase ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.4 }}
        className="mt-3 text-[15px] text-night-muted"
      >
        <span className="font-semibold text-ember">− R$1,00</span> de tarifa, que já inclui o custo do Pix.
      </motion.p>
    </div>
  );
};

/*
  Quanto sai de um pedido de R$25. O R$1 é o nosso, fixo. O do iFood é
  o piso da comissão do plano mais barato (12% de R$25 = R$3,00), sem
  contar a taxa de pagamento online nem os planos mais caros: é o menor
  valor que a fonte sustenta, e mesmo assim é o triplo.
*/
const FeeCompare = () => (
  <Reveal className="mt-5 rounded border border-night-line p-6" amount={0.4}>
    <p className="text-[15px] text-night-muted">O que fica pra plataforma num pedido de R$25</p>
    {[
      { name: 'iFood', value: 'a partir de R$3,00', w: '100%', cls: 'bg-cream/40', note: true },
      { name: 'Barrakinha', value: 'R$1,00', w: '33.3%', cls: 'bg-ember' },
    ].map((bar, i) => (
      <div key={bar.name} className="mt-4">
        <div className="flex items-baseline justify-between gap-3 text-[15px]">
          <span className="font-semibold text-cream">{bar.name}</span>
          <span className="numeric font-semibold text-cream">{bar.value}{bar.note ? '*' : ''}</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-cream/10">
          <motion.div
            className={`h-full origin-left rounded-full ${bar.cls}`}
            style={{ width: bar.w }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.25, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
      </div>
    ))}
    <p className="mt-4 text-[13px] leading-relaxed text-night-muted">
      *12% de comissão do plano Básico, segundo a{' '}
      <a href={FEE_SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-cream">
        Saipos
      </a>
      , sem a taxa de pagamento online.
    </p>
  </Reveal>
);

const ForVendors = () => (
  <section id="pra-quem-vende" className="bg-night text-cream">
    <div className="section">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHeading
            tone="night"
            title="Pra barraca: R$1 por pedido. Só isso."
            description="Quem vende na rua não tem margem pra dividir cada venda. Por isso a conta é simples e bem mais barata."
          />
          <MoneyCard />
          <FeeCompare />
          <a
            href="/vendedores"
            className="mt-8 inline-block rounded text-[16px] font-semibold text-cream underline decoration-night-line underline-offset-[6px] hover:decoration-ember"
          >
            Ver tudo pra quem vende
          </a>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <BenefitList tone="night" items={vendorItems} />
        </div>
      </div>
    </div>
  </section>
);

/* As mesmas perguntas vão no JSON-LD (FAQPage) do HTML da página.
   Mudou aqui, muda lá. */
export const faq = [
  {
    q: 'A Barrakinha é um iFood de barraca?',
    a: 'Quase isso, mas sem entrega. Você vê no mapa as barracas de comida de rua abertas agora perto de você, faz o pedido pelo app, paga no Pix e busca na barraca quando fica pronto.',
  },
  {
    q: 'A Barrakinha entrega?',
    a: 'Não. A ideia é justamente comer na rua, perto de onde você está. Sem entregador, não tem taxa de entrega nem espera pelo motoboy.',
  },
  {
    q: 'Quem compra paga alguma taxa?',
    a: 'Não. Você paga o preço do cardápio da barraca. A tarifa de R$1 por pedido sai da parte da barraca.',
  },
  {
    q: 'Quanto a barraca paga pra usar?',
    a: 'R$1 por pedido pago no Pix, que já inclui o custo do Pix. Não tem mensalidade nem porcentagem sobre a venda.',
  },
  {
    q: 'A Barrakinha é mais barata que o iFood pra quem vende?',
    a: 'É. A Barrakinha cobra R$1 fixo por pedido pago. O iFood cobra do restaurante a partir de 12% do pedido, mais a taxa de pagamento online, segundo a Saipos. Num pedido de R$25, são R$3,00 ou mais contra R$1,00. Os valores do iFood mudam por plano, cidade e contrato.',
  },
  {
    q: 'É Barrakinha com K mesmo?',
    a: 'É, Barrakinha com K. Se você buscou "barraquinha" e chegou aqui, está no lugar certo.',
  },
  {
    q: 'A Barrakinha tem alguma relação com o iFood?',
    a: 'Não. iFood é marca do seu respectivo dono, e a Barrakinha não tem ligação com ele. Usamos o nome só pra explicar a diferença.',
  },
];

const Faq = () => (
  <section className="border-t border-line bg-paper text-ink">
    <div className="section">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <SectionHeading title="Perguntas que todo mundo faz" />
        </div>
        <dl className="border-t border-line-strong lg:col-span-7 lg:col-start-6">
          {faq.map((item) => (
            <Reveal key={item.q} className="border-b border-line-strong py-6">
              <dt className="text-[20px] font-bold leading-snug tracking-[-0.015em]">{item.q}</dt>
              <dd className="mt-2 max-w-[56ch] text-[16px] leading-relaxed text-ink-muted text-pretty">{item.a}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </div>
  </section>
);

const BarrakinhaXIfood = () => (
  <>
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <Hero />
        <Versus />
        <FomeRace />
        <Comparison />
        <WhenToUse />
        <ForVendors />
        <Faq />
        <DownloadCTA />
      </main>
      <Footer />
      <MobileCTABar />
    </div>
    <Toaster />
    <Analytics />
  </>
);

export default BarrakinhaXIfood;
