"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { ExhibitionBadge } from "../lib/badges";
import { BadgeExhibition } from "./badge-exhibition";
import { Hand } from "./icons";
import { useClipSound } from "./clip-sound";
import { SceneBoundary, useReducedMotion } from "./viewer-support";

const ExhibitionScene = dynamic(() => import("./exhibition-scene"), { ssr: false });

const number = (value: number) => String(value).padStart(2, "0");
const eventTitle = ({ event }: ExhibitionBadge) => [event.name, event.edition].filter(Boolean).join(" ");

function ribbonStyle(item: ExhibitionBadge) {
  return {
    "--ribbon": item.lanyard.colour,
    "--ribbon-print": item.lanyard.texture ? `url(${item.lanyard.texture})` : "none",
  } as CSSProperties;
}

export function ExhibitionJourney({ badges, records }: {
  badges: ExhibitionBadge[]; records: ReactNode[];
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
  const sound = useClipSound();

  function step(direction: number) {
    void sound.click();
    navigate(active + direction);
  }

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
        <div ref={stage} className="journey-stage" style={{ "--wall": badge.label.wall, "--pigment": badge.label.pigment } as CSSProperties}>
          <header className="gallery-bar" data-opening={active === 0}>
            <h1><span>The</span> <i>Lanyard</i> Archive</h1>
            <span className="credit">Prince Kukreja’s collection</span>
            <button ref={indexButton} type="button" className="index-toggle" aria-haspopup="dialog"
              aria-controls="object-index" aria-expanded={indexOpen} onClick={openIndex}>
              <span className="index-icon" aria-hidden="true">▦</span> Object index <small>{badges.length}</small>
            </button>
          </header>
          <div className="display-wall">
            <div className="journey-view">
              {sceneState !== "ready" && (
                <div className="journey-images">
                  <div className="flat-rail" aria-hidden="true" />
                  {badges.map((item, index) => Math.abs(index - active) <= 3 && (
                    <button key={item.id} type="button" className="journey-image"
                      style={{ "--offset": index - active, ...ribbonStyle(item),
                        "--spread": item.lanyard.clipSpread ? "12deg" : "5deg" } as CSSProperties}
                      data-featured={index === active}
                      tabIndex={index === active ? 0 : -1}
                      aria-label={`Inspect ${eventTitle(item)}`}
                      onClick={event => inspect(index, event.currentTarget)}>
                      <span className="flat-strap" aria-hidden="true"><i /><i /></span>
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
          </div>
          <footer className="journey-controls">
            <div className="control-row">
              <div className="journey-record" aria-live="polite" aria-atomic="true">
                <h2 className="inscription">{badge.label.inscription}</h2>
                <p className="record-event">{eventTitle(badge)}</p>
              </div>
              <button ref={inspectButton} className="journey-inspect" type="button"
                onClick={event => inspect(active, event.currentTarget)}>
                <Hand /> Pick up pass
              </button>
              <nav className="step-controls" aria-label="Exhibition stops">
                <button type="button" aria-label="Previous object" disabled={active === 0} onClick={() => step(-1)}>‹</button>
                <span>{number(active + 1)} / {number(badges.length)}</span>
                <button type="button" aria-label="Next object" disabled={active === badges.length - 1} onClick={() => step(1)}>›</button>
              </nav>
              <button className="sound-toggle" type="button" aria-label="Clip sound" aria-pressed={!sound.muted} onClick={sound.toggle}>
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 8h3l4-4v12l-4-4H3z" />
                  {sound.muted ? <path d="m13 8 4 4m0-4-4 4"/> : <path d="M13 7a5 5 0 0 1 0 6m2-8a8 8 0 0 1 0 10"/>}
                </svg>
              </button>
            </div>
            <label className="ribbon-browser">
              <span className="ribbon-prompt">Slide through the ribbons</span>
              <span className="swatch-track" style={{ "--swatch-count": badges.length } as CSSProperties}>
                <span className="swatches" aria-hidden="true">
                  {badges.map((item, index) => (
                    <span key={item.id} className="swatch" data-selected={active === index} style={ribbonStyle(item)} />
                  ))}
                </span>
                <input aria-label="Browse by ribbon" aria-valuetext={`${active + 1} of ${badges.length}, ${eventTitle(badge)}`}
                  type="range" min={0} max={badges.length - 1} step={1} value={active}
                  onChange={e => navigate(e.currentTarget.valueAsNumber, true)} />
              </span>
            </label>
          </footer>
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
              <span className="index-print" style={ribbonStyle(item)}>
                <span className="index-ribbon" aria-hidden="true" />
                {indexOpen && <Image src={item.artwork.front} width={item.dimensions.width * 3} height={item.dimensions.height * 3}
                  alt="" unoptimized loading="lazy" />}
              </span>
              <span className="index-caption"><span>{number(index + 1)}</span>{eventTitle(item)}</span>
            </button>
          ))}
        </div>
      </dialog>
      <dialog ref={dialog} className="focus-dialog" style={{ "--wall": badge.label.wall, "--pigment": badge.label.pigment } as CSSProperties} aria-labelledby="focus-title" onClose={close}>
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
