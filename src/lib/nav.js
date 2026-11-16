/*
  Links entre as duas páginas (home e /vendedores).

  Os links do header, do rodapé e dos botões são endereços completos
  ("/#pra-quem-compra", "/vendedores"). Se o destino está nesta mesma
  página, a gente rola até ele com suavidade; se não está, o clique
  segue normal e o navegador troca de página.

  Devolve o seletor do destino (ex.: "#lista") quando ele está nesta
  página, ou null quando o clique deve navegar.
*/
export function samePageTarget(href) {
  if (typeof window === 'undefined') return null;
  const url = new URL(href, window.location.href);
  const here = (p) => p.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  if (here(url.pathname) !== here(window.location.pathname) || !url.hash) return null;
  return document.querySelector(url.hash) ? url.hash : null;
}

/* Clique num link: rola se o destino está aqui, senão deixa navegar. */
export function jump(event, href) {
  const target = samePageTarget(href);
  if (!target) return false;
  event.preventDefault();
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  return true;
}
