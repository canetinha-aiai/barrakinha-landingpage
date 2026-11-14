/*
  Página pública de uma barraca: barrakinha.com.br/b/<slug>.

  Fica numa função (e não no build estático) por causa da prévia do
  link: WhatsApp, Instagram e afins não rodam JavaScript, só leem as
  meta tags do HTML que chega. Para cada barraca aparecer com o próprio
  nome e foto, o HTML precisa sair do servidor já preenchido.

  A página não mostra o cardápio de propósito: o pedido é feito no app.
  Os botões dependem do aparelho, mas a escolha é feita no navegador
  (script no fim do <body>) e não aqui: assim o mesmo HTML serve para
  todo mundo e pode ficar em cache na CDN.
*/

export const SITE_URL = 'https://barrakinha.com.br';
export const ANDROID_PACKAGE = 'com.barrakinha.vendedor';
export const APP_SCHEME = 'barrakinha';

const SLUG_PATTERN = /^[abcdefghjkmnpqrstuvwxyz23456789]{6}$/;

export function normalizeSlug(raw) {
  const slug = String(raw ?? '').trim().toLowerCase();
  return SLUG_PATTERN.test(slug) ? slug : null;
}

/*
  O `referrer` é o que permite abrir a barraca logo depois de instalar:
  a Play Store guarda esse valor e o app lê na primeira abertura
  (expo-application, getInstallReferrerAsync).
*/
export function playStoreUrl(slug) {
  const referrer = encodeURIComponent(`slug=${slug}`);
  return `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&referrer=${referrer}`;
}

/*
  No Android, um link `intent://` abre o app se ele estiver instalado e,
  se não estiver, cai no `browser_fallback_url` (a Play Store com o
  referrer). No iPhone não existe isso: o esquema `barrakinha://` só
  funciona com o app instalado.
*/
export function androidIntentUrl(slug) {
  const fallback = encodeURIComponent(playStoreUrl(slug));
  return `intent://b/${slug}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

export function appSchemeUrl(slug) {
  return `${APP_SCHEME}://b/${slug}`;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return '';
  return tags
    .slice(0, 4)
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1))
    .join(' · ');
}

const STYLES = `
  :root {
    --brasa: #EC5512;
    --brasa-dark: #C9440B;
    --paper: #FBF7F2;
    --raised: #F4EEE7;
    --ink: #1D1611;
    --muted: #6B6560;
    --line: #E7DFD6;
    --open: #1E7A46;
    --open-bg: #E3F3E8;
    --closed: #8A5A00;
    --closed-bg: #FBEFD5;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    background: var(--paper);
    color: var(--ink);
    font-family: Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  .top {
    background: var(--brasa);
    color: #fff;
    padding: 20px 16px 24px;
    text-align: center;
  }
  .brand {
    font-family: Archivo, system-ui, sans-serif;
    font-stretch: 125%;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.02em;
    color: #fff;
    text-decoration: none;
  }
  .awning {
    height: 18px;
    background: repeating-linear-gradient(90deg, var(--brasa) 0 24px, #fff 24px 48px);
    -webkit-mask: radial-gradient(circle at 12px 0, #000 12px, transparent 12.5px) 0 0 / 24px 18px repeat-x;
            mask: radial-gradient(circle at 12px 0, #000 12px, transparent 12.5px) 0 0 / 24px 18px repeat-x;
    margin-top: -1px;
  }
  main {
    max-width: 440px;
    margin: 56px auto 0;
    padding: 0 16px 40px;
  }
  .card {
    background: #fff;
    border-radius: 24px;
    padding: 24px 20px;
    box-shadow: 0 12px 32px rgba(29, 22, 17, 0.08);
    text-align: center;
    position: relative;
  }
  .photo {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #fff;
    background: var(--raised);
    margin: -84px auto 12px;
    display: block;
    box-shadow: 0 6px 16px rgba(29, 22, 17, 0.12);
  }
  h1 {
    font-family: Archivo, system-ui, sans-serif;
    font-stretch: 112%;
    font-weight: 800;
    font-size: 28px;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 8px;
    overflow-wrap: anywhere;
  }
  .tags { color: var(--muted); font-size: 15px; margin: 0 0 14px; }
  .status {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600;
    padding: 6px 12px; border-radius: 999px;
  }
  .status::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
  .status.open { color: var(--open); background: var(--open-bg); }
  .status.closed { color: var(--closed); background: var(--closed-bg); }
  .lead { font-size: 16px; line-height: 1.5; margin: 20px 0 0; }
  .actions { display: grid; gap: 12px; margin-top: 24px; }
  .btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 54px; padding: 0 20px; border-radius: 16px;
    font: inherit; font-size: 17px; font-weight: 700;
    text-decoration: none; cursor: pointer; border: 0;
  }
  .btn-primary { background: var(--brasa); color: #fff; }
  .btn-primary:active { background: var(--brasa-dark); }
  .btn-secondary { background: var(--ink); color: #fff; }
  .soon {
    border: 1.5px dashed var(--line); color: var(--muted);
    border-radius: 16px; padding: 14px 16px; font-size: 15px; line-height: 1.4;
  }
  .hint { color: var(--muted); font-size: 14px; line-height: 1.5; margin: 18px 0 0; }
  .foot { text-align: center; margin-top: 24px; font-size: 14px; }
  .foot a { color: var(--muted); }
  /* Sem JavaScript tudo aparece; com ele, só o que serve para o aparelho. */
  html.js [data-show]:not(.on) { display: none; }
`;

