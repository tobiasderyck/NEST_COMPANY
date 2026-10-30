/* ═══ NEST COMPANY — scroll-scrub engine ═══
   Eén sticky canvas, één doorlopende tijdlijn: 4 clips achter elkaar,
   naadloos geketend via gedeelde keyframes (eind clip n = begin clip n+1).
   De scroll speelt één ononderbroken film: van verweerd huis tot warm nest.
   Overlays faden op [data-in, data-out]-vensters van de totale voortgang. */

(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual"; // reis start altijd bij het oude huis
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const journey = document.getElementById("journey");
  const canvas = document.getElementById("journeyCanvas");
  if (!journey || !canvas) return;
  const ctx = canvas.getContext("2d");

  const CLIPS = ["v1_dak", "v2_zon", "v3_gevel", "v4_nest"];
  const PER = 109;
  const TOTAL = CLIPS.length * PER;

  const frames = new Array(TOTAL);
  let loaded = 0;
  let cur = -1;
  let smoothF = 0;

  const overlays = [...journey.querySelectorAll("[data-in]")].map((o) => ({
    o, tin: parseFloat(o.dataset.in), tout: parseFloat(o.dataset.out),
  }));

  const rail = document.getElementById("rail");
  const railSpans = rail ? [...rail.querySelectorAll("span")] : [];

  function framePath(g) {
    const clip = CLIPS[Math.floor(g / PER)];
    const local = (g % PER) + 1;
    return `assets/frames/${clip}/frame_${String(local).padStart(4, "0")}.jpg`;
  }

  /* ── preload: clip 1 eerst, daarna de rest ── */
  let firstReady = false;
  function load(g) {
    const img = new Image();
    img.decoding = "async";
    img.src = framePath(g);
    img.onload = () => {
      frames[g] = img;
      loaded++;
      if (g === 0 && cur < 0) paint(0);
      if (!firstReady && loaded >= PER * 0.5) {
        firstReady = true;
        document.dispatchEvent(new CustomEvent("scrub:ready"));
      }
    };
    img.onerror = () => {
      if (!firstReady && g === 0) {
        firstReady = true;
        document.dispatchEvent(new CustomEvent("scrub:ready")); // frames ontbreken: site niet blokkeren
      }
    };
  }
  for (let g = 0; g < PER; g++) load(g);            // akte 1 met voorrang
  setTimeout(() => { for (let g = PER; g < TOTAL; g++) load(g); }, 300);

  /* ── tekenen (cover-fit) ── */
  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.round(r.width * DPR);
    canvas.height = Math.round(r.height * DPR);
    const vorig = cur;
    cur = -1;
    if (vorig >= 0) paint(vorig);
    else paint(Math.round(smoothF));
  }

  function nearest(g) {
    if (frames[g]) return g;
    for (let d = 1; d < 12; d++) {
      if (frames[g - d]) return g - d;
      if (frames[g + d]) return g + d;
    }
    return frames[0] ? 0 : -1;
  }

  function drawCover(img, alpha) {
    const cw = canvas.width, ch = canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    ctx.globalAlpha = 1;
  }

  /* Seedance landt niet pixelperfect op het eindframe: rond elke clipgrens
     lossen we ±BLEND frames op in een dissolve, anders verspringt het beeld. */
  const BLEND = 7;
  function paint(g) {
    const use = nearest(g);
    if (use < 0) return;
    const boundary = Math.round(use / PER) * PER; // dichtstbijzijnde clipgrens
    const inZone = boundary > 0 && boundary < TOTAL && Math.abs(use - boundary) <= BLEND;
    if (inZone) {
      const before = frames[Math.min(use, boundary - 1)] ? Math.min(use, boundary - 1) : nearest(boundary - 1);
      const after = frames[Math.max(use, boundary)] ? Math.max(use, boundary) : nearest(boundary);
      const mix = (use - (boundary - BLEND)) / (2 * BLEND);
      if (before >= 0 && frames[before]) drawCover(frames[before], 1);
      if (after >= 0 && frames[after]) drawCover(frames[after], Math.min(1, Math.max(0, mix)));
    } else {
      drawCover(frames[use], 1);
    }
    cur = use;
  }

  /* ── voortgang ── */
  function progress() {
    const r = journey.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    if (total <= 0) return 0;
    return Math.min(1, Math.max(0, -r.top / total));
  }

  function smooth01(x) {
    x = Math.min(1, Math.max(0, x));
    return x * x * (3 - 2 * x);
  }

  function update() {
    const r = journey.getBoundingClientRect();
    const visible = r.bottom > 0;
    if (visible) {
      const t = progress();
      const target = t * (TOTAL - 1);
      if (Math.abs(target - smoothF) > 60) smoothF = target; // ankers/reload: snap
      else smoothF += (target - smoothF) * (REDUCED ? 1 : 0.24); // Lenis levert de gladheid al
      const g = Math.round(smoothF);
      if (g !== cur) paint(g);

      for (const { o, tin, tout } of overlays) {
        const fadeIn = tin <= 0 ? 1 : smooth01((t - tin) / 0.022);
        const fadeOut = 1 - smooth01((t - tout) / 0.016);
        const a = Math.min(fadeIn, fadeOut);
        o.style.opacity = a.toFixed(3);
        o.style.transform = `translateY(${(1 - a) * 24}px)`;
        o.style.visibility = a <= 0.001 ? "hidden" : "visible";
      }

      if (rail) {
        const inJourney = t > 0.004 && t < 0.996 && r.top <= 0;
        rail.classList.toggle("is-on", inJourney);
        const act = Math.min(railSpans.length - 1, Math.floor(t * CLIPS.length));
        railSpans.forEach((s, i) => s.classList.toggle("is-live", i === act));
      }
    } else if (rail) {
      rail.classList.remove("is-on");
    }
  }

  function loop() {
    update();
    requestAnimationFrame(loop);
  }

  resize();
  // vangt élke maatverandering van het canvas (ook pane-/layoutwissels zonder window-resize)
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      if (Math.round(r.width * DPR) !== canvas.width || Math.round(r.height * DPR) !== canvas.height) {
        resize(); update();
      }
    }).observe(canvas);
  }
  window.addEventListener("resize", () => { resize(); update(); });
  window.addEventListener("orientationchange", () => setTimeout(() => { resize(); update(); }, 120));
  window.addEventListener("scroll", update, { passive: true });
  requestAnimationFrame(loop);

  window.__scrub = { frames, get cur() { return cur; }, get smoothF() { return smoothF; }, get loaded() { return loaded; } };
})();
