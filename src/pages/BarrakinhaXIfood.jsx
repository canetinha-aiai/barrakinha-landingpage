import React from 'react';
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

/*
  /barrakinha-x-ifood — a página de comparação.

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

const Hero = () => (
  <section id="top" className="bg-paper pt-16 text-ink">
    <div className="mx-auto w-full max-w-6xl px-5 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-20">
      <h1 className="display-wide max-w-[14ch] animate-enter text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-balance [animation-delay:80ms] sm:text-[4rem] lg:text-[5rem]">
        Barrakinha <span className="text-ember-text">x</span> iFood: qual a diferença?
      </h1>
      <p className="mt-7 max-w-[44ch] animate-enter text-[18px] leading-relaxed text-ink-muted text-pretty [animation-delay:200ms]">
        O iFood leva a comida até você. A Barrakinha mostra as barracas de
        comida de rua abertas agora, perto de você, pra pedir, pagar no Pix e
        buscar na hora. Sem entregador e sem taxa de entrega.
      </p>
      <div className="mt-9 flex animate-enter flex-col gap-5 [animation-delay:300ms] sm:flex-row sm:items-center sm:gap-7">
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
  </section>
);

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
    us: 'R$1 por pedido pago. Sem mensalidade e sem porcentagem',
    them: 'Depende do plano contratado',
  },
];

const Comparison = () => (
  <section id="comparacao" className="scroll-mt-16 border-t border-line bg-paper text-ink">
    <div className="section">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <SectionHeading
          title="Lado a lado"
          description="Não é um contra o outro. São apps pra momentos diferentes do dia."
        />

        <Reveal className="mt-12" amount={0.05}>
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Comparação entre Barrakinha e iFood</caption>
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="hidden w-[22%] pb-4 sm:table-cell">
                  <span className="sr-only">Item</span>
                </th>
                <th scope="col" className="w-1/2 pb-4 pr-4 sm:w-[39%]">
                  <span className="display-wide text-[22px] tracking-[-0.02em] text-ember-text sm:text-[28px]">Barrakinha</span>
                </th>
                <th scope="col" className="w-1/2 pb-4 sm:w-[39%]">
                  <span className="display-wide text-[22px] tracking-[-0.02em] text-ink-muted sm:text-[28px]">iFood</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <React.Fragment key={row.label}>
                  {/* No celular o nome da linha vem em cima, ocupando as
                      duas colunas; no desktop ele é a primeira coluna. */}
                  <tr className="sm:hidden">
                    <th colSpan={2} className="pt-5 text-label font-semibold text-ink-muted">
                      {row.label}
                    </th>
                  </tr>
                  <tr className="border-b border-line-strong align-top">
                    <th scope="row" className="hidden py-5 pr-6 text-[15px] font-semibold text-ink-muted sm:table-cell">
                      {row.label}
                    </th>
                    <td className="pb-5 pr-4 pt-2 text-[16px] font-semibold leading-snug text-ink sm:py-5 sm:text-[18px]">
                      {row.us}
                    </td>
                    <td className="pb-5 pt-2 text-[16px] leading-snug text-ink-muted sm:py-5 sm:text-[18px]">
                      {row.them}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </Reveal>
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
                  ? 'rounded bg-ember p-7 text-night sm:p-9'
                  : 'rounded border border-line-strong bg-paper p-7 sm:p-9'
              }
            >
              <h3 className="display-wide text-[26px] leading-none tracking-[-0.02em] sm:text-[32px]">
                {moment.title}
              </h3>
              <ul className="mt-6 space-y-4">
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

const ForVendors = () => (
  <section id="pra-quem-vende" className="bg-night text-cream">
    <div className="section">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHeading
            tone="night"
            title="Pra barraca: R$1 por pedido. Só isso."
            description="Quem vende na rua não tem margem pra dividir cada venda. Por isso a conta é simples."
          />
          {/* Exemplo com o número que o split faz hoje: o pedido menos
              R$1 vai pra subconta da barraca. */}
          <Reveal className="mt-10 rounded border border-night-line p-6">
            <p className="text-[15px] text-night-muted">Pedido de R$25 no Pix</p>
            <p className="display-wide mt-2 text-[40px] leading-none tracking-[-0.03em] text-cream">
              R$24 <span className="text-[18px] font-semibold tracking-normal text-night-muted">pra você</span>
            </p>
            <p className="mt-3 text-[15px] text-night-muted">R$1 de tarifa, que já inclui o custo do Pix.</p>
          </Reveal>
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
