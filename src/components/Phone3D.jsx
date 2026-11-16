import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/*
  O celular 3D do hero — só existe como melhoria por cima da captura
  (ver Phone3DUpgrade). Este arquivo inteiro, com three.js, fiber,
  drei e o .glb, é um pedaço separado que só é baixado quando o
  aparelho aguenta e a página já está ociosa.

  Modelo: "Samsung Phone" por DAKSH_2009 (https://skfb.ly/pFTxN),
  CC BY 4.0 — o crédito está no rodapé da home, como a licença pede.

  O encaixe da tela (UVs recalculadas e a correção de orientação) é o
  mesmo do PhoneModel antigo, que já tinha resolvido as esquisitices
  desse .glb; a explicação completa está em PhoneModel.jsx.

  O que mudou em relação ao antigo:
  - Arrastar gira o aparelho livre, com inércia: um peteleco dá a
    volta inteira, e ele assenta de frente sozinho. No desktop ele
    também segue o ponteiro em qualquer ponto da janela.
  - Balanço automático só sem "menos movimento"; com ele, parado de
    frente e sem seguir o ponteiro (arrastar continua funcionando, é
    ação da pessoa).
  - Avisa `onReady` no primeiro quadro desenhado com a tela aplicada:
    é o sinal pra trocar a captura pelo 3D sem buraco no meio.
*/
const MODEL = '/models/samsung-phone.glb';

const SCREEN_NODE_NAME = 'Display';

function remapScreenUVs(geometry) {
  const position = geometry.attributes.position;
  const count = position.count;

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < count; i += 1) {
    const x = position.getX(i);
    const z = position.getZ(i);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  const rangeX = maxX - minX || 1;
  const rangeZ = maxZ - minZ || 1;
  const uv = new Float32Array(count * 2);

  for (let i = 0; i < count; i += 1) {
    const x = position.getX(i);
    const z = position.getZ(i);
    // Eixo local mais comprido (X, ~7.9 de faixa) é a altura de
    // verdade do celular; o mais curto (Z, ~3.6) é a largura — bate
    // com a proporção 9:19.5 de tela, então U segue Z e V segue X.
    uv[i * 2] = (z - minZ) / rangeZ;
    uv[i * 2 + 1] = (x - minX) / rangeX;
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.attributes.uv.needsUpdate = true;
}

function computeScreenFacingCorrection(displayMesh) {
  displayMesh.updateWorldMatrix(true, false);

  const zAxis = new THREE.Vector3(0, 1, 0)
    .transformDirection(displayMesh.matrixWorld)
    .normalize();

  const heightAxis = new THREE.Vector3(1, 0, 0)
    .transformDirection(displayMesh.matrixWorld)
    .normalize();

  // Gram-Schmidt: tira de `heightAxis` a parte que já é paralela à
  // normal, sobrando só a parte perpendicular — sem isso os dois
  // eixos quase nunca ficam a 90° exatos um do outro.
  const yAxis = heightAxis
    .clone()
    .sub(zAxis.clone().multiplyScalar(heightAxis.dot(zAxis)))
    .normalize();

  const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis).normalize();

  const currentBasis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
  const currentOrientation = new THREE.Quaternion().setFromRotationMatrix(currentBasis);

  // A correção é o inverso: a rotação que desfaz a orientação atual
  // da tela e a deixa alinhada aos eixos do mundo.
  return currentOrientation.invert();
}

