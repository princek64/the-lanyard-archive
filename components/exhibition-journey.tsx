"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { ExhibitionBadge } from "../lib/badges";
import { BadgeExhibition } from "./badge-exhibition";
import { Arrow } from "./icons";
import { SceneBoundary, useReducedMotion } from "./viewer-support";

const ExhibitionScene = dynamic(() => import("./exhibition-scene"), { ssr: false });

export function ExhibitionJourney({ badges, records }: { badges: ExhibitionBadge[]; records: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState<number | null>(null);
  const [sceneState, setSceneState] = useState<"loading" | "ready" | "unavailable">("loading");
  const reducedMotion = useReducedMotion();
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const inspectButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const ready = useCallback(() => setSceneState("ready"), []);
  const unavailable = useCallback(() => setSceneState("unavailable"), []);
  const badge = badges[active];

  useEffect(() => {
    if (focused !== null) return;
    let frame = 0;
    const readPosition = () => {
      frame = 0;
      const bounds = track.current?.getBoundingClientRect();
      const height = stage.current?.offsetHeight ?? 0;
      if (!bounds || bounds.height <= height) return;
      const progress = Math.max(0, Math.min(1, -bounds.top / (bounds.height - height)));
      setActive(Math.round(progress * (badges.length - 1)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(readPosition);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [badges.length, focused]);

  function navigate(index: number, immediate = false) {
    const section = track.current;
    const height = stage.current?.offsetHeight ?? 0;
    if (!section) return;
    const start = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - height;
    window.scrollTo({
      top: start + travel * index / Math.max(1, badges.length - 1),
      behavior: immediate || reducedMotion ? "instant" : "smooth",
    });
  }

  function inspect(index: number, trigger?: HTMLElement) {
    if (index !== active) {
      navigate(index, true);
      setActive(index);
    }
    returnFocus.current = trigger ?? inspectButton.current;
    setFocused(index);
  }

  useEffect(() => {
    if (focused === null) return;
    dialog.current?.showModal();
    closeButton.current?.focus();
  }, [focused]);

  function close() {
    setFocused(null);
    requestAnimationFrame(() => {
      const opener = returnFocus.current?.isConnected ? returnFocus.current : inspectButton.current;
      opener?.focus({ preventScroll: true });
    });
  }

  return (
    <>
      <section ref={track} className="journey" id="exhibition" aria-label="Exhibition">
        <div ref={stage} className="journey-stage">
          <div className="journey-plane" aria-hidden="true" />
          <div className="journey-frame" aria-hidden="true" />
          <div className="journey-overline" aria-hidden="true"><span /> THE EXHIBITION</div>
          <div className="journey-number" aria-hidden="true">OBJECT / {badge.id}</div>
          {sceneState !== "ready" && (
            <div className="journey-images">
              {badges.map((item, index) => (
                <button key={item.id} type="button" className="journey-image"
                  style={{ "--offset": index - active } as React.CSSProperties}
                  data-featured={index === active}
                  tabIndex={index === active ? 0 : -1}
                  aria-label={`Inspect ${item.event.name} ${item.event.edition}`}
                  onClick={event => inspect(index, event.currentTarget)}>
                  <Image src={item.artwork.front} width={item.dimensions.width * 8} height={item.dimensions.height * 8}
                    alt="" unoptimized priority={index === 0} />
                </button>
              ))}
            </div>
          )}
          {sceneState !== "unavailable" && (
            <div className={`journey-canvas ${sceneState}`}>
              <SceneBoundary onUnavailable={unavailable}>
                <ExhibitionScene badges={badges} active={active} paused={focused !== null} reducedMotion={reducedMotion}
                  onInspect={inspect} onReady={ready} onUnavailable={unavailable} />
              </SceneBoundary>
            </div>
          )}
          <div className="journey-controls">
            <div className="journey-record" aria-live="polite" aria-atomic="true">
              <p>{String(active + 1).padStart(2, "0")} / {String(badges.length).padStart(2, "0")}</p>
              <h2>{badge.event.name} <span>{badge.event.edition}</span></h2>
              <time dateTime={badge.event.dateTime}>{badge.event.date}</time>
            </div>
            <button ref={inspectButton} className="journey-inspect" type="button"
              onClick={event => inspect(active, event.currentTarget)}>Inspect badge <Arrow /></button>
            <nav className="journey-nav" aria-label="Exhibition stops">
              <button type="button" aria-label="Previous object" disabled={active === 0}
                onClick={() => navigate(active - 1)}>←</button>
              {badges.map((item, index) => (
                <button type="button" key={item.id} aria-label={`Go to object ${String(index + 1).padStart(2, "0")}, ${item.event.name}`}
                  aria-current={index === active ? "step" : undefined} onClick={() => navigate(index)}>
                  {String(index + 1).padStart(2, "0")}
                </button>
              ))}
              <button type="button" aria-label="Next object" disabled={active === badges.length - 1}
                onClick={() => navigate(active + 1)}>→</button>
            </nav>
          </div>
        </div>
      </section>
      <dialog ref={dialog} className="focus-dialog" aria-labelledby="focus-title" onClose={close}>
        {focused !== null && (
          <>
            <header className="focus-header">
              <span>OBJECT / {badges[focused].id}</span>
              <button ref={closeButton} type="button" onClick={() => dialog.current?.close()}>
                Back to exhibition <span aria-hidden="true">×</span>
              </button>
            </header>
            <div className="focus-content">
              <BadgeExhibition key={badges[focused].id} config={badges[focused]} />
              {records[focused]}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
