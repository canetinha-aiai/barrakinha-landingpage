import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/*
  A praça em 3D da página /barrakinha-x-ifood.

  Você é o pino laranja no meio. Um "radar" sai de você em ondas e, a
  cada barraca que a onda alcança, a barraca sobe do chão com mola e
  ganha o nome da comida e a distância. É a ideia da página inteira:
  na praça, com fome, você vê o que tem aberto em volta.

  Tudo é geometria simples feita aqui (caixa, cilindro, cone): nada de
  .glb, então o pedaço inteiro é só o three.js que a página já tinha
  como dependência. Arquivo carregado com React.lazy, depois que a
  página assenta (ver PracaHero); antes disso e no HTML pré-renderizado
  fica a barraquinha em SVG.

  Interação: no desktop a praça inclina atrás do ponteiro; arrastar gira
  a praça (com inércia), em qualquer aparelho. Com "menos movimento" a
  cena nasce montada e parada (arrastar continua funcionando).
*/

const C = {
  ground: '#EFE5D8',
  path: '#E2D5C4',
  grass: '#C9D3A8',
  grassDark: '#A9B887',
  trunk: '#8A6A50',
  ember: '#F85A35',
  emberDark: '#D9461F',
  cream: '#FBF7F2',
  wood: '#E9D9C3',
  woodDark: '#CDB596',
  ink: '#1D1611',
  mustard: '#FFC23D',
};

/* As barracas em volta: ângulo (graus), raio, comida, distância. */
export const STALLS = [
  { angle: -30, r: 3.1, food: 'Pastel', dist: '80 m', rot: 0.4 },
  { angle: 40, r: 3.6, food: 'Espetinho', dist: '120 m', rot: -0.5 },
  { angle: 115, r: 3.0, food: 'Tapioca', dist: '95 m', rot: 0.9 },
  { angle: 190, r: 3.7, food: 'Açaí', dist: '150 m', rot: -1.1 },
  { angle: 255, r: 3.3, food: 'Churros', dist: '110 m', rot: 1.6 },
];

const TREES = [
  [-4.6, -1.2, 1.0],
  [4.7, 0.6, 1.15],
  [1.2, 4.8, 0.9],
  [-1.8, -4.7, 1.05],
  [-4.2, 3.2, 0.85],
  [3.6, -3.6, 0.95],
];

const toXZ = (angle, r) => {
  const a = (angle * Math.PI) / 180;
  return [Math.cos(a) * r, Math.sin(a) * r];
};

const PERIOD = 3.2; // segundos entre ondas do radar
const MAX_R = 4.4; // até onde a onda vai

/* ---------- peças ---------- */

const Ground = () => (
  <group>
    {/* gramado */}
    <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
      <circleGeometry args={[6.2, 64]} />
      <meshStandardMaterial color={C.grass} roughness={1} />
    </mesh>
    {/* calçada da praça */}
    <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
      <ringGeometry args={[2.2, 4.4, 64]} />
      <meshStandardMaterial color={C.ground} roughness={1} />
    </mesh>
    {/* miolo */}
    <mesh rotation-x={-Math.PI / 2} position-y={0.001} receiveShadow>
      <circleGeometry args={[1.2, 48]} />
      <meshStandardMaterial color={C.path} roughness={1} />
    </mesh>
    {/* caminhos em cruz */}
    {[0, Math.PI / 2].map((r) => (
      <mesh key={r} rotation-x={-Math.PI / 2} rotation-z={r} position-y={0.0005} receiveShadow>
        <planeGeometry args={[12.2, 0.8]} />
        <meshStandardMaterial color={C.ground} roughness={1} />
      </mesh>
    ))}
    {/* borda da base, pra praça parecer uma peça */}
    <mesh position-y={-0.32}>
      <cylinderGeometry args={[6.2, 6.2, 0.6, 64]} />
      <meshStandardMaterial color={C.grassDark} roughness={1} />
    </mesh>
  </group>
);

const Tree = ({ position: [x, z, s] }) => (
  <group position={[x, 0, z]} scale={s}>
    <mesh position-y={0.35} castShadow>
      <cylinderGeometry args={[0.08, 0.11, 0.7, 8]} />
      <meshStandardMaterial color={C.trunk} roughness={0.9} />
    </mesh>
    <mesh position-y={1.0} castShadow>
      <icosahedronGeometry args={[0.55, 0]} />
      <meshStandardMaterial color={C.grassDark} roughness={0.9} flatShading />
    </mesh>
  </group>
);

