import {
  normalizeSlug,
  renderNotFoundPage,
  renderUnavailablePage,
  renderStorePage,
} from '../_lib/store-page.js';

/*
  barrakinha.com.br/b/<slug> → esta função (rewrite no vercel.json).

  BARRAKINHA_API_URL permite apontar uma pré-visualização para a API de
  desenvolvimento; sem ela, vale a de produção.
*/
const API_URL = (
  process.env.BARRAKINHA_API_URL || 'https://api.barrakinha.com.br'
).replace(/\/+$/, '');

// A barraca muda pouco (nome, foto, aberta/fechada). Cinco minutos de
// cache na CDN seguram a carga de um link que viraliza num grupo, e o
// stale-while-revalidate evita que alguém espere a API depois disso.
const CACHE_FOUND = 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400';
const CACHE_NOT_FOUND = 'public, max-age=0, s-maxage=60';

async function fetchStore(slug) {
  const response = await fetch(`${API_URL}/public/store/${slug}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`API respondeu ${response.status} para /public/store/${slug}`);
  }
  return response.json();
}

function send(res, status, html, cache) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', cache);
  res.end(html);
}

export default async function handler(req, res) {
  const raw = req.query?.slug;
  const slug = normalizeSlug(Array.isArray(raw) ? raw[0] : raw);

  if (!slug) {
    return send(res, 404, renderNotFoundPage(raw), CACHE_NOT_FOUND);
  }

  try {
    const store = await fetchStore(slug);
    if (!store) {
      return send(res, 404, renderNotFoundPage(slug), CACHE_NOT_FOUND);
    }
    return send(res, 200, renderStorePage(store), CACHE_FOUND);
  } catch (error) {
    // API fora do ar: não guarda em cache, para a próxima visita tentar de novo.
    console.error('[b/slug]', error);
    return send(res, 503, renderUnavailablePage(slug), 'no-store');
  }
}
