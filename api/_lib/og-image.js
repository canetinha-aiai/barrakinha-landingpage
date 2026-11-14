/*
  Capa da barraca para a prévia do link (1200×630): o laranja e o toldo
  da Barrakinha, a foto da barraca num círculo e o nome em Archivo larga.
  Sem selo nem pílula, para seguir a identidade da landing.

  Os elementos são objetos no formato do React ({ type, props }) porque
  a função não passa por JSX; o @vercel/og (Satori) aceita assim.
*/

import { readFile } from 'node:fs/promises';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const BRASA = '#EC5512';
const CREAM = '#FBF7F2';
const NIGHT = '#1F1611';
const BRASA_DEEP = '#C9440B';
const AWNING_HEIGHT = 86;
// Largura da coluna de texto: termina antes da logo do canto.
const TEXT_WIDTH = 520;
const STRIPE = 60;
const CORNER_LOGO = 136;
// Altura da faixa do conteúdo: do toldo até um pouco acima da logo do canto.
const CONTENT_HEIGHT = OG_HEIGHT - AWNING_HEIGHT - 70;

let fontsPromise;
let logoPromise;

/* A logo da Barrakinha (o selo com o carrinho) em branco, para o fundo laranja. */
export function loadLogo() {
  logoPromise ??= readFile(new URL('../_assets/logo-branca.svg', import.meta.url)).then(
    (data) => `data:image/svg+xml;base64,${data.toString('base64')}`,
  );
  return logoPromise;
}

function logo(logoDataUri, size) {
  return {
    type: 'img',
    props: { src: logoDataUri, width: size, height: size, style: { width: size, height: size } },
  };
}

export function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(new URL('../_fonts/Archivo_Expanded-ExtraBold.ttf', import.meta.url)),
    readFile(new URL('../_fonts/Archivo_SemiExpanded-Bold.ttf', import.meta.url)),
  ]).then(([display, body]) => [
    { name: 'Archivo Display', data: display, weight: 800, style: 'normal' },
    { name: 'Archivo Body', data: body, weight: 700, style: 'normal' },
  ]);
  return fontsPromise;
}

/*
  A foto é baixada aqui (e não pelo Satori) para que uma foto fora do ar
  vire só "sem foto" em vez de derrubar a imagem inteira.
*/
export async function fetchPhotoDataUri(url) {
  if (!url) return null;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return null;
    const type = response.headers.get('content-type') || 'image/jpeg';
    if (!/^image\/(png|jpe?g|webp|gif)/.test(type)) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${type};base64,${buffer.toString('base64')}`;
  } catch {
    return null;
  }
}

const el = (type, style, children, extra = {}) => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
});

function awning() {
  // Listras alternadas com a borda de meias-luas, como o toldo do app.
  const count = Math.ceil(OG_WIDTH / STRIPE) + 1;
  const stripes = Array.from({ length: count }, (_, i) =>
    el('div', {
      width: STRIPE,
      height: AWNING_HEIGHT,
      flexShrink: 0,
      backgroundColor: i % 2 === 0 ? CREAM : BRASA_DEEP,
      borderBottomLeftRadius: STRIPE / 2,
      borderBottomRightRadius: STRIPE / 2,
    }),
  );
  return el(
    'div',
    { position: 'absolute', top: 0, left: 0, width: OG_WIDTH + STRIPE, height: AWNING_HEIGHT },
    stripes,
  );
}

function nameFontSize(name) {
  const length = name.length;
  if (length <= 10) return 88;
  if (length <= 16) return 72;
  if (length <= 24) return 58;
  return 48;
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function buildStoreOgElement({ name, photoDataUri, logoDataUri }) {
  const safeName = String(name || 'Barraca').trim();
  const photoSize = 320;

  const photo = photoDataUri
    ? {
        type: 'img',
        props: {
          src: photoDataUri,
          width: photoSize,
          height: photoSize,
          style: { width: photoSize, height: photoSize, borderRadius: photoSize / 2, objectFit: 'cover' },
        },
      }
    : el(
        'div',
        {
          width: photoSize,
          height: photoSize,
          borderRadius: photoSize / 2,
          backgroundColor: NIGHT,
          color: CREAM,
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Archivo Display',
          fontSize: 120,
        },
        initials(safeName) || 'B',
      );

  return el(
    'div',
    {
      position: 'relative',
      width: OG_WIDTH,
      height: OG_HEIGHT,
      backgroundColor: BRASA,
    },
    [
      awning(),
      // A logo fala por si: fica no canto, sem o nome escrito do lado.
      el(
        'div',
        { position: 'absolute', left: OG_WIDTH - 40 - CORNER_LOGO, top: OG_HEIGHT - 32 - CORNER_LOGO },
        logo(logoDataUri, CORNER_LOGO),
      ),
      // Foto e texto centralizados na faixa entre o toldo e a linha da logo,
      // para o bloco não descer para a borda de baixo.
      el(
        'div',
        {
          position: 'absolute',
          left: 0,
          top: AWNING_HEIGHT,
          width: OG_WIDTH,
          height: CONTENT_HEIGHT,
          alignItems: 'center',
          padding: '0 72px',
          gap: 56,
        },
        [
          el(
            'div',
            {
              width: photoSize + 24,
              height: photoSize + 24,
              borderRadius: (photoSize + 24) / 2,
              backgroundColor: CREAM,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            },
            photo,
          ),
          el('div', { flexDirection: 'column', width: TEXT_WIDTH }, [
            el(
              'div',
              { fontFamily: 'Archivo Body', fontSize: 30, color: NIGHT, opacity: 0.8 },
              'Peça pelo app',
            ),
            el(
              'div',
              {
                fontFamily: 'Archivo Display',
                fontSize: nameFontSize(safeName),
                lineHeight: 1.02,
                letterSpacing: -1,
                color: CREAM,
                marginTop: 10,
                maxHeight: nameFontSize(safeName) * 1.02 * 4,
                overflow: 'hidden',
              },
              safeName,
            ),
          ]),
        ],
      ),
    ],
  );
}

/* Capa genérica (barraca não encontrada): só a marca, grande, no laranja. */
export function buildFallbackOgElement({ logoDataUri }) {
  return el(
    'div',
    {
      position: 'relative',
      width: OG_WIDTH,
      height: OG_HEIGHT,
      backgroundColor: BRASA,
      alignItems: 'center',
      justifyContent: 'center',
    },
    [
      awning(),
      el('div', { marginTop: AWNING_HEIGHT }, logo(logoDataUri, 400)),
    ],
  );
}

/* Satori desenha em SVG; o resvg converte para PNG, que é o que o WhatsApp aceita. */
export async function renderOgPng(element) {
  const [{ default: satori }, { Resvg }, fonts] = await Promise.all([
    import('satori'),
    import('@resvg/resvg-js'),
    loadFonts(),
  ]);
  const svg = await satori(element, { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}