/* Toldo listrado: tiras alternadas laranja/creme, inclinadas pra frente. */
const Awning = () => {
  const stripes = 6;
  const w = 1.3 / stripes;
  return (
    <group position={[0, 1.25, 0.12]} rotation-x={0.32}>
      {Array.from({ length: stripes }, (_, i) => (
        <mesh key={i} position={[-0.65 + w / 2 + i * w, 0, 0]} castShadow>
          <boxGeometry args={[w, 0.05, 0.95]} />
          <meshStandardMaterial color={i % 2 ? C.cream : C.ember} roughness={0.7} />
        </mesh>
      ))}
      {/* barra de meias-luas na frente */}
      {Array.from({ length: stripes }, (_, i) => (
        <mesh
          key={`s${i}`}
          position={[-0.65 + w / 2 + i * w, -0.06, 0.475]}
          rotation-x={Math.PI / 2}
          castShadow
        >
          <cylinderGeometry args={[w / 2, w / 2, 0.04, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={i % 2 ? C.cream : C.ember} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const Bulbs = ({ lit }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((bulb, i) => {
      const on = lit ? 0.6 + 0.4 * Math.sin(clock.elapsedTime * 3 + i) : 0;
      bulb.material.emissiveIntensity = on;
    });
  });
  return (
    <group ref={ref} position={[0, 1.08, 0.6]}>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-0.52 + i * 0.26, -Math.sin((i / 4) * Math.PI) * 0.06, 0]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color={C.mustard} emissive={C.mustard} emissiveIntensity={0} />
        </mesh>
      ))}
    </group>
  );
};

/*
  Uma barraca. `shown` vira true quando a onda do radar chega nela;
  daí ela sobe do chão numa mola feita à mão (posição e velocidade por
  quadro), com um quique curto.
*/
const Stall = ({ stall, shown, still }) => {
  const [x, z] = toXZ(stall.angle, stall.r);
  const group = useRef();
  const state = useRef({ s: still ? 1 : 0, v: 0 });

  useFrame((_, dt) => {
    const st = state.current;
    const target = shown ? 1 : 0;
    if (still) st.s = target;
    else {
      const k = 120;
      const d = 11;
      const a = k * (target - st.s) - d * st.v;
      st.v += a * Math.min(dt, 1 / 30);
      st.s += st.v * Math.min(dt, 1 / 30);
    }
    if (group.current) {
      const s = Math.max(0.0001, st.s);
      group.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[x, 0, z]} rotation-y={stall.rot}>
      <group ref={group}>
        {/* balcão */}
        <RoundedBox args={[1.3, 0.6, 0.7]} radius={0.04} position-y={0.3} castShadow receiveShadow>
          <meshStandardMaterial color={C.wood} roughness={0.8} />
        </RoundedBox>
        {/* tampo */}
        <mesh position={[0, 0.62, 0.02]} castShadow>
          <boxGeometry args={[1.38, 0.05, 0.78]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.8} />
        </mesh>
        {/* frente laranja do balcão */}
        <mesh position={[0, 0.3, 0.352]}>
          <planeGeometry args={[1.1, 0.34]} />
          <meshStandardMaterial color={C.ember} roughness={0.8} />
        </mesh>
        {/* postes */}
        {[-0.6, 0.6].map((px) =>
          [-0.3, 0.3].map((pz) => (
            <mesh key={`${px}${pz}`} position={[px, 0.95, pz]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
              <meshStandardMaterial color={C.ink} roughness={0.6} />
            </mesh>
          )),
        )}
        <Awning />
        <Bulbs lit={shown} />
        {/* comidinha no balcão */}
        <mesh position={[0.3, 0.72, 0.05]} castShadow>
          <sphereGeometry args={[0.1, 12, 10]} />
          <meshStandardMaterial color={C.mustard} roughness={0.6} />
        </mesh>
        <mesh position={[0.05, 0.7, 0.1]} castShadow>
          <sphereGeometry args={[0.08, 12, 10]} />
          <meshStandardMaterial color={C.mustard} roughness={0.6} />
        </mesh>
      </group>

      {shown ? (
        <Html position={[0, 1.85, 0]} center zIndexRange={[10, 0]} pointerEvents="none">
          <div className="praca-label">
            <strong>{stall.food}</strong>
            <span>{stall.dist}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
};

/* Você: o pino laranja que boia no meio da praça. */
const You = ({ still }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current && !still) ref.current.position.y = 0.75 + Math.sin(clock.elapsedTime * 2.2) * 0.08;
  });
  return (
    <group>
      <group ref={ref} position-y={0.75}>
        <mesh castShadow>
          <sphereGeometry args={[0.32, 32, 24]} />
          <meshStandardMaterial color={C.ember} roughness={0.35} />
        </mesh>
        <mesh position-y={-0.38} rotation-x={Math.PI} castShadow>
          <coneGeometry args={[0.24, 0.45, 32]} />
          <meshStandardMaterial color={C.ember} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.02, 0.27]}>
          <sphereGeometry args={[0.12, 20, 16]} />
          <meshStandardMaterial color={C.cream} roughness={0.5} />
        </mesh>
      </group>
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}>
        <circleGeometry args={[0.22, 32]} />
        <meshBasicMaterial color={C.emberDark} transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

/* As ondas do radar e quem já foi alcançado. */
const Radar = ({ onReach, still }) => {
  const rings = useRef([]);
  const reached = useRef(new Set());

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = ((t + (i * PERIOD) / 2) % PERIOD) / PERIOD;
      const r = 0.3 + phase * MAX_R;
      ring.scale.set(r, r, r);
      ring.material.opacity = still ? 0 : 0.5 * (1 - phase);
    });
    /* a primeira onda descobre as barracas, uma vez só */
    const first = Math.min(t / PERIOD, 1) * MAX_R + 0.3;
    STALLS.forEach((s, i) => {
      if (!reached.current.has(i) && first >= s.r) {
        reached.current.add(i);
        onReach(i);
      }
    });
  });

  return (
    <group position-y={0.02}>
      {[0, 1].map((i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.96, 1, 96]} />
          <meshBasicMaterial color={C.ember} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/*
  Giro: arrastar gira a praça com inércia; o ponteiro (desktop) inclina
  um pouco; parado, ela gira devagar sozinha.
*/
const Turntable = ({ children, still, pointer, drag }) => {
  const ref = useRef();
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const d = drag.current;
    if (!d.active) {
      d.vel *= Math.pow(0.04, dt);
      d.rot += d.vel * dt;
      if (!still) d.rot += dt * 0.08;
    }
    g.rotation.y = d.rot;
    const tx = still ? 0 : pointer.current.y * 0.08;
    const tz = still ? 0 : pointer.current.x * 0.05;
    g.rotation.x += (tx - g.rotation.x) * Math.min(1, dt * 4);
    g.rotation.z += (tz - g.rotation.z) * Math.min(1, dt * 4);
  });
  return <group ref={ref}>{children}</group>;
};

