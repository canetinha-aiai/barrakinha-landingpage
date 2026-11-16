import React from 'react';

/*
  As comidas da faixa, desenhadas no mesmo traço da barraquinha do
  hero (HeroStall): formas chapadas, sem contorno, sem degradê, nas
  cores da barraca — mostarda, laranja, creme e um tom de sombra.
  Feitas pra ficar sobre a noite. Todas num quadro de 64×64.
*/
const K = {
  mostarda: '#FFC23D',
  sombra: '#C98A12',
  massa: '#E39A4A',
  massaEscura: '#B86A25',
  brasa: '#F85A35',
  brasaEscura: '#C43D1C',
  creme: '#FBF7F2',
  palito: '#E8C79A',
  folha: '#6E9B3A',
  folhaEscura: '#4E7428',
  acai: '#5B2A6E',
  acaiClaro: '#7A3D8F',
  cana: '#C9D86B',
};

const Pastel = () => (
  <g>
    <path d="M6 42 A26 26 0 0 1 58 42 Z" fill={K.mostarda} />
    <path d="M32 42 A26 26 0 0 1 58 42 Z" fill={K.sombra} opacity={0.35} />
    {[0.12, 0.27, 0.42, 0.58, 0.73, 0.88].map((t) => {
      const a = Math.PI * (1 - t);
      return <circle key={t} cx={32 + Math.cos(a) * 23} cy={42 - Math.sin(a) * 23} r={1.8} fill={K.sombra} />;
    })}
    <rect x={6} y={41} width={52} height={4} rx={2} fill={K.sombra} />
  </g>
);

const Espetinho = () => (
  <g>
    <line x1={10} y1={56} x2={54} y2={10} stroke={K.palito} strokeWidth={3} strokeLinecap="round" />
    {[
      [22, 43, K.brasaEscura],
      [31, 33, K.mostarda],
      [40, 24, K.brasaEscura],
    ].map(([x, y, c]) => (
      <ellipse key={x} cx={x} cy={y} rx={8} ry={6.5} fill={c} transform={`rotate(-46 ${x} ${y})`} />
    ))}
  </g>
);

const Acaraje = () => (
  <g>
    <ellipse cx={32} cy={38} rx={24} ry={15} fill={K.massa} />
    <ellipse cx={32} cy={41} rx={24} ry={12} fill={K.massaEscura} opacity={0.35} />
    <path d="M12 34 Q32 24 52 34 Q32 40 12 34 Z" fill={K.brasaEscura} />
    <path d="M24 30 q4 -6 9 -2" stroke={K.brasa} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <path d="M35 30 q4 -6 9 -2" stroke={K.brasa} strokeWidth={3.5} fill="none" strokeLinecap="round" />
  </g>
);

const Tapioca = () => (
  <g>
    <path d="M6 40 A26 26 0 0 1 58 40 Z" fill={K.creme} />
    <path d="M10 40 A22 22 0 0 1 54 40 Z" fill={K.mostarda} opacity={0.9} />
    <path d="M6 40 Q32 30 58 40 Z" fill={K.creme} />
    {[16, 26, 38, 48].map((x) => (
      <circle key={x} cx={x} cy={33 - (x % 3)} r={1.6} fill={K.brasaEscura} />
    ))}
  </g>
);

const Churros = () => (
  <g>
    {[
      [-24, 24],
      [-10, 36],
    ].map(([r, cx]) => (
      <g key={r} transform={`rotate(${r} ${cx} 34)`}>
        <rect x={cx - 6} y={8} width={12} height={50} rx={6} fill={K.massa} />
        {[16, 24, 32, 40, 48].map((y) => (
          <rect key={y} x={cx - 6} y={y} width={12} height={2} fill={K.massaEscura} opacity={0.6} />
        ))}
      </g>
    ))}
    {[
      [20, 18],
      [30, 30],
      [44, 22],
      [38, 44],
    ].map(([x, y]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r={1.4} fill={K.creme} />
    ))}
  </g>
);

const Milho = () => (
  <g>
    <ellipse cx={32} cy={28} rx={12} ry={22} fill={K.mostarda} />
    {[-6, 0, 6].map((dx) =>
      [12, 20, 28, 36, 44].map((y) => <circle key={`${dx}${y}`} cx={32 + dx} cy={y} r={1.7} fill={K.sombra} />),
    )}
    <path d="M32 58 Q14 50 18 26 Q24 44 32 50 Z" fill={K.folha} />
    <path d="M32 58 Q50 50 46 26 Q40 44 32 50 Z" fill={K.folhaEscura} />
  </g>
);

const Cachorro = () => (
  <g>
    <rect x={6} y={30} width={52} height={18} rx={9} fill={K.massa} />
    <rect x={2} y={27} width={60} height={10} rx={5} fill={K.brasaEscura} />
    <path d="M10 30 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4" stroke={K.mostarda} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x={8} y={36} width={48} height={12} rx={6} fill={K.massaEscura} opacity={0.35} />
  </g>
);

const Acai = () => (
  <g>
    <path d="M8 30 H56 L50 54 Q32 60 14 54 Z" fill={K.acai} />
    <ellipse cx={32} cy={30} rx={24} ry={7} fill={K.acaiClaro} />
    {[
      [20, 28],
      [27, 32],
      [36, 27],
    ].map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r={2.2} fill={K.mostarda} />
    ))}
    <ellipse cx={42} cy={30} rx={6} ry={3.5} fill={K.creme} />
    <ellipse cx={33} cy={24} rx={5} ry={3} fill={K.creme} />
  </g>
);

const Caldo = () => (
  <g>
    <path d="M16 14 H48 L44 58 Q32 61 20 58 Z" fill={K.creme} />
    <path d="M17.5 24 H46.5 L44 58 Q32 61 20 58 Z" fill={K.cana} />
    <path d="M32 24 H46.5 L44 58 Q38 60 32 60 Z" fill={K.folha} opacity={0.25} />
    <ellipse cx={32} cy={14} rx={16} ry={4} fill={K.creme} />
    <line x1={36} y1={16} x2={44} y2={2} stroke={K.brasa} strokeWidth={3.5} strokeLinecap="round" />
  </g>
);

const Coxinha = () => (
  <g>
    <path
      d="M32 6 C36 14 50 30 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 30 28 14 32 6 Z"
      fill={K.mostarda}
    />
    <path d="M32 6 C36 14 50 30 50 42 C50 52 42 58 32 58 C38 48 38 24 32 6 Z" fill={K.sombra} opacity={0.4} />
  </g>
);

export const FOOD_ICONS = {
  Pastel,
  Espetinho,
  Acarajé: Acaraje,
  Tapioca,
  Churros,
  'Milho cozido': Milho,
  'Cachorro-quente': Cachorro,
  Açaí: Acai,
  'Caldo de cana': Caldo,
  Coxinha,
};

/* As que saem quentes ganham vapor quando pulam. */
export const HOT = new Set(['Pastel', 'Espetinho', 'Acarajé', 'Tapioca', 'Churros', 'Milho cozido', 'Cachorro-quente', 'Coxinha']);
