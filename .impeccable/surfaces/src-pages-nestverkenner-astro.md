---
version: 1
slug: "src-pages-nestverkenner-astro"
primary_target: "src/pages/nestverkenner.astro"
related_targets: []
---

# NEST-verkenner — built surface brief

## Scope and mode
`src/pages/nestverkenner.astro` and `public/calculator/`. **Operate:** help a Flemish homeowner compare a new combination of solar panels, storage, replacement of an electric resistance boiler and roof insulation. The baseline excludes existing PV or batteries. Preserve the established paper, Archivo, General Sans and orange identity.

## Job and composition
Turn the visitor's own annual consumption, production and tariffs into an inspectable energy balance. Grouped inputs occupy the left column; a tabbed ledger with a reactive isometric SVG occupies the right. Measure choices update the house and relevant fields. The ledger names direct solar, battery discharge, grid import, injection and storage losses; a transform-based strip shows the supply shares. Below 900px, form and result stack; below 350px, fields become single-column. Stickiness is removed on short desktop viewports. Ordinary scrolling and reduced-motion alternatives remain intact.

## Honest states and useful continuation
Required household inputs start empty. Three explicit consumption shortcuts offer low/standard/high reference categories. They fill missing tariff/PV configuration/storage fields with labelled scenario values, preserving existing values. A field-level origin set updates after manual edits and carries into contact/print. Panel count and an optional total plan budget stay visible; personal and technical inputs, itemised quotes and sources use native disclosures. A Zonnekaart/PVGIS production value can override the rough count × Wp × yield estimate. `PlanHouse.astro` uses layered architectural SVG material and up to twelve illustrative panel tiles while text retains the exact chosen count. Boiler selection opens its settings. Mobile measure rows omit secondary copy. Either a total budget or itemised amounts support simple payback. A theoretical zero-grid result is never presented as real independence or a valid payback; its numerical savings are labelled as non-predictive. Unknown roof effects also prevent whole-plan payback; negative outcomes remain visible. No invented price bands, hourly simulation, EPC prediction or off-grid guarantee.

Successful submission focuses the result. Invalid quote values open the collapsed quote section before focus moves to the field. The method, exclusions and sources accompany the calculation. Printing retains the scenario summary and source links. “Bespreek dit plan” explicitly stores only a summary in `sessionStorage` and takes it to contact; there is no automatic enquiry or personal-data persistence. The existing contact flow remains an email draft.

## Evidence and boundaries
The operating contract and technical evidence are in `RESEARCH-NEST-VERKENNER.md`. The model omits fixed costs, capacity tariffs, grants, maintenance, replacement, financing and future prices. Any extra space heating caused by a boiler taking heat from heated indoor air is also excluded and disclosed with the input/result/summary. Installation context needs individual advice.

Detector evidence is `.impeccable/review/verkenner/detector.json`: it ran once; the width animation was changed to transforms. Palette, typography and radius advisories do not supersede the approved identity. Final finish review is being resolved separately; this brief does not pre-empt its verdict. No new assets or visual-world exploration were needed.
