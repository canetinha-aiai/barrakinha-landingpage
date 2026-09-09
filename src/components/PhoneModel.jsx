import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/samsung-phone.glb');

/*
  Modelo 3D de verdade no lugar do vídeo — "Samsung Phone" por
  DAKSH_2009 (sketchfab.com/3d-models/samsung-phone-...), licença
  CC BY 4.0; crédito completo no rodapé da página, como a licença pede.

  O modelo já vem com um nó chamado "Display" — a tela, com um material
  próprio (`Material.001`) que nenhum outro pedaço do telefone usa.
  Achei isso inspecionando o JSON dentro do `.glb` (não tem documentação
  junto do arquivo): é nele que a screenshot entra, como
  `map`+`emissiveMap` — `emissive` porque uma tela de celular não
  reflete luz de ambiente como o resto do corpo, ela *emite* a própria
  luz; sem isso a screenshot ficaria escura e baça feito uma superfície
  qualquer.

  As UVs que vieram com essa malha ocupam só um retalho minúsculo do
  espaço de textura (sobra de um atlas que nunca teve imagem nenhuma —
  o `.glb` original não embute textura alguma, só cor chapada). A
  correção é recalcular as UVs a partir da própria geometria
  (`remapScreenUVs`): a malha da tela é plana (todo vértice com o mesmo
  Y local), então uma projeção planar simples cobre o retângulo de
  ponta a ponta.

  O arquivo também vem numa escala e offset bem fora do normal (o nó
  raiz tem escala 43× e um deslocamento de dezenas de unidades) e cada
  nó carrega sua própria rotação — não dava pra confiar em nenhum eixo
  “óbvio”. Em vez de adivinhar um ângulo fixo, ou de usar o `<Bounds>`
  do drei (que calcula o enquadramento da câmera *antes* da correção
  rodar, e com essa escala esquisita mandava a câmera pra Y=189), o
  componente calcula tudo na mão, uma vez, depois que a malha já está
  na cena:
  1. `computeScreenFacingCorrection` mede a normal e o eixo "altura" da
     tela em coordenadas de mundo e monta o giro que os alinha aos
     eixos padrão (normal→+Z, de frente pra câmera; altura→+Y, de pé).
  2. Com o modelo já corrigido, calcula a caixa (bounding box) de
     verdade, centraliza nela e normaliza a escala pra caber num cubo
     de ~2 unidades — assim a câmera fixa abaixo sempre enquadra
     direito, não importa a escala nativa do arquivo.
*/
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

function Phone({ screenshotSrc }) {
  const spinRef = useRef(null);
  const correctionRef = useRef(null);
  const fitRef = useRef(null);
  const { scene } = useGLTF('/models/samsung-phone.glb');
  const texture = useTexture(screenshotSrc);

  const model = useMemo(() => {
    const cloned = scene.clone(true);

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    cloned.traverse((child) => {
      if (child.isMesh && child.name === SCREEN_NODE_NAME) {
        // `Object3D.clone()` não clona a geometria, só a referencia —
        // sem clonar aqui, mexer nas UVs mexeria na malha cacheada
        // pelo `useGLTF` e compartilhada por toda instância deste
        // componente na página.
        child.geometry = child.geometry.clone();
        remapScreenUVs(child.geometry);
        child.material = child.material.clone();
        child.material.map = texture;
        child.material.emissive = new THREE.Color(0xffffff);
        child.material.emissiveMap = texture;
        child.material.emissiveIntensity = 1.05;
        child.material.roughness = 0.35;
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

    // 1) Levanta a tela pra encarar a câmera.
    correctionRef.current.quaternion.copy(computeScreenFacingCorrection(displayMesh));
    correctionRef.current.updateMatrixWorld(true);

    // 2) Com a orientação já certa, mede a caixa de verdade do modelo
    // e centraliza + normaliza a escala nela — sem depender de
    // nenhum "auto-fit" de câmera, que com a escala nativa (43×) e o
    // deslocamento (dezenas de unidades) desse arquivo específico
    // saía do controle.
    const box = new THREE.Box3().setFromObject(correctionRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 2.1 / maxDim;

    // `fitRef` escala primeiro e desloca depois, na MESMA escala —
    // `correctionRef` (por dentro) não leva nenhum deslocamento
    // próprio, só a rotação. Só assim o centro do modelo (medido em
    // unidades não-escaladas) cai exatamente na origem depois que a
    // escala é aplicada: posição de mundo = -centro*s + s*centro = 0.
    fitRef.current.scale.setScalar(s);
    fitRef.current.position.copy(center).multiplyScalar(-s);
  }, [model]);

  /*
    Gira devagar sozinho e inclina um pouco a mais seguindo o mouse —
    mesma ideia do tilt dos cartões de "antes/depois", só que em 3D de
    verdade. `lerp` (a interpolação a cada quadro) é o que dá o peso —
    sem ele, o ângulo pularia direto pra posição do cursor.

    Um giro contínuo sem limite (só `elapsedTime * velocidade`) chegou
    a virar o celular de costas boa parte do tempo — errado pra um
    produto cuja tela é o que importa mostrar. Trocado por um balanço:
    `Math.sin(tempo)` oscila pra frente e pra trás dentro de um teto
    pequeno, nunca passa de mostrar a tela de um ângulo bom.
  */
  useFrame((state) => {
    const g = spinRef.current;
    if (!g) return;

    const sway = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    const targetY = sway + state.pointer.x * 0.22;
    const targetX = 0.04 - state.pointer.y * 0.12;

    g.rotation.y += (targetY - g.rotation.y) * 0.04;
    g.rotation.x += (targetX - g.rotation.x) * 0.04;
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

const PhoneModel = ({ screenshotSrc, className, ariaLabel }) => {
  return (
    <div className={className} role="img" aria-label={ariaLabel}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 30, position: [0, 0, 4.6] }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-4, -2, -3]} intensity={0.35} />

        <Suspense fallback={null}>
          <Phone screenshotSrc={screenshotSrc} />
          {/* Ambiente de estúdio 100% local — nada de arquivo `.hdr`
              baixado de CDN externo (o preset pronto do drei faz isso,
              e um 503 naquele CDN derrubava o WebGL da página
              inteira). `Lightformer` são painéis de luz sintéticos,
              só pra dar reflexo na moldura de vidro/metal do celular —
              não carregam nenhum arquivo. */}
          <Environment resolution={128}>
            <Lightformer form="rect" intensity={2.5} position={[2, 2, 3]} scale={[3, 3, 1]} color="#fff3ea" />
            <Lightformer form="rect" intensity={1.2} position={[-3, -1, 2]} scale={[2, 4, 1]} color="#ffd7bb" />
            <Lightformer form="ring" intensity={1} position={[0, 3, -2]} scale={3} color="#ffffff" />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoneModel;
