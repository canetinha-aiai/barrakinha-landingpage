import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Silhueta de rua, entre duas seções.
 *
 * É geometria, não ilustração: cada prédio é um `<rect>` com altura
 * diferente, na mesma técnica das listras do toldo (`BrandStripes`) —
 * formas simples empilhadas, não um traço desenhado à mão. É o registro
 * seguro: contorno livre de comida ou gente eu não desenho bem; barra
 * de gráfico eu desenho com precisão, porque é matemática.
 *
 * Fica no lugar de uma linha reta entre "Como funciona" e "Pra quem
 * vende" — as duas seções já trocavam de tom (paper-100 → paper) sem
 * nenhum elemento marcando a virada; agora a mudança de cor tem uma
 * forma em cima.
 */
const BUILDINGS = [
  { x: 0, w: 46, h: 16 },
  { x: 50, w: 30, h: 26 },
  { x: 84, w: 54, h: 12 },
  { x: 142, w: 34, h: 34 },
  { x: 180, w: 44, h: 18 },
  { x: 228, w: 26, h: 40 },
  { x: 258, w: 50, h: 14 },
  { x: 312, w: 38, h: 24 },
  { x: 354, w: 30, h: 30 },
  { x: 388, w: 52, h: 16 },
  { x: 444, w: 28, h: 36 },
  { x: 476, w: 44, h: 20 },
  { x: 524, w: 40, h: 28 },
  { x: 568, w: 32, h: 14 },
  { x: 604, w: 48, h: 32 },
  { x: 656, w: 36, h: 18 },
  { x: 696, w: 26, h: 38 },
  { x: 726, w: 50, h: 15 },
  { x: 780, w: 34, h: 27 },
  { x: 818, w: 44, h: 19 },
  { x: 866, w: 30, h: 33 },
  { x: 900, w: 54, h: 13 },
  { x: 958, w: 38, h: 29 },
  { x: 1000, w: 32, h: 21 },
  { x: 1036, w: 46, h: 35 },
  { x: 1086, w: 40, h: 16 },
  { x: 1130, w: 30, h: 24 },
  { x: 1164, w: 36, h: 12 },
];

const VIEWBOX_HEIGHT = 42;

const StreetSkyline = ({ className }) => (
  <div className={cn('w-full overflow-hidden', className)} aria-hidden="true">
    <svg
      viewBox={`0 0 1200 ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="none"
      className="h-9 w-full sm:h-11"
    >
      {BUILDINGS.map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={VIEWBOX_HEIGHT - b.h}
          width={b.w}
          height={b.h}
          rx={2.5}
          className={i % 2 === 0 ? 'fill-sand-300' : 'fill-paper-200'}
        />
      ))}
    </svg>
  </div>
);

export default StreetSkyline;
