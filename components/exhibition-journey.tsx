"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { ExhibitionBadge } from "../lib/badges";
import { BadgeExhibition } from "./badge-exhibition";
import { Arrow } from "./icons";
import { SceneBoundary, useReducedMotion } from "./viewer-support";

const ExhibitionScene = dynamic(() => import("./exhibition-scene"), { ssr: false });

export function ExhibitionJourney({ badges, records, intro }: { badges: ExhibitionBadge[]; records: ReactNode[]; intro: ReactNode }) {
  const [active, setActive] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [focused, setFocused] = useState<number | null>(null);
  const [sceneState, setSceneState] = useState<"loading" | "ready" | "unavailable">("loading");
  const reducedMotion = useReducedMotion();
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const indexButton = useRef<HTMLButtonElement>(null);
  const indexList = useRef<HTMLDivElement>(null);
  const inspectButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const ready = useCallback(() => setSceneState("ready"), []);
  const unavailable = useCallback(() => setSceneState("unavailable"), []);
  const badge = badges[active];
  const date = badge.event.date === badge.event.edition ? undefined : badge.event.date;

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

  useEffect(() => {
    const list = indexList.current;
    const selected = list?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!indexOpen || !list || !selected) return;
    list.scrollTop = Math.max(0, selected.offsetTop - (list.clientHeight - selected.offsetHeight) / 2);
    selected.focus({ preventScroll: true });
  }, [indexOpen]);

  function closeIndex() {
    setIndexOpen(false);
    indexButton.current?.focus({ preventScroll: true });
  }

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
    setIndexOpen(false);
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
      <section ref={track} className="journey" style={{ "--journey-distance": `${Math.max(0, badges.length - 1) * 53}svh` } as CSSProperties} id="exhibition" aria-label="Exhibition">
        <div ref={stage} className="journey-stage">
          {intro}
          <div className="journey-view">
            <div className="view-mark" aria-hidden="true">FIG. {String(active + 1).padStart(2, "0")}</div>
          {sceneState !== "ready" && (
            <div className="journey-images">
              {badges.map((item, index) => Math.abs(index - active) <= 1 && (
                <button key={item.id} type="button" className="journey-image"
                  style={{ "--offset": index - active } as CSSProperties}
                  data-featured={index === active}
                  tabIndex={index === active ? 0 : -1}
                  aria-label={`Inspect ${[item.event.name, item.event.edition].filter(Boolean).join(" ")}`}
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
          </div>
          <div className="journey-controls">
            <div className="journey-record" aria-live="polite" aria-atomic="true">
              <p className="record-count">{String(active + 1).padStart(2, "0")} <span>/</span> {String(badges.length).padStart(2, "0")}</p>
              <h2>{badge.event.name}{badge.event.edition && <> <span>{badge.event.edition}</span></>}</h2>
              {(date || badge.event.pass) && <div className="record-meta">
                {date && <time dateTime={badge.event.dateTime}>{date}</time>}
                {badge.event.pass && <span>{badge.event.pass}</span>}
              </div>}
            </div>
            <button ref={inspectButton} className="journey-inspect" type="button"
              onClick={event => inspect(active, event.currentTarget)}>Inspect badge <Arrow /></button>
            <nav className="journey-nav" aria-label="Exhibition stops">
              <button ref={indexButton} type="button" className="index-toggle" aria-expanded={indexOpen}
                aria-controls="object-index" onClick={() => indexOpen ? closeIndex() : setIndexOpen(true)}>
                Object index <span aria-hidden="true">{indexOpen ? "−" : "+"}</span>
              </button>
              <div className="step-controls">
                <button type="button" aria-label="Previous object" disabled={active === 0}
                  onClick={() => navigate(active - 1)}>←</button>
                <button type="button" aria-label="Next object" disabled={active === badges.length - 1}
                  onClick={() => navigate(active + 1)}>→</button>
              </div>
              <div className="object-index" id="object-index" ref={indexList} hidden={!indexOpen}
                onKeyDown={event => { if (event.key === "Escape") closeIndex(); }}>
                {badges.map((item, index) => (
                  <button type="button" key={item.id}
                    aria-current={index === active ? "step" : undefined}
                    onClick={() => { closeIndex(); navigate(index, true); }}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{[item.event.name, item.event.edition].filter(Boolean).join(" ")}</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </section>
      <dialog ref={dialog} className="focus-dialog" aria-labelledby="focus-title" onClose={close}>
        {focused !== null && (
          <>
            <header className="focus-header">
              <span>FIG. {String(focused + 1).padStart(2, "0")}</span>
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
