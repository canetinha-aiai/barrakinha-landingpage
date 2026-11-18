import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BellRing,
  Check,
  ChefHat,
  ChevronRight,
  CupSoda,
  Ellipsis,
  ImageOff,
  Minus,
  Moon,
  Package,
  Plus,
  Sandwich,
  ShoppingBag,
  SlidersHorizontal,
  Store as StoreIcon,
  UtensilsCrossed,
  X,
} from 'lucide-react';

const MAX_EVENT_ITEMS = 5;
const POLL_INTERVAL_MS = 4000;
/* Pronto: a senha ainda vale no balcão, mas não precisa abrir direto nela. */
const READY_STATUSES = new Set(['READY']);
/* Encerrado: retirado ou cancelado, o pedido salvo pode ser descartado. */
const FINISHED_STATUSES = new Set(['COMPLETED', 'CANCELLED']);

/* Totem: volta ao início sozinho após a senha e após um tempo sem toque. */
const TOTEM_SUCCESS_MS = 15000;
const TOTEM_IDLE_MS = 60000;

/* Lê o pedido salvo descartando os que já foram retirados/cancelados. */
function readStoredOrder(key) {
  const order = safeReadStorage(key);
  if (order && FINISHED_STATUSES.has(order.status)) {
    safeWriteStorage(key, null);
    return null;
  }
  return order;
}
const SCALLOP_RADIUS = 12;

const API_BASE = (
  import.meta.env.VITE_BARRAKINHA_API_URL || 'https://api-dev.barrakinha.com.br'
).replace(/\/+$/, '');

/* Mesmas categorias e ícones reais de `ProductCategory` no backend e no app
   (`useVendorDetails.ts` + `vendor-details/index.tsx`). */
const CATEGORY_ORDER = ['food', 'snack', 'drink', 'other'];

const CATEGORY_META = {
  food: { label: 'Comidas', Icon: UtensilsCrossed },
  snack: { label: 'Lanches', Icon: Sandwich },
  drink: { label: 'Bebidas', Icon: CupSoda },
  other: { label: 'Outros', Icon: Ellipsis },
};

/* Dados apenas para o preview local (`/e/cafejoao` ou dev sem backend). */
const DEMO_STORE = {
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

function parseRouteFromLocation() {
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

function formatPhoneMask(raw) {
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

function toE164Brazil(masked) {
  const digits = String(masked || '').replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
  return null;
}

function safeReadStorage(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeWriteStorage(key, value) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Continua em memória se o navegador bloquear storage. */
  }
}

/* Recorte de meias-luas reais na base da foto da barraca, idêntico ao
   `ScallopEdge` de `ProductHero.tsx` no app mobile, contido em 100% da largura
   para nunca causar overflow horizontal. */
function ScallopEdge({ color = '#FFFFFF' }) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(760);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => setWidth(Math.max(280, Math.ceil(el.getBoundingClientRect().width)));
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const unit = SCALLOP_RADIUS * 2;
  const count = Math.ceil(width / unit) + 1;
  let d = 'M0 0';
  for (let i = 0; i < count; i += 1) {
    const x = i * unit;
    d += ` A${SCALLOP_RADIUS} ${SCALLOP_RADIUS} 0 0 0 ${x + unit} 0`;
  }
  d += ` L${count * unit} ${SCALLOP_RADIUS + 2} L0 ${SCALLOP_RADIUS + 2} Z`;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1,
        height: SCALLOP_RADIUS + 2,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <svg
        width="100%"
        height={SCALLOP_RADIUS + 2}
        viewBox={`0 0 ${ width } ${SCALLOP_RADIUS + 2}`}
        preserveAspectRatio="xMinYMin slice"
        style={{ display: 'block' }}
      >
        <path d={d} fill={color} />
      </svg>
    </div>
  );
}

function EventHero({ photo, loading = false }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const hasPhoto = Boolean(photo) && !failed;
  /* Skeleton enquanto a barraca carrega ou a foto ainda não chegou. */
  const showSkeleton = loading || (hasPhoto && !loaded);

  return (
    <div className="ev-shell ev-hero-shell">
      <div className={`ev-hero${showSkeleton ? ' ev-hero--loading' : ''}`} aria-busy={showSkeleton}>
        {showSkeleton && <div className="ev-hero-skeleton" aria-hidden="true" />}
        {loading ? null : hasPhoto ? (
          <>
            <img
              ref={(el) => {
                /* Foto já em cache: o onLoad pode ter disparado antes do React ouvir. */
                if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
              }}
              src={photo}
              alt=""
              {...{ fetchpriority: 'high' }}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={`ev-hero-img${loaded ? ' is-loaded' : ''}`}
            />
            <div className="ev-hero-vignette" />
          </>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--ev-brasa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StoreIcon size={84} strokeWidth={1.3} color="#FFFFFF" />
          </div>
        )}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="ev-brand-float ev-pressable"
          aria-label="Conhecer a Barrakinha"
          title="Conhecer a Barrakinha"
        >
          <img
            src="/logo/barrakinha-logo.svg"
            alt="Barrakinha"
            width={48}
            height={48}
            style={{ width: 48, height: 48, display: 'block' }}
          />
        </a>

        <ScallopEdge color="#FFFFFF" />
      </div>
    </div>
  );
}

function BarrakinhaPromoFooter() {
  return (
    <footer className="ev-promo-footer">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="ev-promo-link ev-pressable"
      >
        <img
          src="/logo/barrakinha-logo.svg"
          alt=""
          width={24}
          height={24}
          style={{ width: 24, height: 24, display: 'block', flexShrink: 0 }}
        />
        <span>
          Feito com <strong>Barrakinha</strong> · Conheça o app
        </span>
        <ChevronRight size={14} strokeWidth={2.2} />
      </a>
    </footer>
  );
}

function ProductPhoto({ src, dim = false, fallbackSize = 22 }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: dim ? 0.45 : 1 }}
      />
    );
  }

  return <ImageOff size={fallbackSize} color="#8A7E75" style={{ opacity: dim ? 0.5 : 1 }} />;
}

