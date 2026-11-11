// NEST-verkenner: drie vragen, een live uitkomst, en een aanvraag die met het plan naar NEST gaat.
import { bereken, panelenVoor, rond, VERBRUIK } from "./rekenmodel.mjs";

const $ = (s, el = document) => el.querySelector(s);
const vragen = $("#vk-vragen");
const aanvraag = $("#vk-aanvraag");
const euro = x => "€ " + Math.max(0, rond(x)).toLocaleString("nl-BE");
const kwh = x => Math.round(x).toLocaleString("nl-BE") + " kWh";

let panelen = null;          // null = volg het advies
let laatste = null;

function invoer() {
  const f = new FormData(vragen);
  return {
    verbruik: f.get("verbruik"), dak: f.get("dak"),
    zon: f.has("zon"), batterij: f.has("batterij"), boiler: f.has("boiler"),
    ook: f.getAll("ook")
  };
}

function toon() {
  const i = invoer();
  const advies = panelenVoor(VERBRUIK[i.verbruik], i.dak);
  const n = panelen ?? advies;
  const r = bereken({ ...i, panelen: n });
  laatste = { i, r, n, advies };

  $("[data-zonvraag]").hidden = !i.zon;
  $("[data-panelen]").textContent = n;
  $("[data-advies]").textContent = n === advies
    ? `Dekt ongeveer je jaarverbruik. ${r.productie.toLocaleString("nl-BE")} kWh per jaar.`
    : `Aangeraden voor jouw verbruik: ${advies}. Nu ${r.productie.toLocaleString("nl-BE")} kWh per jaar.`;
  $("[data-min]").disabled = n <= 1;
  $("[data-plus]").disabled = n >= 40;

  const { laag, midden, hoog } = r;
  $("[data-hoog]").textContent = euro(hoog.totaal);
  $("[data-balk-bedrag]").textContent = euro(hoog.totaal);
  $("[data-bereik]").textContent = hoog.totaal > 0
    ? `Meest waarschijnlijk ± ${euro(midden.totaal)}. Bij een ongunstig contract en een minder goed dak ${euro(laag.totaal)}.`
    : "Kies minstens zonnepanelen of een warmtepompboiler.";
  const max = Math.max(hoog.totaal, 1);
  $("[data-meter-laag]").style.width = (laag.totaal / max * 100) + "%";
  $("[data-meter-midden]").style.width = ((midden.totaal - laag.totaal) / max * 100) + "%";
  $("[data-meter-hoog]").style.width = ((hoog.totaal - midden.totaal) / max * 100) + "%";

  const regels = [];
  if (i.zon) regels.push([`${n} zonnepanelen`, midden.euro.zon, `${kwh(midden.direct)} meteen zelf gebruikt, de rest teruggeleverd`]);
  if (i.batterij) regels.push([`Thuisbatterij ${r.batterijKwh} kWh`, midden.euro.batterij, i.zon ? `${kwh(midden.ontlading)} zonnestroom voor 's avonds` : "Alleen zinvol met zonnepanelen"]);
  if (i.boiler) regels.push(["Warmtepompboiler", midden.euro.boiler, `${kwh(r.verbruik - midden.V)} minder stroom voor warm water`]);
  $("[data-regels]").innerHTML = regels.map(([wat, b, uitleg]) =>
    `<div><dt>${wat}<small>${uitleg}</small></dt><dd>± ${euro(b)}</dd></div>`).join("");
  $("[data-aandeel]").textContent = midden.totaal > 0
    ? `Dat is ongeveer ${Math.round(r.aandeel * 100)}% minder op het verbruiksdeel van je stroomfactuur.`
    : "";

  // het huisje tekent mee
  const huis = $(".plan-house");
  if (huis) {
    huis.querySelectorAll(".panel-tile").forEach((t, k) => t.toggleAttribute("hidden", !i.zon || k >= Math.min(n, 12)));
    huis.querySelector("[data-house-battery]")?.toggleAttribute("hidden", !i.batterij);
    huis.querySelector("[data-house-boiler]")?.toggleAttribute("hidden", !i.boiler);
    const dak = i.ook.includes("Dakwerken") || i.ook.includes("Dakisolatie");
    huis.querySelector("[data-house-roof-note]")?.toggleAttribute("hidden", !dak);
    huis.classList.toggle("has-roof", dak);
    const teller = huis.querySelector("[data-house-count]");
    if (teller) teller.textContent = i.zon ? `${n} PANELEN` : "GEEN PANELEN";
  }

  // meer halen uit het plan: alleen wat we echt kunnen berekenen
  const extra = [];
  const verschil = wijziging => bereken({ ...i, panelen: n, ...wijziging }).midden.totaal - midden.totaal;
  if (!i.zon) extra.push(["zon", "Zonnepanelen", verschil({ zon: true, panelen: undefined })]);
  if (!i.batterij && i.zon) extra.push(["batterij", "Thuisbatterij", verschil({ batterij: true })]);
  if (!i.boiler) extra.push(["boiler", "Warmtepompboiler", verschil({ boiler: true })]);
  const erbij = $("[data-erbij]");
  erbij.hidden = !extra.length;
  $("[data-erbij-knoppen]").innerHTML = extra.map(([naam, label, b]) =>
    `<button type="button" data-voeg="${naam}"><span>+ ${label}</span><strong>+ ${euro(b)} <small>per jaar</small></strong></button>`).join("");
  const ookplan = $("[data-ookplan]");
  ookplan.hidden = !i.ook.length;
  ookplan.textContent = i.ook.length ? `Ook op je plan: ${i.ook.join(", ").toLowerCase()}. Wat dat oplevert en kost, bekijken we samen bij het bezoek.` : "";

  const melding = $("[data-melding]");
  melding.hidden = !(i.batterij && !i.zon);
  melding.textContent = "Een thuisbatterij bespaart vooral als ze zonnestroom kan opslaan. Zonder zonnepanelen rekenen we geen besparing.";

  try { sessionStorage.setItem("nest-verkenner", JSON.stringify({ ...i, panelen })); } catch {}
}

