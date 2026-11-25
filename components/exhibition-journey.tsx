"use client";

import Image from "next/image";
import { flushSync } from "react-dom";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ribbonOffsets, type ExhibitionBadge } from "../lib/badges";
import { BadgeExhibition } from "./badge-exhibition";
import { Hand } from "./icons";
import { useClipSound } from "./clip-sound";
import { restingAngle, useExhibitionRail } from "./use-exhibition-rail";

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
  const { track, stage, carriage, needle, active, target, scenery, navigate } = useExhibitionRail(badges.length);
  const [indexOpen, setIndexOpen] = useState(false);
  const [focused, setFocused] = useState<number | null>(null);
  const [sceneEnabled, setSceneEnabled] = useState(false);
  const pickup = useRef<ViewTransition | null>(null);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const dialog = useRef<HTMLDialogElement>(null);
  const indexDialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const indexButton = useRef<HTMLButtonElement>(null);
  const inspectButton = useRef<HTMLButtonElement>(null);
  const selectedIndex = useRef<number | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const badge = badges[active];
  const sound = useClipSound();

  function step(direction: number) {
    void sound.click();
    navigate(Math.round(target.current) + direction);
  }

  function inspect(index: number, trigger?: HTMLElement) {
    const panel = dialog.current;
    if (!panel || panel.open || pickup.current) return;
    const specimen = carriage.current?.children[index]?.querySelector("img");
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    returnFocus.current = trigger ?? inspectButton.current;

    const open = () => {
      specimen?.style.removeProperty("view-transition-name");
      flushSync(() => {
        navigate(index, true);
        setSceneEnabled(false);
        setSeen(previous => previous.has(badges[index].id) ? previous : new Set([...previous, badges[index].id]));
        setFocused(index);
      });
      panel.showModal();
      panel.scrollTop = 0;
      closeButton.current?.focus({ preventScroll: true });
    };

    if (animate && specimen && document.startViewTransition) {
      delete panel.dataset.fadeIn;
      specimen.style.viewTransitionName = "inspected-badge";
      const transition = document.startViewTransition(open);
      pickup.current = transition;
      void transition.finished.then(() => {
        if (pickup.current === transition && panel.open) setSceneEnabled(true);
        if (pickup.current === transition) pickup.current = null;
      });
    } else {
      panel.dataset.fadeIn = String(animate);
      open();
      setSceneEnabled(true);
    }
  }

  function close() {
    pickup.current?.skipTransition();
    pickup.current = null;
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
          <header className="gallery-bar">
            <h1><span className="ticket-mark" aria-hidden="true" />The Lanyard Archive</h1>
            <p className="credit">Prince Kukreja’s collection</p>
            <div className="top-actions">
              <button className="sound-toggle" type="button" aria-label="Navigation clicks" aria-pressed={!sound.muted}
                title="Play a clasp click on Previous and Next" onClick={sound.toggle}>
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 8h3l4-4v12l-4-4H3z" />
                  {sound.muted ? <path d="m13 8 4 4m0-4-4 4"/> : <path d="M13 7a5 5 0 0 1 0 6m2-8a8 8 0 0 1 0 10"/>}
                </svg>
                <span>Clicks {sound.muted ? "off" : "on"}</span>
              </button>
              <button ref={indexButton} type="button" className="index-toggle" aria-haspopup="dialog"
                aria-controls="object-index" aria-expanded={indexOpen} onClick={openIndex}>
                <span aria-hidden="true">▦</span> Object index
              </button>
            </div>
          </header>
          <div className="display-wall">
            <div className="journey-record" aria-live="polite" aria-atomic="true">
              <div key={badge.id} className="caption-print">
                <p className="accession">Pass {number(active + 1)} <span>/ {number(badges.length)}</span></p>
                <h2 className="record-event">{eventTitle(badge)}</h2>
                <p className="inscription">{badge.label.inscription}</p>
              </div>
              <button ref={inspectButton} className="journey-inspect" type="button"
                onClick={event => inspect(active, event.currentTarget)}>
                <Hand /> Pick up pass
              </button>
            </div>
            <div className="journey-view">
              <div ref={scenery} className="scenery" aria-hidden="true">
                <div className="print-sun" />
                <div className="panorama" />
                <div className="clasp-guide" data-examined={seen.has(badge.id)}>
                  <Image className="guide-walk" src="/exhibition/clasp.webp" alt="" width={455} height={650} priority unoptimized />
                  <Image className="guide-read" src="/exhibition/clasp-reader.webp" alt="" width={518} height={650} unoptimized />
                </div>
              </div>
              <div ref={carriage} className="object-carriage">
                {badges.map((item, i) => (
                  <div key={item.id} className="object-mount" style={{ "--i": i } as CSSProperties}>
                    <button type="button" className="hanging" data-featured={i === active}
                      style={{ transform: `rotateZ(${restingAngle(i)}deg)` }}
                      tabIndex={i === active ? 0 : -1} aria-hidden={i !== active} aria-label={`Inspect ${eventTitle(item)}`}
                      onClick={e => inspect(i, e.currentTarget)}>
                      {ribbonOffsets(item.lanyard).map(offset => (
                        <span aria-hidden="true" className="wall-pin" key={offset}
                          style={{ left: `${50 + offset / (300 * 464 / 980) * 100}%` }} />
                      ))}
                      <Image src={item.artwork.specimen} width={464} height={980} alt=""
                        loading={i < 3 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} unoptimized />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <footer className="journey-controls">
            <button className="step-button" type="button" aria-label="Previous object" disabled={active === 0} onClick={() => step(-1)}>
              <span aria-hidden="true">←</span><b>Previous</b>
            </button>
            <label className="ribbon-browser">

              <span className="swatch-track" style={{ "--swatch-count": badges.length } as CSSProperties}>
                <span className="swatches" aria-hidden="true">
                  {badges.map((item, index) => (
                    <span key={item.id} className="swatch" data-selected={active === index} style={ribbonStyle(item)}><i /><small>{number(index + 1)}</small></span>
                  ))}
                </span>
                <span ref={needle} className="needle" aria-hidden="true" />
                <input aria-label="Browse by ribbon" aria-valuetext={`${active + 1} of ${badges.length}, ${eventTitle(badge)}`}
                  type="range" min={0} max={badges.length - 1} step={1} value={active}
                  onChange={e => navigate(e.currentTarget.valueAsNumber, true)} />
              </span>
            </label>
            <button className="step-button" type="button" aria-label="Next object" disabled={active === badges.length - 1} onClick={() => step(1)}>
              <b>Next</b><span aria-hidden="true">→</span>
            </button>
          </footer>
        </div>
      </section>
      <dialog className="index-dialog" id="object-index" ref={indexDialog} aria-labelledby="index-title" onClose={closeIndex}>
        <header className="index-header">
          <div><h2 id="index-title">Object index</h2><p className="viewed-count">{seen.size} of {badges.length} passes viewed</p></div>
          <button type="button" onClick={() => indexDialog.current?.close()}>Close <span aria-hidden="true">×</span></button>
        </header>
        <div className="object-index">
          {badges.map((item, index) => (
            <button type="button" key={item.id} aria-current={index === active ? "step" : undefined}
              onClick={() => { selectedIndex.current = index; indexDialog.current?.close(); }}>
              <span className="index-print" style={ribbonStyle(item)}>
                <span className="index-ribbon" aria-hidden="true" />
                {seen.has(item.id) && <small className="viewed-stamp">Viewed</small>}
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
              <BadgeExhibition key={badges[focused].id} config={badges[focused]} sceneEnabled={sceneEnabled} />
              {records[focused]}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
