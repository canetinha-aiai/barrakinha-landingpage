import React, { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { PIN_PATH } from '@/components/LiveMap';
import { useFinePointer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/*
  O mapa do hero — o produto em vez de uma foto do produto.

  Um pedaço de bairro desenhado, com barracas como pinos. Tocar (ou
  passar o mouse em) um pino abre um cartão com o que tem ali: o tipo
  de comida, se está aberta, dois ou três itens de exemplo com preço e
  o caminho a pé de "você" até lá. É a frase do título acontecendo.

  Os nomes são tipos de comida, não barracas inventadas — a Barrakinha
  ainda não tem barraca de verdade pra mostrar, e fingir que tem seria
  pior que mostrar o jeito que vai ser.

  Regras que o hero impõe:
  - O mapa sai inteiro no HTML pré-renderizado, com os pinos no lugar
    e nada com opacidade 0. A queda dos pinos é CSS só de transform
    (`animate-pin-drop`), como o título: roda já no HTML e não pisca
    quando o React assume. Com menos movimento, eles nascem parados.
  - O cartão só existe depois do JS (é interação). Um pino já vem
    escolhido depois que os pinos assentam, pra mostrar que dá pra
    tocar.
  - Teclado: pinos focáveis, Enter/Espaço abre, Esc fecha e devolve o
    foco ao pino. Toque fora fecha.
*/

const W = 520;
const H = 520;

/* Cada unidade do desenho vale 1,5 m; 80 m por minuto a pé. */
const ME = { x: 262, y: 270 };

const pins = [
  {
    id: 'pastel',
    label: 'Pastel',
    x: 118,
    y: 150,
    open: true,
    items: [
      ['Carne', '9,00'],
      ['Queijo', '8,00'],
      ['Caldo de cana', '7,00'],
    ],
  },
  {
    id: 'espetinho',
    label: 'Espetinho',
    x: 404,
    y: 128,
    open: true,
    items: [
      ['Carne', '8,00'],
      ['Frango com bacon', '9,00'],
      ['Mandioca', '6,00'],
    ],
  },
  {
    id: 'acai',
    label: 'Açaí',
    x: 430,
    y: 352,
    open: false,
    opens: '17h',
  },
  {
    id: 'tapioca',
    label: 'Tapioca',
    x: 104,
    y: 398,
    open: true,
    items: [
      ['Queijo coalho', '10,00'],
      ['Coco', '11,00'],
    ],
  },
  {
    id: 'churros',
    label: 'Churros',
    x: 300,
    y: 462,
    open: true,
    items: [
      ['Doce de leite', '7,00'],
      ['Chocolate', '8,00'],
    ],
  },
];

/* Quarteirões: [x, y, largura, altura]. As ruas são o que sobra. */
const blocks = [
  [20, 20, 150, 92], [196, 20, 128, 92], [350, 20, 150, 70],
  [20, 172, 74, 120], [118, 172, 92, 54], [350, 150, 150, 92],
  [118, 240, 92, 52], [306, 264, 54, 108],
  [384, 266, 116, 46], [20, 316, 150, 46], [196, 392, 86, 108],
  [384, 392, 116, 108], [20, 430, 150, 70],
];

/* Caminho pelas ruas: primeiro na horizontal, depois na vertical. */
const routeTo = (pin) => `M${ME.x} ${ME.y} L${pin.x} ${ME.y} L${pin.x} ${pin.y - 2}`;
const walk = (pin) => {
  const meters = Math.round(((Math.abs(pin.x - ME.x) + Math.abs(pin.y - ME.y)) * 1.5) / 10) * 10;
  return { meters, minutes: Math.max(1, Math.round(meters / 80)) };
};

const Pin = ({ pin, index, selected, cardId, onOpen, onHover, pinRef }) => (
  <g
    ref={pinRef}
    transform={`translate(${pin.x} ${pin.y})`}
    role="button"
    tabIndex={0}
    aria-expanded={selected}
    aria-controls={selected ? cardId : undefined}
    aria-label={`${pin.label}: ${pin.open ? `aberta, ${walk(pin).minutes} min a pé` : 'fechada agora'}`}
    data-pin={pin.id}
    onClick={() => onOpen(pin.id)}
    onPointerEnter={onHover ? () => onHover(pin.id) : undefined}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpen(pin.id);
      }
    }}
    className="group cursor-pointer outline-none"
  >
    {/* Área de toque maior que o desenho (44px no celular). */}
    <circle cx={0} cy={-18} r={30} fill="transparent" />
    <g
      className="animate-pin-drop motion-reduce:animate-none"
      style={{ animationDelay: `${300 + index * 110}ms` }}
    >
      <g
        style={{
          transform: selected ? 'scale(1.18)' : 'none',
          transformOrigin: '0px 0px',
          transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <path
          d={PIN_PATH}
          fill={pin.open ? '#F85A35' : '#FBF7F2'}
          stroke={pin.open ? '#1D1611' : '#A29C94'}
          strokeWidth={pin.open ? 2 : 1.5}
          className="group-focus-visible:[stroke-width:3.5]"
        />
        <circle cx={0} cy={-26} r={4.5} fill={pin.open ? '#FBF7F2' : '#DFD5C9'} />
      </g>
      <text
        x={0}
        y={19}
        textAnchor="middle"
        fontSize="14"
        fontWeight={pin.open ? 700 : 500}
        fill={pin.open ? '#1D1611' : '#6B6560'}
        className="font-sans"
        style={{ paintOrder: 'stroke', stroke: '#F4EEE7', strokeWidth: 4, strokeLinejoin: 'round' }}
      >
        {pin.label}
      </text>
    </g>
  </g>
);

/* O cartão do pino escolhido, em HTML por cima do SVG (texto nítido e
   lido como texto pelo leitor de tela). Fica acima do pino; nos pinos
   do alto, embaixo. Na horizontal, escorrega pra não sair do mapa. */
const Card = ({ pin, id }) => {
  const below = pin.y < 220;
  const shift = Math.min(1, Math.max(0, (pin.x - 110) / (W - 220)));
  const { meters, minutes } = walk(pin);

  return (
    <div
      id={id}
      role="group"
      aria-label={`${pin.label}, ${pin.open ? 'aberta agora' : 'fechada agora'}`}
      data-card
      className="pointer-events-auto absolute z-10 w-[min(232px,64%)] animate-card-in rounded border-2 border-ink bg-paper p-3.5 text-left text-ink motion-reduce:animate-none"
      style={{
        left: `${(pin.x / W) * 100}%`,
        top: `${(pin.y / H) * 100}%`,
        transform: `translate(${-shift * 100}%, ${below ? '22px' : 'calc(-100% - 46px)'})`,
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[17px] font-bold leading-tight tracking-[-0.01em]">{pin.label}</p>
        <p className={cn('flex shrink-0 items-center gap-1.5 text-[13px] font-semibold', pin.open ? 'text-ember-text' : 'text-ink-muted')}>
          <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', pin.open ? 'bg-ember' : 'bg-line-strong')} />
          {pin.open ? 'Aberta agora' : 'Fechada agora'}
        </p>
      </div>

      {pin.open ? (
        <>
          <ul className="mt-2.5 space-y-1 border-t border-line pt-2.5 text-[14px]">
            {pin.items.map(([name, price]) => (
              <li key={name} className="flex items-baseline justify-between gap-3">
                <span className="truncate text-ink-muted">{name}</span>
                <span className="shrink-0 font-semibold tabular-nums">R$ {price}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 flex items-center gap-1.5 border-t border-line pt-2.5 text-[13px] font-semibold">
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
              <circle cx="9" cy="2.6" r="1.6" fill="currentColor" />
              <path d="M8 5.5 6 9l2.4 1.6L7.5 15M8 5.5l2.6 2.2 2.2.6M6 9l-1.4 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {minutes} min a pé · {meters} m
          </p>
        </>
      ) : (
        <p className="mt-2.5 border-t border-line pt-2.5 text-[14px] text-ink-muted">Abre às {pin.opens}.</p>
      )}
    </div>
  );
};

const HeroMap = ({ className }) => {
  const reduceMotion = useReducedMotion();
  const fine = useFinePointer();
  const cardId = useId();
  const rootRef = useRef(null);
  const pinRefs = useRef({});
  const [selected, setSelected] = useState(null);
  const touched = useRef(false);

  /* Depois que os pinos assentam, o pastel já vem escolhido — a não
     ser que a pessoa tenha mexido antes. */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!touched.current) setSelected('pastel');
    }, reduceMotion ? 0 : 1500);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  /* Toque fora do mapa (ou num pedaço vazio dele) fecha o cartão. */
  useEffect(() => {
    if (!selected) return undefined;
    const onDown = (event) => {
      const target = event.target;
      if (target.closest?.('[data-pin]') || target.closest?.('[data-card]')) return;
      setSelected(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [selected]);

  const open = (id) => {
    touched.current = true;
    setSelected((current) => (current === id && !fine ? null : id));
  };
  const hover = (id) => {
    touched.current = true;
    setSelected(id);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape' && selected) {
      const id = selected;
      setSelected(null);
      pinRefs.current[id]?.focus();
    }
  };

  const chosen = pins.find((pin) => pin.id === selected);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <figure
      ref={rootRef}
      onKeyDown={onKeyDown}
      className={cn('relative rounded border-2 border-ink bg-paper-raised', className)}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full rounded-[8px]"
        role="group"
        aria-label="Mapa ilustrado de um bairro com barracas de comida de rua. Pastel, espetinho, tapioca e churros estão abertas; o açaí está fechado. Escolha um pino para ver o que tem."
      >
        {blocks.map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={6} fill="#E9DFD3" />
        ))}
        {/* A praça, com um caminho cruzando. */}
        <rect x={236} y={150} width={88} height={88} rx={6} fill="#D9E6CE" />
        <path d="M236 194 Q280 182 324 200" fill="none" stroke="#C8D9BA" strokeWidth={5} strokeLinecap="round" />
        {/* Uma avenida mais larga, pra dar escala. */}
        <path d="M0 371 L520 371" stroke="#FBF7F2" strokeWidth={8} />

        {/* O caminho a pé até a barraca escolhida. */}
        {chosen && chosen.open ? (
          <path
            key={chosen.id}
            d={routeTo(chosen)}
            fill="none"
            stroke="#1D1611"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 8"
            className="animate-route-draw motion-reduce:animate-none"
          />
        ) : null}

        {/* Você. */}
        <circle
          cx={ME.x}
          cy={ME.y}
          r={24}
          fill="#1D1611"
          opacity={0.08}
          className="animate-ripple motion-reduce:animate-none"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <circle cx={ME.x} cy={ME.y} r={9} fill="#1D1611" stroke="#FBF7F2" strokeWidth={3} />
        <text x={ME.x} y={ME.y + 30} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1D1611" className="font-sans">
          você
        </text>

        {pins.map((pin, index) => (
          <Pin
            key={pin.id}
            pin={pin}
            index={index}
            selected={selected === pin.id}
            cardId={cardId}
            onOpen={open}
            onHover={fine ? hover : undefined}
            pinRef={(node) => {
              pinRefs.current[pin.id] = node;
            }}
          />
        ))}
      </svg>

      {chosen ? <Card key={chosen.id} pin={chosen} id={cardId} /> : null}
    </figure>
  );
};

export default HeroMap;