function Phone({ screenshotSrc, drag, pointer, still, onReady }) {
  const spinRef = useRef(null);
  const correctionRef = useRef(null);
  const fitRef = useRef(null);
  const ready = useRef(false);
  const fitted = useRef(false);
  const { scene } = useGLTF(MODEL);
  const texture = useTexture(screenshotSrc);

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    cloned.traverse((child) => {
      if (child.isMesh && child.name === SCREEN_NODE_NAME) {
        child.geometry = child.geometry.clone();
        remapScreenUVs(child.geometry);
        child.material = child.material.clone();
        child.material.map = texture;
        child.material.emissive = new THREE.Color(0xffffff);
        child.material.emissiveMap = texture;
        child.material.emissiveIntensity = 1.0;
        child.material.roughness = 0.3;
        child.material.metalness = 0;
        child.material.toneMapped = false;
        child.material.needsUpdate = true;
      }
    });
    return cloned;
  }, [scene, texture]);

  useEffect(() => {
    let displayMesh = null;
    model.traverse((child) => {
      if (child.isMesh && child.name === SCREEN_NODE_NAME) displayMesh = child;
    });
    if (!displayMesh || !correctionRef.current || !fitRef.current) return;
    correctionRef.current.quaternion.copy(computeScreenFacingCorrection(displayMesh));
    correctionRef.current.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(correctionRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 2.1 / (Math.max(size.x, size.y, size.z) || 1);
    fitRef.current.scale.setScalar(s);
    fitRef.current.position.copy(center).multiplyScalar(-s);
    fitted.current = true;
  }, [model]);

  useFrame((state, delta) => {
    const g = spinRef.current;
    if (!g) return;
    if (fitted.current && !ready.current) {
      ready.current = true;
      /* Espera o quadro seguinte: aí a imagem já está na tela. */
      requestAnimationFrame(() => onReady?.());
    }

    const d = drag.current;
    const p = pointer.current;
    const dt = Math.min(delta, 1 / 30) * 60;
    /* Solto, o giro continua com a velocidade do gesto e vai perdendo
       força; quando quase para, uma mola puxa de volta pra frente pela
       volta mais curta. Assim um "peteleco" dá a volta inteira. */
    if (!d.active) {
      d.y += d.vy * dt;
      d.vy *= Math.pow(0.95, dt);
      if (Math.abs(d.vy) < 0.02) {
        const turn = Math.PI * 2;
        const rest = Math.round(d.y / turn) * turn;
        d.y += (rest - d.y) * 0.05 * dt;
      }
      d.x *= Math.pow(0.92, dt);
    }
    const sway = still ? 0 : Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    const follow = still || d.active ? 0 : 1;
    const targetY = d.y + sway + p.x * 0.45 * follow;
    const targetX = 0.04 + d.x + p.y * 0.22 * follow;
    const k = d.active ? 0.35 : 0.08;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
    /* Flutua de leve, como se estivesse na mão. */
    g.position.y = still ? 0 : Math.sin(state.clock.elapsedTime * 0.9) * 0.04;
  });

  return (
    <group ref={spinRef}>
      <group ref={fitRef}>
        <group ref={correctionRef}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}

const Phone3D = ({ screenshotSrc, still = false, onReady, className, style }) => {
  const drag = useRef({ active: false, x: 0, y: 0, vy: 0, px: 0, py: 0 });
  /* Ponteiro na janela inteira, de -1 a 1 — não só em cima do canvas:
     o celular "olha" pra onde o mouse está em qualquer ponto do hero. */
  const pointer = useRef({ x: 0, y: 0 });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (still) return undefined;
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [still]);

  const onPointerDown = (event) => {
    const d = drag.current;
    d.active = true;
    d.vy = 0;
    d.px = event.clientX;
    d.py = event.clientY;
    setTouched(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event) => {
    const d = drag.current;
    if (!d.active) return;
    const dy = (event.clientX - d.px) * 0.012;
    d.y += dy;
    d.vy = d.vy * 0.5 + dy * 0.5;
    d.x = Math.max(-0.5, Math.min(0.5, d.x + (event.clientY - d.py) * 0.006));
    d.px = event.clientX;
    d.py = event.clientY;
  };
  const onPointerUp = () => {
    drag.current.active = false;
  };

  return (
    <div
      className={className}
      style={{ touchAction: 'pan-y', cursor: 'grab', ...style }}
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ fov: 30, position: [0, 0, 4.6] }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-4, -2, -3]} intensity={0.35} />
        <Suspense fallback={null}>
          <Phone screenshotSrc={screenshotSrc} drag={drag} pointer={pointer} still={still} onReady={onReady} />
          {/* Sombra de contato no "chão" — é o que tira o celular de
              adesivo colado na página e põe ele no espaço. */}
          <ContactShadows position={[0, -1.2, 0]} opacity={0.35} scale={4} blur={2.6} far={2} resolution={256} color="#3a1408" />
          {/* Luz de estúdio sintética, sem baixar .hdr de CDN (ver
              PhoneModel.jsx): faixas claras que correm pela moldura
              e pelo vidro quando o aparelho gira. */}
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={3} position={[2.5, 2, 3]} scale={[1.2, 5, 1]} color="#fff3ea" />
            <Lightformer form="rect" intensity={1.6} position={[-3, 0, 2]} scale={[1, 5, 1]} color="#ffd7bb" />
            <Lightformer form="rect" intensity={1.2} position={[0, 4, 1]} rotation-x={Math.PI / 2} scale={[5, 1, 1]} color="#ffffff" />
            <Lightformer form="ring" intensity={0.8} position={[0, 3, -2]} scale={3} color="#ffffff" />
          </Environment>
        </Suspense>
      </Canvas>
      {/* Convite discreto pra mexer; some depois do primeiro toque. */}
      <span
        className="pointer-events-none absolute bottom-[6%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-night/70 px-3 py-1 text-[12px] font-medium text-cream backdrop-blur transition-opacity duration-500"
        style={{ opacity: touched ? 0 : 1 }}
      >
        Arraste pra girar
      </span>
    </div>
  );
};

export default Phone3D;
