import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PIN_PATH } from '@/components/LiveMap';

/*
  A comemoração de quem entrou na lista: sete pinos de mapa saltam do
  botão em leque, giram um pouco e caem — como barracas aparecendo no
  mapa. Menos de um segundo, uma vez por inscrição. É o único momento
  de "festa" da página, e ele é raro: acontece uma vez por pessoa.

  `burst` é um contador; cada valor novo dispara uma rajada. Com menos
  movimento não há rajada — o aviso de sucesso já diz tudo.
*/
const PINS = [
  { angle: -160, distance: 90, fill: '#1D1611', dot: '#F85A35', size: 22 },
  { angle: -130, distance: 120, fill: '#FBF7F2', dot: '#1D1611', size: 18 },
  { angle: -105, distance: 100, fill: '#1D1611', dot: '#FBF7F2', size: 26 },
  { angle: -80, distance: 130, fill: '#FBF7F2', dot: '#F85A35', size: 20 },
  { angle: -55, distance: 105, fill: '#1D1611', dot: '#F85A35', size: 24 },
  { angle: -30, distance: 115, fill: '#FBF7F2', dot: '#1D1611', size: 18 },
  { angle: -10, distance: 85, fill: '#1D1611', dot: '#FBF7F2', size: 20 },
];

const PinBurst = ({ burst }) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-0 w-0">
      <AnimatePresence>
        {burst > 0 ? (
          <motion.div key={burst} exit={{ opacity: 0 }}>
            {PINS.map((pin, index) => {
              const radians = (pin.angle * Math.PI) / 180;
              const dx = Math.cos(radians) * pin.distance;
              const dy = Math.sin(radians) * pin.distance;

              return (
                <motion.svg
                  key={index}
                  viewBox="-15 -42 30 44"
                  className="absolute"
                  style={{ width: pin.size, left: -pin.size / 2, top: -pin.size }}
                  initial={{ x: 0, y: 0, rotate: 0, scale: 0.6, opacity: 1 }}
                  animate={{
                    x: dx,
                    y: [0, dy, dy + 70],
                    rotate: pin.angle > -90 ? 25 : -25,
                    scale: 1,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.02,
                    ease: [0.23, 1, 0.32, 1],
                    y: { duration: 0.9, delay: index * 0.02, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] },
                    opacity: { duration: 0.9, delay: index * 0.02, times: [0, 0.7, 1] },
                  }}
                >
                  <path d={PIN_PATH} fill={pin.fill} stroke="#1D1611" strokeWidth={2} />
                  <circle cx={0} cy={-26} r={5} fill={pin.dot} />
                </motion.svg>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default PinBurst;
