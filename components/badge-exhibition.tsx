"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { SceneBoundary, useReducedMotion } from "./viewer-support";
import type { BadgeConfig } from "../lib/badges";
import { Flip, Hand } from "./icons";

const BadgeScene = dynamic(() => import("./badge-scene"), { ssr: false });
export function preloadBadgeScene() {
  // A failed speculative load still goes through the viewer's normal fallback on mount.
  void import("./badge-scene").catch(() => {});
}

export function BadgeExhibition({ config, sceneEnabled }: { config: BadgeConfig; sceneEnabled: boolean }) {
  const [back, setBack] = useState(false);
  const [reading, setReading] = useState(false);
  const print = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const reducedMotion = useReducedMotion();
  const flip = useCallback(() => setBack(value => !value), []);
  const ready = useCallback(() => setStatus("ready"), []);
  const unavailable = useCallback(() => setStatus("unavailable"), []);
  const detail = !back || config.artwork.front === config.artwork.back ? config.frontDetail : undefined;
  const framePrint = useCallback(() => {
    const sheet = print.current;
    if (!sheet) return;
    sheet.scrollTo({
      left: sheet.scrollWidth * (detail?.x ?? 0.5) - sheet.clientWidth / 2,
      top: detail ? sheet.scrollHeight * detail.y - sheet.clientHeight / 2 : 0,
    });
  }, [detail]);

  useLayoutEffect(() => {
    if (reading) framePrint();
  }, [reading, back, framePrint]);
  useLayoutEffect(() => {
    if (reading) print.current?.focus({ preventScroll: true });
  }, [reading]);

  return (
    <section className="exhibition" aria-label="Badge viewer">
      <div className="studio" style={{
        "--frame-height": config.dimensions.height + config.lanyard.length + 20,
        "--frame-width": config.dimensions.width + 95,
        "--specimen-offset": 137 - (config.dimensions.height + config.lanyard.length) / 2,
      } as CSSProperties}>
        {reading && (
          <div ref={print} className="enlarged-print" role="region" tabIndex={0}
            aria-label={`Enlarged ${back ? "back" : "front"} print`}>
            <Image src={back ? config.artwork.back : config.artwork.front}
              alt={`${config.event.name} badge, ${back ? "back" : "front"}`}
              onLoad={framePrint} style={detail ? { width: `${100 / detail.width}%` } : undefined}
              width={config.dimensions.width * 8} height={config.dimensions.height * 8} unoptimized />
          </div>
        )}
        {!reading && (
          <div className="pickup-preview" data-ready={status === "ready"} aria-hidden={status === "ready"}>
            <Image src={back ? config.artwork.specimenBack : config.artwork.specimen} alt={`${config.event.name} badge, ${back ? "back" : "front"}`} width={464} height={980}
              style={{ viewTransitionName: sceneEnabled ? undefined : "inspected-badge" }} unoptimized priority />
          </div>
        )}
        {!reading && sceneEnabled && status !== "unavailable" && (
          <div className="rig-frame">
            <div className="scene" data-ready={status === "ready"}>
              <SceneBoundary onUnavailable={unavailable}>
                <BadgeScene config={config} back={back} reducedMotion={reducedMotion}
                  onFlip={flip} onReady={ready} onUnavailable={unavailable} />
              </SceneBoundary>
            </div>
          </div>
        )}
        <button type="button" className="read-print" aria-pressed={reading} onClick={() => {
          if (reading && status === "ready") setStatus("loading");
          setReading(!reading);
        }}>{reading ? "Whole pass" : "Read print"} <span aria-hidden="true">{reading ? "−" : "+"}</span></button>
        <button type="button" className="flip-button" onClick={flip}
          aria-label={`Flip badge to the ${back ? "front" : "back"}`}>
          <Flip /> Flip badge
        </button>
      </div>
      <div className="viewer-footer">
        <span className="viewer-instruction">
          {reading ? "Scroll to read" : status === "unavailable" ? "Static preview" : status === "ready" ? <><Hand /><span>Drag to pick up</span></> : null}
        </span>
        <div className="view-controls" role="group" aria-label="Badge face">
          <button type="button" aria-pressed={!back} onClick={() => setBack(false)}>Front</button>
          <button type="button" aria-pressed={back} onClick={() => setBack(true)}>Back</button>
        </div>
      </div>
    </section>
  );
}
