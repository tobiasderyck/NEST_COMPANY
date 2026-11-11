import test from "node:test";
import assert from "node:assert/strict";
import { bereken, panelenVoor } from "../public/verkenner/rekenmodel.mjs";

const ongeveer = (a, b, marge) => assert.ok(Math.abs(a - b) <= marge, `${a} ligt niet binnen ${marge} van ${b}`);

test("rekenvoorbeeld uit het onderzoek: 3.500 kWh, ±4 kWp zuid ≈ €476 per jaar", () => {
  const r = bereken({ verbruik: "doorsnee", dak: "zuid", panelen: 9 });
  ongeveer(r.midden.euro.zon, 476, 15);
  ongeveer(r.productie, 4136, 60);
});

test("scenario's staan altijd in volgorde laag ≤ midden ≤ hoog", () => {
  for (const verbruik of ["laag", "doorsnee", "hoog"]) for (const batterij of [false, true]) for (const boiler of [false, true]) {
    const r = bereken({ verbruik, batterij, boiler });
    assert.ok(r.laag.totaal <= r.midden.totaal && r.midden.totaal <= r.hoog.totaal);
  }
});

test("een batterij zonder zonnepanelen levert geen besparing op", () => {
  assert.equal(bereken({ zon: false, batterij: true }).midden.totaal, 0);
});

test("batterij-ontlading kan nooit meer zijn dan het overschot of de resterende vraag", () => {
  for (const verbruik of ["laag", "doorsnee", "hoog"]) {
    const r = bereken({ verbruik, batterij: true });
    for (const s of [r.laag, r.midden, r.hoog]) {
      assert.ok(s.ontlading <= s.injectie + 1e-9);
      assert.ok(s.direct + s.ontlading <= s.V + 1e-9);
    }
  }
});

test("aangeraden aantal panelen dekt ongeveer het verbruik", () => {
  assert.equal(panelenVoor(3500, "zuid"), 8);
  assert.equal(panelenVoor(1200), 4);
});
