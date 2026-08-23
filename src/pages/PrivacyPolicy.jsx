import React from 'react';
import Footer from '@/components/Footer';

/*
  Página de política de privacidade.

  Fora da rolagem de uma seção só: aqui o conteúdo é documento, não
  pitch, então a régua de 52ch do resto do site (`max-w-prose`) fica
  estreita demais — o texto vira uma coluna alta e cansativa. A medida
  usada aqui é mais larga (~68ch, `max-w-2xl`), só para prosa longa.

  Sem `screen-section`/scroll-snap: essa classe existe pra dar às seções
  do site o tamanho da tela e um lugar pro encaixe de rolagem parar; um
  documento longo deve poder rolar livre.

  Cabeçalho próprio, não o `Header` do site: os links de navegação dele
  apontam para âncoras que não existem nesta página.

  IMPORTANTE — antes de publicar:
  Pedir revisão de um advogado. Este texto foi redigido com base no
  que o produto faz hoje (cadastro por nome/e-mail/telefone, login por
  código, localização, pedidos, pagamento via Stripe, push via Expo,
  lista de espera via Sheet Monkey/Google Sheets) — não é
  aconselhamento jurídico.
*/

const LEGAL_ENTITY_PLACEHOLDER = 'MATEUS T SARTORIO, CNPJ 68.383.640/0001-61';
const CONTACT_EMAIL = 'contato@barrakinha.com';
const LAST_UPDATED = '23 de agosto de 2026';

