import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight, Moon, Package, Plus, ShoppingBag, SlidersHorizontal, Store as StoreIcon } from 'lucide-react';
import { MAX_EVENT_ITEMS, POLL_INTERVAL_MS, READY_STATUSES, FINISHED_STATUSES, TOTEM_SUCCESS_MS, TOTEM_IDLE_MS, API_BASE, CATEGORY_ORDER, CATEGORY_META, DEMO_STORE, parseRouteFromLocation, safeReadStorage, safeWriteStorage, readStoredOrder } from './evento/lib.js';
import { EventHero } from './evento/EventHero.jsx';
import { BarrakinhaPromoFooter } from './evento/BarrakinhaPromoFooter.jsx';
import { ProductPhoto } from './evento/ProductPhoto.jsx';
import { EventProgressRail } from './evento/EventProgressRail.jsx';
import { OrderPlacedCelebration } from './evento/OrderPlacedCelebration.jsx';
import { TotemSuccess } from './evento/TotemSuccess.jsx';
import { ProductCard } from './evento/ProductCard.jsx';
import { CheckoutForm } from './evento/CheckoutForm.jsx';

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
  /* Nome/WhatsApp digitados vivem dentro de <CheckoutForm>; aqui fica só o
     último valor confirmado (para reabrir preenchido) e a chave que zera o form. */
  const guestRef = useRef({ name: savedGuest.name || '', phone: savedGuest.phone || '' });
  const [formKey, setFormKey] = useState(0);
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
  const idempotencyKeyRef = useRef(null);
  const limitTimerRef = useRef(null);
  const prevStatusRef = useRef(activeOrder?.status || null);

  const dialogTitleId = useId();
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

  const setProductQuantity = useCallback((productId, nextQty) => {
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
  }, []);

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

  const handleOrderSubmit = async ({ name, phone, e164, note }) => {
    if (isSubmitting) return;

    setSubmitError('');
    setIsSubmitting(true);
    if (!isTotem) {
      guestRef.current = { name, phone };
      safeWriteStorage('barrakinha:event-guest', { name, phone });
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
          guestName: name,
          guestPhone: phone,
          note: note || null,
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
            guestName: name,
            guestPhone: e164,
            note: note || undefined,
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
          guestName: name,
          guestPhone: phone,
          note: note || null,
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
        guestRef.current = { name: '', phone: '' };
        setFormKey((k) => k + 1);
        setCart({});
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
        setFormKey((k) => k + 1);
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
    guestRef.current = { name: '', phone: '' };
    setFormKey((k) => k + 1);
    setCart({});
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
      guestName: activeOrder?.guestName || guestRef.current.name || 'Pedro',
      guestPhone: activeOrder?.guestPhone || guestRef.current.phone || '(27) 99999-9999',
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
                        {products.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              qty={cart[product.id] || 0}
                              canAddMore={totalItemsInCart < MAX_EVENT_ITEMS}
                              isStoreOpen={isStoreOpen}
                              onQuantityChange={setProductQuantity}
                            />
                        ))}
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
        <CheckoutForm
          key={formKey}
          action={`${API_BASE}/public/event/${encodeURIComponent(slug)}/orders`}
          titleId={dialogTitleId}
          initialName={guestRef.current.name}
          initialPhone={guestRef.current.phone}
          cartItemsDetailed={cartItemsDetailed}
          totalItemsInCart={totalItemsInCart}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onQuantityChange={setProductQuantity}
          onClose={closeCheckoutModal}
          onSubmit={handleOrderSubmit}
        />
      </dialog>
    </div>
  );
}
