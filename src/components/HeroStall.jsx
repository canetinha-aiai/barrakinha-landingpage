import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useFinePointer } from '@/lib/motion';

/*
  A barraquinha isométrica da home do app (StallArt, no barrakinha-
  vendedor), portada pra SVG de navegador: mesma projeção, mesmas
  peças — balcão de tábuas claras sem placa, grelha com três
  espetinhos, estufa de vidro com seis coxinhas, toldo listrado com a
  barra em meias-luas, varal de lampadinhas e dois banquinhos, um com
  um copo esquecido. Sem three.js: é um SVG só, que sai pronto no HTML
  pré-renderizado e é a primeira pintura.

  O laranja é o da landing (#F85A35), não o brasa do app, pra casar
  com o botão e o header.

  Brincadeiras, todas ligadas depois que o React assume:
  - passar o mouse na barraca: as lampadinhas acendem em onda;
  - mexer o ponteiro: a barraca inclina um pouco atrás dele e a barra
    do toldo balança pro lado contrário, como pano;
  - tocar numa coxinha: ela pula com mola e sobe um "+1";
  - tocar no copo: ele balança no banquinho;
  - tocar na grelha: sai uma baforada de vapor mais forte.
  Coxinhas, copo e grelha são botões de verdade (foco por teclado,
  Enter e espaço). Com "menos movimento" nada se mexe: sem inclinação,
  sem piscar, sem pulo.
*/

const W = 320;
const H = 285;
const CX = 160;
const CY = 218;
const COS = 0.866;
const SIN = 0.5;

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
};

const iso = ([x, y, z]) => ({ x: CX + (x - y) * COS, y: CY + (x + y) * SIN - z });
const xy = (p) => {
  const s = iso(p);
  return `${s.x.toFixed(1)},${s.y.toFixed(1)}`;
};
const poly = (...p) => p.map(xy).join(' ');
const lineOf = (p1, p2) => {
  const a = iso(p1);
  const b = iso(p2);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
};

const BX = 60;
const BY = 35;
const BZ = 46;
const RX = 70;
const RY = 44;
const RZ = 132;
const FLAP = 14;

/* ---------- peças estáticas ---------- */

const Post = ({ x, y }) => (
  <line {...lineOf([x, y, BZ], [x, y, RZ])} stroke={C.noite} strokeWidth={4} strokeLinecap="round" />
);

const Counter = () => (
  <g>
    <polygon points={poly([-BX, BY, 0], [BX, BY, 0], [BX, BY, BZ], [-BX, BY, BZ])} fill={C.sunken} />
    <polygon points={poly([BX, BY, 0], [BX, -BY, 0], [BX, -BY, BZ], [BX, BY, BZ])} fill={C.lineStrong} />
    <Post x={-BX + 2} y={-BY + 2} />
    <polygon points={poly([-BX, -BY, BZ], [BX, -BY, BZ], [BX, BY, BZ], [-BX, BY, BZ])} fill={C.canvas} />
    <polygon points={poly([-BX, BY, BZ - 6], [BX, BY, BZ - 6], [BX, BY, BZ], [-BX, BY, BZ])} fill={C.lineStrong} />
    <polygon
      points={poly([BX, BY, BZ - 6], [BX, -BY, BZ - 6], [BX, -BY, BZ], [BX, BY, BZ])}
      fill={C.inkFaint}
      opacity={0.5}
    />
    {[-30, 0, 30].map((x) => (
      <polygon
        key={x}
        points={poly([x, BY, 6], [x + 1.6, BY, 6], [x + 1.6, BY, BZ - 9], [x, BY, BZ - 9])}
        fill={C.inkFaint}
        opacity={0.3}
      />
    ))}
    <polygon points={poly([-BX, BY, 0], [BX, BY, 0], [BX, BY, 5], [-BX, BY, 5])} fill={C.lineStrong} />
    <polygon points={poly([BX, BY, 0], [BX, -BY, 0], [BX, -BY, 5], [BX, BY, 5])} fill={C.inkFaint} opacity={0.45} />
    {[-12, 12].map((y) => (
      <polygon
        key={y}
        points={poly([BX, y, 4], [BX, y - 1.6, 4], [BX, y - 1.6, BZ - 12], [BX, y, BZ - 12])}
        fill={C.inkFaint}
        opacity={0.35}
      />
    ))}
  </g>
);