const Scene = ({ still, pointer, drag, onReady }) => {
  const [shown, setShown] = useState(() => (still ? STALLS.map(() => true) : STALLS.map(() => false)));
  const readyOnce = useRef(false);
  useFrame(() => {
    if (!readyOnce.current) {
      readyOnce.current = true;
      onReady?.();
    }
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={['#FFF6EA', '#C9B9A6', 0.6]} />
      <directionalLight
        position={[5, 9, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <Turntable still={still} pointer={pointer} drag={drag}>
        <Ground />
        {TREES.map((t, i) => (
          <Tree key={i} position={t} />
        ))}
        <Radar
          still={still}
          onReach={(i) => setShown((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v))))}
        />
        {STALLS.map((s, i) => (
          <Stall key={s.food} stall={s} shown={shown[i]} still={still} />
        ))}
        <You still={still} />
      </Turntable>
      <ContactShadows position-y={-0.62} opacity={0.25} scale={16} blur={2.4} far={2} />
    </>
  );
};

const PracaScene = ({ className, onReady }) => {
  const [still] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const pointer = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, rot: -0.35, vel: 0, lastX: 0, lastT: 0 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return undefined;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const onDown = (e) => {
    const d = drag.current;
    d.active = true;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    d.vel = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const now = performance.now();
    const dx = e.clientX - d.lastX;
    const dt = Math.max(1, now - d.lastT) / 1000;
    d.rot += dx * 0.01;
    d.vel = (dx * 0.01) / dt;
    d.lastX = e.clientX;
    d.lastT = now;
  };
  const onUp = () => {
    drag.current.active = false;
  };

  return (
    <div
      className={className}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      /* pan-y: no celular, deslizar na vertical continua rolando a página;
         só o arrasto de lado gira a praça. */
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [10.5, 9.6, 10.5], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
      >
        <Scene still={still} pointer={pointer} drag={drag} onReady={onReady} />
      </Canvas>
    </div>
  );
};

export default PracaScene;
