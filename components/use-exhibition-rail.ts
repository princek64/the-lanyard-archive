"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./viewer-support";

export const restingAngle = (index: number) => Math.sin(index * 5 + .6) * 3;

export function useExhibitionRail(count: number) {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const carriage = useRef<HTMLDivElement>(null);
  const scenery = useRef<HTMLDivElement>(null);
  const needle = useRef<HTMLSpanElement>(null);
  const position = useRef(0);
  const target = useRef(0);
  const refresh = useRef<(immediate: boolean) => void>(() => {});
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = track.current;
    const panel = stage.current;
    const row = carriage.current;
    const viewport = row?.parentElement;
    if (!section || !panel || !row || !viewport) return;
    const objects = Array.from(row.querySelectorAll<HTMLElement>(".hanging"));
    let frame = 0;
    let lastTime = 0;
    let start = 0;
    let travel = 1;
    let pitch = 0;

    let tilt = 0;
    let shown = -1;
    function paint() {
      const p = position.current;
      row!.style.transform = `translate3d(${-p * pitch}px,0,0)`;
      scenery.current?.style.setProperty("--travel", reducedMotion ? "0" : String(p / Math.max(1, count - 1)));
      scenery.current?.style.setProperty("--hop", reducedMotion ? "0px" : `${-Math.abs(Math.sin(p * Math.PI * 2)) * Math.min(8, Math.abs(tilt) * 4)}px`);
      scenery.current?.style.setProperty("--lean", `${tilt.toFixed(2)}deg`);
      if (needle.current) needle.current.style.left = `${(p + 0.5) / count * 100}%`;
      for (let i = 0; i < objects.length; i++) {
        const offset = i - p;
        const away = Math.abs(offset);
        if (away >= 1) {
          if (objects[i].style.opacity !== "0") objects[i].style.opacity = "0";
          continue;
        }
        const weight = away * away * (3 - 2 * away);
        const turn = Math.sign(offset) * weight * -30;
        const origin = restingAngle(i) + (reducedMotion ? 0 : tilt);
        objects[i].style.transform = `perspective(1000px) rotateY(${turn}deg) rotateZ(${origin}deg) scale(${1 - weight * .53})`;
        objects[i].style.opacity = String(1 - weight * weight);
      }
      const next = Math.round(p);
      if (shown !== next) {
        shown = next;
        setActive(next);
      }
    }
    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, .08);
      lastTime = now;
      const delta = target.current - position.current;
      const step = delta * -Math.expm1(-16 * dt);
      position.current += step;
      const swing = Math.max(-3, Math.min(3, step / Math.max(.001, dt) * .65));
      tilt += (swing - tilt) * -Math.expm1(-12 * dt);
      if (Math.abs(delta) < .0005 && Math.abs(tilt) < .015) {
        position.current = target.current;
        tilt = 0;
        frame = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
      paint();
    }
    function read(immediate = false) {
      target.current = Math.max(0, Math.min(1, (window.scrollY - start) / travel)) * (count - 1);
      if (immediate || reducedMotion) {
        cancelAnimationFrame(frame);
        frame = 0;
        tilt = 0;
        position.current = target.current;
        paint();
      } else if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }
    function resize() {
      start = section!.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, section!.offsetHeight - panel!.offsetHeight);
      pitch = Math.min(viewport!.clientWidth * .38, viewport!.clientHeight * .43);
      row!.style.setProperty("--pitch", pitch + "px");
      if (shown < 0) read(true);
      else {
        paint();
        read();
      }
    }
    refresh.current = read;
    const scroll = () => read();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    resize();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
      refresh.current = () => {};
    };
  }, [count, reducedMotion]);

  function navigate(value: number, immediate = false) {
    const section = track.current;
    if (!section || !stage.current) return;
    const index = Math.max(0, Math.min(value, count - 1));
    const travel = section.offsetHeight - stage.current.offsetHeight;
    const top = section.getBoundingClientRect().top + window.scrollY + travel * index / Math.max(1, count - 1);
    window.scrollTo({top, behavior: "instant"});
    refresh.current(immediate);
  }

  return { track, stage, carriage, needle, active, target, scenery, navigate };
}
