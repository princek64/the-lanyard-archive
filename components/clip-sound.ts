"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SoundStatus = "off" | "starting" | "on" | "unavailable";

export function useClipSound(active: number) {
  const [status, setStatus] = useState<SoundStatus>("off");
  const audio = useRef<HTMLAudioElement | null>(null);

  const click = useCallback(() => {
    const clip = audio.current;
    if (!clip || !clip.paused) return;

    void clip.play().then(() => {
      if (audio.current === clip) setStatus("on");
    }).catch(() => {
      if (audio.current !== clip) return;
      audio.current = null;
      setStatus("unavailable");
    });
  }, []);

  useEffect(() => { click(); }, [active, click]);
  useEffect(() => () => {
    audio.current?.pause();
    audio.current = null;
  }, []);

  function toggle() {
    if (audio.current) {
      const clip = audio.current;
      audio.current = null;
      clip.pause();
      setStatus("off");
      return;
    }

    audio.current = new Audio("/audio/clasp.wav");
    setStatus("starting");
    click();
  }

  return { status, toggle, click };
}
