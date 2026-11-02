import { useEffect, useState } from 'react';

/*
  Os ingredientes de movimento da página, num lugar só.

  `EASE_OUT` é a mesma curva do `ease-out` do Tailwind (ver
  tailwind.config.js) e de `animate-enter`: tudo que entra na tela usa
  ela. Mola sem quique pra troca de estado; com quique curto só pra
  objeto que tem peso (pino, cartão que pousa).
*/
export const EASE_OUT = [0.23, 1, 0.32, 1];

export const SPRING_STATE = { type: 'spring', bounce: 0, duration: 0.45 };
export const SPRING_SOFT = { type: 'spring', stiffness: 150, damping: 20, mass: 0.4 };

/*
  Mouse de verdade (`hover: hover` + `pointer: fine`). Inclinação,
  ímã e paralaxe por ponteiro só existem aqui: no toque, o "hover" é
  disparado pelo próprio toque e o efeito vira tremida.

  No pré-render começa `false`, que é o estado parado — o mesmo que o
  celular vê.
*/
export function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return fine;
}
