import { useEffect, useState } from 'react';

/**
 * Assina uma media query e devolve se ela casa agora.
 *
 * O estado nasce já com o valor certo (`window.matchMedia` no
 * inicializador do `useState`, não num efeito depois do primeiro
 * render): a página é renderizada no cliente, então o valor está
 * disponível de imediato — e ler só no efeito faria todo componente
 * que decide layout por aqui montar primeiro na versão errada e
 * trocar num segundo quadro, que é exatamente o pulo visível que
 * queremos evitar no celular.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const mql = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);

    // Reconfere no efeito: entre o primeiro render e aqui a janela
    // pode ter mudado de tamanho (girar o aparelho, por exemplo).
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/*
  O corte é o mesmo `md` do Tailwind (768px), o breakpoint em que o
  header troca o menu de hambúrguer pela navegação inteira. Um só
  ponto de virada pra toda a página: se o menu virou desktop, o resto
  vira junto.
*/
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');

export default useMediaQuery;
