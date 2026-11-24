import React from 'react';

/*
  A praça da página /barrakinha-x-ifood, no mesmo desenho da barraquinha
  isométrica do hero da home (HeroStall): mesma projeção, mesma paleta,
  só cor chapada, sem degradê nem sombra. É uma ilustração fixa em SVG,
  sem three.js: sai pronta no HTML pré-renderizado e não corta em
  nenhuma largura (o viewBox tem folga pros nomes das barracas).

  Cena: uma praça em losango, você no meio (o pino laranja) e cinco
  barracas em volta, cada uma com a comida e a distância. Um radar sai
  de você em ondas. Só duas coisas se mexem, as ondas do radar e o
  pisca das lampadinhas (a mesma `stall-glow` da barraca da home); o
  pino boia um pouco. Com "menos movimento" tudo fica parado.
*/

const COS = 0.866;
const SIN = 0.5;
const CX = 270;
const CY = 175;

const C = {
  canvas: '#FFFFFF',
  sunken: '#F6F1EC',
  lineStrong: '#DCD2C8',
  ink: '#1F1611',
  inkSoft: '#6E625A',
  inkFaint: '#8A7E75',
  brasa: '#F85A35',
  brasaPressed: '#D9461F',
  brasaText: '#C43D1C',
  noite: '#1F1611',
  mostarda: '#FFC23D',
  warning: '#9A5A00',
  ground: '#EDE4D9',
  grass: '#C9D3A8',
  grassSide: '#B3C090',
  grassSideDark: '#9FAE7C',
  pave: '#F3EBDF',
};

/* Projeção do mundo (x, y, z) pra tela, com origem em (CX, CY). */
const iso = ([x, y, z = 0], ox = CX, oy = CY) => ({
  x: ox + (x - y) * COS,
  y: oy + (x + y) * SIN - z,
});
const pt = (p, ox, oy) => {
  const s = iso(p, ox, oy);
  return `${s.x.toFixed(1)},${s.y.toFixed(1)}`;
};
const poly = (ox, oy, ...p) => p.map((q) => pt(q, ox, oy)).join(' ');

/* ---------- chão ---------- */

const HALF = 150; // meia-largura da praça no mundo
const SLAB = 16; // espessura da base

const Floor = () => {
  const p = (x, y, z = 0) => pt([x, y, z]);
  const inner = 112;
  const lane = 17;
  return (
    <g>
      {/* lateral da base */}
      <polygon
        points={`${p(-HALF, HALF)} ${p(HALF, HALF)} ${p(HALF, HALF, -SLAB)} ${p(-HALF, HALF, -SLAB)}`}
        fill={C.grassSide}
      />
      <polygon
        points={`${p(HALF, HALF)} ${p(HALF, -HALF)} ${p(HALF, -HALF, -SLAB)} ${p(HALF, HALF, -SLAB)}`}
        fill={C.grassSideDark}
      />
      {/* gramado */}
      <polygon points={`${p(-HALF, -HALF)} ${p(HALF, -HALF)} ${p(HALF, HALF)} ${p(-HALF, HALF)}`} fill={C.grass} />
      {/* calçada */}
      <polygon points={`${p(-inner, -inner)} ${p(inner, -inner)} ${p(inner, inner)} ${p(-inner, inner)}`} fill={C.ground} />
      {/* caminhos em cruz até a borda */}
      <polygon points={`${p(-HALF, -lane)} ${p(HALF, -lane)} ${p(HALF, lane)} ${p(-HALF, lane)}`} fill={C.pave} />
      <polygon points={`${p(-lane, -HALF)} ${p(lane, -HALF)} ${p(lane, HALF)} ${p(-lane, HALF)}`} fill={C.pave} />
      {/* miolo, onde você está */}
      <ellipse cx={CX} cy={CY} rx={52} ry={30} fill={C.sunken} />
    </g>
  );
};

/* ---------- árvore ---------- */

