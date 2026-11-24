"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import { createRef, useMemo, useRef, type PointerEvent } from "react";
import { Group, MathUtils, OrthographicCamera, Vector2 } from "three";
import type { BadgeConfig } from "../lib/badges";
import { BadgeAttachment, BadgeMesh, clipLength, units } from "./badge-mesh";
import { anchorY, Lanyard, linkCount } from "./lanyard";

const displayYaw = 0.095;

type Drag = {
  id: number;
  start: Vector2;
  previous: Vector2;
  target: Vector2;
  velocity: Vector2;
  time: number;
  rotation?: number;
};

export function BadgeRig({ config, back, reducedMotion, onFlip }: {
  config: BadgeConfig; back: boolean; reducedMotion: boolean; onFlip: () => void;
}) {
  const bodies = useMemo(() => Array.from({ length: linkCount + 1 },
    () => createRef<RapierRigidBody>()), []);
  const card = bodies[linkCount];
  const pivot = useRef<Group>(null);
  const active = useRef<Drag | null>(null);
  const control = useRef<HTMLButtonElement>(null);
  const previousScale = useRef(0);
  const { rapier } = useRapier();
  const { camera } = useThree();
  const width = units(config.dimensions.width);
  const height = units(config.dimensions.height);
  const restY = anchorY - units(config.lanyard.length);

  useFrame((_, delta) => {
    const drag = active.current;
    if (drag && drag.rotation === undefined) {
      card.current?.setNextKinematicTranslation({ x: drag.target.x, y: drag.target.y, z: 0 });
    }
    if (pivot.current) {
      const angle = drag?.rotation ?? (back ? Math.PI : 0) + displayYaw;
      pivot.current.rotation.y = reducedMotion ? angle
        : MathUtils.damp(pivot.current.rotation.y, angle, 12, delta);
      const scale = (camera as OrthographicCamera).zoom;
      if (control.current && previousScale.current !== scale) {
        previousScale.current = scale;
        control.current.style.width = `${Math.max(48, width * scale)}px`;
        control.current.style.height = `${height * scale}px`;
      }
    }
  });

  function grab(event: PointerEvent<HTMLButtonElement>) {
    const body = card.current;
    if (!body || active.current || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const start = new Vector2(event.clientX, event.clientY);
    const position = body.translation();
    active.current = {
      id: event.pointerId, start, previous: start.clone(),
      target: new Vector2(position.x, position.y), velocity: new Vector2(),
      time: event.timeStamp,
      rotation: event.shiftKey ? (back ? Math.PI : 0) + displayYaw : undefined,
    };
    if (!event.shiftKey) {
      body.setBodyType(rapier.RigidBodyType.KinematicPositionBased, true);
      body.setNextKinematicTranslation(position);
    }
    event.currentTarget.dataset.dragging = "true";
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const drag = active.current;
    if (!drag || drag.id !== event.pointerId) return;
    const current = new Vector2(event.clientX, event.clientY);
    if (drag.rotation !== undefined) {
      drag.rotation = (back ? Math.PI : 0) + displayYaw + (current.x - drag.start.x) / 65;
      return;
    }
    const zoom = (camera as OrthographicCamera).zoom;
    const dt = Math.max((event.timeStamp - drag.time) / 1000, 0.008);
    const offset = current.clone().sub(drag.previous).multiply(new Vector2(1 / zoom, -1 / zoom));
    const next = drag.target.clone().add(offset);
    next.y = Math.min(anchorY - 0.19, next.y);
    next.sub(new Vector2(0, anchorY)).clampLength(0, units(config.lanyard.length) * 1.03);
    next.y += anchorY;
    drag.velocity.lerp(next.clone().sub(drag.target).multiplyScalar(1 / dt).clampLength(0, 3), 0.5);
    drag.target.copy(next);
    drag.previous.copy(current);
    drag.time = event.timeStamp;
  }

  function release(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const drag = active.current;
    if (!drag || drag.id !== event.pointerId) return;
    active.current = null;
    delete event.currentTarget.dataset.dragging;
    if (drag.rotation !== undefined) {
      if (!cancelled && (Math.cos(drag.rotation) < 0) !== back) onFlip();
      return;
    }
    const body = card.current;
    if (!body) return;
    body.setBodyType(rapier.RigidBodyType.Dynamic, true);
    const throwBadge = !reducedMotion && !cancelled && event.timeStamp - drag.time < 85;
    body.setLinvel({ x: throwBadge ? drag.velocity.x : 0, y: throwBadge ? drag.velocity.y : 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  return (
    <>
      <RigidBody ref={card} position={[0, restY, 0]} colliders={false}
        linearDamping={reducedMotion ? 10 : 0.9} angularDamping={reducedMotion ? 12 : 1.4}
        enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}>
        <CuboidCollider args={[width / 2, height / 2, units(config.dimensions.thickness) / 2]}
          position={[0, -clipLength - height / 2, 0]} mass={0.24} />
        <group ref={pivot}>
          <BadgeAttachment config={config} />
          <BadgeMesh config={config} />
        </group>
        <Html center position={[0, -clipLength - height / 2, 0]} zIndexRange={[4, 4]}
          style={{ pointerEvents: "none" }}>
          <button ref={control} type="button" className="badge-hit"
            aria-label="Badge. Press Enter or Space to turn it over."
            onPointerDown={grab} onPointerMove={move} onPointerUp={event => release(event)}
            onPointerCancel={event => release(event, true)} onLostPointerCapture={event => release(event, true)}
            onClick={event => { if (event.detail === 0) onFlip(); }}
            onContextMenu={event => event.preventDefault()} />
        </Html>
      </RigidBody>
      <Lanyard bodies={bodies} config={config.lanyard} />
    </>
  );
}