const GRILL = { x0: 8, x1: 50, y0: -28, y1: 2 };
const Grill = () => {
  const { x0, x1, y0, y1 } = GRILL;
  const h = 6;
  return (
    <g>
      <polygon points={poly([x0, y1, BZ], [x1, y1, BZ], [x1, y1, BZ + h], [x0, y1, BZ + h])} fill={C.ink} opacity={0.85} />
      <polygon points={poly([x1, y1, BZ], [x1, y0, BZ], [x1, y0, BZ + h], [x1, y1, BZ + h])} fill={C.noite} />
      <polygon points={poly([x0, y0, BZ + h], [x1, y0, BZ + h], [x1, y1, BZ + h], [x0, y1, BZ + h])} fill={C.inkSoft} />
      {[-22, -13, -4].map((y) => {
        const a = iso([x0 - 4, y, BZ + h + 1]);
        const b = iso([x1 + 4, y, BZ + h + 1]);
        return (
          <g key={y}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.lineStrong} strokeWidth={2} strokeLinecap="round" />
            {[0.25, 0.5, 0.75].map((t, i) => (
              <ellipse
                key={t}
                cx={a.x + (b.x - a.x) * t}
                cy={a.y + (b.y - a.y) * t - 2}
                rx={5.5}
                ry={4}
                fill={i === 1 ? C.mostarda : C.brasaText}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
};

const ES = { x0: -48, x1: -8, y0: 8, y1: 31, z0: BZ, h: 22 };

const coxinhaPath = (p) =>
  `M${p.x},${p.y - 12} C${p.x + 2},${p.y - 9} ${p.x + 5.5},${p.y - 5} ${p.x + 5.5},${p.y - 2.5} C${p.x + 5.5},${p.y} ${p.x + 3},${p.y + 1} ${p.x},${p.y + 1} C${p.x - 3},${p.y + 1} ${p.x - 5.5},${p.y} ${p.x - 5.5},${p.y - 2.5} C${p.x - 5.5},${p.y - 5} ${p.x - 2},${p.y - 9} ${p.x},${p.y - 12} Z`;
const coxinhaShade = (p) =>
  `M${p.x},${p.y - 12} C${p.x + 2},${p.y - 9} ${p.x + 5.5},${p.y - 5} ${p.x + 5.5},${p.y - 2.5} C${p.x + 5.5},${p.y} ${p.x + 3},${p.y + 1} ${p.x},${p.y + 1} C${p.x + 1.5},${p.y - 3} ${p.x + 1.5},${p.y - 8} ${p.x},${p.y - 12} Z`;

const EstufaBase = () => {
  const { x0, x1, y0, y1, z0 } = ES;
  return (
    <g>
      <polygon points={poly([x0, y1, z0], [x1, y1, z0], [x1, y1, z0 + 3], [x0, y1, z0 + 3])} fill={C.lineStrong} />
      <polygon points={poly([x1, y1, z0], [x1, y0, z0], [x1, y0, z0 + 3], [x1, y1, z0 + 3])} fill={C.inkFaint} opacity={0.6} />
      <polygon points={poly([x0, y0, z0 + 3], [x1, y0, z0 + 3], [x1, y1, z0 + 3], [x0, y1, z0 + 3])} fill={C.sunken} />
    </g>
  );
};

/* Vidro por cima das coxinhas. Sem eventos de ponteiro: o toque passa
   direto pra coxinha embaixo. */
const EstufaGlass = () => {
  const { x0, x1, y0, y1, z0, h } = ES;
  const zt = z0 + h;
  const edge = { stroke: C.lineStrong, strokeWidth: 1.6, strokeLinecap: 'round' };
  return (
    <g pointerEvents="none">
      <polygon points={poly([x0, y1, z0 + 3], [x1, y1, z0 + 3], [x1, y1, zt], [x0, y1, zt])} fill={C.canvas} opacity={0.22} />
      <polygon points={poly([x1, y1, z0 + 3], [x1, y0, z0 + 3], [x1, y0, zt], [x1, y1, zt])} fill={C.canvas} opacity={0.14} />
      <polygon points={poly([x0, y0, zt], [x1, y0, zt], [x1, y1, zt], [x0, y1, zt])} fill={C.canvas} opacity={0.7} />
      <polygon
        points={poly([x0 + 6, y1, z0 + 6], [x0 + 10, y1, z0 + 6], [x0 + 18, y1, zt - 2], [x0 + 14, y1, zt - 2])}
        fill={C.canvas}
        opacity={0.55}
      />
      <line {...lineOf([x0, y1, z0 + 3], [x0, y1, zt])} {...edge} />
      <line {...lineOf([x1, y1, z0 + 3], [x1, y1, zt])} {...edge} />
      <line {...lineOf([x1, y0, z0 + 3], [x1, y0, zt])} {...edge} />
      <line {...lineOf([x0, y1, zt], [x1, y1, zt])} {...edge} />
      <line {...lineOf([x1, y1, zt], [x1, y0, zt])} {...edge} />
    </g>
  );
};

const FrontPosts = () => (
  <g>
    <Post x={-BX + 2} y={BY - 2} />
    <Post x={BX - 2} y={BY - 2} />
    <Post x={BX - 2} y={-BY + 2} />
  </g>
);

const BANDS_X = 8;
const BANDS_Y = 5;
const Roof = () => {
  const step = (RX * 2) / BANDS_X;
  return (
    <g>
      {Array.from({ length: BANDS_X }, (_, i) => {
        const a = -RX + i * step;
        return (
          <polygon
            key={i}
            points={poly([a, -RY, RZ], [a + step, -RY, RZ], [a + step, RY, RZ], [a, RY, RZ])}
            fill={i % 2 === 0 ? C.canvas : C.brasa}
          />
        );
      })}
      <polygon
        points={poly([-RX, -RY, RZ], [RX, -RY, RZ], [RX, RY, RZ], [-RX, RY, RZ])}
        fill="none"
        stroke={C.brasaPressed}
        strokeWidth={1.5}
      />
    </g>
  );
};

const flapPath = (p1, p2) => {
  const top1 = iso(p1);
  const top2 = iso(p2);
  const bot2 = iso([p2[0], p2[1], p2[2] - FLAP]);
  const bot1 = iso([p1[0], p1[1], p1[2] - FLAP]);
  const cx = (bot1.x + bot2.x) / 2;
  const cy = (bot1.y + bot2.y) / 2 + 13;
  return `M${top1.x},${top1.y} L${top2.x},${top2.y} L${bot2.x},${bot2.y} Q${cx},${cy} ${bot1.x},${bot1.y} Z`;
};

const Flaps = () => {
  const stepX = (RX * 2) / BANDS_X;
  const stepY = (RY * 2) / BANDS_Y;
  return (
    <g>
      {Array.from({ length: BANDS_X }, (_, i) => {
        const a = -RX + i * stepX;
        return <path key={`l${i}`} d={flapPath([a, RY, RZ], [a + stepX, RY, RZ])} fill={i % 2 === 0 ? C.canvas : C.brasa} />;
      })}
      {Array.from({ length: BANDS_Y }, (_, i) => {
        const a = RY - i * stepY;
        return (
          <path
            key={`r${i}`}
            d={flapPath([RX, a, RZ], [RX, a - stepY, RZ])}
            fill={i % 2 === 0 ? C.lineStrong : C.brasaPressed}
          />
        );
      })}
    </g>
  );
};

const LIGHT_Z = RZ - FLAP - 3;
const LIGHTS = Array.from({ length: 7 }, (_, i) => {
  const t = (i + 0.5) / 7;
  const x = -RX + 6 + t * (RX * 2 - 12);
  const sag = Math.sin(t * Math.PI) * 3;
  return iso([x, RY, LIGHT_Z - sag]);
});

const LightString = () => {
  const a = iso([-RX + 2, RY, LIGHT_Z + 4]);
  const b = iso([RX - 2, RY, LIGHT_Z + 4]);
  const mid = iso([0, RY, LIGHT_Z - 5]);
  return (
    <g>
      <path d={`M${a.x},${a.y} Q${mid.x},${mid.y} ${b.x},${b.y}`} stroke={C.noite} strokeWidth={1.2} fill="none" />
      {LIGHTS.map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1={p.y - 4} x2={p.x} y2={p.y} stroke={C.noite} strokeWidth={1.2} />
          <circle cx={p.x} cy={p.y + 2.5} r={3} fill={C.mostarda} />
        </g>
      ))}
    </g>
  );
};

/* Brilho das lampadinhas. Parado, pares e ímpares piscam devagar em
   contrafase (como no app); com o ponteiro em cima, acendem em onda da
   esquerda pra direita (`.stall-wave`, em index.css). */
const LightGlow = () => (
  <g pointerEvents="none">
    {LIGHTS.map((p, i) => (
      <circle
        key={i}
        cx={p.x}
        cy={p.y + 2.5}
        r={5.5}
        fill={C.mostarda}
        className="stall-glow"
        style={{ '--i': i, animationDelay: `${i % 2 ? 1.1 : 0}s` }}
      />
    ))}
  </g>
);

const Steam = ({ burst }) => {
  const puffs = [-8, 4, 14];
  return (
    <g pointerEvents="none">
      {puffs.map((dx, i) => {
        const c = iso([30 + dx, -12, BZ + 10]);
        return (
          <g key={`${dx}-${burst}`} className={burst ? 'stall-steam-burst' : 'stall-steam'} style={{ animationDelay: burst ? `${i * 70}ms` : `${i * 0.8}s` }}>
            <circle cx={c.x} cy={c.y} r={6} fill={C.canvas} />
            <circle cx={c.x + 5} cy={c.y - 3} r={4.5} fill={C.canvas} />
          </g>
        );
      })}
    </g>
  );
};

/* ---------- peças que respondem ao toque ---------- */

const press = (fn) => ({
  onClick: fn,
  onKeyDown: (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fn();
    }
  },
});

const Coxinha = ({ x, y, still }) => {
  const p = iso([x, y, ES.z0 + 3]);
  const [hops, setHops] = useState(0);
  const hop = () => setHops((n) => n + 1);

  return (
    <g role="button" tabIndex={0} aria-label="Coxinha da estufa" className="stall-hit" {...press(hop)}>
      {/* área de toque maior que a coxinha */}
      <circle cx={p.x} cy={p.y - 5} r={9} fill="transparent" />
      <motion.g
        key={hops}
        initial={false}
        animate={hops && !still ? { y: [0, -16, 0] } : { y: 0 }}
        transition={{ duration: 0.55, times: [0, 0.35, 1], ease: ['easeOut', [0.34, 1.56, 0.64, 1]] }}
      >
        <path d={coxinhaPath(p)} fill={C.mostarda} />
        <path d={coxinhaShade(p)} fill={C.warning} opacity={0.4} />
      </motion.g>
      {hops && !still ? (
        <motion.text
          key={`t${hops}`}
          x={p.x}
          y={p.y - 18}
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill={C.brasaText}
          className="font-sans"
          pointerEvents="none"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          +1
        </motion.text>
      ) : null}
    </g>
  );
};

const CUP = iso([92, -22, 28]);
const CUP_SCALE = 0.62;

const Cup = () => {
  const { x, y } = CUP;
  return (
    <g>
      <path d={`M${x - 10},${y - 36} L${x + 10},${y - 36} L${x + 8},${y - 2} A8 3 0 0 1 ${x - 8},${y - 2} Z`} fill={C.canvas} />
      <path d={`M${x},${y - 36} L${x + 10},${y - 36} L${x + 8},${y - 2} A8 3 0 0 1 ${x},${y + 1} Z`} fill={C.sunken} />
      <path d={`M${x - 9.4},${y - 25} L${x + 9.4},${y - 25} L${x + 8.8},${y - 16} L${x - 8.8},${y - 16} Z`} fill={C.brasa} />
      <path d={`M${x},${y - 25} L${x + 9.4},${y - 25} L${x + 8.8},${y - 16} L${x},${y - 16} Z`} fill={C.brasaPressed} />
      <line x1={x + 2} y1={y - 38} x2={x + 8} y2={y - 52} stroke={C.mostarda} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={x} cy={y - 36} rx={11} ry={4} fill={C.noite} />
    </g>
  );
};

const Stool = ({ x, y, children }) => {
  const z = 28;
  const seat = iso([x, y, z]);
  const legs = [
    [-7, 7],
    [8, 5],
    [2, -9],
  ];
  return (
    <g>
      <ellipse cx={iso([x, y, 0]).x} cy={iso([x, y, 0]).y + 1} rx={16} ry={6} fill={C.noite} opacity={0.12} />
      {legs.map(([lx, ly]) => (
        <line
          key={`${lx}${ly}`}
          {...lineOf([x + lx, y + ly, 0], [x + lx * 0.6, y + ly * 0.6, z])}
          stroke={C.noite}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      ))}
      <ellipse cx={seat.x} cy={seat.y + 3} rx={14} ry={7} fill={C.warning} />
      <ellipse cx={seat.x} cy={seat.y} rx={14} ry={7} fill={C.mostarda} />
      {children}
    </g>
  );
};

const CupOnStool = ({ still }) => {
  const [wobbles, setWobbles] = useState(0);
  return (
    <g role="button" tabIndex={0} aria-label="Copo no banquinho" className="stall-hit" {...press(() => setWobbles((n) => n + 1))}>
      <motion.g
        key={wobbles}
        style={{ originX: `${CUP.x}px`, originY: `${CUP.y}px` }}
        initial={false}
        animate={wobbles && !still ? { rotate: [0, -14, 10, -6, 3, 0] } : { rotate: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <g transform={`translate(${CUP.x} ${CUP.y}) scale(${CUP_SCALE}) translate(${-CUP.x} ${-CUP.y})`}>
          <ellipse cx={CUP.x} cy={CUP.y} rx={12} ry={4} fill={C.warning} opacity={0.5} />
          <Cup />
          {/* área de toque */}
          <rect x={CUP.x - 14} y={CUP.y - 56} width={28} height={60} fill="transparent" />
        </g>
      </motion.g>
    </g>
  );
};

const Seating = ({ still }) => (
  <g>
    <ellipse cx={iso([86, -38, 0]).x} cy={iso([86, -38, 0]).y + 2} rx={40} ry={13} fill={C.noite} opacity={0.08} />
    <Stool x={80} y={-56} />
    <Stool x={92} y={-22}>
      <CupOnStool still={still} />
    </Stool>
  </g>
);

/* ---------- a barraca ---------- */

const HeroStall = ({ className }) => {
  const reduceMotion = useReducedMotion();
  const fine = useFinePointer();
  const still = Boolean(reduceMotion);
  const [hover, setHover] = useState(false);
  const [burst, setBurst] = useState(0);

  /* Ponteiro na janela inteira, -1…1, amortecido sem quique. */
  const px = useSpring(0, { stiffness: 120, damping: 20, mass: 0.5 });
  const py = useSpring(0, { stiffness: 120, damping: 20, mass: 0.5 });
  const rotateY = useTransform(px, [-1, 1], [-7, 7]);
  const rotateX = useTransform(py, [-1, 1], [5, -5]);
  const shiftX = useTransform(px, [-1, 1], [-6, 6]);
  /* A barra do toldo vai pro lado contrário, presa pela borda de cima. */
  const skewX = useTransform(px, [-1, 1], [4, -4]);

  useEffect(() => {
    if (!fine || still) return undefined;
    const onMove = (event) => {
      px.set((event.clientX / window.innerWidth) * 2 - 1);
      py.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [fine, still, px, py]);

  const puff = () => setBurst((n) => n + 1);

  return (
    <div className={className} style={{ perspective: 900 }}>
      <motion.div
        style={still ? undefined : { rotateX, rotateY, x: shiftX }}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className={hover && !still ? 'stall-wave' : undefined}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-label="Barraquinha da Barrakinha: toldo listrado laranja, varal de lampadinhas, grelha com espetinhos, estufa de coxinhas e dois banquinhos"
        >
          <ellipse cx={CX + 4} cy={CY + 10} rx={128} ry={42} fill={C.ground} />
          <Counter />
          {/* A grelha é um botão: solta uma baforada de vapor. */}
          <g role="button" tabIndex={0} aria-label="Grelha dos espetinhos" className="stall-hit" {...press(puff)}>
            <Grill />
          </g>
          <Seating still={still} />
          {still ? null : <Steam burst={0} />}
          {burst && !still ? <Steam key={burst} burst={burst} /> : null}
          <EstufaBase />
          {[15, 25].map((y) => [-41, -29, -17].map((x) => <Coxinha key={`${x}${y}`} x={x} y={y} still={still} />))}
          <EstufaGlass />
          <FrontPosts />
          <motion.g style={still ? undefined : { skewX, originY: 0, transformBox: 'fill-box' }}>
            <Flaps />
          </motion.g>
          <Roof />
          <LightGlow />
          <LightString />
        </svg>
      </motion.div>
    </div>
  );
};

export default HeroStall;
