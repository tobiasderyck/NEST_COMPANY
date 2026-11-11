// NEST · het huis van "Zet de koffie maar klaar" in echte 3D.
// De modellen komen uit Blender (bron/3d/bouw_huis.py → export_glb.py). Materialen bouwen we hier op naam op.
// Blender (x, y, z) wordt in glTF (x, z, -y).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const BASIS = '/assets/huis3d/';
const uit = t => 1 - Math.pow(1 - t, 3);                       // snel beginnen, zacht landen
const inuit = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const klem = (v, a, b) => Math.max(a, Math.min(b, v));

export async function maakHuis(kader, { rustig = false } = {}) {
  const canvas = document.createElement('canvas'); canvas.className = 'nk-3d'; canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.AgXToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(25, 16 / 11, 1, 200);
  const [info, hdr] = await Promise.all([fetch(BASIS + 'info.json').then(r => r.json()), new RGBELoader().loadAsync(BASIS + 'lucht.hdr')]);
  const pmrem = new THREE.PMREMGenerator(renderer); scene.environment = pmrem.fromEquirectangular(hdr).texture; hdr.dispose(); pmrem.dispose();
  scene.environmentIntensity = 0.85; scene.environmentRotation.y = THREE.MathUtils.degToRad(125);

  const zon = new THREE.DirectionalLight(0xfff1dc, 2.6); zon.position.set(-13, 17, 15); zon.castShadow = true;
  zon.shadow.mapSize.set(2048, 2048); zon.shadow.bias = -0.0004; zon.shadow.normalBias = 0.03; zon.shadow.radius = 5;
  Object.assign(zon.shadow.camera, { left: -17, right: 17, top: 17, bottom: -17, near: 1, far: 70 }); zon.shadow.camera.updateProjectionMatrix();
  scene.add(zon, zon.target);
  const grond = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.ShadowMaterial({ opacity: 0.3 }));
  grond.rotation.x = -Math.PI / 2; grond.receiveShadow = true; scene.add(grond);

  // ── texturen en materialen ──
  const tl = new THREE.TextureLoader();
  const tex = (naam, kleur, kanaal = 0) => { const t = tl.load(BASIS + naam); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (kleur) t.colorSpace = THREE.SRGBColorSpace; t.channel = kanaal; return t; };
  const T = { bak: tex('baksteen.jpg', true), bakN: tex('baksteen-n.jpg', false), crepi: tex('crepi.jpg', true, 1), crepiN: tex('crepi-n.jpg', false, 1) };
  const snede = { dak: [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)],
                  gevel: [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)] };

  function pannen(mat, spreiding, mos) {
    mat.customProgramCacheKey = () => 'pan-' + spreiding + '-' + mos;      // anders deelt three.js één shader voor oud en nieuw
    mat.onBeforeCompile = sh => {
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
        varying vec3 vWp;
        float h21(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        float ruis(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }`)
        .replace('#include <color_fragment>', `#include <color_fragment>
        vec2 cel = floor(vec2(vWp.x / 0.25, vWp.y / 0.1993));
        diffuseColor.rgb *= mix(${(1 - spreiding).toFixed(2)}, ${(1 + spreiding * 0.6).toFixed(2)}, h21(cel));
        vec2 inCel = fract(vec2(vWp.x / 0.25, vWp.y / 0.1993));     // elke pan krijgt een schaduwrand onderaan en opzij
        diffuseColor.rgb *= mix(0.5, 1.0, smoothstep(0.0, 0.16, inCel.y)) * mix(0.72, 1.0, smoothstep(0.0, 0.08, inCel.x) * smoothstep(1.0, 0.86, inCel.x));
        ${mos ? `float m = ruis(vWp.xy * vec2(0.42, 1.1) + vWp.z * 0.2) * 0.65 + ruis(vWp.xy * 2.6) * 0.35;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.085, 0.1, 0.035), smoothstep(0.5, 0.72, m) * 0.72);
        diffuseColor.rgb *= mix(0.62, 1.0, smoothstep(0.25, 0.6, ruis(vWp.xy * 1.3 + 7.0)));` : ''}`);
    };
    return mat;
  }
  const effen = (kleur, ruw = .6, metaal = 0) => new THREE.MeshStandardMaterial({ color: kleur, roughness: ruw, metalness: metaal });
  const recept = {
    baksteen: () => new THREE.MeshStandardMaterial({ map: T.bak, normalMap: T.bakN, normalScale: new THREE.Vector2(1.2, 1.2), roughness: .92, color: 0xf2e6dc }),
    crepi: () => new THREE.MeshStandardMaterial({ map: T.crepi, normalMap: T.crepiN, normalScale: new THREE.Vector2(.8, .8), roughness: .95, color: 0xf6f1e8 }),
    pan_oud: () => pannen(new THREE.MeshStandardMaterial({ color: 0xb45c34, roughness: .86, side: THREE.DoubleSide }), .22, true),
    pan_nieuw: () => pannen(new THREE.MeshStandardMaterial({ color: 0x2c2f31, roughness: .5, side: THREE.DoubleSide }), .07, false),
    zink: () => effen(0x8d9296, .42, .9), zink_nieuw: () => effen(0x3a3d40, .4, .85), alu_zwart: () => effen(0x16181a, .35, .8),
    kozijn_oud: () => effen(0xe4e0d4, .6), kozijn_nieuw: () => effen(0x26292b, .45), deur_oud: () => effen(0x5d7560, .55), deur_nieuw: () => effen(0x2a2d2f, .4),
    blauwe_steen: () => effen(0x6a6b69, .6), plint_nieuw: () => effen(0x3b3e40, .8), boeiboord: () => effen(0xd9d4c8, .6), boei_nieuw: () => effen(0x2c2f31, .5),
    buur: () => effen(0xf2f0ea, 1), onderdak: () => effen(0x2b2622, .9), beton: () => effen(0xa39f95, .85), grind: () => effen(0x8b8880, .95), epdm: () => effen(0x232526, .7),
    wp_wit: () => effen(0xdcdcd8, .45), wp_rooster: () => effen(0x1b1d1e, .5, .6), plank: () => effen(0xb08d5e, .8), doek: () => effen(0xf4f2ec, .7),
    doek_oranje: () => effen(0xd14d29, .7), inkt: () => effen(0x1d2320, .6), gordijn: () => effen(0xdcd7ca, .9), binnen: () => effen(0x0b0c0d, .9),
    paneel: () => new THREE.MeshPhysicalMaterial({ color: 0x0a0d13, roughness: .1, metalness: .25, clearcoat: 1, clearcoatRoughness: .04 }),
    glas: () => new THREE.MeshPhysicalMaterial({ color: 0x0c1013, roughness: .03, metalness: .1, envMapIntensity: 1.7, clearcoat: 1, clearcoatRoughness: 0 }),
    balustrade: () => new THREE.MeshPhysicalMaterial({ color: 0xcfe0e4, roughness: .05, transparent: true, opacity: .28, side: THREE.DoubleSide })
  };
  const kast = new Map();
  function materiaal(naam, rol = '') {
    const sleutel = naam + '|' + rol; if (kast.has(sleutel)) return kast.get(sleutel);
    const m = (recept[naam] || (() => effen(0xbbbbbb)))(); m.name = naam;
    if (rol) { const [soort, kant] = rol.split('-'); m.clippingPlanes = [snede[soort][kant === 'oud' ? 0 : 1]]; m.clipShadows = true; }
    kast.set(sleutel, m); return m;
  }

  // Vlakke projectie op de muren, zoals in Blender: (langs de muur, hoogte). uv = baksteen, uv1 = crepi.
  function muurUv(mesh) {
    mesh.updateWorldMatrix(true, false);
    const g = mesh.geometry, p = g.attributes.position, nm = g.attributes.normal, v = new THREE.Vector3(), n = new THREE.Vector3();
    const nmat = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld), a = new Float32Array(p.count * 2), b = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(mesh.matrixWorld); n.fromBufferAttribute(nm, i).applyMatrix3(nmat).normalize();
      const langs = Math.abs(n.x) > .5 ? -v.z : v.x;
      a[i * 2] = langs / 1.9; a[i * 2 + 1] = v.y / 1.9; b[i * 2] = langs / 1.6; b[i * 2 + 1] = v.y / 1.6;
    }
    g.setAttribute('uv', new THREE.BufferAttribute(a, 2)); g.setAttribute('uv1', new THREE.BufferAttribute(b, 2));
  }

  // ── een woningtype laden en klaarzetten ──
  const lader = new GLTFLoader(), modellen = new Map();
  async function laad(type) {
    if (modellen.has(type)) return modellen.get(type);
    const belofte = lader.loadAsync(BASIS + type + '.glb').then(gltf => {
      const wortel = gltf.scene, inf = info[type], wissels = { dak: [], gevel: [] }, lagen = {}, oud = [];
      wortel.updateMatrixWorld(true);
      const meshes = []; wortel.traverse(o => { if (o.isMesh) meshes.push(o); });
      for (const o of meshes) {
        const naam = (o.material.name || '').replace(/\.\d+$/, ''), d = o.userData;
        const isBalustrade = o.name.startsWith('balustrade');
        o.castShadow = !isBalustrade; o.receiveShadow = true;
        if (naam === 'baksteen' || d.nieuw === 'crepi') muurUv(o);
        if (d.wissel) {
          o.material = materiaal(naam, d.wissel + '-oud');
          const nieuw = o.clone(); nieuw.material = materiaal(d.nieuw, d.wissel + '-nieuw'); nieuw.visible = false; o.parent.add(nieuw);
          wissels[d.wissel].push({ oud: o, nieuw });
        } else o.material = materiaal(isBalustrade ? 'balustrade' : naam);
        if (d.laag === 'oud') oud.push(o);
        else if (d.laag) (lagen[d.laag] ||= []).push(o);
      }
      // elke laag in een eigen groep met het draaipunt onderaan in het midden, zodat ze uit de grond kan groeien
      const groepen = {};
      for (const [naam, lijst] of Object.entries(lagen)) {
        const doos = new THREE.Box3(); lijst.forEach(o => doos.expandByObject(o));
        const g = new THREE.Group(); g.position.set((doos.min.x + doos.max.x) / 2, naam === 'zon' ? 0 : doos.min.y, (doos.min.z + doos.max.z) / 2);
        wortel.add(g); g.updateMatrixWorld(true);
        lijst.sort((a, b) => (a.userData.volg || 0) - (b.userData.volg || 0)).forEach(o => { g.attach(o); o.userData.thuis = o.position.clone(); });
        g.visible = false; groepen[naam] = { g, lijst, p: 0 };
      }
      const model = { type, wortel, wissels, groepen, oud, inf, pDak: 0, pGevel: 0,
        doel: new THREE.Vector3(inf.doel[0], inf.doel[2], -inf.doel[1]), cam: new THREE.Vector3(inf.camera[0], inf.camera[2], -inf.camera[1]) };
      wortel.visible = false; scene.add(wortel); return model;
    });
    modellen.set(type, belofte); return belofte;
  }

  // ── camera: eigen baan rond het huis, met traagheid ──
  let model = null, straal = 30, azBasis = 0, polBasis = 1.2;
  const baan = { az: 0, pol: 0, azDoel: 0, polDoel: 0, muisAz: 0, muisPol: 0, mAz: 0, mPol: 0 };
  function zetCamera() {
    const az = azBasis + baan.az + baan.mAz, pol = klem(polBasis + baan.pol + baan.mPol, .55, 1.5);
    camera.position.set(model.doel.x + straal * Math.sin(pol) * Math.sin(az), model.doel.y + straal * Math.cos(pol), model.doel.z + straal * Math.sin(pol) * Math.cos(az));
    camera.lookAt(model.doel);
  }
  function richt(m) {
    const v = m.cam.clone().sub(m.doel); straal = v.length(); polBasis = Math.acos(v.y / straal); azBasis = Math.atan2(v.x, v.z);
  }

  // ── standen en animaties ──
  const lopend = new Set(); let vuil = true, zichtbaar = false, vorigeTijd = 0;
  function anim(duur, stap, klaar) { const a = { t0: performance.now(), duur: rustig ? 1 : duur, stap, klaar }; lopend.add(a); wek(); return a; }
  function zetWissel(m, soort, p) {
    const dak = soort === 'dak', top = m.inf.H + m.inf.D * .45 + 1.5, half = m.inf.L / 2 + 9;
    if (dak) { const c = THREE.MathUtils.lerp(top, -0.5, p); snede.dak[0].constant = c; snede.dak[1].constant = -c; m.pDak = p; }
    else { const x = THREE.MathUtils.lerp(-half, half, p); snede.gevel[0].constant = -x; snede.gevel[1].constant = x; m.pGevel = p; }
    for (const w of m.wissels[soort]) { w.oud.visible = p < 1; w.nieuw.visible = p > 0; }
    if (!dak) m.oud.forEach(o => { o.visible = p < .5; });
  }
  function zetLaag(m, naam, p) {
    const l = m.groepen[naam]; if (!l) return; l.p = p; l.g.visible = p > 0;
    if (naam === 'zon') l.lijst.forEach((o, i) => {       // panelen zakken één voor één op hun plek
      const q = uit(klem(p * 1.7 - (i / l.lijst.length) * .7, 0, 1)); o.visible = q > 0; o.position.copy(o.userData.thuis); o.position.y += (1 - q) * 1.6; o.scale.setScalar(.6 + .4 * q);
    });
    else if (naam === 'steiger' || naam === 'bord') l.g.scale.set(1, Math.max(.0001, uit(p)), 1);   // groeit uit de grond
    else { const q = uit(p); l.g.scale.setScalar(Math.max(.0001, q)); }
  }
  let staat = { dak: false, zon: false, gevel: false, wp: false, laadpaal: false, steiger: false, bord: false, bank: false };
  const lopendPer = {};
  function naar(m, sleutel, doel, duur) {
    const wissel = sleutel === 'dak' || sleutel === 'gevel';
    const van = wissel ? (sleutel === 'dak' ? m.pDak : m.pGevel) : (m.groepen[sleutel]?.p ?? 0);
    if (lopendPer[sleutel]) lopend.delete(lopendPer[sleutel]);
    if (van === doel) return;
    lopendPer[sleutel] = anim(duur * Math.abs(doel - van), t => { const p = van + (doel - van) * (wissel ? inuit(t) : t); wissel ? zetWissel(m, sleutel, p) : zetLaag(m, sleutel, p); });
  }
  const DUUR = { dak: 1300, gevel: 1300, zon: 1500, wp: 600, laadpaal: 700, steiger: 1200, bord: 800, bank: 700 };
  function pasToe(m, s, meteen) {
    for (const k of Object.keys(DUUR)) {
      const doel = s[k] ? 1 : 0;
      if (meteen) { if (lopendPer[k]) lopend.delete(lopendPer[k]); (k === 'dak' || k === 'gevel') ? zetWissel(m, k, doel) : zetLaag(m, k, doel); }
      else naar(m, k, doel, DUUR[k]);
    }
    vuil = true;
  }

  async function toonType(type, s, eerste) {
    const m = await laad(type);
    if (model === m) return;
    const wissel = () => {
      if (model) model.wortel.visible = false;
      model = m; m.wortel.visible = true; richt(m); pasToe(m, s, true);
      baan.azDoel = 0; baan.polDoel = 0; baan.pol = 0; baan.az = rustig ? 0 : (eerste ? .95 : .5);        // het huis draait in beeld
      canvas.style.opacity = 1; vuil = true; wek();
    };
    if (!model || rustig) wissel(); else { canvas.style.opacity = 0; setTimeout(wissel, 190); }
  }

  // ── tekenen: alleen als er iets beweegt en de sectie in beeld is ──
  let bezig = false;
  function wek() { if (!bezig && zichtbaar) { bezig = true; vorigeTijd = performance.now(); requestAnimationFrame(tik); } }
  function tik(nu) {
    const dt = Math.min(50, nu - vorigeTijd); vorigeTijd = nu; let beweegt = false;
    for (const a of [...lopend]) { const t = klem((nu - a.t0) / a.duur, 0, 1); a.stap(t); if (t >= 1) { lopend.delete(a); a.klaar?.(); } beweegt = true; }
    const k = 1 - Math.pow(.0012, dt / 1000);
    for (const [w, d] of [['az', 'azDoel'], ['pol', 'polDoel'], ['mAz', 'muisAz'], ['mPol', 'muisPol']]) {
      const verschil = baan[d] - baan[w]; if (Math.abs(verschil) > .0004) { baan[w] += verschil * k; beweegt = true; } else baan[w] = baan[d];
    }
    if (model && (beweegt || vuil)) { zetCamera(); renderer.render(scene, camera); vuil = false; }
    if ((beweegt || vuil) && zichtbaar) requestAnimationFrame(tik); else bezig = false;
  }

  function maat() {
    const b = kader.clientWidth, h = kader.clientHeight; if (!b || !h) return;
    renderer.setSize(b, h, false); camera.aspect = b / h;
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(33.4 / 2)) / Math.max(camera.aspect, 1.1))) * 1.5;      // het canvas is ruimer dan het kader, zodat schaduw en lagen niet afgesneden worden
    camera.updateProjectionMatrix(); vuil = true; wek();
  }
  new ResizeObserver(maat).observe(kader);
  new IntersectionObserver(([e]) => { zichtbaar = e.isIntersecting; if (zichtbaar) { vuil = true; wek(); } }, { rootMargin: '120px' }).observe(kader);

  // ── slepen om te draaien; verticaal vegen op een aanraakscherm blijft scrollen ──
  let sleep = null;
  canvas.addEventListener('pointerdown', e => { sleep = { x: e.clientX, y: e.clientY, az: baan.azDoel, pol: baan.polDoel, id: e.pointerId }; canvas.setPointerCapture(e.pointerId); canvas.classList.add('is-vast'); baan.muisAz = baan.muisPol = 0; });
  canvas.addEventListener('pointermove', e => {
    if (!sleep) return;
    baan.azDoel = sleep.az - (e.clientX - sleep.x) / kader.clientWidth * 3.6;
    if (e.pointerType !== 'touch') baan.polDoel = klem(sleep.pol - (e.clientY - sleep.y) / kader.clientHeight * 1.2, -.42, .22);
    kader.dispatchEvent(new CustomEvent('nest-gedraaid')); wek();
  });
  const los = () => { sleep = null; canvas.classList.remove('is-vast'); };
  canvas.addEventListener('pointerup', los); canvas.addEventListener('pointercancel', los);

  (kader.querySelector('[data-nk-kantel]') || kader).append(canvas);
  maat();

  return {
    canvas,
    async zet(type, s, eerste = false) {
      staat = { ...s };
      if (!model || model.type !== type) await toonType(type, staat, eerste);
      else pasToe(model, staat, false);
      wek();
    },
    muis(x, y) { if (sleep || rustig) return; baan.muisAz = -x * .09; baan.muisPol = -y * .035; wek(); },
    vooraf(types) { types.forEach(t => laad(t).catch(() => {})); }
  };
}
