"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Group, MathUtils, Object3D, Vector3 } from "three";
import type { BadgeConfig } from "../lib/badges";
import { BadgeAttachment, BadgeMesh, units } from "./badge-mesh";
import { useBadgeTexture } from "./badge-texture";

interface Props {
  badges: BadgeConfig[];
  active: number;
  paused: boolean;
  reducedMotion: boolean;
  onInspect: (index: number) => void;
  onReady: () => void;
  onUnavailable: () => void;
}

const spacing = 2.48;
const depthStep = 0.76;

function PrintedRibbon({ texture, length, width }: { texture: string; length: number; width: number }) {
  const map = useBadgeTexture(texture, Math.max(1, length / (width * 3)));
  return <meshStandardMaterial map={map} roughness={0.94} />;
}

function DisplayBadge({ config, index, active, reducedMotion, onInspect }: {
  config: BadgeConfig; index: number; active: boolean; reducedMotion: boolean; onInspect: () => void;
}) {
  const pivot = useRef<Group>(null);
  const hovering = useRef(false);
  const lightTarget = useMemo(() => {
    const target = new Object3D();
    target.position.y = -1.9;
    return target;
  }, []);
  const length = units(config.lanyard.length);
  const width = units(config.lanyard.width);
  useFrame(({ clock }, delta) => {
    if (!pivot.current) return;
    const elapsed = clock.elapsedTime;
    const sway = reducedMotion ? 0 : Math.sin(elapsed * 1.07 + index * 1.8) * 0.035;
    const yaw = active ? (hovering.current && !reducedMotion ? 0.27 : 0.13) : (index % 2 ? -0.3 : 0.35);
    pivot.current.rotation.z = sway;
    pivot.current.rotation.y = reducedMotion ? yaw : MathUtils.damp(pivot.current.rotation.y, yaw, 5, delta);
  });

  return (
    <group position={[index * spacing, 1.43, -index * depthStep]}>
      <primitive object={lightTarget} />
      <spotLight position={[-0.65, 0.7, 2.7]} target={lightTarget} color="#f4eaff"
        intensity={active ? 22 : 9} distance={5} angle={0.46} penumbra={0.9} decay={2} />
      <group ref={pivot} onClick={event => { event.stopPropagation(); onInspect(); }}
        onPointerOver={event => { event.stopPropagation(); hovering.current = true; }}
        onPointerOut={() => { hovering.current = false; }}>
        <mesh position={[0, -length / 2, 0]}>
          <boxGeometry args={[width, length, 0.014]} />
          {config.lanyard.texture
            ? <PrintedRibbon texture={config.lanyard.texture} length={length} width={width} />
            : <meshStandardMaterial color={config.lanyard.colour} roughness={0.96} />}
        </mesh>
        <group position={[0, -length, 0]}>
          <BadgeAttachment thickness={config.dimensions.thickness} />
          <BadgeMesh config={config} />
        </group>
      </group>
    </group>
  );
}

function CameraTravel({ active, reducedMotion }: Pick<Props, "active" | "reducedMotion">) {
  const target = useRef(new Vector3());
  const { size } = useThree();
  useFrame(({ camera }, delta) => {
    const distance = size.width < 650 ? 4.95 : 4.45;
    target.current.set(active * spacing, 0.09, distance - active * depthStep);
    if (reducedMotion) camera.position.copy(target.current);
    else camera.position.lerp(target.current, 1 - Math.exp(-5 * delta));
  });
  return null;
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
    <Canvas frameloop={props.paused ? "never" : "always"} camera={{ position: [0, 0.09, 4.45], fov: 37, near: 0.1, far: 32 }}
      dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      <ambientLight color="#dddafa" intensity={0.64} />
      <directionalLight color="#c8d3ff" intensity={1.15} position={[1, 3, -4]} />
      <directionalLight color="#fff0db" intensity={0.72} position={[-3, 2, 4]} />
      <Suspense fallback={null}>
        {props.badges.map((config, index) => (
          <DisplayBadge key={config.id} config={config} index={index} active={props.active === index}
            reducedMotion={props.reducedMotion} onInspect={() => props.onInspect(index)} />
        ))}
        <CameraTravel active={props.active} reducedMotion={props.reducedMotion} />
        <SceneLifecycle onReady={props.onReady} onUnavailable={props.onUnavailable} />
      </Suspense>
    </Canvas>
  );
}