const Tree = ({ x, y, s = 1 }) => {
  const b = iso([x, y, 0]);
  return (
    <g transform={`translate(${b.x} ${b.y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={15} ry={6} fill={C.noite} opacity={0.1} />
      <rect x={-3} y={-22} width={6} height={24} rx={2} fill={C.inkSoft} />
      <ellipse cx={0} cy={-36} rx={21} ry={20} fill={C.grassSideDark} />
      <ellipse cx={-5} cy={-41} rx={11} ry={10} fill="#B5C28E" />
    </g>
  );
};

/* ---------- barraca (a mesma da home, menor) ---------- */

const BX = 38;
const BY = 22;
const BZ = 26;
const RX = 44;
const RY = 28;
const RZ = 78;
const FLAP = 9;
const BANDS = 6;

const Stall = ({ index }) => {
  /* desenhado em torno de (0,0) e depois posto no lugar com transform;
     assim a projeção é a mesma pra todas e o código fica curto. */
  const P = (...p) => poly(0, 0, ...p);
  const step = (RX * 2) / BANDS;
  const lights = Array.from({ length: 5 }, (_, i) => {
    const t = (i + 0.5) / 5;
    const x = -RX + 5 + t * (RX * 2 - 10);
    return iso([x, RY, RZ - FLAP - 2 - Math.sin(t * Math.PI) * 2], 0, 0);
  });

  const flap = (p1, p2) => {
    const t1 = iso(p1, 0, 0);
    const t2 = iso(p2, 0, 0);
    const b1 = iso([p1[0], p1[1], p1[2] - FLAP], 0, 0);
    const b2 = iso([p2[0], p2[1], p2[2] - FLAP], 0, 0);
    const mx = (b1.x + b2.x) / 2;
    const my = (b1.y + b2.y) / 2 + 8;
    return `M${t1.x},${t1.y} L${t2.x},${t2.y} L${b2.x},${b2.y} Q${mx},${my} ${b1.x},${b1.y} Z`;
  };

  const post = (x, y) => {
    const a = iso([x, y, BZ], 0, 0);
    const b = iso([x, y, RZ], 0, 0);
    return <line key={`${x}${y}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.noite} strokeWidth={2.4} strokeLinecap="round" />;
  };

  const sideBands = 4;
  const sideStep = (RY * 2) / sideBands;

  return (
    <g className="praca-stall">
      <ellipse cx={4} cy={6} rx={62} ry={22} fill={C.ground} />
      {/* balcão */}
      <polygon points={P([-BX, BY, 0], [BX, BY, 0], [BX, BY, BZ], [-BX, BY, BZ])} fill={C.sunken} />
      <polygon points={P([BX, BY, 0], [BX, -BY, 0], [BX, -BY, BZ], [BX, BY, BZ])} fill={C.lineStrong} />
      <polygon points={P([-BX, -BY, BZ], [BX, -BY, BZ], [BX, BY, BZ], [-BX, BY, BZ])} fill={C.canvas} />
      <polygon points={P([-BX, BY, BZ - 4], [BX, BY, BZ - 4], [BX, BY, BZ], [-BX, BY, BZ])} fill={C.lineStrong} />
      {/* faixa laranja na frente do balcão */}
      <polygon points={P([-BX + 6, BY, 5], [BX - 6, BY, 5], [BX - 6, BY, BZ - 9], [-BX + 6, BY, BZ - 9])} fill={C.brasa} opacity={0.9} />
      {/* comidinhas no balcão */}
      {[-18, -4, 10, 24].map((x, i) => {
        const c = iso([x, 2, BZ + 3], 0, 0);
        return <ellipse key={x} cx={c.x} cy={c.y} rx={4.6} ry={3.6} fill={i % 2 ? C.brasaText : C.mostarda} />;
      })}
      {/* postes da frente */}
      {post(-BX + 2, BY - 2)}
      {post(BX - 2, BY - 2)}
      {post(BX - 2, -BY + 2)}
      {/* toldo: tiras alternadas e a barra em meias-luas */}
      {Array.from({ length: BANDS }, (_, i) => {
        const a = -RX + i * step;
        return (
          <polygon
            key={`r${i}`}
            points={P([a, -RY, RZ], [a + step, -RY, RZ], [a + step, RY, RZ], [a, RY, RZ])}
            fill={i % 2 === 0 ? C.canvas : C.brasa}
          />
        );
      })}
      <polygon
        points={P([-RX, -RY, RZ], [RX, -RY, RZ], [RX, RY, RZ], [-RX, RY, RZ])}
        fill="none"
        stroke={C.brasaPressed}
        strokeWidth={1.2}
      />
      {Array.from({ length: BANDS }, (_, i) => {
        const a = -RX + i * step;
        return <path key={`f${i}`} d={flap([a, RY, RZ], [a + step, RY, RZ])} fill={i % 2 === 0 ? C.canvas : C.brasa} />;
      })}
      {Array.from({ length: sideBands }, (_, i) => {
        const a = RY - i * sideStep;
        return (
          <path
            key={`s${i}`}
            d={flap([RX, a, RZ], [RX, a - sideStep, RZ])}
            fill={i % 2 === 0 ? C.lineStrong : C.brasaPressed}
          />
        );
      })}
      {/* lampadinhas */}
      {lights.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y + 2} r={2.4} fill={C.mostarda} />
          <circle
            cx={p.x}
            cy={p.y + 2}
            r={4.4}
            fill={C.mostarda}
            className="stall-glow"
            style={{ '--i': i, animationDelay: `${(i + index) % 2 ? 1.1 : 0}s` }}
          />
        </g>
      ))}
    </g>
  );
};

