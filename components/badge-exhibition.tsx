"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { SceneBoundary, useReducedMotion } from "./viewer-support";
import type { BadgeConfig } from "../lib/badges";
import { Flip, Hand } from "./icons";

const BadgeScene = dynamic(() => import("./badge-scene"), { ssr: false });
export function BadgeExhibition({ config }: { config: BadgeConfig }) {
  const [back, setBack] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const reducedMotion = useReducedMotion();
  const flip = useCallback(() => setBack(value => !value), []);
  const ready = useCallback(() => setStatus("ready"), []);
  const unavailable = useCallback(() => setStatus("unavailable"), []);

  return (
    <section className="exhibition" aria-label="Badge viewer">
      <div className="studio">
        {status !== "ready" && (
          <div className={`flat-badge ${status}`}>
            <Image src={back ? config.artwork.back : config.artwork.front}
              alt={`${config.event.name} badge, ${back ? "back" : "front"}`}
              width={config.dimensions.width * 8} height={config.dimensions.height * 8}
              unoptimized priority />
          </div>
        )}
        {status !== "unavailable" && (
          <div className="scene">
            <SceneBoundary onUnavailable={unavailable}>
              <BadgeScene config={config} back={back} reducedMotion={reducedMotion}
                onFlip={flip} onReady={ready} onUnavailable={unavailable} />
            </SceneBoundary>
          </div>
        )}
        <div className="studio-caption"><span>{back ? "BACK" : "FRONT"} VIEW</span></div>
        <button type="button" className="flip-button" onClick={flip}
          aria-label={`Flip badge to the ${back ? "front" : "back"}`}>
          <Flip /> Flip badge
        </button>
      </div>
      <div className="viewer-footer">
        <span className="viewer-instruction">
          {status === "unavailable" ? <span>Static preview</span> : <><Hand /><span>Drag to pick up</span></>}
        </span>
        <div className="view-controls" role="group" aria-label="Badge face">
          <button type="button" aria-pressed={!back} onClick={() => setBack(false)}>Front</button>
          <button type="button" aria-pressed={back} onClick={() => setBack(true)}>Back</button>
        </div>
      </div>
    </section>
  );
}
