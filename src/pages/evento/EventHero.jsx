import React, { useEffect, useRef, useState } from 'react';
import { Store as StoreIcon } from 'lucide-react';
import { SCALLOP_RADIUS } from './lib.js';

/* Recorte de meias-luas reais na base da foto da barraca, idêntico ao
   `ScallopEdge` de `ProductHero.tsx` no app mobile, contido em 100% da largura
   para nunca causar overflow horizontal. */
export function ScallopEdge({ color = '#FFFFFF' }) {
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

/* Logo da barraca no círculo do canto. Se a foto falhar, o ícone de loja na
   cor da barraca segura o lugar. */
function StoreLogoFloat({ src }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="ev-brand-float ev-brand-float--store">
      {failed ? (
        <span className="ev-brand-fallback" aria-hidden="true">
          <StoreIcon size={26} strokeWidth={1.8} />
        </span>
      ) : (
        /* Decorativa: o nome da barraca vem logo abaixo, no título. */
        <img src={src} alt="" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

/**
 * Capa da página. `photo` é a imagem de fundo: o banner do evento quando a
 * barraca configurou um, senão a própria foto da barraca. `logo` (só com
 * banner) vai para o círculo do canto no lugar do selo da Barrakinha.
 */
export function EventHero({ photo, logo = null, loading = false }) {
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
            <StoreIcon size={84} strokeWidth={1.3} style={{ color: 'var(--ev-on-brasa)' }} />
          </div>
        )}

        {loading ? null : logo ? (
          <StoreLogoFloat key={logo} src={logo} />
        ) : (
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
        )}

        <ScallopEdge color="#FFFFFF" />
      </div>
    </div>
  );
}
