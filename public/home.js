/* ═══ NEST · homepage ═══ */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const data = JSON.parse($('#nh-data')?.textContent || '{}');
  const rust = matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData;
  const gsm = matchMedia('(max-width: 860px)');

  /* ── A · het huis is het menu ─────────────────────────────── */
  const buhne = $('[data-buhne]');
  if (buhne && data.delen) {
    const film = $('[data-nh-film]', buhne), poster = $('[data-poster]', buhne), pauze = $('[data-pauze]', buhne);
    const paneel = $('#nh-paneel'), balk = $('[data-p-balk]');
    const tabs = $$('.nh-punt', buhne), gsmTabs = $$('.nh-tabs-gsm button', buhne);
    const begin = ['k1_oud', 'k2_dak', 'k3_zon', 'k4_gevel'];   // eerste beeld van elke clip
    const eind = ['k2_dak', 'k3_zon', 'k4_gevel', 'k5_nest'];    // resultaat van elke clip
    let huidig = 0, zelfGekozen = false, gepauzeerd = false, inBeeld = true;
    const zetBeeld = k => { poster.srcset = `/assets/web/${k}-800.webp 800w, /assets/web/${k}-1280.webp 1280w, /assets/web/${k}.webp 1700w`; poster.src = `/assets/web/${k}-1280.webp`; };

    function vulPaneel(i) {
      const d = data.delen[i];
      $('[data-p-nr]', paneel).textContent = String(i + 1).padStart(2, '0');
      $('[data-p-titel]', paneel).textContent = d.titel;
      $('[data-p-tekst]', paneel).textContent = d.tekst;
      $('[data-p-punten]', paneel).replaceChildren(...d.punten.map(p => Object.assign(document.createElement('li'), { textContent: p })));
      const foto = $('[data-p-foto]', paneel); foto.src = d.foto.replace('.webp', '-240.webp'); foto.alt = d.fotoTekst;
      $('[data-p-fototekst]', paneel).textContent = d.fotoTekst;
      const knop = $('[data-p-knop]', paneel); knop.href = '/contact/?onderwerp=' + encodeURIComponent(d.titel); knop.firstChild.textContent = d.knop + ' ';
      $('[data-p-link]', paneel).href = d.link;
      paneel.setAttribute('aria-labelledby', 'nh-tab-' + i);
      paneel.classList.remove('is-wissel'); void paneel.offsetWidth; paneel.classList.add('is-wissel');
    }

    function speel(i) {
      film.classList.remove('is-klaar');
      film.src = `/assets/${gsm.matches ? 'film-mobile' : 'film-desktop'}/${data.delen[i].film}.mp4`;
      if (!gepauzeerd && inBeeld) film.play().catch(() => { pauze.hidden = true; });
    }

    function kies(i, door) {
      huidig = i;
      if (door) zelfGekozen = true;
      tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
      gsmTabs.forEach((t, n) => t.classList.toggle('is-actief', n === i));
      vulPaneel(i);
      if (rust) { zetBeeld(eind[i]); return; }
      zetBeeld(begin[i]);   // geen flits naar een ander beeld tijdens het laden
      balk.style.transform = 'scaleX(0)';
      speel(i);
    }

    if (!rust) {
      pauze.hidden = false;
      film.addEventListener('playing', () => film.classList.add('is-klaar'));
      film.addEventListener('timeupdate', () => { balk.style.transform = `scaleX(${film.currentTime / (film.duration || 1)})`; });
      film.addEventListener('ended', () => {
        if (zelfGekozen) { zetBeeld(eind[huidig]); return; }   // blijft staan op het resultaat
        kies((huidig + 1) % 4);
      });
      pauze.addEventListener('click', () => {
        gepauzeerd = !gepauzeerd;
        pauze.classList.toggle('is-gepauzeerd', gepauzeerd);
        pauze.setAttribute('aria-label', gepauzeerd ? 'Film afspelen' : 'Film pauzeren');
        gepauzeerd ? film.pause() : film.play().catch(() => {});
      });
      new IntersectionObserver(([e]) => {
        inBeeld = e.isIntersecting;
        if (!inBeeld) film.pause(); else if (!gepauzeerd && film.src) film.play().catch(() => {});
      }, { threshold: .15 }).observe(buhne);
      document.addEventListener('visibilitychange', () => { if (document.hidden) film.pause(); else if (inBeeld && !gepauzeerd) film.play().catch(() => {}); });
      // de film wacht tot de pagina geladen is: eerst de titel en het beeld, dan pas beweging
      const start = () => setTimeout(() => { if (!zelfGekozen) speel(0); }, gsm.matches ? 1400 : 400);
      document.readyState === 'complete' ? start() : addEventListener('load', start, { once: true });
    }

    tabs.forEach((t, n) => {
      t.addEventListener('click', () => kies(n, true));
      t.addEventListener('keydown', e => {
        const stap = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (stap) { e.preventDefault(); const j = (n + stap + 4) % 4; kies(j, true); tabs[j].focus(); }
      });
    });
    gsmTabs.forEach((t, n) => t.addEventListener('click', () => kies(n, true)));
  }

  /* ── B · klanten noemen ons bij naam ──────────────────────── */
  const lijst = $('[data-stemmen]');
  if (lijst && data.reviews) {
    const varianten = { Joeri: 'Joeri|Jouri|Joerie', Tommy: 'Tommy', Danny: 'Danny', Glenn: 'Glenn|Glen', ploeg: 'Franky|Nestmakers|NestMakers' };
    const knoppen = $$('[data-wie]');
    function toon(wie) {
      knoppen.forEach(k => k.setAttribute('aria-pressed', String(k.dataset.wie === wie)));
      const set = data.reviews.filter(r => wie === 'ploeg' ? !r.over : r.over.split(',').map(s => s.trim()).includes(wie));
      const re = new RegExp(`\\b(${varianten[wie]})\\b`, 'g');
      lijst.replaceChildren(...set.map((r, i) => {
        const b = document.createElement('blockquote'); b.className = 'nh-stem' + (i === 0 ? ' nh-stem--groot' : '');
        const p = document.createElement('p');
        r.tekst.split(re).forEach((stuk, n) => p.append(n % 2 ? Object.assign(document.createElement('mark'), { textContent: stuk }) : stuk));
        const f = document.createElement('footer');
        const s = Object.assign(document.createElement('span'), { textContent: '★'.repeat(r.sterren) }); s.setAttribute('aria-label', `${r.sterren} op 5 sterren`);
        f.append(s, r.klant); b.append(p, f); return b;
      }));
      lijst.classList.toggle('is-lang', set.length > 4);
    }
    knoppen.forEach(k => k.addEventListener('click', () => toon(k.dataset.wie)));
  }

  /* ── C · de plooimeter ────────────────────────────────────── */
  const vorm = $('[data-vragen]');
  if (vorm) {
    document.documentElement.classList.add('js-meter');
    const sectie = vorm.closest('.nh-meter');
    const stappen = $$('[data-stap]', vorm), leden = $$('.ds-lid .ds-lid', sectie);
    const teller = $('[data-stapteller]', vorm), terug = $('[data-terug]', vorm), volgende = $('[data-volgende]', vorm);
    let stap = 0;

    function naar(n) {
      stap = n;
      stappen.forEach(s => s.classList.toggle('is-actief', +s.dataset.stap === n));
      leden.forEach((l, i) => l.classList.toggle('is-open', i < n || (n === 3 && i === 3)));
      sectie.classList.toggle('is-af', n === 3);
      teller.textContent = n < 3 ? `Vraag ${n + 1} van 3` : 'Klaar';
      terug.hidden = n === 0;
      if (n === 3) vatSamen();
    }
    function gekozen(naam) { return $$(`input[name="${naam}"]:checked`, vorm).map(i => i.value); }
    function vatSamen() {
      const wat = gekozen('wat'), woning = gekozen('woning')[0], wanneer = gekozen('wanneer')[0];
      $('[data-samenvatting]', vorm).textContent = [wat.join(', '), woning, wanneer].filter(Boolean).join(' · ');
    }

    vorm.addEventListener('change', e => {
      if (e.target.name === 'wat') volgende.disabled = !gekozen('wat').length;
      if (e.target.type === 'radio') setTimeout(() => naar(stap + 1), 260);
    });
    volgende.addEventListener('click', () => naar(1));
    terug.addEventListener('click', () => naar(Math.max(0, stap - 1)));

    /* de keuzes gaan mee naar het contactformulier, op dit toestel en enkel tijdelijk */
    $('[data-meter-knop]', vorm).addEventListener('click', () => {
      const naarDienst = { 'Dak': 'Dakrenovatie', 'Zonnepanelen': 'Zonnepanelen', 'Thuisbatterij': 'Thuisbatterijen', 'Gevel': 'Gevelrenovatie', 'Airco of boiler': 'Airco & warmtepompboilers', 'Laadpaal': 'Laadpalen', 'Alles in één keer': 'Totaalrenovatie' };
      try {
        const plan = new Set(JSON.parse(localStorage.getItem('nest-project-v2') || '[]'));
        gekozen('wat').forEach(w => naarDienst[w] && plan.add(naarDienst[w]));
        localStorage.setItem('nest-project-v2', JSON.stringify([...plan]));
        const tekst = `Graag een gratis opmeetbezoek.\nWat: ${gekozen('wat').join(', ')}\nWoning: ${gekozen('woning')[0] || 'nog niet gekozen'}\nStart: ${gekozen('wanneer')[0] || 'nog niet gekozen'}`;
        sessionStorage.setItem('nest-opmeting', JSON.stringify({ tekst, gemaakt: Date.now() }));
      } catch {}
    });
    naar(0);
  }
})();
