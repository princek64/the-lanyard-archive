"use client";

import { useEffect, useRef, useState } from "react";

export function useClipSound() {
  const [muted, setMuted] = useState(true);
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => () => { void audio.current?.close(); }, []);

  async function playClip() {
    if (!window.AudioContext) return;
    try {
      const ctx = audio.current ??= new AudioContext();
      if (ctx.state !== "running") await ctx.resume();
      const t = ctx.currentTime;
      // Two short, uneven transients suggest a spring gate closing.
      for (const [pitch, delay, volume] of [[1850, 0, 0.045], [2870, 0.012, 0.018]]) {
        const ring = ctx.createOscillator();
        const gain = ctx.createGain();
        ring.type = "triangle";
        ring.frequency.setValueAtTime(pitch, t + delay);
        ring.frequency.exponentialRampToValueAtTime(pitch * 0.6, t + delay + 0.023);
        gain.gain.setValueAtTime(volume, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.045);
        ring.connect(gain).connect(ctx.destination);
        ring.onended = () => { ring.disconnect(); gain.disconnect(); };
        ring.start(t + delay);
        ring.stop(t + delay + 0.05);
      }
    } catch { /* Audio can be unavailable while the page is backgrounded. */ }
  }
  function toggle() {
    setMuted(!muted);
    if (muted) void playClip();
  }

  return { muted, toggle, click: () => { if (!muted) void playClip(); } };
}
