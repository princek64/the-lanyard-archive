/* Browser host for the Solana Foundation's Solana OS WebAssembly firmware. */
(() => {
  const canvas = document.querySelector("canvas");
  const appName = document.querySelector(".app-name");
  const status = document.querySelector(".boot-status");
  const buttons = Array.from(document.querySelectorAll("[data-key]"));
  const leds = Array.from(document.querySelectorAll(".leds i"));
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape", "h"];
  const held = new Map();
  const releaseTimers = new Map();
  const lines = [];
  let os;
  let animation;
  let mask = 0;
  let booting = false;
  let active = true;
  let redraw;
  status.querySelector(".restart").addEventListener("click", () => location.reload());

  // An opaque origin has no peer badges. The firmware supports radios being absent.
  Object.defineProperty(window, "BroadcastChannel", { value: undefined });

  function press(key) {
    if (!os) return;
    clearTimeout(releaseTimers.get(key));
    if (!held.has(key)) held.set(key, performance.now());
    buttons[key].toggleAttribute("data-held", true);
    mask |= lines[key];
    os._emu_buttons_set(mask);
  }
  function release(key, immediate = false) {
    if (!held.has(key)) return;
    clearTimeout(releaseTimers.get(key));
    function finish() {
      held.delete(key);
      releaseTimers.delete(key);
      buttons[key].removeAttribute("data-held");
      mask &= ~lines[key];
      os?._emu_buttons_set(mask);
    }
    // Short taps must survive the firmware's 50 ms input polling interval.
    const delay = 85 - (performance.now() - held.get(key));
    if (immediate || delay <= 0) finish();
    else releaseTimers.set(key, setTimeout(finish, delay));
  }
  function releaseAll() {
    for (const key of held.keys()) release(key, true);
  }
  for (const [key, button] of buttons.entries()) {
    button.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      event.preventDefault();
      document.body.focus({ preventScroll: true });
      button.setPointerCapture(event.pointerId);
      press(key);
    });
    button.addEventListener("pointerup", () => release(key));
    button.addEventListener("pointercancel", () => release(key, true));
    button.addEventListener("lostpointercapture", () => release(key));
    button.addEventListener("click", event => {
      if (event.detail === 0) { press(key); release(key); }
    });
  }
  function keyboard(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Enter" && event.target.closest?.("button")) return;
    const key = event.key === "Backspace" ? 5 : keys.indexOf(event.key === "H" ? "h" : event.key);
    if (key < 0) return;
    event.preventDefault();
    if (event.type === "keyup") release(key);
    else if (!event.repeat) press(key);
  }
  window.addEventListener("keydown", keyboard);
  window.addEventListener("keyup", keyboard);
  window.addEventListener("blur", releaseAll);
  document.addEventListener("visibilitychange", () => { if (document.hidden) releaseAll(); });

  function failed() {
    status.querySelector("span").textContent = "Couldn’t start Solana OS.";
    status.querySelector(".restart").hidden = false;
    status.hidden = false;
    releaseAll();
    cancelAnimationFrame(animation);
  }
  window.addEventListener("message", async event => {
    if (event.source !== parent) return;
    if (event.data?.type === "display") {
      active = event.data.active;
      cancelAnimationFrame(animation);
      if (active) redraw?.();
      else releaseAll();
      return;
    }
    if (event.data?.type !== "boot" || booting) return;
    active = event.data.active;
    booting = true;
    let blobUrl;
    try {
      const bytes = event.data.firmware;
      if (!(bytes instanceof ArrayBuffer)) throw Error("Firmware unavailable");
      const context = canvas.getContext("2d", { alpha: false });
      const pixels = context.createImageData(320, 240);
      blobUrl = URL.createObjectURL(new Blob([bytes], { type: "application/wasm" }));
      os = await window.SolanaOS({
        locateFile: () => blobUrl,
        print: () => {}, printErr: () => {}, onAbort: failed,
        onRestart: () => location.reload(),
      });
      for (let i = 0; i < buttons.length; i++) lines.push(os._emu_button_line(i));
      let lastFrame = -1;
      let lastLeds = -1;
      function paint() {
        const frame = os._emu_frame();
        if (frame !== lastFrame) {
          lastFrame = frame;
          const start = os._emu_framebuffer();
          pixels.data.set(os.HEAPU8.subarray(start, start + pixels.data.length));
          context.putImageData(pixels, 0, 0);
          if (frame > 0) {
            status.hidden = true;
            const app = os.UTF8ToString(os._emu_current_app()) || "Launcher";
            if (appName.textContent !== app) appName.textContent = app;
          }
        }
        const version = os._emu_leds_version();
        if (lastLeds !== version) {
          lastLeds = version;
          const start = os._emu_leds() >>> 2;
          leds.forEach((led, i) => {
            const rgb = os.HEAPU32[start + i];
            const colour = [rgb >> 16 & 255, rgb >> 8 & 255, rgb & 255].map(v => Math.min(255, v * 10));
            led.style.backgroundColor = 'rgb(' + colour.join(',') + ')';
          });
        }
        const brightness = os._emu_backlight();
        canvas.style.filter = brightness === 100 ? "" : "brightness(" + brightness + "%)";
        animation = requestAnimationFrame(paint);
      }
      redraw = paint;
      if (active) paint();
    } catch { failed(); }
    finally { if (blobUrl) URL.revokeObjectURL(blobUrl); }
  });
  window.addEventListener("pagehide", () => {
    releaseAll();
    cancelAnimationFrame(animation);
    os?._emu_halt();
  });
})();