const sections = [
  {
    id: 'quem-somos',
    title: 'Quem somos e a quem esta política se aplica',
    body: (
      <>
        <p>
          Esta política explica como a Barrakinha coleta, usa, guarda e
          protege dados pessoais em três lugares: este site, o app do
          cliente e o app do vendedor (juntos, "os serviços"). A
          Barrakinha é operada por {LEGAL_ENTITY_PLACEHOLDER}.
        </p>
        <p>
          Ao usar os serviços, você concorda com o que está descrito
          aqui, nos termos da Lei Geral de Proteção de Dados (Lei nº
          13.709/2018 — LGPD).
        </p>
      </>
    ),
  },
  {
    id: 'dados-que-coletamos',
    title: 'Quais dados coletamos',
    body: (
      <>
        <p>
          <strong className="text-ink-900">Lista de espera, neste site.</strong>{' '}
          Só o e-mail que você digita no formulário "Entrar na lista". Ele é
          enviado a uma planilha através do Sheet Monkey, que grava os
          dados no Google Sheets — os dois são processadores nossos, não
          têm outro uso para o seu e-mail.
        </p>
        <p>
          <strong className="text-ink-900">Cadastro no app.</strong> Nome,
          e-mail e telefone, para criar sua conta. O login é por código
          enviado por SMS ao seu telefone — não guardamos senha.
        </p>
        <p>
          <strong className="text-ink-900">Localização.</strong> Com sua
          permissão, usamos a localização do aparelho: pra mostrar a você
          as barracas abertas perto de você (cliente), ou pra saber onde
          fica a sua barraca enquanto está vendendo (vendedor) — é o app
          que capta essa localização automaticamente, você não marca a
          posição na mão.
        </p>
        <p>
          <strong className="text-ink-900">Pedidos.</strong> Itens, valores
          e horários de cada pedido feito pelo app.
        </p>
        <p>
          <strong className="text-ink-900">Pagamento.</strong> Pagamentos
          são processados diretamente pela Stripe. Não guardamos número de
          cartão — esses dados ficam só com a Stripe, sob as políticas de
          segurança dela (padrão PCI-DSS). Para vendedores, o cadastro de
          recebimento é feito pela própria Stripe (Stripe Connect), que
          coleta os dados bancários e de identificação necessários.
        </p>
        <p>
          <strong className="text-ink-900">Notificações.</strong> Um token
          de identificação do aparelho (via Expo Push Service), usado só
          para avisar sobre pedido novo, aceite e mudança de status.
        </p>
        <p>
          <strong className="text-ink-900">Dados técnicos.</strong>{' '}
          Informações básicas de acesso — tipo de aparelho, sistema
          operacional — coletadas automaticamente para o app funcionar e
          para segurança.
        </p>
      </>
    ),
  },
  {
    id: 'para-que-usamos',
    title: 'Para que usamos esses dados',
    body: (
      <ul className="mt-1 list-disc space-y-2 pl-5 marker:text-sand-300">
        <li>Criar e manter sua conta, e autenticar seu login.</li>
        <li>
          Mostrar as barracas abertas perto de você e permitir montar e
          enviar um pedido.
        </li>
        <li>Processar pagamentos e o repasse a vendedores.</li>
        <li>Avisar sobre o andamento de um pedido.</li>
        <li>
          Avisar sobre o lançamento do app pra quem entrou na lista de
          espera.
        </li>
        <li>Corrigir problemas e melhorar os serviços.</li>
        <li>Cumprir obrigações legais, fiscais e regulatórias.</li>
      </ul>
    ),
  },
  {
    id: 'com-quem-compartilhamos',
    title: 'Com quem compartilhamos',
    body: (
      <>
        <p>Compartilhamos dados só com quem precisa deles para o serviço funcionar:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-sand-300">
          <li>
            <strong className="text-ink-900">Stripe</strong> — processamento
            de pagamento e repasse a vendedores.
          </li>
          <li>
            <strong className="text-ink-900">Expo</strong> — envio das
            notificações push.
          </li>
          <li>
            <strong className="text-ink-900">Sheet Monkey e Google Sheets</strong>{' '}
            — recebimento e guarda da lista de espera deste site.
          </li>
          <li>
            <strong className="text-ink-900">Autoridades</strong> — quando
            exigido por lei, ordem judicial ou para proteger direitos da
            Barrakinha, de vendedores ou de outros usuários.
          </li>
        </ul>
        <p className="mt-4">
          Não vendemos dados pessoais, nem compartilhamos com terceiros
          para fins de publicidade.
        </p>
      </>
    ),
  },
  {
    id: 'transferencia-internacional',
    title: 'Transferência internacional',
    body: (
      <p>
        Alguns desses fornecedores processam dados fora do Brasil (Stripe e
        Expo têm infraestrutura nos Estados Unidos, por exemplo). Nesses
        casos, exigimos que a transferência siga um dos mecanismos
        previstos no art. 33 da LGPD — como cláusulas contratuais
        padrão ou a adesão do fornecedor a um nível de proteção
        equivalente.
      </p>
    ),
  },
  {
    id: 'retencao',
    title: 'Por quanto tempo guardamos',
    body: (
      <p>
        Dados de conta ficam guardados enquanto ela estiver ativa. Dados de
        pedido e pagamento são mantidos pelo prazo exigido pela legislação
        fiscal e cível aplicável, mesmo após o encerramento da conta. O
        e-mail da lista de espera fica guardado até o lançamento do app ou
        até você pedir a remoção, o que vier primeiro. Depois desses
        prazos, os dados são apagados ou anonimizados.
      </p>
    ),
  },
  {
    id: 'seguranca',
    title: 'Como protegemos seus dados',
    body: (
      <p>
        Usamos práticas de mercado para proteger os dados que tratamos:
        conexão criptografada (HTTPS/TLS) entre o app e nossos servidores,
        acesso restrito à equipe que precisa dele para o trabalho, e login
        sem senha — o código por SMS reduz o risco de uma senha
        vazada em outro serviço abrir sua conta aqui. Nenhum sistema é
        infalível; se algo comprometer seus dados de um jeito que gere
        risco relevante, avisamos você e a Autoridade Nacional de Proteção
        de Dados (ANPD), como manda a LGPD.
      </p>
    ),
  },
  {
    id: 'seus-direitos',
    title: 'Seus direitos',
    body: (
      <>
        <p>Pela LGPD (art. 18), você pode pedir a qualquer momento:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-sand-300">
          <li>Confirmação de que tratamos seus dados, e acesso a eles.</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
          <li>
            Anonimização, bloqueio ou eliminação de dados desnecessários ou
            tratados fora da lei.
          </li>
          <li>Portabilidade dos seus dados a outro fornecedor.</li>
          <li>Eliminação dos dados tratados com base no seu consentimento.</li>
          <li>Informação sobre com quem compartilhamos seus dados.</li>
          <li>Revogação do consentimento, a qualquer momento.</li>
        </ul>
        <p className="mt-4">
          Para exercer qualquer um desses direitos, escreva para{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-ink-900 underline decoration-paper-200 underline-offset-2 transition-colors hover:decoration-ink-900"
          >
            {CONTACT_EMAIL}
          </a>
          . Respondemos em até 15 dias.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies neste site',
    body: (
      <p>
        Este site não usa cookies de rastreamento ou de publicidade. O
        único dado tratado aqui é o e-mail que você mesmo digita no
        formulário da lista de espera. Se isso mudar — por exemplo, com a
        entrada de uma ferramenta de análise de audiência —, esta seção é
        atualizada antes.
      </p>
    ),
  },
  {
    id: 'criancas-adolescentes',
    title: 'Crianças e adolescentes',
    body: (
      <p>
        Os serviços não são direcionados a menores de 18 anos. Se
        identificarmos que coletamos dados de uma criança ou adolescente
        sem o consentimento específico e em destaque de um responsável
        legal, esses dados são eliminados.
      </p>
    ),
  },
  {
    id: 'alteracoes',
    title: 'Alterações nesta política',
    body: (
      <p>
        Podemos atualizar esta política para refletir mudanças nos
        serviços ou na lei. A data no topo da página sempre mostra a
        versão mais recente; mudanças relevantes são avisadas por e-mail
        ou por aviso dentro do app.
      </p>
    ),
  },
  {
    id: 'contato',
    title: 'Encarregado e contato',
    body: (
      <p>
        Dúvidas, pedidos ou reclamações sobre o tratamento dos seus dados
        podem ser enviados para{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-ink-900 underline decoration-paper-200 underline-offset-2 transition-colors hover:decoration-ink-900"
        >
          {CONTACT_EMAIL}
        </a>
        , endereçados ao encarregado de proteção de dados (DPO) da
        Barrakinha.
      </p>
    ),
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-paper-200 bg-paper">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <a
            href="/"
            className="font-display text-lg font-extrabold tracking-[-0.04em] text-ink-900"
          >
            barrakinha
          </a>
          <a
            href="/"
            className="text-[13px] text-ink-600 transition-colors hover:text-ink-900"
          >
            Voltar para o site
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-14 lg:px-8 lg:pt-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-paper-200" aria-hidden="true" />
          <span className="eyebrow">Legal</span>
        </div>

        <h1 className="mt-5 max-w-3xl text-[34px] font-extrabold leading-[0.98] tracking-[-0.04em] text-ink-900 text-balance sm:text-display-sm">
          Política de privacidade
        </h1>

        <p className="mt-4 text-[14px] text-sand-500">
          Última atualização: {LAST_UPDATED}
        </p>

        <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-ink-600 text-pretty">
          Aqui explicamos, sem juridiquês, quais dados a Barrakinha coleta
          no site e nos apps, para que servem e como você pode controlá-los.
        </p>

        <nav aria-label="Seções desta política" className="mt-10 max-w-2xl border-t border-paper-200 pt-6">
          <span className="eyebrow">Nesta página</span>
          <ol className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex gap-3 text-[14px] text-ink-600 transition-colors hover:text-ink-900"
                >
                  <span className="numeric shrink-0 text-ember-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-4 max-w-2xl">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 border-t border-paper-200 py-9 last:border-b"
            >
              <span className="numeric text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-700">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-3 font-display text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-ink-900 sm:text-[26px]">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-600 text-pretty">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
