/* ═══ NEST COMPANY runtime ═══ */

// ── dag/nacht ──
// De film is fotografisch en blijft in beide werelden hetzelfde; alleen de
// pagina eromheen wisselt van drager. De header krijgt daarom een eigen
// toestand zolang hij bóven de film hangt.
(function () {
  const wortel = document.documentElement;
  const knop = document.getElementById("themaKnop");
  if (!knop) return;

  function toon() {
    const licht = wortel.getAttribute("data-thema") === "licht";
    knop.setAttribute("aria-label", licht ? "Wissel naar nachtmodus" : "Wissel naar dagmodus");
    knop.setAttribute("aria-pressed", String(licht));
  }
  toon();

  knop.addEventListener("click", () => {
    const licht = wortel.getAttribute("data-thema") === "licht";
    if (licht) wortel.removeAttribute("data-thema");
    else wortel.setAttribute("data-thema", "licht");
    try { localStorage.setItem("nest-thema", licht ? "donker" : "licht"); } catch (e) {}
    toon();
  });
})();

// ── header: licht zolang hij boven de film hangt ──
(function () {
  const kop = document.getElementById("siteHeader");
  const film = document.getElementById("journey");
  if (!kop || !film) return;
  let vorig = null;
  function meten() {
    const r = film.getBoundingClientRect();
    const opFilm = r.bottom > 90; // headerhoogte
    if (opFilm !== vorig) {
      kop.classList.toggle("is-film", opFilm);
      vorig = opFilm;
    }
    requestAnimationFrame(meten);
  }
  requestAnimationFrame(meten);
})();

// ── preloader: van plan tot oplevering ──
const preloader = document.getElementById("preloader");
const preBar = document.getElementById("preBar");
const preStatus = document.getElementById("preStatus");
let pct = 0;
let framesReady = false;
let timedOut = false;
document.addEventListener("scrub:ready", () => { framesReady = true; });
setTimeout(() => { timedOut = true; }, 9000); // nooit eeuwig blokkeren

// teksten komen uit content/site.json (via de pagina); vaste waarden als vangnet
const T = Object.assign(
  { stap1: "PLANNEN", stap2: "OPBOUW", stap3: "AFWERKING", klaar: "WELKOM THUIS." },
  window.NEST_TEKSTEN || {}
);

const bouw = setInterval(() => {
  const cap = (framesReady || timedOut) ? 100 : 92;
  pct = Math.min(cap, pct + 3 + Math.random() * 9);
  preBar.style.width = pct + "%";
  preStatus.textContent =
    pct < 35 ? `${T.stap1} — ${Math.round(pct)}%` :
    pct < 70 ? `${T.stap2} — ${Math.round(pct)}%` :
    pct < 100 ? `${T.stap3} — ${Math.round(pct)}%` :
    T.klaar;
  if (pct >= 100) {
    clearInterval(bouw);
    setTimeout(() => {
      preloader.classList.add("is-done");
      document.body.classList.add("is-loaded");
    }, 350);
  }
}, 90);

// ── custom cursor ──
const cursor = document.getElementById("cursor");
if (cursor && window.matchMedia("(hover: hover)").matches) {
  let cx = -100, cy = -100, tx = -100, ty = -100;
  addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });
}

// ── scroll reveals + tellers ──
const counted = new WeakSet();
function runCounter(el) {
  if (counted.has(el)) return;
  counted.add(el);
  const target = parseInt(el.dataset.count, 10);
  const t0 = performance.now();
  const dur = 1400;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
      entry.target.querySelectorAll("[data-count]").forEach(runCounter);
    });
  },
  { threshold: 0.18 }
);
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

// ── diensten: zwevend voorbeeld bij hover ──
const peek = document.getElementById("dienstPeek");
const peekImg = document.getElementById("dienstPeekImg");
const rows = document.getElementById("dienstRows");
if (peek && rows && window.matchMedia("(hover: hover)").matches) {
  let px = 0, py = 0, tx2 = 0, ty2 = 0, on = false;
  rows.querySelectorAll("li[data-beeld]").forEach((li) => {
    li.addEventListener("mouseenter", () => {
      peekImg.src = li.dataset.beeld;
      peek.classList.add("is-on");
      on = true;
    });
    li.addEventListener("mouseleave", () => {
      peek.classList.remove("is-on");
      on = false;
    });
  });
  addEventListener("mousemove", (e) => { tx2 = e.clientX; ty2 = e.clientY; });
  (function volg() {
    px += (tx2 - px) * 0.12;
    py += (ty2 - py) * 0.12;
    if (on) peek.style.transform = "";
    peek.style.left = px + 26 + "px";
    peek.style.top = py - 90 + "px";
    requestAnimationFrame(volg);
  })();
}

// ── realisaties: slepen door de rail ──
const werkRail = document.getElementById("werkRail");
if (werkRail) {
  let down = false, startX = 0, startScroll = 0, moved = 0;
  werkRail.addEventListener("pointerdown", (e) => {
    down = true; moved = 0;
    startX = e.clientX; startScroll = werkRail.scrollLeft;
    werkRail.setPointerCapture(e.pointerId);
    werkRail.classList.add("is-dragging");
  });
  werkRail.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    werkRail.scrollLeft = startScroll - dx;
  });
  ["pointerup", "pointercancel"].forEach((ev) =>
    werkRail.addEventListener(ev, () => { down = false; werkRail.classList.remove("is-dragging"); })
  );
  werkRail.addEventListener("click", (e) => { if (moved > 8) e.preventDefault(); }, true);
}

// ── voor/na-slider ──
const vn = document.getElementById("vnStage");
if (vn) {
  function zet(clientX) {
    const r = vn.getBoundingClientRect();
    const p = Math.min(0.96, Math.max(0.04, (clientX - r.left) / r.width));
    vn.style.setProperty("--split", (p * 100).toFixed(2) + "%");
  }
  let bezig = false;
  vn.addEventListener("pointerdown", (e) => { bezig = true; vn.setPointerCapture(e.pointerId); zet(e.clientX); });
  vn.addEventListener("pointermove", (e) => { if (bezig) zet(e.clientX); });
  ["pointerup", "pointercancel"].forEach((ev) => vn.addEventListener(ev, () => { bezig = false; }));
  // klein automatisch duwtje zodra hij in beeld komt
  const vnIO = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    vnIO.disconnect();
    let t0 = null;
    (function demo(t) {
      if (bezig) return;
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / 1600, 1);
      const eased = 0.5 + Math.sin(p * Math.PI * 2) * 0.16 * (1 - p);
      vn.style.setProperty("--split", (eased * 100).toFixed(2) + "%");
      if (p < 1) requestAnimationFrame(demo);
    })(performance.now());
  }, { threshold: 0.45 });
  vnIO.observe(vn);
}