function samenvatting() {
  const { i, r, n } = laatste;
  const lijn = [];
  lijn.push(`Verbruik: ${i.verbruik} (±${VERBRUIK[i.verbruik].toLocaleString("nl-BE")} kWh/jaar)`);
  lijn.push(`Wil combineren: ${[i.zon && "zonnepanelen", i.batterij && "thuisbatterij", i.boiler && "warmtepompboiler"].filter(Boolean).join(", ") || "niets aangeduid"}`);
  if (i.ook.length) lijn.push(`Ook interesse in: ${i.ook.join(", ").toLowerCase()}`);
  if (i.zon) lijn.push(`Zonnepanelen: ${n} stuks (${r.kWp.toFixed(1).replace(".", ",")} kWp), dak: ${{ zuid: "zuid", oostwest: "oost of west", plat: "plat dak", onbekend: "weet het niet" }[i.dak]}`);
  if (i.batterij) lijn.push(`Batterij als vertrekpunt: ${r.batterijKwh} kWh`);
  lijn.push(`Getoonde besparing: tot ${euro(r.hoog.totaal)} per jaar, meest waarschijnlijk ± ${euro(r.midden.totaal)}, laag ${euro(r.laag.totaal)}`);
  return lijn.join("\n");
}

vragen.addEventListener("change", e => {
  if (e.target.name === "verbruik" || e.target.name === "dak") panelen = null;
  toon();
});
$("[data-erbij-knoppen]").addEventListener("click", e => {
  const knop = e.target.closest("[data-voeg]"); if (!knop) return;
  vragen.elements[knop.dataset.voeg].checked = true; toon();
});
$("[data-min]").addEventListener("click", () => { panelen = Math.max(1, (panelen ?? laatste.advies) - 1); toon(); });
$("[data-plus]").addEventListener("click", () => { panelen = Math.min(40, (panelen ?? laatste.advies) + 1); toon(); });

// eerder ingevuld in deze sessie? dan staat het er nog
try {
  const oud = JSON.parse(sessionStorage.getItem("nest-verkenner") || "null");
  if (oud) {
    for (const [k, v] of Object.entries(oud)) {
      if (k === "ook") for (const w of v) { const el = vragen.querySelector(`[name="ook"][value="${w}"]`); if (el) el.checked = true; }
      else if (typeof v === "boolean") { const el = vragen.elements[k]; if (el) el.checked = v; }
      else if (k === "panelen") panelen = v;
      else if (v) { const el = vragen.querySelector(`[name="${k}"][value="${v}"]`); if (el) el.checked = true; }
    }
  }
} catch {}
toon();

