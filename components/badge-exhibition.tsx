"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { SceneBoundary, useReducedMotion } from "./viewer-support";
import type { BadgeConfig } from "../lib/badges";
import { Flip, Hand } from "./icons";

const BadgeScene = dynamic(() => import("./badge-scene"), { ssr: false });
export function BadgeExhibition({ config, sceneEnabled }: { config: BadgeConfig; sceneEnabled: boolean }) {
  const [back, setBack] = useState(false);
  const [reading, setReading] = useState(false);
  const print = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const reducedMotion = useReducedMotion();
  const flip = useCallback(() => setBack(value => !value), []);
  const ready = useCallback(() => setStatus("ready"), []);
  const unavailable = useCallback(() => setStatus("unavailable"), []);
  useEffect(() => {
    if (!reading || !print.current) return;
    const sheet = print.current;
    sheet.scrollTo({ left: (sheet.scrollWidth - sheet.clientWidth) / 2, top: 0 });
    sheet.focus({ preventScroll: true });
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
              width={config.dimensions.width * 8} height={config.dimensions.height * 8} unoptimized />
          </div>
        )}
        {!reading && !back && status !== "unavailable" && (
          <div className="pickup-preview" data-ready={status === "ready"} aria-hidden={status === "ready"}>
            <Image src={config.artwork.specimen} alt={`${config.event.name} badge, front`} width={464} height={980}
              style={{ viewTransitionName: sceneEnabled ? undefined : "inspected-badge" }} unoptimized priority />
          </div>
        )}
        {!reading && status !== "ready" && (back || status === "unavailable") && (
          <div className={`flat-badge ${status}`}>
            <Image src={back ? config.artwork.back : config.artwork.front}
              alt={`${config.event.name} badge, ${back ? "back" : "front"}`}
              width={config.dimensions.width * 8} height={config.dimensions.height * 8}
              unoptimized priority />
          </div>
        )}
        {!reading && sceneEnabled && status !== "unavailable" && (
          <div className="scene" data-ready={status === "ready"}>
            <SceneBoundary onUnavailable={unavailable}>
              <BadgeScene config={config} back={back} reducedMotion={reducedMotion}
                onFlip={flip} onReady={ready} onUnavailable={unavailable} />
            </SceneBoundary>
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
          {reading ? "Scroll to read" : status === "unavailable" ? "Static preview" : <><Hand /><span>Drag to pick up</span></>}
        </span>
        <div className="view-controls" role="group" aria-label="Badge face">
          <button type="button" aria-pressed={!back} onClick={() => setBack(false)}>Front</button>
          <button type="button" aria-pressed={back} onClick={() => setBack(true)}>Back</button>
        </div>
      </div>
    </section>
  );
}
