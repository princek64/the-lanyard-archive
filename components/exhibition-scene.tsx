"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { BufferGeometry, DoubleSide, Float32BufferAttribute, Group, MathUtils, Object3D, VSMShadowMap } from "three";
import type { BadgeConfig } from "../lib/badges";
import { BadgeAttachment, BadgeMesh, units } from "./badge-mesh";
import { useBadgeTexture } from "./badge-texture";

interface Props {
  badges: BadgeConfig[];
  active: number;
  progress: RefObject<number>;
  paused: boolean;
  reducedMotion: boolean;
  onInspect: (index: number) => void;
  onReady: () => void;
  onUnavailable: () => void;
}

function RibbonPrint({ texture, repeat }: { texture: string; repeat: number }) {
  const map = useBadgeTexture(texture, repeat);
  return <meshStandardMaterial map={map} roughness={0.94} side={DoubleSide} />;
}

// Each half turns over the peg and opens out to the width of its clasp.
function Ribbon({ config, side }: { config: BadgeConfig; side: number }) {
  const { width, length, clipSpread, texture, repeatAspect, colour } = config.lanyard;
  const geometry = useMemo(() => {
    const positions: number[] = [], uv: number[] = [], indices: number[] = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const bow = Math.sin(Math.PI * t);
      const x = side * (0.025 * (1 - t) + units(clipSpread ?? 0) * t / 2 + bow * (clipSpread ? 0.065 : 0.125));
      const z = -0.014 + side * 0.036 * bow;
      const twist = side * (1.12 * (1 - t) + bow * 0.25);
      for (const edge of [-1, 1]) {
        const half = edge * units(width) / 2;
        positions.push(x + Math.cos(twist) * half, -t * units(length), z + Math.sin(twist) * half);
        uv.push((edge + 1) / 2, 1 - t);
      }
      const j = i * 2;
      if (i < segments) indices.push(j, j + 2, j + 1, j + 1, j + 2, j + 3);
    }
    const mesh = new BufferGeometry();
    mesh.setAttribute("position", new Float32BufferAttribute(positions, 3));
    mesh.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    mesh.setIndex(indices);
    mesh.computeVertexNormals();
    return mesh;
  }, [width, length, clipSpread, side]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} castShadow>
    {texture ? <RibbonPrint texture={texture} repeat={Math.max(1, length / (width * (repeatAspect ?? 3)))} />
      : <meshStandardMaterial color={colour} roughness={0.94} side={DoubleSide} />}
  </mesh>;
}

function DisplayBadge({ config, index, progress, active, reducedMotion, onInspect }: {
  config: BadgeConfig; index: number; progress: RefObject<number>; active: number; reducedMotion: boolean; onInspect: () => void;
}) {
  const mount = useRef<Group>(null);
  const pivot = useRef<Group>(null);
  const sway = useRef({ angle: 0, speed: 0 });
  useFrame(({ viewport }, dt) => {
    if (!pivot.current || !mount.current) return;
    const offset = index - (reducedMotion ? active : progress.current);
    const away = MathUtils.smoothstep(Math.abs(offset), 0, 1);
    const small = viewport.width < 3.3;
    const scale = 1 - away * (small ? 0.48 : 0.22);
    const pitch = Math.min(viewport.width * 0.42, 1.38);
    mount.current.position.set(offset * pitch, 1.27, 0);
    mount.current.scale.setScalar(scale);
    const spring = sway.current;
    const step = Math.min(dt, 0.035);
    spring.speed += (-27 * spring.angle - 3.1 * spring.speed) * step;
    spring.angle += spring.speed * step;
    pivot.current.rotation.z = reducedMotion ? 0 : spring.angle + (index % 2 ? 0.014 : -0.019);
    pivot.current.rotation.y = 0.06 + Math.sign(offset) * away * 0.64;
  });
  return <group ref={mount}>
    <mesh position-z={-0.11} rotation-x={Math.PI / 2} castShadow>
      <cylinderGeometry args={[0.036, 0.047, 0.31, 20]} />
      <meshStandardMaterial color="#a39580" metalness={0.4} roughness={0.34} />
    </mesh>
    <mesh position-z={0.048} scale={[1, 1, 0.54]} castShadow>
      <sphereGeometry args={[0.054, 20, 12]} />
      <meshStandardMaterial color="#ded2ba" metalness={0.48} roughness={0.28} />
    </mesh>
    <group ref={pivot} onClick={e => { e.stopPropagation(); onInspect(); }}
      onPointerOver={e => {
        e.stopPropagation();
        if (!reducedMotion) sway.current.speed = e.point.x >= (mount.current?.position.x ?? 0) ? -0.38 : 0.38;
      }}>
      <Ribbon config={config} side={-1} /><Ribbon config={config} side={1} />
      <group position-y={-units(config.lanyard.length)}>
        <BadgeAttachment config={config} /><BadgeMesh config={config} />
      </group>
    </group>
  </group>;
}

function HangingRail() {
  const { viewport } = useThree();
  return (
    <group position={[0, 1.30, -0.22]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[viewport.width * 1.2, 0.061, 0.065]} />
        <meshStandardMaterial color="#c4c2ba" metalness={0.17} roughness={0.49} />
      </mesh>
      <mesh position-z={0.034}>
        <planeGeometry args={[viewport.width * 1.2, 0.015]} />
        <meshStandardMaterial color="#464440" />
      </mesh>
    </group>
  );
}

function GalleryLight() {
  const target = useMemo(() => new Object3D(), []);
  return <>
    <primitive object={target} />
    <ambientLight intensity={1.04} />
    <spotLight target={target} position={[-1.1, 2.4, 3.4]} intensity={55}
      angle={0.95} penumbra={0.93} color="#fff8ef" castShadow
      shadow-mapSize={[1024, 1024]} shadow-radius={7} shadow-blurSamples={6} shadow-bias={-0.00035} shadow-normalBias={0.006} />
    <mesh receiveShadow position-z={-0.255}>
      <planeGeometry args={[30, 8]} /><shadowMaterial transparent opacity={0.24} />
    </mesh>
  </>;
}

function SceneLifecycle({ onReady, onUnavailable }: Pick<Props, "onReady" | "onUnavailable">) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onUnavailable);
    onReady();
    return () => canvas.removeEventListener("webglcontextlost", onUnavailable);
  }, [gl, onReady, onUnavailable]);
  return null;
}

export default function ExhibitionScene(props: Props) {
  return (
    <Canvas frameloop={props.paused ? "never" : "always"} shadows={{type: VSMShadowMap}}
      camera={{ position: [0, 0, 4.53], fov: 37, near: 0.1, far: 24 }}
      dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      <GalleryLight />
      <HangingRail />
      <Suspense fallback={null}>
        {props.badges.map((config, index) => Math.abs(props.active - index) <= 4 && (
          <DisplayBadge key={config.id} config={config} index={index} active={props.active} progress={props.progress}
            reducedMotion={props.reducedMotion} onInspect={() => props.onInspect(index)} />
        ))}
        <SceneLifecycle onReady={props.onReady} onUnavailable={props.onUnavailable} />
      </Suspense>
    </Canvas>
  );
}
