import { CupSoda, Ellipsis, Sandwich, UtensilsCrossed } from 'lucide-react';

export const MAX_EVENT_ITEMS = 5;
export const POLL_INTERVAL_MS = 4000;
/* Pronto: a senha ainda vale no balcão, mas não precisa abrir direto nela. */
export const READY_STATUSES = new Set(['READY']);
/* Encerrado: retirado ou cancelado, o pedido salvo pode ser descartado. */
export const FINISHED_STATUSES = new Set(['COMPLETED', 'CANCELLED']);

/* Totem: volta ao início sozinho após a senha e após um tempo sem toque. */
export const TOTEM_SUCCESS_MS = 15000;
export const TOTEM_IDLE_MS = 60000;

/* Lê o pedido salvo descartando os que já foram retirados/cancelados. */
export function readStoredOrder(key) {
  const order = safeReadStorage(key);
  if (order && FINISHED_STATUSES.has(order.status)) {
    safeWriteStorage(key, null);
    return null;
  }
  return order;
}

export const SCALLOP_RADIUS = 12;

export const API_BASE = (
  import.meta.env.VITE_BARRAKINHA_API_URL || 'https://api-dev.barrakinha.com.br'
).replace(/\/+$/, '');

/* Mesmas categorias e ícones reais de `ProductCategory` no backend e no app
   (`useVendorDetails.ts` + `vendor-details/index.tsx`). */
export const CATEGORY_ORDER = ['food', 'snack', 'drink', 'other'];

export const CATEGORY_META = {
  food: { label: 'Comidas', Icon: UtensilsCrossed },
  snack: { label: 'Lanches', Icon: Sandwich },
  drink: { label: 'Bebidas', Icon: CupSoda },
  other: { label: 'Outros', Icon: Ellipsis },
};

/* Dados apenas para o preview local (`/e/cafejoao` ou dev sem backend). */
export const DEMO_STORE = {
  slug: 'cafejoao',
  name: 'Café do João',
  photo: '/demo-evento/hero-cafe.jpg',
  status: 'OPEN',
  products: [
    {
      id: 'demo-cap',
      name: 'Cappuccino Italiano',
      description: 'Espresso duplo encorpado, leite vaporizado bem cremoso e cacau 100% polvilhado na hora.',
      photo: '/demo-evento/cappuccino.jpg',
      category: 'drink',
      available: true,
    },
    {
      id: 'demo-latte',
      name: 'Latte Caramelo & Flor de Sal',
      description: 'Dose suave de grão especial com leite texturizado aveludado e toque de flor de sal.',
      photo: '/demo-evento/latte.jpg',
      category: 'drink',
      available: true,
    },
    {
      id: 'demo-v60',
      name: 'Coado V60 · Microlote Caparaó',
      description: 'Passado na hora. Notas sensoriais de chocolate meio amargo, rapadura e frutas amarelas.',
      photo: '/demo-evento/v60.jpg',
      category: 'drink',
      available: true,
    },
    {
      id: 'demo-tonica',
      name: 'Espresso Tônica com Laranja',
      description: 'Dose dupla de espresso extraído sobre água tônica bem gelada, gelo e casca de laranja Bahia.',
      photo: '/demo-evento/tonica.jpg',
      category: 'drink',
      available: true,
    },
    {
      id: 'demo-oat',
      name: 'Mocha Cremoso (Leite de Aveia)',
      description: 'Calda artesanal de chocolate belga, espresso e leite vegetal de aveia vaporizado.',
      photo: '/demo-evento/latte.jpg',
      category: 'drink',
      available: false,
    },
  ],
};

export function parseRouteFromLocation() {
  if (typeof window === 'undefined') {
    return { slug: 'cafejoao', orderToken: null, forceDemo: true, mode: 'cliente' };
  }
  const url = new URL(window.location.href);
  const match = url.pathname.match(/^\/e\/([^/]+)/i);
  const slugFromPath = match ? match[1].toLowerCase() : null;
  const slugFromQuery = url.searchParams.get('slug')?.toLowerCase() || null;
  const slug = slugFromPath || slugFromQuery || 'cafejoao';
  const orderToken = url.searchParams.get('pedido') || null;
  const forceDemo =
    !slugFromPath ||
    slug === 'demo' ||
    slug === 'cafejoao' ||
    url.searchParams.get('preview') === '1';
  /* /e/<code>/totem = totem de autoatendimento: sem dados salvos, sem acompanhamento. */
  const mode = /^\/e\/[^/]+\/totem\/?$/i.test(url.pathname) ? 'totem' : 'cliente';

  return { slug, orderToken, forceDemo, mode };
}

export function formatPhoneMask(raw) {
  const digits = String(raw || '').replace(/\D/g, '').slice(0, 11);
  // O traço só aparece quando já existe dígito depois dele. Se ele ficasse
  // no fim (ex.: "(62) 98133-"), o backspace apagaria só o traço e a máscara
  // o recolocaria na hora, travando o campo.
  if (digits.length > 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length > 0) {
    return `(${digits}`;
  }
  return '';
}

export function toE164Brazil(masked) {
  const digits = String(masked || '').replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
  return null;
}

export function safeReadStorage(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function safeWriteStorage(key, value) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Continua em memória se o navegador bloquear storage. */
  }
}