const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,700..800&family=Figtree:wght@400;600;700&display=swap';

/*
  Escolhe os blocos por aparelho. `data-show` lista onde cada um aparece:
  android, ios ou desktop.
*/
const DEVICE_SCRIPT = `
(function () {
  var ua = navigator.userAgent || '';
  var device = /android/i.test(ua)
    ? 'android'
    : /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
      ? 'ios'
      : 'desktop';
  document.documentElement.classList.add('js');
  var blocks = document.querySelectorAll('[data-show]');
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].getAttribute('data-show').split(' ').indexOf(device) !== -1) {
      blocks[i].classList.add('on');
    }
  }
})();
`;

function layout({ title, description, image, url, body, status = 200 }) {
  const ogImage = image || `${SITE_URL}/og.png`;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#EC5512" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="noindex, follow" />
  <link rel="icon" type="image/png" href="/icon.png" />
  <link rel="apple-touch-icon" href="/icon.png" />
  ${status === 200 ? `<link rel="canonical" href="${escapeHtml(url)}" />` : ''}
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:site_name" content="Barrakinha" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta name="twitter:card" content="${image ? 'summary' : 'summary_large_image'}" />
  <meta name="twitter:site" content="@barrakinha_app" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="${FONTS}" />
  <style>${STYLES}</style>
</head>
<body>
  <header class="top"><a class="brand" href="${SITE_URL}/">barrakinha</a></header>
  <div class="awning" aria-hidden="true"></div>
  <main>
${body}
    <p class="foot"><a href="${SITE_URL}/">Conheça a Barrakinha</a></p>
  </main>
  <script>${DEVICE_SCRIPT}</script>
</body>
</html>`;
}

export function renderStorePage(store) {
  const slug = store.slug;
  const url = `${SITE_URL}/b/${slug}`;
  const name = escapeHtml(store.name);
  const tags = formatTags(store.tags);
  const status = store.isClosed
    ? '<span class="status closed">Fechada agora</span>'
    : '<span class="status open">Aberta agora</span>';

  const body = `    <section class="card">
      ${
        store.photo
          ? `<img class="photo" src="${escapeHtml(store.photo)}" alt="" width="112" height="112" />`
          : '<div class="photo" aria-hidden="true"></div>'
      }
      <h1>${name}</h1>
      ${tags ? `<p class="tags">${escapeHtml(tags)}</p>` : ''}
      ${status}
      <p class="lead">Os pedidos desta barraca são feitos pelo app da Barrakinha. Você pede pelo celular e retira na hora.</p>

      <div class="actions">
        <a class="btn btn-primary" data-show="android" href="${escapeHtml(androidIntentUrl(slug))}">Abrir no app</a>
        <a class="btn btn-secondary" data-show="android desktop" href="${escapeHtml(playStoreUrl(slug))}">Baixar na Google Play</a>

        <a class="btn btn-primary" data-show="ios" href="${escapeHtml(appSchemeUrl(slug))}">Abrir no app</a>
        <p class="soon" data-show="ios">O app para iPhone está chegando. Por enquanto, a Barrakinha está disponível só para Android.</p>
      </div>

      <p class="hint" data-show="android">Acabou de instalar? Abra o app e esta barraca já aparece. Se não aparecer, volte aqui e toque em <strong>Abrir no app</strong>.</p>
      <p class="hint" data-show="desktop">Abra este link no celular para fazer seu pedido.</p>
    </section>`;

  return layout({
    title: `${store.name} na Barrakinha`,
    description: 'Faça seu pedido pelo app da Barrakinha e retire na barraca.',
    image: store.photo,
    url,
    body,
  });
}

export function renderNotFoundPage(rawSlug) {
  return renderMessagePage({
    rawSlug,
    title: 'Barraca não encontrada',
    message:
      'Este link não leva a nenhuma barraca. Confira se ele foi copiado inteiro ou peça um link novo para quem te enviou.',
  });
}

export function renderUnavailablePage(rawSlug) {
  return renderMessagePage({
    rawSlug,
    title: 'Algo deu errado',
    message: 'Não conseguimos carregar esta barraca agora. Tente de novo em instantes.',
  });
}

function renderMessagePage({ rawSlug, title, message }) {
  const body = `    <section class="card">
      <h1>${escapeHtml(title)}</h1>
      <p class="lead">${escapeHtml(message)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="${SITE_URL}/">Ir para a Barrakinha</a>
      </div>
    </section>`;

  return layout({
    title: `${title} · Barrakinha`,
    description: 'Ache as barracas de comida de rua abertas perto de você.',
    url: `${SITE_URL}/b/${encodeURIComponent(String(rawSlug ?? ''))}`,
    body,
    status: 404,
  });
}
