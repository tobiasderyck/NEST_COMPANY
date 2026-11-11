// NEST-verkenner — rekenmodel.
// Elke waarde komt uit RESEARCH-VERKENNER-2026-10.md (gecontroleerd 30-10-2026).
// Drie scenario's, nooit alle "lage" waarden door elkaar: pessimistisch, midden, optimistisch.

export const BRON_DATUM = "oktober 2026";

// Verbruikscategorieën van de Vlaamse Nutsregulator (kWh per jaar).
export const VERBRUIK = { laag: 1200, doorsnee: 3500, hoog: 7500 };

// Modern full-black paneel. Aanname, geen meting: courant aanbod 2026 ligt rond 430–450 Wp.
export const WP_PER_PANEEL = 440;

// PVGIS v5.3, Machelen, 14% systeemverlies (kWh per kWp per jaar). [laag, midden, hoog]
export const OPBRENGST = {
  zuid: [1017, 1034, 1051],
  oostwest: [849, 860, 872],
  plat: [927, 940, 954],
  onbekend: [950, 973, 997] // tussen zuidwest (laag) en zuidoost (hoog)
};

// Vermijdbare afnameprijs en injectievergoeding (€/kWh incl. btw).
const PRIJS_AFNAME = [0.27, 0.32, 0.38];
const PRIJS_INJECTIE = [0.01, 0.04, 0.07];
// Zelfverbruik zonder batterij hangt af van wie overdag thuis is (Energent: ±15%).
const PROFIEL = [0.85, 1, 1.15];
// Warmtepompboiler: 3 tot 4 keer zuiniger (Vlaanderen.be); 2,5 als voorzichtige ondergrens.
const BOILER_FACTOR = [2.5, 3, 3.5];
// Lagere maandpiek door de batterij: 0 / 0,5 / 1,5 kW × 59,41 €/kW (Fluvius Halle-Vilvoorde 2026).
const CAPACITEIT = [0, 0.5 * 59.41, 1.5 * 59.41];
// Rondgangsrendement van een thuisbatterij (HTW 84%, praktijk tot 90%).
const RENDEMENT = [0.84, 0.87, 0.9];

// HTW Berlin, zelfverbruiksaandeel zonder batterij in functie van r = productie / verbruik.
const HTW_R = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 6];
const HTW_ZV = [0.80, 0.655, 0.47, 0.368, 0.302, 0.257, 0.224, 0.178, 0.128, 0.068];

// HTW, extra autarkie door een batterij (aandeel van het verbruik), bij bruikbare kWh per MWh verbruik.
// Rijen r = 0,5 / 1,0 / 1,5; kolommen 0 / 1,43 / 2,86 / 4,29 kWh per MWh (5, 10, 15 kWh bij 3.500 kWh).
const BAT_R = [0.5, 1, 1.5];
const BAT_C = [0, 1.43, 2.86, 4.29];
const BAT_DA = [
  [0, 0.208, 0.221, 0.223],
  [0, 0.312, 0.373, 0.387],
  [0, 0.337, 0.412, 0.431]
];

const tussen = (xs, ys, x) => {
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) if (x <= xs[i]) {
    const t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
    return ys[i - 1] + t * (ys[i] - ys[i - 1]);
  }
  return ys[ys.length - 1];
};

function batterijHTW(r, c) {
  const rij = BAT_R.map((_, i) => tussen(BAT_C, BAT_DA[i], c));
  return tussen(BAT_R, rij, Math.min(r, 1.5)); // boven r = 1,5 wint een batterij nauwelijks nog
}

// Energent 2024, Vlaamse meetformule: extra zelfverbruik in kWh per jaar, C = nominale kWh.
function batterijEnergent(C, P, V) {
  const x = Math.log(Math.max(P * V / 1000, 1));
  return Math.max(0, (376 - 107 * Math.log(C)) * C * (-(0.18 * C + 0.483) + (0.0198 * C + 0.163) * x));
}

// Batterijgrootte die NEST als vertrekpunt neemt: HTW raadt max. 1,5 kWh bruikbaar per MWh aan.
export const batterijVoor = V => (V >= 5000 ? 10 : 5);

// Aantal panelen dat ongeveer je jaarverbruik dekt (r ≈ 1).
export function panelenVoor(V, dak = "onbekend") {
  const kWp = V / OPBRENGST[dak][1];
  return Math.min(30, Math.max(4, Math.round(kWp * 1000 / WP_PER_PANEEL)));
}

// Aandeel van het stroomverbruik dat de elektrische boiler vraagt. Aanname: een derde,
// begrensd op het EU-tapprofiel M (2.133 kWh), wat volstaat voor een gezin van vier.
const boilerVerbruik = V => Math.min(2133, V / 3);

export function bereken({ verbruik = "doorsnee", zon = true, batterij = false, boiler = false, panelen, dak = "onbekend" }) {
  const V0 = VERBRUIK[verbruik] ?? VERBRUIK.doorsnee;
  const n = zon ? (panelen ?? panelenVoor(V0, dak)) : 0;
  const kWp = n * WP_PER_PANEEL / 1000;
  const Cnom = batterij ? batterijVoor(V0) : 0;

  const scenario = i => {
    const pa = PRIJS_AFNAME[i], pi = PRIJS_INJECTIE[i];
    let boilerKwh = 0;
    if (boiler) boilerKwh = boilerVerbruik(V0) * (1 - 1 / BOILER_FACTOR[i]);
    const V = V0 - boilerKwh;
    const P = kWp * OPBRENGST[dak][i];
    let direct = 0, injectie = 0, ontlading = 0;
    if (P > 0) {
      const r = P / V;
      direct = Math.min(tussen(HTW_R, HTW_ZV, r) * PROFIEL[i] * P, V);
      injectie = P - direct;
      if (Cnom) {
        const htw = batterijHTW(r, (Cnom * 0.9) / (V / 1000)) * V;
        const energent = batterijEnergent(Cnom, P, V);
        const kwh = i === 0 ? htw : i === 2 ? Math.max(htw, energent) : (htw + energent) / 2;
        ontlading = Math.max(0, Math.min(kwh, V - direct, injectie * RENDEMENT[i]));
      }
    }
    const lading = ontlading / RENDEMENT[i];
    const euro = {
      boiler: boilerKwh * pa,
      zon: direct * pa + injectie * pi,
      batterij: Cnom ? ontlading * pa - lading * pi + (P > 0 ? CAPACITEIT[i] : 0) : 0
    };
    const totaal = euro.boiler + euro.zon + euro.batterij;
    return { V, P, direct, injectie, ontlading, euro, totaal, kost: V0 * pa };
  };

  const [laag, midden, hoog] = [0, 1, 2].map(scenario);
  return {
    verbruik: V0, panelen: n, kWp, batterijKwh: Cnom,
    productie: Math.round(midden.P),
    laag, midden, hoog,
    // aandeel van het verbruiksdeel van de stroomfactuur, midden
    aandeel: midden.kost ? midden.totaal / midden.kost : 0
  };
}

export const rond = (x, stap = 10) => Math.round(x / stap) * stap;
