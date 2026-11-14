import { normalizeSlug } from '../_lib/store-page.js';
import {
  buildFallbackOgElement,
  buildStoreOgElement,
  fetchPhotoDataUri,
  loadLogo,
  renderOgPng,
} from '../_lib/og-image.js';

/*
  Capa da prévia do link: barrakinha.com.br/b/<slug>/capa.png → esta
  função (rewrite no vercel.json). A URL termina em .png porque alguns
  leitores de prévia desconfiam de imagem sem extensão.
*/
const API_URL = (
  process.env.BARRAKINHA_API_URL || 'https://api.barrakinha.com.br'
).replace(/\/+$/, '');

// O WhatsApp guarda a prévia por conta própria; um dia de cache na CDN
// basta para nome ou foto novos aparecerem nos links compartilhados depois.
const CACHE_STORE = 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800';
const CACHE_FALLBACK = 'public, max-age=0, s-maxage=300';

async function fetchStore(slug) {
  const response = await fetch(`${API_URL}/public/store/${slug}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return null;
  return response.json();
}

function sendPng(res, png, cache) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', cache);
  res.end(png);
}

export default async function handler(req, res) {
  const raw = req.query?.slug;
  const slug = normalizeSlug(Array.isArray(raw) ? raw[0] : raw);

  try {
    const store = slug ? await fetchStore(slug) : null;
    if (store) {
      const [photoDataUri, logoDataUri] = await Promise.all([
        fetchPhotoDataUri(store.photo),
        loadLogo(),
      ]);
      const png = await renderOgPng(
        buildStoreOgElement({ name: store.name, photoDataUri, logoDataUri }),
      );
      return sendPng(res, png, CACHE_STORE);
    }
  } catch (error) {
    console.error('[og]', error);
  }

  // Sem barraca (ou API fora): capa só com a marca, para a prévia nunca
  // sair quebrada.
  try {
    const logoDataUri = await loadLogo();
    return sendPng(res, await renderOgPng(buildFallbackOgElement({ logoDataUri })), CACHE_FALLBACK);
  } catch (error) {
    console.error('[og] fallback', error);
    res.statusCode = 302;
    res.setHeader('Location', '/og.png');
    res.end();
  }
}
