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
    const begin = ['film-0', 'film-1', 'film-2', 'film-3'];   // exact het eerste beeld van elke clip
    const eind = ['film-1', 'film-2', 'film-3', 'film-4'];    // laatste beeld = begin van de volgende clip
    let huidig = 0, zelfGekozen = false, gepauzeerd = false, inBeeld = true;
    const rail = $$('.nh-rail [data-deel]', buhne);
    const zetVoortgang = x => { balk.style.transform = `scaleX(${x})`; rail.forEach((r, n) => r.style.setProperty('--voortgang', n === huidig ? x : 0)); };
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

    // Twee video's lossen elkaar af: de lopende blijft op zijn laatste beeld staan
    // tot de volgende echt speelt. Zo valt er nooit een tussenbeeld of flits.
    const films = [film, film.cloneNode()];
    delete films[1].dataset.nhFilm;
    film.after(films[1]);
    let voor = 0, beurt = 0;
    const bron = i => `/assets/${gsm.matches ? 'film-mobile' : 'film-desktop'}/${data.delen[i].film}.mp4`;
    function speel(i) {
      const mijn = ++beurt;
      const nieuw = films[1 - voor], oud = films[voor];
      nieuw.src = bron(i);
      nieuw.addEventListener('playing', () => {
        if (mijn !== beurt) return;
        nieuw.classList.add('is-klaar', 'is-voor'); oud.classList.remove('is-voor');
        voor = films.indexOf(nieuw);
        setTimeout(() => { if (films[voor] !== oud) { oud.pause(); oud.classList.remove('is-klaar'); } }, 260);   // pas weg als de nieuwe volledig staat
      }, { once: true });
      if (!gepauzeerd && inBeeld) nieuw.play().catch(() => { pauze.hidden = true; });
    }
    const actief = () => films[voor];

    function kies(i, door) {
      huidig = i;
      if (door) zelfGekozen = true;
      tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
      gsmTabs.forEach((t, n) => t.classList.toggle('is-actief', n === i));
      rail.forEach((t, n) => t.classList.toggle('is-actief', n === i));
      vulPaneel(i);
      if (rust) { zetBeeld(eind[i]); return; }
      if (!films.some(f => f.classList.contains('is-klaar'))) zetBeeld(begin[i]);   // poster enkel vóór de eerste clip
      zetVoortgang(0);
      speel(i);
    }

    if (!rust) {
      pauze.hidden = false;
      films.forEach(f => {
        f.addEventListener('timeupdate', () => { if (f === actief()) zetVoortgang(f.currentTime / (f.duration || 1)); });
        f.addEventListener('ended', () => {
          if (f !== actief() || zelfGekozen) return;   // zelf gekozen: blijft op het resultaat staan
          kies((huidig + 1) % 4);
        });
      });
      pauze.addEventListener('click', () => {
        gepauzeerd = !gepauzeerd;
        pauze.classList.toggle('is-gepauzeerd', gepauzeerd);
        pauze.setAttribute('aria-label', gepauzeerd ? 'Film afspelen' : 'Film pauzeren');
        gepauzeerd ? actief().pause() : actief().play().catch(() => {});
      });
      new IntersectionObserver(([e]) => {
        inBeeld = e.isIntersecting;
        if (!inBeeld) actief().pause(); else if (!gepauzeerd && actief().src) actief().play().catch(() => {});
      }, { threshold: .15 }).observe(buhne);
      document.addEventListener('visibilitychange', () => { if (document.hidden) actief().pause(); else if (inBeeld && !gepauzeerd && actief().src) actief().play().catch(() => {}); });
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
    rail.forEach((t, n) => t.addEventListener('click', () => kies(n, true)));
    $('[data-alle-diensten]', buhne)?.addEventListener('click', () => {
      const knop = document.querySelector('.nav-toggle');
      if (knop && getComputedStyle(knop).display !== 'none') { scrollTo({ top: 0 }); knop.click(); knop.focus(); }
      else document.querySelector('.mobile-toggle')?.click();
    });
  }

  /* ── kop over de film: effen zodra je de film voorbij scrolt ── */
  const root = document.documentElement;
  if (root.classList.contains('kop-over')) {
    const zet = () => root.classList.toggle('kop-vast', scrollY > 24);
    zet(); addEventListener('scroll', zet, { passive: true });
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

  /* ── C · zet de koffie maar klaar: het huis verandert mee ──── */
  const kader = $('[data-nk]');
  if (kader) {
    const vorm = $('[data-nk-vorm]'), a = $('[data-nk-a]'), b = $('[data-nk-b]');
    const lagen = { wp: $('[data-nk-wp]'), steiger: $('[data-nk-steiger]'), laadpaal: $('[data-nk-laadpaal]'), bord: $('[data-nk-bord]') };
    const klein = matchMedia('(max-width: 700px)').matches ? '-800' : '';
    const pad = n => `/assets/huis/${n}${klein}.webp`;
    const namen = { open: 'Open bebouwing', halfopen: 'Halfopen woning', rij: 'Rijwoning', appartement: 'Appartement' };
    let nu = null, beurt = 0, klok;

    function lees() {
      const f = new FormData(vorm), wat = f.getAll('wat');
      return { wat, type: f.get('woning') || 'open', wanneer: f.get('wanneer'),
        dak: wat.includes('Dak'), zon: wat.includes('Zonnepanelen'), gevel: wat.includes('Gevel'), wp: wat.includes('Warmtepomp of airco'), laadpaal: wat.includes('Laadpaal') };
    }
    const laad = src => { const im = new Image(); im.src = src; return (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => src); };
    function toon() {
      const s = lees(), naam = `${s.type}-${+s.dak}${+s.zon}${+s.gevel}`;
      const actief = { wp: s.wp, laadpaal: s.laadpaal, steiger: s.wanneer === 'Zo snel mogelijk', bord: s.wanneer === 'Binnen het halfjaar' };
      const ander = nu && nu.type !== s.type, vorige = nu, mijn = ++beurt;
      // bij een ander woningtype: de lagen meteen weg, en alles pas tonen als het nieuwe huis én zijn lagen geladen zijn
      if (ander) { kader.classList.add('is-wissel'); Object.values(lagen).forEach(l => l.classList.remove('is-aan')); }
      const nodig = [laad(pad(naam)), ...Object.keys(actief).filter(k => actief[k]).map(k => laad(pad(`${s.type}-${k}`)))];
      Promise.all(nodig).then(([bron]) => {
        if (mijn !== beurt) return;
        if (!vorige || vorige.naam !== naam) {
          const veeg = !vorige || ander ? 'type' : vorige.dak !== s.dak ? 'dak' : vorige.zon !== s.zon ? 'zon' : 'gevel';
          if (b.classList.contains('is-in')) a.src = b.src;          // een lopende wissel eerst vastzetten
          b.classList.remove('is-in'); b.dataset.veeg = veeg; b.src = bron; void b.offsetWidth; b.classList.add('is-in');
          clearTimeout(klok); klok = setTimeout(() => { a.src = bron; b.classList.remove('is-in'); }, veeg === 'type' ? 420 : 1000);
        }
        requestAnimationFrame(() => {
          kader.classList.remove('is-wissel');
          for (const k in lagen) { const l = lagen[k], doel = pad(`${s.type}-${k}`); if (actief[k] && !l.src.endsWith(doel)) l.src = doel; l.classList.toggle('is-aan', !!actief[k]); }
        });
      });
      const delen = s.wat.map(w => w.toLowerCase());
      const lijst = delen.length > 1 ? delen.slice(0, -1).join(', ') + ' en ' + delen.at(-1) : delen[0];
      $('[data-nk-bijschrift]').textContent = namen[s.type] + (s.dak || s.zon || s.gevel || s.wp || s.laadpaal ? ', met jouw keuzes' : ', zoals ze er nu staat');
      $('[data-nk-zin]').textContent = delen.length
        ? `${lijst.charAt(0).toUpperCase() + lijst.slice(1)} voor je ${namen[s.type].toLowerCase()}${s.wanneer && s.wanneer !== 'Ik kijk nog rond' ? ', ' + s.wanneer.toLowerCase() : ''}. ${s.wanneer === 'Ik kijk nog rond' ? 'Geen haast: de koffie staat klaar wanneer jij wil.' : 'We komen gratis langs om op te meten.'}`
        : 'Kies wat je wil aanpakken. Het huis doet mee.';
      nu = { ...s, naam };
    }
    vorm.addEventListener('change', () => { stopFilm(); toon(); });

    /* het huis beweegt lichtjes mee met de muis */
    function stopFilm() {}
    const kantel = $('[data-nk-kantel]');
    if (kantel && !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const sectie = kader.closest('.nk'); let dx = 0, dy = 0, x = 0, y = 0, loopt = false;
      const stap = () => {
        x += (dx - x) * .08; y += (dy - y) * .08;
        kantel.style.transform = `rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 2.6).toFixed(2)}deg) translate3d(${(-x * 10).toFixed(1)}px, ${(-y * 6).toFixed(1)}px, 0)`;
        if (Math.abs(dx - x) + Math.abs(dy - y) > .002) requestAnimationFrame(stap); else loopt = false;
      };
      const start = () => { if (!loopt) { loopt = true; requestAnimationFrame(stap); } };
      sectie.addEventListener('pointermove', e => { const r = kader.getBoundingClientRect(); dx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (innerWidth / 2))); dy = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (innerHeight / 2))); start(); });
      sectie.addEventListener('pointerleave', () => { dx = dy = 0; start(); });
    }

    // de andere standen van dit type alvast ophalen zodra de sectie in beeld komt
    new IntersectionObserver(([e], io) => {
      if (!e.isIntersecting) return; io.disconnect();
      const standen = () => { const t = lees().type; for (let i = 0; i < 8; i++) new Image().src = pad(`${t}-${i.toString(2).padStart(3, '0')}`); };
      standen(); vorm.addEventListener('change', e2 => { if (e2.target.name === 'woning') standen(); });
      // de andere woningtypes alvast klaarzetten in de stand die nu gekozen is, zodat wisselen niet hapert
      const andere = () => { const st = lees(), c = `${+st.dak}${+st.zon}${+st.gevel}`; ['open', 'halfopen', 'rij', 'appartement'].forEach(t => { new Image().src = pad(`${t}-${c}`); }); };
      (window.requestIdleCallback || setTimeout)(andere); vorm.addEventListener('change', andere);
    }, { rootMargin: '300px' }).observe(kader);

    /* de keuzes gaan mee naar het contactformulier, op dit toestel en enkel tijdelijk */
    $('[data-nk-knop]').addEventListener('click', () => {
      const s = lees();
      const naarDienst = { 'Dak': 'Dakrenovatie', 'Zonnepanelen': 'Zonnepanelen', 'Thuisbatterij': 'Thuisbatterijen', 'Gevel': 'Gevelrenovatie', 'Warmtepomp of airco': 'Airco & warmtepompboilers', 'Laadpaal': 'Laadpalen' };
      try {
        const plan = new Set(JSON.parse(localStorage.getItem('nest-project-v2') || '[]'));
        s.wat.forEach(w => naarDienst[w] && plan.add(naarDienst[w]));
        localStorage.setItem('nest-project-v2', JSON.stringify([...plan]));
        const tekst = `Graag een gratis opmeetbezoek.\nWat: ${s.wat.join(', ') || 'nog niet gekozen'}\nWoning: ${namen[s.type]}\nStart: ${s.wanneer || 'nog niet gekozen'}`;
        sessionStorage.setItem('nest-opmeting', JSON.stringify({ tekst, gemaakt: Date.now() }));
      } catch {}
    });
    toon();
  }
})();
