/* Cores da barraca na página do evento.

   O vendedor escolhe só a cor primária e a secundária (no app, seção Eventos
   do Perfil). Daqui saem as variáveis `--ev-*` do evento.css que dependem
   delas, já com os tons derivados e o texto em cima de cada cor escolhido
   pelo contraste. Sem cor configurada nada é sobrescrito e a página fica com
   a paleta padrão da Barrakinha.

   - primária: tudo que hoje é brasa (botões, +, trilho, senha, telas de
     confirmação) e os tons claros dela (fundo da senha, botão tonal).
   - secundária: o que hoje é mostarda (selo de confirmado, "Ver bandeja" na
     barra escura, faíscas da comemoração). */

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };
/* --ev-ink / --ev-noite: texto escuro e fundo da barra da bandeja. */
const INK = { r: 0x1f, g: 0x16, b: 0x11 };

/* Contraste mínimo para texto normal (WCAG AA). */
const TEXT_CONTRAST = 4.5;
/* Abaixo disso o branco some na cor (botões em negrito, ícones): usa tinta. */
const ON_COLOR_WHITE_MIN = 3;

export function parseHexColor(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!HEX_COLOR.test(trimmed)) return null;
  const n = Number.parseInt(trimmed.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function toHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((c) => Math.round(c).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

const toRgbList = ({ r, g, b }) => [r, g, b].map((c) => Math.round(c)).join(', ');

/* Põe `amount` (0–1) de `other` em `color`, como um color-mix em sRGB. */
function mix(color, other, amount) {
  return {
    r: color.r + (other.r - color.r) * amount,
    g: color.g + (other.g - color.g) * amount,
    b: color.b + (other.b - color.b) * amount,
  };
}

function channel(value) {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance({ r, g, b }) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/* Leva `color` em direção a `towards` (preto ou branco), aos poucos, até ter
   `ratio` de contraste com `background`. Cor que já passa volta igual. */
function ensureContrast(color, background, ratio, towards) {
  let current = color;
  for (let step = 1; step <= 20 && contrastRatio(current, background) < ratio; step += 1) {
    current = mix(color, towards, step * 0.05);
  }
  return current;
}

function onColor(color) {
  return contrastRatio(WHITE, color) >= ON_COLOR_WHITE_MIN ? WHITE : INK;
}

function primaryVars(primary) {
  const soft = mix(primary, WHITE, 0.82);
  const on = onColor(primary);

  return {
    '--ev-brasa': toHex(primary),
    '--ev-brasa-rgb': toRgbList(primary),
    '--ev-brasa-pressed': toHex(mix(primary, BLACK, 0.12)),
    '--ev-on-brasa': toHex(on),
    '--ev-on-brasa-rgb': toRgbList(on),
    // O texto na cor da barraca fica sobre branco, wash e soft: garantir
    // contraste com o soft (o mais escuro dos três) cobre os outros.
    '--ev-brasa-text': toHex(ensureContrast(primary, soft, TEXT_CONTRAST, BLACK)),
    '--ev-brasa-soft': toHex(soft),
    '--ev-brasa-soft-rgb': toRgbList(soft),
    '--ev-brasa-soft-pressed': toHex(mix(primary, WHITE, 0.74)),
    '--ev-brasa-wash': toHex(mix(primary, WHITE, 0.93)),
  };
}

function secondaryVars(secondary) {
  return {
    '--ev-mostarda': toHex(secondary),
    '--ev-on-mostarda': toHex(onColor(secondary)),
    // "Ver bandeja" fica sobre a barra escura (noite): clareia se precisar.
    '--ev-cartbar-accent': toHex(ensureContrast(secondary, INK, TEXT_CONTRAST, WHITE)),
  };
}

/**
 * Tema da página a partir das cores da barraca (`#RRGGBB` ou null).
 *
 * `style`: variáveis CSS para o contêiner da página (vazio = paleta padrão).
 * `themeColor`: cor da barra do navegador nas telas de fundo primário.
 * `onPrimaryIsDark`: o texto sobre a primária é escuro (logo branca some).
 */
export function buildEventTheme(primaryColor, secondaryColor) {
  const primary = parseHexColor(primaryColor);
  const secondary = parseHexColor(secondaryColor);

  return {
    style: {
      ...(primary ? primaryVars(primary) : {}),
      ...(secondary ? secondaryVars(secondary) : {}),
    },
    themeColor: primary ? toHex(primary) : null,
    onPrimaryIsDark: primary ? onColor(primary) === INK : false,
  };
}

/* Cores salvas da última visita: a senha reaberta já nasce com elas, sem
   piscar na paleta padrão enquanto a barraca carrega. */
export function themeColorsFrom(store) {
  const primaryColor = parseHexColor(store?.primaryColor) ? store.primaryColor : null;
  const secondaryColor = parseHexColor(store?.secondaryColor) ? store.secondaryColor : null;
  return primaryColor || secondaryColor ? { primaryColor, secondaryColor } : null;
}
