/* ═══ MAXIMILIAAN — vloeiende scroll (Lenis) ═══
   Desktop: muiswiel-stappen worden uitgesmeerd tot één doorlopende beweging,
   zodat de filmframes niet in sprongen maar in een vloeiende lijn lopen.
   Mobiel: aanrakingen blijven natief (Lenis raakt touch standaard niet aan),
   daar regelt CSS scroll-snap de sectie-landing. */

(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.Lenis) return;

  const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    anchors: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  window.__lenis = lenis; // debug/inspectie
})();