// ── aanvraag ──────────────────────────────────────────────
$("[data-bespreek]").addEventListener("click", () => {
  aanvraag.hidden = false;
  aanvraag.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  setTimeout(() => $("#vk-naam").focus({ preventScroll: true }), 350);
});

aanvraag.addEventListener("submit", async e => {
  e.preventDefault();
  const status = $("[data-status]");
  const f = new FormData(aanvraag);
  const leeg = ["naam", "telefoon", "gemeente"].filter(k => !String(f.get(k) || "").trim());
  aanvraag.querySelectorAll("[required]").forEach(el => el.setAttribute("aria-invalid", leeg.includes(el.name) ? "true" : "false"));
  if (leeg.length) { status.textContent = "Vul je naam, telefoonnummer en gemeente in."; aanvraag.elements[leeg[0]].focus(); return; }
  if (f.get("botcheck")) return;

  const plan = samenvatting();
  const bericht = [
    `Naam: ${f.get("naam")}`, `Telefoon: ${f.get("telefoon")}`, `Gemeente: ${f.get("gemeente")}`,
    `E-mail: ${f.get("email") || "niet opgegeven"}`, `Beste moment om te bellen: ${f.get("moment")}`, "", "Plan uit de NEST-verkenner:", plan
  ].join("\n");
  const sleutel = aanvraag.dataset.sleutel;
  const knop = aanvraag.querySelector("button[type=submit]");

  if (!sleutel) {
    // Nog geen formulierdienst gekoppeld: open een volledig ingevulde mail naar NEST.
    location.href = `mailto:${aanvraag.dataset.ontvanger}?subject=${encodeURIComponent(aanvraag.dataset.onderwerp)}&body=${encodeURIComponent(bericht)}`;
    status.textContent = "Je e-mailprogramma opent met je plan erin. Je aanvraag is verstuurd zodra je daar op verzenden klikt.";
    return;
  }
  knop.disabled = true; status.textContent = "Even versturen…";
  try {
    const antwoord = await fetch("https://api.web3forms.com/submit", {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: sleutel, subject: `${aanvraag.dataset.onderwerp}: ${f.get("naam")}, ${f.get("gemeente")}`,
        from_name: "NEST-verkenner", replyto: f.get("email") || undefined,
        naam: f.get("naam"), telefoon: f.get("telefoon"), gemeente: f.get("gemeente"), email: f.get("email"),
        moment: f.get("moment"), plan, message: bericht, botcheck: false
      })
    }).then(x => x.json());
    if (!antwoord.success) throw new Error(antwoord.message);
    aanvraag.hidden = true;
    const bedankt = $("[data-bedankt]");
    $("[data-bedankt-naam]").textContent = String(f.get("naam")).trim().split(" ")[0];
    $("[data-bedankt-tel]").textContent = f.get("telefoon");
    bedankt.hidden = false; bedankt.focus();
  } catch {
    knop.disabled = false;
    status.innerHTML = `Versturen lukte niet. Probeer opnieuw, of bel ons op <a href="tel:+32492864202">0492 86 42 02</a>.`;
  }
});

// ── off-grid: het huis koppelt los zodra je het ziet ──
const og = $("[data-offgrid]");
if (og) {
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(([x]) => { if (x.isIntersecting) { og.classList.add("is-los"); io.disconnect(); } }, { threshold: 0.45 });
    io.observe(og);
  } else og.classList.add("is-los");
  $("[data-offgrid-knop]").addEventListener("click", () => {
    const vak = vragen.querySelector('[name="ook"][value="Off-grid"]');
    if (vak) vak.checked = true;
    toon();
    $("[data-bespreek]").click();
  });
}

// ── mobiele balk: het bedrag blijft zichtbaar tot je bij de uitkomst bent ──
const balk = $("[data-balk]");
const bon = $(".vk-bon");
if (balk && "IntersectionObserver" in window) {
  new IntersectionObserver(([x]) => balk.classList.toggle("is-weg", x.isIntersecting || x.boundingClientRect.top < 0), { threshold: 0 }).observe(bon);
}
