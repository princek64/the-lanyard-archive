"use client";

import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody, useSphericalJoint, type RapierRigidBody } from "@react-three/rapier";
import { type RefObject, useEffect, useMemo } from "react";
import { BufferAttribute, BufferGeometry, CatmullRomCurve3, DoubleSide, Group, Quaternion, Vector3 } from "three";
import { ribbonOffsets, type BadgeConfig } from "../lib/badges";
import { units } from "./badge-mesh";
import { useBadgeTexture } from "./badge-texture";

export type BodyRef = RefObject<RapierRigidBody | null>;
export const anchorY = 1.68;
export const linkCount = 5;
const subdivisions = 30;

export function LinkJoint({ upper, lower, distance }: {
  upper: BodyRef; lower: BodyRef; distance: number;
}) {
  // Rapier resolves these in an effect after the rigid bodies mount.
  useSphericalJoint(upper as RefObject<RapierRigidBody>, lower as RefObject<RapierRigidBody>, [[0, -distance, 0], [0, 0, 0]]);
  return null;
}

function PrintedFabric({ url, repeat }: { url: string; repeat: number }) {
  const map = useBadgeTexture(url, repeat);
  return <meshStandardMaterial map={map} roughness={0.95} side={DoubleSide} />;
}

function Ribbon({ bodies, config, offset, pivot }: {
  bodies: BodyRef[];
  config: BadgeConfig["lanyard"];
  offset: number;
  pivot: RefObject<Group | null>;
}) {
  const width = units(config.width);
  const { geometry, curve, point, tangent, side, rotation, clipOffset } = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array((subdivisions + 1) * 6);
    const uv = new Float32Array((subdivisions + 1) * 4);
    const indices = [];
    const curve = new CatmullRomCurve3(bodies.map(() => new Vector3()));
    for (let i = 0; i <= subdivisions; i++) {
      uv.set([0, 1 - i / subdivisions, 1, 1 - i / subdivisions], i * 4);
      if (i < subdivisions) {
        const vertex = i * 2;
        indices.push(vertex, vertex + 2, vertex + 1, vertex + 1, vertex + 2, vertex + 3);
      }
    }
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new BufferAttribute(uv, 2));
    geometry.setIndex(indices);
    return { geometry, curve, point: new Vector3(), tangent: new Vector3(), side: new Vector3(), rotation: new Quaternion(), clipOffset: new Vector3() };
  }, [bodies]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    if (bodies.some(body => !body.current)) return;
    clipOffset.set(offset, 0, 0);
    if (offset && pivot.current) clipOffset.applyQuaternion(pivot.current.getWorldQuaternion(rotation));
    bodies.forEach((body, index) => {
      const amount = index / linkCount;
      const centre = curve.points[index].copy(body.current!.translation());
      centre.x += offset * (1 - amount);
      centre.addScaledVector(clipOffset, amount);
    });
    const positions = geometry.getAttribute("position");
    for (let i = 0; i <= subdivisions; i++) {
      const t = i / subdivisions;
      curve.getPoint(t, point);
      curve.getTangent(t, tangent);
      const twist = Math.sin(t * Math.PI) * 0.27;
      side.set(-tangent.y, tangent.x, twist).normalize().multiplyScalar(width / 2);
      positions.setXYZ(i * 2, point.x - side.x, point.y - side.y, point.z - side.z);
      positions.setXYZ(i * 2 + 1, point.x + side.x, point.y + side.y, point.z + side.z);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      {config.texture
        ? <PrintedFabric url={config.texture} repeat={Math.max(1, config.length / (config.width * (config.repeatAspect ?? 3)))} />
        : <meshStandardMaterial color={config.colour} roughness={0.95} side={DoubleSide} />}
    </mesh>
  );
}

export function Lanyard({ bodies, config, pivot }: {
  bodies: BodyRef[];
  config: BadgeConfig["lanyard"];
  pivot: RefObject<Group | null>;
}) {
  const step = units(config.length) / linkCount;
  return (
    <>
      {bodies.slice(0, -1).map((body, index) => (
        <RigidBody key={index} ref={body} type={index === 0 ? "fixed" : "dynamic"}
          colliders={false} position={[0, anchorY - index * step, 0]}
          linearDamping={1.4} angularDamping={1.7}>
          {index > 0 && <BallCollider args={[0.018]} mass={0.04} sensor />}
        </RigidBody>
      ))}
      {bodies.slice(1).map((body, index) => (
        <LinkJoint key={index} upper={bodies[index]} lower={body} distance={step} />
      ))}
      {ribbonOffsets(config).map(offset => (
        <Ribbon key={offset} bodies={bodies} config={config} pivot={pivot} offset={units(offset)} />
      ))}
    </>
  );
}