function QuantityStepper({
  value,
  onChange,
  canIncrement = true,
  surface = 'white',
  floating = false,
  productName,
}) {
  return (
    <div
      className={`ev-stepper ${surface === 'sunken' ? 'ev-stepper--sunken' : ''} ${
        floating ? 'ev-stepper--floating' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label={`Diminuir quantidade de ${productName}`}
        className="ev-stepper-btn ev-pressable"
      >
        <Minus size={floating ? 15 : 17} strokeWidth={2.2} />
      </button>

      <span className="ev-stepper-val" aria-label={`Quantidade ${value}`}>
        {value}
      </span>

      <button
        type="button"
        disabled={!canIncrement}
        onClick={() => onChange(value + 1)}
        aria-label={`Aumentar quantidade de ${productName}`}
        className="ev-stepper-btn ev-stepper-btn--inc ev-pressable"
      >
        <Plus size={floating ? 15 : 17} strokeWidth={2.4} />
      </button>
    </div>
  );
}

/* Trilho horizontal fiel ao `ProgressRail.tsx`, 100% genérico para qualquer
   barraca e sem nenhum símbolo de pagamento/cifrão (`Check -> ChefHat -> BellRing`). */
function EventProgressRail({ isReady }) {
  const steps = [
    { key: 'sent', label: 'Pedido feito', Icon: Check },
    { key: 'queue', label: 'Na fila', Icon: ChefHat },
    { key: 'ready', label: 'Pronto', Icon: BellRing },
  ];

  const activeColor = isReady ? '#147541' : '#EC5512';
  const fillFraction = isReady ? 1 : 0.5;

  return (
    <div
      className="ev-rail"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={isReady ? 3 : 2}
      aria-label={isReady ? 'Etapa 3 de 3: Pronto para retirar' : 'Etapa 2 de 3: Na fila de preparo'}
    >
      <div className="ev-rail-track-wrap">
        <div className="ev-rail-line-bg" />
        <div
          className="ev-rail-line-fill"
          style={{
            backgroundColor: activeColor,
            transform: `translateY(-50%) scaleX(${fillFraction})`,
          }}
        />
        <div className="ev-rail-nodes">
          {steps.map(({ key, Icon }, index) => {
            const filled = isReady || index <= 1;
            const pulsing = !isReady && index === 1;
            return (
              <div key={key}>
                <div
                  className={`ev-rail-node ${pulsing ? 'ev-pulse-node' : ''}`}
                  style={{
                    backgroundColor: filled ? activeColor : '#FFFFFF',
                    border: filled ? 'none' : '2px solid #DCD2C8',
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={2.4}
                    color={filled ? '#FFFFFF' : '#8A7E75'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ev-rail-labels">
        {steps.map(({ key, label }, index) => {
          const doneOrActive = isReady || index <= 1;
          return (
            <span
              key={key}
              className="ev-caption"
              style={{
                color: isReady && index === 2 ? '#147541' : doneOrActive ? '#1F1611' : '#8A7E75',
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Confirmação "Pedido confirmado" no celular, na mesma linguagem do totem:
 * brasa chapado, selo mostarda com check, a senha num cartão de papel em
 * Archivo larga. Toque em qualquer lugar sobe a cortina e revela a tela de
 * acompanhamento da senha.
 */
function OrderPlacedCelebration({ order, onComplete }) {
  const [lifting, setLifting] = useState(false);

  const dismiss = useCallback(() => {
    if (lifting) return;
    setLifting(true);
    setTimeout(() => onComplete?.(), 460);
  }, [lifting, onComplete]);

  const number = order?.displayNumber ?? 14;
  const digits = String(number).length;

  return (
    <div
      className={`ev-celebration ${lifting ? 'ev-celebration--lifting' : ''}`}
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          dismiss();
        }
      }}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
      aria-label={`Pedido confirmado! Sua senha é número ${number}. Toque na tela para acompanhar.`}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <div className="ev-celebration-stage">
        {/* Faíscas mostarda e creme subindo */}
        {[
          { left: '14%', top: '70%', size: 8, color: '#FFC23D', delay: '120ms' },
          { left: '84%', top: '66%', size: 7, color: '#FFFFFF', delay: '260ms' },
          { left: '22%', top: '22%', size: 6, color: '#FFE6D4', delay: '420ms' },
          { left: '78%', top: '20%', size: 9, color: '#FFC23D', delay: '180ms' },
          { left: '8%', top: '44%', size: 6, color: '#FFFFFF', delay: '520ms' },
          { left: '90%', top: '42%', size: 7, color: '#FFC23D', delay: '360ms' },
        ].map((s, idx) => (
          <div
            key={idx}
            className="ev-celebration-spark"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              background: s.color,
              animationDelay: s.delay,
            }}
          />
        ))}

        <div className="ev-celebration-content">
          <p className="ev-totem-kicker ev-celebration-kicker">
            <span className="ev-totem-check" aria-hidden="true">
              <Check size={20} strokeWidth={3.2} />
            </span>
            Pedido confirmado
          </p>

          <div className="ev-totem-ticket ev-celebration-ticket">
            <p className="ev-totem-ticket-label">Sua senha</p>
            <p
              className={`ev-totem-number ev-celebration-number ev-tabular${
                digits >= 3 ? ' ev-celebration-number--long' : ''
              }`}
            >
              <span className="ev-totem-hash" aria-hidden="true">#</span>
              {number}
            </p>
            {order?.storeName ? (
              <p className="ev-celebration-store">{order.storeName}</p>
            ) : null}
          </div>

          <p className="ev-celebration-note">
            Avisamos no seu WhatsApp assim que ficar pronto no balcão.
          </p>

          <span className="ev-celebration-cta">Toque para acompanhar</span>
        </div>
      </div>
    </div>
  );
}

/* Tela de sucesso do totem: só a senha, sem acompanhamento.
   Feita para ser lida a alguns passos de distância: fundo brasa chapado,
   a senha num cartão de papel em Archivo larga, a instrução em branco e
   uma barra que mostra quanto falta para a tela voltar ao início. */
function TotemSuccess({ order, storeName, durationMs, onDone }) {
  const totalSeconds = Math.round(durationMs / 1000);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    const startedAt = Date.now();
    const t = setInterval(() => {
      const left = Math.max(0, Math.ceil((durationMs - (Date.now() - startedAt)) / 1000));
      setSecondsLeft(left);
    }, 250);
    return () => clearInterval(t);
  }, [durationMs]);

  /* A barra do navegador acompanha o brasa enquanto a senha está na tela. */
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return undefined;
    const previous = meta.getAttribute('content');
    meta.setAttribute('content', '#EC5512');
    return () => meta.setAttribute('content', previous);
  }, []);

  const name = storeName || order.storeName;
  const digits = String(order.displayNumber ?? '').length;

  return (
    <main className="ev-totem-success" role="status" aria-live="polite">
      <header className="ev-totem-brand">
        <span className="ev-totem-brand-mark">
          <img src="/logo/barrakinha-logo-branca.svg" alt="" width={36} height={36} />
          <span className="ev-totem-brand-name">Barrakinha</span>
        </span>
        {name ? <span className="ev-totem-brand-store">{name}</span> : null}
      </header>

      <div className="ev-totem-center">
        <p className="ev-totem-kicker">
          <span className="ev-totem-check" aria-hidden="true">
            <Check size={22} strokeWidth={3.2} />
          </span>
          Pedido confirmado
        </p>

        <div className="ev-totem-ticket">
          <p className="ev-totem-ticket-label">Sua senha</p>
          <p
            className={`ev-totem-number ev-tabular${
              digits >= 4 ? ' ev-totem-number--xlong' : digits === 3 ? ' ev-totem-number--long' : ''
            }`}
            aria-label={`Sua senha é ${order.displayNumber}`}
          >
            <span className="ev-totem-hash" aria-hidden="true">#</span>
            {order.displayNumber}
          </p>
        </div>

        <p className="ev-totem-hint">Aguarde ser chamado no balcão.</p>
      </div>

      <footer className="ev-totem-actions">
        <button type="button" className="ev-btn ev-totem-btn ev-pressable" onClick={onDone}>
          Fazer novo pedido
        </button>
        <div className="ev-totem-timer">
          <div className="ev-totem-timer-track" aria-hidden="true">
            <div
              className="ev-totem-timer-fill"
              style={{ animationDuration: `${durationMs}ms` }}
            />
          </div>
          <p className="ev-totem-timer-text">
            A tela volta ao início em <span className="ev-tabular">{secondsLeft}s</span>
          </p>
        </div>
      </footer>
    </main>
  );
}

export default function Evento() {
  const initialRoute = useMemo(() => parseRouteFromLocation(), []);
  const [slug] = useState(initialRoute.slug);
  const [isDemoMode, setIsDemoMode] = useState(initialRoute.forceDemo);
  const [devMenuOpen, setDevMenuOpen] = useState(false);

  const [store, setStore] = useState(initialRoute.forceDemo ? DEMO_STORE : null);
  const [loadingStore, setLoadingStore] = useState(!initialRoute.forceDemo);
  const [loadError, setLoadError] = useState(false);

  const [cart, setCart] = useState({});
  const [limitFeedback, setLimitFeedback] = useState(false);

  const isTotem = initialRoute.mode === 'totem';
  /* No totem nada do cliente anterior é lido nem salvo. */
  const savedGuest = useMemo(
    () => (isTotem ? {} : safeReadStorage('barrakinha:event-guest') || {}),
    [isTotem],
  );
  const [guestName, setGuestName] = useState(savedGuest.name || '');
  const [guestPhone, setGuestPhone] = useState(savedGuest.phone || '');
  const [note, setNote] = useState('');

  const [touched, setTouched] = useState({ name: false, phone: false });
  const [edited, setEdited] = useState({
    name: Boolean(savedGuest.name),
    phone: Boolean(savedGuest.phone),
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [celebratingOrder, setCelebratingOrder] = useState(null);

  const storageOrderKey = `barrakinha:event-order:v2:${slug}`;
  const [activeOrder, setActiveOrder] = useState(() =>
    isTotem ? null : readStoredOrder(storageOrderKey),
  );
  /* Pedido concluído no totem, exibido só até a tela voltar ao início. */
  const [totemOrder, setTotemOrder] = useState(null);
  /* Abre na senha só enquanto o pedido está na fila (ou via link ?pedido=).
     Pronto ou encerrado abre no cardápio; o aviso verde no topo leva à senha. */
  const [view, setView] = useState(() => {
    if (isTotem) return 'menu';
    if (initialRoute.orderToken) return 'ticket';
    const stored = readStoredOrder(storageOrderKey);
    return stored && !READY_STATUSES.has(stored.status) ? 'ticket' : 'menu';
  });

  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const idempotencyKeyRef = useRef(null);
  const limitTimerRef = useRef(null);
  const prevStatusRef = useRef(activeOrder?.status || null);

  const dialogTitleId = useId();
  const nameId = useId();
  const nameErrorId = useId();
  const phoneId = useId();
  const phoneHintId = useId();
  const phoneErrorId = useId();
  const noteId = useId();
  const noteHintId = useId();

  /* Mapa rápido de fotos do cardápio atual: garante que os itens da tela da
     senha sempre exibam a foto real do produto (igual `StoreOrders` no app). */
  const photoByProductId = useMemo(() => {
    const map = new Map();
    for (const p of store?.products || []) {
      if (p.photo) {
        map.set(p.id, p.photo);
        map.set(p.name, p.photo);
      }
    }
    return map;
  }, [store?.products]);

  const fetchEventStore = useCallback(async () => {
    if (initialRoute.forceDemo) {
      setStore(DEMO_STORE);
      setIsDemoMode(true);
      setLoadingStore(false);
      return;
    }

    setLoadingStore(true);
    setLoadError(false);
    try {
      const res = await fetch(`${API_BASE}/public/event/${encodeURIComponent(slug)}`, {
        headers: { accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStore(data);
      setIsDemoMode(false);
    } catch {
      if (import.meta.env.DEV) {
        setStore({ ...DEMO_STORE, slug });
        setIsDemoMode(true);
      } else {
        setLoadError(true);
      }
    } finally {
      setLoadingStore(false);
    }
  }, [initialRoute.forceDemo, slug]);

  useEffect(() => {
    fetchEventStore();
  }, [fetchEventStore]);

  /* Carrega pedido via deep-link ?pedido=<trackingToken>; sem link, atualiza o
     pedido salvo uma vez (ele pode ter ficado pronto/retirado com a aba fechada). */
  useEffect(() => {
    const fromLink = Boolean(initialRoute.orderToken);
    const token = initialRoute.orderToken || readStoredOrder(storageOrderKey)?.trackingToken;
    if (!token || initialRoute.forceDemo || isTotem) return undefined;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/public/event/orders/${encodeURIComponent(token)}`,
          { headers: { accept: 'application/json' } },
        );
        if (!res.ok || cancelled) return;
        const fresh = await res.json();
        if (cancelled) return;
        if (!fromLink && FINISHED_STATUSES.has(fresh.status)) {
          safeWriteStorage(storageOrderKey, null);
          setActiveOrder(null);
          setView('menu');
          return;
        }
        setActiveOrder((prev) => {
          const updated = { ...prev, ...fresh };
          safeWriteStorage(storageOrderKey, updated);
          return updated;
        });
        if (fromLink) setView('ticket');
        else if (READY_STATUSES.has(fresh.status)) setView('menu');
      } catch {
        /* Mantém estado local se estiver sem rede no momento. */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialRoute.forceDemo, initialRoute.orderToken, storageOrderKey, isTotem]);

  /* Fallback de light-dismiss para Safari (sem suporte nativo a <dialog closedby="any">). */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return undefined;

    const isOutside = (e) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    const onPointerDown = (e) => {
      pressedOutside = e.target === dialog && isOutside(e);
    };
    const onPointerUp = (e) => {
      if (pressedOutside && e.target === dialog && isOutside(e)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', onPointerDown);
    dialog.addEventListener('pointerup', onPointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', onPointerDown);
      dialog.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  /* Polling silencioso de 4s para a senha ativa quando ligado na API real. */
  useEffect(() => {
    if (isDemoMode || !activeOrder?.trackingToken) return undefined;
    if (FINISHED_STATUSES.has(activeOrder.status)) return undefined;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/public/event/orders/${encodeURIComponent(activeOrder.trackingToken)}`,
          { headers: { accept: 'application/json' } },
        );
        if (!res.ok) return;
        const fresh = await res.json();
        setActiveOrder((prev) => {
          const updated = { ...prev, ...fresh };
          safeWriteStorage(storageOrderKey, updated);
          return updated;
        });
      } catch {
        /* Em 4G instável, ignora falha isolada e tenta no próximo ciclo. */
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [activeOrder?.status, activeOrder?.trackingToken, isDemoMode, storageOrderKey]);

  useEffect(() => {
    if (prevStatusRef.current && prevStatusRef.current !== 'READY' && activeOrder?.status === 'READY') {
      navigator.vibrate?.([180, 80, 240]);
      setLiveAnnouncement(`Seu pedido número ${activeOrder.displayNumber} ficou pronto no balcão!`);
    }
    prevStatusRef.current = activeOrder?.status || null;
  }, [activeOrder?.displayNumber, activeOrder?.status]);

  /* Agrupamento idêntico a `useVendorDetails.ts`: Comidas, Lanches, Bebidas, Outros */
  const sections = useMemo(() => {
    const products = store?.products || [];
    const grouped = {};
    for (const product of products) {
      const rawCat = String(product.category || 'other').toLowerCase();
      const cat = CATEGORY_META[rawCat] ? rawCat : 'other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(product);
    }
    return CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0).map((cat) => ({
      category: cat,
      label: CATEGORY_META[cat].label,
      Icon: CATEGORY_META[cat].Icon,
      products: grouped[cat],
    }));
  }, [store?.products]);

  const totalItemsInCart = useMemo(
    () => Object.values(cart).reduce((sum, n) => sum + n, 0),
    [cart],
  );

  const cartItemsDetailed = useMemo(() => {
    const products = store?.products || [];
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const product = products.find((p) => p.id === id);
        return product
          ? { productId: id, name: product.name, photo: product.photo, quantity }
          : null;
      })
      .filter(Boolean);
  }, [cart, store?.products]);

  const setProductQuantity = (productId, nextQty) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const delta = nextQty - current;
      const currentTotal = Object.values(prev).reduce((sum, n) => sum + n, 0);

      if (delta > 0 && currentTotal + delta > MAX_EVENT_ITEMS) {
        setLimitFeedback(true);
        setLiveAnnouncement(`Limite de ${MAX_EVENT_ITEMS} itens por pedido atingido.`);
        clearTimeout(limitTimerRef.current);
        limitTimerRef.current = setTimeout(() => setLimitFeedback(false), 3400);
        return prev;
      }

      setLimitFeedback(false);
      const copy = { ...prev };
      if (nextQty <= 0) delete copy[productId];
      else copy[productId] = nextQty;
      return copy;
    });
  };

  const openCheckoutModal = () => {
    if (totalItemsInCart === 0) return;
    setSubmitError('');
    idempotencyKeyRef.current =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    dialogRef.current?.showModal();
  };

  const closeCheckoutModal = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.returnValue = '';
      dialogRef.current.close();
    }
  };

  const trimmedName = guestName.trim();
  const validE164Phone = toE164Brazil(guestPhone);
  const isNameValid = trimmedName.length >= 2;
  const isPhoneValid = Boolean(validE164Phone);
  const isFormValid = isNameValid && isPhoneValid && totalItemsInCart > 0;

  const showNameError = (submitAttempted || (touched.name && edited.name)) && !isNameValid;
  const showPhoneError = (submitAttempted || (touched.phone && edited.phone)) && !isPhoneValid;

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitAttempted(true);
    setSubmitError('');

    if (!isNameValid) {
      nameInputRef.current?.focus();
      return;
    }
    if (!isPhoneValid) {
      phoneInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    if (!isTotem) {
      safeWriteStorage('barrakinha:event-guest', { name: trimmedName, phone: guestPhone });
    }

    try {
      let createdOrder;

      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 260));
        const nextNum = activeOrder?.displayNumber ? activeOrder.displayNumber + 1 : 14;
        createdOrder = {
          trackingToken: `demo-${nextNum}`,
          displayNumber: nextNum,
          status: 'ACCEPTED',
          guestName: trimmedName,
          guestPhone,
          note: note.trim() || null,
          storeName: store?.name || 'Barraca',
          storePhoto: store?.photo || null,
          items: cartItemsDetailed,
          createdAt: new Date().toISOString(),
        };
      } else {
        const res = await fetch(`${API_BASE}/public/event/${encodeURIComponent(slug)}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKeyRef.current || '',
          },
          body: JSON.stringify({
            guestName: trimmedName,
            guestPhone: validE164Phone,
            note: note.trim() || undefined,
            idempotencyKey: idempotencyKeyRef.current,
            items: cartItemsDetailed.map(({ productId, quantity }) => ({ productId, quantity })),
          }),
        });

        if (!res.ok) {
          throw new Error('Não conseguimos enviar seu pedido agora. Confira a internet e tente de novo.');
        }

        const payload = await res.json();
        createdOrder = {
          trackingToken: payload.trackingToken,
          displayNumber: payload.displayNumber,
          status: payload.status || 'ACCEPTED',
          guestName: trimmedName,
          guestPhone,
          note: note.trim() || null,
          storeName: store?.name,
          storePhoto: store?.photo || null,
          items: (payload.items || cartItemsDetailed).map((item) => ({
            ...item,
            photo: item.photo || photoByProductId.get(item.productId) || photoByProductId.get(item.name) || null,
          })),
          createdAt: payload.createdAt || new Date().toISOString(),
        };
      }

      if (isTotem) {
        /* Totem: só mostra a senha; o formulário é limpo agora mesmo. */
        setTotemOrder(createdOrder);
        setGuestName('');
        setGuestPhone('');
        setTouched({ name: false, phone: false });
        setEdited({ name: false, phone: false });
        setCart({});
        setNote('');
        setSubmitAttempted(false);
        closeCheckoutModal();
        navigator.vibrate?.([35, 50, 80]);
        window.scrollTo({ top: 0 });
      } else {
        setActiveOrder(createdOrder);
        safeWriteStorage(storageOrderKey, createdOrder);
        if (!isDemoMode && createdOrder.trackingToken && typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('pedido', createdOrder.trackingToken);
          window.history.replaceState(null, '', url.toString());
        }
        setCart({});
        setNote('');
        setSubmitAttempted(false);
        closeCheckoutModal();
        navigator.vibrate?.([35, 50, 80]);
        setCelebratingOrder(createdOrder);
        setView('ticket');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setSubmitError(err.message || 'Falha de conexão. Tente confirmar novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (dialogRef.current?.open && totalItemsInCart === 0) {
      closeCheckoutModal();
    }
  }, [totalItemsInCart]);

  /* Totem: zera tudo para a próxima pessoa da fila. */
  const resetTotem = () => {
    setTotemOrder(null);
    setGuestName('');
    setGuestPhone('');
    setTouched({ name: false, phone: false });
    setEdited({ name: false, phone: false });
    setCart({});
    setNote('');
    setSubmitAttempted(false);
    setSubmitError('');
    closeCheckoutModal();
    window.scrollTo({ top: 0 });
  };
  const resetTotemRef = useRef(null);
  resetTotemRef.current = resetTotem;

  /* Totem: depois da senha, volta ao início sozinho. */
  useEffect(() => {
    if (!isTotem || !totemOrder) return undefined;
    const t = setTimeout(() => resetTotemRef.current?.(), TOTEM_SUCCESS_MS);
    return () => clearTimeout(t);
  }, [isTotem, totemOrder]);

  /* Totem: sem toque por um tempo, descarta o que estiver em andamento. */
  useEffect(() => {
    if (!isTotem) return undefined;
    let timer;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => resetTotemRef.current?.(), TOTEM_IDLE_MS);
    };
    const events = ['pointerdown', 'keydown', 'input'];
    events.forEach((ev) => window.addEventListener(ev, arm, true));
    arm();
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, arm, true));
    };
  }, [isTotem]);

  const triggerDemoScenario = (scenario) => {
    setDevMenuOpen(false);
    if (scenario === 'closed') {
      setStore((prev) => ({ ...(prev || DEMO_STORE), status: 'CLOSED' }));
      setView('menu');
      return;
    }

    setStore((prev) => ({ ...(prev || DEMO_STORE), status: 'OPEN' }));

    if (scenario === 'menu') {
      setView('menu');
      return;
    }

    const rawItems = activeOrder?.items?.length
      ? activeOrder.items
      : [
          {
            productId: 'demo-cap',
            name: 'Cappuccino Italiano',
            photo: '/demo-evento/cappuccino.jpg',
            quantity: 1,
          },
          {
            productId: 'demo-v60',
            name: 'Coado V60 · Microlote Caparaó',
            photo: '/demo-evento/v60.jpg',
            quantity: 1,
          },
        ];

    const hydratedItems = rawItems.map((item) => ({
      ...item,
      photo:
        item.photo ||
        photoByProductId.get(item.productId) ||
        photoByProductId.get(item.name) ||
        '/demo-evento/cappuccino.jpg',
    }));

    const baseOrder = {
      trackingToken: activeOrder?.trackingToken || 'demo-14',
      displayNumber: activeOrder?.displayNumber || 14,
      guestName: activeOrder?.guestName || guestName.trim() || 'Pedro',
      guestPhone: activeOrder?.guestPhone || guestPhone || '(27) 99999-9999',
      note: activeOrder?.note ?? 'Sem açúcar',
      storeName: store?.name || activeOrder?.storeName || 'Café do João',
      storePhoto: store?.photo || activeOrder?.storePhoto || '/demo-evento/hero-cafe.jpg',
      items: hydratedItems,
    };

    const nextStatus = scenario === 'ready' ? 'READY' : 'ACCEPTED';
    const next = { ...baseOrder, status: nextStatus };
    setActiveOrder(next);
    safeWriteStorage(storageOrderKey, next);
    setView('ticket');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStoreOpen = store?.status === 'OPEN';
  const isOrderReady = activeOrder?.status === 'READY' || activeOrder?.status === 'COMPLETED';
  const productsCount = store?.products?.length || 0;
  const activeOrderItemsCount = (activeOrder?.items || []).reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <div style={{ minHeight: '100dvh', width: '100%', overflowX: 'clip', background: 'var(--ev-canvas)' }}>
      <div aria-live="polite" className="ev-sr-only">
        {liveAnnouncement}
      </div>

      {celebratingOrder && (
        <OrderPlacedCelebration
          order={celebratingOrder}
          onComplete={() => setCelebratingOrder(null)}
        />
      )}

      {/* Botão flutuante discreto só no modo preview local para testar estados */}
      {isDemoMode && !isTotem && (
        <div style={{ position: 'fixed', top: 14, right: 16, zIndex: 45 }}>
          <button
            type="button"
            onClick={() => setDevMenuOpen((v) => !v)}
            aria-label="Alternar estado de demonstração"
            aria-expanded={devMenuOpen}
            className="ev-pressable"
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              border: '1px solid rgba(31, 22, 17, 0.12)',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              color: '#1F1611',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(31, 22, 17, 0.12)',
            }}
          >
            <SlidersHorizontal size={17} strokeWidth={2.2} />
          </button>

          {devMenuOpen && (
            <div
              className="ev-enter"
              style={{
                position: 'absolute',
                top: 46,
                right: 0,
                width: 216,
                background: '#FFFFFF',
                borderRadius: 16,
                padding: 8,
                border: '1px solid var(--ev-line)',
                boxShadow: '0 14px 34px rgba(31, 22, 17, 0.16)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div
                className="ev-caption"
                style={{ color: 'var(--ev-ink-faint)', padding: '6px 10px 4px' }}
              >
                Simular tela
              </div>
              {[
                { id: 'menu', label: 'Cardápio aberto' },
                { id: 'waiting', label: 'Senha #14 · Na fila' },
                { id: 'ready', label: 'Senha #14 · Pronto!' },
                { id: 'closed', label: 'Barraca fechada' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => triggerDemoScenario(opt.id)}
                  className="ev-pressable"
                  style={{
                    textAlign: 'left',
                    padding: '9px 12px',
                    borderRadius: 10,
                    border: 0,
                    background: 'transparent',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1F1611',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TELA 1: CARDÁPIO DA BARRACA ================= */}
      {isTotem && totemOrder ? (
        <TotemSuccess
          order={totemOrder}
          storeName={store?.name}
          durationMs={TOTEM_SUCCESS_MS}
          onDone={resetTotem}
        />
      ) : view === 'menu' || !activeOrder ? (
        <>
          <EventHero key={store?.photo || 'sem-foto'} photo={store?.photo} loading={loadingStore} />

          <main className={`ev-shell ev-main ev-main--menu${totalItemsInCart > 0 ? ' ev-main--cart' : ''}`}>
            {loadingStore ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ width: '65%', height: 34, borderRadius: 10, background: 'var(--ev-sunken)' }} />
                <div style={{ width: '45%', height: 20, borderRadius: 8, background: 'var(--ev-sunken)' }} />
                <div style={{ height: 112, borderRadius: 16, background: 'var(--ev-sunken)', marginTop: 12 }} />
                <div style={{ height: 112, borderRadius: 16, background: 'var(--ev-sunken)' }} />
              </div>
            ) : loadError || !store ? (
              <section
                style={{
                  background: 'var(--ev-sunken)',
                  borderRadius: 16,
                  padding: 24,
                  textAlign: 'center',
                }}
              >
                <h1 className="ev-title1" style={{ margin: 0 }}>
                  Não deu para carregar o cardápio
                </h1>
                <p className="ev-footnote" style={{ margin: '8px 0 20px', fontSize: 15 }}>
                  Confira o sinal de internet e tente novamente.
                </p>
                <button
                  type="button"
                  onClick={fetchEventStore}
                  className="ev-btn ev-btn--md ev-btn--primary ev-pressable"
                >
                  Tentar de novo
                </button>
              </section>
            ) : (
              <>
                {/* Cabeçalho da barraca sem chips: status em linha tipográfica limpa */}
                <header style={{ marginBottom: 24 }}>
                  <h1 className="ev-display" style={{ margin: 0 }}>
                    {store.name}
                  </h1>

                  <div
                    className="ev-footnote"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 8,
                      fontSize: 14,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontWeight: 600,
                        color: isStoreOpen ? 'var(--ev-success)' : 'var(--ev-ink-soft)',
                      }}
                    >
                      <span
                        className="ev-status-dot"
                        style={{
                          background: isStoreOpen ? 'var(--ev-success)' : 'var(--ev-ink-faint)',
                        }}
                      />
                      {isStoreOpen ? 'Aberta agora' : 'Fechada agora'}
                    </span>

                    <span aria-hidden="true" style={{ color: 'var(--ev-line-strong)' }}>
                      ·
                    </span>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Package size={15} strokeWidth={2} color="#6E625A" />
                      {productsCount} {productsCount === 1 ? 'item no cardápio' : 'itens no cardápio'}
                    </span>
                  </div>
                </header>

                {/* Banner de pedido ativo (100% genérico e sem truncar texto) */}
                {activeOrder && (
                  <div style={{ marginBottom: 24 }} className="ev-enter">
                    <button
                      type="button"
                      onClick={() => {
                        setView('ticket');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="ev-pressable"
                      style={{
                        width: '100%',
                        border: 0,
                        borderRadius: 16,
                        padding: '14px 16px',
                        background: isOrderReady ? 'var(--ev-success-soft)' : 'var(--ev-sunken)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        textAlign: 'left',
                      }}
                    >
                      <div
                        className="ev-tabular"
                        style={{
                          minWidth: 44,
                          height: 44,
                          padding: '0 10px',
                          borderRadius: 999,
                          background: isOrderReady ? 'var(--ev-success)' : 'var(--ev-brasa)',
                          color: '#FFFFFF',
                          fontFamily: 'var(--ev-font-display)',
                          fontWeight: 800,
                          fontSize: 15,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        #{activeOrder.displayNumber}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 15,
                            lineHeight: 1.32,
                            color: isOrderReady ? 'var(--ev-success)' : 'var(--ev-ink)',
                          }}
                        >
                          {isOrderReady
                            ? 'Seu pedido já está pronto para retirar!'
                            : 'Seu pedido está na fila de preparo'}
                        </div>
                        <div
                          className="ev-footnote"
                          style={{
                            marginTop: 2,
                            color: isOrderReady ? 'var(--ev-success)' : 'var(--ev-ink-soft)',
                            opacity: isOrderReady ? 0.85 : 1,
                          }}
                        >
                          Toque para acompanhar sua senha
                        </div>
                      </div>

                      <ChevronRight
                        size={20}
                        strokeWidth={2.2}
                        color={isOrderReady ? '#147541' : '#6E625A'}
                        style={{ flexShrink: 0 }}
                      />
                    </button>
                  </div>
                )}

                {/* Aviso de barraca fechada: espelha `ClosedStoreNotice` */}
                {!isStoreOpen && (
                  <div
                    className="ev-enter"
                    style={{
                      background: 'var(--ev-warning-soft)',
                      borderRadius: 16,
                      padding: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      marginBottom: 26,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 999,
                        background: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Moon size={20} strokeWidth={2} color="#9A5A00" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ev-body-strong" style={{ color: '#1F1611' }}>
                        Essa barraca está fechada agora
                      </div>
                      <div className="ev-footnote" style={{ marginTop: 2, color: '#6E625A' }}>
                        Você pode ver o cardápio, mas só faz pedidos quando ela abrir.
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback suave caso tente passar de 5 itens */}
                {limitFeedback && (
                  <div
                    role="status"
                    className="ev-enter"
                    style={{
                      background: 'var(--ev-warning-soft)',
                      color: 'var(--ev-warning)',
                      borderRadius: 16,
                      padding: '12px 16px',
                      marginBottom: 20,
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Máximo de {MAX_EVENT_ITEMS} itens por pedido — assim a fila anda rápido para todo mundo.
                  </div>
                )}

                {/* Seções reais de `ProductCategory` (Comidas, Lanches, Bebidas, Outros) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {sections.map(({ category, label, Icon, products }) => (
                    <section key={category} aria-label={label}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 12,
                        }}
                      >
                        <Icon size={18} strokeWidth={2.2} color="#B03C0C" />
                        <h2 className="ev-title3" style={{ margin: 0, flex: 1 }}>
                          {label}
                        </h2>
                        <span className="ev-footnote">
                          {products.length} {products.length === 1 ? 'item' : 'itens'}
                        </span>
                      </div>

                      <div className="ev-products-grid">
                        {products.map((product) => {
                          const qty = cart[product.id] || 0;
                          const soldOut = product.available === false;
                          const canAddMore = totalItemsInCart < MAX_EVENT_ITEMS;

                          return (
                            <article key={product.id} className="ev-product-card">
                              <div className="ev-product-info">
                                <div>
                                  <h3
                                    className="ev-body-strong"
                                    style={{
                                      margin: 0,
                                      color: soldOut ? 'var(--ev-ink-soft)' : 'var(--ev-ink)',
                                    }}
                                  >
                                    {product.name}
                                  </h3>
                                  {product.description && (
                                    <p className="ev-footnote ev-product-desc">
                                      {product.description}
                                    </p>
                                  )}
                                </div>

                                {soldOut && (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span
                                      className="ev-footnote"
                                      style={{ fontWeight: 600, color: 'var(--ev-danger)' }}
                                    >
                                      Esgotado
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="ev-product-thumb-wrap">
                                <div className="ev-product-thumb">
                                  <ProductPhoto src={product.photo} dim={soldOut} />
                                </div>

                                {!soldOut &&
                                  (qty > 0 && isStoreOpen ? (
                                    <QuantityStepper
                                      floating
                                      value={qty}
                                      canIncrement={canAddMore}
                                      productName={product.name}
                                      onChange={(next) => setProductQuantity(product.id, next)}
                                    />
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={!isStoreOpen}
                                      onClick={() => setProductQuantity(product.id, 1)}
                                      aria-label={
                                        isStoreOpen
                                          ? `Adicionar ${product.name}`
                                          : `${product.name}: barraca fechada`
                                      }
                                      className="ev-add-fab ev-pressable"
                                      style={
                                        !isStoreOpen
                                          ? { background: 'var(--ev-line)', color: 'var(--ev-ink-faint)' }
                                          : undefined
                                      }
                                    >
                                      <Plus size={18} strokeWidth={2.6} />
                                    </button>
                                  ))}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </>
            )}

            <BarrakinhaPromoFooter />
          </main>

          {/* BANDEJA EM PÍLULA NOITE (idêntica a `CartBar.tsx` do app!) */}
          {isStoreOpen && totalItemsInCart > 0 && (
            <div className="ev-cartbar-dock">
              <button
                type="button"
                onClick={openCheckoutModal}
                className="ev-cartbar ev-pressable"
              >
                <div className="ev-cartbar-avatar">
                  {store?.photo ? (
                    <img src={store.photo} alt="" />
                  ) : (
                    <StoreIcon size={20} color="#FFFFFF" />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="ev-body-strong ev-tabular"
                    style={{ color: 'var(--ev-on-noite)' }}
                  >
                    {totalItemsInCart} {totalItemsInCart === 1 ? 'item' : 'itens'}
                  </div>
                  {store?.name && (
                    <div
                      className="ev-footnote"
                      style={{
                        color: 'var(--ev-on-noite)',
                        opacity: 0.72,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {store.name}
                    </div>
                  )}
                </div>

                <div className="ev-cartbar-cta">
                  <span>Ver bandeja</span>
                  <ShoppingBag size={15} strokeWidth={2.2} />
                </div>
              </button>
            </div>
          )}
        </>
      ) : (
        /* ================= TELA 2: ACOMPANHAMENTO DA SENHA (Genérica + Fotos + Sem Chips) ================= */
        <main className="ev-shell ev-main--ticket" style={{ padding: '20px 20px 56px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <button
              type="button"
              onClick={() => setView('menu')}
              aria-label="Voltar ao cardápio"
              className="ev-icon-btn ev-pressable"
            >
              <ArrowLeft size={20} strokeWidth={2.2} />
            </button>
          </div>

          <section className="ev-enter" aria-label={`Senha ${activeOrder.displayNumber}`}>
            {/* A senha num cartão de papel brasa, na mesma linguagem do totem */}
            <header className="ev-ticket-hero">
              <p className="ev-totem-ticket-label">Sua senha</p>
              <h1 className="ev-ticket-hero-number ev-tabular">
                <span className="ev-totem-hash" aria-hidden="true">#</span>
                <span className="ev-sr-only">Senha </span>
                {activeOrder.displayNumber}
              </h1>
              <p className="ev-footnote" style={{ margin: '6px 0 0', fontSize: 14 }}>
                <strong style={{ color: 'var(--ev-ink)', fontWeight: 600 }}>
                  {activeOrderItemsCount} {activeOrderItemsCount === 1 ? 'item' : 'itens'}
                </strong>
                {' · '}
                {activeOrder.guestName}
                {activeOrder.guestPhone ? ` · ${activeOrder.guestPhone}` : ''}
              </p>
            </header>

            {/* Card principal do trilho (ProgressRail) — 100% genérico para qualquer barraca */}
            <div
              style={{
                background: isOrderReady ? 'var(--ev-success-soft)' : 'var(--ev-sunken)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                transition: 'background-color 240ms ease',
              }}
            >
              <div>
                <h2
                  className="ev-title3"
                  style={{
                    margin: 0,
                    fontSize: 18,
                    color: isOrderReady ? 'var(--ev-success)' : 'var(--ev-ink)',
                  }}
                >
                  {isOrderReady ? 'Pronto para retirar!' : 'Seu pedido entrou na fila'}
                </h2>
                <p
                  className="ev-footnote"
                  style={{
                    margin: '4px 0 0',
                    fontSize: 14,
                    color: isOrderReady ? 'var(--ev-success)' : 'var(--ev-ink-soft)',
                  }}
                >
                  {isOrderReady ? (
                    <>
                      É só ir até a barraca e informar a senha{' '}
                      <strong className="ev-tabular">#{activeOrder.displayNumber}</strong>.
                    </>
                  ) : (
                    'Pode aproveitar o evento tranquilo — mandamos um WhatsApp assim que ficar pronto.'
                  )}
                </p>
              </div>

              <EventProgressRail isReady={isOrderReady} />
            </div>

            {/* Seção Barraca */}
            <div style={{ marginTop: 24 }}>
              <h3 className="ev-title3" style={{ margin: '0 0 10px' }}>
                Barraca
              </h3>
              <button
                type="button"
                onClick={() => setView('menu')}
                className="ev-pressable"
                style={{
                  width: '100%',
                  border: 0,
                  background: 'var(--ev-sunken)',
                  borderRadius: 16,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    overflow: 'hidden',
                    background: 'var(--ev-brasa-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {store?.photo || activeOrder.storePhoto ? (
                    <img
                      src={store?.photo || activeOrder.storePhoto}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <StoreIcon size={20} color="#B03C0C" />
                  )}
                </div>
                <span className="ev-body-strong" style={{ flex: 1 }}>
                  {store?.name || activeOrder.storeName || 'Barraca'}
                </span>
                <ChevronRight size={18} color="#8A7E75" />
              </button>
            </div>

            {/* Seção Itens do Pedido com fotos resolvidas do produto (igual `OrderDetails` do app) */}
            <div style={{ marginTop: 24 }}>
              <h3 className="ev-title3" style={{ margin: '0 0 10px' }}>
                {activeOrderItemsCount === 1 ? '1 item' : `${activeOrderItemsCount} itens`}
              </h3>

              <div
                style={{
                  background: 'var(--ev-sunken)',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                {(activeOrder.items || []).map((item, idx) => {
                  const resolvedPhoto =
                    item.photo ||
                    photoByProductId.get(item.productId) ||
                    photoByProductId.get(item.name) ||
                    null;

                  return (
                    <div key={`${item.productId || item.name}-${idx}`}>
                      {idx > 0 && (
                        <div
                          style={{
                            height: 1,
                            marginLeft: 76,
                            background: 'var(--ev-line)',
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 10,
                            overflow: 'hidden',
                            background: 'var(--ev-line)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ProductPhoto src={resolvedPhoto} fallbackSize={20} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="ev-body-strong">
                            {item.quantity > 1 ? (
                              <span className="ev-tabular" style={{ color: 'var(--ev-brasa-text)' }}>
                                {item.quantity}×{' '}
                              </span>
                            ) : null}
                            {item.name}
                          </div>
                          <div className="ev-footnote" style={{ marginTop: 1 }}>
                            {item.quantity === 1 ? '1 unidade' : `${item.quantity} unidades`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {activeOrder.note && (
                  <>
                    <div style={{ height: 1, background: 'var(--ev-line)' }} />
                    <div style={{ padding: '12px 14px' }}>
                      <span className="ev-footnote">Observação: </span>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 13.5,
                          color: 'var(--ev-ink)',
                        }}
                      >
                        {activeOrder.note}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <button
                type="button"
                onClick={() => setView('menu')}
                className="ev-btn ev-btn--md ev-btn--tonal ev-pressable"
              >
                <span className="ev-btn-icon-badge" aria-hidden="true">
                  <Plus size={15} strokeWidth={2.7} />
                </span>
                <span>Fazer outro pedido</span>
              </button>
            </div>

            <BarrakinhaPromoFooter />
          </section>
        </main>
      )}

      {/* ================= SHEET NATIVO (<dialog>) DA BANDEJA + DADOS ================= */}
      <dialog
        ref={dialogRef}
        {...{ closedby: 'any' }}
        aria-labelledby={dialogTitleId}
        className="ev-sheet"
      >
        <form
          action={`${API_BASE}/public/event/${encodeURIComponent(slug)}/orders`}
          method="post"
          onSubmit={handleOrderSubmit}
          noValidate
          style={{
            padding: '10px 20px max(24px, env(safe-area-inset-bottom))',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              alignSelf: 'center',
              width: 36,
              height: 5,
              borderRadius: 999,
              background: 'var(--ev-line-strong)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h2 id={dialogTitleId} className="ev-title1" style={{ margin: 0 }}>
                Sua bandeja
              </h2>
              <p className="ev-footnote" style={{ margin: '4px 0 0', fontSize: 14 }}>
                Confira os itens e informe onde devemos avisar quando ficar pronto.
              </p>
            </div>

            <button
              type="button"
              onClick={closeCheckoutModal}
              aria-label="Fechar bandeja"
              className="ev-icon-btn ev-pressable"
            >
              <X size={19} strokeWidth={2.2} />
            </button>
          </div>

          {/* Lista editável da bandeja (sem preços) */}
          <div
            style={{
              background: 'var(--ev-sunken)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {cartItemsDetailed.map((item, idx) => (
              <div key={item.productId}>
                {idx > 0 && (
                  <div style={{ height: 1, marginLeft: 68, background: 'var(--ev-line)' }} />
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: 'var(--ev-line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ProductPhoto src={item.photo} fallbackSize={18} />
                  </div>

                  <div className="ev-body-strong" style={{ flex: 1, minWidth: 0, fontSize: 15 }}>
                    {item.name}
                  </div>

                  <QuantityStepper
                    value={item.quantity}
                    canIncrement={totalItemsInCart < MAX_EVENT_ITEMS}
                    productName={item.name}
                    onChange={(next) => setProductQuantity(item.productId, next)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Campos no estilo exato de `FormField.tsx` (100% genéricos e sem chips) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="ev-field">
              <label htmlFor={nameId} className="ev-field-label">
                Como podemos te chamar?
              </label>
              <input
                ref={nameInputRef}
                id={nameId}
                name="guestName"
                type="text"
                autoFocus
                required
                minLength={2}
                maxLength={60}
                autoComplete="name"
                enterKeyHint="next"
                value={guestName}
                aria-invalid={showNameError ? 'true' : 'false'}
                aria-describedby={showNameError ? nameErrorId : undefined}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setEdited((prev) => ({ ...prev, name: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                placeholder="Ex.: João"
                className={`ev-input ${showNameError ? 'ev-input--error' : ''}`}
              />
              {showNameError && (
                <p id={nameErrorId} className="ev-field-error">
                  Informe seu nome (pelo menos 2 letras) para identificarmos seu pedido.
                </p>
              )}
            </div>

            <div className="ev-field">
              <label htmlFor={phoneId} className="ev-field-label">
                WhatsApp para avisar quando ficar pronto
              </label>
              <input
                ref={phoneInputRef}
                id={phoneId}
                name="guestPhone"
                type="tel"
                inputMode="numeric"
                required
                autoComplete="tel-national"
                enterKeyHint="next"
                value={guestPhone}
                aria-invalid={showPhoneError ? 'true' : 'false'}
                aria-describedby={showPhoneError ? `${phoneHintId} ${phoneErrorId}` : phoneHintId}
                onChange={(e) => {
                  const { value, selectionStart } = e.target;
                  const onlyDigits = (v) => v.replace(/\D/g, '');
                  let nextDigits = onlyDigits(value);
                  // Backspace em cima de "(", ")", espaço ou "-" (no meio do
                  // número) não remove dígito; apaga o dígito anterior ao cursor.
                  if (
                    value.length < guestPhone.length &&
                    nextDigits === onlyDigits(guestPhone) &&
                    selectionStart != null
                  ) {
                    const digitsBefore = onlyDigits(value.slice(0, selectionStart)).length;
                    if (digitsBefore > 0) {
                      nextDigits =
                        nextDigits.slice(0, digitsBefore - 1) + nextDigits.slice(digitsBefore);
                    }
                  }
                  setGuestPhone(formatPhoneMask(nextDigits));
                  setEdited((prev) => ({ ...prev, phone: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                placeholder="(27) 99999-9999"
                className={`ev-input ev-tabular ${showPhoneError ? 'ev-input--error' : ''}`}
              />
              {showPhoneError ? (
                <p id={phoneErrorId} className="ev-field-error">
                  Digite um WhatsApp válido com DDD. Ex.: (27) 99999-9999.
                </p>
              ) : (
                <p id={phoneHintId} className="ev-field-hint">
                  Enviamos apenas uma mensagem quando seu pedido ficar pronto.
                </p>
              )}
            </div>

            <div className="ev-field">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor={noteId} className="ev-field-label">
                  Observação (opcional)
                </label>
                <span id={noteHintId} className="ev-field-hint ev-tabular">
                  {note.length}/120
                </span>
              </div>
              <input
                id={noteId}
                name="note"
                type="text"
                maxLength={120}
                enterKeyHint="done"
                value={note}
                aria-describedby={noteHintId}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex.: sem açúcar, sem cebola..."
                className="ev-input"
              />
            </div>
          </div>

          {submitError && (
            <p role="alert" className="ev-field-error" style={{ margin: 0 }}>
              {submitError}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 2 }}>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="ev-btn ev-btn--primary ev-pressable"
            >
              {isSubmitting ? 'Confirmando…' : 'Confirmar pedido'}
            </button>
            <p className="ev-footnote" style={{ margin: 0, textAlign: 'center' }}>
              Pedido sem cobrança — cortesia do evento.
            </p>
          </div>
        </form>
      </dialog>
    </div>
  );
}
