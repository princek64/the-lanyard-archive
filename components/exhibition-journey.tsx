"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { ExhibitionBadge } from "../lib/badges";
import { BadgeExhibition } from "./badge-exhibition";
import { ArchiveMark, Arrow } from "./icons";
import { SceneBoundary, useReducedMotion } from "./viewer-support";

const ExhibitionScene = dynamic(() => import("./exhibition-scene"), { ssr: false });

const number = (value: number) => String(value).padStart(2, "0");
const eventTitle = ({ event }: ExhibitionBadge) => [event.name, event.edition].filter(Boolean).join(" ");

export function ExhibitionJourney({ badges, records, intro }: {
  badges: ExhibitionBadge[]; records: ReactNode[]; intro: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [focused, setFocused] = useState<number | null>(null);
  const [sceneState, setSceneState] = useState<"loading" | "ready" | "unavailable">("loading");
  const reducedMotion = useReducedMotion();
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const indexDialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const indexButton = useRef<HTMLButtonElement>(null);
  const inspectButton = useRef<HTMLButtonElement>(null);
  const selectedIndex = useRef<number | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const ready = useCallback(() => setSceneState("ready"), []);
  const unavailable = useCallback(() => setSceneState("unavailable"), []);
  const badge = badges[active];
  const date = badge.event.date === badge.event.edition ? undefined : badge.event.date;

  useEffect(() => {
    if (focused !== null || indexOpen) return;
    let frame = 0;
    const readPosition = () => {
      frame = 0;
      const bounds = track.current?.getBoundingClientRect();
      const height = stage.current?.offsetHeight ?? 0;
      if (!bounds || bounds.height <= height) return;
      progress.current = Math.max(0, Math.min(1, -bounds.top / (bounds.height - height))) * (badges.length - 1);
      setActive(Math.round(progress.current));
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
  }, [badges.length, focused, indexOpen]);

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
    if (immediate || reducedMotion) {
      progress.current = index;
      setActive(index);
    }
  }

  function inspect(index: number, trigger?: HTMLElement) {
    navigate(index, true);
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

  function openIndex() {
    setIndexOpen(true);
    const panel = indexDialog.current;
    panel?.showModal();
    const selected = panel?.querySelector<HTMLElement>('[aria-current="step"]');
    selected?.focus({ preventScroll: true });
    selected?.scrollIntoView({ block: "nearest" });
  }

  function closeIndex() {
    setIndexOpen(false);
    const index = selectedIndex.current;
    selectedIndex.current = null;
    if (index !== null) navigate(index, true);
    indexButton.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <section ref={track} className="journey" style={{ "--journey-distance": `${(badges.length - 1) * 62}svh` } as CSSProperties} id="exhibition" aria-label="Exhibition">
        <div ref={stage} className="journey-stage">
          <div className="journey-view">
            {sceneState !== "ready" && (
              <div className="journey-images">
                {badges.map((item, index) => Math.abs(index - active) <= 1 && (
                  <button key={item.id} type="button" className="journey-image"
                    style={{ "--offset": index - active } as CSSProperties}
                    data-featured={index === active}
                    tabIndex={index === active ? 0 : -1}
                    aria-label={`Inspect ${eventTitle(item)}`}
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
                  <ExhibitionScene badges={badges} active={active} progress={progress} paused={focused !== null || indexOpen}
                    reducedMotion={reducedMotion} onInspect={inspect} onReady={ready} onUnavailable={unavailable} />
                </SceneBoundary>
              </div>
            )}
          </div>
          <header className="gallery-bar">
            <div className="gallery-brand"><ArchiveMark /><span>Lanyard Archive</span></div>
            <button ref={indexButton} type="button" className="index-toggle" aria-haspopup="dialog"
              aria-controls="object-index" aria-expanded={indexOpen} onClick={openIndex}>
              Object index <span>{number(badges.length)}</span>
            </button>
          </header>
          {intro}
          <div className="journey-controls">
            <div className="journey-record" aria-live="polite" aria-atomic="true">
              <p className="record-count">{number(active + 1)} <span>/</span> {number(badges.length)}</p>
              <h2>{eventTitle(badge)}</h2>
              {(date || badge.event.pass) && <div className="record-meta">
                {date && <time dateTime={badge.event.dateTime}>{date}</time>}
                {badge.event.pass && <span>{badge.event.pass}</span>}
              </div>}
            </div>
            {active === 0 && <span className="scroll-cue">Scroll to browse <Arrow /></span>}
            <div className="gallery-actions">
              <button ref={inspectButton} className="journey-inspect" type="button"
                onClick={event => inspect(active, event.currentTarget)}>Inspect badge <Arrow /></button>
              <nav className="step-controls" aria-label="Exhibition stops">
                <button type="button" aria-label="Previous object" disabled={active === 0}
                  onClick={() => navigate(active - 1)}>←</button>
                <button type="button" aria-label="Next object" disabled={active === badges.length - 1}
                  onClick={() => navigate(active + 1)}>→</button>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <dialog className="index-dialog" id="object-index" ref={indexDialog} aria-labelledby="index-title" onClose={closeIndex}>
        <header className="index-header">
          <h2 id="index-title">Object index</h2>
          <button type="button" onClick={() => indexDialog.current?.close()}>Close <span aria-hidden="true">×</span></button>
        </header>
        <div className="object-index">
          {badges.map((item, index) => (
            <button type="button" key={item.id} aria-current={index === active ? "step" : undefined}
              onClick={() => { selectedIndex.current = index; indexDialog.current?.close(); }}>
              <span className="index-print">
                {indexOpen && <Image src={item.artwork.front} width={item.dimensions.width * 3} height={item.dimensions.height * 3}
                  alt="" unoptimized loading="lazy" />}
              </span>
              <span className="index-caption"><span>{number(index + 1)}</span>{eventTitle(item)}</span>
            </button>
          ))}
        </div>
      </dialog>
      <dialog ref={dialog} className="focus-dialog" aria-labelledby="focus-title" onClose={close}>
        {focused !== null && (
          <>
            <header className="focus-header">
              <span>{number(focused + 1)} / {number(badges.length)}</span>
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
