import React, { Suspense, lazy, useEffect, useState } from 'react';

/*
  Troca a captura do hero pelo celular 3D — só quando vale a pena.

  A captura (PhoneFrame) é a primeira pintura: é ela que sai no HTML
  pré-renderizado e que conta pro LCP. Este componente não desenha
  nada no servidor nem no primeiro render; depois que a página fica
  ociosa, ele confere se o aparelho aguenta e, se sim, baixa o pedaço
  3D (three.js + o .glb) e monta o canvas POR CIMA da captura, no
  mesmo lugar e tamanho, invisível. Quando o 3D desenha o primeiro
  quadro, os dois cruzam: o canvas aparece e a captura some, em 400ms.

  Liga só com:
  - WebGL disponível;
  - pelo menos 4 núcleos e, quando o navegador informa, 4 GB de RAM
    (celular de entrada fica na captura);
  - sem economia de dados e fora de 2G.
  Com "menos movimento" o 3D ainda aparece, mas parado de frente.

  Peso de quem liga: ~264 kB (gzip) de código e o .glb de 391 KB,
  comprimido com meshopt (era 1,57 MB). O decodificador do meshopt vem
  embutido no drei (three-stdlib) — nada é buscado em CDN.
*/
const Phone3D = lazy(() => import('@/components/Phone3D'));

function capable() {
  if (typeof window === 'undefined') return false;
  const nav = navigator;
  const conn = nav.connection;
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return false;
  if ((nav.hardwareConcurrency || 0) < 4) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    return false;
  }
  return true;
}

function whenIdle(fn) {
  const run = () =>
    'requestIdleCallback' in window
      ? window.requestIdleCallback(fn, { timeout: 3000 })
      : window.setTimeout(fn, 1200);
  if (document.readyState === 'complete') return run();
  window.addEventListener('load', run, { once: true });
  return undefined;
}

export function usePhone3D() {
  const [wanted, setWanted] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    whenIdle(() => {
      if (alive && capable()) setWanted(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return { wanted, ready, setReady };
}

const Phone3DUpgrade = ({ wanted, ready, onReady, still, screenshotSrc, className }) => {
  if (!wanted) return null;
  return (
    <Suspense fallback={null}>
      <Phone3D
        screenshotSrc={screenshotSrc}
        still={still}
        onReady={onReady}
        className={className}
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 400ms ease' }}
      />
    </Suspense>
  );
};

export default Phone3DUpgrade;