/* ---------- nome da barraca ---------- */

const Label = ({ x, y, food, dist, delay }) => {
  const w = Math.max(64, food.length * 8.4 + 22);
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* a animação mexe no transform; por isso fica num <g> de dentro,
          senão ela anularia o translate de fora */}
      <g className="praca-pop" style={{ animationDelay: `${delay}s` }}>
      {/* a setinha aponta pra barraca, que fica logo embaixo */}
      <polygon points="-7,0 7,0 0,10" fill="#FBF7F2" stroke={C.lineStrong} strokeWidth={1.2} strokeLinejoin="round" />
      <rect x={-w / 2} y={-34} width={w} height={36} rx={10} fill="#FBF7F2" stroke={C.lineStrong} strokeWidth={1.2} />
      <text x={0} y={-17} textAnchor="middle" fontSize="13" fontWeight="800" fill={C.ink} className="font-sans">
        {food}
      </text>
      <text x={0} y={-3} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.brasaText} className="font-sans">
        {dist}
      </text>
      </g>
    </g>
  );
};

/* ---------- você ---------- */

const You = () => (
  <g>
    {/* ondas do radar: o círculo do mundo vira elipse 1,22 x 0,71 */}
    {[0, 1].map((i) => (
      <ellipse
        key={i}
        cx={CX}
        cy={CY}
        rx={1.2247 * 150}
        ry={0.7071 * 150}
        fill="none"
        stroke={C.brasa}
        strokeWidth={2.2}
        className="praca-ring"
        style={{ animationDelay: `${i * 1.6}s` }}
      />
    ))}
    <ellipse cx={CX} cy={CY + 2} rx={13} ry={5.5} fill={C.noite} opacity={0.15} />
    <g className="praca-bob">
      <path d={`M${CX},${CY - 6} L${CX - 9},${CY - 30} A12 12 0 1 1 ${CX + 9},${CY - 30} Z`} fill={C.brasa} />
      <path d={`M${CX},${CY - 6} L${CX + 9},${CY - 30} A12 12 0 0 0 ${CX + 11.4},${CY - 36} L${CX},${CY - 6} Z`} fill={C.brasaPressed} opacity={0.55} />
      <circle cx={CX} cy={CY - 38} r={5} fill="#FBF7F2" />
    </g>
  </g>
);

/* ---------- a cena ---------- */

const STALLS = [
  { food: 'Tapioca', dist: '95 m', w: [-100, -35] },
  { food: 'Açaí', dist: '150 m', w: [10, -112] },
  { food: 'Pastel', dist: '80 m', w: [112, -70] },
  { food: 'Espetinho', dist: '120 m', w: [-85, 110] },
  { food: 'Churros', dist: '110 m', w: [130, 70] },
]
  /* de trás pra frente: quem tem x+y maior fica na frente */
  .sort((a, b) => a.w[0] + a.w[1] - (b.w[0] + b.w[1]));

const SCALE = 0.58;
/* Topo do toldo na tela, em relação ao chão da barraca: o nome fica
   colado nele, com a setinha encostando no toldo. */
const ROOF_TOP = ((-RX - RY) * SIN - RZ) * SCALE;

const TREES = [
  [-130, -100, 0.8],
  [-60, -128, 0.7],
  [120, -128, 0.75],
  [-138, 30, 0.8],
  [30, 132, 0.8],
  [138, 130, 0.75],
];

const PracaIso = ({ className }) => (
  <div className={className}>
    <svg
      viewBox="0 -70 540 430"
      className="block h-auto w-full overflow-visible"
      role="img"
      aria-label="Praça vista de cima com você no meio e cinco barracas em volta: tapioca a 95 metros, açaí a 150, pastel a 80, espetinho a 120 e churros a 110"
    >
      <Floor />
      {TREES.filter(([x, y]) => x + y < -40).map(([x, y, s]) => (
        <Tree key={`${x}${y}`} x={x} y={y} s={s} />
      ))}
      <You />
      {STALLS.map((s, i) => {
        const g = iso([s.w[0], s.w[1], 0]);
        return (
          <g key={s.food}>
            <g transform={`translate(${g.x} ${g.y}) scale(${SCALE})`}>
              <Stall index={i} />
            </g>
          </g>
        );
      })}
      {TREES.filter(([x, y]) => x + y >= -40).map(([x, y, s]) => (
        <Tree key={`${x}${y}`} x={x} y={y} s={s} />
      ))}
      {STALLS.map((s, i) => {
        const g = iso([s.w[0], s.w[1], 0]);
        return <Label key={s.food} x={g.x} y={g.y + ROOF_TOP - 8} food={s.food} dist={s.dist} delay={0.4 + i * 0.35} />;
      })}
    </svg>
  </div>
);

export default PracaIso;
