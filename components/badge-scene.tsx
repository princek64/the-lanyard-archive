"use client";

import { OrthographicCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect } from "react";
import type { BadgeConfig } from "../lib/badges";
import { BadgeRig } from "./badge-rig";
import { units } from "./badge-mesh";
import { anchorY } from "./lanyard";

export interface SceneProps {
  config: BadgeConfig;
  back: boolean;
  reducedMotion: boolean;
  onFlip: () => void;
  onReady: () => void;
  onUnavailable: () => void;
}

function StudioLighting() {
  return (
    <>
      <hemisphereLight args={["#dfe5ff", "#515362", 1.8]} />
      <directionalLight position={[-3, 4, 5]} intensity={2.35} color="#fff4e4" castShadow
        shadow-mapSize={[512, 512]} shadow-bias={-0.00015}
        shadow-camera-left={-2} shadow-camera-right={2}
        shadow-camera-top={2} shadow-camera-bottom={-2} />
      <directionalLight position={[3, 1, -4]} intensity={2.6} color="#acbbff" />
      <directionalLight position={[2, -1, 4]} intensity={0.55} />
    </>
  );
}

function StudioCamera({ config, onUnavailable }: Pick<SceneProps, "config" | "onUnavailable">) {
  const { size, gl } = useThree();
  const { dimensions, lanyard } = config;
  const displayHeight = units(dimensions.height + lanyard.length);
  const zoom = Math.min(size.height / (displayHeight + 0.20), size.width / (units(dimensions.width) + 0.95));
  const bottomClearance = size.width < 480 ? 0.41 : 0.34;
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onUnavailable);
    return () => canvas.removeEventListener("webglcontextlost", onUnavailable);
  }, [gl, onUnavailable]);
  return <OrthographicCamera makeDefault zoom={Math.max(1, zoom)}
    position={[0, anchorY - displayHeight / 2 - bottomClearance, 6]} near={0.1} far={30} />;
}

export default function BadgeScene(props: SceneProps) {
  return (
    <Canvas orthographic camera={{ position: [0, 0, 6], near: 0.1, far: 30 }}
      dpr={[1, 1.5]} shadows gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={null}>
      <StudioCamera config={props.config} onUnavailable={props.onUnavailable} />
      <StudioLighting />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} numSolverIterations={8}>
          <BadgeRig {...props} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
