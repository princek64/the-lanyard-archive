"use client";

import { useEffect, useRef } from "react";

export function BadgeConsole({ directory, active }: { directory: string; active: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (active) frame.current?.focus({ preventScroll: true });
    frame.current?.contentWindow?.postMessage({ type: "display", active }, "*");
  }, [active]);

  async function boot() {
    const guest = frame.current?.contentWindow;
    if (!guest) return;
    try {
      const response = await fetch(directory + "/vendor/solana-os.wasm");
      if (!response.ok) throw new Error("Firmware unavailable");
      const firmware = await response.arrayBuffer();
      if (frame.current?.contentWindow === guest) {
        guest.postMessage({ type: "boot", firmware, active: !frame.current.hidden }, "*", [firmware]);
      }
    } catch {
      guest.postMessage({ type: "boot" }, "*");
    }
  }

  return <iframe ref={frame} src={directory + "/index.html"} className="badge-console"
    title="Use the Solana badge" hidden={!active} sandbox="allow-scripts" onLoad={() => {
      if (frame.current && !frame.current.hidden) frame.current.focus({ preventScroll: true });
      void boot();
    }} />;
}
