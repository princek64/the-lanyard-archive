"use client";

import { useEffect, useMemo } from "react";
import { ExtrudeGeometry, Shape } from "three";
import { ribbonOffsets, type BadgeConfig } from "../lib/badges";
import { useBadgeTexture } from "./badge-texture";

export const units = (millimetres: number) => millimetres / 100;
export const clipLength = 0.22;

export function BadgeMesh({ config }: { config: BadgeConfig }) {
  const { width, height, thickness, radius } = config.dimensions;
  const front = useBadgeTexture(config.artwork.front);
  const back = useBadgeTexture(config.artwork.back);
  const geometry = useMemo(() => {
    const w = units(width), h = units(height), d = units(thickness);
    const bevel = Math.min(d * 0.22, units(radius) / 2);
    const r = Math.min(units(radius) - bevel, w / 2 - bevel, h / 2 - bevel);
    const x = w / 2 - bevel, y = h / 2 - bevel;
    const shape = new Shape();
    shape.moveTo(-x + r, -y);
    shape.lineTo(x - r, -y);
    shape.quadraticCurveTo(x, -y, x, -y + r);
    shape.lineTo(x, y - r);
    shape.quadraticCurveTo(x, y, x - r, y);
    shape.lineTo(-x + r, y);
    shape.quadraticCurveTo(-x, y, -x, y - r);
    shape.lineTo(-x, -y + r);
    shape.quadraticCurveTo(-x, -y, -x + r, -y);
    const mesh = new ExtrudeGeometry(shape, {
      depth: d - 2 * bevel, bevelThickness: bevel, bevelSize: bevel,
      bevelSegments: 2, curveSegments: 6,
    });
    mesh.translate(0, 0, -d / 2 + bevel);
    const positions = mesh.getAttribute("position");
    const uv = mesh.getAttribute("uv");
    const cap = mesh.groups[0];
    const edge = mesh.groups[1];
    mesh.clearGroups();
    for (let i = cap.start; i < cap.start + cap.count; i += 3) {
      const frontFace = positions.getZ(i) > 0;
      const material = frontFace ? 0 : 1;
      const previous = mesh.groups.at(-1);
      if (previous?.materialIndex === material) previous.count += 3;
      else mesh.addGroup(i, 3, material);
      for (let v = i; v < i + 3; v++) {
        uv.setXY(v, 0.5 + (frontFace ? 1 : -1) * positions.getX(v) / w,
          0.5 + positions.getY(v) / h);
      }
    }
    mesh.addGroup(edge.start, edge.count, 2);
    return mesh;
  }, [width, height, thickness, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group position-y={-clipLength - units(height) / 2}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial attach="material-0" map={front} roughness={0.68} />
        <meshStandardMaterial attach="material-1" map={back} roughness={0.72} />
        <meshStandardMaterial attach="material-2" color={config.artwork.edge} roughness={0.49} />
      </mesh>
      {config.body === "electronic" && <ElectronicControls config={config} />}
    </group>
  );
}

const controlCentres = [[208, 715], [115, 788], [288, 787], [208, 862], [579, 727], [481, 824]];

function ElectronicControls({ config }: { config: BadgeConfig }) {
  const { width, height, thickness } = config.dimensions;
  return (
    <group position-z={units(thickness) / 2}>
      {controlCentres.map(([x, y]) => (
        <group key={`${x},${y}`} position={[(x / 720 - 0.5) * units(width), (0.5 - y / 1000) * units(height), 0.013]} rotation-x={Math.PI / 2}>
          <mesh castShadow>
            <cylinderGeometry args={[0.041, 0.047, 0.025, 8]} />
            <meshStandardMaterial color="#55525e" roughness={0.68} metalness={0.22} />
          </mesh>
          <mesh position-y={0.016} castShadow>
            <cylinderGeometry args={[0.033, 0.038, 0.014, 8]} />
            <meshStandardMaterial color="#27262e" roughness={0.76} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SwivelClip({ thickness, ribbonWidth }: { thickness: number; ribbonWidth: number }) {
  const depth = units(thickness) / 2;
  const loopWidth = units(ribbonWidth) + 0.027;

  return (
    <group>
      {[-1, 1].map(side => (
        <mesh key={side} position={[side * loopWidth / 2, -0.035, 0]} castShadow>
          <boxGeometry args={[0.018, 0.092, 0.023]} />
          <meshStandardMaterial color="#c8c6c1" metalness={0.63} roughness={0.25} />
        </mesh>
      ))}
      {[-0.073, 0.003].map(y => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[loopWidth + 0.018, 0.017, 0.023]} />
          <meshStandardMaterial color="#c8c6c1" metalness={0.63} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, -0.112, 0.006]} rotation={[0, 0.45, -0.23]} castShadow>
        <torusGeometry args={[0.032, 0.009, 10, 24]} />
        <meshStandardMaterial color="#c8c6c1" metalness={0.63} roughness={0.25} />
      </mesh>
      {[-1, 1].map(side => (
        <group key={side} position-z={side * (depth + 0.014)}>
          <mesh position-y={-0.19} castShadow>
            <boxGeometry args={[0.078, 0.127, 0.024]} />
            <meshStandardMaterial color={side === 1 ? "#8c817b" : "#aaa39b"} metalness={0.52} roughness={0.32} />
          </mesh>
          <mesh position-y={-0.25} castShadow>
            <boxGeometry args={[0.094, 0.015, 0.027]} />
            <meshStandardMaterial color="#cdc7c0" metalness={0.61} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SnapHook({ thickness, ribbonWidth }: { thickness: number; ribbonWidth: number }) {
  const front = units(thickness) / 2 + 0.012;
  return (
    <group>
      <mesh position={[0, -0.033, 0]} scale={[units(ribbonWidth) / 0.13, 0.86, 1]} castShadow>
        <torusGeometry args={[0.064, 0.008, 10, 28]} />
        <meshStandardMaterial color="#c7c2bd" metalness={0.68} roughness={0.27} />
      </mesh>
      <mesh position={[0, -0.122, front]} castShadow>
        <capsuleGeometry args={[0.023, 0.063, 5, 12]} />
        <meshStandardMaterial color="#9e9792" metalness={0.62} roughness={0.28} />
      </mesh>
      <mesh position={[-0.022, -0.139, front]} rotation-z={-0.96} castShadow>
        <capsuleGeometry args={[0.01, 0.044, 4, 10]} />
        <meshStandardMaterial color="#a49d95" metalness={0.64} roughness={0.29} />
      </mesh>
      <mesh position={[0.005, -0.207, front]} rotation-z={0.66} scale={[0.83, 1.18, 1]} castShadow>
        <torusGeometry args={[0.049, 0.0085, 10, 32, Math.PI * 1.78]} />
        <meshStandardMaterial color="#d2ceca" metalness={0.68} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function BadgeAttachment({ config }: { config: BadgeConfig }) {
  const { thickness } = config.dimensions;
  if (config.attachment) {
    const Attachment = config.attachment === "snap-hook" ? SnapHook : SwivelClip;
    return ribbonOffsets(config.lanyard).map(offset => (
      <group key={offset} position-x={units(offset)}>
        <Attachment thickness={thickness} ribbonWidth={config.lanyard.width} />
        {config.lanyard.sleeveColour && (
          <mesh position-y={0.035} castShadow>
            <boxGeometry args={[units(config.lanyard.width) + 0.006, 0.045, 0.02]} />
            <meshStandardMaterial color={config.lanyard.sleeveColour} metalness={0.62} roughness={0.32} />
          </mesh>
        )}
      </group>
    ));
  }

  return (
    <group>
      <mesh position={[0, -0.026, 0]} castShadow>
        <boxGeometry args={[0.158, 0.082, 0.046]} />
        <meshStandardMaterial color="#232633" roughness={0.56} />
      </mesh>
      <mesh position={[0, -0.112, 0.005]} scale={[0.69, 1.15, 1]} castShadow>
        <torusGeometry args={[0.062, 0.014, 10, 32]} />
        <meshStandardMaterial color="#c4c8d0" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.225, units(thickness) / 2 + 0.015]} castShadow>
        <capsuleGeometry args={[0.027, 0.09, 5, 12]} />
        <meshStandardMaterial color="#a9afb8" metalness={0.74} roughness={0.31} />
      </mesh>
      <mesh position={[0, -0.259, units(thickness) / 2 + 0.039]}>
        <sphereGeometry args={[0.012, 12, 8]} />
        <meshStandardMaterial color="#454955" metalness={0.65} roughness={0.3} />
      </mesh>
    </group>
  );
}
